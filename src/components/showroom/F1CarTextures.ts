import * as THREE from 'three';
import { TeamId } from '../../types';
import { Team3DLivery } from '../../data/showroom/teamLiveries';
import { TeamSponsorConfig } from '../../data/showroom/teamSponsors';

/**
 * Creates ultra-crisp THREE.CanvasTexture for GLTF UV surfaces with mipmaps, anisotropy,
 * and ESSENTIAL THREE.SRGBColorSpace for authentic, saturated 1:1 color reproduction.
 */
export function createUVTexture(
  width: number,
  height: number,
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void,
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    draw(ctx, width, height);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 16;
  texture.generateMipmaps = true;
  texture.flipY = false; // Essential for GLTF UV orientation
  texture.colorSpace = THREE.SRGBColorSpace; // CRITICAL: Ensures vibrant, accurate F1 paint colors without gamma wash
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.needsUpdate = true;
  return texture;
}

// ─────────────────────────────────────────────────────────────
// Vector Drawing Helpers for Team Emblems & Sponsor Wordmarks
// ─────────────────────────────────────────────────────────────

/** Procedural Microscopic Carbon Fiber Twill Weave Pattern */
export function drawCarbonWeave(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  baseColor = '#101216',
) {
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, w, h);

  const patternCanvas = document.createElement('canvas');
  patternCanvas.width = 8;
  patternCanvas.height = 8;
  const pctx = patternCanvas.getContext('2d');
  if (pctx) {
    pctx.fillStyle = '#17191e';
    pctx.fillRect(0, 0, 4, 4);
    pctx.fillRect(4, 4, 4, 4);
    pctx.fillStyle = '#0a0b0d';
    pctx.fillRect(4, 0, 4, 4);
    pctx.fillRect(0, 4, 4, 4);
    const pattern = ctx.createPattern(patternCanvas, 'repeat');
    if (pattern) {
      ctx.fillStyle = pattern;
      ctx.fillRect(0, 0, w, h);
    }
  }
}

/** HP Blue Circular Logo (Scuderia Ferrari HP Title Sponsor) */
export function drawHpLogo(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.save();
  ctx.translate(x, y);

  // Official HP Blue circle
  ctx.fillStyle = '#0096d6';
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.5, 0, Math.PI * 2);
  ctx.fill();

  // White lowercase italic "hp" with clean extended vertical stems
  ctx.font = `italic 900 ${Math.round(size * 0.62)}px "Arial Black", "Helvetica", sans-serif`;
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('hp', 0, -size * 0.02);

  ctx.restore();
}

/** Mercedes-Benz 3-Pointed Star Emblem with Chrome Bevels (or Red Niki Lauda tribute) */
export function drawMercedesStar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  customColor?: string,
) {
  ctx.save();
  ctx.translate(x, y);

  const ringColor = customColor || '#e2e8f0';
  ctx.strokeStyle = ringColor;
  ctx.lineWidth = Math.max(3, radius * 0.1);
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.stroke();

  const innerR = radius * 0.16;
  const outerR = radius * 0.95;

  for (let i = 0; i < 3; i++) {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 3;
    const leftAngle = angle - (2 * Math.PI) / 6;
    const rightAngle = angle + (2 * Math.PI) / 6;

    const tipX = Math.cos(angle) * outerR;
    const tipY = Math.sin(angle) * outerR;

    ctx.fillStyle = customColor || '#f8fafc';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(tipX, tipY);
    ctx.lineTo(Math.cos(leftAngle) * innerR, Math.sin(leftAngle) * innerR);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = customColor ? '#990000' : '#64748b';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(tipX, tipY);
    ctx.lineTo(Math.cos(rightAngle) * innerR, Math.sin(rightAngle) * innerR);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}

/** Subtle repeating Mercedes-Benz Starfield on Engine Cover (W15 Livery with Red Niki Lauda Star) */
export function drawMercedesStarfield(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  ctx.save();
  const rows = 6;
  const cols = 11;
  const stepX = w / (cols + 1);
  const stepY = h / (rows + 1);

  for (let r = 0; r < rows; r++) {
    // Opacity fades gracefully towards the bottom
    const rowAlpha = Math.max(0.08, 0.34 - r * 0.045);
    for (let c = 0; c < cols; c++) {
      const offsetX = r % 2 === 0 ? 0 : stepX * 0.5;
      const starX = x + (c + 1) * stepX + offsetX - stepX * 0.5;
      const starY = y + (r + 1) * stepY;

      // Authentic Tribute: Single iconic Red Star for Niki Lauda near the upper cockpit/cowl
      if (r === 0 && c === 4) {
        ctx.globalAlpha = 0.95;
        drawMercedesStar(ctx, starX, starY, 16, '#e10600');
      } else {
        ctx.globalAlpha = rowAlpha;
        drawMercedesStar(ctx, starX, starY, 13);
      }
    }
  }
  ctx.restore();
}

/** Official WhatsApp Neon Green Roundel Logo */
export function drawWhatsAppLogo(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
) {
  ctx.save();
  ctx.translate(x, y);

  // Vibrant WhatsApp Green circular base
  ctx.fillStyle = '#25d366';
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.5, 0, Math.PI * 2);
  ctx.fill();

  // White telephone receiver handset silhouette
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  const s = size * 0.45;
  ctx.arc(0, 0, s * 0.45, -0.4, 2.0);
  ctx.lineWidth = Math.max(3.5, size * 0.14);
  ctx.strokeStyle = '#ffffff';
  ctx.stroke();

  // Handset ear & mouthpiece rounded caps
  ctx.beginPath();
  ctx.arc(-s * 0.3, -s * 0.12, s * 0.13, 0, Math.PI * 2);
  ctx.arc(s * 0.18, s * 0.3, s * 0.13, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/** Ferrari Prancing Horse & Modena Yellow Shield */
export function drawFerrariShield(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
) {
  ctx.save();
  ctx.translate(x, y);
  const w = size;
  const h = size * 1.25;

  // Modena Canary Yellow Shield
  ctx.fillStyle = '#ffdf00';
  ctx.beginPath();
  ctx.moveTo(-w / 2, -h / 2);
  ctx.lineTo(w / 2, -h / 2);
  ctx.lineTo(w / 2, h * 0.15);
  ctx.bezierCurveTo(w / 2, h * 0.45, w * 0.2, h * 0.52, 0, h / 2);
  ctx.bezierCurveTo(-w * 0.2, h * 0.52, -w / 2, h * 0.45, -w / 2, h * 0.15);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#000000';
  ctx.lineWidth = Math.max(2, size * 0.04);
  ctx.stroke();

  // Italian Flag Tri-Color Header (Green, White, Red)
  const flagH = h * 0.14;
  const thirdW = w / 3;
  ctx.fillStyle = '#009246';
  ctx.fillRect(-w / 2, -h / 2, thirdW, flagH);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-w / 2 + thirdW, -h / 2, thirdW, flagH);
  ctx.fillStyle = '#ce2b37';
  ctx.fillRect(-w / 2 + thirdW * 2, -h / 2, thirdW, flagH);

  // Black Stallion Silhouette
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(w * 0.08, -h * 0.18, size * 0.08, 0, Math.PI * 2);
  ctx.fill();

  // S F letters
  ctx.font = `bold ${Math.round(size * 0.18)}px "Arial Black", sans-serif`;
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center';
  ctx.fillText('S F', 0, h * 0.42);

  ctx.restore();
}

/** Shell Pecten Scallop Shell Logo */
export function drawShellLogo(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.save();
  ctx.translate(x, y);
  const r = size * 0.48;

  // Red outer shell contour
  ctx.fillStyle = '#dd1d21';
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();

  // Bright yellow core
  ctx.fillStyle = '#ffdf00';
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.82, 0, Math.PI * 2);
  ctx.fill();

  // Internal red scallop ribs
  ctx.strokeStyle = '#dd1d21';
  ctx.lineWidth = Math.max(2.5, size * 0.05);
  for (let a = -0.8; a <= 0.8; a += 0.4) {
    ctx.beginPath();
    ctx.moveTo(0, r * 0.48);
    ctx.lineTo(Math.sin(a) * r * 0.74, -Math.cos(a) * r * 0.74);
    ctx.stroke();
  }

  ctx.restore();
}

/** Red Bull Charging Bulls (Sunburst Yellow Sun + Muscular Leaping Red Bull) */
export function drawRedBullChargingBulls(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
) {
  ctx.save();
  ctx.translate(x, y);

  // Sunburst Yellow Sun
  const sunR = width * 0.24;
  ctx.fillStyle = '#ffce00';
  ctx.beginPath();
  ctx.arc(0, 0, sunR, 0, Math.PI * 2);
  ctx.fill();

  // Muscular Red Bull
  ctx.fillStyle = '#ed1a3b';
  ctx.font = `900 ${Math.round(width * 0.22)}px "Impact", "Arial Black", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('RED BULL', 0, 0);

  // White horn tip accent
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-width * 0.22, -sunR * 0.4, 4, 0, Math.PI * 2);
  ctx.arc(width * 0.22, -sunR * 0.4, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/** INEOS Wordmark */
export function drawIneosLogo(ctx: CanvasRenderingContext2D, x: number, y: number, width: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.font = `900 ${Math.round(width * 0.28)}px "Arial Black", "Impact", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('I N E O S', 0, 0);
  ctx.restore();
}

/** McLaren Speedmark dynamic boomerang */
export function drawMcLarenSpeedmark(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = '#ff8000';
  ctx.beginPath();
  ctx.moveTo(-size * 0.5, size * 0.2);
  ctx.bezierCurveTo(-size * 0.2, -size * 0.4, size * 0.4, -size * 0.4, size * 0.5, -size * 0.1);
  ctx.bezierCurveTo(size * 0.2, -size * 0.2, -size * 0.1, 0, -size * 0.5, size * 0.2);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/** Google Chrome 4-color wheel rim / sponsor decal (Red, Yellow, Green, Blue) */
export function drawGoogleChromeLogo(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
) {
  ctx.save();
  ctx.translate(x, y);

  const colors = ['#ea4335', '#fbbc05', '#34a853']; // Red, Yellow, Green
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = colors[i];
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, (i * 2 * Math.PI) / 3, ((i + 1) * 2 * Math.PI) / 3);
    ctx.closePath();
    ctx.fill();
  }

  // White separator ring
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.55, 0, Math.PI * 2);
  ctx.fill();

  // Google Blue center
  ctx.fillStyle = '#4285f4';
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.42, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/** Android Green Bug Droid head */
export function drawAndroidLogo(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = '#3ddc84'; // Official Android Green

  // Semi-circle dome
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.5, Math.PI, 0, false);
  ctx.closePath();
  ctx.fill();

  // White circular eyes
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-size * 0.2, -size * 0.2, size * 0.06, 0, Math.PI * 2);
  ctx.arc(size * 0.2, -size * 0.2, size * 0.06, 0, Math.PI * 2);
  ctx.fill();

  // Antennas
  ctx.strokeStyle = '#3ddc84';
  ctx.lineWidth = Math.max(3, size * 0.08);
  ctx.beginPath();
  ctx.moveTo(-size * 0.28, -size * 0.4);
  ctx.lineTo(-size * 0.4, -size * 0.65);
  ctx.moveTo(size * 0.28, -size * 0.4);
  ctx.lineTo(size * 0.4, -size * 0.65);
  ctx.stroke();

  ctx.restore();
}

