import * as THREE from 'three';
import type { EDSLiveryPreset } from '../data/showroom/edsLiveries';

export type LegacySkinSlot =
  | 'nose'
  | 'bodywork'
  | 'wings'
  | 'floor'
  | 'suspension'
  | 'diffuser'
  | 'cockpit'
  | 'halo'
  | 'wheels';

export interface LegacySkinResources {
  materials: Record<LegacySkinSlot, THREE.Material>;
  textures: Record<LegacySkinSlot, THREE.CanvasTexture>;
  dispose: () => void;
}

const SLOT_BY_MATERIAL_TOKEN: Record<string, LegacySkinSlot> = {
  '001': 'floor',
  '002': 'cockpit',
  '003': 'suspension',
  '004': 'bodywork',
  '005': 'wings',
  '006': 'wheels',
  '007': 'nose',
  '008': 'halo',
  '009': 'diffuser',
};

const mix = (a: string, b: string, amount: number) =>
  `#${new THREE.Color(a).lerp(new THREE.Color(b), amount).getHexString()}`;

export interface LegacySkinArtDirection {
  style: 'heritage' | 'velocity' | 'crimson' | 'stealth' | 'grand-prix' | 'kinetic';
  accentOpacity: number;
  secondaryOpacity: number;
  weaveStrength: number;
  paintRoughness: number;
  paintMetalness: number;
  paintClearcoat: number;
}

const ART_DIRECTIONS: Record<string, LegacySkinArtDirection> = {
  'eds-carbon': {
    style: 'heritage',
    accentOpacity: 0.48,
    secondaryOpacity: 0.72,
    weaveStrength: 0.42,
    paintRoughness: 0.48,
    paintMetalness: 0.18,
    paintClearcoat: 0.3,
  },
  'eds-aero': {
    style: 'velocity',
    accentOpacity: 0.7,
    secondaryOpacity: 0.8,
    weaveStrength: 0.12,
    paintRoughness: 0.28,
    paintMetalness: 0.34,
    paintClearcoat: 0.82,
  },
  'eds-crimson': {
    style: 'crimson',
    accentOpacity: 0.46,
    secondaryOpacity: 0.84,
    weaveStrength: 0.1,
    paintRoughness: 0.26,
    paintMetalness: 0.24,
    paintClearcoat: 0.88,
  },
  'eds-monochrome': {
    style: 'stealth',
    accentOpacity: 0.18,
    secondaryOpacity: 0.56,
    weaveStrength: 0.05,
    paintRoughness: 0.66,
    paintMetalness: 0.12,
    paintClearcoat: 0.08,
  },
  'eds-gold': {
    style: 'grand-prix',
    accentOpacity: 0.58,
    secondaryOpacity: 0.82,
    weaveStrength: 0.1,
    paintRoughness: 0.3,
    paintMetalness: 0.46,
    paintClearcoat: 0.78,
  },
  'eds-electric': {
    style: 'kinetic',
    accentOpacity: 0.54,
    secondaryOpacity: 0.78,
    weaveStrength: 0.2,
    paintRoughness: 0.5,
    paintMetalness: 0.2,
    paintClearcoat: 0.24,
  },
};

export const getLegacySkinArtDirection = (liveryId: string): LegacySkinArtDirection =>
  ART_DIRECTIONS[liveryId] ?? ART_DIRECTIONS['eds-aero'];

function drawCarbonWeave(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  base: string,
  strength = 0.2,
) {
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, width, height);
  const tile = document.createElement('canvas');
  tile.width = 16;
  tile.height = 16;
  const weave = tile.getContext('2d');
  if (!weave) return;
  weave.lineCap = 'square';
  weave.lineWidth = 3;
  weave.strokeStyle = `rgba(255,255,255,${strength * 0.2})`;
  weave.beginPath();
  weave.moveTo(-4, 12);
  weave.lineTo(12, -4);
  weave.moveTo(4, 20);
  weave.lineTo(20, 4);
  weave.stroke();
  weave.lineWidth = 2;
  weave.strokeStyle = `rgba(0,0,0,${strength * 0.34})`;
  weave.beginPath();
  weave.moveTo(-4, 4);
  weave.lineTo(12, 20);
  weave.moveTo(4, -4);
  weave.lineTo(20, 12);
  weave.stroke();
  const pattern = ctx.createPattern(tile, 'repeat');
  if (pattern) {
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, width, height);
  }
}

