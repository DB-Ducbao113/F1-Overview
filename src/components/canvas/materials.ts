import * as THREE from 'three';

// Generate procedural 2D canvas carbon fiber weave texture
export function createCarbonFiberTexture(): THREE.CanvasTexture {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.fillStyle = '#121214';
    ctx.fillRect(0, 0, size, size);

    // Cross-weave pattern
    const step = 8;
    for (let x = 0; x < size; x += step) {
      for (let y = 0; y < size; y += step) {
        const isAlternate = ((x / step) + (y / step)) % 2 === 0;
        ctx.fillStyle = isAlternate ? '#1c1c20' : '#0d0d0f';
        ctx.fillRect(x, y, step, step);

        // Highlight threads
        ctx.fillStyle = isAlternate ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.3)';
        ctx.fillRect(x + 1, y + 1, step - 2, step - 2);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(16, 16);
  return texture;
}

// Generate tyre tread / rim markings
export function createTyreTexture(ringColor: string = '#e10600'): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Dark rubber base
    ctx.fillStyle = '#1a1a1c';
    ctx.fillRect(0, 0, size, size);

    // Tyre sidewall markings
    ctx.strokeStyle = '#28282c';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(128, 128, 100, 0, Math.PI * 2);
    ctx.stroke();

    // Pirelli compound color stripe
    ctx.strokeStyle = ringColor;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(128, 128, 88, 0, Math.PI * 2);
    ctx.stroke();

    // Wordmark text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.save();
    ctx.translate(128, 30);
    ctx.fillText('P ZERO', 0, 0);
    ctx.restore();

    ctx.save();
    ctx.translate(128, 226);
    ctx.rotate(Math.PI);
    ctx.fillText('F1 18"', 0, 0);
    ctx.restore();
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}