/** Aston Martin Spread Wings Crest */
export function drawAstonMartinWings(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
) {
  ctx.save();
  ctx.translate(x, y);

  // Silver feathered wings
  ctx.fillStyle = '#e2e8f0';
  ctx.beginPath();
  ctx.moveTo(-width * 0.5, -width * 0.06);
  ctx.quadraticCurveTo(-width * 0.2, -width * 0.14, 0, -width * 0.06);
  ctx.quadraticCurveTo(width * 0.2, -width * 0.14, width * 0.5, -width * 0.06);
  ctx.quadraticCurveTo(width * 0.2, width * 0.12, 0, width * 0.14);
  ctx.quadraticCurveTo(-width * 0.2, width * 0.12, -width * 0.5, -width * 0.06);
  ctx.closePath();
  ctx.fill();

  // Center green enamel plaque
  ctx.fillStyle = '#00594f';
  ctx.fillRect(-width * 0.28, -width * 0.04, width * 0.56, width * 0.08);

  ctx.font = `bold ${Math.round(width * 0.045)}px "Arial", sans-serif`;
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('ASTON MARTIN', 0, 0);

  ctx.restore();
}

/** Alpine Stylized Italic 'A' Arrow */
export function drawAlpineLogo(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.font = `900 ${Math.round(size)}px "Arial Black", "Impact", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('A', 0, 0);

  // Blue diagonal arrow stripe
  ctx.strokeStyle = '#0078d0';
  ctx.lineWidth = Math.max(3, size * 0.12);
  ctx.beginPath();
  ctx.moveTo(-size * 0.45, size * 0.1);
  ctx.lineTo(size * 0.45, -size * 0.05);
  ctx.stroke();

  ctx.restore();
}

/** Williams Racing 'W' Emblem */
export function drawWilliamsLogo(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.font = `900 ${Math.round(size)}px "Impact", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#00a3e0'; // Cyan
  ctx.fillText('W', 0, 0);

  // Red & White racing speed slice
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-size * 0.35, size * 0.2, size * 0.7, size * 0.06);
  ctx.fillStyle = '#e10600';
  ctx.fillRect(-size * 0.15, size * 0.2, size * 0.3, size * 0.06);

  ctx.restore();
}

/** Qualcomm Snapdragon fire-dragon flame emblem + wordmark */
export function drawSnapdragonLogo(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
) {
  ctx.save();
  ctx.translate(x, y);

  // Red Snapdragon dragon flame ball
  const r = size * 0.45;
  ctx.fillStyle = '#e10600';
  ctx.beginPath();
  ctx.arc(-size * 0.55, 0, r, 0, Math.PI * 2);
  ctx.fill();

  // White inner flame curve
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = Math.max(2.5, size * 0.09);
  ctx.beginPath();
  ctx.arc(-size * 0.55, 0, r * 0.58, -Math.PI * 0.25, Math.PI * 0.75);
  ctx.stroke();

  // White center flame dot
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-size * 0.55, -r * 0.16, r * 0.2, 0, Math.PI * 2);
  ctx.fill();

  // Snapdragon wordmark
  ctx.font = `900 ${Math.round(size * 0.52)}px "Arial Black", sans-serif`;
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('Snapdragon', -size * 0.55 + r + size * 0.16, 0);

  ctx.restore();
}

/** Audi Four Interlocking Rings */
export function drawAudiFourRings(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
) {
  ctx.save();
  ctx.translate(x, y);
  const ringR = width * 0.16;
  const spacing = ringR * 1.5;
  const startX = -spacing * 1.5;

  ctx.strokeStyle = '#f1f5f9';
  ctx.lineWidth = Math.max(3.5, width * 0.038);

  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.arc(startX + i * spacing, 0, ringR, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

/** Haas stylized red 'H' logo in circle */
export function drawHaasLogo(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.save();
  ctx.translate(x, y);

  // Red outer circle
  ctx.fillStyle = '#e10600';
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.5, 0, Math.PI * 2);
  ctx.fill();

  // White stylized 'H'
  ctx.font = `900 ${Math.round(size * 0.65)}px "Arial Black", sans-serif`;
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('H', 0, 0);

  ctx.restore();
}

/** MoneyGram circular logo with dual rotating white swooshes */
export function drawMoneyGramLogo(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
) {
  ctx.save();
  ctx.translate(x, y);

  ctx.fillStyle = '#e10600';
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = Math.max(3, size * 0.1);
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.32, -0.6, 2.2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.32, 2.6, 5.4);
  ctx.stroke();

  ctx.restore();
}

/** Cadillac Gold Crest & Crown */
export function drawCadillacCrest(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
) {
  ctx.save();
  ctx.translate(x, y);

  // Metallic gold shield
  ctx.fillStyle = '#d4af37';
  ctx.beginPath();
  ctx.moveTo(-size * 0.5, -size * 0.3);
  ctx.lineTo(size * 0.5, -size * 0.3);
  ctx.lineTo(size * 0.45, size * 0.1);
  ctx.lineTo(0, size * 0.45);
  ctx.lineTo(-size * 0.45, size * 0.1);
  ctx.closePath();
  ctx.fill();

  // Colored heraldic bars
  ctx.fillStyle = '#101216';
  ctx.fillRect(-size * 0.35, -size * 0.18, size * 0.7, size * 0.08);

  ctx.fillStyle = '#d90429';
  ctx.fillRect(-size * 0.3, 0, size * 0.28, size * 0.06);

  ctx.fillStyle = '#0284c7';
  ctx.fillRect(size * 0.02, 0, size * 0.28, size * 0.06);

  ctx.restore();
}

// ─────────────────────────────────────────────────────────────
// Dynamic Texture Generators for F1 Car Mesh Primitives
// ─────────────────────────────────────────────────────────────

/**
 * 1. FORWARD MONOCOQUE & NOSE CONE (Default_OBJ.007 / Image_6.png)
 * UV mapped precisely to Primitive 6 in C42 GLTF.
 * Features:
 *  - Horizontal nose spine (X: 60..1300, Y: 1050..1520) with team gradient, driver number, and sponsors
 *  - Vertical nose tip strip (X: 1680..1980, Y: 1100..2048) with team nose roundel emblem and Pirelli badge
 */
