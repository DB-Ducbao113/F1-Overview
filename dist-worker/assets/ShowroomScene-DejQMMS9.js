import { r as v, j as d, R as w0 } from './vendor-react-B62-MmwA.js';
import {
  a as G0,
  S as O0,
  M as a0,
  G as g0,
  b as U0,
  c as R0,
  L as V0,
  d as Z0,
  P as Y0,
  B as $0,
  e as C0,
  C as o0,
  f as n0,
  g as f0,
  h as d0,
  H as _0,
  i as s0,
  j as K0,
  k as l0,
  l as U,
  T as z0,
  V as H0,
  m as B0,
  O as X0,
  n as Q,
  o as q0,
  p as Q0,
  q as J0,
} from './vendor-three-fGAZCfVW.js';
import {
  F as x0,
  g as F0,
  a as ee,
  b as le,
  C as k0,
  c as ae,
  d as ie,
  e as S0,
  f as re,
  S as oe,
} from './ShowroomView-8pkChlo0.js';
import { T as _ } from './index-C6VPy6l3.js';
import './vendor-core-ckwbz45p.js';
import './2026-CZ0b0NTE.js';
import './ConstructorLogo-BPzo8jEn.js';
import './vendor-icons-Brb4Fsqu.js';
const ne = {},
  E0 = typeof import.meta < 'u' && ne && !0,
  se = '/models/c42.v2.glb',
  M0 = {
    5120: Int8Array,
    5121: Uint8Array,
    5122: Int16Array,
    5123: Uint16Array,
    5125: Uint32Array,
    5126: Float32Array,
  },
  v0 = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4, MAT2: 4, MAT3: 9, MAT4: 16 };
function te(l) {
  const r = new a0();
  l.name && (r.name = l.name);
  const a = l.pbrMetallicRoughness;
  return (
    a &&
      (typeof a.roughnessFactor == 'number' && (r.roughness = a.roughnessFactor),
      typeof a.metallicFactor == 'number' && (r.metalness = a.metallicFactor),
      a.baseColorFactor &&
        r.color.setRGB(a.baseColorFactor[0], a.baseColorFactor[1], a.baseColorFactor[2])),
    l.emissiveFactor &&
      r.emissive.setRGB(l.emissiveFactor[0], l.emissiveFactor[1], l.emissiveFactor[2]),
    r
  );
}
function fe(l, r) {
  const a = new O0();
  l.scene.name && (a.name = l.scene.name);
  const e = l.materials.map(te),
    o = new Map(),
    f = new Map(),
    i = (n) => {
      const s = new $0(),
        p = n.attributes;
      for (const m of Object.keys(p)) {
        const g = p[m],
          t = l.accessors[g];
        if (!t) continue;
        const u = r[t.bufferView];
        if (!u || u.byteLength === 0) continue;
        const T = M0[t.componentType];
        if (!T) continue;
        const b = v0[t.type] ?? 1,
          y = t.byteOffset ?? 0,
          c = new T(u, y, t.count * b),
          C = new C0(c, b, t.normalized);
        s.setAttribute(m, C);
      }
      if (n.indices !== null) {
        const m = l.accessors[n.indices];
        if (m) {
          const g = r[m.bufferView];
          if (g && g.byteLength > 0) {
            const t = M0[m.componentType];
            if (t) {
              const u = v0[m.type] ?? 1,
                T = m.byteOffset ?? 0,
                b = new t(g, T, m.count * u);
              s.setIndex(new C0(b, u, m.normalized));
            }
          }
        }
      }
      return s;
    },
    h = (n) => {
      const s = l.meshes[n];
      if (!s) return new g0();
      const p = [];
      for (const g of s.primitives) {
        const t = `${g.indices}:${Object.entries(g.attributes)
          .map(([C, k]) => `${C}:${k}`)
          .sort()
          .join(';')}:${g.mode}`;
        let u = o.get(t);
        u || ((u = i(g)), o.set(t, u));
        const T = g.material ?? 0,
          b = e[T] ?? e[0] ?? new a0(),
          y = g.mode;
        let c;
        (y === 4 || y === void 0
          ? (c = new R0(u, b))
          : y === 5
            ? (c = new V0(u, b))
            : y === 6
              ? (c = new Z0(u, b))
              : y === 7
                ? (c = new Y0(u, b))
                : (c = new R0(u, b)),
          s.name && (c.name = s.name),
          p.push(c));
      }
      if (p.length === 1) return p[0];
      const m = new g0();
      s.name && (m.name = s.name);
      for (const g of p) m.add(g);
      return m;
    },
    S = (n) => {
      let s;
      if (
        (n.mesh !== void 0
          ? (f.has(n.mesh) || f.set(n.mesh, h(n.mesh)), (s = f.get(n.mesh)))
          : (s = new g0()),
        n.name && (s.name = n.name),
        n.matrix
          ? s.applyMatrix4(new U0().fromArray(n.matrix))
          : (n.position && s.position.fromArray(n.position),
            n.rotation && s.quaternion.fromArray(n.rotation),
            n.scale && s.scale.fromArray(n.scale)),
        n.children)
      )
        for (const p of n.children) s.add(S(p));
      return s;
    };
  for (const n of l.scene.children) a.add(S(n));
  return {
    scene: a,
    scenes: [a],
    animations: [],
    cameras: [],
    asset: {},
    parser: void 0,
    userData: {},
  };
}
function de(l = se) {
  const r = G0(l),
    [a, e] = v.useState(() => (r != null && r.scene ? r : null)),
    [, o] = v.useState(null),
    f = v.useRef(null),
    i = v.useRef(!1),
    h = v.useRef(!1),
    S = v.useRef(r);
  return (
    v.useEffect(() => {
      S.current = r;
    }, [r]),
    v.useEffect(() => {
      var t;
      if (h.current) return;
      h.current = !0;
      let n = !1,
        s = null;
      const p = () => {
        var u;
        n || ((u = S.current) != null && u.scene && e(S.current));
      };
      if (!E0 || typeof Worker > 'u') {
        (t = S.current) != null && t.scene && e(S.current);
        return;
      }
      i.current = !1;
      const m = Date.now(),
        g = setTimeout(() => {
          n || (s == null || s.terminate(), o(new Error('glTF worker timeout')), p());
        }, 2e4);
      try {
        s = new Worker(new URL('/assets/gltfMeshoptWorker-BfTCIVl5.js', import.meta.url), {
          type: 'module',
        });
      } catch {
        (clearTimeout(g), p());
        return;
      }
      return (
        (f.current = s),
        (s.onmessage = (u) => {
          const T = u.data ?? {},
            { id: b, type: y } = T;
          if (b === m) {
            if (y === 'ERROR') {
              if (n) return;
              (clearTimeout(g), o(new Error(T.error)), p());
              return;
            }
            if (y === 'RESULT') {
              if (n) return;
              clearTimeout(g);
              try {
                const c = fe(T.descriptor, T.buffers);
                e(c);
              } catch (c) {
                (o(c instanceof Error ? c : new Error(String(c))), p());
              }
            }
          }
        }),
        (s.onerror = () => {
          n || (clearTimeout(g), o(new Error('glTF worker error')), p());
        }),
        fetch(l)
          .then((u) => {
            if (n) throw new Error('glTF load cancelled');
            return u.arrayBuffer();
          })
          .then((u) => {
            n || s.postMessage({ type: 'LOAD', id: m, glb: u }, [u]);
          })
          .catch((u) => {
            n || (o(u), p());
          }),
        () => {
          ((n = !0),
            (i.current = !0),
            clearTimeout(g),
            s == null || s.terminate(),
            (f.current = null));
        }
      );
    }, [l]),
    a
  );
}
function z(l, r, a, e) {
  if (typeof document > 'u') {
    const h = new o0(null);
    return ((h.colorSpace = n0), (h.flipY = !1), (h.generateMipmaps = !0), h);
  }
  const o = document.createElement('canvas');
  ((o.width = l), (o.height = r));
  const f = o.getContext('2d', e);
  f &&
    ((f.imageSmoothingEnabled = !0),
    (f.imageSmoothingQuality = 'high'),
    f.save(),
    f.scale(0.5, 0.5),
    a(f, l * 2, r * 2),
    f.restore());
  const i = new o0(o);
  return (
    (i.anisotropy = 16),
    (i.generateMipmaps = !0),
    (i.flipY = !1),
    (i.colorSpace = n0),
    (i.magFilter = f0),
    (i.minFilter = d0),
    (i.needsUpdate = !0),
    i
  );
}
function X(l, r, a, e = '#101216', o = 0.14) {
  ((l.fillStyle = e), l.fillRect(0, 0, r, a));
  const f = document.createElement('canvas');
  ((f.width = 8), (f.height = 8));
  const i = f.getContext('2d');
  if (i) {
    ((i.fillStyle = `rgba(255, 255, 255, ${o * 0.65})`),
      i.fillRect(0, 0, 4, 4),
      i.fillRect(4, 4, 4, 4),
      (i.fillStyle = `rgba(0, 0, 0, ${o * 1.4})`),
      i.fillRect(4, 0, 4, 4),
      i.fillRect(0, 4, 4, 4));
    const h = l.createPattern(f, 'repeat');
    h && ((l.fillStyle = h), l.fillRect(0, 0, r, a));
  }
}
function L0(l, r, a, e) {
  (l.save(),
    l.translate(r, a),
    (l.fillStyle = '#0096d6'),
    l.beginPath(),
    l.arc(0, 0, e * 0.5, 0, Math.PI * 2),
    l.fill(),
    (l.font = `italic 900 ${Math.round(e * 0.62)}px "Arial Black", "Helvetica", sans-serif`),
    (l.fillStyle = '#ffffff'),
    (l.textAlign = 'center'),
    (l.textBaseline = 'middle'),
    l.fillText('hp', 0, -e * 0.02),
    l.restore());
}
function O(l, r, a, e, o) {
  (l.save(), l.translate(r, a));
  const f = o || '#e2e8f0';
  ((l.strokeStyle = f),
    (l.lineWidth = Math.max(3, e * 0.1)),
    l.beginPath(),
    l.arc(0, 0, e, 0, Math.PI * 2),
    l.stroke());
  const i = e * 0.16,
    h = e * 0.95;
  for (let S = 0; S < 3; S++) {
    const n = -Math.PI / 2 + (S * 2 * Math.PI) / 3,
      s = n - (2 * Math.PI) / 6,
      p = n + (2 * Math.PI) / 6,
      m = Math.cos(n) * h,
      g = Math.sin(n) * h;
    ((l.fillStyle = o || '#f8fafc'),
      l.beginPath(),
      l.moveTo(0, 0),
      l.lineTo(m, g),
      l.lineTo(Math.cos(s) * i, Math.sin(s) * i),
      l.closePath(),
      l.fill(),
      (l.fillStyle = o ? '#990000' : '#64748b'),
      l.beginPath(),
      l.moveTo(0, 0),
      l.lineTo(m, g),
      l.lineTo(Math.cos(p) * i, Math.sin(p) * i),
      l.closePath(),
      l.fill());
  }
  l.restore();
}
function he(l, r, a, e, o) {
  l.save();
  const f = 6,
    i = 11,
    h = e / (i + 1),
    S = o / (f + 1);
  for (let n = 0; n < f; n++) {
    const s = Math.max(0.08, 0.34 - n * 0.045);
    for (let p = 0; p < i; p++) {
      const m = n % 2 === 0 ? 0 : h * 0.5,
        g = r + (p + 1) * h + m - h * 0.5,
        t = a + (n + 1) * S;
      n === 0 && p === 4
        ? ((l.globalAlpha = 0.95), O(l, g, t, 16, '#e10600'))
        : ((l.globalAlpha = s), O(l, g, t, 13));
    }
  }
  l.restore();
}
function W0(l, r, a, e) {
  (l.save(),
    l.translate(r, a),
    (l.fillStyle = '#25d366'),
    l.beginPath(),
    l.arc(0, 0, e * 0.5, 0, Math.PI * 2),
    l.fill(),
    (l.fillStyle = '#ffffff'),
    l.beginPath());
  const o = e * 0.45;
  (l.arc(0, 0, o * 0.45, -0.4, 2),
    (l.lineWidth = Math.max(3.5, e * 0.14)),
    (l.strokeStyle = '#ffffff'),
    l.stroke(),
    l.beginPath(),
    l.arc(-o * 0.3, -o * 0.12, o * 0.13, 0, Math.PI * 2),
    l.arc(o * 0.18, o * 0.3, o * 0.13, 0, Math.PI * 2),
    l.fill(),
    l.restore());
}
function i0(l, r, a, e) {
  (l.save(), l.translate(r, a));
  const o = e,
    f = e * 1.25;
  ((l.fillStyle = '#ffdf00'),
    l.beginPath(),
    l.moveTo(-o / 2, -f / 2),
    l.lineTo(o / 2, -f / 2),
    l.lineTo(o / 2, f * 0.15),
    l.bezierCurveTo(o / 2, f * 0.45, o * 0.2, f * 0.52, 0, f / 2),
    l.bezierCurveTo(-o * 0.2, f * 0.52, -o / 2, f * 0.45, -o / 2, f * 0.15),
    l.closePath(),
    l.fill(),
    (l.strokeStyle = '#000000'),
    (l.lineWidth = Math.max(2, e * 0.04)),
    l.stroke());
  const i = f * 0.14,
    h = o / 3;
  ((l.fillStyle = '#009246'),
    l.fillRect(-o / 2, -f / 2, h, i),
    (l.fillStyle = '#ffffff'),
    l.fillRect(-o / 2 + h, -f / 2, h, i),
    (l.fillStyle = '#ce2b37'),
    l.fillRect(-o / 2 + h * 2, -f / 2, h, i),
    (l.fillStyle = '#000000'),
    l.beginPath(),
    l.arc(o * 0.08, -f * 0.18, e * 0.08, 0, Math.PI * 2),
    l.fill(),
    (l.font = `bold ${Math.round(e * 0.18)}px "Arial Black", sans-serif`),
    (l.fillStyle = '#000000'),
    (l.textAlign = 'center'),
    l.fillText('S F', 0, f * 0.42),
    l.restore());
}
function q(l, r, a, e) {
  (l.save(), l.translate(r, a));
  const o = e * 0.48;
  ((l.fillStyle = '#dd1d21'),
    l.beginPath(),
    l.arc(0, 0, o, 0, Math.PI * 2),
    l.fill(),
    (l.fillStyle = '#ffdf00'),
    l.beginPath(),
    l.arc(0, 0, o * 0.82, 0, Math.PI * 2),
    l.fill(),
    (l.strokeStyle = '#dd1d21'),
    (l.lineWidth = Math.max(2.5, e * 0.05)));
  for (let f = -0.8; f <= 0.8; f += 0.4)
    (l.beginPath(),
      l.moveTo(0, o * 0.48),
      l.lineTo(Math.sin(f) * o * 0.74, -Math.cos(f) * o * 0.74),
      l.stroke());
  l.restore();
}
function L(l, r, a, e) {
  (l.save(), l.translate(r, a));
  const o = e * 0.24;
  ((l.fillStyle = '#ffce00'),
    l.beginPath(),
    l.arc(0, 0, o, 0, Math.PI * 2),
    l.fill(),
    (l.fillStyle = '#ed1a3b'),
    (l.font = `900 ${Math.round(e * 0.22)}px "Impact", "Arial Black", sans-serif`),
    (l.textAlign = 'center'),
    (l.textBaseline = 'middle'),
    l.fillText('RED BULL', 0, 0),
    (l.fillStyle = '#ffffff'),
    l.beginPath(),
    l.arc(-e * 0.22, -o * 0.4, 4, 0, Math.PI * 2),
    l.arc(e * 0.22, -o * 0.4, 4, 0, Math.PI * 2),
    l.fill(),
    l.restore());
}
function y0(l, r, a, e) {
  (l.save(),
    l.translate(r, a),
    (l.font = `900 ${Math.round(e * 0.28)}px "Arial Black", "Impact", sans-serif`),
    (l.textAlign = 'center'),
    (l.textBaseline = 'middle'),
    (l.fillStyle = '#ffffff'),
    l.fillText('I N E O S', 0, 0),
    l.restore());
}
function r0(l, r, a, e) {
  (l.save(),
    l.translate(r, a),
    (l.fillStyle = '#ff8000'),
    l.beginPath(),
    l.moveTo(-e * 0.5, e * 0.2),
    l.bezierCurveTo(-e * 0.2, -e * 0.4, e * 0.4, -e * 0.4, e * 0.5, -e * 0.1),
    l.bezierCurveTo(e * 0.2, -e * 0.2, -e * 0.1, 0, -e * 0.5, e * 0.2),
    l.closePath(),
    l.fill(),
    l.restore());
}
function t0(l, r, a, e) {
  (l.save(), l.translate(r, a));
  const o = ['#ea4335', '#fbbc05', '#34a853'];
  for (let f = 0; f < 3; f++)
    ((l.fillStyle = o[f]),
      l.beginPath(),
      l.moveTo(0, 0),
      l.arc(0, 0, e, (f * 2 * Math.PI) / 3, ((f + 1) * 2 * Math.PI) / 3),
      l.closePath(),
      l.fill());
  ((l.fillStyle = '#ffffff'),
    l.beginPath(),
    l.arc(0, 0, e * 0.55, 0, Math.PI * 2),
    l.fill(),
    (l.fillStyle = '#4285f4'),
    l.beginPath(),
    l.arc(0, 0, e * 0.42, 0, Math.PI * 2),
    l.fill(),
    l.restore());
}
function D0(l, r, a, e) {
  (l.save(),
    l.translate(r, a),
    (l.fillStyle = '#3ddc84'),
    l.beginPath(),
    l.arc(0, 0, e * 0.5, Math.PI, 0, !1),
    l.closePath(),
    l.fill(),
    (l.fillStyle = '#ffffff'),
    l.beginPath(),
    l.arc(-e * 0.2, -e * 0.2, e * 0.06, 0, Math.PI * 2),
    l.arc(e * 0.2, -e * 0.2, e * 0.06, 0, Math.PI * 2),
    l.fill(),
    (l.strokeStyle = '#3ddc84'),
    (l.lineWidth = Math.max(3, e * 0.08)),
    l.beginPath(),
    l.moveTo(-e * 0.28, -e * 0.4),
    l.lineTo(-e * 0.4, -e * 0.65),
    l.moveTo(e * 0.28, -e * 0.4),
    l.lineTo(e * 0.4, -e * 0.65),
    l.stroke(),
    l.restore());
}
function V(l, r, a, e) {
  (l.save(),
    l.translate(r, a),
    (l.fillStyle = '#e2e8f0'),
    l.beginPath(),
    l.moveTo(-e * 0.5, -e * 0.06),
    l.quadraticCurveTo(-e * 0.2, -e * 0.14, 0, -e * 0.06),
    l.quadraticCurveTo(e * 0.2, -e * 0.14, e * 0.5, -e * 0.06),
    l.quadraticCurveTo(e * 0.2, e * 0.12, 0, e * 0.14),
    l.quadraticCurveTo(-e * 0.2, e * 0.12, -e * 0.5, -e * 0.06),
    l.closePath(),
    l.fill(),
    (l.fillStyle = '#00594f'),
    l.fillRect(-e * 0.28, -e * 0.04, e * 0.56, e * 0.08),
    (l.font = `bold ${Math.round(e * 0.045)}px "Arial", sans-serif`),
    (l.fillStyle = '#ffffff'),
    (l.textAlign = 'center'),
    (l.textBaseline = 'middle'),
    l.fillText('ASTON MARTIN', 0, 0),
    l.restore());
}
function Z(l, r, a, e) {
  (l.save(),
    l.translate(r, a),
    (l.font = `900 ${Math.round(e)}px "Arial Black", "Impact", sans-serif`),
    (l.textAlign = 'center'),
    (l.textBaseline = 'middle'),
    (l.fillStyle = '#ffffff'),
    l.fillText('A', 0, 0),
    (l.strokeStyle = '#0078d0'),
    (l.lineWidth = Math.max(3, e * 0.12)),
    l.beginPath(),
    l.moveTo(-e * 0.45, e * 0.1),
    l.lineTo(e * 0.45, -e * 0.05),
    l.stroke(),
    l.restore());
}
function K(l, r, a, e) {
  (l.save(),
    l.translate(r, a),
    (l.font = `900 ${Math.round(e)}px "Impact", sans-serif`),
    (l.textAlign = 'center'),
    (l.textBaseline = 'middle'),
    (l.fillStyle = '#00a3e0'),
    l.fillText('W', 0, 0),
    (l.fillStyle = '#ffffff'),
    l.fillRect(-e * 0.35, e * 0.2, e * 0.7, e * 0.06),
    (l.fillStyle = '#e10600'),
    l.fillRect(-e * 0.15, e * 0.2, e * 0.3, e * 0.06),
    l.restore());
}
function T0(l, r, a, e) {
  (l.save(), l.translate(r, a));
  const o = e * 0.45;
  ((l.fillStyle = '#e10600'),
    l.beginPath(),
    l.arc(-e * 0.55, 0, o, 0, Math.PI * 2),
    l.fill(),
    (l.strokeStyle = '#ffffff'),
    (l.lineWidth = Math.max(2.5, e * 0.09)),
    l.beginPath(),
    l.arc(-e * 0.55, 0, o * 0.58, -Math.PI * 0.25, Math.PI * 0.75),
    l.stroke(),
    (l.fillStyle = '#ffffff'),
    l.beginPath(),
    l.arc(-e * 0.55, -o * 0.16, o * 0.2, 0, Math.PI * 2),
    l.fill(),
    (l.font = `900 ${Math.round(e * 0.52)}px "Arial Black", sans-serif`),
    (l.fillStyle = '#ffffff'),
    (l.textAlign = 'left'),
    (l.textBaseline = 'middle'),
    l.fillText('Snapdragon', -e * 0.55 + o + e * 0.16, 0),
    l.restore());
}
function $(l, r, a, e) {
  (l.save(), l.translate(r, a));
  const o = e * 0.16,
    f = o * 1.5,
    i = -f * 1.5;
  ((l.strokeStyle = '#f1f5f9'), (l.lineWidth = Math.max(3.5, e * 0.038)));
  for (let h = 0; h < 4; h++) (l.beginPath(), l.arc(i + h * f, 0, o, 0, Math.PI * 2), l.stroke());
  l.restore();
}
function Y(l, r, a, e) {
  (l.save(),
    l.translate(r, a),
    (l.fillStyle = '#e10600'),
    l.beginPath(),
    l.arc(0, 0, e * 0.5, 0, Math.PI * 2),
    l.fill(),
    (l.font = `900 ${Math.round(e * 0.65)}px "Arial Black", sans-serif`),
    (l.fillStyle = '#ffffff'),
    (l.textAlign = 'center'),
    (l.textBaseline = 'middle'),
    l.fillText('H', 0, 0),
    l.restore());
}
function N0(l, r, a, e) {
  (l.save(),
    l.translate(r, a),
    (l.fillStyle = '#e10600'),
    l.beginPath(),
    l.arc(0, 0, e * 0.5, 0, Math.PI * 2),
    l.fill(),
    (l.strokeStyle = '#ffffff'),
    (l.lineWidth = Math.max(3, e * 0.1)),
    l.beginPath(),
    l.arc(0, 0, e * 0.32, -0.6, 2.2),
    l.stroke(),
    l.beginPath(),
    l.arc(0, 0, e * 0.32, 2.6, 5.4),
    l.stroke(),
    l.restore());
}
function j(l, r, a, e) {
  (l.save(),
    l.translate(r, a),
    (l.fillStyle = '#d4af37'),
    l.beginPath(),
    l.moveTo(-e * 0.5, -e * 0.3),
    l.lineTo(e * 0.5, -e * 0.3),
    l.lineTo(e * 0.45, e * 0.1),
    l.lineTo(0, e * 0.45),
    l.lineTo(-e * 0.45, e * 0.1),
    l.closePath(),
    l.fill(),
    (l.fillStyle = '#101216'),
    l.fillRect(-e * 0.35, -e * 0.18, e * 0.7, e * 0.08),
    (l.fillStyle = '#d90429'),
    l.fillRect(-e * 0.3, 0, e * 0.28, e * 0.06),
    (l.fillStyle = '#0284c7'),
    l.fillRect(e * 0.02, 0, e * 0.28, e * 0.06),
    l.restore());
}
function pe(l, r, a) {
  return z(1024, 1024, (e, o, f) => {
    const i = r.noseColor || r.bodyColor || '#e8002d';
    X(e, o, f, i, 0.08);
    const h = e.createLinearGradient(0, 0, 0, f);
    (h.addColorStop(0, 'rgba(0, 0, 0, 0.25)'),
      h.addColorStop(0.25, 'rgba(0, 0, 0, 0.0)'),
      h.addColorStop(0.75, 'rgba(0, 0, 0, 0.0)'),
      h.addColorStop(1, 'rgba(0, 0, 0, 0.25)'),
      (e.fillStyle = h),
      e.fillRect(0, 0, o, f));
    const S = (n) => {
      ((e.fillStyle = n),
        e.beginPath(),
        e.moveTo(60, 1200),
        e.lineTo(1280, 1050),
        e.lineTo(1280, 1510),
        e.lineTo(60, 1360),
        e.closePath(),
        e.fill());
    };
    if (l === 'mercedes') {
      const n = e.createLinearGradient(0, 0, 1400, 0);
      (n.addColorStop(0, '#edf0f2'),
        n.addColorStop(0.35, '#9aa2ab'),
        n.addColorStop(0.75, '#22262c'),
        n.addColorStop(1, '#0a0b0d'),
        (e.fillStyle = n),
        e.fillRect(0, 0, o, f),
        S(n),
        (e.strokeStyle = '#00a19c'),
        (e.lineWidth = 7),
        e.beginPath(),
        e.moveTo(80, 1260),
        e.lineTo(1280, 1260),
        e.stroke(),
        (e.strokeStyle = '#00f5d4'),
        (e.lineWidth = 3),
        e.beginPath(),
        e.moveTo(80, 1264),
        e.lineTo(1280, 1264),
        e.stroke(),
        (e.strokeStyle = '#00a19c'),
        (e.lineWidth = 7),
        e.beginPath(),
        e.moveTo(80, 1300),
        e.lineTo(1280, 1300),
        e.stroke(),
        (e.strokeStyle = '#00f5d4'),
        (e.lineWidth = 3),
        e.beginPath(),
        e.moveTo(80, 1296),
        e.lineTo(1280, 1296),
        e.stroke(),
        O(e, 100, 1280, 36),
        e.save(),
        e.translate(260, 1280),
        e.rotate(-Math.PI / 2),
        (e.font = '900 82px "Impact", "Arial Black", sans-serif'),
        (e.fillStyle = '#00f5d4'),
        (e.strokeStyle = '#0a0b0d'),
        (e.lineWidth = 8),
        (e.textAlign = 'center'),
        (e.textBaseline = 'middle'),
        e.strokeText('63', 0, 0),
        e.fillText('63', 0, 0),
        e.restore(),
        e.save(),
        e.translate(480, 1280),
        e.rotate(-Math.PI / 2),
        (e.fillStyle = '#e10600'),
        e.beginPath(),
        e.roundRect(-24, -90, 48, 180, 10),
        e.fill(),
        y0(e, 0, 0, 140),
        e.restore(),
        e.save(),
        e.translate(700, 1280),
        e.rotate(-Math.PI / 2),
        (e.font = '800 28px "Arial", sans-serif'),
        (e.fillStyle = '#ffffff'),
        (e.textAlign = 'center'),
        (e.textBaseline = 'middle'),
        e.fillText('TeamViewer', 0, 0),
        e.restore(),
        e.save(),
        e.translate(880, 1280),
        e.rotate(-Math.PI / 2),
        T0(e, 0, 0, 34),
        e.restore(),
        e.save(),
        e.translate(1060, 1280),
        e.rotate(-Math.PI / 2),
        W0(e, -55, 0, 28),
        (e.font = '800 22px "Arial", sans-serif'),
        (e.fillStyle = '#25d366'),
        (e.textAlign = 'left'),
        (e.textBaseline = 'middle'),
        e.fillText('WhatsApp', -35, 0),
        e.restore(),
        e.save(),
        e.translate(1190, 1280),
        e.rotate(-Math.PI / 2),
        (e.font = '900 22px "Arial Black", sans-serif'),
        (e.fillStyle = '#e10600'),
        (e.textAlign = 'center'),
        (e.textBaseline = 'middle'),
        e.fillText('CROWDSTRIKE', 0, 0),
        e.restore());
      const s = e.createLinearGradient(0, 2048, 0, 1300);
      (s.addColorStop(0, '#edf0f2'),
        s.addColorStop(0.35, '#848d98'),
        s.addColorStop(1, '#101216'),
        (e.fillStyle = s),
        e.fillRect(1740, 1100, 220, 948),
        O(e, 1933, 1692, 52),
        e.save(),
        e.translate(1880, 1960),
        e.rotate(Math.PI),
        (e.fillStyle = '#e10600'),
        e.fillRect(-50, -14, 100, 28),
        (e.strokeStyle = '#ffdf00'),
        (e.lineWidth = 2),
        e.strokeRect(-50, -14, 100, 28),
        (e.font = 'italic 900 18px "Arial Black", sans-serif'),
        (e.fillStyle = '#ffdf00'),
        (e.textAlign = 'center'),
        (e.textBaseline = 'middle'),
        e.fillText('PIRELLI', 0, 0),
        e.restore(),
        (e.font = '800 24px "Arial", sans-serif'),
        (e.fillStyle = '#ffffff'),
        (e.textAlign = 'center'),
        e.fillText('IWC', 1880, 1460));
    } else
      l === 'ferrari'
        ? (S('#e8002d'),
          (e.strokeStyle = '#ffffff'),
          (e.lineWidth = 8),
          e.beginPath(),
          e.moveTo(60, 1265),
          e.lineTo(1280, 1265),
          e.stroke(),
          (e.strokeStyle = '#ffdf00'),
          (e.lineWidth = 8),
          e.beginPath(),
          e.moveTo(60, 1295),
          e.lineTo(1280, 1295),
          e.stroke(),
          q(e, 80, 1280, 48),
          e.save(),
          e.translate(220, 1280),
          e.rotate(-Math.PI / 2),
          i0(e, 0, 0, 75),
          e.restore(),
          e.save(),
          e.translate(390, 1280),
          e.rotate(-Math.PI / 2),
          T0(e, 0, 0, 40),
          e.restore(),
          e.save(),
          e.translate(560, 1280),
          e.rotate(-Math.PI / 2),
          (e.font = '900 76px "Impact", sans-serif'),
          (e.fillStyle = '#ffffff'),
          (e.strokeStyle = '#0a0b0d'),
          (e.lineWidth = 6),
          (e.textAlign = 'center'),
          (e.textBaseline = 'middle'),
          e.strokeText('16', 0, 0),
          e.fillText('16', 0, 0),
          e.restore(),
          e.save(),
          e.translate(750, 1280),
          e.rotate(-Math.PI / 2),
          (e.font = '900 38px "Arial Black", sans-serif'),
          (e.fillStyle = '#ffffff'),
          (e.textAlign = 'center'),
          (e.textBaseline = 'middle'),
          e.fillText('Santander', 0, 0),
          e.restore(),
          (e.fillStyle = '#e8002d'),
          e.fillRect(1740, 1100, 220, 948),
          q(e, 1933, 1692, 60))
        : l === 'redbull'
          ? (S('#030a1c'),
            (e.fillStyle = '#ffce00'),
            e.beginPath(),
            e.moveTo(60, 1200),
            e.lineTo(240, 1180),
            e.lineTo(240, 1380),
            e.lineTo(60, 1360),
            e.closePath(),
            e.fill(),
            e.save(),
            e.translate(380, 1280),
            e.rotate(-Math.PI / 2),
            L(e, 0, 0, 130),
            e.restore(),
            e.save(),
            e.translate(560, 1280),
            e.rotate(-Math.PI / 2),
            (e.font = '900 84px "Impact", sans-serif'),
            (e.fillStyle = '#ffce00'),
            (e.strokeStyle = '#ed1a3b'),
            (e.lineWidth = 6),
            (e.textAlign = 'center'),
            (e.textBaseline = 'middle'),
            e.strokeText('1', 0, 0),
            e.fillText('1', 0, 0),
            e.restore(),
            e.save(),
            e.translate(760, 1280),
            e.rotate(-Math.PI / 2),
            (e.font = '900 48px "Impact", sans-serif'),
            (e.fillStyle = '#ffffff'),
            (e.textAlign = 'center'),
            (e.textBaseline = 'middle'),
            e.fillText('ORACLE', 0, 0),
            e.restore(),
            (e.fillStyle = '#ffce00'),
            e.fillRect(1740, 1100, 220, 948),
            L(e, 1933, 1692, 110))
          : l === 'mclaren'
            ? (S('#ff8000'),
              t0(e, 80, 1280, 28),
              e.save(),
              e.translate(220, 1280),
              e.rotate(-Math.PI / 2),
              (e.font = '900 82px "Impact", sans-serif'),
              (e.fillStyle = '#d9f99d'),
              (e.strokeStyle = '#141619'),
              (e.lineWidth = 6),
              (e.textAlign = 'center'),
              (e.textBaseline = 'middle'),
              e.strokeText('4', 0, 0),
              e.fillText('4', 0, 0),
              e.restore(),
              e.save(),
              e.translate(420, 1280),
              e.rotate(-Math.PI / 2),
              (e.font = '900 64px "Impact", sans-serif'),
              (e.fillStyle = '#141619'),
              (e.textAlign = 'center'),
              (e.textBaseline = 'middle'),
              e.fillText('O K X', 0, 0),
              e.restore(),
              e.save(),
              e.translate(620, 1280),
              e.rotate(-Math.PI / 2),
              D0(e, 0, 0, 60),
              e.restore(),
              (e.fillStyle = '#ff8000'),
              e.fillRect(1740, 1100, 220, 948),
              r0(e, 1933, 1692, 70))
            : l === 'astonmartin'
              ? (S('#00594f'),
                (e.strokeStyle = '#cedc00'),
                (e.lineWidth = 10),
                e.beginPath(),
                e.moveTo(60, 1280),
                e.lineTo(1280, 1280),
                e.stroke(),
                V(e, 120, 1280, 90),
                e.save(),
                e.translate(260, 1280),
                e.rotate(-Math.PI / 2),
                (e.font = '900 78px "Impact", sans-serif'),
                (e.fillStyle = '#ffffff'),
                (e.strokeStyle = '#00594f'),
                (e.lineWidth = 6),
                (e.textAlign = 'center'),
                (e.textBaseline = 'middle'),
                e.strokeText('14', 0, 0),
                e.fillText('14', 0, 0),
                e.restore(),
                e.save(),
                e.translate(460, 1280),
                e.rotate(-Math.PI / 2),
                (e.font = '900 44px "Arial Black", sans-serif'),
                (e.fillStyle = '#ffffff'),
                (e.textAlign = 'center'),
                (e.textBaseline = 'middle'),
                e.fillText('aramco', 0, 0),
                e.restore(),
                (e.fillStyle = '#00594f'),
                e.fillRect(1740, 1100, 220, 948),
                V(e, 1933, 1692, 110))
              : l === 'alpine'
                ? (S('#0078d0'),
                  (e.strokeStyle = '#fd4bc7'),
                  (e.lineWidth = 10),
                  e.beginPath(),
                  e.moveTo(60, 1270),
                  e.lineTo(1280, 1270),
                  e.moveTo(60, 1290),
                  e.lineTo(1280, 1290),
                  e.stroke(),
                  Z(e, 120, 1280, 68),
                  e.save(),
                  e.translate(260, 1280),
                  e.rotate(-Math.PI / 2),
                  (e.font = '900 78px "Impact", sans-serif'),
                  (e.fillStyle = '#ffffff'),
                  (e.strokeStyle = '#0078d0'),
                  (e.lineWidth = 6),
                  (e.textAlign = 'center'),
                  (e.textBaseline = 'middle'),
                  e.strokeText('10', 0, 0),
                  e.fillText('10', 0, 0),
                  e.restore(),
                  e.save(),
                  e.translate(460, 1280),
                  e.rotate(-Math.PI / 2),
                  (e.font = '900 56px "Impact", sans-serif'),
                  (e.fillStyle = '#fd4bc7'),
                  (e.textAlign = 'center'),
                  (e.textBaseline = 'middle'),
                  e.fillText('B W T', 0, 0),
                  e.restore(),
                  (e.fillStyle = '#0078d0'),
                  e.fillRect(1740, 1100, 220, 948),
                  Z(e, 1933, 1692, 90))
                : l === 'racingbulls'
                  ? (S('#1434cb'),
                    (e.fillStyle = '#ffffff'),
                    e.fillRect(60, 1272, 1220, 16),
                    e.save(),
                    e.translate(240, 1280),
                    e.rotate(-Math.PI / 2),
                    (e.font = '900 78px "Impact", sans-serif'),
                    (e.fillStyle = '#00d632'),
                    (e.strokeStyle = '#1434cb'),
                    (e.lineWidth = 6),
                    (e.textAlign = 'center'),
                    (e.textBaseline = 'middle'),
                    e.strokeText('30', 0, 0),
                    e.fillText('30', 0, 0),
                    e.restore(),
                    e.save(),
                    e.translate(450, 1280),
                    e.rotate(-Math.PI / 2),
                    (e.font = '900 68px "Impact", sans-serif'),
                    (e.fillStyle = '#ffffff'),
                    (e.textAlign = 'center'),
                    (e.textBaseline = 'middle'),
                    e.fillText('V I S A', 0, 0),
                    e.restore(),
                    e.save(),
                    e.translate(650, 1280),
                    e.rotate(-Math.PI / 2),
                    (e.font = '900 36px "Arial Black", sans-serif'),
                    (e.fillStyle = '#00d632'),
                    (e.textAlign = 'center'),
                    (e.textBaseline = 'middle'),
                    e.fillText('Cash App', 0, 0),
                    e.restore(),
                    (e.fillStyle = '#1434cb'),
                    e.fillRect(1740, 1100, 220, 948),
                    L(e, 1933, 1692, 85))
                  : l === 'williams'
                    ? (S('#001f54'),
                      (e.strokeStyle = '#00a3e0'),
                      (e.lineWidth = 8),
                      e.beginPath(),
                      e.moveTo(60, 1280),
                      e.lineTo(1280, 1280),
                      e.stroke(),
                      K(e, 120, 1280, 70),
                      e.save(),
                      e.translate(260, 1280),
                      e.rotate(-Math.PI / 2),
                      (e.font = '900 78px "Impact", sans-serif'),
                      (e.fillStyle = '#ffffff'),
                      (e.strokeStyle = '#001f54'),
                      (e.lineWidth = 6),
                      (e.textAlign = 'center'),
                      (e.textBaseline = 'middle'),
                      e.strokeText('23', 0, 0),
                      e.fillText('23', 0, 0),
                      e.restore(),
                      e.save(),
                      e.translate(480, 1280),
                      e.rotate(-Math.PI / 2),
                      (e.font = '900 44px "Arial Black", sans-serif'),
                      (e.fillStyle = '#ffffff'),
                      (e.textAlign = 'center'),
                      (e.textBaseline = 'middle'),
                      e.fillText('KOMATSU', 0, 0),
                      e.restore(),
                      (e.fillStyle = '#001f54'),
                      e.fillRect(1740, 1100, 220, 948),
                      K(e, 1933, 1692, 90))
                    : l === 'audi'
                      ? (S('#0d0e11'),
                        (e.fillStyle = '#52ff00'),
                        e.beginPath(),
                        e.moveTo(60, 1240),
                        e.lineTo(380, 1270),
                        e.lineTo(380, 1290),
                        e.lineTo(60, 1320),
                        e.closePath(),
                        e.fill(),
                        e.save(),
                        e.translate(240, 1280),
                        e.rotate(-Math.PI / 2),
                        (e.font = '900 78px "Impact", sans-serif'),
                        (e.fillStyle = '#52ff00'),
                        (e.strokeStyle = '#0d0e11'),
                        (e.lineWidth = 6),
                        (e.textAlign = 'center'),
                        (e.textBaseline = 'middle'),
                        e.strokeText('27', 0, 0),
                        e.fillText('27', 0, 0),
                        e.restore(),
                        e.save(),
                        e.translate(450, 1280),
                        e.rotate(-Math.PI / 2),
                        (e.font = '900 58px "Impact", sans-serif'),
                        (e.fillStyle = '#ffffff'),
                        (e.textAlign = 'center'),
                        (e.textBaseline = 'middle'),
                        e.fillText('Stake', 0, 0),
                        e.restore(),
                        e.save(),
                        e.translate(680, 1280),
                        e.rotate(-Math.PI / 2),
                        $(e, 0, 0, 130),
                        e.restore(),
                        (e.fillStyle = '#0d0e11'),
                        e.fillRect(1740, 1100, 220, 948),
                        $(e, 1933, 1692, 110))
                      : l === 'haas'
                        ? (S('#ffffff'),
                          (e.strokeStyle = '#e10600'),
                          (e.lineWidth = 10),
                          e.beginPath(),
                          e.moveTo(60, 1280),
                          e.lineTo(1280, 1280),
                          e.stroke(),
                          Y(e, 120, 1280, 72),
                          e.save(),
                          e.translate(260, 1280),
                          e.rotate(-Math.PI / 2),
                          (e.font = '900 78px "Impact", sans-serif'),
                          (e.fillStyle = '#e10600'),
                          (e.strokeStyle = '#ffffff'),
                          (e.lineWidth = 6),
                          (e.textAlign = 'center'),
                          (e.textBaseline = 'middle'),
                          e.strokeText('87', 0, 0),
                          e.fillText('87', 0, 0),
                          e.restore(),
                          e.save(),
                          e.translate(480, 1280),
                          e.rotate(-Math.PI / 2),
                          N0(e, 0, 0, 52),
                          e.restore(),
                          (e.fillStyle = '#ffffff'),
                          e.fillRect(1740, 1100, 220, 948),
                          Y(e, 1933, 1692, 85))
                        : l === 'cadillac'
                          ? (S('#0a0b0d'),
                            (e.strokeStyle = '#d4af37'),
                            (e.lineWidth = 8),
                            e.beginPath(),
                            e.moveTo(60, 1280),
                            e.lineTo(1280, 1280),
                            e.stroke(),
                            j(e, 120, 1280, 72),
                            e.save(),
                            e.translate(260, 1280),
                            e.rotate(-Math.PI / 2),
                            (e.font = '900 78px "Impact", sans-serif'),
                            (e.fillStyle = '#d4af37'),
                            (e.strokeStyle = '#0a0b0d'),
                            (e.lineWidth = 6),
                            (e.textAlign = 'center'),
                            (e.textBaseline = 'middle'),
                            e.strokeText('11', 0, 0),
                            e.fillText('11', 0, 0),
                            e.restore(),
                            e.save(),
                            e.translate(480, 1280),
                            e.rotate(-Math.PI / 2),
                            (e.font = 'italic 700 44px "Times New Roman", serif'),
                            (e.fillStyle = '#ffffff'),
                            (e.textAlign = 'center'),
                            (e.textBaseline = 'middle'),
                            e.fillText('Cadillac', 0, 0),
                            e.restore(),
                            (e.fillStyle = '#0a0b0d'),
                            e.fillRect(1740, 1100, 220, 948),
                            j(e, 1933, 1692, 85))
                          : (S(r.bodyColor || '#141619'),
                            e.save(),
                            e.translate(300, 1280),
                            e.rotate(-Math.PI / 2),
                            (e.font = '900 52px "Arial Black", sans-serif'),
                            (e.fillStyle = '#ffffff'),
                            (e.textAlign = 'center'),
                            (e.textBaseline = 'middle'),
                            e.fillText(String(l).toUpperCase(), 0, 0),
                            e.restore(),
                            (e.fillStyle = r.bodyColor || '#141619'),
                            e.fillRect(1740, 1100, 220, 948));
  });
}
function me(l, r, a) {
  const o = {
    mercedes: {
      baseColor: '#0a0b0d',
      deckGradStart: '#1b1e24',
      deckGradEnd: '#090a0d',
      accentColor: '#00a19c',
      accentSecondary: '#00f5d4',
      slatShadow: 'rgba(0, 0, 0, 0.55)',
    },
    ferrari: {
      baseColor: '#e8002d',
      deckGradStart: '#ff1a3d',
      deckGradEnd: '#cc0026',
      accentColor: '#ffdf00',
      accentSecondary: '#ffffff',
      slatShadow: 'rgba(60, 0, 10, 0.55)',
    },
    redbull: {
      baseColor: '#030a1c',
      deckGradStart: '#081438',
      deckGradEnd: '#020612',
      accentColor: '#ffce00',
      accentSecondary: '#ed1a3b',
      slatShadow: 'rgba(0, 2, 10, 0.65)',
    },
    mclaren: {
      baseColor: '#ff8000',
      deckGradStart: '#ff991a',
      deckGradEnd: '#e66000',
      accentColor: '#141619',
      accentSecondary: '#47a1ff',
      slatShadow: 'rgba(50, 18, 0, 0.55)',
    },
    astonmartin: {
      baseColor: '#00594f',
      deckGradStart: '#006e62',
      deckGradEnd: '#00473e',
      accentColor: '#cedc00',
      accentSecondary: '#ffffff',
      slatShadow: 'rgba(0, 30, 25, 0.55)',
    },
    alpine: {
      baseColor: '#0078d0',
      deckGradStart: '#0d8cf0',
      deckGradEnd: '#005fa8',
      accentColor: '#fd4bc7',
      accentSecondary: '#ffffff',
      slatShadow: 'rgba(0, 20, 60, 0.55)',
    },
    williams: {
      baseColor: '#001f54',
      deckGradStart: '#003380',
      deckGradEnd: '#001438',
      accentColor: '#00a3e0',
      accentSecondary: '#00d2ff',
      slatShadow: 'rgba(0, 10, 40, 0.6)',
    },
    racingbulls: {
      baseColor: '#1434cb',
      deckGradStart: '#1f44eb',
      deckGradEnd: '#0b2094',
      accentColor: '#ffffff',
      accentSecondary: '#00d632',
      slatShadow: 'rgba(5, 15, 60, 0.6)',
    },
    audi: {
      baseColor: '#0d0e11',
      deckGradStart: '#181b22',
      deckGradEnd: '#07080a',
      accentColor: '#52ff00',
      accentSecondary: '#80ff44',
      slatShadow: 'rgba(0, 0, 0, 0.65)',
    },
    haas: {
      baseColor: '#f8fafc',
      deckGradStart: '#ffffff',
      deckGradEnd: '#e2e8f0',
      accentColor: '#e10600',
      accentSecondary: '#121417',
      slatShadow: 'rgba(20, 20, 25, 0.45)',
    },
    cadillac: {
      baseColor: '#0a0b0d',
      deckGradStart: '#181920',
      deckGradEnd: '#050507',
      accentColor: '#d4af37',
      accentSecondary: '#f3e5ab',
      slatShadow: 'rgba(0, 0, 0, 0.65)',
    },
  }[r] || {
    baseColor: a.bodyColor || '#141619',
    deckGradStart: a.sidepodColor || a.bodyColor || '#1f2329',
    deckGradEnd: a.bodyColor || '#0a0b0d',
    accentColor: a.accentColor || '#ffffff',
    accentSecondary: a.highlightColor || '#ffdf00',
    slatShadow: 'rgba(0, 0, 0, 0.55)',
  };
  l.save();
  const f = (n, s, p, m, g = !0) => {
      if (((l.fillStyle = o.baseColor), l.fillRect(n, s, p, m), g)) {
        const t = s + Math.floor(m * 0.42);
        ((l.fillStyle = o.accentColor),
          l.fillRect(n, t, p, 14),
          (l.fillStyle = o.accentSecondary),
          l.fillRect(n, t + 14, p, 6));
      }
      l.fillStyle = o.slatShadow;
      for (let t = n; t < n + p; t += 16) l.fillRect(t, s, 4, m);
      l.fillStyle = 'rgba(255, 255, 255, 0.12)';
      for (let t = n; t < n + p; t += 16) l.fillRect(t + 4, s, 2, m);
    },
    i = (n, s, p, m, g = !0) => {
      if (((l.fillStyle = o.baseColor), l.fillRect(n, s, p, m), g)) {
        const t = n + Math.floor(p * 0.42);
        ((l.fillStyle = o.accentColor),
          l.fillRect(t, s, 14, m),
          (l.fillStyle = o.accentSecondary),
          l.fillRect(t + 14, s, 6, m));
      }
      l.fillStyle = o.slatShadow;
      for (let t = s; t < s + m; t += 16) l.fillRect(n, t, p, 4);
      l.fillStyle = 'rgba(255, 255, 255, 0.12)';
      for (let t = s; t < s + m; t += 16) l.fillRect(n, t + 4, p, 2);
    },
    h = l.createLinearGradient(80, 280, 300, 1e3);
  (h.addColorStop(0, o.deckGradStart),
    h.addColorStop(1, o.deckGradEnd),
    (l.fillStyle = h),
    l.fillRect(80, 280, 220, 720),
    (l.fillStyle = o.accentColor),
    l.fillRect(172, 280, 14, 720),
    (l.fillStyle = o.accentSecondary),
    l.fillRect(186, 280, 6, 720));
  const S = l.createLinearGradient(1620, 1220, 1800, 1920);
  (S.addColorStop(0, o.deckGradStart),
    S.addColorStop(1, o.deckGradEnd),
    (l.fillStyle = S),
    l.fillRect(1620, 1220, 180, 700),
    (l.fillStyle = o.accentColor),
    l.fillRect(1692, 1220, 14, 700),
    (l.fillStyle = o.accentSecondary),
    l.fillRect(1706, 1220, 6, 700),
    i(1800, 460, 248, 1120),
    f(950, 120, 720, 280),
    f(1200, 440, 220, 220),
    f(1330, 820, 160, 160),
    f(310, 820, 150, 90),
    i(1600, 1850, 80, 140),
    i(1140, 790, 50, 60, !1),
    f(960, 570, 120, 80, !1),
    f(180, 60, 920, 200),
    f(1080, 180, 540, 220),
    i(1780, 820, 120, 620),
    f(1260, 820, 480, 80),
    i(730, 1180, 50, 280, !1),
    i(1840, 160, 60, 240, !1),
    i(1910, 560, 138, 220, !1),
    f(1920, 2e3, 128, 48, !1),
    f(180, 560, 340, 280),
    i(440, 760, 80, 140, !1),
    i(560, 1210, 90, 140, !1),
    f(700, 440, 140, 80, !1),
    i(130, 980, 70, 100, !1),
    i(10, 840, 40, 60, !1),
    i(990, 1520, 50, 100, !1),
    f(0, 320, 70, 70, !1),
    i(0, 760, 70, 140, !1),
    f(1020, 1140, 70, 80, !1),
    f(630, 1910, 80, 80, !1),
    f(310, 1980, 140, 70, !1),
    l.restore());
}
function ge(l, r, a) {
  return z(1024, 1024, (e, o, f) => {
    const i = r.bodyColor || r.sidepodColor || '#e8002d';
    X(e, o, f, i, 0.08);
    const h = e.createLinearGradient(0, 0, 0, f);
    if (
      (h.addColorStop(0, 'rgba(0, 0, 0, 0.15)'),
      h.addColorStop(0.3, 'rgba(255, 255, 255, 0.04)'),
      h.addColorStop(0.7, 'rgba(0, 0, 0, 0.0)'),
      h.addColorStop(1, 'rgba(0, 0, 0, 0.22)'),
      (e.fillStyle = h),
      e.fillRect(0, 0, o, f),
      l === 'mercedes')
    ) {
      const S = e.createLinearGradient(0, 0, 1600, 0);
      (S.addColorStop(0, '#c8ccd0'),
        S.addColorStop(0.35, '#4a525d'),
        S.addColorStop(0.75, '#14171d'),
        S.addColorStop(1, '#0a0b0d'),
        (e.fillStyle = S),
        e.fillRect(0, 0, o, f));
    }
    if ((me(e, l, r), l === 'mercedes')) {
      ((e.fillStyle = '#c8102e'),
        e.fillRect(0, 0, o, 110),
        (e.fillStyle = '#0a0b0d'),
        e.fillRect(0, 110, o, 12),
        y0(e, 450, 55, 230),
        y0(e, 1550, 55, 230),
        (e.font = '900 48px "Impact", sans-serif'),
        (e.fillStyle = '#00f5d4'),
        (e.strokeStyle = '#0a0b0d'),
        (e.lineWidth = 5),
        (e.textAlign = 'center'),
        (e.textBaseline = 'middle'),
        e.strokeText('63', 320, 160),
        e.fillText('63', 320, 160),
        e.strokeText('63', 1728, 160),
        e.fillText('63', 1728, 160),
        O(e, 240, 160, 20),
        O(e, 1808, 160, 20),
        (e.fillStyle = '#0a0b0d'),
        e.fillRect(150, 1550, 1300, 498));
      const S = e.createLinearGradient(150, 1750, 1350, 1680);
      (S.addColorStop(0, '#00a19c'),
        S.addColorStop(0.5, '#00d6cb'),
        S.addColorStop(1, '#007570'),
        (e.fillStyle = S),
        e.beginPath(),
        e.moveTo(150, 1740),
        e.bezierCurveTo(450, 1720, 850, 1680, 1350, 1660),
        e.lineTo(1350, 1720),
        e.bezierCurveTo(850, 1740, 450, 1780, 150, 1800),
        e.closePath(),
        e.fill(),
        (e.strokeStyle = '#00f5d4'),
        (e.lineWidth = 5),
        e.beginPath(),
        e.moveTo(150, 1740),
        e.bezierCurveTo(450, 1720, 850, 1680, 1350, 1660),
        e.stroke(),
        (e.font = '900 86px "Impact", "Arial Black", sans-serif'),
        (e.fillStyle = '#ffffff'),
        (e.textAlign = 'center'),
        (e.textBaseline = 'middle'),
        e.fillText('P E T R O N A S', 680, 1865),
        (e.font = 'italic 900 38px "Arial Black", sans-serif'),
        (e.fillStyle = '#e2e8f0'),
        e.fillText('///AMG', 460, 1940),
        (e.fillStyle = '#00a19c'),
        (e.font = '900 24px "Arial Black", sans-serif'),
        e.fillText('E  PERFORMANCE', 700, 1940),
        W0(e, 1020, 1865, 42),
        (e.font = '900 28px "Arial Black", sans-serif'),
        (e.fillStyle = '#ffffff'),
        e.fillText('Snapdragon', 1200, 1865),
        (e.fillStyle = '#0a0b0d'),
        e.fillRect(728, 770, 284, 850),
        (e.fillStyle = '#00a19c'),
        e.fillRect(850, 770, 24, 850),
        (e.fillStyle = '#00f5d4'),
        e.fillRect(868, 770, 6, 850),
        e.save(),
        e.translate(790, 1200),
        e.rotate(Math.PI / 2),
        (e.font = '900 68px "Impact", sans-serif'),
        (e.fillStyle = '#ffffff'),
        (e.textAlign = 'center'),
        (e.textBaseline = 'middle'),
        e.fillText('P E T R O N A S', 0, 0),
        e.restore(),
        (e.strokeStyle = '#00a19c'),
        (e.lineWidth = 10),
        e.beginPath(),
        e.moveTo(0, 360),
        e.lineTo(900, 360),
        e.moveTo(850, 180),
        e.lineTo(1900, 180),
        e.stroke(),
        (e.font = 'italic 900 34px "Arial Black", sans-serif'),
        (e.fillStyle = '#cbd5e1'),
        (e.textAlign = 'center'),
        e.fillText('///AMG', 500, 320),
        e.fillText('///AMG', 1400, 140),
        he(e, 1050, 600, 750, 750));
    } else
      l === 'ferrari'
        ? ((e.fillStyle = '#e8002d'),
          e.fillRect(0, 0, o, 110),
          q(e, 450, 55, 36),
          q(e, 1550, 55, 36),
          (e.font = '900 48px "Impact", sans-serif'),
          (e.fillStyle = '#ffffff'),
          (e.strokeStyle = '#ffdf00'),
          (e.lineWidth = 5),
          (e.textAlign = 'center'),
          (e.textBaseline = 'middle'),
          e.strokeText('16', 320, 160),
          e.fillText('16', 320, 160),
          e.strokeText('16', 1728, 160),
          e.fillText('16', 1728, 160),
          i0(e, 240, 160, 42),
          i0(e, 1808, 160, 42),
          (e.fillStyle = '#e8002d'),
          e.fillRect(150, 1550, 1300, 498),
          (e.strokeStyle = '#ffffff'),
          (e.lineWidth = 8),
          e.beginPath(),
          e.moveTo(150, 1750),
          e.lineTo(1450, 1750),
          e.stroke(),
          (e.strokeStyle = '#ffdf00'),
          (e.lineWidth = 8),
          e.beginPath(),
          e.moveTo(150, 1775),
          e.lineTo(1450, 1775),
          e.stroke(),
          q(e, 380, 1870, 75),
          (e.font = '900 76px "Arial Black", sans-serif'),
          (e.fillStyle = '#ffffff'),
          (e.textAlign = 'center'),
          (e.textBaseline = 'middle'),
          e.fillText('Santander', 760, 1875),
          L0(e, 1140, 1870, 72),
          (e.fillStyle = '#e8002d'),
          e.fillRect(728, 770, 284, 850),
          e.save(),
          e.translate(790, 1200),
          e.rotate(Math.PI / 2),
          (e.font = '900 64px "Arial Black", sans-serif'),
          (e.fillStyle = '#ffffff'),
          (e.textAlign = 'center'),
          (e.textBaseline = 'middle'),
          e.fillText('Santander', 0, 0),
          e.restore(),
          i0(e, 1400, 950, 180),
          q(e, 1400, 1200, 100))
        : l === 'redbull'
          ? ((e.fillStyle = '#ffce00'),
            e.fillRect(0, 0, o, 110),
            L(e, 450, 55, 65),
            L(e, 1550, 55, 65),
            (e.font = '900 52px "Impact", sans-serif'),
            (e.fillStyle = '#ffce00'),
            (e.strokeStyle = '#ed1a3b'),
            (e.lineWidth = 6),
            (e.textAlign = 'center'),
            (e.textBaseline = 'middle'),
            e.strokeText('1', 320, 160),
            e.fillText('1', 320, 160),
            e.strokeText('1', 1728, 160),
            e.fillText('1', 1728, 160),
            (e.fillStyle = '#030a1c'),
            e.fillRect(150, 1550, 1300, 498),
            (e.font = '900 110px "Impact", sans-serif'),
            (e.fillStyle = '#ffffff'),
            (e.textAlign = 'center'),
            (e.textBaseline = 'middle'),
            e.fillText('O R A C L E', 750, 1860),
            L(e, 1260, 1860, 140),
            (e.fillStyle = '#030a1c'),
            e.fillRect(728, 770, 284, 850),
            e.save(),
            e.translate(790, 1200),
            e.rotate(Math.PI / 2),
            (e.font = '900 70px "Impact", sans-serif'),
            (e.fillStyle = '#ffffff'),
            (e.textAlign = 'center'),
            (e.textBaseline = 'middle'),
            e.fillText('ORACLE', 0, 0),
            e.restore(),
            L(e, 1400, 950, 340))
          : l === 'mclaren'
            ? ((e.fillStyle = '#141619'),
              e.fillRect(0, 0, o, 110),
              t0(e, 450, 55, 24),
              t0(e, 1550, 55, 24),
              (e.font = '900 52px "Impact", sans-serif'),
              (e.fillStyle = '#d9f99d'),
              (e.strokeStyle = '#141619'),
              (e.lineWidth = 6),
              (e.textAlign = 'center'),
              (e.textBaseline = 'middle'),
              e.strokeText('4', 320, 160),
              e.fillText('4', 320, 160),
              e.strokeText('4', 1728, 160),
              e.fillText('4', 1728, 160),
              (e.fillStyle = '#ff8000'),
              e.fillRect(150, 1550, 1300, 498),
              (e.fillStyle = '#141619'),
              e.fillRect(150, 1870, 1300, 178),
              (e.font = '900 110px "Impact", sans-serif'),
              (e.fillStyle = '#141619'),
              (e.textAlign = 'center'),
              (e.textBaseline = 'middle'),
              e.fillText('O K X', 750, 1780),
              t0(e, 1180, 1780, 42),
              D0(e, 360, 1780, 48),
              (e.fillStyle = '#ff8000'),
              e.fillRect(728, 770, 284, 850),
              e.save(),
              e.translate(790, 1200),
              e.rotate(Math.PI / 2),
              (e.font = '900 70px "Impact", sans-serif'),
              (e.fillStyle = '#141619'),
              (e.textAlign = 'center'),
              (e.textBaseline = 'middle'),
              e.fillText('O K X', 0, 0),
              e.restore(),
              r0(e, 1400, 950, 220))
            : l === 'astonmartin'
              ? ((e.fillStyle = '#00594f'),
                e.fillRect(0, 0, o, 110),
                (e.fillStyle = '#cedc00'),
                e.fillRect(0, 104, o, 8),
                V(e, 450, 55, 120),
                V(e, 1550, 55, 120),
                (e.font = '900 48px "Impact", sans-serif'),
                (e.fillStyle = '#ffffff'),
                (e.strokeStyle = '#00594f'),
                (e.lineWidth = 5),
                (e.textAlign = 'center'),
                (e.textBaseline = 'middle'),
                e.strokeText('14', 320, 160),
                e.fillText('14', 320, 160),
                e.strokeText('14', 1728, 160),
                e.fillText('14', 1728, 160),
                (e.fillStyle = '#00594f'),
                e.fillRect(150, 1550, 1300, 498),
                (e.strokeStyle = '#cedc00'),
                (e.lineWidth = 8),
                e.beginPath(),
                e.moveTo(150, 1750),
                e.lineTo(1450, 1750),
                e.stroke(),
                (e.font = '900 72px "Arial Black", sans-serif'),
                (e.fillStyle = '#ffffff'),
                (e.textAlign = 'center'),
                (e.textBaseline = 'middle'),
                e.fillText('cognizant', 750, 1865),
                V(e, 1220, 1865, 160),
                (e.fillStyle = '#00594f'),
                e.fillRect(728, 770, 284, 850),
                (e.fillStyle = '#cedc00'),
                e.fillRect(860, 770, 12, 850),
                e.save(),
                e.translate(790, 1200),
                e.rotate(Math.PI / 2),
                (e.font = '900 66px "Arial Black", sans-serif'),
                (e.fillStyle = '#ffffff'),
                (e.textAlign = 'center'),
                (e.textBaseline = 'middle'),
                e.fillText('aramco', 0, 0),
                e.restore(),
                V(e, 1400, 950, 300))
              : l === 'alpine'
                ? ((e.fillStyle = '#0078d0'),
                  e.fillRect(0, 0, o, 110),
                  Z(e, 450, 55, 60),
                  Z(e, 1550, 55, 60),
                  (e.font = '900 48px "Impact", sans-serif'),
                  (e.fillStyle = '#ffffff'),
                  (e.strokeStyle = '#0078d0'),
                  (e.lineWidth = 5),
                  (e.textAlign = 'center'),
                  (e.textBaseline = 'middle'),
                  e.strokeText('10', 320, 160),
                  e.fillText('10', 320, 160),
                  e.strokeText('10', 1728, 160),
                  e.fillText('10', 1728, 160),
                  (e.fillStyle = '#0078d0'),
                  e.fillRect(150, 1550, 1300, 498),
                  (e.fillStyle = '#fd4bc7'),
                  e.beginPath(),
                  e.moveTo(150, 1780),
                  e.bezierCurveTo(450, 1760, 850, 1740, 1450, 1740),
                  e.lineTo(1450, 2048),
                  e.lineTo(150, 2048),
                  e.closePath(),
                  e.fill(),
                  (e.font = '900 100px "Impact", sans-serif'),
                  (e.fillStyle = '#0078d0'),
                  (e.textAlign = 'center'),
                  (e.textBaseline = 'middle'),
                  e.fillText('B W T', 750, 1880),
                  (e.fillStyle = '#0078d0'),
                  e.fillRect(728, 770, 284, 850),
                  (e.fillStyle = '#fd4bc7'),
                  e.fillRect(840, 770, 40, 850),
                  e.save(),
                  e.translate(790, 1200),
                  e.rotate(Math.PI / 2),
                  (e.font = '900 70px "Impact", sans-serif'),
                  (e.fillStyle = '#ffffff'),
                  (e.textAlign = 'center'),
                  (e.textBaseline = 'middle'),
                  e.fillText('B W T', 0, 0),
                  e.restore(),
                  Z(e, 1400, 950, 240))
                : l === 'racingbulls'
                  ? ((e.fillStyle = '#1434cb'),
                    e.fillRect(0, 0, o, 110),
                    L(e, 450, 55, 65),
                    L(e, 1550, 55, 65),
                    (e.font = '900 48px "Impact", sans-serif'),
                    (e.fillStyle = '#00d632'),
                    (e.strokeStyle = '#1434cb'),
                    (e.lineWidth = 5),
                    (e.textAlign = 'center'),
                    (e.textBaseline = 'middle'),
                    e.strokeText('30', 320, 160),
                    e.fillText('30', 320, 160),
                    e.strokeText('30', 1728, 160),
                    e.fillText('30', 1728, 160),
                    (e.fillStyle = '#1434cb'),
                    e.fillRect(150, 1550, 1300, 498),
                    (e.fillStyle = '#ffffff'),
                    e.beginPath(),
                    e.moveTo(150, 1750),
                    e.lineTo(1450, 1720),
                    e.lineTo(1450, 1760),
                    e.lineTo(150, 1790),
                    e.closePath(),
                    e.fill(),
                    (e.font = '900 90px "Impact", sans-serif'),
                    (e.fillStyle = '#ffffff'),
                    (e.textAlign = 'center'),
                    (e.textBaseline = 'middle'),
                    e.fillText('V I S A', 600, 1870),
                    (e.font = '900 42px "Arial Black", sans-serif'),
                    (e.fillStyle = '#00d632'),
                    e.fillText('Cash App', 960, 1870),
                    (e.fillStyle = '#1434cb'),
                    e.fillRect(728, 770, 284, 850),
                    e.save(),
                    e.translate(790, 1200),
                    e.rotate(Math.PI / 2),
                    (e.font = '900 68px "Impact", sans-serif'),
                    (e.fillStyle = '#ffffff'),
                    (e.textAlign = 'center'),
                    (e.textBaseline = 'middle'),
                    e.fillText('V I S A', 0, 0),
                    e.restore(),
                    L(e, 1400, 950, 280))
                  : l === 'williams'
                    ? ((e.fillStyle = '#b87333'),
                      e.fillRect(0, 0, o, 110),
                      (e.fillStyle = '#121417'),
                      e.fillRect(0, 85, o, 25),
                      (e.font = '900 28px "Arial Black", sans-serif'),
                      (e.fillStyle = '#ffffff'),
                      (e.textAlign = 'center'),
                      (e.textBaseline = 'middle'),
                      e.fillText('DURACELL', 450, 50),
                      e.fillText('DURACELL', 1550, 50),
                      (e.font = '900 48px "Impact", sans-serif'),
                      (e.fillStyle = '#ffffff'),
                      (e.strokeStyle = '#001f54'),
                      (e.lineWidth = 5),
                      (e.textAlign = 'center'),
                      (e.textBaseline = 'middle'),
                      e.strokeText('23', 320, 160),
                      e.fillText('23', 320, 160),
                      e.strokeText('23', 1728, 160),
                      e.fillText('23', 1728, 160),
                      (e.fillStyle = '#001f54'),
                      e.fillRect(150, 1550, 1300, 498),
                      (e.strokeStyle = '#00a3e0'),
                      (e.lineWidth = 8),
                      e.beginPath(),
                      e.moveTo(150, 1750),
                      e.lineTo(1450, 1750),
                      e.stroke(),
                      (e.font = '900 56px "Arial Black", sans-serif'),
                      (e.fillStyle = '#ffffff'),
                      (e.textAlign = 'center'),
                      (e.textBaseline = 'middle'),
                      e.fillText('WILLIAMS RACING', 750, 1865),
                      K(e, 1220, 1865, 80),
                      (e.fillStyle = '#001f54'),
                      e.fillRect(728, 770, 284, 850),
                      e.save(),
                      e.translate(790, 1200),
                      e.rotate(Math.PI / 2),
                      (e.font = '900 64px "Arial Black", sans-serif'),
                      (e.fillStyle = '#ffffff'),
                      (e.textAlign = 'center'),
                      (e.textBaseline = 'middle'),
                      e.fillText('KOMATSU', 0, 0),
                      e.restore(),
                      K(e, 1400, 950, 240))
                    : l === 'audi'
                      ? ((e.fillStyle = '#0d0e11'),
                        e.fillRect(0, 0, o, 110),
                        (e.fillStyle = '#52ff00'),
                        e.fillRect(0, 100, o, 10),
                        $(e, 450, 55, 110),
                        $(e, 1550, 55, 110),
                        (e.font = '900 48px "Impact", sans-serif'),
                        (e.fillStyle = '#52ff00'),
                        (e.strokeStyle = '#0d0e11'),
                        (e.lineWidth = 5),
                        (e.textAlign = 'center'),
                        (e.textBaseline = 'middle'),
                        e.strokeText('27', 320, 160),
                        e.fillText('27', 320, 160),
                        e.strokeText('27', 1728, 160),
                        e.fillText('27', 1728, 160),
                        (e.fillStyle = '#0d0e11'),
                        e.fillRect(150, 1550, 1300, 498),
                        (e.fillStyle = '#52ff00'),
                        e.beginPath(),
                        e.moveTo(150, 1780),
                        e.bezierCurveTo(450, 1750, 850, 1720, 1450, 1720),
                        e.lineTo(1450, 1780),
                        e.bezierCurveTo(850, 1780, 450, 1810, 150, 1840),
                        e.closePath(),
                        e.fill(),
                        (e.font = '900 90px "Impact", sans-serif'),
                        (e.fillStyle = '#ffffff'),
                        (e.textAlign = 'center'),
                        (e.textBaseline = 'middle'),
                        e.fillText('Stake', 620, 1870),
                        (e.font = '900 70px "Impact", sans-serif'),
                        (e.fillStyle = '#52ff00'),
                        e.fillText('KICK', 980, 1870),
                        (e.fillStyle = '#0d0e11'),
                        e.fillRect(728, 770, 284, 850),
                        (e.fillStyle = '#52ff00'),
                        e.fillRect(850, 770, 20, 850),
                        e.save(),
                        e.translate(790, 1200),
                        e.rotate(Math.PI / 2),
                        (e.font = '900 68px "Impact", sans-serif'),
                        (e.fillStyle = '#ffffff'),
                        (e.textAlign = 'center'),
                        (e.textBaseline = 'middle'),
                        e.fillText('Stake', 0, 0),
                        e.restore(),
                        $(e, 1400, 950, 320))
                      : l === 'haas'
                        ? ((e.fillStyle = '#121417'),
                          e.fillRect(0, 0, o, 110),
                          (e.fillStyle = '#e10600'),
                          e.fillRect(0, 102, o, 8),
                          Y(e, 450, 55, 55),
                          Y(e, 1550, 55, 55),
                          (e.font = '900 48px "Impact", sans-serif'),
                          (e.fillStyle = '#e10600'),
                          (e.strokeStyle = '#ffffff'),
                          (e.lineWidth = 5),
                          (e.textAlign = 'center'),
                          (e.textBaseline = 'middle'),
                          e.strokeText('87', 320, 160),
                          e.fillText('87', 320, 160),
                          e.strokeText('87', 1728, 160),
                          e.fillText('87', 1728, 160),
                          (e.fillStyle = '#ffffff'),
                          e.fillRect(150, 1550, 1300, 498),
                          (e.fillStyle = '#121417'),
                          e.fillRect(150, 1780, 1300, 268),
                          N0(e, 360, 1870, 70),
                          (e.font = '900 82px "Arial Black", sans-serif'),
                          (e.fillStyle = '#ffffff'),
                          (e.textAlign = 'center'),
                          (e.textBaseline = 'middle'),
                          e.fillText('MoneyGram', 780, 1870),
                          (e.fillStyle = '#121417'),
                          e.fillRect(728, 770, 284, 850),
                          e.save(),
                          e.translate(790, 1200),
                          e.rotate(Math.PI / 2),
                          (e.font = '900 62px "Arial Black", sans-serif'),
                          (e.fillStyle = '#ffffff'),
                          (e.textAlign = 'center'),
                          (e.textBaseline = 'middle'),
                          e.fillText('MoneyGram', 0, 0),
                          e.restore(),
                          Y(e, 1400, 950, 200))
                        : l === 'cadillac'
                          ? ((e.fillStyle = '#0a0b0d'),
                            e.fillRect(0, 0, o, 110),
                            (e.fillStyle = '#d4af37'),
                            e.fillRect(0, 104, o, 6),
                            j(e, 450, 55, 60),
                            j(e, 1550, 55, 60),
                            (e.font = '900 48px "Impact", sans-serif'),
                            (e.fillStyle = '#d4af37'),
                            (e.strokeStyle = '#0a0b0d'),
                            (e.lineWidth = 5),
                            (e.textAlign = 'center'),
                            (e.textBaseline = 'middle'),
                            e.strokeText('11', 320, 160),
                            e.fillText('11', 320, 160),
                            e.strokeText('11', 1728, 160),
                            e.fillText('11', 1728, 160),
                            (e.fillStyle = '#0a0b0d'),
                            e.fillRect(150, 1550, 1300, 498),
                            (e.strokeStyle = '#d4af37'),
                            (e.lineWidth = 8),
                            e.beginPath(),
                            e.moveTo(150, 1750),
                            e.lineTo(1450, 1750),
                            e.stroke(),
                            (e.font = 'italic 700 84px "Times New Roman", serif'),
                            (e.fillStyle = '#ffffff'),
                            (e.textAlign = 'center'),
                            (e.textBaseline = 'middle'),
                            e.fillText('Cadillac', 640, 1865),
                            (e.font = '900 32px "Arial Black", sans-serif'),
                            (e.fillStyle = '#d4af37'),
                            e.fillText('V - S E R I E S', 1040, 1865),
                            (e.fillStyle = '#0a0b0d'),
                            e.fillRect(728, 770, 284, 850),
                            e.save(),
                            e.translate(790, 1200),
                            e.rotate(Math.PI / 2),
                            (e.font = 'italic 700 66px "Times New Roman", serif'),
                            (e.fillStyle = '#ffffff'),
                            (e.textAlign = 'center'),
                            (e.textBaseline = 'middle'),
                            e.fillText('Cadillac', 0, 0),
                            e.restore(),
                            j(e, 1400, 950, 220))
                          : ((e.fillStyle = r.bodyColor || '#141619'),
                            e.fillRect(0, 0, o, f),
                            (e.font = '900 90px "Arial Black", sans-serif'),
                            (e.fillStyle = '#ffffff'),
                            (e.textAlign = 'center'),
                            e.fillText(String(l).toUpperCase(), 750, 1860));
  });
}
function Se(l, r, a) {
  return z(1024, 1024, (e, o, f) => {
    const i = r.bodyColor || '#e8002d',
      h = r.accentColor || '#ffffff';
    X(e, o, f, '#1a1e24', 0.22);
    const S = e.createLinearGradient(0, 460, 0, 1740);
    (S.addColorStop(0, `${i}2e`),
      S.addColorStop(0.5, 'rgba(0,0,0,0.0)'),
      S.addColorStop(1, 'rgba(0,0,0,0.25)'),
      (e.fillStyle = S),
      e.fillRect(0, 460, o, 1280),
      (e.fillStyle = '#15181d'),
      e.fillRect(0, 40, o, 220),
      e.fillRect(0, 1740, o, 180),
      (e.fillStyle = i),
      e.fillRect(0, 40, o, 10),
      e.fillRect(0, 250, o, 10),
      e.fillRect(0, 1740, o, 10),
      e.fillRect(0, 1910, o, 10),
      (e.fillStyle = h),
      e.fillRect(0, 260, o, 14),
      e.fillRect(0, 1920, o, 14));
    const n = e.createLinearGradient(0, 40, 0, 260);
    (n.addColorStop(0, 'rgba(255, 255, 255, 0.18)'),
      n.addColorStop(0.5, 'rgba(0, 0, 0, 0.0)'),
      n.addColorStop(1, 'rgba(0, 0, 0, 0.35)'),
      (e.fillStyle = n),
      e.fillRect(0, 40, o, 220));
    const s = (g, t, u, T) => {
        (e.save(), e.translate(g, t), e.rotate(Math.PI / 2), T(), e.restore());
      },
      p = (g, t, u = '#0a0b0e') => {
        ((e.fillStyle = g),
          e.beginPath(),
          e.roundRect(-485, -55, 150, 110, 8),
          e.fill(),
          (e.fillStyle = t),
          e.fillRect(-485, -55, 16, 110),
          (e.fillStyle = g),
          e.beginPath(),
          e.roundRect(335, -55, 150, 110, 8),
          e.fill(),
          (e.fillStyle = t),
          e.fillRect(469, -55, 16, 110),
          (e.fillStyle = u),
          e.fillRect(-485, -24, 150, 12),
          e.fillRect(-485, 14, 150, 12),
          e.fillRect(335, -24, 150, 12),
          e.fillRect(335, 14, 150, 12),
          (e.strokeStyle = t),
          (e.lineWidth = 4.5),
          e.beginPath(),
          e.moveTo(-335, 48),
          e.quadraticCurveTo(-160, 52, 0, 50),
          e.quadraticCurveTo(160, 52, 335, 48),
          e.stroke());
      },
      m = (g = '#0e1115', t = '#252a32') => {
        ((e.fillStyle = g),
          e.beginPath(),
          e.roundRect(-24, -48, 48, 72, [14, 14, 4, 4]),
          e.fill(),
          (e.strokeStyle = t),
          (e.lineWidth = 2.5),
          e.stroke());
      };
    l === 'mercedes'
      ? ((e.fillStyle = '#0a0b0e'),
        e.fillRect(275, 720, 175, 1010),
        (e.fillStyle = '#00a19c'),
        e.fillRect(418, 720, 24, 1010),
        (e.fillStyle = '#00f5d4'),
        e.fillRect(436, 720, 6, 1010),
        s(355, 1225, '#0a0b0e', () => {
          (p('#00a19c', '#00f5d4', '#0a0b0e'),
            (e.font = '900 92px "Impact", "Arial Black", sans-serif'),
            (e.fillStyle = '#ffffff'),
            (e.textAlign = 'center'),
            (e.textBaseline = 'middle'),
            e.fillText('P E T R O N A S', 0, -4),
            m('#0e1115', '#252a32'));
        }),
        (e.fillStyle = '#0a0b0e'),
        e.fillRect(680, 720, 210, 1010),
        (e.fillStyle = '#00a19c'),
        e.fillRect(860, 720, 16, 1010),
        s(785, 1240, '#0a0b0e', () => {
          ((e.font = '900 74px "Impact", "Arial Black", sans-serif'),
            (e.fillStyle = '#ffffff'),
            (e.textAlign = 'center'),
            (e.textBaseline = 'middle'),
            e.fillText('P E T R O N A S', 0, 0),
            O(e, -380, 0, 24),
            O(e, 380, 0, 24));
        }),
        (e.fillStyle = '#0a0b0d'),
        e.fillRect(1074, 934, 220, 310),
        e.fillRect(870, 720, 308, 218),
        T0(e, 990, 830, 36),
        (e.font = '800 28px "Arial", sans-serif'),
        (e.fillStyle = '#ffffff'),
        (e.textAlign = 'center'),
        e.fillText('TeamViewer', 1184, 1080),
        (e.strokeStyle = '#00a19c'),
        (e.lineWidth = 14),
        e.beginPath(),
        e.moveTo(40, 200),
        e.lineTo(40, 850),
        e.moveTo(1800, 200),
        e.lineTo(1800, 850),
        e.stroke(),
        (e.font = '900 52px "Impact", sans-serif'),
        (e.fillStyle = '#ffffff'),
        e.fillText('PETRONAS', 220, 520),
        e.fillText('PETRONAS', 1650, 520))
      : l === 'ferrari'
        ? ((e.fillStyle = '#101216'),
          e.fillRect(275, 720, 175, 1010),
          (e.fillStyle = '#ffffff'),
          e.fillRect(426, 720, 10, 1010),
          (e.fillStyle = '#ffdf00'),
          e.fillRect(436, 720, 8, 1010),
          s(355, 1225, '#101216', () => {
            (p('#ffdf00', '#ffffff', '#101216'),
              (e.font = 'italic 900 96px "Times New Roman", serif'),
              (e.fillStyle = '#ffffff'),
              (e.textAlign = 'center'),
              (e.textBaseline = 'middle'),
              e.fillText('Ferrari', 0, -8),
              (e.font = '900 22px "Arial Black", sans-serif'),
              (e.fillStyle = '#ffdf00'),
              e.fillText('SCUDERIA FERRARI HP', 0, 44),
              m('#1a1c20', '#ffdf00'));
          }),
          (e.fillStyle = '#101216'),
          e.fillRect(680, 720, 210, 1010),
          s(785, 1240, '#101216', () => {
            ((e.font = '900 74px "Arial Black", sans-serif'),
              (e.fillStyle = '#ffffff'),
              (e.textAlign = 'center'),
              (e.textBaseline = 'middle'),
              e.fillText('Santander', 0, 0),
              q(e, -380, 0, 44),
              q(e, 380, 0, 44));
          }),
          (e.fillStyle = '#101216'),
          e.fillRect(1074, 934, 220, 310),
          e.fillRect(870, 720, 308, 218),
          (e.font = '900 34px "Arial Black", sans-serif'),
          (e.fillStyle = '#ffffff'),
          (e.textAlign = 'center'),
          e.fillText('Santander', 1184, 1080),
          L0(e, 1024, 830, 48),
          (e.strokeStyle = '#ffdf00'),
          (e.lineWidth = 12),
          e.beginPath(),
          e.moveTo(40, 200),
          e.lineTo(40, 850),
          e.moveTo(1800, 200),
          e.lineTo(1800, 850),
          e.stroke(),
          (e.font = '900 52px "Arial Black", sans-serif'),
          (e.fillStyle = '#ffffff'),
          e.fillText('Santander', 220, 520),
          e.fillText('Santander', 1650, 520))
        : l === 'redbull'
          ? ((e.fillStyle = '#030a1c'),
            e.fillRect(275, 720, 175, 1010),
            (e.fillStyle = '#ffce00'),
            e.fillRect(426, 720, 12, 1010),
            (e.fillStyle = '#ed1a3b'),
            e.fillRect(438, 720, 6, 1010),
            s(355, 1225, '#030a1c', () => {
              (p('#ffce00', '#ed1a3b', '#030a1c'),
                (e.font = '900 88px "Impact", sans-serif'),
                (e.fillStyle = '#ffffff'),
                (e.textAlign = 'center'),
                (e.textBaseline = 'middle'),
                e.fillText('O R A C L E', 0, -8),
                (e.font = '900 24px "Arial Black", sans-serif'),
                (e.fillStyle = '#ffce00'),
                e.fillText('RED BULL RACING', 0, 44),
                m('#020612', '#ffce00'));
            }),
            (e.fillStyle = '#030a1c'),
            e.fillRect(680, 720, 210, 1010),
            s(785, 1240, '#030a1c', () => {
              ((e.font = '900 80px "Impact", sans-serif'),
                (e.fillStyle = '#ffffff'),
                (e.textAlign = 'center'),
                (e.textBaseline = 'middle'),
                e.fillText('Red Bull', 0, 0),
                L(e, -380, 0, 85),
                L(e, 380, 0, 85));
            }),
            (e.fillStyle = '#030a1c'),
            e.fillRect(1074, 934, 220, 310),
            e.fillRect(870, 720, 308, 218),
            (e.font = '800 32px "Arial Black", sans-serif'),
            (e.fillStyle = '#ffffff'),
            (e.textAlign = 'center'),
            e.fillText('Mobil 1', 1184, 1080),
            e.fillText('Oracle', 1024, 830),
            (e.strokeStyle = '#ffce00'),
            (e.lineWidth = 14),
            e.beginPath(),
            e.moveTo(40, 200),
            e.lineTo(40, 850),
            e.moveTo(1800, 200),
            e.lineTo(1800, 850),
            e.stroke(),
            (e.font = '900 52px "Impact", sans-serif'),
            (e.fillStyle = '#ffffff'),
            e.fillText('BYBIT', 220, 520),
            e.fillText('BYBIT', 1650, 520))
          : l === 'mclaren'
            ? ((e.fillStyle = '#ff8000'),
              e.fillRect(275, 720, 175, 1010),
              (e.fillStyle = '#141619'),
              e.fillRect(426, 720, 18, 1010),
              s(355, 1225, '#ff8000', () => {
                (p('#141619', '#ffffff', '#ff8000'),
                  (e.font = '900 100px "Impact", sans-serif'),
                  (e.fillStyle = '#141619'),
                  (e.textAlign = 'center'),
                  (e.textBaseline = 'middle'),
                  e.fillText('O K X', 0, 0),
                  m('#141619', '#ff8000'));
              }),
              (e.fillStyle = '#141619'),
              e.fillRect(680, 720, 210, 1010),
              (e.fillStyle = '#ff8000'),
              e.fillRect(860, 720, 16, 1010),
              s(785, 1240, '#141619', () => {
                ((e.font = '900 80px "Impact", sans-serif'),
                  (e.fillStyle = '#ffffff'),
                  (e.textAlign = 'center'),
                  (e.textBaseline = 'middle'),
                  e.fillText('M c L A R E N', 0, 0),
                  r0(e, -380, 0, 50),
                  r0(e, 380, 0, 50));
              }),
              (e.fillStyle = '#141619'),
              e.fillRect(1074, 934, 220, 310),
              e.fillRect(870, 720, 308, 218),
              t0(e, 1184, 1080, 32),
              (e.font = '900 32px "Impact", sans-serif'),
              (e.fillStyle = '#ff8000'),
              (e.textAlign = 'center'),
              e.fillText('OKX', 1024, 830),
              (e.strokeStyle = '#ff8000'),
              (e.lineWidth = 14),
              e.beginPath(),
              e.moveTo(40, 200),
              e.lineTo(40, 850),
              e.moveTo(1800, 200),
              e.lineTo(1800, 850),
              e.stroke(),
              (e.font = '900 52px "Impact", sans-serif'),
              (e.fillStyle = '#ffffff'),
              e.fillText('McLAREN', 220, 520),
              e.fillText('McLAREN', 1650, 520))
            : l === 'astonmartin'
              ? ((e.fillStyle = '#00594f'),
                e.fillRect(275, 720, 175, 1010),
                (e.fillStyle = '#cedc00'),
                e.fillRect(426, 720, 18, 1010),
                s(355, 1225, '#00594f', () => {
                  (p('#cedc00', '#ffffff', '#00594f'),
                    (e.font = '900 80px "Arial Black", sans-serif'),
                    (e.fillStyle = '#ffffff'),
                    (e.textAlign = 'center'),
                    (e.textBaseline = 'middle'),
                    e.fillText('ASTON MARTIN', 0, -8),
                    (e.font = '900 26px "Arial Black", sans-serif'),
                    (e.fillStyle = '#cedc00'),
                    e.fillText('aramco', 0, 44),
                    m('#003831', '#cedc00'));
                }),
                (e.fillStyle = '#00594f'),
                e.fillRect(680, 720, 210, 1010),
                s(785, 1240, '#00594f', () => {
                  ((e.font = '900 82px "Arial Black", sans-serif'),
                    (e.fillStyle = '#ffffff'),
                    (e.textAlign = 'center'),
                    (e.textBaseline = 'middle'),
                    e.fillText('aramco', 0, 0),
                    V(e, -380, 0, 100),
                    V(e, 380, 0, 100));
                }),
                (e.fillStyle = '#00594f'),
                e.fillRect(1074, 934, 220, 310),
                e.fillRect(870, 720, 308, 218),
                (e.font = '900 32px "Arial Black", sans-serif'),
                (e.fillStyle = '#ffffff'),
                (e.textAlign = 'center'),
                e.fillText('aramco', 1184, 1080),
                (e.fillStyle = '#cedc00'),
                e.fillText('Cognizant', 1024, 830),
                (e.strokeStyle = '#cedc00'),
                (e.lineWidth = 14),
                e.beginPath(),
                e.moveTo(40, 200),
                e.lineTo(40, 850),
                e.moveTo(1800, 200),
                e.lineTo(1800, 850),
                e.stroke(),
                (e.font = '900 48px "Arial Black", sans-serif'),
                (e.fillStyle = '#ffffff'),
                e.fillText('aramco', 220, 520),
                e.fillText('aramco', 1650, 520))
              : l === 'alpine'
                ? ((e.fillStyle = '#fd4bc7'),
                  e.fillRect(275, 720, 175, 1010),
                  (e.fillStyle = '#0078d0'),
                  e.fillRect(426, 720, 18, 1010),
                  s(355, 1225, '#fd4bc7', () => {
                    (p('#0078d0', '#ffffff', '#fd4bc7'),
                      (e.font = '900 105px "Impact", sans-serif'),
                      (e.fillStyle = '#0078d0'),
                      (e.textAlign = 'center'),
                      (e.textBaseline = 'middle'),
                      e.fillText('B W T', 0, 0),
                      m('#0078d0', '#ffffff'));
                  }),
                  (e.fillStyle = '#0078d0'),
                  e.fillRect(680, 720, 210, 1010),
                  s(785, 1240, '#0078d0', () => {
                    ((e.font = '900 84px "Impact", sans-serif'),
                      (e.fillStyle = '#ffffff'),
                      (e.textAlign = 'center'),
                      (e.textBaseline = 'middle'),
                      e.fillText('A L P I N E', 0, 0),
                      Z(e, -380, 0, 48),
                      Z(e, 380, 0, 48));
                  }),
                  (e.fillStyle = '#0078d0'),
                  e.fillRect(1074, 934, 220, 310),
                  e.fillRect(870, 720, 308, 218),
                  (e.font = '900 34px "Impact", sans-serif'),
                  (e.fillStyle = '#fd4bc7'),
                  (e.textAlign = 'center'),
                  e.fillText('BWT', 1184, 1080),
                  Z(e, 1024, 830, 42),
                  (e.strokeStyle = '#fd4bc7'),
                  (e.lineWidth = 14),
                  e.beginPath(),
                  e.moveTo(40, 200),
                  e.lineTo(40, 850),
                  e.moveTo(1800, 200),
                  e.lineTo(1800, 850),
                  e.stroke(),
                  (e.font = '900 52px "Impact", sans-serif'),
                  (e.fillStyle = '#ffffff'),
                  e.fillText('ALPINE', 220, 520),
                  e.fillText('ALPINE', 1650, 520))
                : l === 'racingbulls'
                  ? ((e.fillStyle = '#1434cb'),
                    e.fillRect(275, 720, 175, 1010),
                    (e.fillStyle = '#00d632'),
                    e.fillRect(426, 720, 18, 1010),
                    s(355, 1225, '#1434cb', () => {
                      (p('#ffffff', '#00d632', '#1434cb'),
                        (e.font = '900 96px "Impact", sans-serif'),
                        (e.fillStyle = '#ffffff'),
                        (e.textAlign = 'center'),
                        (e.textBaseline = 'middle'),
                        e.fillText('V I S A', 0, -8),
                        (e.font = '900 30px "Arial Black", sans-serif'),
                        (e.fillStyle = '#00d632'),
                        e.fillText('Cash App', 0, 44),
                        m('#0e1f7a', '#00d632'));
                    }),
                    (e.fillStyle = '#1434cb'),
                    e.fillRect(680, 720, 210, 1010),
                    s(785, 1240, '#1434cb', () => {
                      ((e.font = '900 82px "Arial Black", sans-serif'),
                        (e.fillStyle = '#00d632'),
                        (e.textAlign = 'center'),
                        (e.textBaseline = 'middle'),
                        e.fillText('Cash App', 0, 0),
                        L(e, -380, 0, 75),
                        L(e, 380, 0, 75));
                    }),
                    (e.fillStyle = '#1434cb'),
                    e.fillRect(1074, 934, 220, 310),
                    e.fillRect(870, 720, 308, 218),
                    (e.font = '900 32px "Impact", sans-serif'),
                    (e.fillStyle = '#ffffff'),
                    (e.textAlign = 'center'),
                    e.fillText('HUGO', 1184, 1080),
                    (e.fillStyle = '#00d632'),
                    e.fillText('Cash App', 1024, 830),
                    (e.strokeStyle = '#00d632'),
                    (e.lineWidth = 14),
                    e.beginPath(),
                    e.moveTo(40, 200),
                    e.lineTo(40, 850),
                    e.moveTo(1800, 200),
                    e.lineTo(1800, 850),
                    e.stroke(),
                    (e.font = '900 52px "Impact", sans-serif'),
                    (e.fillStyle = '#ffffff'),
                    e.fillText('VISA', 220, 520),
                    e.fillText('VISA', 1650, 520))
                  : l === 'williams'
                    ? ((e.fillStyle = '#001f54'),
                      e.fillRect(275, 720, 175, 1010),
                      (e.fillStyle = '#00a3e0'),
                      e.fillRect(426, 720, 18, 1010),
                      s(355, 1225, '#001f54', () => {
                        (p('#00a3e0', '#ffffff', '#001f54'),
                          (e.font = '900 88px "Impact", sans-serif'),
                          (e.fillStyle = '#ffffff'),
                          (e.textAlign = 'center'),
                          (e.textBaseline = 'middle'),
                          e.fillText('W I L L I A M S', 0, -8),
                          (e.font = '900 26px "Arial Black", sans-serif'),
                          (e.fillStyle = '#00a3e0'),
                          e.fillText('R A C I N G', 0, 44),
                          m('#001133', '#00a3e0'));
                      }),
                      (e.fillStyle = '#001f54'),
                      e.fillRect(680, 720, 210, 1010),
                      s(785, 1240, '#001f54', () => {
                        ((e.font = '900 78px "Impact", sans-serif'),
                          (e.fillStyle = '#ffffff'),
                          (e.textAlign = 'center'),
                          (e.textBaseline = 'middle'),
                          e.fillText('KOMATSU', 0, 0),
                          K(e, -380, 0, 48),
                          K(e, 380, 0, 48));
                      }),
                      (e.fillStyle = '#001f54'),
                      e.fillRect(1074, 934, 220, 310),
                      e.fillRect(870, 720, 308, 218),
                      (e.font = '900 28px "Arial Black", sans-serif'),
                      (e.fillStyle = '#b87333'),
                      (e.textAlign = 'center'),
                      e.fillText('DURACELL', 1184, 1080),
                      (e.fillStyle = '#00a3e0'),
                      e.fillText('KOMATSU', 1024, 830),
                      (e.strokeStyle = '#00a3e0'),
                      (e.lineWidth = 14),
                      e.beginPath(),
                      e.moveTo(40, 200),
                      e.lineTo(40, 850),
                      e.moveTo(1800, 200),
                      e.lineTo(1800, 850),
                      e.stroke(),
                      (e.font = '900 52px "Impact", sans-serif'),
                      (e.fillStyle = '#ffffff'),
                      e.fillText('WILLIAMS', 220, 520),
                      e.fillText('WILLIAMS', 1650, 520))
                    : l === 'audi'
                      ? ((e.fillStyle = '#52ff00'),
                        e.fillRect(275, 720, 175, 1010),
                        (e.fillStyle = '#0d0e11'),
                        e.fillRect(426, 720, 18, 1010),
                        s(355, 1225, '#52ff00', () => {
                          (p('#0d0e11', '#ffffff', '#52ff00'),
                            (e.font = '900 100px "Impact", sans-serif'),
                            (e.fillStyle = '#0d0e11'),
                            (e.textAlign = 'center'),
                            (e.textBaseline = 'middle'),
                            e.fillText('K I C K', 0, 0),
                            m('#0d0e11', '#52ff00'));
                        }),
                        (e.fillStyle = '#0d0e11'),
                        e.fillRect(680, 720, 210, 1010),
                        s(785, 1240, '#0d0e11', () => {
                          ((e.font = '900 82px "Impact", sans-serif'),
                            (e.fillStyle = '#52ff00'),
                            (e.textAlign = 'center'),
                            (e.textBaseline = 'middle'),
                            e.fillText('S T A K E', 0, 0),
                            $(e, -380, 0, 110),
                            $(e, 380, 0, 110));
                        }),
                        (e.fillStyle = '#52ff00'),
                        e.fillRect(1074, 934, 220, 310),
                        e.fillRect(870, 720, 308, 218),
                        (e.font = '900 34px "Impact", sans-serif'),
                        (e.fillStyle = '#0d0e11'),
                        (e.textAlign = 'center'),
                        e.fillText('Stake', 1184, 1080),
                        e.fillText('KICK', 1024, 830),
                        (e.strokeStyle = '#52ff00'),
                        (e.lineWidth = 14),
                        e.beginPath(),
                        e.moveTo(40, 200),
                        e.lineTo(40, 850),
                        e.moveTo(1800, 200),
                        e.lineTo(1800, 850),
                        e.stroke(),
                        (e.font = '900 52px "Impact", sans-serif'),
                        (e.fillStyle = '#0d0e11'),
                        e.fillText('KICK', 220, 520),
                        e.fillText('KICK', 1650, 520))
                      : l === 'haas'
                        ? ((e.fillStyle = '#e10600'),
                          e.fillRect(275, 720, 175, 1010),
                          (e.fillStyle = '#ffffff'),
                          e.fillRect(426, 720, 18, 1010),
                          s(355, 1225, '#e10600', () => {
                            (p('#ffffff', '#e10600', '#e10600'),
                              (e.font = '900 92px "Impact", sans-serif'),
                              (e.fillStyle = '#ffffff'),
                              (e.textAlign = 'center'),
                              (e.textBaseline = 'middle'),
                              e.fillText('H A A S', 0, 0),
                              m('#7a0500', '#ffffff'));
                          }),
                          (e.fillStyle = '#ffffff'),
                          e.fillRect(680, 720, 210, 1010),
                          s(785, 1240, '#ffffff', () => {
                            ((e.font = '900 82px "Impact", sans-serif'),
                              (e.fillStyle = '#e10600'),
                              (e.textAlign = 'center'),
                              (e.textBaseline = 'middle'),
                              e.fillText('H A A S', 0, 0),
                              Y(e, -380, 0, 50),
                              Y(e, 380, 0, 50));
                          }),
                          (e.fillStyle = '#121417'),
                          e.fillRect(1074, 934, 220, 310),
                          e.fillRect(870, 720, 308, 218),
                          Y(e, 1184, 1080, 50),
                          (e.font = '900 28px "Arial Black", sans-serif'),
                          (e.fillStyle = '#ffffff'),
                          (e.textAlign = 'center'),
                          e.fillText('MoneyGram', 1024, 830),
                          (e.strokeStyle = '#e10600'),
                          (e.lineWidth = 14),
                          e.beginPath(),
                          e.moveTo(40, 200),
                          e.lineTo(40, 850),
                          e.moveTo(1800, 200),
                          e.lineTo(1800, 850),
                          e.stroke(),
                          (e.font = '900 52px "Impact", sans-serif'),
                          (e.fillStyle = '#ffffff'),
                          e.fillText('HAAS', 220, 520),
                          e.fillText('HAAS', 1650, 520))
                        : l === 'cadillac'
                          ? ((e.fillStyle = '#0b0c0e'),
                            e.fillRect(275, 720, 175, 1010),
                            (e.fillStyle = '#d4af37'),
                            e.fillRect(426, 720, 18, 1010),
                            s(355, 1225, '#0b0c0e', () => {
                              (p('#d4af37', '#ffffff', '#0b0c0e'),
                                (e.font = 'italic 700 88px "Times New Roman", serif'),
                                (e.fillStyle = '#ffffff'),
                                (e.textAlign = 'center'),
                                (e.textBaseline = 'middle'),
                                e.fillText('Cadillac', 0, -8),
                                (e.font = '700 26px "Arial", sans-serif'),
                                (e.fillStyle = '#d4af37'),
                                e.fillText('V - S E R I E S', 0, 44),
                                m('#0b0c0e', '#d4af37'));
                            }),
                            (e.fillStyle = '#0b0c0e'),
                            e.fillRect(680, 720, 210, 1010),
                            s(785, 1240, '#0b0c0e', () => {
                              ((e.font = '900 76px "Arial Black", sans-serif'),
                                (e.fillStyle = '#d4af37'),
                                (e.textAlign = 'center'),
                                (e.textBaseline = 'middle'),
                                e.fillText('CADILLAC RACING', 0, 0),
                                j(e, -380, 0, 50),
                                j(e, 380, 0, 50));
                            }),
                            (e.fillStyle = '#0b0c0e'),
                            e.fillRect(1074, 934, 220, 310),
                            e.fillRect(870, 720, 308, 218),
                            j(e, 1184, 1080, 46),
                            j(e, 1024, 830, 46),
                            (e.strokeStyle = '#d4af37'),
                            (e.lineWidth = 14),
                            e.beginPath(),
                            e.moveTo(40, 200),
                            e.lineTo(40, 850),
                            e.moveTo(1800, 200),
                            e.lineTo(1800, 850),
                            e.stroke(),
                            (e.font = 'italic 700 48px "Times New Roman", serif'),
                            (e.fillStyle = '#ffffff'),
                            e.fillText('Cadillac', 220, 520),
                            e.fillText('Cadillac', 1650, 520))
                          : ((e.fillStyle = r.wingColor || '#0a0b0e'),
                            e.fillRect(275, 720, 175, 1010),
                            e.fillRect(680, 720, 210, 1010),
                            s(355, 1225, '#0a0b0e', () => {
                              ((e.font = '900 80px "Arial Black", sans-serif'),
                                (e.fillStyle = '#ffffff'),
                                (e.textAlign = 'center'),
                                (e.textBaseline = 'middle'),
                                e.fillText(String(l).toUpperCase(), 0, 0));
                            }));
    {
      const g = ((a == null ? void 0 : a.rearWingText) || r.teamName || String(l)).toUpperCase(),
        t = ((a == null ? void 0 : a.rearWingSub) || '').toUpperCase(),
        u = (a == null ? void 0 : a.rearWingAccent) || r.accentColor || '#ffffff';
      [
        { x: 460, w: 200 },
        { x: 900, w: 160 },
      ].forEach(({ x: y, w: c }) => {
        ((e.fillStyle = i),
          e.fillRect(y, 470, c, 240),
          (e.fillStyle = u),
          e.fillRect(y, 690, c, 12),
          e.save(),
          e.translate(y + c / 2, 590),
          e.rotate(Math.PI / 2),
          (e.font = '900 64px "Impact", "Arial Black", sans-serif'),
          (e.fillStyle = '#ffffff'),
          (e.strokeStyle = 'rgba(0,0,0,0.55)'),
          (e.lineWidth = 5),
          (e.textAlign = 'center'),
          (e.textBaseline = 'middle'),
          e.strokeText(g, 0, t ? -22 : 0),
          e.fillText(g, 0, t ? -22 : 0),
          t &&
            ((e.font = '900 30px "Arial Black", sans-serif'),
            (e.fillStyle = u),
            e.fillText(t, 0, 42)),
          e.restore());
      });
      const b = (y, c, C) => {
        switch (l) {
          case 'ferrari':
            i0(e, y, c, C);
            break;
          case 'mercedes':
            O(e, y, c, C * 0.55);
            break;
          case 'redbull':
          case 'racingbulls':
            L(e, y, c, C * 0.9);
            break;
          case 'mclaren':
            r0(e, y, c, C * 0.8);
            break;
          case 'astonmartin':
            V(e, y, c, C * 1.1);
            break;
          case 'alpine':
            Z(e, y, c, C * 0.7);
            break;
          case 'williams':
            K(e, y, c, C * 0.7);
            break;
          case 'audi':
            $(e, y, c, C * 1.1);
            break;
          case 'haas':
            Y(e, y, c, C * 0.7);
            break;
          case 'cadillac':
            j(e, y, c, C * 0.7);
            break;
        }
      };
      (b(1184, 985, 150), b(930, 830, 124));
    }
  });
}
function ue(l, r) {
  return z(512, 512, (a, e, o) => {
    const f = r.floorColor || '#0a0b0d',
      i = f.toLowerCase() === '#0a0b0d' || f.toLowerCase() === '#08090b' ? '#2b313a' : f;
    (X(a, e, o, i, 0.28), a.save());
    const h = a.createLinearGradient(0, 0, e * 0.45, 0);
    (h.addColorStop(0, 'rgba(0, 0, 0, 0.6)'),
      h.addColorStop(0.5, 'rgba(255, 255, 255, 0.03)'),
      h.addColorStop(1, 'rgba(0, 0, 0, 0.4)'),
      (a.fillStyle = h),
      a.fillRect(80, 60, e * 0.38, o - 120));
    const S = a.createLinearGradient(e * 0.55, 0, e, 0);
    (S.addColorStop(0, 'rgba(0, 0, 0, 0.4)'),
      S.addColorStop(0.5, 'rgba(255, 255, 255, 0.03)'),
      S.addColorStop(1, 'rgba(0, 0, 0, 0.6)'),
      (a.fillStyle = S),
      a.fillRect(e * 0.54, 60, e * 0.38, o - 120));
    const n = r.floorEdgeAccentColor || r.accentColor || '#ff0033',
      s = r.highlightColor || '#ffffff';
    ((a.fillStyle = n),
      a.fillRect(16, 80, 24, o - 160),
      (a.fillStyle = s),
      a.fillRect(44, 100, 8, o - 200),
      (a.fillStyle = n),
      a.fillRect(e - 40, 80, 24, o - 160),
      (a.fillStyle = s),
      a.fillRect(e - 52, 100, 8, o - 200),
      (a.fillStyle = '#050608'));
    for (let b = 140; b < o - 160; b += 48)
      (a.fillRect(12, b, 12, 18), a.fillRect(e - 24, b, 12, 18));
    const p = Math.round(e * 0.47),
      m = Math.round(e * 0.06),
      g = 80,
      t = o - 160,
      u = a.createLinearGradient(p, 0, p + m, 0);
    (u.addColorStop(0, '#3d2a14'),
      u.addColorStop(0.2, '#5a3d20'),
      u.addColorStop(0.5, '#6b4c28'),
      u.addColorStop(0.8, '#5a3d20'),
      u.addColorStop(1, '#33220f'),
      (a.fillStyle = u),
      a.fillRect(p, g, m, t),
      (a.strokeStyle = 'rgba(0, 0, 0, 0.15)'),
      (a.lineWidth = 1));
    for (let b = p + 6; b < p + m; b += 8)
      (a.beginPath(), a.moveTo(b, g), a.lineTo(b, g + t), a.stroke());
    const T = (b, y, c, C) => {
      const k = a.createLinearGradient(b, y, b + c, y + C);
      (k.addColorStop(0, '#8a7326'),
        k.addColorStop(0.5, '#6e5c1e'),
        k.addColorStop(1, '#4a3e14'),
        (a.fillStyle = k),
        a.fillRect(b, y, c, C),
        (a.strokeStyle = '#2a2410'),
        (a.lineWidth = 1.5),
        a.strokeRect(b, y, c, C),
        (a.fillStyle = '#1a1d22'),
        [
          [b + 8, y + C * 0.5],
          [b + c - 8, y + C * 0.5],
        ].forEach(([M, I]) => {
          (a.beginPath(), a.arc(M, I, 3, 0, Math.PI * 2), a.fill());
        }));
    };
    (T(p + 4, g + 20, m - 8, 20),
      T(p + 4, g + t - 40, m - 8, 20),
      (a.font = 'bold 12px "Courier New", monospace'),
      (a.fillStyle = 'rgba(255, 255, 255, 0.5)'),
      (a.textAlign = 'center'),
      a.fillText('FIA REF PLANK 10.0mm', e * 0.5, g + t * 0.5),
      (a.font = 'bold 10px sans-serif'),
      (a.fillStyle = n),
      a.fillText(`${l.toUpperCase()} GROUND EFFECT AERO`, e * 0.5, g + t * 0.5 + 24),
      a.restore());
  });
}
function ye(l, r) {
  return z(512, 512, (a, e, o) => {
    (X(a, e, o, '#1a1e24', 0.24), a.save());
    const f = r.mirrorColor || r.bodyColor || '#e8002d',
      i = r.mirrorAccentColor || r.accentColor || '#ffffff',
      h = (g, t, u) => {
        const T = a.createRadialGradient(g - u * 0.3, t - u * 0.3, 2, g, t, u);
        (T.addColorStop(0, '#f8fafc'),
          T.addColorStop(0.4, '#c4c9ce'),
          T.addColorStop(0.8, '#64748b'),
          T.addColorStop(1, '#334155'),
          (a.fillStyle = T),
          a.beginPath(),
          a.arc(g, t, u, 0, Math.PI * 2),
          a.fill(),
          (a.fillStyle = '#d4af37'),
          a.beginPath(),
          a.arc(g, t, u * 0.35, 0, Math.PI * 2),
          a.fill());
      },
      S = '#1a1e24',
      n = i;
    ([
      { x: 80, y: 560, w: 340, h: 44 },
      { x: 80, y: 640, w: 340, h: 44 },
      { x: e - 420, y: 560, w: 340, h: 44 },
      { x: e - 420, y: 640, w: 340, h: 44 },
      { x: 60, y: 760, w: 380, h: 36 },
      { x: e - 440, y: 760, w: 380, h: 36 },
    ].forEach(({ x: g, y: t, w: u, h: T }) => {
      const b = a.createLinearGradient(g, t, g, t + T);
      (b.addColorStop(0, S),
        b.addColorStop(0.75, S),
        b.addColorStop(1, 'rgba(0,0,0,0.35)'),
        (a.fillStyle = b),
        a.beginPath(),
        a.roundRect(g, t, u, T, 10),
        a.fill(),
        (a.fillStyle = 'rgba(255,255,255,0.35)'),
        a.fillRect(g + 8, t + 4, u - 16, 5),
        (a.fillStyle = n),
        a.fillRect(g + 8, t + T - 10, u - 16, 5));
    }),
      h(160, 520, 24),
      h(240, 680, 20),
      h(e - 160, 520, 24),
      h(e - 240, 680, 20),
      (a.fillStyle = i),
      a.fillRect(140, 600, 220, 10),
      a.fillRect(e - 360, 600, 220, 10));
    const p = (g, t, u, T, b) => {
      ((a.fillStyle = '#0a0b0d'), a.fillRect(b ? g - 40 : g + u, t + T * 0.35, 48, 22));
      const y = a.createLinearGradient(g, t, g, t + T);
      (y.addColorStop(0, f),
        y.addColorStop(0.8, f),
        y.addColorStop(1, '#050608'),
        (a.fillStyle = y),
        a.beginPath(),
        a.roundRect(g, t, u, T, 28),
        a.fill());
      const c = a.createLinearGradient(g, t, g, t + T * 0.45);
      (c.addColorStop(0, 'rgba(255, 255, 255, 0.45)'),
        c.addColorStop(1, 'rgba(255, 255, 255, 0.0)'),
        (a.fillStyle = c),
        a.beginPath(),
        a.roundRect(g + 6, t + 6, u - 12, T * 0.4, 20),
        a.fill(),
        (a.fillStyle = i),
        a.fillRect(g + 16, t + T - 26, u - 32, 8));
      const C = g + 20,
        k = t + 20,
        R = u - 40,
        M = T - 60;
      ((a.fillStyle = '#000000'),
        a.beginPath(),
        a.roundRect(C - 4, k - 4, R + 8, M + 8, 14),
        a.fill());
      const I = a.createLinearGradient(C, k, C, k + M);
      (I.addColorStop(0, '#cce3f5'),
        I.addColorStop(0.48, '#e2eef9'),
        I.addColorStop(0.5, '#2b394d'),
        I.addColorStop(1, '#131b26'),
        (a.fillStyle = I),
        a.beginPath(),
        a.roundRect(C, k, R, M, 10),
        a.fill(),
        (a.strokeStyle = 'rgba(255, 255, 255, 0.4)'),
        (a.lineWidth = 2.5),
        a.beginPath(),
        a.moveTo(C + 15, k + M - 8),
        a.lineTo(C + R - 15, k + 8),
        a.stroke());
    };
    (p(100, 140, 320, 180, !1), p(e - 420, 140, 320, 180, !0));
    const m = a.createLinearGradient(510, 380, 600, 460);
    (m.addColorStop(0, f),
      m.addColorStop(0.85, f),
      m.addColorStop(1, '#06080a'),
      (a.fillStyle = m),
      a.beginPath(),
      a.roundRect(510, 380, 90, 80, 16),
      a.fill(),
      (a.fillStyle = i),
      a.fillRect(510, 450, 90, 6),
      (a.fillStyle = 'rgba(255, 255, 255, 0.45)'),
      a.fillRect(520, 386, 70, 8),
      a.restore());
  });
}
function Te(l, r) {
  return z(512, 512, (a, e, o) => {
    (X(a, e, o, '#1a1e24', 0.24), a.save());
    const f = r.diffuserAccentColor || r.accentColor || '#ff0033',
      i = r.rainLightColor || '#ff0033',
      h = r.bodyColor || '#e8002d',
      S = r.accentColor || '#ffffff';
    ((a.fillStyle = S), a.fillRect(0, 0, e, 110));
    const n = a.createLinearGradient(0, 0, 0, 110);
    (n.addColorStop(0, 'rgba(255,255,255,0.22)'),
      n.addColorStop(0.5, 'rgba(255,255,255,0.0)'),
      n.addColorStop(1, 'rgba(0,0,0,0.35)'),
      (a.fillStyle = n),
      a.fillRect(0, 0, e, 110),
      (a.fillStyle = S),
      a.fillRect(0, 110, e, 8),
      (a.fillStyle = f),
      a.fillRect(0, 118, e, 4),
      (a.font = '900 44px "Impact", "Arial Black", sans-serif'),
      (a.fillStyle = '#0a0b0d'),
      (a.strokeStyle = 'rgba(255,255,255,0.7)'),
      (a.lineWidth = 3),
      (a.textAlign = 'center'),
      (a.textBaseline = 'middle'));
    const s = (r.teamName || String(l)).toUpperCase();
    (a.strokeText(s, e * 0.5, 58), a.fillText(s, e * 0.5, 58));
    const p = (w) => {
      switch (l) {
        case 'ferrari':
          i0(a, w, 58, 52);
          break;
        case 'mercedes':
          O(a, w, 58, 26);
          break;
        case 'redbull':
        case 'racingbulls':
          L(a, w, 58, 62);
          break;
        case 'mclaren':
          r0(a, w, 58, 44);
          break;
        case 'astonmartin':
          V(a, w, 58, 84);
          break;
        case 'alpine':
          Z(a, w, 58, 40);
          break;
        case 'williams':
          K(a, w, 58, 40);
          break;
        case 'audi':
          $(a, w, 58, 72);
          break;
        case 'haas':
          Y(a, w, 58, 44);
          break;
        case 'cadillac':
          j(a, w, 58, 44);
          break;
      }
    };
    (p(90),
      p(e - 90),
      (a.fillStyle = h),
      a.fillRect(0, 130, 46, o - 260),
      a.fillRect(e - 46, 130, 46, o - 260),
      (a.fillStyle = S),
      a.fillRect(46, 130, 6, o - 260),
      a.fillRect(e - 52, 130, 6, o - 260),
      [140, 280, e - 280, e - 140].forEach((w) => {
        ((a.fillStyle = '#020304'),
          a.fillRect(w - 14, 120, 28, o - 240),
          (a.fillStyle = f),
          a.fillRect(w - 4, 120, 8, o - 240),
          (a.fillStyle = '#d4af37'),
          a.fillRect(w - 6, o - 160, 12, 30));
      }));
    const g = Math.round(e * 0.5),
      t = 230,
      u = 86,
      T = a.createRadialGradient(g, t, u * 0.6, g, t, u + 28);
    (T.addColorStop(0, '#e6a100'),
      T.addColorStop(0.35, '#9d32d4'),
      T.addColorStop(0.7, '#1d4ed8'),
      T.addColorStop(1, 'rgba(10, 12, 16, 0.0)'),
      (a.fillStyle = T),
      a.beginPath(),
      a.arc(g, t, u + 28, 0, Math.PI * 2),
      a.fill());
    const b = a.createRadialGradient(g - u * 0.3, t - u * 0.3, u * 0.2, g, t, u);
    (b.addColorStop(0, '#cbd5e1'),
      b.addColorStop(0.7, '#64748b'),
      b.addColorStop(0.9, '#334155'),
      b.addColorStop(1, '#0f172a'),
      (a.fillStyle = b),
      a.beginPath(),
      a.arc(g, t, u, 0, Math.PI * 2),
      a.fill());
    const y = a.createRadialGradient(g, t, 10, g, t, u * 0.75);
    (y.addColorStop(0, '#000000'),
      y.addColorStop(0.8, '#0a0b0d'),
      y.addColorStop(1, '#1e2229'),
      (a.fillStyle = y),
      a.beginPath(),
      a.arc(g, t, u * 0.75, 0, Math.PI * 2),
      a.fill());
    const c = Math.round(e * 0.5 - 130),
      C = 540,
      k = 260,
      R = 180;
    ((a.fillStyle = '#050608'),
      a.beginPath(),
      a.roundRect(c - 16, C - 16, k + 32, R + 32, 20),
      a.fill(),
      (a.strokeStyle = '#222630'),
      (a.lineWidth = 3),
      a.stroke(),
      (a.fillStyle = '#101216'),
      a.beginPath(),
      a.roundRect(c, C, k, R, 14),
      a.fill());
    const M = 4,
      I = 6,
      P = k / (I + 1),
      F = R / (M + 1);
    for (let w = 1; w <= M; w++)
      for (let G = 1; G <= I; G++) {
        const B = c + G * P,
          A = C + w * F,
          E = w === M && (G === 1 || G === I),
          H = E ? '#00ff66' : i,
          W = E ? 'rgba(0, 255, 102, 0.45)' : 'rgba(255, 0, 51, 0.55)',
          N = a.createRadialGradient(B, A, 2, B, A, 16);
        (N.addColorStop(0, W),
          N.addColorStop(1, 'rgba(0, 0, 0, 0)'),
          (a.fillStyle = N),
          a.beginPath(),
          a.arc(B, A, 16, 0, Math.PI * 2),
          a.fill(),
          (a.fillStyle = '#1c1f26'),
          a.beginPath(),
          a.arc(B, A, 8, 0, Math.PI * 2),
          a.fill(),
          (a.fillStyle = H),
          a.beginPath(),
          a.arc(B, A, 5.5, 0, Math.PI * 2),
          a.fill(),
          (a.fillStyle = '#ffffff'),
          a.beginPath(),
          a.arc(B - 1.5, A - 1.5, 2, 0, Math.PI * 2),
          a.fill());
      }
    ((a.font = 'bold 9px "Courier New", monospace'),
      (a.fillStyle = 'rgba(255, 255, 255, 0.6)'),
      (a.textAlign = 'center'),
      a.fillText('FIA HOMOLOGATED RAIN LIGHT · TYPE-RL24', e * 0.5, C + R + 26),
      (a.font = '900 26px "Impact", "Arial Black", sans-serif'),
      (a.fillStyle = S),
      a.fillText((r.teamName || String(l)).toUpperCase(), e * 0.5, C + R + 58),
      a.restore());
  });
}
function be(l, r) {
  return z(512, 512, (a, e, o) => {
    (X(a, e, o, '#111317'), a.save());
    const f = r.seatbeltColor || r.accentColor || '#e8002d',
      i = (R, M, I, P) => {
        ((a.fillStyle = f),
          a.fillRect(R, M, I, P),
          (a.strokeStyle = 'rgba(0, 0, 0, 0.25)'),
          (a.lineWidth = 2));
        for (let w = R + 6; w < R + I; w += 8)
          (a.beginPath(), a.moveTo(w, M), a.lineTo(w, M + P), a.stroke());
        ((a.strokeStyle = '#ffffff'),
          (a.lineWidth = 1.5),
          a.setLineDash([6, 4]),
          a.strokeRect(R + 2, M + 4, I - 4, P - 8),
          a.setLineDash([]));
        const F = M + Math.round(P * 0.35);
        ((a.fillStyle = '#000000'),
          a.fillRect(R + 8, F, I - 16, 42),
          (a.fillStyle = '#ffffff'),
          (a.font = 'bold 12px sans-serif'),
          (a.textAlign = 'center'),
          a.fillText('SABELT', R + I * 0.5, F + 18),
          (a.font = '8px sans-serif'),
          (a.fillStyle = '#e2e8f0'),
          a.fillText('FIA 8853-2016', R + I * 0.5, F + 34));
      };
    (i(180, 520, 90, 440), i(e - 270, 520, 90, 440));
    const h = Math.round(e * 0.5),
      S = 800,
      n = 52,
      s = a.createRadialGradient(h - 15, S - 15, 6, h, S, n);
    (s.addColorStop(0, '#f1f5f9'),
      s.addColorStop(0.5, '#94a3b8'),
      s.addColorStop(0.9, '#475569'),
      s.addColorStop(1, '#1e293b'),
      (a.fillStyle = s),
      a.beginPath(),
      a.arc(h, S, n, 0, Math.PI * 2),
      a.fill(),
      (a.strokeStyle = '#cbd5e1'),
      (a.lineWidth = 3),
      a.stroke(),
      (a.fillStyle = '#facc15'),
      a.beginPath(),
      a.roundRect(h - 14, S - 28, 28, 56, 8),
      a.fill());
    const p = Math.round(e * 0.5 - 240),
      m = 60,
      g = 480,
      t = 380;
    ((a.fillStyle = '#0a0b0e'),
      a.beginPath(),
      a.roundRect(p, m, g, t, 32),
      a.fill(),
      (a.strokeStyle = '#1e2430'),
      (a.lineWidth = 4),
      a.stroke(),
      (a.fillStyle = '#181b22'),
      a.beginPath(),
      a.roundRect(p + 8, m + 40, 56, t - 80, 16),
      a.fill(),
      a.beginPath(),
      a.roundRect(p + g - 64, m + 40, 56, t - 80, 16),
      a.fill());
    const u = p + 80,
      T = m + 70,
      b = g - 160,
      y = 200;
    ((a.fillStyle = '#000000'),
      a.fillRect(u - 6, T - 6, b + 12, y + 12),
      (a.fillStyle = '#050a14'),
      a.fillRect(u, T, b, y));
    const c = 15,
      C = b / (c + 1);
    for (let R = 1; R <= c; R++) {
      const M = u + R * C,
        I = T - 18;
      let P = '#00ff66';
      (R > 5 && R <= 10 && (P = '#ff3300'),
        R > 10 && (P = '#00bfff'),
        (a.fillStyle = P),
        a.beginPath(),
        a.arc(M, I, 5.5, 0, Math.PI * 2),
        a.fill(),
        (a.fillStyle = '#ffffff'),
        a.beginPath(),
        a.arc(M - 1.5, I - 1.5, 1.8, 0, Math.PI * 2),
        a.fill());
    }
    ((a.font = 'bold 74px "Arial Black", sans-serif'),
      (a.fillStyle = '#ffffff'),
      (a.textAlign = 'center'),
      a.fillText('8', u + b * 0.5, T + 95),
      (a.font = 'bold 22px monospace'),
      (a.fillStyle = '#00f0ff'),
      a.fillText('332 KM/H', u + b * 0.5, T + 130),
      (a.font = 'bold 18px monospace'),
      (a.fillStyle = '#00ff66'),
      a.fillText('DELTA  -0.245', u + b * 0.5, T + 160),
      (a.fillStyle = '#1e293b'),
      a.fillRect(u + 24, T + 175, b - 48, 12),
      (a.fillStyle = '#00f0ff'),
      a.fillRect(u + 24, T + 175, (b - 48) * 0.88, 12));
    const k = (R, M, I, P) => {
      ((a.fillStyle = '#000000'),
        a.beginPath(),
        a.arc(R, M, 18, 0, Math.PI * 2),
        a.fill(),
        (a.fillStyle = P),
        a.beginPath(),
        a.arc(R, M, 14, 0, Math.PI * 2),
        a.fill(),
        (a.font = 'bold 9px sans-serif'),
        (a.fillStyle = '#ffffff'),
        (a.textAlign = 'center'),
        (a.textBaseline = 'middle'),
        a.fillText(I, R, M));
    };
    (k(p + 100, m + 310, 'DRS', '#10b981'),
      k(p + 160, m + 310, 'RAD', '#f59e0b'),
      k(p + g - 160, m + 310, 'PIT', '#ef4444'),
      k(p + g - 100, m + 310, 'OT', '#8b5cf6'),
      a.restore());
  });
}
function ce(l, r, a) {
  return z(512, 512, (e, o, f) => {
    const i = r.haloColor || r.bodyColor || '#e8002d',
      h = r.accentColor || '#ffffff';
    X(e, o, f, i, 0.08);
    const S = e.createLinearGradient(0, 0, 0, f);
    (S.addColorStop(0, 'rgba(255, 255, 255, 0.22)'),
      S.addColorStop(0.25, 'rgba(255, 255, 255, 0.0)'),
      S.addColorStop(0.75, 'rgba(0, 0, 0, 0.0)'),
      S.addColorStop(1, 'rgba(0, 0, 0, 0.35)'),
      (e.fillStyle = S),
      e.fillRect(0, 0, o, f),
      e.save());
    const n = e.createLinearGradient(0, 120, 0, 240);
    (n.addColorStop(0, 'rgba(255, 255, 255, 0.45)'),
      n.addColorStop(1, 'rgba(255, 255, 255, 0.0)'),
      (e.fillStyle = n),
      e.fillRect(80, 120, o - 160, 120),
      (e.fillStyle = h),
      e.fillRect(80, 480, o - 160, 14));
    const s = e.createLinearGradient(o * 0.4, 0, o * 0.6, 0);
    (s.addColorStop(0, '#64748b'),
      s.addColorStop(0.5, '#e2e8f0'),
      s.addColorStop(1, '#475569'),
      (e.fillStyle = s),
      e.fillRect(o * 0.44, 520, o * 0.12, 420),
      (e.strokeStyle = '#1e293b'),
      (e.lineWidth = 3),
      e.strokeRect(o * 0.44, 520, o * 0.12, 420));
    const p = (a == null ? void 0 : a.primarySponsor) || r.teamName;
    ((e.font = 'bold 36px "Arial Black", sans-serif'),
      (e.fillStyle = '#ffffff'),
      (e.textAlign = 'center'),
      e.fillText(p.toUpperCase(), o * 0.5, 300),
      (e.font = 'bold 12px "Courier New", monospace'),
      (e.fillStyle = 'rgba(255, 255, 255, 0.7)'),
      e.fillText('FIA STANDARD 8869-2018 · TITANIUM GRADE 5 · CP47', o * 0.5, 360),
      e.restore());
  });
}
function I0(l, r, a, e, o, f, i, h) {
  l.save();
  const S = l.createRadialGradient(r, a, 40, r, a, 248);
  (S.addColorStop(0, '#101319'),
    S.addColorStop(0.6, '#141820'),
    S.addColorStop(0.85, '#0d1015'),
    S.addColorStop(1, '#07080a'),
    (l.fillStyle = S),
    l.beginPath(),
    l.arc(r, a, 250, 0, Math.PI * 2),
    l.fill(),
    (l.strokeStyle = 'rgba(255, 255, 255, 0.055)'),
    (l.lineWidth = 1.5),
    [120, 140, 160, 180, 200, 218].forEach((p) => {
      (l.beginPath(), l.arc(r, a, p, 0, Math.PI * 2), l.stroke());
    }),
    (l.fillStyle = 'rgba(0, 0, 0, 0.75)'));
  for (let p = 0; p < 24; p++) {
    const m = (p * Math.PI * 2) / 24,
      g = 155,
      t = 185;
    (l.beginPath(),
      l.arc(r + Math.cos(m) * g, a + Math.sin(m) * g, 2.5, 0, Math.PI * 2),
      l.fill(),
      l.beginPath(),
      l.arc(r + Math.cos(m + 0.13) * t, a + Math.sin(m + 0.13) * t, 2.5, 0, Math.PI * 2),
      l.fill());
  }
  (l.save(),
    l.translate(r, a),
    l.rotate(-Math.PI * 0.65),
    (l.fillStyle = h ? '#1a232e' : '#221e14'),
    (l.strokeStyle = h ? '#00a19c' : '#d4af37'),
    (l.lineWidth = 2),
    l.beginPath(),
    l.arc(0, 0, 220, -0.35, 0.35),
    l.arc(0, 0, 135, 0.35, -0.35, !0),
    l.closePath(),
    l.fill(),
    l.stroke(),
    l.restore());
  const n = l.createRadialGradient(r, a, 225, r, a, 251);
  (n.addColorStop(0, f),
    n.addColorStop(0.5, e),
    n.addColorStop(0.85, o),
    n.addColorStop(1, f),
    (l.strokeStyle = n),
    (l.lineWidth = 14),
    l.beginPath(),
    l.arc(r, a, 242, 0, Math.PI * 2),
    l.stroke(),
    (l.strokeStyle = o),
    (l.lineWidth = 2.5),
    l.beginPath(),
    l.arc(r, a, 249, 0, Math.PI * 2),
    l.stroke(),
    (l.strokeStyle = f),
    (l.lineWidth = 2),
    l.beginPath(),
    l.arc(r, a, 234, 0, Math.PI * 2),
    l.stroke());
  for (let p = 0; p < 20; p++) {
    const m = (p * Math.PI * 2) / 20,
      g = r + Math.cos(m) * 233,
      t = a + Math.sin(m) * 233;
    ((l.fillStyle = o),
      l.beginPath(),
      l.arc(g, t, 2.2, 0, Math.PI * 2),
      l.fill(),
      (l.fillStyle = 'rgba(0, 0, 0, 0.6)'),
      l.beginPath(),
      l.arc(g, t, 1.2, 0, Math.PI * 2),
      l.fill());
  }
  const s = 10;
  for (let p = 0; p < s; p++) {
    const m = (p * Math.PI * 2) / s,
      g = m - 0.048,
      t = m + 0.048,
      u = m - 0.02,
      T = m + 0.02,
      b = 52,
      y = 233;
    ((l.fillStyle = f),
      l.beginPath(),
      l.arc(r, a, 232, g, t),
      l.lineTo(r + Math.cos(m) * 212, a + Math.sin(m) * 212),
      l.closePath(),
      l.fill());
    const c = (C, k) => {
      const R = r + Math.cos(k) * b,
        M = a + Math.sin(k) * b,
        I = r + Math.cos(C) * y,
        P = a + Math.sin(C) * y;
      ((l.strokeStyle = f),
        (l.lineWidth = 6),
        l.beginPath(),
        l.moveTo(R, M),
        l.lineTo(I, P),
        l.stroke(),
        (l.strokeStyle = e),
        (l.lineWidth = 4),
        l.beginPath(),
        l.moveTo(R, M),
        l.lineTo(I, P),
        l.stroke(),
        (l.strokeStyle = o),
        (l.lineWidth = 1.8),
        l.beginPath(),
        l.moveTo(R, M),
        l.lineTo(I, P),
        l.stroke());
    };
    (c(g, u), c(t, T));
  }
  ((l.fillStyle = f),
    l.beginPath(),
    l.arc(r, a, 54, 0, Math.PI * 2),
    l.fill(),
    (l.strokeStyle = e),
    (l.lineWidth = 3.5),
    l.beginPath(),
    l.arc(r, a, 52, 0, Math.PI * 2),
    l.stroke(),
    (l.fillStyle = i),
    l.beginPath());
  for (let p = 0; p < 6; p++) {
    const m = (p * Math.PI) / 3,
      g = r + Math.cos(m) * 42,
      t = a + Math.sin(m) * 42;
    p === 0 ? l.moveTo(g, t) : l.lineTo(g, t);
  }
  (l.closePath(),
    l.fill(),
    (l.strokeStyle = 'rgba(0, 0, 0, 0.65)'),
    (l.lineWidth = 2.5),
    l.stroke(),
    (l.fillStyle = '#0a0c10'),
    l.beginPath(),
    l.arc(r, a, 26, 0, Math.PI * 2),
    l.fill(),
    h ? O(l, r, a, 32, '#f0f3f6') : j(l, r, a, 30),
    l.restore());
}
function Re(l, r, a, e, o) {
  l.save();
  const f = o.wheelCoverColor || '#121417',
    i = o.wheelAccentColor || o.accentColor || '#ffdf00',
    h = o.wheelSecondaryColor || o.highlightColor || '#ffffff',
    S = o.wheelRimColor || o.wheelAccentColor || '#ffffff',
    n = l.createRadialGradient(r, a, 20, r, a, 251);
  switch (
    (n.addColorStop(0, f),
    n.addColorStop(0.7, f),
    n.addColorStop(1, '#080a0d'),
    (l.fillStyle = n),
    l.beginPath(),
    l.arc(r, a, 252, 0, Math.PI * 2),
    l.fill(),
    (l.strokeStyle = 'rgba(255, 255, 255, 0.04)'),
    (l.lineWidth = 1.2),
    [85, 115, 145, 175, 205, 225].forEach((s) => {
      (l.beginPath(), l.arc(r, a, s, 0, Math.PI * 2), l.stroke());
    }),
    (l.strokeStyle = S),
    (l.lineWidth = 3.5),
    l.beginPath(),
    l.arc(r, a, 250, 0, Math.PI * 2),
    l.stroke(),
    e)
  ) {
    case 'ferrari': {
      ((l.strokeStyle = '#e8002d'),
        (l.lineWidth = 16),
        l.beginPath(),
        l.arc(r, a, 239, 0, Math.PI * 2),
        l.stroke(),
        (l.strokeStyle = '#ffdf00'),
        (l.lineWidth = 9),
        l.beginPath(),
        l.arc(r, a, 208, 0, Math.PI * 2),
        l.stroke(),
        (l.strokeStyle = '#e8002d'),
        (l.lineWidth = 3.5),
        l.beginPath(),
        l.arc(r, a, 148, 0, Math.PI * 2),
        l.stroke(),
        (l.strokeStyle = '#ffdf00'),
        (l.lineWidth = 3),
        l.beginPath(),
        l.arc(r, a, 54, 0, Math.PI * 2),
        l.stroke());
      break;
    }
    case 'mclaren': {
      ([
        { color: '#ea4335', start: -Math.PI * 0.42, end: -Math.PI * 0.08 },
        { color: '#fbbc05', start: Math.PI * 0.08, end: Math.PI * 0.42 },
        { color: '#34a853', start: Math.PI * 0.58, end: Math.PI * 0.92 },
        { color: '#4285f4', start: Math.PI * 1.08, end: Math.PI * 1.42 },
      ].forEach((p) => {
        ((l.strokeStyle = p.color),
          (l.lineWidth = 14),
          (l.lineCap = 'round'),
          l.beginPath(),
          l.arc(r, a, 236, p.start, p.end),
          l.stroke());
      }),
        (l.lineCap = 'butt'),
        (l.strokeStyle = '#ff8000'),
        (l.lineWidth = 3),
        l.beginPath(),
        l.arc(r, a, 248, 0, Math.PI * 2),
        l.stroke(),
        (l.strokeStyle = '#ff8000'),
        (l.lineWidth = 4),
        l.beginPath(),
        l.arc(r, a, 196, 0, Math.PI * 2),
        l.stroke(),
        (l.strokeStyle = '#ff8000'),
        (l.lineWidth = 2.5),
        l.beginPath(),
        l.arc(r, a, 136, 0, Math.PI * 2),
        l.stroke());
      break;
    }
    case 'redbull': {
      ((l.strokeStyle = '#ea1d2d'),
        (l.lineWidth = 14),
        l.beginPath(),
        l.arc(r, a, 241, 0, Math.PI * 2),
        l.stroke(),
        (l.strokeStyle = '#ffce00'),
        (l.lineWidth = 2.8),
        l.beginPath(),
        l.arc(r, a, 229, 0, Math.PI * 2),
        l.stroke(),
        (l.strokeStyle = '#ffce00'),
        (l.lineWidth = 2.2),
        l.beginPath(),
        l.arc(r, a, 144, 0, Math.PI * 2),
        l.stroke(),
        (l.strokeStyle = '#ffce00'),
        (l.lineWidth = 3.5),
        l.beginPath(),
        l.arc(r, a, 54, 0, Math.PI * 2),
        l.stroke());
      break;
    }
    case 'astonmartin': {
      for (let p = 0; p < 12; p++) {
        const m = (p * Math.PI * 2) / 12,
          g = r + Math.cos(m) * 224,
          t = a + Math.sin(m) * 224,
          u = r + Math.cos(m) * 248,
          T = a + Math.sin(m) * 248;
        ((l.strokeStyle = '#cedc00'),
          (l.lineWidth = 6),
          l.beginPath(),
          l.moveTo(g, t),
          l.lineTo(u, T),
          l.stroke());
      }
      ((l.strokeStyle = '#cedc00'),
        (l.lineWidth = 2.5),
        l.beginPath(),
        l.arc(r, a, 224, 0, Math.PI * 2),
        l.stroke(),
        (l.strokeStyle = '#cedc00'),
        (l.lineWidth = 2.5),
        l.beginPath(),
        l.arc(r, a, 134, 0, Math.PI * 2),
        l.stroke(),
        (l.strokeStyle = '#cedc00'),
        (l.lineWidth = 3),
        l.beginPath(),
        l.arc(r, a, 54, 0, Math.PI * 2),
        l.stroke());
      break;
    }
    case 'audi': {
      for (let p = 0; p < 16; p++) {
        const m = (p * Math.PI * 2) / 16,
          g = m + 0.16,
          t = r + Math.cos(m) * 58,
          u = a + Math.sin(m) * 58,
          T = r + Math.cos(g) * 245,
          b = a + Math.sin(g) * 245;
        ((l.strokeStyle = '#1b7d00'),
          (l.lineWidth = 7),
          l.beginPath(),
          l.moveTo(t, u),
          l.lineTo(T, b),
          l.stroke(),
          (l.strokeStyle = '#52ff00'),
          (l.lineWidth = 4.5),
          l.beginPath(),
          l.moveTo(t, u),
          l.lineTo(T, b),
          l.stroke());
      }
      ((l.strokeStyle = '#52ff00'),
        (l.lineWidth = 7),
        l.beginPath(),
        l.arc(r, a, 246, 0, Math.PI * 2),
        l.stroke(),
        (l.strokeStyle = '#c4c9ce'),
        (l.lineWidth = 3),
        l.beginPath(),
        l.arc(r, a, 54, 0, Math.PI * 2),
        l.stroke());
      break;
    }
    case 'alpine': {
      ((l.strokeStyle = '#0090ff'),
        (l.lineWidth = 14),
        l.beginPath(),
        l.arc(r, a, 241, 0, Math.PI * 2),
        l.stroke(),
        (l.strokeStyle = '#fd4bc7'),
        (l.lineWidth = 10),
        l.beginPath(),
        l.arc(r, a, 186, 0, Math.PI * 2),
        l.stroke(),
        (l.strokeStyle = '#0090ff'),
        (l.lineWidth = 2.5),
        l.beginPath(),
        l.arc(r, a, 132, 0, Math.PI * 2),
        l.stroke(),
        (l.strokeStyle = '#fd4bc7'),
        (l.lineWidth = 3),
        l.beginPath(),
        l.arc(r, a, 54, 0, Math.PI * 2),
        l.stroke());
      break;
    }
    case 'racingbulls': {
      ((l.strokeStyle = '#d90429'),
        (l.lineWidth = 13),
        l.beginPath(),
        l.arc(r, a, 241, 0, Math.PI * 2),
        l.stroke(),
        (l.strokeStyle = '#ffffff'),
        (l.lineWidth = 8),
        l.beginPath(),
        l.arc(r, a, 216, 0, Math.PI * 2),
        l.stroke(),
        (l.strokeStyle = '#d90429'),
        (l.lineWidth = 3),
        l.beginPath(),
        l.arc(r, a, 142, 0, Math.PI * 2),
        l.stroke(),
        (l.strokeStyle = '#ffffff'),
        (l.lineWidth = 3),
        l.beginPath(),
        l.arc(r, a, 54, 0, Math.PI * 2),
        l.stroke());
      break;
    }
    case 'williams': {
      ((l.strokeStyle = '#00a3e0'),
        (l.lineWidth = 14),
        l.beginPath(),
        l.arc(r, a, 241, 0, Math.PI * 2),
        l.stroke(),
        (l.strokeStyle = '#ffffff'),
        (l.lineWidth = 7),
        l.beginPath(),
        l.arc(r, a, 198, 0, Math.PI * 2),
        l.stroke(),
        (l.strokeStyle = '#00a3e0'),
        (l.lineWidth = 2.5),
        l.beginPath(),
        l.arc(r, a, 134, 0, Math.PI * 2),
        l.stroke(),
        (l.strokeStyle = '#00a3e0'),
        (l.lineWidth = 3),
        l.beginPath(),
        l.arc(r, a, 54, 0, Math.PI * 2),
        l.stroke());
      break;
    }
    case 'haas': {
      ((l.strokeStyle = '#e10600'),
        (l.lineWidth = 14),
        l.beginPath(),
        l.arc(r, a, 241, 0, Math.PI * 2),
        l.stroke(),
        (l.strokeStyle = '#ffffff'),
        (l.lineWidth = 8),
        l.beginPath(),
        l.arc(r, a, 194, 0, Math.PI * 2),
        l.stroke(),
        (l.strokeStyle = '#e10600'),
        (l.lineWidth = 2.5),
        l.beginPath(),
        l.arc(r, a, 132, 0, Math.PI * 2),
        l.stroke(),
        (l.strokeStyle = '#e10600'),
        (l.lineWidth = 3),
        l.beginPath(),
        l.arc(r, a, 54, 0, Math.PI * 2),
        l.stroke());
      break;
    }
    default: {
      ((l.strokeStyle = i),
        (l.lineWidth = 10),
        l.beginPath(),
        l.arc(r, a, 241, 0, Math.PI * 2),
        l.stroke(),
        (l.strokeStyle = h),
        (l.lineWidth = 5),
        l.beginPath(),
        l.arc(r, a, 205, 0, Math.PI * 2),
        l.stroke());
      break;
    }
  }
  switch (
    ((l.fillStyle = '#0a0c10'),
    l.beginPath(),
    l.arc(r, a, 48, 0, Math.PI * 2),
    l.fill(),
    (l.strokeStyle = i),
    (l.lineWidth = 2.5),
    l.stroke(),
    e)
  ) {
    case 'ferrari':
      i0(l, r, a - 2, 34);
      break;
    case 'redbull':
      L(l, r, a, 52);
      break;
    case 'mclaren':
      r0(l, r, a, 38);
      break;
    case 'astonmartin':
      V(l, r, a, 64);
      break;
    case 'audi':
      $(l, r, a, 54);
      break;
    case 'alpine':
      Z(l, r, a, 38);
      break;
    case 'racingbulls':
      L(l, r, a, 48);
      break;
    case 'williams':
      K(l, r, a, 38);
      break;
    case 'haas':
      Y(l, r, a, 36);
      break;
    default:
      O(l, r, a, 32, i);
      break;
  }
  l.restore();
}
function Ce(l, r, a, e) {
  return z(
    512,
    512,
    (o, f, i) => {
      const h = r.wheelAccentColor || r.accentColor || '#ffdf00',
        S = r.wheelSecondaryColor || r.highlightColor || '#ffffff',
        n = r.wheelCoverColor || '#121417',
        s = r.wheelRimColor || r.wheelAccentColor || '#ffffff',
        p = r.wheelPirelliCompound || 'soft',
        m = (c) => {
          const C = c.replace('#', ''),
            k = parseInt(
              C.length === 3
                ? C.split('')
                    .map((R) => R + R)
                    .join('')
                : C,
              16,
            );
          return [(k >> 16) & 255, (k >> 8) & 255, k & 255];
        },
        g = m(h),
        t = m(S),
        u = m(s),
        T = p === 'soft' ? [225, 6, 0] : p === 'medium' ? [254, 209, 0] : [255, 255, 255];
      if (e) {
        o.drawImage(e, 0, 0, f, i);
        const c = o.canvas.width,
          C = o.canvas.height,
          k = o.getImageData(0, 0, c, C),
          R = k.data;
        for (let M = 0; M < C; M++)
          for (let I = 0; I < c; I++) {
            const P = (M * c + I) << 2,
              F = R[P],
              w = R[P + 1],
              G = R[P + 2];
            if (F > 115 && w < 75 && G < 75) {
              const B = (F * 0.299 + w * 0.587 + G * 0.114) / 180,
                A = M < 420 ? g : u;
              ((R[P] = Math.min(255, Math.round(A[0] * B))),
                (R[P + 1] = Math.min(255, Math.round(A[1] * B))),
                (R[P + 2] = Math.min(255, Math.round(A[2] * B))));
            } else if (M < 420 && F > 195 && w > 195 && G > 195)
              ((R[P] = Math.round(t[0] * 0.2 + 14)),
                (R[P + 1] = Math.round(t[1] * 0.2 + 14)),
                (R[P + 2] = Math.round(t[2] * 0.2 + 16)));
            else if (I >= 230 && I <= 600 && M >= 640 && M <= 980) {
              const B = Math.hypot(I - 416, M - 810);
              B >= 180 &&
                B <= 218 &&
                F > 200 &&
                w > 200 &&
                G > 200 &&
                ((R[P] = T[0]), (R[P + 1] = T[1]), (R[P + 2] = T[2]));
            }
          }
        o.putImageData(k, 0, 0);
      } else ((o.fillStyle = '#0f1115'), o.fillRect(0, 0, f, i), X(o, f, i, n));
      const b = 454,
        y = 190;
      l === 'mercedes'
        ? I0(o, b, y, '#d8dce2', '#ffffff', '#4a505b', '#00a19c', !0)
        : l === 'cadillac'
          ? I0(o, b, y, '#d4af37', '#fae596', '#685210', '#d4af37', !1)
          : Re(o, b, y, l, r);
    },
    { willReadFrequently: !0 },
  );
}
const u0 = 0.105,
  ke = [
    'nose',
    'bodywork',
    'wings',
    'floor',
    'suspensionMirrors',
    'diffuserRainLight',
    'cockpit',
    'halo',
    'wheel',
  ],
  A0 = new Map(),
  Me = ({ teamId: l, readinessKey: r, onScenePartReady: a }) => {
    const e = de(),
      o = (e == null ? void 0 : e.scene) ?? null,
      f = s0((A) => A.invalidate),
      i = v.useMemo(() => F0(l), [l]),
      h = v.useMemo(() => ee(l), [l]),
      { clonedScene: S, clonedGeometries: n } = v.useMemo(
        () =>
          o
            ? { clonedScene: o.clone(!0), clonedGeometries: [] }
            : { clonedScene: null, clonedGeometries: [] },
        [o],
      );
    v.useEffect(
      () => () => {
        n.forEach((A) => A.dispose());
      },
      [n],
    );
    const s = v.useRef(new Map()),
      p = v.useRef(r),
      m = v.useRef(a);
    (v.useLayoutEffect(() => {
      ((p.current = r), (m.current = a));
    }, [a, r]),
      v.useLayoutEffect(() => {
        o &&
          o.traverse((A) => {
            if (A.isMesh && A.material) {
              const E = A.material,
                H = (E.name || A.name || '').toLowerCase();
              s.current.has(H) || s.current.set(H, E);
            }
          });
      }, [o]));
    const g = K0(z0, '/textures/wheel_base.webp'),
      t = v.useCallback(
        (A) => {
          switch (A) {
            case 'nose':
              return pe(l, i);
            case 'bodywork':
              return ge(l, i);
            case 'wings':
              return Se(l, i, h);
            case 'floor':
              return ue(l, i);
            case 'suspensionMirrors':
              return ye(l, i);
            case 'diffuserRainLight':
              return Te(l, i);
            case 'cockpit':
              return be(l, i);
            case 'halo':
              return ce(l, i, h);
            case 'wheel':
              return Ce(l, i, h, g == null ? void 0 : g.image);
            default:
              throw new Error(`Unknown car texture slot: ${A}`);
          }
        },
        [g, i, h, l],
      ),
      u = `${l}:car-v${k0}`,
      [T, b] = v.useState(null);
    v.useEffect(() => {
      const A = le('car', u, ke, t);
      b(A);
    }, [u, t]);
    const y = T == null ? void 0 : T.textures,
      c = `${l}:car-v${k0}`,
      C = A0.get(c),
      k = y == null ? void 0 : y.get('nose'),
      R = y == null ? void 0 : y.get('bodywork'),
      M = y == null ? void 0 : y.get('wings'),
      I = y == null ? void 0 : y.get('floor'),
      P = y == null ? void 0 : y.get('suspensionMirrors'),
      F = y == null ? void 0 : y.get('diffuserRainLight'),
      w = y == null ? void 0 : y.get('cockpit'),
      G = y == null ? void 0 : y.get('halo'),
      B = y == null ? void 0 : y.get('wheel');
    return (
      v.useLayoutEffect(() => {
        if (!S || !k || !R || !M || !I || !P || !F || !w || !G || !B) return;
        performance.mark('showroom:car:material-application:start');
        let A;
        (C
          ? (A = C)
          : ((A = new Map()),
            A.set(
              '006',
              new a0({ map: B, roughness: 0.45, metalness: 0.55, envMapIntensity: 1.5 }),
            ),
            A.set(
              '011',
              new a0({ map: B, roughness: 0.45, metalness: 0.55, envMapIntensity: 1.5 }),
            ),
            A.set(
              '013',
              new a0({ map: B, roughness: 0.45, metalness: 0.55, envMapIntensity: 1.5 }),
            ),
            A.set(
              '002',
              new a0({ map: w, roughness: 0.75, metalness: 0.25, envMapIntensity: 1.2 }),
            ),
            A.set(
              '008',
              new l0({
                map: G,
                color: new U('#ffffff'),
                roughness: i.haloRoughness ?? 0.2,
                metalness: i.haloMetalness ?? 0.45,
                clearcoat: (i.bodyClearcoat ?? 1) * 0.7,
                clearcoatRoughness: 0.1,
                envMapIntensity: 1.6,
              }),
            ),
            A.set(
              '001',
              new a0({
                map: I,
                emissive: new U('#ffffff'),
                emissiveMap: I,
                emissiveIntensity: 0.18,
                roughness: 0.55,
                metalness: 0.25,
                envMapIntensity: 1.6,
              }),
            ),
            A.set(
              '003',
              new l0({
                map: P,
                emissive: new U('#ffffff'),
                emissiveMap: P,
                emissiveIntensity: 0.35,
                color: new U('#ffffff'),
                roughness: 0.38,
                metalness: 0.35,
                clearcoat: i.bodyClearcoat ?? 1,
                clearcoatRoughness: 0.08,
                envMapIntensity: 2.2,
              }),
            ),
            A.set(
              '009',
              new l0({
                map: F,
                emissive: new U('#ffffff'),
                emissiveMap: F,
                emissiveIntensity: 0.38,
                color: new U('#ffffff'),
                roughness: 0.45,
                metalness: 0.3,
                clearcoat: 0.4,
                clearcoatRoughness: 0.1,
                envMapIntensity: 2,
              }),
            ),
            A.set(
              '005',
              new l0({
                map: M,
                emissive: new U('#ffffff'),
                emissiveMap: M,
                emissiveIntensity: 0.32,
                color: new U('#ffffff'),
                roughness: i.wingRoughness ?? 0.22,
                metalness: i.wingMetalness ?? 0.25,
                clearcoat: i.bodyClearcoat ?? 1,
                clearcoatRoughness: 0.08,
                envMapIntensity: 1.9,
              }),
            ),
            A.set(
              '004',
              new l0({
                map: R,
                color: new U('#ffffff'),
                roughness: i.sidepodRoughness ?? i.bodyRoughness ?? 0.16,
                metalness: i.sidepodMetalness ?? 0.2,
                clearcoat: i.bodyClearcoat ?? 1,
                clearcoatRoughness: 0.06,
                envMapIntensity: (i.bodyClearcoat ?? 1) > 0 ? 1.25 : 0.5,
              }),
            ),
            A.set(
              '007',
              new l0({
                map: k,
                color: new U('#ffffff'),
                roughness: i.noseRoughness ?? i.bodyRoughness ?? 0.16,
                metalness: i.noseMetalness ?? i.bodyMetalness ?? 0.2,
                clearcoat: i.bodyClearcoat ?? 1,
                clearcoatRoughness: 0.06,
                envMapIntensity: (i.bodyClearcoat ?? 1) > 0 ? 1.25 : 0.5,
              }),
            ),
            A.set(
              '_fallback',
              new l0({
                map: null,
                color: new U(i.bodyColor),
                roughness: i.bodyRoughness,
                metalness: i.bodyMetalness,
                clearcoat: i.bodyClearcoat ?? 1,
                clearcoatRoughness: 0.08,
                envMapIntensity: 1.8,
              }),
            ),
            A0.set(c, A)),
          S.traverse((E) => {
            if (E.isMesh) {
              ((E.castShadow = !0), (E.receiveShadow = !0));
              const H = E.material,
                W = ((H == null ? void 0 : H.name) || E.name || '').toLowerCase(),
                N = A.get(W) || A.get('_fallback');
              N && (E.material = N);
            }
          }),
          performance.mark('showroom:car:material-application:end'),
          performance.measure('showroom:car:material-application', {
            start: 'showroom:car:material-application:start',
            end: 'showroom:car:material-application:end',
          }),
          m.current(p.current, 'car'),
          f());
      }, [S, l, i, y, k, R, M, I, P, F, w, G, B, f, C]),
      S
        ? d.jsx('primitive', {
            name: 'showroom-car',
            object: S,
            scale: [u0, u0, u0],
            rotation: [0, Math.PI, 0],
            position: [0, 0, 0],
          })
        : null
    );
  },
  ve = ({
    teamId: l,
    activeHotspot: r,
    onSelectHotspot: a,
    lang: e,
    showHotspots: o = !1,
    readinessKey: f,
    onScenePartReady: i,
  }) =>
    d.jsxs('group', {
      position: [0, 0, 0],
      children: [
        d.jsx(Me, { teamId: l, readinessKey: f, onScenePartReady: i }),
        (o || r !== null) &&
          x0.map(
            (h, S) => (
              r == null || r.id,
              h.id,
              d.jsx(
                'group',
                {
                  position: h.position,
                  children: d.jsx(_0, { center: !0, zIndexRange: [100, 0], children: '...' }),
                },
                h.id,
              )
            ),
          ),
      ],
    });
E0 || G0.preload('/models/c42.v2.glb');
const h0 = {
    pano_branding: { pos: [3.3, 1.45, -3.2], target: [0, 1.4, 2.2] },
    pano_technical: { pos: [-3.3, 1.5, 3.2], target: [0, 1.4, -2.2] },
    pano_drivers: { pos: [3.8, 1.6, 0.4], target: [-2.6, 1.7, 0] },
    pano_achievements: { pos: [-3.8, 1.6, -0.4], target: [2.6, 1.7, 0] },
    branding: { pos: [0, 2.55, -0.8], target: [0, 2.55, 5.8] },
    technical: { pos: [0, 2.55, 0.8], target: [0, 2.55, -5.8] },
    drivers: { pos: [-0.6, 2.55, 0], target: [-7.2, 2.55, 0] },
    achievements: { pos: [0.6, 2.55, 0], target: [7.2, 2.55, 0] },
    overview: { pos: [2.8, 1.4, -2.8], target: [0, 0.42, 0] },
    front: { pos: [0, 0.85, -2.8], target: [0, 0.35, -0.6] },
    cockpit: { pos: [0.75, 1.05, -0.5], target: [0, 0.52, -0.1] },
    rear: { pos: [0, 1.15, 2.9], target: [0, 0.55, 0.6] },
    top: { pos: [0.01, 5.4, 0], target: [0, 0.2, 0] },
  },
  Ie = new H0(...h0.overview.pos),
  Ae = new H0(...h0.overview.target),
  Pe = w0.memo(
    ({
      activeHotspot: l,
      cameraPreset: r,
      presetTrigger: a = 0,
      autoRotate: e,
      startupReady: o = !0,
      reducedMotion: f = !1,
      enableWheelZoom: i = !1,
      zoomTrigger: h = 0,
      zoomDirection: S = null,
    }) => {
      const { camera: n, invalidate: s } = s0(),
        p = v.useRef(null),
        m = v.useRef(!1),
        g = v.useRef(!1),
        t = v.useRef(0),
        u = v.useRef(Ie.clone()),
        T = v.useRef(Ae.clone()),
        b = v.useRef(!0);
      return (
        v.useEffect(() => {
          if (l)
            (u.current.set(...l.cameraPos), T.current.set(...l.cameraTarget), (b.current = !0));
          else if (r && h0[r]) {
            const y = h0[r];
            (u.current.set(...y.pos), T.current.set(...y.target), (b.current = !0));
          }
          s();
        }, [l, r, a, s]),
        v.useEffect(() => {
          if (!h || !S || !p.current) return;
          const y = p.current.target,
            c = n.position.clone().sub(y),
            C = c.length(),
            R = Math.max(1, Math.min(8, C * (S === 'in' ? 0.75 : 1.35)));
          (c.normalize().multiplyScalar(R),
            n.position.copy(y.clone().add(c)),
            p.current.update(),
            s());
        }, [h, S, n, s]),
        v.useEffect(() => {
          !f ||
            !p.current ||
            ((t.current = 0), (p.current.enableDamping = !1), p.current.update(), s());
        }, [s, f]),
        B0((y, c) => {
          if (!p.current || !o) return;
          if (
            (m.current &&
              !g.current &&
              ((g.current = !0), performance.mark('showroom:first-camera-interaction')),
            b.current)
          ) {
            const R = Math.min(c * 3.5, 1);
            (n.position.lerp(u.current, R),
              p.current.target.lerp(T.current, R),
              p.current.update());
            const M = n.position.distanceTo(u.current),
              I = p.current.target.distanceTo(T.current);
            M < 0.05 &&
              I < 0.05 &&
              (n.position.copy(u.current),
              p.current.target.copy(T.current),
              p.current.update(),
              (b.current = !1));
          }
          const C = performance.now(),
            k = t.current > C;
          (t.current > 0 &&
            !k &&
            ((t.current = 0), (p.current.enableDamping = !1), p.current.update()),
            (b.current || m.current || k || (e && !l && !f)) && s());
        }),
        d.jsx(X0, {
          ref: p,
          enableDamping: !f,
          dampingFactor: 0.06,
          maxPolarAngle: Math.PI / 2 + 0.02,
          minDistance: 0.8,
          maxDistance: 14,
          enableZoom: i,
          autoRotate: o && e && !l && !f,
          autoRotateSpeed: 0.8,
          onStart: () => {
            ((b.current = !1),
              (m.current = !0),
              (t.current = 0),
              p.current && (p.current.enableDamping = !f),
              s());
          },
          onChange: () => s(),
          onEnd: () => {
            ((m.current = !1), (t.current = performance.now() + ae(f)), s());
          },
        })
      );
    },
  ),
  we = async () => {
    const l = globalThis.scheduler;
    if (typeof (l == null ? void 0 : l.yield) == 'function') {
      await l.yield();
      return;
    }
    await new Promise((r) => setTimeout(r, 0));
  },
  Ge = (l, r, a, e) => {
    const [o, f] = v.useState(null),
      i = v.useRef(null),
      h = v.useRef(null);
    return (
      v.useEffect(() => {
        let S = !1,
          n = null;
        const s = ie(l, r);
        if (s)
          return (
            (n = s),
            (h.current = s),
            performance.mark(`showroom:${l}:textures-ready`),
            f(s),
            () => {
              ((S = !0), h.current === n && ((h.current = null), n == null || n.release()));
            }
          );
        const p = new Map();
        return (
          (async () => {
            performance.mark(`showroom:${l}:texture-generation:start`);
            try {
              for (const t of a) {
                if (S) {
                  S0(p);
                  return;
                }
                const u = performance.now();
                (p.set(t, e(t)),
                  performance.measure(`showroom:${l}:texture:${t}`, {
                    start: u,
                    end: performance.now(),
                  }),
                  await we());
              }
              if (S) {
                S0(p);
                return;
              }
              const g = re(l, r, p);
              ((n = g),
                performance.mark(`showroom:${l}:texture-generation:end`),
                performance.measure(`showroom:${l}:texture-generation`, {
                  start: `showroom:${l}:texture-generation:start`,
                  end: `showroom:${l}:texture-generation:end`,
                }),
                performance.mark(`showroom:${l}:textures-ready`),
                S ? g.release() : ((h.current = g), f(g)));
            } catch (g) {
              throw (S0(p), g);
            }
          })(),
          () => {
            ((S = !0), h.current === n && ((h.current = null), n == null || n.release()));
          }
        );
      }, [e, l, r, a]),
      v.useLayoutEffect(() => {
        if (!o || o.key !== r || i.current === o) return;
        h.current === o && (h.current = null);
        const S = i.current;
        ((i.current = o), S == null || S.release());
      }, [o, r]),
      v.useEffect(
        () => () => {
          var S, n;
          ((S = i.current) == null || S.release(),
            (i.current = null),
            (n = h.current) == null || n.release(),
            (h.current = null));
        },
        [],
      ),
      (o == null ? void 0 : o.key) === r ? o.textures : null
    );
  },
  m0 = {
    cadillac: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 6.8 24 10.4" width="360" height="156">
    <defs>
      <!-- Luxury Imperial Champagne Gold Gradient matching cadillac.webp -->
      <linearGradient id="cadGold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#FFF9DE"/>
        <stop offset="25%" stop-color="#E5C158"/>
        <stop offset="50%" stop-color="#D4AF37"/>
        <stop offset="75%" stop-color="#9E7B1A"/>
        <stop offset="100%" stop-color="#D4AF37"/>
      </linearGradient>
      <linearGradient id="cadChrome" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#FFFFFF"/>
        <stop offset="50%" stop-color="#E2E8F0"/>
        <stop offset="100%" stop-color="#94A3B8"/>
      </linearGradient>
      <filter id="cadGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="1.5" stdDeviation="1.2" flood-color="#D4AF37" flood-opacity="0.4"/>
      </filter>
    </defs>
    <!-- Official Authentic Cadillac Crest Vector Path -->
    <path fill="url(#cadGold)" filter="url(#cadGlow)" d="M2.787 9.414h2.104l-.398-.719h7.139v.717h.238v-.965H2.135l.652.967zm.202.948h8.879v-.719H2.874l.115.719zm2.255 1.204h-2.06l-.16-.981h8.846v.981h-.239v-.751H5.169l.075.751zm3.299.692h3.326v.515H8.543v-.515zm3.589-3.811h3.357v1.444h-3.357V8.447zm-8.469 5.569c.054.086.155.186.49.281.146.037.305.074.515.122l.08.019H8.31v-.51H3.616c.013.03.028.06.046.088h.001zm4.647-.779H3.459l-.238-1.44H8.31v1.44zm.232 2.021c1.243.253 2.457.488 3.329.63V13.47H8.542V15.258zm12.276-3.692h-5.1v-1.445h5.333l-.233 1.445zm-5.1-2.66v.513l5.485-.002.344-.511h-5.829zM0 7.306l1.616 2.369c.177 1.006.64 3.599.693 3.85l.006.032c.148.706.239 1.139 1.59 1.473 1.825.45 5.997 1.323 8.094 1.664 2.097-.341 6.271-1.215 8.097-1.664 1.35-.334 1.44-.767 1.589-1.473l.006-.032c.053-.253.516-2.844.693-3.85L24 7.306H0zm21.454 2.335-.277 1.717c-.16.994-.267 1.657-.32 1.951l-.007.035-.012.07c-.127.692-.183 1.002-.91 1.205-1.516.373-5.908 1.31-7.927 1.626-2.018-.316-6.41-1.254-7.925-1.626-.727-.203-.783-.513-.91-1.206l-.019-.104c-.053-.288-.156-.93-.31-1.89v-.001L2.55 9.64 1.276 7.75h21.45l-1.272 1.89v.001zm-9.084 3.132h-.238v-.976h8.65l-.16.978h-2.004c.031-.171.09-.659.099-.73H12.37v.728zm-.238.942h8.322l.134-.716h-8.456v.716zm0-3.129h3.358v.516h-3.358v-.516zm0 3.342v1.959c2.115-.36 6.223-1.205 7.718-1.592.338-.087.438-.193.492-.279a.448.448 0 0 0 .045-.088h-8.255zm2.296 1.282-.415.082c-.21.042-.665.125-1.065.199l-.577.106v-1.422h5.88c-.27.33-.812.437-3.823 1.035z"/>
  </svg>`,
    ferrari: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 125" width="220" height="275">
    <defs>
      <filter id="ferrariGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#FFE500" flood-opacity="0.3"/>
      </filter>
    </defs>
    <!-- Scuderia Ferrari Giallo Modena Shield -->
    <path d="M10 12C10 12 50 8 90 12C90 48 84 96 50 118C16 96 10 48 10 12Z" fill="#FFE500" stroke="#111111" stroke-width="3" filter="url(#ferrariGlow)"/>
    <!-- Italian Tricolore Band -->
    <path d="M10 12H36.6V20H11.5C11 17 10.5 14.5 10 12Z" fill="#009246"/>
    <path d="M36.6 12H63.3V20H36.6V12Z" fill="#FFFFFF"/>
    <path d="M63.3 12H90C89.5 14.5 89 17 88.5 20H63.3V12Z" fill="#CE2B37"/>
    <line x1="10" y1="20" x2="90" y2="20" stroke="#111111" stroke-width="1.5"/>
    <!-- Official High-Precision Cavallino Rampante Vector -->
    <g transform="translate(18, 22) scale(2.65)">
      <path fill="#111111" d="M11.543 0s-.01.141-.053.227c-.032.075-.118.128-.107.182.01.054.064.119.15.162.086.043.117.074.203.096.075.021.184.076.205.011.033-.064-.01-.151-.064-.226-.086-.14-.13-.172-.248-.365C11.607.044 11.586 0 11.543 0zm.678 0c-.022.011-.054.174-.108.313-.064.161-.022.236.01.3.043.065.098.108-.01.173-.107.064-.248.043-.248.043s-.118-.023-.215-.076a23.832 23.832 0 0 0-.3-.13s-.194-.053-.323-.042c-.129.01-.14.022-.236.033-.054 0-.075-.001-.129.01-.043.01-.096-.02-.096.033s.107.054.182.086c.075.032.247.031.215.074-.043.043-.204.054-.215.043-.01 0-.117-.021-.203-.021-.14.01-.15.01-.353.107-.033.01-.022.086.042.064a1.12 1.12 0 0 1 .301-.043c.13 0 .203.044.332.077.108.032.118.052.28.074.032 0 .095-.022.095.021 0 .022-.043.055-.043.055s-.096.02-.086.053c.022.043.108 0 .15 0 .044 0 .11.012.098.054l-.021.032a2.312 2.312 0 0 0-.291.097c-.269.108-.375.237-.633.366-.247.118-.644.267-.644.267s-.118.065-.29.107c-.171.044-.182.034-.3.055a.571.571 0 0 0-.27.086.52.52 0 0 0-.15.117l-.15.227-.087.127c-.021.043-.042.064-.052.107-.022.054-.033.076-.043.13-.032.128 0 .204.021.333.011.032.011.054.022.086.01.032.052.065.052.065l.043.01s.152-.01.248-.032c.097-.021.237-.055.237-.055l.181-.052.12-.043s.075 0 .086.043c.01.032-.022.086-.022.086s-.065.03-.119.052c-.054.022-.183.054-.193.065l-.14.043-.118.011s-.022.011-.043.043c-.022.033-.022.032-.022.053.022.022.033.043.055.065.043.032.064.053.117.064.075.032.118.022.193.022a.587.587 0 0 0 .27-.065c.086-.054.118-.053.236-.096a.543.543 0 0 1 .118-.021c.204-.022.32.01.525.043.204.032.302.097.506.129.215.032.343.096.568.043.108-.022.173-.076.227.031.053.097.043.15.043.15s-.001.066-.076.27c-.076.204-.311.709-.311.709l-.162.322s-.13.257-.43.59a54.284 54.284 0 0 1-.32.353s-.161.119-.322.323c-.161.204-.163.279-.313.43-.097.096-.15.15-.268.226-.118.075-.258.053-.634.31-.322.226-.494.41-.516.399-.021-.01-.129-.098-.172-.12-.032-.02-.654-.439-.654-.439l-.258-.172-.119-.076-.021-.043-.063-.086s-.097-.118-.215-.214a.92.92 0 0 0-.441-.237c-.183-.053-.3-.086-.482-.021a.646.646 0 0 0-.27.172c-.107.107-.129.193-.215.322s-.172.248-.215.312c-.043.065-.129.237-.129.237s-.214.343-.332.568c-.14.247-.193.399-.322.635-.204.376-.495.762-.57.933l-.084.194s-.023.095-.033.16c-.011.064-.011.172-.022.215a.312.312 0 0 1-.053.119c-.01.01-.129.257-.172.418-.043.16-.14.666-.021.73.118.065.987-.31 1.105-.676.076-.236-.236-.355-.15-.57.032-.075.054-.085.107-.16.086-.14.054-.429.215-.697.118-.193.354-.442.676-.807.204-.225.398-.59.398-.59s.043-.129.13-.107c.096.021.181.01.181.01l.043.033.086.086.129.193s.216.31.29.397c.076.086.151.15.259.236.118.107.16.161.31.28.215.171.139.236-.14.085a1.82 1.82 0 0 0-.364-.138c-.128-.033-.612-.162-.859-.194-.236-.032-.28-.021-.28-.021s-.118-.012-.257.074c-.14.086-.215.15-.215.15s-.161.183-.172.215c-.01.032-.086.16-.086.16s-.044.066-.054.14c-.022.076-.01.151-.01.151l.01.16.011.15s.033.377.108.753c.021.107.043.279.043.279l.052.387s.033.409.065.548c.032.13.054.14.076.225.043.161-.032.236.043.43.075.193.14.17.215.289.054.086.074.107.117.215.043.107.183.463.344.72.172.269.398.601.549.569.15-.033.257-.268.257-.268s.172-.463.065-.914c-.108-.462-.602-.245-.666-.578-.01-.075 0-.193 0-.193s-.012-.141-.033-.184c-.022-.043-.194-.364-.258-.633-.054-.204-.043-.86-.086-1.043-.118-.472-.129-.43-.065-.515.076-.086.141-.065.141-.065l.096.012.076.031.139.086c.043.032.193.15.193.15l.365.237s.205.119.291.162c.086.043.16.096.16.096l.096.064.162.12.031.03.022.043s.076.173.398.356c.258.15.484.106.58.225.022.021.203.27.29.42.107.171.236.374.279.439.043.064.312.396.312.396l.354.387.463.43.418.355.267.215s.237.226.506.408c.258.172.268.193.44.31.128.087.3.206.472.335.172.14.366.396.291.482-.054.032-.151-.106-.334-.267a4.298 4.298 0 0 0-.375-.301c-.193-.15-.291-.227-.506-.356-.107-.064-.3-.181-.31-.16-.075.226-.066.44-.055.719.01.193.043.386.107.633.054.236.108.366.194.591.086.226.248.58.248.58l.246.495.226.375.118.193.043.064s.053.13 0 .215-.119.269-.215.28c-.097.021-.322.033-.322.033l-1.278-.022-.666-.054s-.074-.043-.46-.043c-.226 0-.409.096-.538.107-.107.01-.634-.032-.988.107-.333.14-.484.172-.602.387-.086.161.42.42.838.516.677.15.483-.14.74-.322.033-.022.044-.042.077-.053.171-.054.267.084.44.084.192 0 .3-.064.493-.096.977-.129 2.502.332 2.502.332s.377.118.549.086c.204-.043.16-.118.224-.236.054-.097.033-.117.043-.225 0-.064-.01-.096-.021-.16-.043-.183-.16-.441-.16-.441s-.087-.193-.12-.29c-.042-.139-.085-.226-.107-.376-.064-.398-.053-.365-.053-.59 0-.408.043-.634.15-1.031.162-.58.463-.827.688-1.385.065-.15.064-.365.14-.387.085-.01.075.269.032.43-.14.558-.483.794-.644 1.363-.118.44-.183.697-.15 1.148.01.247.107.635.107.635s.129.429.193.59c.065.161.193.43.193.43l.29.515.15.246s.106.097.053.258c-.054.161-.16.26-.29.399-.364.43-1.212 1.062-1.427 1.212-.3.226-.291.291-.313.356-.118.344-.462.354-.837.762-.086.086-.311.321-.268.525.021.075.945.237 1.482.012.42-.183.054-.388.172-.592.086-.15.3-.15.397-.28.16-.214.053-.203.193-.374.462-.559.763-.88 1.59-1.385.075-.043.215-.107.215-.107s.117-.055.16-.12c.054-.086.043-.16.043-.257 0-.065-.01-.096-.01-.16 0-.076.01-.119-.012-.194-.021-.118-.095-.215-.138-.28a.772.772 0 0 1-.162-.355.894.894 0 0 1 .033-.6c.086-.225.279-.407.279-.407l.482-.323s.42-.301.55-.42c.139-.118.407-.365.6-.644.226-.311.344-.505.44-.88.032-.14.065-.354.065-.354s0-.15.086-.16c.085-.011.107.02.107.02s.074.042.096.257c.01.215-.053.463-.053.463s-.065.246-.086.396c-.01.097-.012.15-.012.258 0 .183.076.334.076.334s.043.032.043-.043a1.6 1.6 0 0 1 .055-.344c.032-.107.053-.087.117-.27.086-.236.01-.213.053-.353.022-.064.076-.129.14-.129.065 0 .075.086.075.086s.065.28.012.537c-.054.258-.248.612-.248.612l-.149.257s-.107.183-.15.301c-.043.129-.055.183-.033.3.032.13.13.303.183.27.043-.032-.064-.14.065-.398s.298-.418.298-.418.237-.28.344-.494c.097-.193.194-.506.194-.506s.076-.28.054-.516c-.01-.225-.054-.343-.054-.343l-.096-.172-.055-.127.022-.076c.021-.011.097.043.162.129a.854.854 0 0 1 .16.343 1.018 1.018 0 0 1 .043.301c0 .086-.031.44.097.666.054.108.183.354.194.246.021-.247-.087-.364-.076-.59.01-.257.076-.193.097-.322.022-.14.053-.173.032-.355a2.632 2.632 0 0 0-.096-.397l-.076-.172-.032-.064s.021-.031.053-.031l.258-.086s.334-.15.463-.258c.14-.097.3-.27.3-.27s.215-.267.323-.46c.258-.484.257-1.096.246-1.376-.01-.268-.086-.623-.086-.623s-.086-.43-.064-.709c.021-.279.043-.408.043-.408s-.01-.279.226-.58c.236-.3.342-.493.385-.719.043-.193-.022-.504-.108-.386-.096.129-.137.387-.277.601-.193.301-.474.666-.613.666-.075 0-.096-.172-.096-.172s-.096-.29.065-.656c.118-.258.181-.332.332-.525.14-.183.225-.28.322-.473.086-.172.106-.204.16-.472.01-.065-.01-.204-.074-.194-.086 0-.322.517-.569.807-.236.268-.677.611-.677.611s-.043.031-.043-.055c-.01-.075-.022-.3.021-.503a2.22 2.22 0 0 1 .291-.72c.204-.354.461-.6.59-.73.054-.053.215-.151.13-.205-.076-.043-.302.15-.474.28-.214.16-.289.205-.503.463-.215.257-.27.365-.27.365s-.204.332-.258.654c-.054.322-.053.504-.053.504s0 .291.032.463c.021.182.097.46.097.46s.108.313.15.507c.044.193.118.761.118.761s.054.409.021.795c-.032.387-.064.612-.107.73-.043.119-.16.43-.354.645-.182.204-.226.236-.226.236s-.193.16-.354.246a3.743 3.743 0 0 1-.505.227 2.211 2.211 0 0 1-.268.031h-.139l-.043-.03-.023-.087s-.106-.419-.234-.687c-.108-.226-.334-.537-.334-.537s-.387-.527-.688-.817c-.344-.343-.73-.6-.967-.783-.086-.064-.279-.184-.279-.184s-.783-.783-1.062-1.406c-.194-.43-.322-.74-.268-1.213.01-.107.053-.312.074-.312l.14.043c.012.01.14.129.259.172.064.021.181.043.181.043s.097.01.15.021c.054.022.151.054.215.086.065.032.16.098.16.098l.184.138.194.15s.106.076.138.087c.032.01.054.021.065.021h.043s.044-.012.054-.055c.011-.053-.053-.01-.15-.117a.698.698 0 0 1-.15-.181s-.022-.087-.108-.184-.193-.182-.193-.182-.076-.053-.184-.086c-.107-.032-.14-.033-.15-.076-.01-.043.129-.021.129-.021s.162.021.29.086c.13.064.204.14.204.14l.086.075.055.054.052.032s.054.053.065-.022c.01-.064-.011-.118-.022-.129l-.053-.053-.214-.183a1.076 1.076 0 0 0-.172-.15 1.303 1.303 0 0 0-.28-.15c-.107-.044-.171-.033-.279-.087-.075-.032-.14-.053-.183-.117-.011-.01-.064-.055.033-.033.096.021.16.054.267.076.172.043.28.042.442.096.064.021.15.064.15.064l.203.086s.28.151.473.162a.938.938 0 0 0 .42-.064.814.814 0 0 0 .215-.13.36.36 0 0 0 .052-.064l.022-.054v-.043c-.054-.065-.16.108-.332.14-.183.033-.173.053-.291.032a.477.477 0 0 1-.3-.15c-.173-.162-.236-.312-.462-.409-.096-.043-.27-.086-.27-.086s-.236-.075-.365-.15c-.096-.054-.298-.086-.234-.172.032-.043.29.107.482.129.14.021.237.011.344.011s.258-.033.28-.033c.021-.01.106 0 .181.022.075.021.118.053.193.086.076.032.163.086.184.086l.043.011.022-.021.01-.022-.01-.021-.034-.022-.064-.043s-.096-.054-.182-.14c-.086-.086-.162-.182-.29-.225-.13-.043-.28-.064-.28-.064l-.15-.012-.065-.01s-.107-.033-.021-.054a.888.888 0 0 1 .15-.032.495.495 0 0 1 .248.01c.086.032.226.107.236.107.011.011.14.109.28.141.14.032.322.043.322.043l.086-.021.043-.012.031-.022-.01-.052s0-.044-.064-.055a.697.697 0 0 1-.313-.117c-.118-.086-.203-.172-.203-.172s-.086-.076-.258-.12c-.16-.042-.214-.042-.214-.042l-.055-.022-.117-.052s-.055-.033-.098-.086c-.043-.054-.106-.152.076-.098.183.054.225.086.225.086s.097.097.183.107c.054.011.097.022.13-.021.053-.054-.098-.118-.206-.194a.725.725 0 0 1-.172-.193s-.063-.053.034-.031c.096.021.267.129.267.129s.086.042.13.053c.031.01.118.064.161.085.032.011.13.033.193.065.086.054.13.14.172.172.043.032.076.087.13.097.053.011.063.032.095.01a.418.418 0 0 0 .043-.031s.01-.023-.043-.055-.117-.117-.117-.117l-.022-.043-.011-.043-.053-.086-.098-.14s-.15-.204-.289-.28c-.129-.075-.226-.117-.226-.117s-.064-.031-.096-.053c-.054-.043-.076-.077-.12-.13-.053-.065-.073-.106-.138-.17-.118-.118-.483-.184-.344-.27.076-.043.172-.02.215-.01.043.011.14.052.237.084.064.022.107.024.171.045.065.022.14.031.172.053.032.021.065.065.086.076.011.01.096.15.246.225.15.075.227.128.377.138.118.011.31-.03.31-.03s.055-.023.012-.077c-.053-.054-.054-.064-.097-.074-.172-.065-.31-.043-.44-.172-.053-.054-.076-.065-.119-.15-.043-.086-.02-.107-.052-.16-.022-.054-.077-.13-.077-.13s-.16-.194-.332-.29a1.955 1.955 0 0 1-.334-.215c-.032-.022-.095-.108-.095-.108l-.055-.086-.031-.064c-.022-.118.192.033.31.076.194.064.291.15.485.215.107.032.172.031.279.074.182.075.236.258.43.28.107.01.322.053.279-.044-.043-.107-.258-.107-.365-.236-.054-.054-.054-.106-.108-.16-.086-.108-.29-.205-.29-.205s-.064-.053-.14-.203c-.064-.15-.225-.26-.515-.399-.193-.096-.58-.118-.43-.215.086-.064.161-.053.28-.021.118.043.16.098.257.14.097.044.14.054.16.065.022.01.097.043.13.043.02.01.183.032.226.043l.215.053.172.064s.085.033.138.033.141-.021.141-.021l.064-.043.01-.022s.033-.053-.053-.064a.986.986 0 0 0-.128-.012l-.077-.021-.03-.01s-.151-.118-.28-.172a4.841 4.841 0 0 1-.162-.064l-.053-.012-.064-.01s-.055 0-.141-.076c-.086-.075-.118-.118-.193-.193l-.096-.096s-.086-.066-.086-.12c.01-.085.193.098.193.098l.13.086s.107.076.3.086c.193.011.43-.054.43-.054s.031-.02.138.011.194.096.194.096l.086.076.129.139.021-.01c.01-.01.065-.065-.031-.183-.097-.119-.258-.225-.258-.225s-.215-.129-.43-.172c-.214-.043-.312-.043-.312-.043s-.161 0-.258-.107c-.097-.108-.16-.215-.16-.215l-.033-.15s-.053-.065-.16-.108c-.097-.043-.206-.107-.206-.107s-.16-.054-.172-.13c-.032-.139.27 0 .43.032.15.032.215.087.365.12a.915.915 0 0 0 .344.03c.075 0 .118-.008.193-.02.076 0 .13-.01.206 0 .107.022.15.075.257.118.065.032.097.063.172.074.065.011.194.055.172-.01l-.033-.043c-.054-.075-.117-.075-.182-.128-.14-.108-.204-.193-.365-.268a.932.932 0 0 0-.29-.098c-.087-.01-.151.012-.237-.01-.097-.032-.128-.075-.225-.128-.15-.086-.237-.162-.398-.227a2.663 2.663 0 0 0-.29-.086l-.076-.01-.03-.011c-.151-.054.267-.171.46-.225.097-.021.14-.044.236-.033.086.01.183.13.28.076.14-.075-.161-.28-.258-.312-.129-.054-.354-.01-.354-.01l-.494-.012-.14-.021s-.086 0-.15-.075c-.065-.075-.311-.377-.59-.42-.29-.043-.376 0-.397-.02-.247-.388-.506-.473-.7-.655-.053-.054-.138-.173-.16-.162zm1.173 1.14a.53.53 0 0 1 .051 0l.053.033a.54.54 0 0 1 .107.15c.011.043-.128-.01-.181-.022a.43.43 0 0 1-.15-.076s-.023-.032.03-.064a.197.197 0 0 1 .09-.022zm.252.53c.026 0 .045.006.045.006l.053.034a.538.538 0 0 1 .107.15c.011.043-.128-.01-.181-.022a.43.43 0 0 1-.15-.076s-.022-.032.043-.064a.133.133 0 0 1 .083-.027zm-1.882.014a.398.398 0 0 1 .08.004s.043 0 .107.031c.065.043.108.172.108.172s.01.022-.043.022c-.033 0-.033-.053-.065-.075-.043-.032-.075-.043-.129-.064-.053-.021-.128.01-.138-.043 0-.032.04-.044.08-.047zm-.844.125c.042-.012 0 .072 0 .072s-.139.225-.332.311-.322.13-.688.162c-.053 0-.03-.033-.03-.033s.417-.117.654-.246a2.36 2.36 0 0 0 .322-.215.25.25 0 0 1 .074-.05zm.752.06s.065.002.14.055c.076.054.14.237.14.237s.022.117-.032.16-.14-.031-.184-.096a.269.269 0 0 0-.16-.107c-.086-.032-.215.064-.236 0 0-.022.01-.076.01-.076s.022-.064.119-.117c.086-.054.203-.055.203-.055zm1.998.415c.043.004.103.037.15.037.14 0 .257 0 .354.021.086.022.107.075.064.075a.33.33 0 0 1-.096.011c-.096 0-.086-.043-.214.022-.13.064-.033.033-.215.097-.172.065-.13-.107-.13-.107s.013-.033.034-.12c.008-.031.027-.039.053-.036zm-4.844.498c.065 0 .184.044.184.14.01.097-.066.054-.12.086-.031.022-.052.033-.095.065-.054.043-.108.15-.14.117-.044-.032-.022-.15-.022-.15s.033-.086.076-.172c.054-.086.117-.086.117-.086zm5.137.111a.228.228 0 0 1 .05.008s.032.01.053.031c.022.022.108.098.108.14 0 .033-.139-.022-.203-.032-.065-.011-.15-.075-.15-.075s-.022-.02.042-.052a.21.21 0 0 1 .1-.02zm-1.895.088c.01 0 .009.015-.01.049-.042.086-.171.193-.171.193s-.15.214-.182.246c-.14.108-.312.044-.387.055-.064.01-.021-.055-.021-.055s.183-.074.3-.138c.158-.079.427-.35.471-.35zM9.86 3.17c.023 0 .041.01.041.043.011.075-.128.128-.128.128s-.042.011-.053-.064c-.01-.075.053-.086.053-.086s.05-.024.087-.021zm2.66.117c.018-.01.003.097.003.097s-.033.141-.108.184c-.096.054-.334.118-.355.086 0-.022.311-.12.45-.355a.034.034 0 0 1 .01-.012zm1.454.039a.239.239 0 0 1 .052.006s.03.01.063.03c.032.033.108.12.119.163.01.043-.14-.01-.215-.021-.064-.011-.162-.086-.162-.086s-.02-.033.045-.065a.175.175 0 0 1 .098-.027zm-1.301.244c.02-.006-.012.084-.012.084s-.043.14-.129.172c-.107.032-.514.042-.525.01-.01-.033.472-.076.654-.258a.026.026 0 0 1 .012-.008zm1.334.185a.3.3 0 0 1 .06.006s.033.01.065.032c.032.032.118.13.129.183.01.065-.15 0-.225-.021a.535.535 0 0 1-.184-.098s-.021-.031.043-.074a.207.207 0 0 1 .112-.028zm0 .537a.3.3 0 0 1 .06.006s.033.01.065.032c.032.032.118.13.129.183.01.054-.15-.011-.225-.033a.525.525 0 0 1-.184-.096s-.021-.021.043-.064a.207.207 0 0 1 .112-.027zm-1.568.514c.083.024.007.629-.153.91a4.718 4.718 0 0 1-.742.944c-.15.107-.053-.086-.053-.086s.418-.579.612-.987c.14-.29.226-.676.29-.752.02-.022.034-.032.046-.029zm1.55.008a.314.314 0 0 1 .069.01s.042.01.074.043c.032.032.14.151.15.205 0 .064-.182-.023-.267-.033a.54.54 0 0 1-.203-.108s-.023-.043.052-.086a.206.206 0 0 1 .125-.031zm-.068.52a.3.3 0 0 1 .06.005s.033.012.065.034c.032.032.118.128.129.181.01.054-.15-.01-.225-.021a.526.526 0 0 1-.182-.096s-.02-.033.043-.076a.201.201 0 0 1 .11-.027zm-.031.466a.482.482 0 0 1 .048 0l.055.033a.542.542 0 0 1 .108.15c0 .044-.13-.01-.194-.02-.064-.011-.15-.075-.15-.075s-.022-.032.043-.064a.2.2 0 0 1 .09-.024zm-.059.457a.32.32 0 0 1 .045.006l.043.022c.021.021.084.085.084.117 0 .043-.117-.01-.16-.01a.32.32 0 0 1-.117-.064s-.012-.023.03-.055c.022-.016.05-.017.075-.016zm-.09.422a.31.31 0 0 1 .037.002l.043.022c.022.021.074.075.074.107-.01.022-.107-.021-.15-.021a.475.475 0 0 1-.107-.053s-.01-.022.033-.043a.165.165 0 0 1 .07-.014zm-7.609.207c.118.022.14.032.129.086.01.054-.139.053-.139.053s-.216.044-.183-.031c.043-.076.193-.108.193-.108zm7.511.125c.022 0 .04.004.04.004l.043.022c.021.021.074.075.074.107-.011.032-.108-.01-.15-.021-.044-.011-.108-.055-.108-.055s-.01-.022.033-.043a.156.156 0 0 1 .068-.014zm-.12.377a.22.22 0 0 1 .03.002l.032.022c.01.01.064.064.064.086 0 .032-.076 0-.119-.01-.032-.01-.084-.043-.084-.043s-.01-.022.022-.043a.1.1 0 0 1 .054-.014zm-3.061.12a1.5 1.5 0 0 1 .182.011c.3.043.59.312.546.344-.043.032-.107 0-.129 0l-.107-.053-.162-.043s-.29-.065-.504-.055c-.215.011-.408.086-.408.086s-.086.044-.107-.01c-.011-.064.033-.097.033-.097l.01-.022s.246-.164.646-.162zm-5.113.128c.007 0 .01.002.01.002l.021.022c-.01 0 .032.107-.064.214-.097.108-.397.677-.461.58-.065-.075.29-.613.365-.72.056-.089.107-.098.129-.098zm8.05.117c.015 0 .026.002.026.002l.031.012.055.074c-.011.032-.076.011-.108 0-.032 0-.076-.043-.076-.043s-.01-.01.022-.03a.094.094 0 0 1 .05-.015zm-6.783.303c.017-.006.029.008.043.012l.053.021.033.032.108.107c.043.064.16.28.138.3-.096.097-.128-.032-.267-.193-.14-.15-.108-.279-.108-.279zm6.633.05a.079.079 0 0 1 .025.005l.032.01.054.076c0 .021-.065-.012-.097-.012-.033 0-.075-.043-.075-.043s-.022-.01.01-.021a.094.094 0 0 1 .051-.014zM8.4 8.497c.035.003-.013.065-.013.065s-.184.246-.291.397c-.14.203-.312.514-.344.482-.032-.032.151-.374.248-.557.107-.225.268-.343.332-.365a.173.173 0 0 1 .068-.021zm-3.052.805l.021.022s.011.042-.064.16-.13.119-.13.119c0-.01-.02-.053.044-.182s.129-.119.129-.119zm-1.317.42a.032.032 0 0 1 .016.01c.032.043-.064.236-.064.236s-.097.203-.13.117c-.032-.075.034-.214.034-.214.075-.066.108-.156.144-.149zm8.565.277c.096.011.086.194.086.237.032.311.162.624.398 1 .333.526.87.934.848.967-.054.053-.59-.366-.784-.602-.322-.387-.56-.806-.634-1.332-.022-.118-.022-.291.086-.27zm-6.324.15c.021 0 .117.034.117.034l.236.096c.01 0 .13.054.227.107l.234.15.066.055c0 .022.075.14-.076.108-.15-.033-.472-.28-.601-.344-.13-.064-.343-.086-.246-.172.01-.01.021-.033.043-.033zm-1.14.593a.058.058 0 0 1 .022 0c.065 0 .065.052.065.052v.033s-.001.194.01.344c0 .043.119.526.119.526s.021.043-.022.043c-.032 0-.064-.065-.064-.065s-.087-.128-.12-.224c-.031-.086-.042-.227-.042-.227s-.022-.182-.022-.246c.011-.086.011-.162.022-.205a.039.039 0 0 1 .031-.031zm-1.49.257a.06.06 0 0 1 .03 0c.064.011.031.128.031.182s-.062.15-.084.15c-.021 0-.065-.096-.054-.15.01-.047.018-.167.078-.182zm5.442.893c.122-.01.475.497.988 1.05.58.624 1.256 1.215 1.278 1.29.043.129-.473-.28-.752-.494-.741-.57-1.643-1.729-1.535-1.836a.036.036 0 0 1 .021-.01zm10.273.523c.02-.002.037.024.037.024l.022.031c0 .022.128.526.117.848-.022.45-.042.773-.31 1.117-.323.419-.882.85-.764.506.075-.204.57-.462.763-1.031.108-.344.13-.667.13-.667l-.022-.654s-.012-.053-.012-.129c.012-.032.027-.043.04-.045zm-5.478 1.12c.1.011.145.074.027.16-.14.096-.193.085-.28.181-.096.118-.127.517-.224.356-.096-.161-.032-.387.13-.559a.418.418 0 0 1 .347-.139zm-7.799.439c.041-.008.149.074.149.074.053.01.107.108.107.108s.022.076-.043.097c-.064.032-.107-.033-.107-.033s-.14-.193-.12-.236a.019.019 0 0 1 .014-.01zm10.307 1.525c.021 0 .065.022.119.13s-.086.868-.258.76c-.097-.064.053-.256.053-.417 0-.129-.022-.227-.022-.334 0-.107.108-.139.108-.139zM13.2 16.824c.038.004.048.058-.004.166-.075.161-.096.215-.107.366-.022.16.076.61-.074.44-.054-.076-.108-.43-.065-.602.047-.242.186-.375.25-.37zm-.82 2.118c.036-.005.054.013.054.013.022.043-.022.087-.033.098a.435.435 0 0 1-.129.043c-.064.01-.03-.043-.03-.043s.041-.066.095-.098a.134.134 0 0 1 .043-.013zm-2.877.228c.086 0 .086.043.086.043 0 .032-.033.044-.12.033-.074-.01-.084-.032-.073-.043 0-.01.021-.033.107-.033zm.652.031a.063.063 0 0 1 .024.002s.365.064.601.074c.172.011.258.023.43.012.097 0 .043-.012.193-.012.054-.01.022.066-.021.077-.161.043-.226.02-.365.031-.119.01-.173.021-.291.021-.204 0-.224.012-.514-.074-.054-.021-.12-.086-.098-.107a.055.055 0 0 1 .041-.024zm-2.435.065c.126.003.086.045.086.045s-.001.042-.076.095c-.076.054-.107.022-.118.022-.01 0-.086-.043-.086-.086.011-.043.13-.074.13-.074a.489.489 0 0 1 .064-.002zm6.761 1.48a.133.133 0 0 1 .026.002l.021.043c0 .01-.086.13-.129.13-.053-.012-.033-.075-.033-.075s-.021-.065.043-.086a.232.232 0 0 1 .072-.014zm-.802.318c.008 0 .018.001.023.006v.043c.01.033-.27.345-.463.528-.182.172-.494.408-.494.408h-.043v-.055l.012-.021.021-.032.022-.033.021-.03.065-.077.15-.139.15-.14.237-.237s.085-.095.117-.117c.032-.021.054-.043.086-.064.032-.016.07-.038.096-.04zm-1.553 1.293a.064.064 0 0 1 .05.014c.033.075-.02.096-.02.096l-.098.076c-.011 0-.075.054-.096.021-.022-.032.01-.075.01-.086 0-.01.065-.085.119-.107a.093.093 0 0 1 .035-.014zm-1.047.994c.044-.005.076.061.076.061s.022.031.022.074c0 .033-.097.022-.15.065-.065.043.065.173-.14.162-.117-.01-.053-.118-.042-.129l.074-.107c.054-.076.087-.087.14-.12a.046.046 0 0 1 .02-.006z"/>
    </g>
    <text x="24" y="108" font-family="'Arial Black', sans-serif" font-size="14" font-weight="900" fill="#111111">S</text>
    <text x="66" y="108" font-family="'Arial Black', sans-serif" font-size="14" font-weight="900" fill="#111111">F</text>
  </svg>`,
    mercedes: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="240" height="240">
    <defs>
      <!-- Multi-stop Brushed Chrome Platinum Gradient -->
      <linearGradient id="mercGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#FFFFFF"/>
        <stop offset="45%" stop-color="#E2E8F0"/>
        <stop offset="80%" stop-color="#94A3B8"/>
        <stop offset="100%" stop-color="#CBD5E1"/>
      </linearGradient>
      <filter id="mercGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="1.5" flood-color="#00A19C" flood-opacity="0.5"/>
      </filter>
    </defs>
    <!-- Petronas Teal Outer Accent Ring -->
    <circle cx="12" cy="12" r="10.8" stroke="#00A19C" stroke-width="0.8" fill="none" opacity="0.85"/>
    <!-- Official Mercedes 3-pointed Star Vector -->
    <path fill="url(#mercGrad)" filter="url(#mercGlow)" d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12S0 18.623 0 12 5.377 0 12 0zM3.245 17.539A10.357 10.357 0 0012 22.36c3.681 0 6.917-1.924 8.755-4.821L12 14.203zm10.663-6.641l7.267 5.915A10.306 10.306 0 0022.36 12c0-5.577-4.417-10.131-9.94-10.352zm-2.328-9.25C6.057 1.869 1.64 6.423 1.64 12c0 1.737.428 3.374 1.185 4.813l7.267-5.915z"/>
  </svg>`,
    mclaren: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 4 24 16" width="320" height="213">
    <defs>
      <!-- McLaren Papaya Orange Gradient -->
      <linearGradient id="mclGrad" x1="0" y1="0" x2="1" y2="0.8">
        <stop offset="0%" stop-color="#FFA033"/>
        <stop offset="50%" stop-color="#FF8000"/>
        <stop offset="100%" stop-color="#E05300"/>
      </linearGradient>
      <filter id="mclGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="1.5" flood-color="#FF8000" flood-opacity="0.45"/>
      </filter>
    </defs>
    <!-- Official McLaren Speedmark Vector -->
    <path fill="url(#mclGrad)" filter="url(#mclGlow)" d="M19.062 11.713c3.305-2.139 7.748-2.208 2.564 1.248l.082-.11c1.467-2.016-1.522-1.563-2.578-1.166l-.068.028zM6.967 13.236h1.399v.549H6.747c-.686 0-.987-.206-.987-.754v-.123c0-.466.274-.768.96-.768h1.646v.549H6.967a.248.248 0 0 0-.247.247v.069a.246.246 0 0 0 .247.231zM9.6 11.864v1.371h.823v.549h-1.92v-1.92H9.6zm-5.198.247c.191-.154.427-.241.672-.247h.549v1.92H4.525v-.96l-1.056.96H2.468v-.96l-1.221.96H0l2.18-1.646c.206-.151.343-.274.699-.274h.686v.96l.837-.713zm9.312.206a.316.316 0 0 1 .343-.316h1.303v.549h-.686v1.234h-.96v-1.467zm6.431-.316c.823 0 1.111.178 1.111.782v1.001h-.96v-.686a.411.411 0 0 0-.411-.411h-.411v1.097h-.96v-1.783h1.631zm-7.487 0c.631 0 .919.261.919.699v.411c0 .507-.288.672-.987.672h-1.083c-.398 0-.686-.041-.837-.178a.495.495 0 0 1-.11-.315v-.069c0-.274.165-.535.686-.535h1.234c0-.123.014-.137-.137-.137h-1.646V12h1.961zm-.179 1.166v-.069h-.754a.07.07 0 0 0 0 .138h.686a.068.068 0 0 0 .068-.069zm5.02-1.166c.727 0 .878.219.878.521v.069c0 .329-.261.507-.686.507h-1.234c0 .123.123.137.274.137h1.508v.549H16.36c-.59 0-.864-.247-.864-.699v-.315c0-.521.288-.768.946-.768h1.057zm-.151.686a.07.07 0 0 0 0-.138h-.823a.07.07 0 0 0-.069.069v.069h.892z"/>
  </svg>`,
    redbull: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 3 24 18" width="320" height="240">
    <defs>
      <filter id="rbGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="1.5" flood-color="#FFCC00" flood-opacity="0.4"/>
      </filter>
    </defs>
    <!-- Golden Sun Disc -->
    <circle cx="12" cy="11.5" r="7.5" fill="#FFCC00"/>
    <circle cx="12" cy="11.5" r="6.2" fill="#FFA500" opacity="0.6"/>
    <!-- Official Dual Charging Bulls Vector -->
    <path fill="#E10600" filter="url(#rbGlow)" d="M22.381 11.374c-.389 1.244-1.019 2.33-2.142 3.082l-.33.251-.264.236-.091.107-.025.041-.011.028-.004.016v.013l.001.009.002.007.002.006.005.007.002.002.01.008.012.007.011.004a.16.16 0 0 0 .046.006h.024c.178-.007.512-.141.629-.245l-.139.137-.164.149-.173.146-.18.141-.185.136-.197.134-.204.13-.206.123-.213.118-.223.115-.226.108-.225.1-.236.097-.045.018c-1.97.763-4.327.854-5.914-.44.353.344.787.728 1.199.98-.251-.043-.429-.237-.666-.311.004.008.575.751 2.282.946l.316.032.48.031.464.014.448-.009.44-.039.464-.084.401-.107.599-.181.294-.081.128-.033c.104-.026.214-.052.333-.077l.041-.009c.073.031-.524.339-1.344.57-.361.132-.739.2-1.119.227l-.269.012-.216.001-.218-.005-.264-.015-.315-.027-.31-.034-.056-.007c-.401-.049-.781-.107-1.122-.143h-.006.006c.03.015.209.096 1.067.402-.061.022-.346.061-1.536-.448 2.417 1.392 4.988.759 7.266-.585l.352-.215.053-.034.294-.191.151-.103c.178-.121.353-.246.526-.374 0 .009-.004.021-.004.031a.963.963 0 0 0 .075.01c-.014.041-.014.041-.214.279.435-.351.659-.896 1.12-1.225-.236.473-.538.813-1.1 1.361.033-.024.064-.051.095-.078l.028-.026-.028.026a7.88 7.88 0 0 1-3.682 1.965c.126-.014.251-.039.373-.073-.22.061-.227.068-.32.099.058-.007.058-.007.358-.068-.175.086-.377.127-.865.226 2.806-.444 5.721-2.571 5.956-5.449a.142.142 0 0 1-.152-.143c.009-.562-.147-.982-.42-1.302-.163.58-.413 1.136-1.027 2.072-.26.393-.72.41-1.005.771l-.021-.013-.032-.028-.005-.003-.004-.002-.001-.001h-.003l-.007.001h-.003l-.001.001a.193.193 0 0 0-.058.051l.062-.07.067-.092.016-.031.005-.014.002-.01v-.01l-.001-.009-.001-.003-.002-.004-.001-.003-.003-.003a.027.027 0 0 0-.005-.006l-.009-.006-.04-.019-.006-.004-.004-.004-.002-.003-.002-.002-.002-.006v-.006l.001-.007.004-.011.023-.034.014-.016c.622-.687 1.192-1.306 1.438-2.228l.006-.021-.027.032c-.087.103-.147.147-.24.265l.11-.39.035-.127.065-.26.052-.225a.859.859 0 0 0-.118-.055Zm-2.257 6.199a9.006 9.006 0 0 1-1.105.547c-.38.155-.768.279-1.152.354a10.026 10.026 0 0 0 2.257-.901Zm-6.505.203.051.02-.001-.012-.05-.008Zm3.644-2.807c-.372-.201-.515-.63-.744-.945-.6-.62-.701-1.681-.858-2.549-.158-.843-.878-1.467-1.378-2.119-.443-.361-1.599-1.457-2.145-1.632-.72-.299-1.348.267-1.947.544-.487.201-1.002.258-1.432.63-.674.865-1.079.173-1.861.858-1.165 1.22-1.606.146-3.207 1.575-.429.257-.831.515-1.348.487-.823-.039-1.103-1.145-.459-1.633.449-.502 1.552-1.019 1.004-1.831-.57-.508-1.24-.292-1.918-.858-.313.49.087 1.155.601 1.318.211.131.701-.078.802.227-.217.434-.81.669-1.088 1.089-.693.8-.009 2.112.973 2.173.363.117.825-.179 1.06-.057.028.286 0 .544.057.802.027.282.348.584.172.858-.285.245-.654.37-1.03.347-.195.225-.228.48-.344.744-.142.258-.428.372-.629.487-.133.201-.265.424-.545.458-.171.201-.2.458-.257.716.716.19.87.094 1.26-.515.143-.143.344-.029.486 0 .407-.049.711-.321 1.003-.573 1.042-.272 1.032.41 2.233-.372.201-.086.287-.315.373-.487.1-.192.378-.562.028-.658-.899 1.819-2.464.338-3.665 1.715-.184.051-.041-.235 0-.287.862-1.256 2.823-.15 3.493-1.776.117-.25.051-1.247.343-1.232.029 0 .115.029.115.086-.278 1.214-.094 1.591 1.202 1.378.444-.128 1.716.325 1.69-.286 0-.114-.115-.171 0-.257.028-.029.114 0 .143.028.081.49.511.85.919 1.06.823.56.49 1.291-.459 1.26-.315-.172-.4-.487-.63-.745-.267-.234-.633-.122-.944-.057-.155.233.212.511.286.745.143.086.344-.058.458.114.115.171.172.344.344.458.496.476 1.532-.36 2.061-.401.463.051.674-.371.831-.716.261-.477-.434-.948-.487-1.374-.158-.044-.368-.167-.487 0 .088.213.579.993.544 1.231-.064.173-.21.572-.429.544.058-.2.144-.428.144-.658-.105-.245-.565-.953-.602-1.203.092-.242.562-.102.744-.344.201-.315.258-.629.316-1.03a.127.127 0 0 1 .086-.087c.279.18-.005 1.042-.172 1.232-.016.297.568.098.687 0 .221.046.67-.175.773-.029a1.545 1.545 0 0 0-.286.573c-.172.2-.458.344-.458.63.031.18.273-.11.286.114-.249.317-.218.394-.143.745.261.368.761.065 1.088-.028.552-.217 1.172.126 1.604-.459.116.01.222.074.286.172.319.335.769.513 1.231.487.188-.13-.222-.233-.286-.287-.201-.114-.459-.286-.516-.515-.075-.32-.306-.613-.458-.916.669.01.739 1.406 1.716 1.203.048-.033.043-.069.029-.115l-.259-.057Zm-16.866.687c-.339.139-.159.558-.371.773 0 .028-.058.086 0 .115.142.028.257.086.429.114.076-.256.15-.541.2-.773-.058-.086-.143-.2-.258-.229Zm17.317-.39c-.085.109-.274.115-.356.19a.115.115 0 0 0-.023.082.24.24 0 0 1-.073.242c-.087.094-.25.136-.397.126-.734.008-1.092-.351-1.392-.523-.41.265-.665.37-1.201.287-.315-.025-.596.134-.902.212.434.372 2.193.844 1.545.524-1.072-.607-.295-.203.645.019a6.905 6.905 0 0 0 1.625.2 8.043 8.043 0 0 0 2.427-1.279.342.342 0 0 1-.118-.021.192.192 0 0 1-.095-.081c-.031-.052-.048-.136.023-.251.074-.119.286-.327.734-.651a.014.014 0 0 1 .004-.003c1.097-.736 1.71-1.8 2.088-3.015a4.09 4.09 0 0 0-.798-.2c-.405 1.006-.503 1.716-1.458 2.285-1.108.725-.414.539-.403.534.086-.035.168-.079.245-.132-.429.689-1.174 1.129-2.063 1.327a.206.206 0 0 1-.057.128Zm-16.687.39c.2-.115.315-.315.401-.487-.062-.096-.136-.223-.286-.172-.137.106-.28.201-.429.287-.072.194.107.439.315.372h-.001Zm8.648-.63c.114.143.114.343.258.458a.617.617 0 0 0 .486-.143c.086-.057-.028-.143-.057-.229-.086-.115-.028-.344-.229-.344-.217.051-.455-.012-.659.057 0 .087.172.087.201.201Zm5.125-.344a1.694 1.694 0 0 1-.4.057h-.029c-.169-.156.184-.468.372-.458h.086c.105.044.078.32-.029.401Zm7.828-3.179c-.038.169-.078.328-.12.489a.142.142 0 0 1 .133.177c-.243.936-.807 1.571-1.433 2.262l.003.005c.1-.07.207-.127.313-.184.163-.088.326-.176.442-.351.632-.962.872-1.515 1.032-2.115-.11-.106-.233-.2-.37-.283Zm-.948-2.516.117.073c1.725 1.116 2.457 3.197 1.833 4.905l.006-.005c.29-.834.408-1.718.349-2.599-.306-2.281-1.087-4.283-3.87-5.019 1.721.416 1.85.631 2.075.779-1.337-1.235-3.49-1.664-5.667-1.295 1.253-.404 3.303-.361 4.61.417l.031.019c-3.108-1.906-6.839-1.075-9.134 1.114.429.083.806.366 1.157.637l.109-.059.127-.064.131-.062.27-.119.281-.11.295-.105.306-.096.285-.079.323-.079.299-.064.273-.05.17-.027.17-.025.138-.018.172-.019c1.705-.182 3.539.045 4.907.946l.013.008a4.445 4.445 0 0 1 1.518 1.685c-.033.021-.065.016-.094-.001l-.038-.029-.108-.115-.02-.015c-.014-.005-.046-.036-.061-.043l-.209-.189-.248-.186-.266-.162-.044-.024c-.773-.418-1.714-.603-2.55-.779l-.051-.01.415.146.459.135.494.143.299.099.242.094.16.071.143.072.085.046.098.058Zm-1.112 4.436c.186-.409.62-.629.762-1.123-.021.073.134.103.195.103.245-.042.251-.379.33-.449-.061.766-.578 1.393-1.144 1.912a.255.255 0 0 0-.244-.011c-.024-.144.286-.344.101-.432Zm-5.023-.402c-.032.056-.081.202-.143.201-.062-.001-.089.009-.086-.057-.005-.193-.036-.429-.201-.544-.374-.582-.468.147-.601.057-.08-.162.046-.345.115-.487.032-.038.044-.083.086-.114.061-.353.383-.152.458.057.197.245.429.521.401.802-.029-.029-.029.028-.029.085Zm-.549-3.278c-.217-.28-.442-.582-.683-.803 1.207-.431 3.157-.54 4.121-.577.228-.007.352-.022.403-.037a.18.18 0 0 0 .087-.052.143.143 0 0 0 .037-.115.15.15 0 0 0-.066-.11.573.573 0 0 0-.18-.059 8.12 8.12 0 0 0-1.056-.106h-.002c-.657 0-1.409.067-2.124.192.255-.086.515-.156.779-.209a.142.142 0 0 0 .114-.146.143.143 0 0 0-.128-.134c-.122-.013-.895.075-1.605.241-.485.113-.938.266-1.149.438a.08.08 0 0 0-.013.013c-.071-.06-.143-.119-.213-.176 1.546-.816 4.032-1.269 6.157-.782 1.178.269 2.246.83 2.973 1.785-.868-.665-2.087-.901-3.134-1.122a.142.142 0 0 0-.082.27c.762.303 1.566.393 2.28.798 1.572.902 2.381 2.603 2.161 4.159.016-.994-.449-1.573-1.164-1.938-2.191-.92-4.263.309-6 .558v-.014l-.003-.005c-.1-.215.937-.435 1.075-.518.082-.085.222-.056.315-.132.092-.091.23-.111.353-.135.323-.165.679-.219 1.039-.226.127.019.245-.052.372-.043a.347.347 0 0 1 .188-.03c.385-.029.779-.065 1.111-.299.035-.021.153-.086.053-.099-.629-.17-.932.26-1.506-.256.009-.022-.181-.103-.208-.103-.304.061-.589.197-.905.202-.144.032-.201-.04-.345-.04-.193.045-.46.169-.657.184-.092-.017-.542.218-.551.056a.017.017 0 0 1-.01 0c-.048-.182 2.822-1.254 1.641-.532.065.056.447-.105.807-.132.404-.086.941.211 1.118-.185-.007-.065-.162-.046-.2-.019-.077.042-.16.014-.241.032-.135.016-.66-.079-.779-.071-.095-.081.528-.064.583-.073.205-.031.452-.077.657-.115.091-.011.183-.013.274-.006.186.044.684-.024.153-.153-.14-.027-.581-.041-.652-.019-.108.014-.576.153-.825.095-.225-.068.7-.106.59-.168-1.148-.145-2.457-.109-4.724 1-.072-.089-.15-.183-.236-.284Zm-2.543.902c-.029.029-.058.029-.115.029-.077-.29-.104-.592-.258-.831-.08-.079-.184-.181-.115-.315a.138.138 0 0 1 .173-.029c.262.196.306.469.315.802.057.057.028.229 0 .344Zm9.227-1.658Zm-7.497-.15.213-.075.252-.076.266-.068.313-.068.36-.067.313-.049.37-.049.442-.05.467-.042.53-.036.414-.023.446-.018.194-.018.035-.008.013-.005.005-.003v-.001l.003-.002v-.001l.001-.004c0-.002-.001-.004-.004-.007l-.004-.003-.006-.003c-.113-.058-.879-.133-1.149-.136-1.19 0-2.697.224-3.712.611l.238.201Zm2.074-1.11.027.001a6.503 6.503 0 0 0-.867.238l-.496.169-.452.166-.341.132-.285.117-.209-.174c.434-.355 1.968-.598 2.491-.642l.132-.007Zm3.546.188c.08.059.363.23.812.232a.143.143 0 0 0 .131-.086.143.143 0 0 0-.028-.154c-.09-.093-.249-.173-.434-.235-.245-.082-.537-.139-.734-.184a.14.14 0 0 0-.102.016.143.143 0 0 0-.068.083.14.14 0 0 0 .008.111c.01.021.039.059.094.09.075.041.234.099.321.127Zm-.287-.278c-.003-.004-.002-.008.003-.011.302.069.834.165 1.057.344l.04.035a1.47 1.47 0 0 1-.438-.066l-.099-.035-.092-.042-.065-.037a.216.216 0 0 1-.05-.036h.001l-.277-.103-.043-.021a.106.106 0 0 1-.037-.028Zm.305.284.002.001a.203.203 0 0 0-.002-.001Z"/>
  </svg>`,
    astonmartin: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 8 24 8" width="340" height="113">
    <defs>
      <linearGradient id="amGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#00665B"/>
        <stop offset="100%" stop-color="#004B42"/>
      </linearGradient>
      <filter id="amGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="1.5" stdDeviation="1.2" flood-color="#CEDC00" flood-opacity="0.4"/>
      </filter>
    </defs>
    <!-- Official Aston Martin Wings Vector -->
    <path fill="url(#amGrad)" stroke="#CEDC00" stroke-width="0.18" filter="url(#amGlow)" d="M.383 9.258c-.158 0-.282.068-.338.182-.068.114-.057.262.022.387l.17.296c.09.16.214.182.304.205.08.012.136.023.192.137l.158.273c.125.228.26.25.362.273.079.012.158.023.259.205.102.182.249.456.621.569.034.012 3.601 1.059 3.613 1.059.373.126.474.262.587.433.068.102.26.376.711.501l3.432.933a.704.704 0 0 0 .711-.182l.621-.592c.091-.08.136-.114.192-.114.057 0 .102.034.192.114l.621.592c.113.091.339.273.712.182l3.431-.933c.463-.125.644-.399.711-.501.113-.171.215-.319.587-.433 0 0 3.568-1.047 3.613-1.059.361-.113.52-.387.621-.569.102-.182.169-.193.248-.205.102-.023.249-.045.373-.273l.158-.273c.068-.114.113-.125.192-.137.09-.023.214-.046.305-.205l.169-.296c.079-.136.091-.273.023-.387a.386.386 0 0 0-.339-.182h-9.675c-.158 0-.406 0-.666.262a.938.938 0 0 0-.169.239c-.079.148-.136.25-.407.25h-1.411c-.26 0-.327-.102-.406-.25a1.017 1.017 0 0 0-.17-.239c-.259-.262-.508-.262-.666-.262H.383Zm.001.239h9.675c.146 0 .316 0 .497.193.112.114.146.24.248.365H.812c-.293 0-.327 0-.417-.137l-.124-.216c-.034-.057-.045-.114-.023-.148.023-.034.068-.057.136-.057Zm13.569 0h9.675c.068 0 .113.023.136.057a.186.186 0 0 1-.023.148l-.124.216c-.09.137-.124.137-.418.137h-9.991c.102-.125.136-.251.248-.365.192-.193.351-.193.497-.193Zm-7.304.74h10.702v1.708H6.649v-1.708Zm10.894.023h5.566c-.023.034-.034.057-.056.08 0 0-.09.148-.124.227-.136.217-.204.216-.587.182l-4.799-.284v-.205Zm-16.641.011h5.566v.205l-4.798.285c-.383.022-.451.034-.587-.182l-.124-.228c-.023-.034-.045-.057-.057-.08Zm7.354.311a.341.341 0 0 0-.219.077.287.287 0 0 0-.09.204c0 .126.067.217.203.285.147.068.214.091.248.137a.115.115 0 0 1-.011.171.245.245 0 0 1-.135.034.453.453 0 0 1-.294-.125l.011.182c.085.043.177.07.271.079a.438.438 0 0 0 .26-.079c.124-.091.124-.285.045-.376-.056-.08-.147-.114-.316-.205-.079-.045-.113-.08-.113-.137 0-.113.147-.147.282-.102a.44.44 0 0 1 .124.068l-.011-.171a2.09 2.09 0 0 0-.113-.034c-.011 0-.07-.011-.142-.008Zm.368.008-.011.148c.124-.012.214-.023.293-.023v.865h.192v-.865c.046 0 .136 0 .294.023l-.011-.148h-.757Zm1.264 0c-.293 0-.496.205-.496.512 0 .296.203.513.496.513.294 0 .497-.217.497-.513 0-.307-.203-.512-.497-.512Zm4.957 0-.012.148c.124-.012.215-.023.294-.023v.877-.012h.192v-.865c.045 0 .135 0 .293.023l-.011-.148h-.756Zm-.508.011c-.102 0-.17 0-.226.011v.991h.192v-.421h.067l.305.421h.226l-.35-.444a.32.32 0 0 0 .158-.103.338.338 0 0 0 .057-.17c0-.148-.113-.217-.204-.251a.62.62 0 0 0-.225-.034Zm-6.932 0-.418.991h.169l.102-.251h.373l.09.251h.215l-.418-.991h-.113Zm3.138 0v.991h.136v-.672l.587.672h.102v-.991h-.136v.672l-.587-.672h-.102Zm1.468 0-.111.979h.156l.057-.603.282.569h.09l.271-.569.056.615h.204l-.113-.991h-.102l-.338.695-.35-.695h-.102Zm-.111.979h-.002v.012l.002-.012Zm1.601-.979-.417.991h.169l.101-.251h.373l.09.251h.215l-.418-.991h-.113Zm2.235 0v.991h.192v-.991h-.192Zm.384 0v.991h.136v-.672l.587.672h.102v-.991h-.136v.672l-.587-.672h-.102Zm-9.652.091v.251l-3.985.455c-.429.046-.519.057-.654-.137a1.834 1.834 0 0 1-.102-.159c-.023-.046-.045-.091-.079-.125.09-.012.192-.012.226-.012l4.594-.273Zm11.064 0 4.595.273c.034 0 .124.012.226.012-.023.034-.057.08-.079.125a1.834 1.834 0 0 1-.102.159c-.135.194-.226.183-.655.137l-3.985-.455v-.251Zm-7.644 0c.068 0 .114.011.159.046.135.114.135.33.135.352 0 .274-.136.399-.294.399-.146 0-.282-.125-.293-.398 0-.205.09-.399.293-.399Zm4.415.023h.067c.113 0 .204.046.204.171 0 .08-.046.171-.204.171-.022 0-.056-.012-.078-.012h.011v-.33Zm-6.887.136.147.376h-.282l.135-.376Zm6.096.001.147.375h-.282l.135-.375Zm4.043.318 4.03.455-.824.24c-.226.056-.429.034-.745-.023l-2.461-.41v-.262Zm-11.087 0v.262l-2.461.41c-.327.057-.531.08-.745.023l-.824-.239 4.03-.456Zm0 .478v.331l-.925.238c-.283.069-.452.103-.587.103-.192 0-.305-.045-.994-.25l2.506-.422Zm11.064 0 2.506.422c-.688.205-.801.25-.993.25-.135 0-.305-.023-.587-.102l-.926-.24v-.33Zm-9.449.479h.768c-.463.341-1.163.853-1.468 1.07a.853.853 0 0 1-.486.182c-.18 0-.259-.08-.361-.239-.056-.068-.113-.148-.18-.217.045-.011.09-.011.135-.034.271-.079.666-.284 1.592-.762Zm1.14 0h.643a66.598 66.598 0 0 1-1.309 1.389c-.113.113-.271.273-.508.273-.09 0-.079 0-.903-.228.158-.045.293-.137.361-.182.373-.251 1.31-.945 1.716-1.252Zm.937 0h.587c-.327.557-.768 1.297-.959 1.605-.091.148-.249.376-.542.376-.113.011-.125-.001-.836-.194.147-.08.248-.182.294-.239a74.643 74.643 0 0 0 1.456-1.548Zm.836 0h.53a79.998 79.998 0 0 1-.621 1.912c-.067.182-.158.41-.418.41-.09.011-.067.012-.88-.216.203-.125.327-.319.361-.387.226-.353.745-1.23 1.028-1.719Zm3.149 0h.644a58.301 58.301 0 0 0 1.716 1.252c.068.045.203.125.361.182-.834.228-.813.228-.903.228-.226 0-.395-.16-.508-.273a66.367 66.367 0 0 1-1.31-1.389Zm2.258 0h.836l1.174.296c.079.022.158.034.225.056-.666.205-.767.228-.88.228-.214 0-.497-.148-1.355-.58Zm-9.63.011h.836c-.858.432-1.141.581-1.355.581-.124-.012-.226-.035-.88-.228.067-.011.146-.034.225-.057l1.174-.296Zm4.99 0h.486c.124.398.564 1.787.643 1.992a.857.857 0 0 0 .136.274c-.012-.012-.034-.023-.046-.035l-.62-.592c-.102-.091-.204-.182-.35-.182-.147 0-.26.091-.351.182l-.62.592c-.023.012-.045.023-.057.035.045-.057.079-.137.136-.274.079-.205.519-1.605.643-1.992Zm.711 0h.531c.336.577.678 1.15 1.027 1.719.046.069.158.262.362.387-.813.216-.791.216-.881.216-.259 0-.35-.227-.418-.409-.079-.205-.496-1.549-.621-1.913Zm.791 0h.587c.372.399 1.151 1.229 1.456 1.548.045.046.147.148.294.239-.723.182-.723.194-.836.194-.293 0-.451-.228-.542-.376a95.865 95.865 0 0 1-.959-1.605Zm1.896 0h.768c.937.467 1.332.683 1.592.763l.135.034c-.079.057-.124.136-.18.216-.102.16-.181.239-.361.239-.17 0-.339-.079-.486-.182a75.759 75.759 0 0 1-1.468-1.07Z"/>
  </svg>`,
    alpine: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="580 290 205 105" width="340" height="174">
    <defs>
      <linearGradient id="alpBlue" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#00A3FF"/>
        <stop offset="100%" stop-color="#0066C0"/>
      </linearGradient>
      <filter id="alpGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#0090FF" flood-opacity="0.45"/>
      </filter>
    </defs>
    <!-- Official Alpine Arrow A Vector -->
    <path fill="url(#alpBlue)" filter="url(#alpGlow)" d="m613.26 393.02 27.172 0.0195 29.094-22.488h49.402l-7.3281 22.488h21.977l7.2812-22.488h24.766l18.422-14.266h-38.508l21.137-64.918h-22.004l-83.902 64.918h-33.168l9.1484-28.098-54.781 42.363h60.348zm122.29-73.535-11.961 36.801h-35.613z"/>
  </svg>`,
    racingbulls: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="240" height="240">
    <defs>
      <linearGradient id="rbShieldGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#1A3EDB"/>
        <stop offset="100%" stop-color="#0F2485"/>
      </linearGradient>
      <filter id="vcarbGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#1334C9" flood-opacity="0.5"/>
      </filter>
    </defs>
    <rect x="5" y="5" width="90" height="90" rx="18" fill="url(#rbShieldGrad)" stroke="#FFFFFF" stroke-width="2.5" filter="url(#vcarbGlow)"/>
    <g transform="translate(14, 18) scale(2.9)">
      <path fill="#FFCC00" d="M22.381 11.374c-.389 1.244-1.019 2.33-2.142 3.082l-.33.251-.264.236-.091.107-.025.041-.011.028-.004.016v.013l.001.009.002.007.002.006.005.007.002.002.01.008.012.007.011.004a.16.16 0 0 0 .046.006h.024c.178-.007.512-.141.629-.245l-.139.137-.164.149-.173.146-.18.141-.185.136-.197.134-.204.13-.206.123-.213.118-.223.115-.226.108-.225.1-.236.097-.045.018c-1.97.763-4.327.854-5.914-.44.353.344.787.728 1.199.98-.251-.043-.429-.237-.666-.311.004.008.575.751 2.282.946l.316.032.48.031.464.014.448-.009.44-.039.464-.084.401-.107.599-.181.294-.081.128-.033c.104-.026.214-.052.333-.077l.041-.009c.073.031-.524.339-1.344.57-.361.132-.739.2-1.119.227l-.269.012-.216.001-.218-.005-.264-.015-.315-.027-.31-.034-.056-.007c-.401-.049-.781-.107-1.122-.143h-.006.006c.03.015.209.096 1.067.402-.061.022-.346.061-1.536-.448 2.417 1.392 4.988.759 7.266-.585l.352-.215.053-.034.294-.191.151-.103c.178-.121.353-.246.526-.374 0 .009-.004.021-.004.031a.963.963 0 0 0 .075.01c-.014.041-.014.041-.214.279.435-.351.659-.896 1.12-1.225-.236.473-.538.813-1.1 1.361.033-.024.064-.051.095-.078l.028-.026-.028.026a7.88 7.88 0 0 1-3.682 1.965c.126-.014.251-.039.373-.073-.22.061-.227.068-.32.099.058-.007.058-.007.358-.068-.175.086-.377.127-.865.226 2.806-.444 5.721-2.571 5.956-5.449a.142.142 0 0 1-.152-.143c.009-.562-.147-.982-.42-1.302-.163.58-.413 1.136-1.027 2.072-.26.393-.72.41-1.005.771l-.021-.013-.032-.028-.005-.003-.004-.002-.001-.001h-.003l-.007.001h-.003l-.001.001a.193.193 0 0 0-.058.051l.062-.07.067-.092.016-.031.005-.014.002-.01v-.01l-.001-.009-.001-.003-.002-.004-.001-.003-.003-.003a.027.027 0 0 0-.005-.006l-.009-.006-.04-.019-.006-.004-.004-.004-.002-.003-.002-.002-.002-.006v-.006l.001-.007.004-.011.023-.034.014-.016c.622-.687 1.192-1.306 1.438-2.228l.006-.021-.027.032c-.087.103-.147.147-.24.265l.11-.39.035-.127.065-.26.052-.225a.859.859 0 0 0-.118-.055Zm-2.257 6.199a9.006 9.006 0 0 1-1.105.547c-.38.155-.768.279-1.152.354a10.026 10.026 0 0 0 2.257-.901Zm-6.505.203.051.02-.001-.012-.05-.008Zm3.644-2.807c-.372-.201-.515-.63-.744-.945-.6-.62-.701-1.681-.858-2.549-.158-.843-.878-1.467-1.378-2.119-.443-.361-1.599-1.457-2.145-1.632-.72-.299-1.348.267-1.947.544-.487.201-1.002.258-1.432.63-.674.865-1.079.173-1.861.858-1.165 1.22-1.606.146-3.207 1.575-.429.257-.831.515-1.348.487-.823-.039-1.103-1.145-.459-1.633.449-.502 1.552-1.019 1.004-1.831-.57-.508-1.24-.292-1.918-.858-.313.49.087 1.155.601 1.318.211.131.701-.078.802.227-.217.434-.81.669-1.088 1.089-.693.8-.009 2.112.973 2.173.363.117.825-.179 1.06-.057.028.286 0 .544.057.802.027.282.348.584.172.858-.285.245-.654.37-1.03.347-.195.225-.228.48-.344.744-.142.258-.428.372-.629.487-.133.201-.265.424-.545.458-.171.201-.2.458-.257.716.716.19.87.094 1.26-.515.143-.143.344-.029.486 0 .407-.049.711-.321 1.003-.573 1.042-.272 1.032.41 2.233-.372.201-.086.287-.315.373-.487.1-.192.378-.562.028-.658-.899 1.819-2.464.338-3.665 1.715-.184.051-.041-.235 0-.287.862-1.256 2.823-.15 3.493-1.776.117-.25.051-1.247.343-1.232.029 0 .115.029.115.086-.278 1.214-.094 1.591 1.202 1.378.444-.128 1.716.325 1.69-.286 0-.114-.115-.171 0-.257.028-.029.114 0 .143.028.081.49.511.85.919 1.06.823.56.49 1.291-.459 1.26-.315-.172-.4-.487-.63-.745-.267-.234-.633-.122-.944-.057-.155.233.212.511.286.745.143.086.344-.058.458.114.115.171.172.344.344.458.496.476 1.532-.36 2.061-.401.463.051.674-.371.831-.716.261-.477-.434-.948-.487-1.374-.158-.044-.368-.167-.487 0 .088.213.579.993.544 1.231-.064.173-.21.572-.429.544.058-.2.144-.428.144-.658-.105-.245-.565-.953-.602-1.203.092-.242.562-.102.744-.344.201-.315.258-.629.316-1.03a.127.127 0 0 1 .086-.087c.279.18-.005 1.042-.172 1.232-.016.297.568.098.687 0 .221.046.67-.175.773-.029a1.545 1.545 0 0 0-.286.573c-.172.2-.458.344-.458.63.031.18.273-.11.286.114-.249.317-.218.394-.143.745.261.368.761.065 1.088-.028.552-.217 1.172.126 1.604-.459.116.01.222.074.286.172.319.335.769.513 1.231.487.188-.13-.222-.233-.286-.287-.201-.114-.459-.286-.516-.515-.075-.32-.306-.613-.458-.916.669.01.739 1.406 1.716 1.203.048-.033.043-.069.029-.115l-.259-.057Zm-16.866.687c-.339.139-.159.558-.371.773 0 .028-.058.086 0 .115.142.028.257.086.429.114.076-.256.15-.541.2-.773-.058-.086-.143-.2-.258-.229Zm17.317-.39c-.085.109-.274.115-.356.19a.115.115 0 0 0-.023.082.24.24 0 0 1-.073.242c-.087.094-.25.136-.397.126-.734.008-1.092-.351-1.392-.523-.41.265-.665.37-1.201.287-.315-.025-.596.134-.902.212.434.372 2.193.844 1.545.524-1.072-.607-.295-.203.645.019a6.905 6.905 0 0 0 1.625.2 8.043 8.043 0 0 0 2.427-1.279.342.342 0 0 1-.118-.021.192.192 0 0 1-.095-.081c-.031-.052-.048-.136.023-.251.074-.119.286-.327.734-.651a.014.014 0 0 1 .004-.003c1.097-.736 1.71-1.8 2.088-3.015a4.09 4.09 0 0 0-.798-.2c-.405 1.006-.503 1.716-1.458 2.285-1.108.725-.414.539-.403.534.086-.035.168-.079.245-.132-.429.689-1.174 1.129-2.063 1.327a.206.206 0 0 1-.057.128Zm-16.687.39c.2-.115.315-.315.401-.487-.062-.096-.136-.223-.286-.172-.137.106-.28.201-.429.287-.072.194.107.439.315.372h-.001Zm8.648-.63c.114.143.114.343.258.458a.617.617 0 0 0 .486-.143c.086-.057-.028-.143-.057-.229-.086-.115-.028-.344-.229-.344-.217.051-.455-.012-.659.057 0 .087.172.087.201.201Zm5.125-.344a1.694 1.694 0 0 1-.4.057h-.029c-.169-.156.184-.468.372-.458h.086c.105.044.078.32-.029.401Zm7.828-3.179c-.038.169-.078.328-.12.489a.142.142 0 0 1 .133.177c-.243.936-.807 1.571-1.433 2.262l.003.005c.1-.07.207-.127.313-.184.163-.088.326-.176.442-.351.632-.962.872-1.515 1.032-2.115-.11-.106-.233-.2-.37-.283Zm-.948-2.516.117.073c1.725 1.116 2.457 3.197 1.833 4.905l.006-.005c.29-.834.408-1.718.349-2.599-.306-2.281-1.087-4.283-3.87-5.019 1.721.416 1.85.631 2.075.779-1.337-1.235-3.49-1.664-5.667-1.295 1.253-.404 3.303-.361 4.61.417l.031.019c-3.108-1.906-6.839-1.075-9.134 1.114.429.083.806.366 1.157.637l.109-.059.127-.064.131-.062.27-.119.281-.11.295-.105.306-.096.285-.079.323-.079.299-.064.273-.05.17-.027.17-.025.138-.018.172-.019c1.705-.182 3.539.045 4.907.946l.013.008a4.445 4.445 0 0 1 1.518 1.685c-.033.021-.065.016-.094-.001l-.038-.029-.108-.115-.02-.015c-.014-.005-.046-.036-.061-.043l-.209-.189-.248-.186-.266-.162-.044-.024c-.773-.418-1.714-.603-2.55-.779l-.051-.01.415.146.459.135.494.143.299.099.242.094.16.071.143.072.085.046.098.058Zm-1.112 4.436c.186-.409.62-.629.762-1.123-.021.073.134.103.195.103.245-.042.251-.379.33-.449-.061.766-.578 1.393-1.144 1.912a.255.255 0 0 0-.244-.011c-.024-.144.286-.344.101-.432Zm-5.023-.402c-.032.056-.081.202-.143.201-.062-.001-.089.009-.086-.057-.005-.193-.036-.429-.201-.544-.374-.582-.468.147-.601.057-.08-.162.046-.345.115-.487.032-.038.044-.083.086-.114.061-.353.383-.152.458.057.197.245.429.521.401.802-.029-.029-.029.028-.029.085Zm-.549-3.278c-.217-.28-.442-.582-.683-.803 1.207-.431 3.157-.54 4.121-.577.228-.007.352-.022.403-.037a.18.18 0 0 0 .087-.052.143.143 0 0 0 .037-.115.15.15 0 0 0-.066-.11.573.573 0 0 0-.18-.059 8.12 8.12 0 0 0-1.056-.106h-.002c-.657 0-1.409.067-2.124.192.255-.086.515-.156.779-.209a.142.142 0 0 0 .114-.146.143.143 0 0 0-.128-.134c-.122-.013-.895.075-1.605.241-.485.113-.938.266-1.149.438a.08.08 0 0 0-.013.013c-.071-.06-.143-.119-.213-.176 1.546-.816 4.032-1.269 6.157-.782 1.178.269 2.246.83 2.973 1.785-.868-.665-2.087-.901-3.134-1.122a.142.142 0 0 0-.082.27c.762.303 1.566.393 2.28.798 1.572.902 2.381 2.603 2.161 4.159.016-.994-.449-1.573-1.164-1.938-2.191-.92-4.263.309-6 .558v-.014l-.003-.005c-.1-.215.937-.435 1.075-.518.082-.085.222-.056.315-.132.092-.091.23-.111.353-.135.323-.165.679-.219 1.039-.226.127.019.245-.052.372-.043a.347.347 0 0 1 .188-.03c.385-.029.779-.065 1.111-.299.035-.021.153-.086.053-.099-.629-.17-.932.26-1.506-.256.009-.022-.181-.103-.208-.103-.304.061-.589.197-.905.202-.144.032-.201-.04-.345-.04-.193.045-.46.169-.657.184-.092-.017-.542.218-.551.056a.017.017 0 0 1-.01 0c-.048-.182 2.822-1.254 1.641-.532.065.056.447-.105.807-.132.404-.086.941.211 1.118-.185-.007-.065-.162-.046-.2-.019-.077.042-.16.014-.241.032-.135.016-.66-.079-.779-.071-.095-.081.528-.064.583-.073.205-.031.452-.077.657-.115.091-.011.183-.013.274-.006.186.044.684-.024.153-.153-.14-.027-.581-.041-.652-.019-.108.014-.576.153-.825.095-.225-.068.7-.106.59-.168-1.148-.145-2.457-.109-4.724 1-.072-.089-.15-.183-.236-.284Zm-2.543.902c-.029.029-.058.029-.115.029-.077-.29-.104-.592-.258-.831-.08-.079-.184-.181-.115-.315a.138.138 0 0 1 .173-.029c.262.196.306.469.315.802.057.057.028.229 0 .344Zm9.227-1.658Zm-7.497-.15.213-.075.252-.076.266-.068.313-.068.36-.067.313-.049.37-.049.442-.05.467-.042.53-.036.414-.023.446-.018.194-.018.035-.008.013-.005.005-.003v-.001l.003-.002v-.001l.001-.004c0-.002-.001-.004-.004-.007l-.004-.003-.006-.003c-.113-.058-.879-.133-1.149-.136-1.19 0-2.697.224-3.712.611l.238.201Zm2.074-1.11.027.001a6.503 6.503 0 0 0-.867.238l-.496.169-.452.166-.341.132-.285.117-.209-.174c.434-.355 1.968-.598 2.491-.642l.132-.007Zm3.546.188c.08.059.363.23.812.232a.143.143 0 0 0 .131-.086.143.143 0 0 0-.028-.154c-.09-.093-.249-.173-.434-.235-.245-.082-.537-.139-.734-.184a.14.14 0 0 0-.102.016.143.143 0 0 0-.068.083.14.14 0 0 0 .008.111c.01.021.039.059.094.09.075.041.234.099.321.127Zm-.287-.278c-.003-.004-.002-.008.003-.011.302.069.834.165 1.057.344l.04.035a1.47 1.47 0 0 1-.438-.066l-.099-.035-.092-.042-.065-.037a.216.216 0 0 1-.05-.036h.001l-.277-.103-.043-.021a.106.106 0 0 1-.037-.028Zm.305.284.002.001a.203.203 0 0 0-.002-.001Z"/>
    </g>
    <text x="50" y="82" font-family="'Arial Black', sans-serif" font-size="11" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">VCARB</text>
  </svg>`,
    haas: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="47 0 105 105" width="240" height="240">
    <defs>
      <filter id="haasGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#E6002B" flood-opacity="0.45"/>
      </filter>
    </defs>
    <!-- Official Haas F1 Red Outer Roundel & Stylized H -->
    <path fill="#E6002B" filter="url(#haasGlow)" d="M99.6586,0c-29.005789,0-52.5001494,23.4992046-52.5001494,52.5055374,0,1.0360982.0356395,2.0381881.0750521,3.0402615h-6.8542107c-.383878,0-.5776953.2300005-.7326602.5037472-.114992.2694132-6.2014467,10.9758982-6.3558679,11.2453279-.1144648.2683257-.1144648.4232906.1938338.4232906h15.9074895c6.5108163,21.5684786,26.5383786,37.2864512,50.2665128,37.2864512,29.005789,0,52.4985347-23.4981336,52.4985347-52.4990784,0-29.0063328-23.4927457-52.5055374-52.4985347-52.5055374M62.1432192,67.7181646h13.9816077l-6.7435191,11.6696895c-3.0008489-3.4289837-5.4682428-7.3579413-7.2380886-11.6696895M99.6586,92.9861276c-11.0174858,0-20.9562148-4.3911172-28.2736725-11.519058h11.3646533s32.6610001-57.5456618,32.7749211-57.7735039c.1598256-.2348283.0793691-.3887222-.1490003-.3887222h-13.3288603c-.2694132,0-.3093696.0793526-.3849655.1943611-.0793691.113921-18.4126813,32.0465943-18.4126813,32.0465943h-23.9570472c-.0799128-1.0020734-.113921-2.0041634-.113921-3.0402615,0-22.3421663,18.0984511-40.4870491,40.4805737-40.4870491,11.4002763,0,21.7228998,4.7409869,29.0808411,12.3677978-3.1941225,5.3926634-17.5266874,29.7330613-19.4514817,33.2770535-1.1149235-2.5813314-6.2792011-2.078128-8.9366556-2.1175407-1.1564946,1.9242506-6.5842372,12.1723657-6.5842372,12.1723657,0,0,3.0008324-.0388854,5.6976996,0,2.6207441.0410274,2.9306574,2.7724466,1.8886276,4.506653-1.0415026,1.7336627-5.3186988,9.242252-5.3186988,9.242252h13.7526947s16.8728525-29.4652629,26.464414-46.2198774c2.5025061,5.2393297,3.8868428,11.0909232,3.8868428,17.2583452,0,22.340568-18.1378637,40.4805902-40.4800465,40.4805902"/>
  </svg>`,
    williams: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 7.82 5.85" width="320" height="239">
    <defs>
      <linearGradient id="wilGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#00D2FF"/>
        <stop offset="50%" stop-color="#00A3E0"/>
        <stop offset="100%" stop-color="#00609C"/>
      </linearGradient>
      <filter id="wilGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="0.1" stdDeviation="0.1" flood-color="#00A3E0" flood-opacity="0.5"/>
      </filter>
    </defs>
    <!-- Official Williams Racing Geometric W Vector -->
    <path fill="url(#wilGrad)" filter="url(#wilGlow)" d="M 3.8139937,0.02202209 1.6864772,4.6324451 2.1307091,5.8462835 H 2.3384183 L 3.6218924,2.9539632 A 4.3955101,4.3955101 0 0 0 3.9064437,2.2263802 4.7941204,4.7941204 0 0 0 4.1861897,2.946758 L 5.4768673,5.8462835 H 5.6845774 L 6.1276102,4.6324451 4.0012934,0.02202209 Z M 1.3695088,0.07004733 H 0.02 L 1.549604,4.2590495 2.2699825,2.6886238 Z M 5.5332969,2.6742171 6.2632821,4.2590495 7.7976878,0.07004733 H 6.4349717 Z"/>
  </svg>`,
    audi: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 6 24 12" width="340" height="170">
    <defs>
      <linearGradient id="audiChr" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#FFFFFF"/>
        <stop offset="50%" stop-color="#CBD5E1"/>
        <stop offset="100%" stop-color="#94A3B8"/>
      </linearGradient>
      <filter id="audiGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" flood-color="#FF1801" flood-opacity="0.4"/>
      </filter>
    </defs>
    <!-- Official Audi Four Rings Vector with Revolut Neon Red Ring Accent -->
    <path fill="url(#audiChr)" filter="url(#audiGlow)" d="M19.848,7.848c-0.992,0-1.902,0.348-2.616,0.928c-0.714-0.58-1.624-0.928-2.616-0.928 c-0.992,0-1.902,0.348-2.616,0.928c-0.714-0.58-1.624-0.928-2.616-0.928c-0.992,0-1.902,0.348-2.616,0.928 c-0.714-0.58-1.624-0.928-2.616-0.928C1.859,7.848,0,9.707,0,12s1.859,4.152,4.152,4.152c0.992,0,1.902-0.348,2.616-0.928 c0.714,0.58,1.624,0.928,2.616,0.928c0.992,0,1.902-0.348,2.616-0.928c0.714,0.58,1.624,0.928,2.616,0.928 c0.992,0,1.902-0.348,2.616-0.928c0.714,0.58,1.624,0.928,2.616,0.928C22.141,16.152,24,14.293,24,12S22.141,7.848,19.848,7.848z M17.232,13.866c-0.376-0.526-0.598-1.17-0.598-1.866c0-0.696,0.222-1.34,0.598-1.866c0.376,0.526,0.598,1.17,0.598,1.866 C17.83,12.696,17.608,13.34,17.232,13.866z M12,13.866c-0.376-0.526-0.598-1.17-0.598-1.866c0-0.696,0.222-1.34,0.598-1.866 c0.376,0.526,0.598,1.17,0.598,1.866C12.598,12.696,12.376,13.34,12,13.866z M6.768,13.866C6.392,13.34,6.17,12.696,6.17,12 c0-0.696,0.222-1.34,0.598-1.866C7.144,10.66,7.366,11.304,7.366,12C7.366,12.696,7.144,13.34,6.768,13.866z M0.938,12 c0-1.775,1.439-3.214,3.214-3.214c0.736,0,1.414,0.248,1.956,0.665C5.56,10.154,5.232,11.039,5.232,12 c0,0.961,0.328,1.846,0.876,2.549c-0.542,0.416-1.22,0.665-1.956,0.665C2.377,15.214,0.938,13.775,0.938,12z M7.428,14.549 C7.976,13.846,8.304,12.961,8.304,12c0-0.961-0.328-1.846-0.876-2.549c0.542-0.416,1.22-0.665,1.956-0.665 c0.736,0,1.414,0.248,1.956,0.665c-0.549,0.704-0.876,1.588-0.876,2.549c0,0.961,0.328,1.846,0.876,2.549 c-0.542,0.416-1.22,0.665-1.956,0.665C8.648,15.214,7.97,14.966,7.428,14.549z M12.66,14.549c0.549-0.704,0.876-1.588,0.876-2.549 c0-0.961-0.328-1.846-0.876-2.55c0.542-0.416,1.22-0.665,1.956-0.665s1.414,0.248,1.956,0.665 c-0.549,0.704-0.876,1.588-0.876,2.549c0,0.961,0.328,1.846,0.876,2.549c-0.542,0.416-1.22,0.665-1.956,0.665 C13.88,15.214,13.202,14.966,12.66,14.549z M19.848,15.214c-0.736,0-1.414-0.248-1.956-0.665c0.548-0.704,0.876-1.588,0.876-2.549 c0-0.961-0.328-1.846-0.876-2.549c0.542-0.416,1.22-0.665,1.956-0.665c1.775,0,3.214,1.439,3.214,3.214 S21.623,15.214,19.848,15.214z"/>
    <circle cx="19.8" cy="12" r="3.2" stroke="#FF1801" stroke-width="0.5" fill="none" opacity="0.95"/>
  </svg>`,
  },
  He = {
    cadillac: { headline: 'CADILLAC', subtitle: 'FORMULA 1' },
    mclaren: { headline: 'McLAREN', subtitle: 'FORMULA 1' },
    ferrari: { headline: 'SCUDERIA FERRARI', subtitle: 'HP' },
    mercedes: { headline: 'MERCEDES-AMG', subtitle: 'PETRONAS FORMULA ONE' },
    redbull: { headline: 'ORACLE RED BULL', subtitle: 'RACING' },
    astonmartin: { headline: 'ASTON MARTIN', subtitle: 'ARAMCO FORMULA ONE' },
    alpine: { headline: 'BWT ALPINE', subtitle: 'FORMULA ONE' },
    racingbulls: { headline: 'VISA CASH APP RB', subtitle: 'FORMULA ONE' },
    haas: { headline: 'MONEYGRAM HAAS', subtitle: 'FORMULA 1' },
    williams: { headline: 'WILLIAMS', subtitle: 'RACING' },
    audi: { headline: 'AUDI', subtitle: 'FORMULA 1' },
  },
  p0 = {
    ferrari: {
      drivers: [
        { name: 'Charles Leclerc', role: '2026 Race Driver', years: '2019-Hiện tại' },
        {
          name: 'Lewis Hamilton',
          role: '2026 Race Driver · 7x Vô Địch',
          isChampion: !0,
          years: '2025-Hiện tại',
        },
        {
          name: 'Michael Schumacher',
          role: '5x Vô Địch cùng Ferrari',
          isChampion: !0,
          years: '1996-2006',
        },
        { name: 'Niki Lauda', role: '2x Vô Địch cùng Ferrari', isChampion: !0, years: '1974-1977' },
        {
          name: 'Kimi Räikkönen',
          role: 'Nhà Vô Địch Thế Giới 2007',
          isChampion: !0,
          years: '2007-09, 14-18',
        },
        {
          name: 'Sebastian Vettel',
          role: '14 Chiến thắng cùng Ferrari',
          isChampion: !0,
          years: '2015-2020',
        },
        {
          name: 'Fernando Alonso',
          role: '11 Chiến thắng cùng Ferrari',
          isChampion: !0,
          years: '2010-2014',
        },
        { name: 'Gilles Villeneuve', role: 'Huyền thoại tốc độ Ferrari', years: '1977-1982' },
      ],
      stats: {
        constructorTitles: 16,
        driverTitles: 15,
        raceWins: 248,
        polePositions: 253,
        podiums: 825,
        fastestLaps: 262,
        debutYear: 1950,
        heritageNoteVi:
          'Đội đua duy nhất tham gia trọn vẹn mọi mùa giải F1 kể từ 1950, biểu tượng tối thượng của tốc độ và danh vọng.',
        heritageNoteEn:
          'The only constructor to compete in every F1 season since 1950, the pinnacle of racing heritage.',
      },
    },
    mclaren: {
      drivers: [
        { name: 'Lando Norris', role: '2026 Race Driver · Chiến Thắng GP', years: '2019-Hiện tại' },
        {
          name: 'Oscar Piastri',
          role: '2026 Race Driver · Chiến Thắng GP',
          years: '2023-Hiện tại',
        },
        {
          name: 'Ayrton Senna',
          role: '3x Vô Địch cùng McLaren',
          isChampion: !0,
          years: '1988-1993',
        },
        {
          name: 'Alain Prost',
          role: '3x Vô Địch cùng McLaren',
          isChampion: !0,
          years: '1980, 84-89',
        },
        { name: 'Mika Häkkinen', role: '2x Vô Địch Thế Giới', isChampion: !0, years: '1993-2001' },
        {
          name: 'Lewis Hamilton',
          role: 'Nhà Vô Địch Thế Giới 2008',
          isChampion: !0,
          years: '2007-2012',
        },
        { name: 'Niki Lauda', role: 'Vô Địch Thế Giới 1984', isChampion: !0, years: '1982-1985' },
        { name: 'Bruce McLaren', role: 'Nhà Sáng Lập & Tay Đua', years: '1966-1970' },
      ],
      stats: {
        constructorTitles: 9,
        driverTitles: 12,
        raceWins: 189,
        polePositions: 163,
        podiums: 522,
        fastestLaps: 169,
        debutYear: 1966,
        heritageNoteVi:
          'Đội đua giàu thành tích thứ hai lịch sử F1, nổi danh với kỷ nguyên vàng Senna - Prost và di sản Papaya.',
        heritageNoteEn:
          'The second most successful team in F1 history, legendary for the Senna-Prost golden era and iconic Papaya livery.',
      },
    },
    mercedes: {
      drivers: [
        { name: 'George Russell', role: '2026 Race Driver · Lãnh Đội', years: '2022-Hiện tại' },
        {
          name: 'Kimi Antonelli',
          role: '2026 Race Driver · Siêu Tài Năng',
          years: '2025-Hiện tại',
        },
        {
          name: 'Lewis Hamilton',
          role: '6x Vô Địch cùng Mercedes',
          isChampion: !0,
          years: '2013-2024',
        },
        {
          name: 'Nico Rosberg',
          role: 'Nhà Vô Địch Thế Giới 2016',
          isChampion: !0,
          years: '2010-2016',
        },
        {
          name: 'Michael Schumacher',
          role: 'Huyền Thoại Trở Lại F1',
          isChampion: !0,
          years: '2010-2012',
        },
        {
          name: 'Juan Manuel Fangio',
          role: '2x Vô Địch cùng Mercedes',
          isChampion: !0,
          years: '1954-1955',
        },
        { name: 'Valtteri Bottas', role: '10 Chiến Thắng cùng Mũi Tên Bạc', years: '2017-2021' },
        { name: 'Stirling Moss', role: 'Huyền thoại Silver Arrows', years: '1955' },
      ],
      stats: {
        constructorTitles: 8,
        driverTitles: 9,
        raceWins: 128,
        polePositions: 139,
        podiums: 296,
        fastestLaps: 109,
        debutYear: '1954 / 2010',
        heritageNoteVi:
          'Kỷ lục vô tiền khoáng hậu: 8 năm liên tiếp vô địch đội đua thế giới (2014-2021) trong kỷ nguyên Hybrid.',
        heritageNoteEn:
          'Unprecedented modern dominance: 8 consecutive Constructors World Championships (2014-2021) in the hybrid era.',
      },
    },
    redbull: {
      drivers: [
        {
          name: 'Max Verstappen',
          role: '2026 Race Driver · 4x Vô Địch',
          isChampion: !0,
          years: '2016-Hiện tại',
        },
        { name: 'Isack Hadjar', role: '2026 Race Driver · Tân Binh', years: '2026-Hiện tại' },
        {
          name: 'Sebastian Vettel',
          role: '4x Vô Địch cùng Red Bull',
          isChampion: !0,
          years: '2009-2014',
        },
        { name: 'Daniel Ricciardo', role: '7 Chiến Thắng cùng Red Bull', years: '2014-2018' },
        { name: 'Mark Webber', role: '9 Chiến Thắng cùng Red Bull', years: '2007-2013' },
        { name: 'Sergio Pérez', role: '5 Chiến Thắng cùng Red Bull', years: '2021-2024' },
        { name: 'David Coulthard', role: 'Tay đua đặt nền móng Red Bull', years: '2005-2008' },
        { name: 'Alex Albon', role: 'Podium Finisher', years: '2019-2020' },
      ],
      stats: {
        constructorTitles: 6,
        driverTitles: 7,
        raceWins: 121,
        polePositions: 103,
        podiums: 281,
        fastestLaps: 99,
        debutYear: 2005,
        heritageNoteVi:
          'Biểu tượng của sự táo bạo và triết lý khí động học đỉnh cao Adrian Newey, hai kỷ nguyên thống trị Vettel & Verstappen.',
        heritageNoteEn:
          'Pioneers of extreme aerodynamics under Adrian Newey, authoring dominant eras under Vettel and Verstappen.',
      },
    },
    cadillac: {
      drivers: [
        { name: 'Sergio Pérez', role: '2026 Race Driver · 6x GP Winner', years: '2026-Hiện tại' },
        {
          name: 'Valtteri Bottas',
          role: '2026 Race Driver · 10x GP Winner',
          years: '2026-Hiện tại',
        },
        {
          name: 'Earl Bamber',
          role: 'Cadillac V-Series.R Le Mans Pilot',
          years: 'Cadillac Racing',
        },
        { name: 'Alex Lynn', role: 'FIA WEC Hypercar Pole Winner', years: 'Cadillac Racing' },
        {
          name: 'Sébastien Bourdais',
          role: 'Rolex 24 at Daytona Winner',
          years: 'Cadillac Racing',
        },
        { name: 'Renger van der Zande', role: 'IMSA GTP Champion', years: 'Cadillac Racing' },
        { name: 'Pipo Derani', role: 'IMSA WeatherTech Champion', years: 'Cadillac Racing' },
        {
          name: 'Scott Dixon',
          role: 'IndyCar Legend & Cadillac Pilot',
          isChampion: !0,
          years: 'Cadillac Racing',
        },
      ],
      stats: {
        constructorTitles: 0,
        driverTitles: 0,
        raceWins: 0,
        polePositions: 0,
        podiums: 0,
        fastestLaps: 0,
        debutYear: 2026,
        heritageNoteVi:
          'Tân binh F1 2026 danh giá mang sức mạnh cơ bắp Mỹ, sở hữu 4 chức vô địch IMSA GTP và 3 cúp Daytona 24h.',
        heritageNoteEn:
          'Premier American factory works constructor entering F1 in 2026, backed by 4 IMSA titles and 3 Rolex 24 overall victories.',
      },
    },
    williams: {
      drivers: [
        { name: 'Carlos Sainz', role: '2026 Race Driver · 3x GP Winner', years: '2025-Hiện tại' },
        { name: 'Alex Albon', role: '2026 Race Driver · Trụ Cột', years: '2022-Hiện tại' },
        {
          name: 'Nigel Mansell',
          role: 'Nhà Vô Địch Thế Giới 1992',
          isChampion: !0,
          years: '1985-88, 91-92, 94',
        },
        { name: 'Alain Prost', role: 'Nhà Vô Địch Thế Giới 1993', isChampion: !0, years: '1993' },
        {
          name: 'Damon Hill',
          role: 'Nhà Vô Địch Thế Giới 1996',
          isChampion: !0,
          years: '1993-1996',
        },
        {
          name: 'Jacques Villeneuve',
          role: 'Nhà Vô Địch Thế Giới 1997',
          isChampion: !0,
          years: '1996-1998',
        },
        {
          name: 'Nelson Piquet',
          role: 'Nhà Vô Địch Thế Giới 1987',
          isChampion: !0,
          years: '1986-1987',
        },
        { name: 'Ayrton Senna', role: 'Huyền Thoại Bất Tử F1', isChampion: !0, years: '1994' },
      ],
      stats: {
        constructorTitles: 9,
        driverTitles: 7,
        raceWins: 114,
        polePositions: 128,
        podiums: 313,
        fastestLaps: 133,
        debutYear: 1977,
        heritageNoteVi:
          'Đội đua truyền thống huyền thoại của ngài Frank Williams, sở hữu 9 danh hiệu Vô địch Thế giới và 114 chiến thắng GP.',
        heritageNoteEn:
          'Historic British racing powerhouse founded by Sir Frank Williams, boasting 9 Constructors Championships.',
      },
    },
    astonmartin: {
      drivers: [
        {
          name: 'Fernando Alonso',
          role: '2026 Race Driver · 2x Vô Địch',
          isChampion: !0,
          years: '2023-Hiện tại',
        },
        {
          name: 'Lance Stroll',
          role: '2026 Race Driver · Podium Finisher',
          years: '2021-Hiện tại',
        },
        {
          name: 'Sebastian Vettel',
          role: 'Podium cùng Aston Martin',
          isChampion: !0,
          years: '2021-2022',
        },
        { name: 'Sergio Pérez', role: 'Chiến thắng GP tại Racing Point', years: 'Heritage' },
        { name: 'Nico Hülkenberg', role: 'Reserve & Points Scorer', years: '2021-2022' },
        { name: 'Roy Salvadori', role: 'Tay đua F1 đầu tiên của Aston Martin', years: '1959' },
        { name: 'Carroll Shelby', role: 'Huyền thoại thể thao tốc độ', years: '1959' },
        { name: 'Maurice Trintignant', role: 'Le Mans & F1 Driver', years: '1959' },
      ],
      stats: {
        constructorTitles: 0,
        driverTitles: 0,
        raceWins: 1,
        polePositions: 1,
        podiums: 10,
        fastestLaps: 3,
        debutYear: '1959 / 2021',
        heritageNoteVi:
          'Thương hiệu quý tộc Anh Quốc hợp tác cùng Adrian Newey & Honda hướng tới đỉnh cao vô địch thế giới từ 2026.',
        heritageNoteEn:
          'British ultra-luxury pedigree partnering with Adrian Newey and Honda works power for the 2026 championship assault.',
      },
    },
    alpine: {
      drivers: [
        { name: 'Pierre Gasly', role: '2026 Race Driver · GP Winner', years: '2023-Hiện tại' },
        { name: 'Franco Colapinto', role: '2026 Race Driver · Sao Trẻ', years: '2025-Hiện tại' },
        {
          name: 'Fernando Alonso',
          role: '2x Vô Địch cùng Renault',
          isChampion: !0,
          years: '2003-06, 08-09, 21-22',
        },
        {
          name: 'Alain Prost',
          role: '9 Chiến Thắng cùng Renault',
          isChampion: !0,
          years: '1981-1983',
        },
        { name: 'René Arnoux', role: 'Huyền Thoại Turbo Renault', years: '1979-1982' },
        { name: 'Esteban Ocon', role: 'Chiến Thắng GP Hungary 2021', years: '2020-2024' },
        { name: 'Giancarlo Fisichella', role: '2 Chiến Thắng cùng Renault', years: '2005-2007' },
        { name: 'Daniel Ricciardo', role: 'Podiums cùng Renault', years: '2019-2020' },
      ],
      stats: {
        constructorTitles: 2,
        driverTitles: 2,
        raceWins: 36,
        polePositions: 51,
        podiums: 107,
        fastestLaps: 33,
        debutYear: 1977,
        heritageNoteVi:
          'Tiên phong công nghệ động cơ Turbo tại F1, kế thừa di sản vô địch thế giới 2005-2006 của tập đoàn Renault.',
        heritageNoteEn:
          'Pioneers of F1 turbocharging, custodians of Renaults back-to-back 2005-2006 world championships.',
      },
    },
    audi: {
      drivers: [
        { name: 'Nico Hülkenberg', role: '2026 Factory Driver · 230+ GP', years: '2025-Hiện tại' },
        {
          name: 'Gabriel Bortoleto',
          role: '2026 Factory Driver · F2 Champion',
          isChampion: !0,
          years: '2025-Hiện tại',
        },
        { name: 'Robert Kubica', role: 'Chiến Thắng GP Canada 2008', years: 'Sauber Heritage' },
        {
          name: 'Kimi Räikkönen',
          role: 'Ra mắt F1 tại Sauber 2001',
          isChampion: !0,
          years: '2001, 2019-2021',
        },
        { name: 'Nick Heidfeld', role: '12 Podiums cùng Sauber', years: '2001-03, 06-10' },
        { name: 'Felipe Massa', role: 'Ra mắt F1 cùng Sauber', years: '2002, 2004-2005' },
        {
          name: 'Sebastian Vettel',
          role: 'Ra mắt F1 cùng BMW Sauber 2007',
          isChampion: !0,
          years: '2007',
        },
        { name: 'Charles Leclerc', role: 'Ra mắt F1 tại Sauber 2018', years: '2018' },
      ],
      stats: {
        constructorTitles: 0,
        driverTitles: 0,
        raceWins: 1,
        polePositions: 1,
        podiums: 27,
        fastestLaps: 5,
        debutYear: 2026,
        heritageNoteVi:
          'Gã khổng lồ Đức Audi chính thức bước vào F1 năm 2026 với tư cách Factory Works Team, tiếp quản di sản Sauber.',
        heritageNoteEn:
          'German engineering titan Audi enters F1 in 2026 as a full factory works entry, building upon Saubers foundation.',
      },
    },
    racingbulls: {
      drivers: [
        { name: 'Liam Lawson', role: '2026 Race Driver', years: '2024-Hiện tại' },
        { name: 'Arvid Lindblad', role: '2026 Race Driver · Tân Binh', years: '2026-Hiện tại' },
        {
          name: 'Sebastian Vettel',
          role: 'Chiến Thắng Monza 2008 Lịch Sử',
          isChampion: !0,
          years: '2007-2008',
        },
        { name: 'Pierre Gasly', role: 'Chiến Thắng Monza 2020 Cảm Xúc', years: '2017-18, 19-22' },
        {
          name: 'Max Verstappen',
          role: 'Ra mắt F1 tại Toro Rosso 2015',
          isChampion: !0,
          years: '2015-2016',
        },
        { name: 'Daniel Ricciardo', role: '2x Podium Finisher & Mentor', years: '2012-13, 23-24' },
        { name: 'Carlos Sainz', role: 'Ra mắt F1 tại Toro Rosso 2015', years: '2015-2017' },
        { name: 'Yuki Tsunoda', role: 'Trụ cột VCARB', years: '2021-2025' },
      ],
      stats: {
        constructorTitles: 0,
        driverTitles: 0,
        raceWins: 2,
        polePositions: 1,
        podiums: 5,
        fastestLaps: 3,
        debutYear: 2006,
        heritageNoteVi:
          'Vườn ươm siêu sao của Red Bull, cái nôi đưa Vettel và Verstappen bước lên đỉnh cao thế giới với 2 chiến thắng Monza.',
        heritageNoteEn:
          'Red Bulls championship cradle where Vettel and Verstappen launched their legends, decorated by 2 iconic Monza wins.',
      },
    },
    haas: {
      drivers: [
        { name: 'Esteban Ocon', role: '2026 Race Driver · GP Winner', years: '2025-Hiện tại' },
        {
          name: 'Oliver Bearman',
          role: '2026 Race Driver · Siêu Tân Binh',
          years: '2025-Hiện tại',
        },
        { name: 'Romain Grosjean', role: 'Tay Đua Đặt Nền Móng Haas', years: '2016-2020' },
        { name: 'Kevin Magnussen', role: 'Pole Position Brazil 2022', years: '2017-20, 22-24' },
        { name: 'Nico Hülkenberg', role: 'Trụ Cột Kinh Nghiệm', years: '2023-2024' },
        { name: 'Mick Schumacher', role: 'Chiến Binh Trẻ Haas', years: '2021-2022' },
        { name: 'Pietro Fittipaldi', role: 'Dự Bị & Test Driver', years: '2020-2024' },
        { name: 'Ayao Komatsu', role: 'Kỹ Sư Trưởng Lên Lãnh Đội', years: 'Team Principal' },
      ],
      stats: {
        constructorTitles: 0,
        driverTitles: 0,
        raceWins: 0,
        polePositions: 1,
        podiums: 0,
        fastestLaps: 2,
        debutYear: 2016,
        heritageNoteVi:
          'Đội đua tư nhân Mỹ đầy kiên cường của Gene Haas, sở hữu 1 Pole Position lịch sử và hơn 180 chặng đua F1.',
        heritageNoteEn:
          'American racing grit founded by Gene Haas, capturing an unforgettable pole position across 180+ Grands Prix.',
      },
    },
  };
function Be(l, r) {
  return r === 'vi'
    ? l
    : l
        .replace(/Nhà Vô Địch Thế Giới/gi, 'World Champion')
        .replace(/Vô Địch Thế Giới/gi, 'World Champion')
        .replace(/Vô Địch cùng/gi, 'Champion with')
        .replace(/Vô Địch/gi, 'Champion')
        .replace(/Chiến Thắng cùng/gi, 'Wins with')
        .replace(/Chiến Thắng GP/gi, 'GP Winner')
        .replace(/Chiến Thắng/gi, 'Victory')
        .replace(/Lãnh Đội/gi, 'Team Leader')
        .replace(/Siêu Tài Năng/gi, 'Rising Star')
        .replace(/Tân Binh/gi, 'Rookie Driver')
        .replace(/Huyền Thoại Trở Lại F1/gi, 'Comeback Legend')
        .replace(/Huyền Thoại Bất Tử F1/gi, 'F1 Immortal Legend')
        .replace(/Huyền thoại thể thao tốc độ/gi, 'Motorsport Legend')
        .replace(/Huyền Thoại Turbo/gi, 'Turbo Legend')
        .replace(/Huyền thoại/gi, 'Legend')
        .replace(/Nhà Sáng Lập & Tay Đua/gi, 'Founder & Driver')
        .replace(/Trụ Cột/gi, 'Core Driver')
        .replace(/Sao Trẻ/gi, 'Young Phenom')
        .replace(/Ra mắt F1 tại/gi, 'F1 Debut with')
        .replace(/Ra mắt F1 cùng/gi, 'F1 Debut with')
        .replace(/Tay đua F1 đầu tiên của/gi, 'First F1 Driver for')
        .replace(/Tay đua đặt nền móng/gi, 'Foundation Driver');
}
function Fe(l, r) {
  if (!l) return '';
  const a = r === 'vi' ? 'MÙA GIẢI' : 'SEASONS',
    e = r === 'vi' ? l : l.replace(/Hiện tại/gi, 'Present');
  return `${a}: ${e}`;
}
function D(l, r) {
  if ('letterSpacing' in l)
    try {
      l.letterSpacing = r;
    } catch {}
}
function Ee(l, r, a, e, o, f) {
  const i = r.split(' ');
  let h = '',
    S = e;
  for (let n = 0; n < i.length; n++) {
    const s = h + (h ? ' ' : '') + i[n];
    l.measureText(s).width > o && n > 0 ? (l.fillText(h, a, S), (h = i[n]), (S += f)) : (h = s);
  }
  l.fillText(h, a, S);
}
function Le(l, r = 'vi', a) {
  const f = document.createElement('canvas');
  ((f.width = 2048 / 2), (f.height = 1024 / 2));
  const i = f.getContext('2d');
  i == null || i.scale(0.5, 0.5);
  const h = _[l] || _.ferrari,
    S = He[l] || { headline: h.name.toUpperCase(), subtitle: 'FORMULA 1' },
    n = () => {
      if (!i) return;
      const m = i.createLinearGradient(0, 0, 0, 1024);
      (m.addColorStop(0, '#1c1e26'),
        m.addColorStop(0.4, '#13141a'),
        m.addColorStop(0.8, '#0d0e13'),
        m.addColorStop(1, '#090a0d'),
        (i.fillStyle = m),
        i.fillRect(0, 0, 2048, 1024),
        (i.fillStyle = 'rgba(255, 255, 255, 0.015)'));
      for (let k = 0; k < 1024; k += 4) i.fillRect(0, k, 2048, 1);
      const g = i.createLinearGradient(2048 * 0.15, 0, 2048 * 0.85, 1024);
      (g.addColorStop(0, 'rgba(255, 255, 255, 0.06)'),
        g.addColorStop(0.35, 'rgba(255, 255, 255, 0.02)'),
        g.addColorStop(0.65, 'rgba(0, 0, 0, 0.15)'),
        g.addColorStop(1, 'transparent'),
        (i.fillStyle = g),
        i.fillRect(0, 0, 2048, 1024));
      const t = i.createRadialGradient(2048 / 2, 280, 20, 2048 / 2, 280, 480),
        u = h.accentColor || h.primaryColor || '#ffffff';
      (t.addColorStop(0, `${u}28`),
        t.addColorStop(0.45, `${u}0a`),
        t.addColorStop(1, 'transparent'),
        (i.fillStyle = t),
        i.fillRect(0, 0, 2048, 600),
        i.save(),
        (i.strokeStyle = 'rgba(255, 255, 255, 0.12)'),
        (i.lineWidth = 2),
        i.strokeRect(36, 36, 1976, 952),
        (i.strokeStyle = 'rgba(255, 255, 255, 0.04)'),
        (i.lineWidth = 1),
        i.strokeRect(48, 48, 1952, 928),
        i.restore(),
        i.save(),
        (i.textAlign = 'center'),
        (i.textBaseline = 'middle'),
        (i.font = '800 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'),
        (i.fillStyle = h.accentColor || '#38bdf8'),
        D(i, '8px'));
      const T =
        r === 'vi'
          ? 'GIẢI ĐUA XE CÔNG THỨC 1 THẾ GIỚI · LỄ RA MẮT ĐỘI ĐUA CHÍNH THỨC'
          : 'FIA FORMULA ONE WORLD CHAMPIONSHIP · OFFICIAL CONSTRUCTOR PREMIERE';
      (i.fillText(T, 2048 / 2, 90),
        D(i, '10px'),
        (i.font =
          '900 80px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'),
        (i.shadowColor = 'rgba(0, 0, 0, 0.95)'),
        (i.shadowBlur = 18),
        (i.shadowOffsetY = 6),
        (i.fillStyle = '#FFFFFF'),
        i.fillText(S.headline, 2048 / 2, 595),
        D(i, '14px'),
        (i.font =
          '800 34px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'),
        (i.shadowBlur = 12),
        (i.fillStyle = '#E2E8F0'));
      const b = r === 'vi' ? 'ĐỘI ĐUA CÔNG THỨC 1 CHÍNH THỨC' : S.subtitle;
      (i.fillText(b, 2048 / 2, 690), D(i, '0px'));
      const y = 140,
        c = 4;
      ((i.fillStyle = h.accentColor || h.primaryColor || '#d4af37'),
        i.fillRect(2048 / 2 - y / 2, 745, y, c),
        (i.font = '700 18px ui-monospace, SFMono-Regular, monospace'),
        (i.fillStyle = 'rgba(255, 255, 255, 0.55)'));
      const C =
        r === 'vi'
          ? '// HỘI TRƯỜNG TRƯNG BÀY XE ĐUA F1 // QUY CHUẨN KỸ THUẬT 2026 //'
          : '// OFFICIAL CONSTRUCTOR EXHIBITION PAVILION // 2026 SPECIFICATION //';
      (i.fillText(C, 2048 / 2, 948), i.restore());
    };
  n();
  const s = new o0(f);
  ((s.anisotropy = 16),
    (s.generateMipmaps = !0),
    (s.colorSpace = n0),
    (s.magFilter = f0),
    (s.minFilter = d0),
    (s.wrapS = Q),
    (s.wrapT = Q),
    s.repeat.set(1, 1),
    s.offset.set(0, 0),
    (s.needsUpdate = !0));
  const p = m0[l];
  if (p && i) {
    let m = p.trim();
    m.includes('width=') || (m = m.replace('<svg ', '<svg width="400" height="240" '));
    const g = new Blob([m], { type: 'image/svg+xml;charset=utf-8' }),
      t = window.URL || window.webkitURL,
      u = t.createObjectURL(g),
      T = new Image();
    ((T.onload = () => {
      n();
      const b =
          T.naturalWidth && T.naturalHeight
            ? T.naturalWidth / T.naturalHeight
            : T.width && T.height
              ? T.width / T.height
              : 360 / 220,
        y = 380,
        c = 220;
      let C = y,
        k = C / b;
      k > c && ((k = c), (C = k * b));
      const R = 2048 / 2 - C / 2,
        M = 135 + (c - k) / 2;
      ((i.shadowColor = h.accentColor || '#ffffff'),
        (i.shadowBlur = 24),
        (i.shadowOffsetY = 4),
        i.drawImage(T, R, M, C, k),
        i.restore(),
        (s.needsUpdate = !0),
        t.revokeObjectURL(u));
    }),
      (T.onerror = () => {
        t.revokeObjectURL(u);
      }),
      (T.src = u));
  }
  return s;
}
function We(l, r = 'vi', a) {
  const f = document.createElement('canvas');
  ((f.width = 2048 / 2), (f.height = 1024 / 2));
  const i = f.getContext('2d');
  i == null || i.scale(0.5, 0.5);
  const h = _[l] || _.ferrari,
    S = F0(l),
    n = () => {
      if (!i) return;
      const m = i.createLinearGradient(0, 0, 0, 1024);
      (m.addColorStop(0, '#1a1c24'),
        m.addColorStop(0.5, '#12141a'),
        m.addColorStop(1, '#090a0e'),
        (i.fillStyle = m),
        i.fillRect(0, 0, 2048, 1024),
        (i.strokeStyle = 'rgba(255, 255, 255, 0.025)'),
        (i.lineWidth = 1));
      for (let M = 0; M < 2048; M += 64)
        (i.beginPath(), i.moveTo(M, 0), i.lineTo(M, 1024), i.stroke());
      ((i.strokeStyle = 'rgba(255, 255, 255, 0.14)'),
        (i.lineWidth = 2),
        i.strokeRect(40, 40, 1968, 944),
        i.save(),
        (i.textAlign = 'center'),
        (i.textBaseline = 'middle'),
        (i.font = '800 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'),
        (i.fillStyle = h.accentColor || '#38bdf8'),
        D(i, '8px'));
      const g =
        r === 'vi'
          ? 'GIẢI ĐUA XE CÔNG THỨC 1 THẾ GIỚI · HỒ SƠ KỸ THUẬT 2026'
          : 'FIA FORMULA ONE WORLD CHAMPIONSHIP · 2026 SPECIFICATION';
      (i.fillText(g, 2048 / 2, 110),
        (i.font = '900 78px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'),
        (i.fillStyle = '#FFFFFF'),
        D(i, '6px'),
        i.fillText(S.carModelName.toUpperCase(), 2048 / 2, 215),
        (i.font = '800 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'),
        (i.fillStyle = '#E2E8F0'),
        D(i, '8px'));
      const t =
        r === 'vi'
          ? 'KHÍ ĐỘNG HỌC HIỆU ỨNG MẶT ĐẤT & CÔNG NGHỆ KHUNG GẦM'
          : 'AERODYNAMICS & GROUND EFFECT CHASSIS DOSSIER';
      i.fillText(t, 2048 / 2, 295);
      const u = 220;
      ((i.fillStyle = h.primaryColor || '#dc0000'), i.fillRect(2048 / 2 - u / 2, 335, u, 4));
      const T =
          r === 'vi'
            ? [
                {
                  label: 'HỆ THỐNG ĐỘNG CƠ',
                  val: h.powerUnit.split(' ')[0] + ' ' + (h.powerUnit.split(' ')[1] || 'HYBRID'),
                },
                { label: 'TRỤ SỞ HOẠT ĐỘNG', val: h.base },
                { label: 'ĐỘI ĐUA CHỦ QUẢN', val: h.fullName },
                { label: 'QUY CHUẨN LỐP ĐUA', val: 'LỐP 18-INCH PIRELLI P ZERO' },
              ]
            : [
                {
                  label: 'POWER UNIT ARCHITECTURE',
                  val: h.powerUnit.split(' ')[0] + ' ' + (h.powerUnit.split(' ')[1] || 'HYBRID'),
                },
                { label: 'BASE OF OPERATIONS', val: h.base },
                { label: 'CONSTRUCTOR ENTRY', val: h.fullName },
                { label: 'TIRE REGULATION', val: '18-INCH PIRELLI P ZERO' },
              ],
        b = 450,
        y = 170,
        c = 30,
        C = (2048 - (4 * b + 3 * c)) / 2,
        k = 440;
      (T.forEach((M, I) => {
        const P = C + I * (b + c);
        ((i.fillStyle = '#161924'),
          i.fillRect(P, k, b, y),
          (i.strokeStyle = 'rgba(255, 255, 255, 0.14)'),
          (i.lineWidth = 1.5),
          i.strokeRect(P, k, b, y),
          (i.textAlign = 'left'),
          (i.font = '800 21px -apple-system, BlinkMacSystemFont, sans-serif'),
          (i.fillStyle = h.accentColor || '#38bdf8'),
          D(i, '2px'),
          i.fillText(M.label, P + 26, k + 48));
        const F = M.val.length > 28 ? '800 20px' : '900 23px';
        ((i.font = `${F} -apple-system, BlinkMacSystemFont, sans-serif`),
          (i.fillStyle = '#FFFFFF'),
          D(i, '0px'),
          i.fillText(M.val, P + 26, k + 105),
          (i.fillStyle = h.accentColor || h.primaryColor || '#d4af37'),
          i.fillRect(P + 26, k + 144, 52, 3));
      }),
        (i.textAlign = 'center'),
        (i.font = '700 18px ui-monospace, SFMono-Regular, monospace'),
        (i.fillStyle = 'rgba(255, 255, 255, 0.6)'));
      const R =
        r === 'vi'
          ? '// DỮ LIỆU TELEMETRY THỜI GIAN THỰC // HIỆU CHUẨN 5600K // TIÊU CHUẨN KIỂM ĐỊNH FIA //'
          : '// TELEMETRY LIVE SYNC // 5600K PHOTOMETRIC CALIBRATION // FIA HOMOLOGATED //';
      (i.fillText(R, 2048 / 2, 710), i.restore());
    };
  n();
  const s = new o0(f);
  ((s.anisotropy = 16),
    (s.generateMipmaps = !0),
    (s.colorSpace = n0),
    (s.magFilter = f0),
    (s.minFilter = d0),
    (s.wrapS = Q),
    (s.wrapT = Q),
    s.repeat.set(1, 1),
    s.offset.set(0, 0),
    (s.needsUpdate = !0));
  const p = m0[l];
  if (p && i) {
    let m = p.trim();
    m.includes('width=') || (m = m.replace('<svg ', '<svg width="240" height="150" '));
    const g = new Blob([m], { type: 'image/svg+xml;charset=utf-8' }),
      t = window.URL || window.webkitURL,
      u = t.createObjectURL(g),
      T = new Image();
    ((T.onload = () => {
      (n(), i.save());
      const b = 200,
        y = 120,
        c = 2048 / 2 - b / 2;
      (i.drawImage(T, c, 780, b, y), i.restore(), (s.needsUpdate = !0), t.revokeObjectURL(u));
    }),
      (T.onerror = () => {
        t.revokeObjectURL(u);
      }),
      (T.src = u));
  }
  return s;
}
function De(l, r = 'vi', a) {
  const f = document.createElement('canvas');
  ((f.width = 2048 / 2), (f.height = 1024 / 2));
  const i = f.getContext('2d');
  i == null || i.scale(0.5, 0.5);
  const h = _[l] || _.ferrari,
    S = p0[l] || p0.ferrari;
  let n = null;
  const s = () => {
    if (!i) return;
    const g = i.createLinearGradient(0, 0, 0, 1024);
    (g.addColorStop(0, '#191b22'),
      g.addColorStop(0.4, '#12141a'),
      g.addColorStop(0.8, '#0d0e13'),
      g.addColorStop(1, '#08090d'),
      (i.fillStyle = g),
      i.fillRect(0, 0, 2048, 1024),
      (i.fillStyle = 'rgba(255, 255, 255, 0.012)'));
    for (let G = 0; G < 1024; G += 4) i.fillRect(0, G, 2048, 1);
    const t = i.createRadialGradient(2048 / 2, 140, 20, 2048 / 2, 140, 440),
      u = h.accentColor || h.primaryColor || '#ffffff';
    if (
      (t.addColorStop(0, `${u}24`),
      t.addColorStop(0.5, `${u}08`),
      t.addColorStop(1, 'transparent'),
      (i.fillStyle = t),
      i.fillRect(0, 0, 2048, 360),
      (i.strokeStyle = 'rgba(255, 255, 255, 0.14)'),
      (i.lineWidth = 2),
      i.strokeRect(36, 36, 1976, 952),
      (i.strokeStyle = 'rgba(255, 255, 255, 0.04)'),
      (i.lineWidth = 1),
      i.strokeRect(48, 48, 1952, 928),
      n)
    ) {
      i.save();
      const G = 180,
        B = 80,
        A = 2048 / 2 - G / 2,
        E = 52;
      ((i.shadowColor = h.accentColor || '#ffffff'),
        (i.shadowBlur = 18),
        i.drawImage(n, A, E, G, B),
        i.restore());
    }
    (i.save(),
      (i.textAlign = 'center'),
      (i.textBaseline = 'middle'),
      (i.font = '800 22px -apple-system, BlinkMacSystemFont, sans-serif'),
      (i.fillStyle = h.accentColor || '#38bdf8'),
      D(i, '6px'));
    const T =
      r === 'vi'
        ? 'DI SẢN ĐỘI ĐUA · ĐỘI HÌNH TAY ĐUA HUYỀN THOẠI'
        : 'CONSTRUCTOR HERITAGE · HISTORIC RACING ROSTER';
    (i.fillText(T, 2048 / 2, n ? 148 : 105),
      (i.font = '900 66px -apple-system, BlinkMacSystemFont, sans-serif'),
      (i.fillStyle = '#FFFFFF'),
      (i.shadowColor = 'rgba(0, 0, 0, 0.9)'),
      (i.shadowBlur = 16),
      D(i, '8px'));
    const b =
      r === 'vi' ? 'BẢNG DANH DỰ CÁC TAY ĐUA // HALL OF FAME' : 'HALL OF FAME // RACING DRIVERS';
    (i.fillText(b, 2048 / 2, n ? 210 : 175),
      (i.font = '700 26px -apple-system, BlinkMacSystemFont, sans-serif'),
      (i.fillStyle = '#E2E8F0'),
      (i.shadowBlur = 0),
      D(i, '4px'));
    const y =
      r === 'vi'
        ? `${h.fullName.toUpperCase()} · CÁC TAY ĐUA ĐÃ TỪNG THI ĐẤU`
        : `${h.fullName.toUpperCase()} · DRIVERS THROUGH THE AGES`;
    (i.fillText(y, 2048 / 2, n ? 262 : 235),
      D(i, '0px'),
      (i.fillStyle = h.primaryColor || '#dc0000'),
      i.fillRect(2048 / 2 - 140, n ? 288 : 265, 280, 4));
    const c = S.drivers.slice(0, 8),
      C = 4,
      k = 435,
      R = 265,
      M = 32,
      I = 26,
      P = (2048 - (C * k + (C - 1) * M)) / 2,
      F = n ? 320 : 300;
    (c.forEach((G, B) => {
      const A = B % C,
        E = Math.floor(B / C),
        H = P + A * (k + M),
        W = F + E * (R + I);
      if (
        ((i.fillStyle = G.isChampion ? 'rgba(212, 175, 55, 0.1)' : '#141722'),
        i.fillRect(H, W, k, R),
        (i.strokeStyle = G.isChampion ? 'rgba(212, 175, 55, 0.5)' : 'rgba(255, 255, 255, 0.14)'),
        (i.lineWidth = G.isChampion ? 2 : 1.2),
        i.strokeRect(H, W, k, R),
        (i.textAlign = 'left'),
        (i.font = '900 32px -apple-system, BlinkMacSystemFont, sans-serif'),
        (i.fillStyle = '#FFFFFF'),
        i.fillText(G.name, H + 24, W + 54),
        G.isChampion)
      ) {
        ((i.fillStyle = '#FCD34D'), (i.font = '800 19px sans-serif'));
        const J = r === 'vi' ? '★ NHÀ VÔ ĐỊCH THẾ GIỚI' : '★ WORLD CHAMPION';
        i.fillText(J, H + 24, W + 104);
      } else {
        ((i.fillStyle = h.accentColor || '#38bdf8'), (i.font = '800 19px sans-serif'));
        const J = r === 'vi' ? 'TAY ĐUA CHÍNH THỨC' : 'RACE DRIVER';
        i.fillText(J, H + 24, W + 104);
      }
      ((i.font = '700 22px -apple-system, BlinkMacSystemFont, sans-serif'),
        (i.fillStyle = '#F8FAFC'));
      const N = Be(G.role, r);
      (i.fillText(N, H + 24, W + 158),
        G.years &&
          ((i.font = '700 18px ui-monospace, SFMono-Regular, monospace'),
          (i.fillStyle = '#CBD5E1'),
          i.fillText(Fe(G.years, r), H + 24, W + 212)),
        (i.fillStyle = G.isChampion ? '#FCD34D' : h.accentColor || '#38bdf8'),
        i.fillRect(H + 24, W + 238, 54, 3));
    }),
      (i.textAlign = 'center'),
      (i.font = '700 18px ui-monospace, SFMono-Regular, monospace'),
      (i.fillStyle = 'rgba(255, 255, 255, 0.55)'));
    const w =
      r === 'vi'
        ? '// LƯU TRỮ CHÍNH THỨC ĐỘI ĐUA // DANH BẠ ĐƯỢC FIA CÔNG NHẬN // TIÊU CHUẨN 2026 //'
        : '// OFFICIAL CONSTRUCTOR ARCHIVE // FIA ACCREDITED ROSTER // 2026 SPECIFICATION //';
    (i.fillText(w, 2048 / 2, 948), i.restore());
  };
  s();
  const p = new o0(f);
  ((p.anisotropy = 16),
    (p.generateMipmaps = !0),
    (p.colorSpace = n0),
    (p.magFilter = f0),
    (p.minFilter = d0),
    (p.wrapS = Q),
    (p.wrapT = Q),
    p.repeat.set(1, 1),
    p.offset.set(0, 0),
    (p.needsUpdate = !0));
  const m = m0[l];
  if (m && i) {
    let g = m.trim();
    g.includes('width=') || (g = g.replace('<svg ', '<svg width="240" height="150" '));
    const t = new Blob([g], { type: 'image/svg+xml;charset=utf-8' }),
      u = window.URL || window.webkitURL,
      T = u.createObjectURL(t),
      b = new Image();
    ((b.onload = () => {
      ((n = b), s(), (p.needsUpdate = !0), u.revokeObjectURL(T));
    }),
      (b.onerror = () => {
        u.revokeObjectURL(T);
      }),
      (b.src = T));
  }
  return p;
}
function Ne(l, r = 'vi', a) {
  const f = document.createElement('canvas');
  ((f.width = 2048 / 2), (f.height = 1024 / 2));
  const i = f.getContext('2d');
  i == null || i.scale(0.5, 0.5);
  const h = _[l] || _.ferrari,
    n = (p0[l] || p0.ferrari).stats;
  let s = null;
  const p = () => {
    if (!i) return;
    const t = i.createLinearGradient(0, 0, 0, 1024);
    (t.addColorStop(0, '#191b22'),
      t.addColorStop(0.4, '#12141a'),
      t.addColorStop(0.8, '#0d0e13'),
      t.addColorStop(1, '#08090d'),
      (i.fillStyle = t),
      i.fillRect(0, 0, 2048, 1024),
      (i.fillStyle = 'rgba(255, 255, 255, 0.012)'));
    for (let H = 0; H < 1024; H += 4) i.fillRect(0, H, 2048, 1);
    const u = i.createRadialGradient(2048 / 2, 140, 20, 2048 / 2, 140, 440),
      T = h.accentColor || h.primaryColor || '#ffffff';
    if (
      (u.addColorStop(0, `${T}24`),
      u.addColorStop(0.5, `${T}08`),
      u.addColorStop(1, 'transparent'),
      (i.fillStyle = u),
      i.fillRect(0, 0, 2048, 360),
      (i.strokeStyle = 'rgba(255, 255, 255, 0.14)'),
      (i.lineWidth = 2),
      i.strokeRect(36, 36, 1976, 952),
      (i.strokeStyle = 'rgba(255, 255, 255, 0.04)'),
      (i.lineWidth = 1),
      i.strokeRect(48, 48, 1952, 928),
      s)
    ) {
      i.save();
      const H = 180,
        W = 80,
        N = 2048 / 2 - H / 2,
        J = 52;
      ((i.shadowColor = h.accentColor || '#ffffff'),
        (i.shadowBlur = 18),
        i.drawImage(s, N, J, H, W),
        i.restore());
    }
    (i.save(),
      (i.textAlign = 'center'),
      (i.textBaseline = 'middle'),
      (i.font = '800 22px -apple-system, BlinkMacSystemFont, sans-serif'),
      (i.fillStyle = h.accentColor || '#38bdf8'),
      D(i, '6px'));
    const b =
      r === 'vi'
        ? 'GIẢI ĐUA XE CÔNG THỨC 1 THẾ GIỚI · BẢNG VÀNG KỶ LỤC LỊCH SỬ'
        : 'FORMULA 1 WORLD CHAMPIONSHIP · OFFICIAL RECORD BOOKS';
    (i.fillText(b, 2048 / 2, s ? 148 : 105),
      (i.font = '900 66px -apple-system, BlinkMacSystemFont, sans-serif'),
      (i.fillStyle = '#FFFFFF'),
      (i.shadowColor = 'rgba(0, 0, 0, 0.9)'),
      (i.shadowBlur = 16),
      D(i, '8px'));
    const y =
      r === 'vi' ? 'BẢNG VÀNG THÀNH TÍCH TOÀN THỜI GIAN' : 'ALL-TIME CONSTRUCTOR ACHIEVEMENTS';
    (i.fillText(y, 2048 / 2, s ? 210 : 175),
      (i.font = '700 26px -apple-system, BlinkMacSystemFont, sans-serif'),
      (i.fillStyle = '#E2E8F0'),
      (i.shadowBlur = 0),
      D(i, '4px'));
    const c =
      r === 'vi'
        ? `${h.fullName.toUpperCase()} · BẢNG VÀNG THÀNH TÍCH & DI SẢN`
        : `${h.fullName.toUpperCase()} · HISTORIC RACING LEGACY`;
    (i.fillText(c, 2048 / 2, s ? 262 : 235),
      D(i, '0px'),
      (i.fillStyle = h.primaryColor || '#dc0000'),
      i.fillRect(2048 / 2 - 140, s ? 288 : 265, 280, 4));
    const C =
        r === 'vi'
          ? [
              {
                icon: '🏆',
                title: 'VÔ ĐỊCH ĐỘI ĐUA',
                sub: 'Constructors World Titles',
                val: String(n.constructorTitles),
                highlight: n.constructorTitles > 0,
              },
              {
                icon: '👑',
                title: 'VÔ ĐỊCH TAY ĐUA',
                sub: 'Drivers World Titles',
                val: String(n.driverTitles),
                highlight: n.driverTitles > 0,
              },
              {
                icon: '🥇',
                title: 'CHIẾN THẮNG CHẶNG',
                sub: 'Grand Prix Victories',
                val: String(n.raceWins),
                highlight: n.raceWins > 0,
              },
              {
                icon: '⏱️',
                title: 'XUẤT PHÁT ĐẦU (POLE)',
                sub: 'P1 Qualifying Starts',
                val: String(n.polePositions),
                highlight: n.polePositions > 0,
              },
              {
                icon: '🍾',
                title: 'BỤC NHẬN GIẢI TOP 3',
                sub: 'Podium Finishes',
                val: String(n.podiums),
                highlight: n.podiums > 0,
              },
              {
                icon: '⚡',
                title: 'VÒNG ĐUA NHANH NHẤT',
                sub: 'Fastest Race Laps',
                val: String(n.fastestLaps),
                highlight: n.fastestLaps > 0,
              },
            ]
          : [
              {
                icon: '🏆',
                title: 'CONSTRUCTORS TITLES',
                sub: 'World Championship Titles',
                val: String(n.constructorTitles),
                highlight: n.constructorTitles > 0,
              },
              {
                icon: '👑',
                title: 'DRIVERS TITLES',
                sub: 'World Championship Titles',
                val: String(n.driverTitles),
                highlight: n.driverTitles > 0,
              },
              {
                icon: '🥇',
                title: 'GRAND PRIX WINS',
                sub: 'Formula 1 Race Victories',
                val: String(n.raceWins),
                highlight: n.raceWins > 0,
              },
              {
                icon: '⏱️',
                title: 'POLE POSITIONS',
                sub: 'P1 Qualifying Starts',
                val: String(n.polePositions),
                highlight: n.polePositions > 0,
              },
              {
                icon: '🍾',
                title: 'PODIUM FINISHES',
                sub: 'Top 3 Podium Finishes',
                val: String(n.podiums),
                highlight: n.podiums > 0,
              },
              {
                icon: '⚡',
                title: 'FASTEST LAPS',
                sub: 'Fastest Race Laps Recorded',
                val: String(n.fastestLaps),
                highlight: n.fastestLaps > 0,
              },
            ],
      k = 3,
      R = 580,
      M = 210,
      I = 40,
      P = 26,
      F = (2048 - (k * R + (k - 1) * I)) / 2,
      w = s ? 320 : 305;
    C.forEach((H, W) => {
      const N = W % k,
        J = Math.floor(W / k),
        x = F + N * (R + I),
        e0 = w + J * (M + P);
      ((i.fillStyle = H.highlight ? 'rgba(212, 175, 55, 0.1)' : '#141724'),
        i.fillRect(x, e0, R, M),
        (i.strokeStyle = H.highlight ? 'rgba(212, 175, 55, 0.5)' : 'rgba(255, 255, 255, 0.14)'),
        (i.lineWidth = H.highlight ? 2 : 1.2),
        i.strokeRect(x, e0, R, M));
      const b0 = x + R - 54,
        c0 = e0 + 54;
      (i.beginPath(),
        i.arc(b0, c0, 28, 0, Math.PI * 2),
        (i.fillStyle = H.highlight ? 'rgba(212, 175, 55, 0.18)' : 'rgba(255, 255, 255, 0.06)'),
        i.fill(),
        (i.strokeStyle = H.highlight ? 'rgba(212, 175, 55, 0.45)' : 'rgba(255, 255, 255, 0.14)'),
        (i.lineWidth = 1.4),
        i.stroke(),
        (i.textAlign = 'center'),
        (i.textBaseline = 'middle'),
        (i.font = '28px sans-serif'),
        i.fillText(H.icon, b0, c0 + 1),
        (i.textAlign = 'left'),
        (i.textBaseline = 'alphabetic'),
        (i.font = '900 82px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'),
        (i.fillStyle = H.highlight ? '#FCD34D' : '#FFFFFF'),
        i.fillText(H.val, x + 32, e0 + 84),
        (i.font = '800 25px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'),
        (i.fillStyle = '#FFFFFF'),
        i.fillText(H.title, x + 32, e0 + 130),
        (i.font = '700 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'),
        (i.fillStyle = '#CBD5E1'),
        i.fillText(H.sub, x + 32, e0 + 162),
        (i.fillStyle = H.highlight ? '#FCD34D' : h.accentColor || '#38bdf8'),
        i.fillRect(x + 32, e0 + 184, 56, 3));
    });
    const G = s ? 800 : 785,
      B = k * R + (k - 1) * I;
    ((i.fillStyle = 'rgba(255, 255, 255, 0.04)'),
      i.fillRect(F, G, B, 145),
      (i.strokeStyle = 'rgba(255, 255, 255, 0.14)'),
      (i.lineWidth = 1.5),
      i.strokeRect(F, G, B, 145),
      (i.textAlign = 'left'),
      (i.font = '800 22px -apple-system, BlinkMacSystemFont, sans-serif'),
      (i.fillStyle = h.accentColor || '#38bdf8'));
    const A =
      r === 'vi'
        ? `NĂM RA MẮT F1: ${n.debutYear} · DI SẢN VĂN HÓA ĐUA XE`
        : `F1 DEBUT: ${n.debutYear} · RACING HERITAGE & CULTURE`;
    (i.fillText(A, F + 32, G + 45),
      (i.font = '600 21px -apple-system, BlinkMacSystemFont, sans-serif'),
      (i.fillStyle = '#F8FAFC'));
    const E = r === 'vi' ? n.heritageNoteVi : n.heritageNoteEn;
    (Ee(i, E, F + 32, G + 86, B - 64, 30), i.restore());
  };
  p();
  const m = new o0(f);
  ((m.anisotropy = 16),
    (m.generateMipmaps = !0),
    (m.colorSpace = n0),
    (m.magFilter = f0),
    (m.minFilter = d0),
    (m.wrapS = Q),
    (m.wrapT = Q),
    m.repeat.set(1, 1),
    m.offset.set(0, 0),
    (m.needsUpdate = !0));
  const g = m0[l];
  if (g && i) {
    let t = g.trim();
    t.includes('width=') || (t = t.replace('<svg ', '<svg width="240" height="150" '));
    const u = new Blob([t], { type: 'image/svg+xml;charset=utf-8' }),
      T = window.URL || window.webkitURL,
      b = T.createObjectURL(u),
      y = new Image();
    ((y.onload = () => {
      ((s = y), p(), (m.needsUpdate = !0), T.revokeObjectURL(b));
    }),
      (y.onerror = () => {
        T.revokeObjectURL(b);
      }),
      (y.src = b));
  }
  return m;
}
const je = ['north', 'south', 'west', 'east'],
  Oe = w0.memo(() =>
    d.jsxs('mesh', {
      rotation: [-Math.PI / 2, 0, 0],
      position: [0, -0.002, 0],
      children: [
        d.jsx('planeGeometry', { args: [24, 24] }),
        d.jsx(q0, {
          blur: [300, 100],
          resolution: 512,
          mirror: 0.55,
          mixBlur: 0.6,
          mixStrength: 2,
          roughness: 0.32,
          depthScale: 1.2,
          minDepthThreshold: 0.4,
          maxDepthThreshold: 1.4,
          color: '#2a303b',
          metalness: 0.4,
        }),
      ],
    }),
  ),
  Ue = ({ teamId: l, lang: r = 'vi', readinessKey: a, onScenePartReady: e }) => {
    const o = s0((t) => t.invalidate),
      f = _[l] || _.ferrari,
      i = v.useCallback(
        (t) => {
          switch (t) {
            case 'north':
              return Le(l, r);
            case 'south':
              return We(l, r);
            case 'west':
              return De(l, r);
            case 'east':
              return Ne(l, r);
            default:
              throw new Error(`Unknown studio texture slot: ${t}`);
          }
        },
        [l, r],
      ),
      h = Ge('studio', `${l}:${r}:studio-v${oe}`, je, i),
      S = h == null ? void 0 : h.get('north'),
      n = h == null ? void 0 : h.get('south'),
      s = h == null ? void 0 : h.get('west'),
      p = h == null ? void 0 : h.get('east');
    v.useLayoutEffect(() => {
      h && (e(a, 'studio'), o());
    }, [h, p, o, S, e, a, n, s]);
    const m = '#232a35',
      g = '#2b323e';
    return h
      ? d.jsxs('group', {
          name: 'showroom-studio',
          position: [0, 0, 0],
          children: [
            d.jsx('ambientLight', { intensity: 1.7, color: '#ffffff' }),
            d.jsx('directionalLight', {
              position: [6, 9, -4.5],
              intensity: 3.2,
              color: '#ffffff',
              castShadow: !0,
              'shadow-mapSize-width': 1024,
              'shadow-mapSize-height': 1024,
              'shadow-bias': -1e-4,
            }),
            d.jsx('directionalLight', { position: [-7, 6, 3.5], intensity: 2.3, color: '#f8fafc' }),
            d.jsx('directionalLight', { position: [0, -2.5, 0], intensity: 0.9, color: '#dfe8f5' }),
            d.jsx('directionalLight', {
              position: [-4.5, 3.2, 5.5],
              intensity: 2.6,
              color: '#ffffff',
            }),
            d.jsx('directionalLight', {
              position: [4.5, 2.4, 5.8],
              intensity: 1.8,
              color: f.primaryColor,
            }),
            d.jsx('pointLight', {
              position: [0, 1.6, 4.6],
              intensity: 8,
              distance: 9,
              color: '#ffffff',
            }),
            d.jsx('pointLight', {
              position: [0, 0.25, 0],
              intensity: 3.2,
              distance: 5,
              color: f.primaryColor,
            }),
            d.jsxs('group', {
              position: [0, 0, 5.8],
              children: [
                d.jsxs('mesh', {
                  position: [0, 3.9, 0],
                  rotation: [0, Math.PI, 0],
                  receiveShadow: !0,
                  children: [
                    d.jsx('planeGeometry', { args: [16, 7.8] }),
                    d.jsx('meshStandardMaterial', { color: m, roughness: 0.9, metalness: 0.12 }),
                  ],
                }),
                [-5.5, -2.8, 2.8, 5.5].map((t) =>
                  d.jsxs(
                    'mesh',
                    {
                      position: [t, 3.9, -0.01],
                      rotation: [0, Math.PI, 0],
                      children: [
                        d.jsx('planeGeometry', { args: [0.03, 7.8] }),
                        d.jsx('meshBasicMaterial', { color: '#161820' }),
                      ],
                    },
                    `n-joint-${t}`,
                  ),
                ),
                d.jsxs('mesh', {
                  position: [0, 7.4, -0.02],
                  rotation: [0, Math.PI, 0],
                  children: [
                    d.jsx('planeGeometry', { args: [15, 0.08] }),
                    d.jsx('meshBasicMaterial', { color: '#ffffff', toneMapped: !1 }),
                  ],
                }),
                d.jsxs('group', {
                  position: [0, 2.6, -0.08],
                  children: [
                    d.jsxs('mesh', {
                      rotation: [0, Math.PI, 0],
                      children: [
                        d.jsx('boxGeometry', { args: [7.8, 3.9, 0.12] }),
                        d.jsx('meshStandardMaterial', {
                          color: g,
                          roughness: 0.3,
                          metalness: 0.88,
                        }),
                      ],
                    }),
                    d.jsxs('mesh', {
                      position: [0, 0, -0.065],
                      rotation: [0, Math.PI, 0],
                      children: [
                        d.jsx('planeGeometry', { args: [7.72, 3.82] }),
                        d.jsx('meshStandardMaterial', {
                          color: '#1a1c26',
                          roughness: 0.4,
                          metalness: 0.7,
                        }),
                      ],
                    }),
                    S &&
                      d.jsxs('mesh', {
                        position: [0, 0, -0.075],
                        rotation: [0, Math.PI, 0],
                        receiveShadow: !0,
                        children: [
                          d.jsx('planeGeometry', { args: [7.6, 3.7] }),
                          d.jsx('meshStandardMaterial', {
                            map: S,
                            roughness: 0.25,
                            metalness: 0.2,
                            emissive: '#ffffff',
                            emissiveMap: S,
                            emissiveIntensity: 0.38,
                          }),
                        ],
                      }),
                    d.jsx('pointLight', {
                      position: [0, 0, 0.35],
                      intensity: 2.2,
                      distance: 6,
                      color: f.primaryColor,
                    }),
                  ],
                }),
                d.jsx('spotLight', {
                  position: [0, 6.2, -1.8],
                  'target-position': [0, 2.6, -0.08],
                  angle: 0.75,
                  penumbra: 0.65,
                  intensity: 3.2,
                  color: '#ffffff',
                  'shadow-bias': -1e-4,
                }),
              ],
            }),
            d.jsxs('group', {
              position: [0, 0, -5.8],
              children: [
                d.jsxs('mesh', {
                  position: [0, 3.9, 0],
                  receiveShadow: !0,
                  children: [
                    d.jsx('planeGeometry', { args: [16, 7.8] }),
                    d.jsx('meshStandardMaterial', { color: m, roughness: 0.9, metalness: 0.12 }),
                  ],
                }),
                [-5.5, -2.8, 2.8, 5.5].map((t) =>
                  d.jsxs(
                    'mesh',
                    {
                      position: [t, 3.9, 0.01],
                      children: [
                        d.jsx('planeGeometry', { args: [0.03, 7.8] }),
                        d.jsx('meshBasicMaterial', { color: '#161820' }),
                      ],
                    },
                    `s-joint-${t}`,
                  ),
                ),
                d.jsxs('mesh', {
                  position: [0, 7.4, 0.02],
                  children: [
                    d.jsx('planeGeometry', { args: [15, 0.08] }),
                    d.jsx('meshBasicMaterial', { color: '#ffffff', toneMapped: !1 }),
                  ],
                }),
                d.jsxs('group', {
                  position: [0, 2.6, 0.08],
                  children: [
                    d.jsxs('mesh', {
                      children: [
                        d.jsx('boxGeometry', { args: [7.8, 3.9, 0.12] }),
                        d.jsx('meshStandardMaterial', {
                          color: g,
                          roughness: 0.3,
                          metalness: 0.88,
                        }),
                      ],
                    }),
                    n &&
                      d.jsxs('mesh', {
                        position: [0, 0, 0.075],
                        receiveShadow: !0,
                        children: [
                          d.jsx('planeGeometry', { args: [7.6, 3.7] }),
                          d.jsx('meshStandardMaterial', {
                            map: n,
                            roughness: 0.25,
                            metalness: 0.2,
                            emissive: '#ffffff',
                            emissiveMap: n,
                            emissiveIntensity: 0.36,
                          }),
                        ],
                      }),
                    d.jsx('pointLight', {
                      position: [0, 0, -0.35],
                      intensity: 2.2,
                      distance: 6,
                      color: f.primaryColor,
                    }),
                  ],
                }),
                d.jsx('spotLight', {
                  position: [0, 6.2, 1.8],
                  'target-position': [0, 2.6, 0.08],
                  angle: 0.75,
                  penumbra: 0.65,
                  intensity: 3,
                  color: '#ffffff',
                  'shadow-bias': -1e-4,
                }),
              ],
            }),
            d.jsxs('group', {
              position: [-7.2, 0, 0],
              rotation: [0, Math.PI / 2, 0],
              children: [
                d.jsxs('mesh', {
                  position: [0, 3.9, 0],
                  receiveShadow: !0,
                  children: [
                    d.jsx('planeGeometry', { args: [13, 7.8] }),
                    d.jsx('meshStandardMaterial', { color: m, roughness: 0.9, metalness: 0.12 }),
                  ],
                }),
                d.jsxs('mesh', {
                  position: [0, 7.4, 0.02],
                  children: [
                    d.jsx('planeGeometry', { args: [12, 0.08] }),
                    d.jsx('meshBasicMaterial', { color: '#ffffff', toneMapped: !1 }),
                  ],
                }),
                d.jsxs('group', {
                  position: [0, 2.6, 0.08],
                  children: [
                    d.jsxs('mesh', {
                      children: [
                        d.jsx('boxGeometry', { args: [8, 4, 0.12] }),
                        d.jsx('meshStandardMaterial', {
                          color: g,
                          roughness: 0.3,
                          metalness: 0.88,
                        }),
                      ],
                    }),
                    s &&
                      d.jsxs('mesh', {
                        position: [0, 0, 0.075],
                        receiveShadow: !0,
                        children: [
                          d.jsx('planeGeometry', { args: [7.8, 3.8] }),
                          d.jsx('meshStandardMaterial', {
                            map: s,
                            roughness: 0.25,
                            metalness: 0.2,
                            emissive: '#ffffff',
                            emissiveMap: s,
                            emissiveIntensity: 0.38,
                          }),
                        ],
                      }),
                    d.jsx('pointLight', {
                      position: [0, 0, -0.35],
                      intensity: 2.2,
                      distance: 6,
                      color: f.primaryColor,
                    }),
                  ],
                }),
                d.jsx('spotLight', {
                  position: [0, 6.2, 1.8],
                  'target-position': [0, 2.6, 0.08],
                  angle: 0.75,
                  penumbra: 0.65,
                  intensity: 3,
                  color: '#ffffff',
                  'shadow-bias': -1e-4,
                }),
              ],
            }),
            d.jsxs('group', {
              position: [7.2, 0, 0],
              rotation: [0, -Math.PI / 2, 0],
              children: [
                d.jsxs('mesh', {
                  position: [0, 3.9, 0],
                  receiveShadow: !0,
                  children: [
                    d.jsx('planeGeometry', { args: [13, 7.8] }),
                    d.jsx('meshStandardMaterial', { color: m, roughness: 0.9, metalness: 0.12 }),
                  ],
                }),
                d.jsxs('mesh', {
                  position: [0, 7.4, 0.02],
                  children: [
                    d.jsx('planeGeometry', { args: [12, 0.08] }),
                    d.jsx('meshBasicMaterial', { color: '#ffffff', toneMapped: !1 }),
                  ],
                }),
                d.jsxs('group', {
                  position: [0, 2.6, 0.08],
                  children: [
                    d.jsxs('mesh', {
                      children: [
                        d.jsx('boxGeometry', { args: [8, 4, 0.12] }),
                        d.jsx('meshStandardMaterial', {
                          color: g,
                          roughness: 0.3,
                          metalness: 0.88,
                        }),
                      ],
                    }),
                    p &&
                      d.jsxs('mesh', {
                        position: [0, 0, 0.075],
                        receiveShadow: !0,
                        children: [
                          d.jsx('planeGeometry', { args: [7.8, 3.8] }),
                          d.jsx('meshStandardMaterial', {
                            map: p,
                            roughness: 0.25,
                            metalness: 0.2,
                            emissive: '#ffffff',
                            emissiveMap: p,
                            emissiveIntensity: 0.38,
                          }),
                        ],
                      }),
                    d.jsx('pointLight', {
                      position: [0, 0, -0.35],
                      intensity: 2.2,
                      distance: 6,
                      color: f.primaryColor,
                    }),
                  ],
                }),
                d.jsx('spotLight', {
                  position: [0, 6.2, 1.8],
                  'target-position': [0, 2.6, 0.08],
                  angle: 0.75,
                  penumbra: 0.65,
                  intensity: 3,
                  color: '#ffffff',
                  'shadow-bias': -1e-4,
                }),
              ],
            }),
            d.jsxs('group', {
              position: [-6.2, 0, 5],
              rotation: [0, Math.PI / 4, 0],
              children: [
                d.jsxs('mesh', {
                  position: [0, 3.9, 0],
                  receiveShadow: !0,
                  children: [
                    d.jsx('planeGeometry', { args: [3.2, 7.8] }),
                    d.jsx('meshStandardMaterial', {
                      color: '#0e1017',
                      roughness: 0.88,
                      metalness: 0.15,
                    }),
                  ],
                }),
                d.jsxs('mesh', {
                  position: [0, 3.9, 0.02],
                  children: [
                    d.jsx('planeGeometry', { args: [0.08, 7.5] }),
                    d.jsx('meshBasicMaterial', { color: '#ffffff', toneMapped: !1 }),
                  ],
                }),
                d.jsx('pointLight', {
                  position: [0, 3.5, 0.35],
                  intensity: 1.2,
                  distance: 4.5,
                  color: '#ffffff',
                }),
              ],
            }),
            d.jsxs('group', {
              position: [6.2, 0, 5],
              rotation: [0, -Math.PI / 4, 0],
              children: [
                d.jsxs('mesh', {
                  position: [0, 3.9, 0],
                  receiveShadow: !0,
                  children: [
                    d.jsx('planeGeometry', { args: [3.2, 7.8] }),
                    d.jsx('meshStandardMaterial', {
                      color: '#0e1017',
                      roughness: 0.88,
                      metalness: 0.15,
                    }),
                  ],
                }),
                d.jsxs('mesh', {
                  position: [0, 3.9, 0.02],
                  children: [
                    d.jsx('planeGeometry', { args: [0.08, 7.5] }),
                    d.jsx('meshBasicMaterial', { color: '#ffffff', toneMapped: !1 }),
                  ],
                }),
                d.jsx('pointLight', {
                  position: [0, 3.5, 0.35],
                  intensity: 1.2,
                  distance: 4.5,
                  color: '#ffffff',
                }),
              ],
            }),
            d.jsxs('group', {
              position: [-6.2, 0, -5],
              rotation: [0, (3 * Math.PI) / 4, 0],
              children: [
                d.jsxs('mesh', {
                  position: [0, 3.9, 0],
                  receiveShadow: !0,
                  children: [
                    d.jsx('planeGeometry', { args: [3.2, 7.8] }),
                    d.jsx('meshStandardMaterial', {
                      color: '#0e1017',
                      roughness: 0.88,
                      metalness: 0.15,
                    }),
                  ],
                }),
                d.jsxs('mesh', {
                  position: [0, 3.9, 0.02],
                  children: [
                    d.jsx('planeGeometry', { args: [0.08, 7.5] }),
                    d.jsx('meshBasicMaterial', { color: '#ffffff', toneMapped: !1 }),
                  ],
                }),
                d.jsx('pointLight', {
                  position: [0, 3.5, 0.35],
                  intensity: 1.2,
                  distance: 4.5,
                  color: '#ffffff',
                }),
              ],
            }),
            d.jsxs('group', {
              position: [6.2, 0, -5],
              rotation: [0, -(3 * Math.PI) / 4, 0],
              children: [
                d.jsxs('mesh', {
                  position: [0, 3.9, 0],
                  receiveShadow: !0,
                  children: [
                    d.jsx('planeGeometry', { args: [3.2, 7.8] }),
                    d.jsx('meshStandardMaterial', {
                      color: '#0e1017',
                      roughness: 0.88,
                      metalness: 0.15,
                    }),
                  ],
                }),
                d.jsxs('mesh', {
                  position: [0, 3.9, 0.02],
                  children: [
                    d.jsx('planeGeometry', { args: [0.08, 7.5] }),
                    d.jsx('meshBasicMaterial', { color: '#ffffff', toneMapped: !1 }),
                  ],
                }),
                d.jsx('pointLight', {
                  position: [0, 3.5, 0.35],
                  intensity: 1.2,
                  distance: 4.5,
                  color: '#ffffff',
                }),
              ],
            }),
            d.jsxs('group', {
              position: [0, 4.8, 0],
              children: [
                d.jsxs('mesh', {
                  rotation: [Math.PI / 2, 0, 0],
                  children: [
                    d.jsx('planeGeometry', { args: [4.4, 9.5] }),
                    d.jsx('meshStandardMaterial', {
                      color: '#12131a',
                      roughness: 0.35,
                      metalness: 0.8,
                    }),
                  ],
                }),
                d.jsxs('mesh', {
                  rotation: [Math.PI / 2, 0, 0],
                  position: [0, -0.01, 0],
                  children: [
                    d.jsx('planeGeometry', { args: [4, 8.8] }),
                    d.jsx('meshBasicMaterial', { color: '#ffffff', toneMapped: !1 }),
                  ],
                }),
                d.jsxs('mesh', {
                  rotation: [Math.PI / 2, 0, 0],
                  position: [0, -0.02, 0],
                  children: [
                    d.jsx('planeGeometry', { args: [0.12, 8.6] }),
                    d.jsx('meshBasicMaterial', { color: '#ffffff', toneMapped: !1 }),
                  ],
                }),
                d.jsxs('mesh', {
                  rotation: [Math.PI / 2, 0, 0],
                  position: [-1.3, -0.02, 0],
                  children: [
                    d.jsx('planeGeometry', { args: [0.08, 8.6] }),
                    d.jsx('meshBasicMaterial', { color: '#ffffff', toneMapped: !1 }),
                  ],
                }),
                d.jsxs('mesh', {
                  rotation: [Math.PI / 2, 0, 0],
                  position: [1.3, -0.02, 0],
                  children: [
                    d.jsx('planeGeometry', { args: [0.08, 8.6] }),
                    d.jsx('meshBasicMaterial', { color: '#ffffff', toneMapped: !1 }),
                  ],
                }),
                d.jsx('spotLight', {
                  position: [0, 0, 0],
                  angle: 0.85,
                  penumbra: 0.75,
                  intensity: 2.4,
                  color: '#ffffff',
                  'shadow-bias': -1e-4,
                }),
              ],
            }),
            d.jsx(Oe, {}),
            d.jsxs('group', {
              position: [0, 0.002, 0],
              children: [
                d.jsxs('mesh', {
                  rotation: [-Math.PI / 2, 0, 0],
                  position: [-1.8, 0, 0],
                  children: [
                    d.jsx('planeGeometry', { args: [0.02, 7.6] }),
                    d.jsx('meshBasicMaterial', {
                      color: '#ffffff',
                      transparent: !0,
                      opacity: 0.55,
                    }),
                  ],
                }),
                d.jsxs('mesh', {
                  rotation: [-Math.PI / 2, 0, 0],
                  position: [1.8, 0, 0],
                  children: [
                    d.jsx('planeGeometry', { args: [0.02, 7.6] }),
                    d.jsx('meshBasicMaterial', {
                      color: '#ffffff',
                      transparent: !0,
                      opacity: 0.55,
                    }),
                  ],
                }),
                d.jsxs('mesh', {
                  rotation: [-Math.PI / 2, 0, 0],
                  position: [0, 0, -3.8],
                  children: [
                    d.jsx('planeGeometry', { args: [3.62, 0.02] }),
                    d.jsx('meshBasicMaterial', {
                      color: '#ffffff',
                      transparent: !0,
                      opacity: 0.55,
                    }),
                  ],
                }),
                d.jsxs('mesh', {
                  rotation: [-Math.PI / 2, 0, 0],
                  position: [0, 0, 3.8],
                  children: [
                    d.jsx('planeGeometry', { args: [3.62, 0.02] }),
                    d.jsx('meshBasicMaterial', {
                      color: '#ffffff',
                      transparent: !0,
                      opacity: 0.55,
                    }),
                  ],
                }),
                d.jsxs('mesh', {
                  rotation: [-Math.PI / 2, 0, 0],
                  position: [0, 0, 0],
                  children: [
                    d.jsx('planeGeometry', { args: [0.015, 6.2] }),
                    d.jsx('meshBasicMaterial', {
                      color: '#ffffff',
                      transparent: !0,
                      opacity: 0.15,
                    }),
                  ],
                }),
                d.jsxs('mesh', {
                  rotation: [-Math.PI / 2, 0, 0],
                  position: [0, 0, -1.82],
                  children: [
                    d.jsx('planeGeometry', { args: [2.4, 0.012] }),
                    d.jsx('meshBasicMaterial', { color: '#ffffff', transparent: !0, opacity: 0.2 }),
                  ],
                }),
                d.jsxs('mesh', {
                  rotation: [-Math.PI / 2, 0, 0],
                  position: [0, 0, 1.78],
                  children: [
                    d.jsx('planeGeometry', { args: [2.4, 0.012] }),
                    d.jsx('meshBasicMaterial', { color: '#ffffff', transparent: !0, opacity: 0.2 }),
                  ],
                }),
                d.jsxs('mesh', {
                  rotation: [-Math.PI / 2, 0, 0],
                  position: [0, 0, 0],
                  children: [
                    d.jsx('ringGeometry', { args: [3.2, 3.22, 64] }),
                    d.jsx('meshBasicMaterial', {
                      color: '#ffffff',
                      transparent: !0,
                      opacity: 0.08,
                    }),
                  ],
                }),
                d.jsxs('mesh', {
                  rotation: [-Math.PI / 2, 0, 0],
                  position: [0, 0, 0],
                  children: [
                    d.jsx('ringGeometry', { args: [4.4, 4.43, 64] }),
                    d.jsx('meshBasicMaterial', {
                      color: f.primaryColor,
                      transparent: !0,
                      opacity: 0.22,
                    }),
                  ],
                }),
              ],
            }),
          ],
        })
      : null;
  },
  P0 = Symbol('SAFE_COMPILE_INSTALLED');
function j0(l) {
  const r = l;
  r[P0] ||
    ((r[P0] = !0),
    !(typeof r.compileAsync != 'function' || typeof r.compile != 'function') &&
      (r.compileAsync = function (a, e, o = null) {
        const f = l.compile(a, e, o),
          i = r.properties,
          h = r.extensions;
        return new Promise((S) => {
          function n() {
            if (
              (f.forEach((s) => {
                const p = i == null ? void 0 : i.get(s),
                  m = p == null ? void 0 : p.currentProgram;
                (!m || (typeof m.isReady == 'function' && m.isReady())) && f.delete(s);
              }),
              f.size === 0)
            ) {
              S(a);
              return;
            }
            setTimeout(n, 10);
          }
          (h == null ? void 0 : h.get('KHR_parallel_shader_compile')) !== null
            ? n()
            : setTimeout(n, 10);
        });
      }));
}
const Ve = ({ sceneKey: l, active: r, carReady: a, studioReady: e, onFirstUsableFrame: o }) => {
    const { gl: f, scene: i, camera: h, invalidate: S } = s0(),
      n = v.useRef('waiting-resources'),
      s = v.useRef(l),
      p = v.useRef(!0),
      m = v.useRef(!1),
      g = v.useRef(!1);
    return (
      v.useEffect(
        () => (
          (p.current = !0),
          () => {
            p.current = !1;
          }
        ),
        [],
      ),
      v.useEffect(() => {
        ((s.current = l),
          (n.current = 'waiting-resources'),
          (m.current = !1),
          (g.current = !1),
          S());
      }, [S, l]),
      v.useEffect(() => {
        r && (a || e) && S();
      }, [r, a, S, e]),
      B0(() => {
        var t;
        if (r) {
          if (n.current === 'waiting-resources') {
            const u = i.getObjectByName('showroom-car'),
              T = i.getObjectByName('showroom-studio');
            if (
              (a && u && !m.current && ((m.current = !0), performance.mark('showroom:car-ready')),
              e && T && !g.current && ((g.current = !0), performance.mark('showroom:studio-ready')),
              !a || !e || !u || !T)
            )
              return;
            const b = s.current;
            ((n.current = 'compiling'),
              performance.mark('showroom:required-resources-ready'),
              performance.mark('showroom:compile:start'),
              j0(f));
            const y = (t = f.compileAsync) == null ? void 0 : t.bind(f);
            (y ? y(i, h) : Promise.resolve().then(() => f.compile(i, h)))
              .catch(() => {
                f.compile(i, h);
              })
              .then(() => {
                !p.current ||
                  s.current !== b ||
                  n.current !== 'compiling' ||
                  (performance.mark('showroom:compile:end'),
                  performance.measure('showroom:compile', {
                    start: 'showroom:compile:start',
                    end: 'showroom:compile:end',
                  }),
                  (n.current = 'waiting-frame'),
                  S());
              });
            return;
          }
          if (n.current === 'waiting-frame') {
            f.render(i, h);
            const u = s.current;
            ((n.current = 'complete'),
              requestAnimationFrame(() => {
                !p.current ||
                  s.current !== u ||
                  n.current !== 'complete' ||
                  (performance.mark('showroom:first-complete-submitted-frame'),
                  performance.mark('showroom:first-usable-frame'),
                  o(u));
              }));
            return;
          }
          n.current === 'complete' && f.render(i, h);
        }
      }, 1),
      null
    );
  },
  Ze = ({ onContextStateChange: l }) => {
    const { gl: r } = s0();
    return (
      v.useEffect(() => {
        const a = r.domElement,
          e = (f) => {
            (f.preventDefault(), l(!0));
          },
          o = () => l(!1);
        return (
          a.addEventListener('webglcontextlost', e),
          a.addEventListener('webglcontextrestored', o),
          () => {
            (a.removeEventListener('webglcontextlost', e),
              a.removeEventListener('webglcontextrestored', o));
          }
        );
      }, [r, l]),
      null
    );
  },
  Ye = ({ active: l, sceneRevision: r }) => {
    const { invalidate: a, size: e } = s0();
    return (
      v.useEffect(() => {
        l && a();
      }, [l, a, r, e.height, e.width]),
      null
    );
  },
  xe = ({
    selectedTeamId: l,
    lang: r,
    isCanvasActive: a,
    frameloopMode: e,
    sceneRevision: o,
    activeHotspot: f,
    handleSelectHotspot: i,
    showHotspots: h,
    startupSceneKey: S,
    handleScenePartReady: n,
    cameraPreset: s,
    presetTrigger: p,
    autoRotate: m,
    startupReady: g,
    reducedMotion: t,
    enableWheelZoom: u,
    zoomTrigger: T,
    zoomDirection: b,
    onContextStateChange: y,
    isCarReady: c,
    isStudioReady: C,
    setUsableSceneKey: k,
  }) =>
    d.jsxs(Q0, {
      shadows: !0,
      dpr: [1, 1.25],
      frameloop: e,
      camera: { position: [3.4, 1.25, -2.8], fov: 38 },
      gl: {
        antialias: !1,
        alpha: !0,
        powerPreference: 'high-performance',
        toneMappingExposure: 1.2,
      },
      className: 'w-full h-full cursor-grab active:cursor-grabbing',
      onCreated: ({ gl: R }) => {
        j0(R);
      },
      children: [
        d.jsx(Ze, { onContextStateChange: y }),
        d.jsx(Ve, { sceneKey: S, active: a, carReady: c, studioReady: C, onFirstUsableFrame: k }),
        d.jsx(Ye, { active: a, sceneRevision: o }),
        d.jsx(Ue, { teamId: l, lang: r, readinessKey: S, onScenePartReady: n }),
        d.jsx(v.Suspense, {
          fallback: null,
          children: d.jsx(ve, {
            teamId: l,
            activeHotspot: f,
            onSelectHotspot: i,
            lang: r,
            showHotspots: h,
            readinessKey: S,
            onScenePartReady: n,
          }),
        }),
        d.jsx(J0, {
          position: [0, 0, 0],
          opacity: 0.9,
          scale: 10,
          blur: 2,
          far: 4.5,
          frames: 1,
          resolution: 256,
          color: '#000000',
        }),
        d.jsx(Pe, {
          activeHotspot: f,
          cameraPreset: s,
          presetTrigger: p,
          autoRotate: m,
          startupReady: g,
          reducedMotion: t,
          enableWheelZoom: u,
          zoomTrigger: T,
          zoomDirection: b,
        }),
      ],
    });
export { xe as ShowroomScene };
