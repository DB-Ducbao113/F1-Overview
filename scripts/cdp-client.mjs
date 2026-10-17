/**
 * Minimal Chrome DevTools Protocol (CDP) client over a raw WebSocket.
 *
 * Implements just enough WebSocket framing (client-to-server masking,
 * text frames) to speak CDP over Node's built-in `net` module. No external
 * dependencies (no `ws`, no Puppeteer, no Playwright).
 *
 * Usage:
 *   const cdp = await CdpClient.connect(wsUrl);
 *   const res = await cdp.send('Page.enable');
 *   cdp.on('Page.loadEventFired', (params) => { ... });
 *   await cdp.close();
 */

import * as net from 'net';

const OPCODE_TEXT = 0x1;
const OPCODE_CLOSE = 0x8;
const OPCODE_PING = 0x9;
const OPCODE_PONG = 0xA;

/** Mask a payload buffer with a 4-byte masking key (client->server required). */
function mask(payload, key) {
  const out = Buffer.alloc(payload.length);
  for (let i = 0; i < payload.length; i += 1) {
    out[i] = payload[i] ^ key[i % 4];
  }
  return out;
}

/** Build a text WebSocket frame (masked, no fragmentation). */
function frameText(text) {
  const payload = Buffer.from(text, 'utf8');
  const key = crypto.getRandomValues(new Uint8Array(4));
  const masked = mask(payload, key);
  const firstByte = 0x80 | OPCODE_TEXT; // FIN + text
  const secondByte = 0x80 | payload.length; // mask + length
  return Buffer.concat([Buffer.from([firstByte, secondByte]), key, masked]);
}

function parseFrames(buffer, state) {
  const events = [];
  let buf = state.buffer ? Buffer.concat([state.buffer, buffer]) : buffer;
  let pos = 0;
  while (pos + 2 <= buf.length) {
    const b0 = buf[pos];
    const b1 = buf[pos + 1];
    const fin = (b0 & 0x80) !== 0;
    const opcode = b0 & 0x0f;
    const masked = (b1 & 0x80) !== 0;
    let len = b1 & 0x7f;
    let ext = 0;
    if (len === 126) {
      if (pos + 4 > buf.length) break;
      len = buf.readUInt16BE(pos + 2);
      ext = 2;
    } else if (len === 127) {
      if (pos + 10 > buf.length) break;
      len = Number(buf.readBigUInt64BE(pos + 2));
      ext = 8;
    }
    let maskKey = null;
    if (masked) {
      if (pos + 4 + ext > buf.length) break;
      maskKey = buf.subarray(pos + 2 + ext, pos + 2 + ext + 4);
    }
    const payloadStart = pos + 2 + ext + (masked ? 4 : 0);
    if (payloadStart + len > buf.length) break;
    let payload = buf.subarray(payloadStart, payloadStart + len);
    if (masked && maskKey) {
      payload = mask(payload, maskKey);
    }
    if (opcode === OPCODE_TEXT) {
      events.push({ type: 'text', data: payload.toString('utf8'), fin });
    } else if (opcode === OPCODE_PING) {
      events.push({ type: 'ping', data: payload });
    } else if (opcode === OPCODE_PONG) {
      events.push({ type: 'pong', data: payload });
    } else if (opcode === OPCODE_CLOSE) {
      events.push({ type: 'close', data: payload });
    }
    pos = payloadStart + len;
  }
  state.buffer = pos < buf.length ? buf.subarray(pos) : null;
  return events;
}

export class CdpClient {
  constructor(socket) {
    this.socket = socket;
    this.state = { buffer: null };
    this.nextId = 1;
    this.pending = new Map(); // id -> { resolve, reject }
    this.handlers = new Map(); // method -> [callbacks]
    this.connected = false;
    this.closed = false;

    socket.on('data', (chunk) => {
      for (const ev of parseFrames(chunk, this.state)) {
        if (ev.type === 'text') this._handleText(ev.data);
        else if (ev.type === 'pong') { /* ignore */ }
        else if (ev.type === 'close') this.close();
      }
    });
    socket.on('error', (err) => {
      this._failAll(err);
      this.closed = true;
    });
    socket.on('close', () => {
      this.closed = true;
      this._failAll(new Error('socket closed'));
    });
    socket.on('end', () => {
      this.closed = true;
    });
  }