export function generateNoseTexture(
  teamId: TeamId,
  livery: Team3DLivery,
  _sponsors: TeamSponsorConfig,
): THREE.CanvasTexture {
  return createUVTexture(2048, 2048, (ctx, w, h) => {
    // 1. Carbon fiber base weave
    drawCarbonWeave(ctx, w, h, livery.floorColor || '#0a0b0d');

    // Helper: Draw horizontal tapering nose cone spine
    const drawSpine = (fill: string | CanvasGradient) => {
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.moveTo(60, 1200);
      ctx.lineTo(1280, 1050);
      ctx.lineTo(1280, 1510);
      ctx.lineTo(60, 1360);
      ctx.closePath();
      ctx.fill();
    };

    if (teamId === 'mercedes') {
      // 1. Polished Silver Arrow Metallic Nose Gradient (Transitioning from bright silver tip into deep obsidian black near cockpit)
      const silverNoseGrad = ctx.createLinearGradient(60, 0, 1280, 0);
      silverNoseGrad.addColorStop(0, '#edf0f2'); // Pure polished silver tip
      silverNoseGrad.addColorStop(0.35, '#9aa2ab'); // Brushed aluminum transition
      silverNoseGrad.addColorStop(0.75, '#22262c'); // Metallic charcoal
      silverNoseGrad.addColorStop(1.0, '#0a0b0d'); // Deep obsidian black cockpit surround

      drawSpine(silverNoseGrad);

      // 2. Dual Emerald Turquoise Accent Pinstripes
      ctx.strokeStyle = '#00a19c';
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(80, 1260);
      ctx.lineTo(1280, 1260);
      ctx.stroke();

      ctx.strokeStyle = '#00f5d4'; // Bright glowing mint inner pinstripe
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(80, 1264);
      ctx.lineTo(1280, 1264);
      ctx.stroke();

      ctx.strokeStyle = '#00a19c';
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(80, 1300);
      ctx.lineTo(1280, 1300);
      ctx.stroke();

      ctx.strokeStyle = '#00f5d4';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(80, 1296);
      ctx.lineTo(1280, 1296);
      ctx.stroke();

      // 3. Technical Sponsor Badges along the Nose Cone
      drawMercedesStar(ctx, 100, 1280, 36);

      // George Russell #63 in Electric Teal with bold black stroke
      ctx.save();
      ctx.translate(260, 1280);
      ctx.rotate(-Math.PI / 2);
      ctx.font = '900 82px "Impact", "Arial Black", sans-serif';
      ctx.fillStyle = '#00f5d4';
      ctx.strokeStyle = '#0a0b0d';
      ctx.lineWidth = 8;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeText('63', 0, 0);
      ctx.fillText('63', 0, 0);
      ctx.restore();

      // INEOS Red Ribbon Chevron
      ctx.save();
      ctx.translate(480, 1280);
      ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = '#e10600';
      ctx.beginPath();
      ctx.roundRect(-24, -90, 48, 180, 10);
      ctx.fill();
      drawIneosLogo(ctx, 0, 0, 140);
      ctx.restore();

      // TeamViewer Wordmark
      ctx.save();
      ctx.translate(700, 1280);
      ctx.rotate(-Math.PI / 2);
      ctx.font = '800 28px "Arial", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('TeamViewer', 0, 0);
      ctx.restore();

      // Snapdragon Decal
      ctx.save();
      ctx.translate(880, 1280);
      ctx.rotate(-Math.PI / 2);
      drawSnapdragonLogo(ctx, 0, 0, 34);
      ctx.restore();

      // WhatsApp & CrowdStrike
      ctx.save();
      ctx.translate(1060, 1280);
      ctx.rotate(-Math.PI / 2);
      drawWhatsAppLogo(ctx, -55, 0, 28);
      ctx.font = '800 22px "Arial", sans-serif';
      ctx.fillStyle = '#25d366';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText('WhatsApp', -35, 0);
      ctx.restore();

      ctx.save();
      ctx.translate(1190, 1280);
      ctx.rotate(-Math.PI / 2);
      ctx.font = '900 22px "Arial Black", sans-serif';
      ctx.fillStyle = '#e10600';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('CROWDSTRIKE', 0, 0);
      ctx.restore();

      // Vertical Nose Tip Strip (X: 1680..1980, Y: 1100..2048)
      const tipGrad = ctx.createLinearGradient(0, 2048, 0, 1300);
      tipGrad.addColorStop(0, '#edf0f2');
      tipGrad.addColorStop(0.35, '#848d98');
      tipGrad.addColorStop(1.0, '#101216');
      ctx.fillStyle = tipGrad;
      ctx.fillRect(1740, 1100, 220, 948);

      drawMercedesStar(ctx, 1933, 1692, 52);

      // Pirelli P-Zero
      ctx.save();
      ctx.translate(1880, 1960);
      ctx.rotate(Math.PI);
      ctx.fillStyle = '#e10600';
      ctx.fillRect(-50, -14, 100, 28);
      ctx.strokeStyle = '#ffdf00';
      ctx.lineWidth = 2;
      ctx.strokeRect(-50, -14, 100, 28);
      ctx.font = 'italic 900 18px "Arial Black", sans-serif';
      ctx.fillStyle = '#ffdf00';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('PIRELLI', 0, 0);
      ctx.restore();

      ctx.font = '800 24px "Arial", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText('IWC', 1880, 1460);
    } else if (teamId === 'ferrari') {
      // Ferrari SF-24: Official Rosso Corsa spine with Modena yellow & white double stripes
      drawSpine('#e8002d');

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(60, 1265);
      ctx.lineTo(1280, 1265);
      ctx.stroke();

      ctx.strokeStyle = '#ffdf00';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(60, 1295);
      ctx.lineTo(1280, 1295);
      ctx.stroke();

      drawShellLogo(ctx, 80, 1280, 48);

      // Ferrari Modena yellow shield
      ctx.save();
      ctx.translate(220, 1280);
      ctx.rotate(-Math.PI / 2);
      drawFerrariShield(ctx, 0, 0, 75);
      ctx.restore();

      // HP Title Sponsor blue roundel
      ctx.save();
      ctx.translate(390, 1280);
      ctx.rotate(-Math.PI / 2);
      drawHpLogo(ctx, 0, 0, 68);
      ctx.restore();

      // Charles Leclerc #16
      ctx.save();
      ctx.translate(560, 1280);
      ctx.rotate(-Math.PI / 2);
      ctx.font = '900 76px "Impact", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#0a0b0d';
      ctx.lineWidth = 6;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeText('16', 0, 0);
      ctx.fillText('16', 0, 0);
      ctx.restore();

      // Santander
      ctx.save();
      ctx.translate(750, 1280);
      ctx.rotate(-Math.PI / 2);
      ctx.font = '900 38px "Arial Black", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Santander', 0, 0);
      ctx.restore();

      // Vertical tip strip
      ctx.fillStyle = '#e8002d';
      ctx.fillRect(1740, 1100, 220, 948);
      drawShellLogo(ctx, 1933, 1692, 60);
    } else if (teamId === 'redbull') {
      // Red Bull RB20: Matte Navy with Sunburst Yellow tip
      drawSpine('#030a1c');

      ctx.fillStyle = '#ffce00';
      ctx.beginPath();
      ctx.moveTo(60, 1200);
      ctx.lineTo(240, 1180);
      ctx.lineTo(240, 1380);
      ctx.lineTo(60, 1360);
      ctx.closePath();
      ctx.fill();

      // Red Bull charging bulls
      ctx.save();
      ctx.translate(380, 1280);
      ctx.rotate(-Math.PI / 2);
      drawRedBullChargingBulls(ctx, 0, 0, 130);
      ctx.restore();

      // Max Verstappen #1
      ctx.save();
      ctx.translate(560, 1280);
      ctx.rotate(-Math.PI / 2);
      ctx.font = '900 84px "Impact", sans-serif';
      ctx.fillStyle = '#ffce00';
      ctx.strokeStyle = '#ed1a3b';
      ctx.lineWidth = 6;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeText('1', 0, 0);
      ctx.fillText('1', 0, 0);
      ctx.restore();

      // ORACLE
      ctx.save();
      ctx.translate(760, 1280);
      ctx.rotate(-Math.PI / 2);
      ctx.font = '900 48px "Impact", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('ORACLE', 0, 0);
      ctx.restore();

      ctx.fillStyle = '#ffce00';
      ctx.fillRect(1740, 1100, 220, 948);
      drawRedBullChargingBulls(ctx, 1933, 1692, 110);
    } else if (teamId === 'mclaren') {
      // McLaren MCL38: Papaya Orange spine
      drawSpine('#ff8000');

      drawGoogleChromeLogo(ctx, 80, 1280, 28);

      // Lando Norris #4
      ctx.save();
      ctx.translate(220, 1280);
      ctx.rotate(-Math.PI / 2);
      ctx.font = '900 82px "Impact", sans-serif';
      ctx.fillStyle = '#d9f99d';
      ctx.strokeStyle = '#141619';
      ctx.lineWidth = 6;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeText('4', 0, 0);
      ctx.fillText('4', 0, 0);
      ctx.restore();

      // OKX
      ctx.save();
      ctx.translate(420, 1280);
      ctx.rotate(-Math.PI / 2);
      ctx.font = '900 64px "Impact", sans-serif';
      ctx.fillStyle = '#141619';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('O K X', 0, 0);
      ctx.restore();

      // Android logo
      ctx.save();
      ctx.translate(620, 1280);
      ctx.rotate(-Math.PI / 2);
      drawAndroidLogo(ctx, 0, 0, 60);
      ctx.restore();

      ctx.fillStyle = '#ff8000';
      ctx.fillRect(1740, 1100, 220, 948);
      drawMcLarenSpeedmark(ctx, 1933, 1692, 70);
    } else if (teamId === 'astonmartin') {
      // Aston Martin AMR24: British Racing Green
      drawSpine('#00594f');

      ctx.strokeStyle = '#cedc00';
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(60, 1280);
      ctx.lineTo(1280, 1280);
      ctx.stroke();

      drawAstonMartinWings(ctx, 120, 1280, 90);

      // Fernando Alonso #14
      ctx.save();
      ctx.translate(260, 1280);
      ctx.rotate(-Math.PI / 2);
      ctx.font = '900 78px "Impact", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#00594f';
      ctx.lineWidth = 6;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeText('14', 0, 0);
      ctx.fillText('14', 0, 0);
      ctx.restore();

      // aramco
      ctx.save();
      ctx.translate(460, 1280);
      ctx.rotate(-Math.PI / 2);
      ctx.font = '900 44px "Arial Black", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('aramco', 0, 0);
      ctx.restore();

      ctx.fillStyle = '#00594f';
      ctx.fillRect(1740, 1100, 220, 948);
      drawAstonMartinWings(ctx, 1933, 1692, 110);
    } else if (teamId === 'alpine') {
      // Alpine A524: Alpine Metallic Blue with BWT Flamingo Pink speedlines
      drawSpine('#0078d0');

      ctx.strokeStyle = '#fd4bc7';
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(60, 1270);
      ctx.lineTo(1280, 1270);
      ctx.moveTo(60, 1290);
      ctx.lineTo(1280, 1290);
      ctx.stroke();

      drawAlpineLogo(ctx, 120, 1280, 68);

      // Pierre Gasly #10
      ctx.save();
      ctx.translate(260, 1280);
      ctx.rotate(-Math.PI / 2);
      ctx.font = '900 78px "Impact", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#0078d0';
      ctx.lineWidth = 6;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeText('10', 0, 0);
      ctx.fillText('10', 0, 0);
      ctx.restore();

      // BWT
      ctx.save();
      ctx.translate(460, 1280);
      ctx.rotate(-Math.PI / 2);
      ctx.font = '900 56px "Impact", sans-serif';
      ctx.fillStyle = '#fd4bc7';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('B W T', 0, 0);
      ctx.restore();

      ctx.fillStyle = '#0078d0';
      ctx.fillRect(1740, 1100, 220, 948);
      drawAlpineLogo(ctx, 1933, 1692, 90);
    } else if (teamId === 'racingbulls') {
      // Visa Cash App RB: Royal Electric Metallic Blue with crisp white speed flashes
      drawSpine('#1434cb');

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(60, 1272, 1220, 16);

      // Liam Lawson #30
      ctx.save();
      ctx.translate(240, 1280);
      ctx.rotate(-Math.PI / 2);
      ctx.font = '900 78px "Impact", sans-serif';
      ctx.fillStyle = '#00d632';
      ctx.strokeStyle = '#1434cb';
      ctx.lineWidth = 6;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeText('30', 0, 0);
      ctx.fillText('30', 0, 0);
      ctx.restore();

      // VISA
      ctx.save();
      ctx.translate(450, 1280);
      ctx.rotate(-Math.PI / 2);
      ctx.font = '900 68px "Impact", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('V I S A', 0, 0);
      ctx.restore();

      // Cash App
      ctx.save();
      ctx.translate(650, 1280);
      ctx.rotate(-Math.PI / 2);
      ctx.font = '900 36px "Arial Black", sans-serif';
      ctx.fillStyle = '#00d632';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Cash App', 0, 0);
      ctx.restore();

      ctx.fillStyle = '#1434cb';
      ctx.fillRect(1740, 1100, 220, 948);
      drawRedBullChargingBulls(ctx, 1933, 1692, 85);
    } else if (teamId === 'williams') {
      // Williams FW46: Royal Navy Blue with Cyan Pinstripe
      drawSpine('#001f54');

      ctx.strokeStyle = '#00a3e0';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(60, 1280);
      ctx.lineTo(1280, 1280);
      ctx.stroke();

      drawWilliamsLogo(ctx, 120, 1280, 70);

      // Alex Albon #23
      ctx.save();
      ctx.translate(260, 1280);
      ctx.rotate(-Math.PI / 2);
      ctx.font = '900 78px "Impact", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#001f54';
      ctx.lineWidth = 6;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeText('23', 0, 0);
      ctx.fillText('23', 0, 0);
      ctx.restore();

      // KOMATSU
      ctx.save();
      ctx.translate(480, 1280);
      ctx.rotate(-Math.PI / 2);
      ctx.font = '900 44px "Arial Black", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('KOMATSU', 0, 0);
      ctx.restore();

      ctx.fillStyle = '#001f54';
      ctx.fillRect(1740, 1100, 220, 948);
      drawWilliamsLogo(ctx, 1933, 1692, 90);
    } else if (teamId === 'audi') {
      // Stake Sauber / Audi: Carbon black with high-voltage Fluo Green wedge
      drawSpine('#0d0e11');

      ctx.fillStyle = '#52ff00';
      ctx.beginPath();
      ctx.moveTo(60, 1240);
      ctx.lineTo(380, 1270);
      ctx.lineTo(380, 1290);
      ctx.lineTo(60, 1320);
      ctx.closePath();
      ctx.fill();

      // Nico Hülkenberg #27
      ctx.save();
      ctx.translate(240, 1280);
      ctx.rotate(-Math.PI / 2);
      ctx.font = '900 78px "Impact", sans-serif';
      ctx.fillStyle = '#52ff00';
      ctx.strokeStyle = '#0d0e11';
      ctx.lineWidth = 6;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeText('27', 0, 0);
      ctx.fillText('27', 0, 0);
      ctx.restore();

      // Stake
      ctx.save();
      ctx.translate(450, 1280);
      ctx.rotate(-Math.PI / 2);
      ctx.font = '900 58px "Impact", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Stake', 0, 0);
      ctx.restore();

      // Audi 4 rings
      ctx.save();
      ctx.translate(680, 1280);
      ctx.rotate(-Math.PI / 2);
      drawAudiFourRings(ctx, 0, 0, 130);
      ctx.restore();

      ctx.fillStyle = '#0d0e11';
      ctx.fillRect(1740, 1100, 220, 948);
      drawAudiFourRings(ctx, 1933, 1692, 110);
    } else if (teamId === 'haas') {
      // Haas VF-24: Crisp Racing White with Haas red speedlines
      drawSpine('#ffffff');

      ctx.strokeStyle = '#e10600';
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(60, 1280);
      ctx.lineTo(1280, 1280);
      ctx.stroke();

      drawHaasLogo(ctx, 120, 1280, 72);

      // Oliver Bearman #87
      ctx.save();
      ctx.translate(260, 1280);
      ctx.rotate(-Math.PI / 2);
      ctx.font = '900 78px "Impact", sans-serif';
      ctx.fillStyle = '#e10600';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 6;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeText('87', 0, 0);
      ctx.fillText('87', 0, 0);
      ctx.restore();

      // MoneyGram
      ctx.save();
      ctx.translate(480, 1280);
      ctx.rotate(-Math.PI / 2);
      drawMoneyGramLogo(ctx, 0, 0, 52);
      ctx.restore();

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(1740, 1100, 220, 948);
      drawHaasLogo(ctx, 1933, 1692, 85);
    } else if (teamId === 'cadillac') {
      // Cadillac: Satin Black with Olympic Gold pinstripes
      drawSpine('#0a0b0d');

      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(60, 1280);
      ctx.lineTo(1280, 1280);
      ctx.stroke();

      drawCadillacCrest(ctx, 120, 1280, 72);

      // Sergio Pérez #11
      ctx.save();
      ctx.translate(260, 1280);
      ctx.rotate(-Math.PI / 2);
      ctx.font = '900 78px "Impact", sans-serif';
      ctx.fillStyle = '#d4af37';
      ctx.strokeStyle = '#0a0b0d';
      ctx.lineWidth = 6;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeText('11', 0, 0);
      ctx.fillText('11', 0, 0);
      ctx.restore();

      // CADILLAC
      ctx.save();
      ctx.translate(480, 1280);
      ctx.rotate(-Math.PI / 2);
      ctx.font = 'italic 700 44px "Times New Roman", serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Cadillac', 0, 0);
      ctx.restore();

      ctx.fillStyle = '#0a0b0d';
      ctx.fillRect(1740, 1100, 220, 948);
      drawCadillacCrest(ctx, 1933, 1692, 85);
    } else {
      drawSpine(livery.bodyColor || '#141619');
      ctx.save();
      ctx.translate(300, 1280);
      ctx.rotate(-Math.PI / 2);
      ctx.font = '900 52px "Arial Black", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(teamId).toUpperCase(), 0, 0);
      ctx.restore();
      ctx.fillStyle = livery.bodyColor || '#141619';
      ctx.fillRect(1740, 1100, 220, 948);
    }
  });
}