function addSurfaceLighting(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const shade = ctx.createLinearGradient(0, 0, width, height);
  shade.addColorStop(0, 'rgba(255,255,255,0.16)');
  shade.addColorStop(0.32, 'rgba(255,255,255,0.015)');
  shade.addColorStop(0.72, 'rgba(0,0,0,0.08)');
  shade.addColorStop(1, 'rgba(0,0,0,0.28)');
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, width, height);
}

function drawTaperedPanel(
  ctx: CanvasRenderingContext2D,
  points: Array<[number, number]>,
  fill: string,
) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  points.forEach(([x, y], index) => (index === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
  ctx.closePath();
  ctx.fill();
}

function drawFineLine(
  ctx: CanvasRenderingContext2D,
  points: Array<[number, number]>,
  color: string,
  width: number,
) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.beginPath();
  points.forEach(([x, y], index) => (index === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
  ctx.stroke();
}

function addOriginalEDSGraphics(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  livery: EDSLiveryPreset,
  slot: LegacySkinSlot,
  art: LegacySkinArtDirection,
) {
  const accent = `${livery.accent}${Math.round(art.accentOpacity * 255)
    .toString(16)
    .padStart(2, '0')}`;
  const secondary = `${livery.secondary}${Math.round(art.secondaryOpacity * 255)
    .toString(16)
    .padStart(2, '0')}`;
  const hairline = Math.max(2, width / 260);

  if (slot === 'nose') {
    drawTaperedPanel(
      ctx,
      [
        [width * 0.45, height * 0.03],
        [width * 0.55, height * 0.03],
        [width * 0.63, height * 0.93],
        [width * 0.37, height * 0.93],
      ],
      secondary,
    );
    drawFineLine(
      ctx,
      [
        [width * 0.5, height * 0.04],
        [width * 0.5, height * 0.94],
      ],
      accent,
      art.style === 'stealth' ? hairline : hairline * 1.8,
    );
  } else if (slot === 'bodywork') {
    drawTaperedPanel(
      ctx,
      [
        [width * 0.05, height * 0.64],
        [width * 0.42, height * 0.32],
        [width * 0.96, height * 0.2],
        [width * 0.96, height * 0.46],
        [width * 0.5, height * 0.54],
        [width * 0.16, height * 0.82],
      ],
      secondary,
    );
    drawFineLine(
      ctx,
      [
        [width * 0.06, height * 0.69],
        [width * 0.44, height * 0.39],
        [width * 0.95, height * 0.28],
      ],
      accent,
      art.style === 'grand-prix' ? hairline * 2.2 : hairline * 1.45,
    );
    if (art.style === 'kinetic') {
      drawFineLine(
        ctx,
        [
          [width * 0.18, height * 0.86],
          [width * 0.5, height * 0.62],
          [width * 0.86, height * 0.55],
        ],
        `${livery.accent}72`,
        hairline,
      );
    }
  } else if (slot === 'wings') {
    ctx.fillStyle = secondary;
    ctx.fillRect(0, height * 0.12, width, height * 0.18);
    ctx.fillRect(0, height * 0.69, width, height * 0.16);
    ctx.fillStyle = accent;
    ctx.fillRect(0, height * 0.285, width, hairline * 1.5);
    ctx.fillRect(0, height * 0.69, width, hairline * 1.5);
  } else if (slot === 'floor') {
    ctx.fillStyle = `${livery.accent}${art.style === 'stealth' ? '16' : '42'}`;
    ctx.fillRect(width * 0.035, height * 0.08, width * 0.018, height * 0.84);
    ctx.fillRect(width * 0.947, height * 0.08, width * 0.018, height * 0.84);
  } else if (slot === 'suspension') {
    drawFineLine(
      ctx,
      [
        [width * 0.1, height * 0.76],
        [width * 0.42, height * 0.58],
      ],
      `${livery.accent}${art.style === 'stealth' ? '28' : '66'}`,
      hairline,
    );
    drawFineLine(
      ctx,
      [
        [width * 0.9, height * 0.76],
        [width * 0.58, height * 0.58],
      ],
      `${livery.accent}${art.style === 'stealth' ? '28' : '66'}`,
      hairline,
    );
  } else if (slot === 'diffuser') {
    ctx.fillStyle = secondary;
    ctx.fillRect(0, height * 0.05, width, height * 0.11);
    ctx.fillStyle = accent;
    ctx.fillRect(0, height * 0.16, width, hairline);
    ctx.fillStyle = '#b71120';
    ctx.fillRect(width * 0.47, height * 0.78, width * 0.06, height * 0.035);
  } else if (slot === 'cockpit') {
    ctx.fillStyle = '#080a0d';
    ctx.fillRect(width * 0.27, height * 0.15, width * 0.46, height * 0.7);
    ctx.fillStyle = `${livery.accent}${art.style === 'stealth' ? '38' : '88'}`;
    ctx.fillRect(width * 0.36, height * 0.29, width * 0.055, height * 0.45);
    ctx.fillRect(width * 0.585, height * 0.29, width * 0.055, height * 0.45);
  } else if (slot === 'halo') {
    drawFineLine(
      ctx,
      [
        [width * 0.12, height * 0.54],
        [width * 0.5, height * 0.43],
        [width * 0.88, height * 0.54],
      ],
      accent,
      art.style === 'stealth' ? hairline : hairline * 1.4,
    );
  }

  if (art.style === 'heritage' && slot !== 'wheels') {
    drawFineLine(
      ctx,
      [
        [width * 0.08, height * 0.92],
        [width * 0.92, height * 0.92],
      ],
      'rgba(210,220,228,0.38)',
      hairline,
    );
  }
}

function createTexture(slot: LegacySkinSlot, livery: EDSLiveryPreset, anisotropy: number) {
  const size = slot === 'nose' || slot === 'bodywork' || slot === 'wings' ? 1024 : 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error(`Unable to create EDS texture canvas for ${slot}`);

  const art = getLegacySkinArtDirection(livery.id);
  const carbonSlots: LegacySkinSlot[] = ['floor', 'suspension', 'diffuser', 'cockpit', 'wings'];
  const isStealth = art.style === 'stealth';
  const isHeritage = art.style === 'heritage';
  const base = carbonSlots.includes(slot)
    ? mix(livery.secondary, '#05070a', isStealth ? 0.8 : 0.68)
    : isHeritage
      ? mix(livery.primary, '#1d242b', 0.2)
      : livery.primary;
  const weave = carbonSlots.includes(slot)
    ? Math.max(art.weaveStrength, isStealth ? 0.06 : 0.24)
    : art.weaveStrength;
  drawCarbonWeave(ctx, size, size, base, weave);
  addSurfaceLighting(ctx, size, size);
  addOriginalEDSGraphics(ctx, size, size, livery, slot, art);

  if (slot === 'wheels') {
    const center = size / 2;
    ctx.fillStyle = '#080a0d';
    ctx.fillRect(0, 0, size, size);
    const tire = ctx.createRadialGradient(center, center, size * 0.08, center, center, size * 0.48);
    tire.addColorStop(0, mix(livery.secondary, '#141820', 0.5));
    tire.addColorStop(0.48, '#20252b');
    tire.addColorStop(0.7, '#090b0e');
    tire.addColorStop(1, '#020304');
    ctx.fillStyle = tire;
    ctx.beginPath();
    ctx.arc(center, center, size * 0.47, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = mix(livery.secondary, '#aeb8c2', 0.34);
    ctx.lineWidth = size * 0.012;
    ctx.beginPath();
    ctx.arc(center, center, size * 0.34, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = `${livery.accent}${isStealth ? '20' : '44'}`;
    ctx.lineWidth = size * 0.004;
    for (let index = 0; index < 12; index += 1) {
      const angle = (index / 12) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(center + Math.cos(angle) * size * 0.1, center + Math.sin(angle) * size * 0.1);
      ctx.lineTo(
        center + Math.cos(angle + 0.09) * size * 0.29,
        center + Math.sin(angle + 0.09) * size * 0.29,
      );
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.name = `EDS_DEV_${livery.id}_${slot}`;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.flipY = false;
  texture.anisotropy = Math.max(1, Math.min(8, anisotropy));
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

function createPBRMaterial(slot: LegacySkinSlot, texture: THREE.Texture, livery: EDSLiveryPreset) {
  const isPaint = slot === 'nose' || slot === 'bodywork' || slot === 'halo';
  const isWheel = slot === 'wheels';
  const isMechanical = slot === 'suspension' || slot === 'diffuser';
  const art = getLegacySkinArtDirection(livery.id);
  const roughness = isWheel
    ? 0.8
    : slot === 'floor'
      ? 0.7
      : slot === 'cockpit'
        ? 0.68
        : isMechanical
          ? 0.5
          : isPaint
            ? art.paintRoughness
            : 0.5;
  const metalness = isWheel
    ? 0.08
    : slot === 'floor' || slot === 'cockpit'
      ? 0.06
      : isMechanical
        ? 0.36
        : isPaint
          ? art.paintMetalness
          : 0.12;
  return new THREE.MeshPhysicalMaterial({
    name: `EDS_DEV_${livery.id}_${slot}`,
    map: texture,
    color: '#ffffff',
    roughness,
    metalness,
    clearcoat: isPaint ? art.paintClearcoat : slot === 'wings' ? 0.2 : 0.08,
    clearcoatRoughness: isPaint ? 0.16 : 0.3,
    envMapIntensity: isPaint ? 0.92 : isWheel ? 0.52 : 0.72,
  });
}

export function createLegacyEDSSkin(
  livery: EDSLiveryPreset,
  anisotropy: number,
): LegacySkinResources {
  const slots: LegacySkinSlot[] = [
    'nose',
    'bodywork',
    'wings',
    'floor',
    'suspension',
    'diffuser',
    'cockpit',
    'halo',
    'wheels',
  ];
  const textures = Object.fromEntries(
    slots.map((slot) => [slot, createTexture(slot, livery, anisotropy)]),
  ) as Record<LegacySkinSlot, THREE.CanvasTexture>;
  const materials = Object.fromEntries(
    slots.map((slot) => [slot, createPBRMaterial(slot, textures[slot], livery)]),
  ) as unknown as Record<LegacySkinSlot, THREE.Material>;
  return {
    textures,
    materials,
    dispose: () => {
      Object.values(materials).forEach((material) => material.dispose());
      Object.values(textures).forEach((texture) => texture.dispose());
    },
  };
}

export function getLegacySkinSlot(materialName: string): LegacySkinSlot {
  const token = Object.keys(SLOT_BY_MATERIAL_TOKEN).find((value) => materialName.includes(value));
  return token ? SLOT_BY_MATERIAL_TOKEN[token] : 'bodywork';
}

export function applyLegacyEDSSkin(sourceScene: THREE.Object3D, resources: LegacySkinResources) {
  const clonedScene = sourceScene.clone(true);
  let meshCount = 0;
  let sharedGeometryCount = 0;
  const sourceGeometries = new Set<THREE.BufferGeometry>();
  sourceScene.traverse((object) => {
    if (object instanceof THREE.Mesh) sourceGeometries.add(object.geometry);
  });
  clonedScene.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    meshCount += 1;
    if (sourceGeometries.has(object.geometry)) sharedGeometryCount += 1;
    const current = Array.isArray(object.material) ? object.material[0] : object.material;
    object.material = resources.materials[getLegacySkinSlot(current?.name ?? object.name)];
    object.castShadow = true;
    object.receiveShadow = true;
  });
  return { clonedScene, meshCount, sharedGeometryCount };
}