  static async connect(url, timeoutMs = 10000) {
    const u = new URL(url);
    return new Promise((resolve, reject) => {
      const socket = net.connect({ host: u.hostname, port: Number(u.port) });
      let settled = false;
      const timer = setTimeout(() => {
        if (!settled) { settled = true; socket.destroy(); reject(new Error('CDP connect timeout')); }
      }, timeoutMs);
      socket.once('connect', () => {
        // Send HTTP upgrade handshake
        const key = crypto.getRandomValues(new Uint8Array(16)).toString('base64');
        const req = [
          `GET ${u.pathname}${u.search ? '?' + u.search : ''} HTTP/1.1`,
          `Host: ${u.host}`,
          'Upgrade: websocket',
          'Connection: Upgrade',
          `Sec-WebSocket-Key: ${key}`,
          'Sec-WebSocket-Version: 13',
          '',
          '',
        ].join('\r\n');
        socket.write(req);
        socket.once('data', (chunk) => {
          const text = chunk.toString('utf8');
          const headEnd = text.indexOf('\r\n\r\n');
          if (headEnd === -1) { socket.destroy(); reject(new Error('no handshake end')); return; }
          const headers = text.slice(0, headEnd);
          const upgrade = headers.match(/Sec-WebSocket-Accept: (.+)/i);
          if (!upgrade) { socket.destroy(); reject(new Error('no accept header')); return; }
          // The rest after \r\n\r\n may already contain a frame
          const rest = chunk.subarray(headEnd + 4);
          const client = new CdpClient(socket);
          if (rest.length > 0) {
            for (const ev of parseFrames(rest, client.state)) {
              if (ev.type === 'text') client._handleText(ev.data);
            }
          }
          client.connected = true;
          settled = true;
          clearTimeout(timer);
          resolve(client);
        });
        socket.once('error', (err) => {
          if (!settled) { settled = true; clearTimeout(timer); reject(err); }
        });
      });
    });
  }

  _handleText(text) {
    let msg;
    try { msg = JSON.parse(text); } catch { return; }
    if (msg.id !== undefined) {
      const p = this.pending.get(msg.id);
      if (p) {
        this.pending.delete(msg.id);
        if (msg.error) p.reject(new Error(`CDP ${msg.method}: ${msg.error.message}`));
        else p.resolve(msg.result);
      }
      return;
    }
    if (msg.method) {
      const cbs = this.handlers.get(msg.method) || [];
      for (const cb of cbs) cb(msg.params);
      // Auto-respond to certain CDP-required messages if needed
    }
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      if (this.closed) { reject(new Error('CDP client closed')); return; }
      const id = this.nextId += 1;
      this.pending.set(id, { resolve, reject });
      const payload = JSON.stringify({ id, method, params });
      this.socket.write(frameText(payload));
    });
  }

  on(method, cb) {
    if (!this.handlers.has(method)) this.handlers.set(method, []);
    this.handlers.get(method).push(cb);
    return () => {
      const cbs = this.handlers.get(method);
      if (cbs) { const i = cbs.indexOf(cb); if (i >= 0) cbs.splice(i, 1); }
    };
  }

  _failAll(err) {
    for (const p of this.pending.values()) p.reject(err);
    this.pending.clear();
  }

  async close() {
    if (this.closed) return;
    this.closed = true;
    try {
      this.socket.write(frameText(''));
      // Close frame: opcode 0x8
      const firstByte = 0x80 | OPCODE_CLOSE;
      const secondByte = 0x00; // no mask (server frame), length 0
      this.socket.write(Buffer.from([firstByte, secondByte]));
    } catch { /* ignore */ }
    this.socket.destroy();
    this._failAll(new Error('client closed'));
  }
}