/**
 * 2. MAIN BODYWORK: SIDEPODS, ENGINE COVER, SHARK FIN & AIRBOX (Default_OBJ.004 / Image_1.png)
 * UV mapped precisely to Primitive 1 in C42 GLTF.
 * Features:
 *  - Airbox roll-hoop intake cowl (Y: 0..120): Team signature airbox (Red INEOS, Yellow Red Bull, Duracell copper)
 *  - Left sidepod & engine cover (X: 150..1450, Y: 1550..2048): Dynamic sweeping ribbon, bold white title sponsors
 *  - Right sidepod flank (X: 728..1012, Y: 770..1620): Vertical sidepod flank with team branding
 *  - Engine cover starfield & logos (X: 950..1850, Y: 450..1500)
 */
export function generateBodyworkTexture(
  teamId: TeamId,
  livery: Team3DLivery,
  _sponsors: TeamSponsorConfig,
): THREE.CanvasTexture {
  return createUVTexture(2048, 2048, (ctx, w, h) => {
    // 1. Carbon fiber base weave
    drawCarbonWeave(ctx, w, h, livery.bodyColor || '#0a0b0d');

    if (teamId === 'mercedes') {
      // 1. Airbox Roll-Hoop Intake Cowl (Top Edge Y: 0..120): INEOS Burgundy Red
      ctx.fillStyle = '#c8102e';
      ctx.fillRect(0, 0, w, 110);
      ctx.fillStyle = '#0a0b0d';
      ctx.fillRect(0, 110, w, 12);
      drawIneosLogo(ctx, 450, 55, 230);
      drawIneosLogo(ctx, 1550, 55, 230);

      // Driver headrest cowl behind cockpit: George Russell #63 in electric teal + Mercedes star
      ctx.font = '900 48px "Impact", sans-serif';
      ctx.fillStyle = '#00f5d4';
      ctx.strokeStyle = '#0a0b0d';
      ctx.lineWidth = 5;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeText('63', 320, 160);
      ctx.fillText('63', 320, 160);
      ctx.strokeText('63', 1728, 160);
      ctx.fillText('63', 1728, 160);
      drawMercedesStar(ctx, 240, 160, 20);
      drawMercedesStar(ctx, 1808, 160, 20);

      // 2. Left Sidepod & Left Engine Cover (X: 150..1450, Y: 1550..2048)
      ctx.fillStyle = '#0a0b0d';
      ctx.fillRect(150, 1550, 1300, 498);

      const ribbon = ctx.createLinearGradient(150, 1750, 1350, 1680);
      ribbon.addColorStop(0, '#00a19c');
      ribbon.addColorStop(0.5, '#00d6cb');
      ribbon.addColorStop(1, '#007570');

      ctx.fillStyle = ribbon;
      ctx.beginPath();
      ctx.moveTo(150, 1740);
      ctx.bezierCurveTo(450, 1720, 850, 1680, 1350, 1660);
      ctx.lineTo(1350, 1720);
      ctx.bezierCurveTo(850, 1740, 450, 1780, 150, 1800);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#00f5d4';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(150, 1740);
      ctx.bezierCurveTo(450, 1720, 850, 1680, 1350, 1660);
      ctx.stroke();

      ctx.font = '900 86px "Impact", "Arial Black", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('P E T R O N A S', 680, 1865);

      ctx.font = 'italic 900 38px "Arial Black", sans-serif';
      ctx.fillStyle = '#e2e8f0';
      ctx.fillText('///AMG', 460, 1940);
      ctx.fillStyle = '#00a19c';
      ctx.font = '900 24px "Arial Black", sans-serif';
      ctx.fillText('E  PERFORMANCE', 700, 1940);

      drawWhatsAppLogo(ctx, 1020, 1865, 42);
      ctx.font = '900 28px "Arial Black", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('Snapdragon', 1200, 1865);

      // 3. Right Sidepod Flank (Vertical strip X: 728..1012, Y: 770..1620)
      ctx.fillStyle = '#0a0b0d';
      ctx.fillRect(728, 770, 284, 850);

      ctx.fillStyle = '#00a19c';
      ctx.fillRect(850, 770, 24, 850);
      ctx.fillStyle = '#00f5d4';
      ctx.fillRect(868, 770, 6, 850);

      ctx.save();
      ctx.translate(790, 1200);
      ctx.rotate(Math.PI / 2);
      ctx.font = '900 68px "Impact", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('P E T R O N A S', 0, 0);
      ctx.restore();

      ctx.strokeStyle = '#00a19c';
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(0, 360);
      ctx.lineTo(900, 360);
      ctx.moveTo(850, 180);
      ctx.lineTo(1900, 180);
      ctx.stroke();

      ctx.font = 'italic 900 34px "Arial Black", sans-serif';
      ctx.fillStyle = '#cbd5e1';
      ctx.textAlign = 'center';
      ctx.fillText('///AMG', 500, 320);
      ctx.fillText('///AMG', 1400, 140);

      drawMercedesStarfield(ctx, 1050, 600, 750, 750);
    } else if (teamId === 'ferrari') {
      // 1. Airbox Cowl: Rosso Corsa with Shell pectens
      ctx.fillStyle = '#e8002d';
      ctx.fillRect(0, 0, w, 110);
      drawShellLogo(ctx, 450, 55, 36);
      drawShellLogo(ctx, 1550, 55, 36);

      // Driver headrest cowl: Charles Leclerc #16 in white with yellow outline
      ctx.font = '900 48px "Impact", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#ffdf00';
      ctx.lineWidth = 5;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeText('16', 320, 160);
      ctx.fillText('16', 320, 160);
      ctx.strokeText('16', 1728, 160);
      ctx.fillText('16', 1728, 160);
      drawFerrariShield(ctx, 240, 160, 42);
      drawFerrariShield(ctx, 1808, 160, 42);

      // 2. Main Bodywork: Rosso Corsa
      ctx.fillStyle = '#e8002d';
      ctx.fillRect(150, 1550, 1300, 498);

      // Yellow & white double shoulder stripes
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(150, 1750);
      ctx.lineTo(1450, 1750);
      ctx.stroke();

      ctx.strokeStyle = '#ffdf00';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(150, 1775);
      ctx.lineTo(1450, 1775);
      ctx.stroke();

      // Shell Pecten and Santander
      drawShellLogo(ctx, 380, 1870, 75);
      ctx.font = '900 76px "Arial Black", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Santander', 760, 1875);

      drawHpLogo(ctx, 1140, 1870, 72);

      // 3. Right Sidepod Flank
      ctx.fillStyle = '#e8002d';
      ctx.fillRect(728, 770, 284, 850);
      ctx.save();
      ctx.translate(790, 1200);
      ctx.rotate(Math.PI / 2);
      ctx.font = '900 64px "Arial Black", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Santander', 0, 0);
      ctx.restore();

      // 4. Shark Fin: Ferrari shield & Italian flag
      drawFerrariShield(ctx, 1400, 950, 180);
      drawShellLogo(ctx, 1400, 1200, 100);
    } else if (teamId === 'redbull') {
      // 1. Airbox Cowl: Racing Sunburst Yellow scoop
      ctx.fillStyle = '#ffce00';
      ctx.fillRect(0, 0, w, 110);
      drawRedBullChargingBulls(ctx, 450, 55, 65);
      drawRedBullChargingBulls(ctx, 1550, 55, 65);

      // Driver headrest cowl: Max Verstappen #1 in sunburst yellow with red outline
      ctx.font = '900 52px "Impact", sans-serif';
      ctx.fillStyle = '#ffce00';
      ctx.strokeStyle = '#ed1a3b';
      ctx.lineWidth = 6;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeText('1', 320, 160);
      ctx.fillText('1', 320, 160);
      ctx.strokeText('1', 1728, 160);
      ctx.fillText('1', 1728, 160);

      // 2. Main Bodywork: Matte Navy
      ctx.fillStyle = '#030a1c';
      ctx.fillRect(150, 1550, 1300, 498);

      // Giant bold white ORACLE
      ctx.font = '900 110px "Impact", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('O R A C L E', 750, 1860);

      drawRedBullChargingBulls(ctx, 1260, 1860, 140);

      // 3. Right Sidepod Flank
      ctx.fillStyle = '#030a1c';
      ctx.fillRect(728, 770, 284, 850);
      ctx.save();
      ctx.translate(790, 1200);
      ctx.rotate(Math.PI / 2);
      ctx.font = '900 70px "Impact", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('ORACLE', 0, 0);
      ctx.restore();

      // 4. Shark Fin: Giant Red Bull Charging Bull with red/yellow sun
      drawRedBullChargingBulls(ctx, 1400, 950, 340);
    } else if (teamId === 'mclaren') {
      // 1. Airbox Cowl: Anthracite Carbon with Google Chrome wheel logos
      ctx.fillStyle = '#141619';
      ctx.fillRect(0, 0, w, 110);
      drawGoogleChromeLogo(ctx, 450, 55, 24);
      drawGoogleChromeLogo(ctx, 1550, 55, 24);

      // Driver headrest cowl: Lando Norris #4 in neon lime
      ctx.font = '900 52px "Impact", sans-serif';
      ctx.fillStyle = '#d9f99d';
      ctx.strokeStyle = '#141619';
      ctx.lineWidth = 6;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeText('4', 320, 160);
      ctx.fillText('4', 320, 160);
      ctx.strokeText('4', 1728, 160);
      ctx.fillText('4', 1728, 160);

      // 2. Main Bodywork: Papaya Orange with Carbon Undercut
      ctx.fillStyle = '#ff8000';
      ctx.fillRect(150, 1550, 1300, 498);

      ctx.fillStyle = '#141619';
      ctx.fillRect(150, 1870, 1300, 178);

      ctx.font = '900 110px "Impact", sans-serif';
      ctx.fillStyle = '#141619';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('O K X', 750, 1780);

      drawGoogleChromeLogo(ctx, 1180, 1780, 42);
      drawAndroidLogo(ctx, 360, 1780, 48);

      // 3. Right Sidepod Flank
      ctx.fillStyle = '#ff8000';
      ctx.fillRect(728, 770, 284, 850);
      ctx.save();
      ctx.translate(790, 1200);
      ctx.rotate(Math.PI / 2);
      ctx.font = '900 70px "Impact", sans-serif';
      ctx.fillStyle = '#141619';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('O K X', 0, 0);
      ctx.restore();

      // 4. Shark Fin: McLaren Speedmark Boomerang
      drawMcLarenSpeedmark(ctx, 1400, 950, 220);
    } else if (teamId === 'astonmartin') {
      // 1. Airbox Cowl: British Racing Green with Lime accent
      ctx.fillStyle = '#00594f';
      ctx.fillRect(0, 0, w, 110);
      ctx.fillStyle = '#cedc00';
      ctx.fillRect(0, 104, w, 8);
      drawAstonMartinWings(ctx, 450, 55, 120);
      drawAstonMartinWings(ctx, 1550, 55, 120);

      // Driver headrest cowl: Fernando Alonso #14
      ctx.font = '900 48px "Impact", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#00594f';
      ctx.lineWidth = 5;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeText('14', 320, 160);
      ctx.fillText('14', 320, 160);
      ctx.strokeText('14', 1728, 160);
      ctx.fillText('14', 1728, 160);

      // 2. Main Bodywork: Metallic Racing Green with Lime Pinstripe
      ctx.fillStyle = '#00594f';
      ctx.fillRect(150, 1550, 1300, 498);

      ctx.strokeStyle = '#cedc00';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(150, 1750);
      ctx.lineTo(1450, 1750);
      ctx.stroke();

      ctx.font = '900 88px "Arial Black", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('aramco', 750, 1865);

      drawAstonMartinWings(ctx, 1220, 1865, 160);

      // 3. Right Sidepod Flank
      ctx.fillStyle = '#00594f';
      ctx.fillRect(728, 770, 284, 850);
      ctx.fillStyle = '#cedc00';
      ctx.fillRect(860, 770, 12, 850);
      ctx.save();
      ctx.translate(790, 1200);
      ctx.rotate(Math.PI / 2);
      ctx.font = '900 66px "Arial Black", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('aramco', 0, 0);
      ctx.restore();

      // 4. Shark Fin: Aston Martin Wings
      drawAstonMartinWings(ctx, 1400, 950, 300);
    } else if (teamId === 'alpine') {
      // 1. Airbox Cowl: Alpine Metallic Blue
      ctx.fillStyle = '#0078d0';
      ctx.fillRect(0, 0, w, 110);
      drawAlpineLogo(ctx, 450, 55, 60);
      drawAlpineLogo(ctx, 1550, 55, 60);

      // Driver headrest cowl: Pierre Gasly #10
      ctx.font = '900 48px "Impact", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#0078d0';
      ctx.lineWidth = 5;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeText('10', 320, 160);
      ctx.fillText('10', 320, 160);
      ctx.strokeText('10', 1728, 160);
      ctx.fillText('10', 1728, 160);

      // 2. Main Bodywork: Split Blue & BWT Flamingo Pink
      ctx.fillStyle = '#0078d0';
      ctx.fillRect(150, 1550, 1300, 498);

      ctx.fillStyle = '#fd4bc7';
      ctx.beginPath();
      ctx.moveTo(150, 1780);
      ctx.bezierCurveTo(450, 1760, 850, 1740, 1450, 1740);
      ctx.lineTo(1450, 2048);
      ctx.lineTo(150, 2048);
      ctx.closePath();
      ctx.fill();

      ctx.font = '900 100px "Impact", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('B W T', 750, 1880);

      // 3. Right Sidepod Flank
      ctx.fillStyle = '#0078d0';
      ctx.fillRect(728, 770, 284, 850);
      ctx.fillStyle = '#fd4bc7';
      ctx.fillRect(840, 770, 40, 850);
      ctx.save();
      ctx.translate(790, 1200);
      ctx.rotate(Math.PI / 2);
      ctx.font = '900 70px "Impact", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('B W T', 0, 0);
      ctx.restore();

      // 4. Shark Fin: Alpine Italic 'A' Arrow
      drawAlpineLogo(ctx, 1400, 950, 240);
    } else if (teamId === 'racingbulls') {
      // 1. Airbox Cowl: Royal Electric Blue with Red Bull bull
      ctx.fillStyle = '#1434cb';
      ctx.fillRect(0, 0, w, 110);
      drawRedBullChargingBulls(ctx, 450, 55, 65);
      drawRedBullChargingBulls(ctx, 1550, 55, 65);

      // Driver headrest cowl: Liam Lawson #30 in green/white
      ctx.font = '900 48px "Impact", sans-serif';
      ctx.fillStyle = '#00d632';
      ctx.strokeStyle = '#1434cb';
      ctx.lineWidth = 5;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeText('30', 320, 160);
      ctx.fillText('30', 320, 160);
      ctx.strokeText('30', 1728, 160);
      ctx.fillText('30', 1728, 160);

      // 2. Main Bodywork: Royal Electric Blue with White ribbon
      ctx.fillStyle = '#1434cb';
      ctx.fillRect(150, 1550, 1300, 498);

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(150, 1750);
      ctx.lineTo(1450, 1720);
      ctx.lineTo(1450, 1760);
      ctx.lineTo(150, 1790);
      ctx.closePath();
      ctx.fill();

      ctx.font = '900 90px "Impact", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('V I S A', 600, 1870);

      ctx.font = '900 42px "Arial Black", sans-serif';
      ctx.fillStyle = '#00d632';
      ctx.fillText('Cash App', 960, 1870);

      // 3. Right Sidepod Flank
      ctx.fillStyle = '#1434cb';
      ctx.fillRect(728, 770, 284, 850);
      ctx.save();
      ctx.translate(790, 1200);
      ctx.rotate(Math.PI / 2);
      ctx.font = '900 68px "Impact", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('V I S A', 0, 0);
      ctx.restore();

      // 4. Shark Fin: Silver Red Bull Bull
      drawRedBullChargingBulls(ctx, 1400, 950, 280);
    } else if (teamId === 'williams') {
      // 1. Airbox Cowl: Iconic Metallic Copper Duracell Battery Scoop
      ctx.fillStyle = '#b87333';
      ctx.fillRect(0, 0, w, 110);
      ctx.fillStyle = '#121417';
      ctx.fillRect(0, 85, w, 25);
      ctx.font = '900 28px "Arial Black", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('DURACELL', 450, 50);
      ctx.fillText('DURACELL', 1550, 50);

      // Driver headrest cowl: Alex Albon #23
      ctx.font = '900 48px "Impact", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#001f54';
      ctx.lineWidth = 5;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeText('23', 320, 160);
      ctx.fillText('23', 320, 160);
      ctx.strokeText('23', 1728, 160);
      ctx.fillText('23', 1728, 160);

      // 2. Main Bodywork: Deep Royal Navy Blue with Cyan Pinstripe
      ctx.fillStyle = '#001f54';
      ctx.fillRect(150, 1550, 1300, 498);

      ctx.strokeStyle = '#00a3e0';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(150, 1750);
      ctx.lineTo(1450, 1750);
      ctx.stroke();

      ctx.font = '900 88px "Arial Black", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('KOMATSU', 750, 1865);

      drawWilliamsLogo(ctx, 1220, 1865, 80);

      // 3. Right Sidepod Flank
      ctx.fillStyle = '#001f54';
      ctx.fillRect(728, 770, 284, 850);
      ctx.save();
      ctx.translate(790, 1200);
      ctx.rotate(Math.PI / 2);
      ctx.font = '900 64px "Arial Black", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('KOMATSU', 0, 0);
      ctx.restore();

      // 4. Shark Fin: Williams 'W' Logo
      drawWilliamsLogo(ctx, 1400, 950, 240);
    } else if (teamId === 'audi') {
      // 1. Airbox Cowl: Carbon Black with High-Voltage Fluo Green Rim
      ctx.fillStyle = '#0d0e11';
      ctx.fillRect(0, 0, w, 110);
      ctx.fillStyle = '#52ff00';
      ctx.fillRect(0, 100, w, 10);
      drawAudiFourRings(ctx, 450, 55, 110);
      drawAudiFourRings(ctx, 1550, 55, 110);

      // Driver headrest cowl: Nico Hülkenberg #27
      ctx.font = '900 48px "Impact", sans-serif';
      ctx.fillStyle = '#52ff00';
      ctx.strokeStyle = '#0d0e11';
      ctx.lineWidth = 5;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeText('27', 320, 160);
      ctx.fillText('27', 320, 160);
      ctx.strokeText('27', 1728, 160);
      ctx.fillText('27', 1728, 160);

      // 2. Main Bodywork: Carbon Black with Fluo Green Sidepod Sweep
      ctx.fillStyle = '#0d0e11';
      ctx.fillRect(150, 1550, 1300, 498);

      ctx.fillStyle = '#52ff00';
      ctx.beginPath();
      ctx.moveTo(150, 1780);
      ctx.bezierCurveTo(450, 1750, 850, 1720, 1450, 1720);
      ctx.lineTo(1450, 1780);
      ctx.bezierCurveTo(850, 1780, 450, 1810, 150, 1840);
      ctx.closePath();
      ctx.fill();

      ctx.font = '900 90px "Impact", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Stake', 620, 1870);

      ctx.font = '900 70px "Impact", sans-serif';
      ctx.fillStyle = '#52ff00';
      ctx.fillText('KICK', 980, 1870);

      // 3. Right Sidepod Flank
      ctx.fillStyle = '#0d0e11';
      ctx.fillRect(728, 770, 284, 850);
      ctx.fillStyle = '#52ff00';
      ctx.fillRect(850, 770, 20, 850);
      ctx.save();
      ctx.translate(790, 1200);
      ctx.rotate(Math.PI / 2);
      ctx.font = '900 68px "Impact", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Stake', 0, 0);
      ctx.restore();

      // 4. Shark Fin: Audi Four Interlocking Rings
      drawAudiFourRings(ctx, 1400, 950, 320);
    } else if (teamId === 'haas') {
      // 1. Airbox Cowl: Carbon Black with Haas Red Accent
      ctx.fillStyle = '#121417';
      ctx.fillRect(0, 0, w, 110);
      ctx.fillStyle = '#e10600';
      ctx.fillRect(0, 102, w, 8);
      drawHaasLogo(ctx, 450, 55, 55);
      drawHaasLogo(ctx, 1550, 55, 55);

      // Driver headrest cowl: Oliver Bearman #87
      ctx.font = '900 48px "Impact", sans-serif';
      ctx.fillStyle = '#e10600';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 5;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeText('87', 320, 160);
      ctx.fillText('87', 320, 160);
      ctx.strokeText('87', 1728, 160);
      ctx.fillText('87', 1728, 160);

      // 2. Main Bodywork: Clean Racing White fading to Carbon Black
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(150, 1550, 1300, 498);
      ctx.fillStyle = '#121417';
      ctx.fillRect(150, 1780, 1300, 268);

      drawMoneyGramLogo(ctx, 360, 1870, 70);

      ctx.font = '900 82px "Arial Black", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('MoneyGram', 780, 1870);

      // 3. Right Sidepod Flank
      ctx.fillStyle = '#121417';
      ctx.fillRect(728, 770, 284, 850);
      ctx.save();
      ctx.translate(790, 1200);
      ctx.rotate(Math.PI / 2);
      ctx.font = '900 62px "Arial Black", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('MoneyGram', 0, 0);
      ctx.restore();

      // 4. Shark Fin: Haas 'H' Logo
      drawHaasLogo(ctx, 1400, 950, 200);
    } else if (teamId === 'cadillac') {
      // 1. Airbox Cowl: Satin Black with Gold Crest
      ctx.fillStyle = '#0a0b0d';
      ctx.fillRect(0, 0, w, 110);
      ctx.fillStyle = '#d4af37';
      ctx.fillRect(0, 104, w, 6);
      drawCadillacCrest(ctx, 450, 55, 60);
      drawCadillacCrest(ctx, 1550, 55, 60);

      // Driver headrest cowl: Sergio Pérez #11
      ctx.font = '900 48px "Impact", sans-serif';
      ctx.fillStyle = '#d4af37';
      ctx.strokeStyle = '#0a0b0d';
      ctx.lineWidth = 5;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeText('11', 320, 160);
      ctx.fillText('11', 320, 160);
      ctx.strokeText('11', 1728, 160);
      ctx.fillText('11', 1728, 160);

      // 2. Main Bodywork: Satin Black with Gold Shoulder Pinstripes
      ctx.fillStyle = '#0a0b0d';
      ctx.fillRect(150, 1550, 1300, 498);

      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(150, 1750);
      ctx.lineTo(1450, 1750);
      ctx.stroke();

      ctx.font = 'italic 700 84px "Times New Roman", serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Cadillac', 640, 1865);

      ctx.font = '900 32px "Arial Black", sans-serif';
      ctx.fillStyle = '#d4af37';
      ctx.fillText('V - S E R I E S', 1040, 1865);

      // 3. Right Sidepod Flank
      ctx.fillStyle = '#0a0b0d';
      ctx.fillRect(728, 770, 284, 850);
      ctx.save();
      ctx.translate(790, 1200);
      ctx.rotate(Math.PI / 2);
      ctx.font = 'italic 700 66px "Times New Roman", serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Cadillac', 0, 0);
      ctx.restore();

      // 4. Shark Fin: Cadillac Crest
      drawCadillacCrest(ctx, 1400, 950, 220);
    } else {
      ctx.fillStyle = livery.bodyColor || '#141619';
      ctx.fillRect(0, 0, w, h);
      ctx.font = '900 90px "Arial Black", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(String(teamId).toUpperCase(), 750, 1860);
    }
  });
}

/**
 * 3. WINGS ASSEMBLY: FRONT & REAR WINGS (Default_OBJ.005 / Image_8.png)
 * UV mapped precisely to Primitive 10 in C42 GLTF.
 * Features:
 *  - Rear wing DRS flap (X: 714..884, Y: 982..1500): Vertical strip wrapped horizontally across the DRS flap
 *  - Rear wing endplates (X: 1074..1294, Y: 934..1244 & X: 870..1178, Y: 720..938)
 *  - Front wing mainplanes & endplates (Left: X < 450; Right: X > 1400)
 */
export function generateWingsTexture(
  teamId: TeamId,
  livery: Team3DLivery,
  _sponsors: TeamSponsorConfig,
): THREE.CanvasTexture {
  return createUVTexture(2048, 2048, (ctx, w, h) => {
    // 1. Carbon fiber base weave
    drawCarbonWeave(ctx, w, h, '#0a0b0d');

    // Helper: Draw graphics horizontally across a rear wing element
    const drawFlapBranding = (
      centerX: number,
      centerY: number,
      bgColor: string,
      drawGraphics: () => void,
    ) => {
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(Math.PI / 2);
      drawGraphics();
      ctx.restore();
    };

    // Helper: Draw standard F1 rear wingtip end blocks with dual aerodynamic cutout stripes
    const drawWingtipAccents = (
      primaryColor: string,
      secondaryColor: string,
      stripeColor: string = '#0a0b0e',
    ) => {
      // Left wingtip block (-485..-335)
      ctx.fillStyle = primaryColor;
      ctx.beginPath();
      ctx.roundRect(-485, -55, 150, 110, 8);
      ctx.fill();
      ctx.fillStyle = secondaryColor;
      ctx.fillRect(-485, -55, 16, 110);

      // Right wingtip block (335..485)
      ctx.fillStyle = primaryColor;
      ctx.beginPath();
      ctx.roundRect(335, -55, 150, 110, 8);
      ctx.fill();
      ctx.fillStyle = secondaryColor;
      ctx.fillRect(469, -55, 16, 110);

      // Dual aerodynamic cutout speedline stripes on both wingtips
      ctx.fillStyle = stripeColor;
      ctx.fillRect(-485, -24, 150, 12);
      ctx.fillRect(-485, 14, 150, 12);
      ctx.fillRect(335, -24, 150, 12);
      ctx.fillRect(335, 14, 150, 12);

      // Aerodynamic underline swoosh tapering towards the center
      ctx.strokeStyle = secondaryColor;
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.moveTo(-335, 48);
      ctx.quadraticCurveTo(-160, 52, 0, 50);
      ctx.quadraticCurveTo(160, 52, 335, 48);
      ctx.stroke();
    };

    // Helper: Draw central DRS Actuator Bullet Pod
    const drawDrsBulletPod = (podColor: string = '#0e1115', strokeColor: string = '#252a32') => {
      ctx.fillStyle = podColor;
      ctx.beginPath();
      ctx.roundRect(-24, -48, 48, 72, [14, 14, 4, 4]);
      ctx.fill();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2.5;
      ctx.stroke();
    };

    if (teamId === 'mercedes') {
      // ── A. UPPER DRS FLAP (Area B: X: 275..450, Y: 720..1730) ──
      ctx.fillStyle = '#0a0b0e';
      ctx.fillRect(275, 720, 175, 1010);

      ctx.fillStyle = '#00a19c';
      ctx.fillRect(418, 720, 24, 1010);
      ctx.fillStyle = '#00f5d4';
      ctx.fillRect(436, 720, 6, 1010);

      drawFlapBranding(355, 1225, '#0a0b0e', () => {
        drawWingtipAccents('#00a19c', '#00f5d4', '#0a0b0e');

        ctx.font = '900 92px "Impact", "Arial Black", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('P E T R O N A S', 0, -4);

        drawDrsBulletPod('#0e1115', '#252a32');
      });

      // ── B. LOWER MAINPLANE ──
      ctx.fillStyle = '#0a0b0e';
      ctx.fillRect(680, 720, 210, 1010);
      ctx.fillStyle = '#00a19c';
      ctx.fillRect(860, 720, 16, 1010);

      drawFlapBranding(785, 1240, '#0a0b0e', () => {
        ctx.font = '900 74px "Impact", "Arial Black", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('P E T R O N A S', 0, 0);

        drawMercedesStar(ctx, -380, 0, 24);
        drawMercedesStar(ctx, 380, 0, 24);
      });

      // ── C. ENDPLATES ──
      ctx.fillStyle = '#0a0b0d';
      ctx.fillRect(1074, 934, 220, 310);
      ctx.fillRect(870, 720, 308, 218);

      drawSnapdragonLogo(ctx, 990, 830, 36);

      ctx.font = '800 28px "Arial", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText('TeamViewer', 1184, 1080);

      // ── D. FRONT WING FLAPS ──
      ctx.strokeStyle = '#00a19c';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(40, 200);
      ctx.lineTo(40, 850);
      ctx.moveTo(1800, 200);
      ctx.lineTo(1800, 850);
      ctx.stroke();

      ctx.font = '900 52px "Impact", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('PETRONAS', 220, 520);
      ctx.fillText('PETRONAS', 1650, 520);
    } else if (teamId === 'ferrari') {
      // ── A. UPPER DRS FLAP ──
      ctx.fillStyle = '#e8002d';
      ctx.fillRect(275, 720, 175, 1010);

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(426, 720, 10, 1010);
      ctx.fillStyle = '#ffdf00';
      ctx.fillRect(436, 720, 8, 1010);

      drawFlapBranding(355, 1225, '#e8002d', () => {
        drawWingtipAccents('#ffdf00', '#ffffff', '#e8002d');

        ctx.font = 'italic 900 96px "Times New Roman", serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Ferrari', 0, -8);

        ctx.font = '900 22px "Arial Black", sans-serif';
        ctx.fillStyle = '#ffdf00';
        ctx.fillText('SCUDERIA FERRARI HP', 0, 44);

        drawDrsBulletPod('#b80022', '#ffdf00');
      });

      // ── B. LOWER MAINPLANE ──
      ctx.fillStyle = '#e8002d';
      ctx.fillRect(680, 720, 210, 1010);

      drawFlapBranding(785, 1240, '#e8002d', () => {
        ctx.font = '900 74px "Arial Black", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Santander', 0, 0);

        drawShellLogo(ctx, -380, 0, 44);
        drawShellLogo(ctx, 380, 0, 44);
      });

      // ── C. ENDPLATES ──
      ctx.fillStyle = '#e8002d';
      ctx.fillRect(1074, 934, 220, 310);
      ctx.fillRect(870, 720, 308, 218);

      ctx.font = '900 34px "Arial Black", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText('Santander', 1184, 1080);
      drawHpLogo(ctx, 1024, 830, 48);

      // ── D. FRONT WING FLAPS ──
      ctx.strokeStyle = '#ffdf00';
      ctx.lineWidth = 12;
      ctx.beginPath();
      ctx.moveTo(40, 200);
      ctx.lineTo(40, 850);
      ctx.moveTo(1800, 200);
      ctx.lineTo(1800, 850);
      ctx.stroke();

      ctx.font = '900 52px "Arial Black", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('Santander', 220, 520);
      ctx.fillText('Santander', 1650, 520);
    } else if (teamId === 'redbull') {
      // ── A. UPPER DRS FLAP ──
      ctx.fillStyle = '#030a1c';
      ctx.fillRect(275, 720, 175, 1010);

      ctx.fillStyle = '#ffce00';
      ctx.fillRect(426, 720, 12, 1010);
      ctx.fillStyle = '#ed1a3b';
      ctx.fillRect(438, 720, 6, 1010);

      drawFlapBranding(355, 1225, '#030a1c', () => {
        drawWingtipAccents('#ffce00', '#ed1a3b', '#030a1c');

        ctx.font = '900 96px "Impact", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('H O N D A', 0, -8);

        ctx.font = '900 24px "Arial Black", sans-serif';
        ctx.fillStyle = '#ed1a3b';
        ctx.fillText('H R C', 0, 44);

        drawDrsBulletPod('#020612', '#ffce00');
      });

      // ── B. LOWER MAINPLANE ──
      ctx.fillStyle = '#030a1c';
      ctx.fillRect(680, 720, 210, 1010);

      drawFlapBranding(785, 1240, '#030a1c', () => {
        ctx.font = '900 86px "Impact", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('B Y B I T', 0, 0);

        drawRedBullChargingBulls(ctx, -380, 0, 85);
        drawRedBullChargingBulls(ctx, 380, 0, 85);
      });

      // ── C. ENDPLATES ──
      ctx.fillStyle = '#030a1c';
      ctx.fillRect(1074, 934, 220, 310);
      ctx.fillRect(870, 720, 308, 218);

      ctx.font = '800 32px "Arial Black", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText('Mobil 1', 1184, 1080);
      ctx.fillText('Oracle', 1024, 830);

      // ── D. FRONT WING FLAPS ──
      ctx.strokeStyle = '#ffce00';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(40, 200);
      ctx.lineTo(40, 850);
      ctx.moveTo(1800, 200);
      ctx.lineTo(1800, 850);
      ctx.stroke();

      ctx.font = '900 52px "Impact", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('ORACLE', 220, 520);
      ctx.fillText('ORACLE', 1650, 520);
    } else if (teamId === 'mclaren') {
      // ── A. UPPER DRS FLAP ──
      ctx.fillStyle = '#ff8000';
      ctx.fillRect(275, 720, 175, 1010);

      ctx.fillStyle = '#141619';
      ctx.fillRect(426, 720, 18, 1010);

      drawFlapBranding(355, 1225, '#ff8000', () => {
        drawWingtipAccents('#141619', '#ffffff', '#ff8000');

        ctx.font = '900 100px "Impact", sans-serif';
        ctx.fillStyle = '#141619';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('O K X', 0, 0);

        drawDrsBulletPod('#141619', '#ff8000');
      });

      // ── B. LOWER MAINPLANE ──
      ctx.fillStyle = '#141619';
      ctx.fillRect(680, 720, 210, 1010);
      ctx.fillStyle = '#ff8000';
      ctx.fillRect(860, 720, 16, 1010);

      drawFlapBranding(785, 1240, '#141619', () => {
        ctx.font = '900 80px "Impact", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('M c L A R E N', 0, 0);

        drawMcLarenSpeedmark(ctx, -380, 0, 50);
        drawMcLarenSpeedmark(ctx, 380, 0, 50);
      });

      // ── C. ENDPLATES ──
      ctx.fillStyle = '#141619';
      ctx.fillRect(1074, 934, 220, 310);
      ctx.fillRect(870, 720, 308, 218);

      drawGoogleChromeLogo(ctx, 1184, 1080, 32);
      ctx.font = '900 32px "Impact", sans-serif';
      ctx.fillStyle = '#ff8000';
      ctx.textAlign = 'center';
      ctx.fillText('OKX', 1024, 830);

      // ── D. FRONT WING FLAPS ──
      ctx.strokeStyle = '#ff8000';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(40, 200);
      ctx.lineTo(40, 850);
      ctx.moveTo(1800, 200);
      ctx.lineTo(1800, 850);
      ctx.stroke();

      ctx.font = '900 52px "Impact", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('McLAREN', 220, 520);
      ctx.fillText('McLAREN', 1650, 520);
    } else if (teamId === 'astonmartin') {
      // ── A. UPPER DRS FLAP ──
      ctx.fillStyle = '#00594f';
      ctx.fillRect(275, 720, 175, 1010);

      ctx.fillStyle = '#cedc00';
      ctx.fillRect(426, 720, 18, 1010);

      drawFlapBranding(355, 1225, '#00594f', () => {
        drawWingtipAccents('#cedc00', '#ffffff', '#00594f');

        ctx.font = '900 80px "Arial Black", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('ASTON MARTIN', 0, -8);

        ctx.font = '900 26px "Arial Black", sans-serif';
        ctx.fillStyle = '#cedc00';
        ctx.fillText('aramco', 0, 44);

        drawDrsBulletPod('#003831', '#cedc00');
      });

      // ── B. LOWER MAINPLANE ──
      ctx.fillStyle = '#00594f';
      ctx.fillRect(680, 720, 210, 1010);

      drawFlapBranding(785, 1240, '#00594f', () => {
        ctx.font = '900 82px "Arial Black", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('aramco', 0, 0);

        drawAstonMartinWings(ctx, -380, 0, 100);
        drawAstonMartinWings(ctx, 380, 0, 100);
      });

      // ── C. ENDPLATES ──
      ctx.fillStyle = '#00594f';
      ctx.fillRect(1074, 934, 220, 310);
      ctx.fillRect(870, 720, 308, 218);

      ctx.font = '900 32px "Arial Black", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText('aramco', 1184, 1080);
      ctx.fillStyle = '#cedc00';
      ctx.fillText('Cognizant', 1024, 830);

      // ── D. FRONT WING FLAPS ──
      ctx.strokeStyle = '#cedc00';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(40, 200);
      ctx.lineTo(40, 850);
      ctx.moveTo(1800, 200);
      ctx.lineTo(1800, 850);
      ctx.stroke();

      ctx.font = '900 48px "Arial Black", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('aramco', 220, 520);
      ctx.fillText('aramco', 1650, 520);
    } else if (teamId === 'alpine') {
      // ── A. UPPER DRS FLAP ──
      ctx.fillStyle = '#fd4bc7';
      ctx.fillRect(275, 720, 175, 1010);

      ctx.fillStyle = '#0078d0';
      ctx.fillRect(426, 720, 18, 1010);

      drawFlapBranding(355, 1225, '#fd4bc7', () => {
        drawWingtipAccents('#0078d0', '#ffffff', '#fd4bc7');

        ctx.font = '900 105px "Impact", sans-serif';
        ctx.fillStyle = '#0078d0';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('B W T', 0, 0);

        drawDrsBulletPod('#0078d0', '#ffffff');
      });

      // ── B. LOWER MAINPLANE ──
      ctx.fillStyle = '#0078d0';
      ctx.fillRect(680, 720, 210, 1010);

      drawFlapBranding(785, 1240, '#0078d0', () => {
        ctx.font = '900 84px "Impact", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('A L P I N E', 0, 0);

        drawAlpineLogo(ctx, -380, 0, 48);
        drawAlpineLogo(ctx, 380, 0, 48);
      });

      // ── C. ENDPLATES ──
      ctx.fillStyle = '#0078d0';
      ctx.fillRect(1074, 934, 220, 310);
      ctx.fillRect(870, 720, 308, 218);

      ctx.font = '900 34px "Impact", sans-serif';
      ctx.fillStyle = '#fd4bc7';
      ctx.textAlign = 'center';
      ctx.fillText('BWT', 1184, 1080);
      drawAlpineLogo(ctx, 1024, 830, 42);

      // ── D. FRONT WING FLAPS ──
      ctx.strokeStyle = '#fd4bc7';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(40, 200);
      ctx.lineTo(40, 850);
      ctx.moveTo(1800, 200);
      ctx.lineTo(1800, 850);
      ctx.stroke();

      ctx.font = '900 52px "Impact", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('ALPINE', 220, 520);
      ctx.fillText('ALPINE', 1650, 520);
    } else if (teamId === 'racingbulls') {
      // ── A. UPPER DRS FLAP ──
      ctx.fillStyle = '#1434cb';
      ctx.fillRect(275, 720, 175, 1010);

      ctx.fillStyle = '#00d632';
      ctx.fillRect(426, 720, 18, 1010);

      drawFlapBranding(355, 1225, '#1434cb', () => {
        drawWingtipAccents('#ffffff', '#00d632', '#1434cb');

        ctx.font = '900 96px "Impact", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('V I S A', 0, -8);

        ctx.font = '900 30px "Arial Black", sans-serif';
        ctx.fillStyle = '#00d632';
        ctx.fillText('Cash App', 0, 44);

        drawDrsBulletPod('#0e1f7a', '#00d632');
      });

      // ── B. LOWER MAINPLANE ──
      ctx.fillStyle = '#1434cb';
      ctx.fillRect(680, 720, 210, 1010);

      drawFlapBranding(785, 1240, '#1434cb', () => {
        ctx.font = '900 82px "Arial Black", sans-serif';
        ctx.fillStyle = '#00d632';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Cash App', 0, 0);

        drawRedBullChargingBulls(ctx, -380, 0, 75);
        drawRedBullChargingBulls(ctx, 380, 0, 75);
      });

      // ── C. ENDPLATES ──
      ctx.fillStyle = '#1434cb';
      ctx.fillRect(1074, 934, 220, 310);
      ctx.fillRect(870, 720, 308, 218);

      ctx.font = '900 32px "Impact", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText('HUGO', 1184, 1080);
      ctx.fillStyle = '#00d632';
      ctx.fillText('Cash App', 1024, 830);

      // ── D. FRONT WING FLAPS ──
      ctx.strokeStyle = '#00d632';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(40, 200);
      ctx.lineTo(40, 850);
      ctx.moveTo(1800, 200);
      ctx.lineTo(1800, 850);
      ctx.stroke();

      ctx.font = '900 52px "Impact", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('VISA', 220, 520);
      ctx.fillText('VISA', 1650, 520);
    } else if (teamId === 'williams') {
      // ── A. UPPER DRS FLAP ──
      ctx.fillStyle = '#001f54';
      ctx.fillRect(275, 720, 175, 1010);

      ctx.fillStyle = '#00a3e0';
      ctx.fillRect(426, 720, 18, 1010);

      drawFlapBranding(355, 1225, '#001f54', () => {
        drawWingtipAccents('#00a3e0', '#ffffff', '#001f54');

        ctx.font = '900 88px "Impact", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('W I L L I A M S', 0, -8);

        ctx.font = '900 26px "Arial Black", sans-serif';
        ctx.fillStyle = '#00a3e0';
        ctx.fillText('R A C I N G', 0, 44);

        drawDrsBulletPod('#001133', '#00a3e0');
      });

      // ── B. LOWER MAINPLANE ──
      ctx.fillStyle = '#001f54';
      ctx.fillRect(680, 720, 210, 1010);

      drawFlapBranding(785, 1240, '#001f54', () => {
        ctx.font = '900 78px "Impact", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('KOMATSU', 0, 0);

        drawWilliamsLogo(ctx, -380, 0, 48);
        drawWilliamsLogo(ctx, 380, 0, 48);
      });

      // ── C. ENDPLATES ──
      ctx.fillStyle = '#001f54';
      ctx.fillRect(1074, 934, 220, 310);
      ctx.fillRect(870, 720, 308, 218);

      ctx.font = '900 28px "Arial Black", sans-serif';
      ctx.fillStyle = '#b87333';
      ctx.textAlign = 'center';
      ctx.fillText('DURACELL', 1184, 1080);
      ctx.fillStyle = '#00a3e0';
      ctx.fillText('KOMATSU', 1024, 830);

      // ── D. FRONT WING FLAPS ──
      ctx.strokeStyle = '#00a3e0';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(40, 200);
      ctx.lineTo(40, 850);
      ctx.moveTo(1800, 200);
      ctx.lineTo(1800, 850);
      ctx.stroke();

      ctx.font = '900 52px "Impact", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('WILLIAMS', 220, 520);
      ctx.fillText('WILLIAMS', 1650, 520);
    } else if (teamId === 'audi') {
      // ── A. UPPER DRS FLAP ──
      ctx.fillStyle = '#52ff00';
      ctx.fillRect(275, 720, 175, 1010);

      ctx.fillStyle = '#0d0e11';
      ctx.fillRect(426, 720, 18, 1010);

      drawFlapBranding(355, 1225, '#52ff00', () => {
        drawWingtipAccents('#0d0e11', '#ffffff', '#52ff00');

        ctx.font = '900 100px "Impact", sans-serif';
        ctx.fillStyle = '#0d0e11';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('K I C K', 0, 0);

        drawDrsBulletPod('#0d0e11', '#52ff00');
      });

      // ── B. LOWER MAINPLANE ──
      ctx.fillStyle = '#0d0e11';
      ctx.fillRect(680, 720, 210, 1010);

      drawFlapBranding(785, 1240, '#0d0e11', () => {
        ctx.font = '900 82px "Impact", sans-serif';
        ctx.fillStyle = '#52ff00';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('S T A K E', 0, 0);

        drawAudiFourRings(ctx, -380, 0, 110);
        drawAudiFourRings(ctx, 380, 0, 110);
      });

      // ── C. ENDPLATES ──
      ctx.fillStyle = '#52ff00';
      ctx.fillRect(1074, 934, 220, 310);
      ctx.fillRect(870, 720, 308, 218);

      ctx.font = '900 34px "Impact", sans-serif';
      ctx.fillStyle = '#0d0e11';
      ctx.textAlign = 'center';
      ctx.fillText('Stake', 1184, 1080);
      ctx.fillText('KICK', 1024, 830);

      // ── D. FRONT WING FLAPS ──
      ctx.strokeStyle = '#52ff00';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(40, 200);
      ctx.lineTo(40, 850);
      ctx.moveTo(1800, 200);
      ctx.lineTo(1800, 850);
      ctx.stroke();

      ctx.font = '900 52px "Impact", sans-serif';
      ctx.fillStyle = '#0d0e11';
      ctx.fillText('KICK', 220, 520);
      ctx.fillText('KICK', 1650, 520);
    } else if (teamId === 'haas') {
      // ── A. UPPER DRS FLAP ──
      ctx.fillStyle = '#121417';
      ctx.fillRect(275, 720, 175, 1010);

      ctx.fillStyle = '#e10600';
      ctx.fillRect(426, 720, 18, 1010);

      drawFlapBranding(355, 1225, '#121417', () => {
        drawWingtipAccents('#ffffff', '#e10600', '#121417');

        ctx.font = '900 86px "Arial Black", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('MoneyGram', 0, 0);

        drawDrsBulletPod('#e10600', '#ffffff');
      });

      // ── B. LOWER MAINPLANE ──
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(680, 720, 210, 1010);

      drawFlapBranding(785, 1240, '#ffffff', () => {
        ctx.font = '900 82px "Impact", sans-serif';
        ctx.fillStyle = '#e10600';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('H A A S', 0, 0);

        drawHaasLogo(ctx, -380, 0, 50);
        drawHaasLogo(ctx, 380, 0, 50);
      });

      // ── C. ENDPLATES ──
      ctx.fillStyle = '#121417';
      ctx.fillRect(1074, 934, 220, 310);
      ctx.fillRect(870, 720, 308, 218);

      drawHaasLogo(ctx, 1184, 1080, 50);
      ctx.font = '900 28px "Arial Black", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText('MoneyGram', 1024, 830);

      // ── D. FRONT WING FLAPS ──
      ctx.strokeStyle = '#e10600';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(40, 200);
      ctx.lineTo(40, 850);
      ctx.moveTo(1800, 200);
      ctx.lineTo(1800, 850);
      ctx.stroke();

      ctx.font = '900 52px "Impact", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('HAAS', 220, 520);
      ctx.fillText('HAAS', 1650, 520);
    } else if (teamId === 'cadillac') {
      // ── A. UPPER DRS FLAP ──
      ctx.fillStyle = '#0b0c0e';
      ctx.fillRect(275, 720, 175, 1010);

      ctx.fillStyle = '#d4af37';
      ctx.fillRect(426, 720, 18, 1010);

      drawFlapBranding(355, 1225, '#0b0c0e', () => {
        drawWingtipAccents('#d4af37', '#ffffff', '#0b0c0e');

        ctx.font = 'italic 700 88px "Times New Roman", serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Cadillac', 0, -8);

        ctx.font = '700 26px "Arial", sans-serif';
        ctx.fillStyle = '#d4af37';
        ctx.fillText('V - S E R I E S', 0, 44);

        drawDrsBulletPod('#0b0c0e', '#d4af37');
      });

      // ── B. LOWER MAINPLANE ──
      ctx.fillStyle = '#0b0c0e';
      ctx.fillRect(680, 720, 210, 1010);

      drawFlapBranding(785, 1240, '#0b0c0e', () => {
        ctx.font = '900 76px "Arial Black", sans-serif';
        ctx.fillStyle = '#d4af37';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('CADILLAC RACING', 0, 0);

        drawCadillacCrest(ctx, -380, 0, 50);
        drawCadillacCrest(ctx, 380, 0, 50);
      });

      // ── C. ENDPLATES ──
      ctx.fillStyle = '#0b0c0e';
      ctx.fillRect(1074, 934, 220, 310);
      ctx.fillRect(870, 720, 308, 218);

      drawCadillacCrest(ctx, 1184, 1080, 46);
      drawCadillacCrest(ctx, 1024, 830, 46);

      // ── D. FRONT WING FLAPS ──
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(40, 200);
      ctx.lineTo(40, 850);
      ctx.moveTo(1800, 200);
      ctx.lineTo(1800, 850);
      ctx.stroke();

      ctx.font = 'italic 700 48px "Times New Roman", serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('Cadillac', 220, 520);
      ctx.fillText('Cadillac', 1650, 520);
    } else {
      ctx.fillStyle = livery.wingColor || '#0a0b0e';
      ctx.fillRect(275, 720, 175, 1010);
      ctx.fillRect(680, 720, 210, 1010);

      drawFlapBranding(355, 1225, '#0a0b0e', () => {
        ctx.font = '900 80px "Arial Black", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(teamId).toUpperCase(), 0, 0);
      });
    }
  });
}

/**
 * 4. AERODYNAMIC UNDERFLOOR & CHASSIS (Default_OBJ.001 / Image_3.png)
 * Pure procedural carbon fiber twill weave with zero misplaced sponsor decals or bleed.
 */
export function generateFloorTexture(teamId: TeamId, livery: Team3DLivery): THREE.CanvasTexture {
  return createUVTexture(1024, 1024, (ctx, w, h) => {
    drawCarbonWeave(ctx, w, h, livery.floorColor || '#0a0b0d');
  });
}

// ─────────────────────────────────────────────────────────────
// Backward-Compatibility Aliases
// ─────────────────────────────────────────────────────────────
export const generateFrontWingTexture = generateWingsTexture;
export const generateRearWingTexture = generateWingsTexture;
export const generateSidepodTexture = generateBodyworkTexture;
export const generateEngineCoverTexture = generateBodyworkTexture;
