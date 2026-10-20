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

function drawCarbonWeave(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  base: string,
  strength = 0.2,
) {
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, width, height);
  const tile = 18;
  for (let y = -tile; y < height + tile; y += tile) {
    for (let x = -tile; x < width + tile; x += tile) {
      const alternate = ((x + y) / tile) % 2 === 0;
      ctx.fillStyle = `rgba(255,255,255,${alternate ? strength * 0.17 : strength * 0.05})`;
      ctx.fillRect(x, y, tile, tile / 2);
      ctx.fillStyle = `rgba(0,0,0,${alternate ? strength * 0.2 : strength * 0.32})`;
      ctx.fillRect(x + tile / 2, y + tile / 2, tile, tile / 2);
    }
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

function addOriginalEDSGraphics(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  livery: EDSLiveryPreset,
  slot: LegacySkinSlot,
) {
  const bandCount = slot === 'bodywork' || slot === 'nose' ? 5 : 3;
  ctx.save();
  ctx.translate(width * 0.5, height * 0.5);
  ctx.rotate(-0.17);
  for (let index = -bandCount; index <= bandCount; index += 1) {
    const offset = index * (width / Math.max(4, bandCount));
    ctx.fillStyle = index % 2 === 0 ? `${livery.accent}d9` : `${livery.secondary}c7`;
    ctx.fillRect(offset - 16, -height, index % 2 === 0 ? 24 : 10, height * 2);
  }
  ctx.restore();

  ctx.strokeStyle = `${livery.accent}b8`;
  ctx.lineWidth = Math.max(3, width / 180);
  ctx.strokeRect(width * 0.035, height * 0.05, width * 0.93, height * 0.9);

  if (slot === 'bodywork' || slot === 'nose' || slot === 'wings') {
    ctx.fillStyle = 'rgba(5,8,12,0.72)';
    ctx.fillRect(width * 0.08, height * 0.74, width * 0.84, height * 0.11);
    ctx.fillStyle = livery.accent;
    ctx.fillRect(width * 0.08, height * 0.85, width * 0.84, Math.max(5, height * 0.012));
  }
}

function createTexture(slot: LegacySkinSlot, livery: EDSLiveryPreset, anisotropy: number) {
  const size = slot === 'nose' || slot === 'bodywork' || slot === 'wings' ? 1024 : 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error(`Unable to create EDS texture canvas for ${slot}`);

  const carbonSlots: LegacySkinSlot[] = ['floor', 'suspension', 'diffuser', 'cockpit', 'wings'];
  const base = carbonSlots.includes(slot) ? mix(livery.secondary, '#05070a', 0.68) : livery.primary;
  drawCarbonWeave(ctx, size, size, base, carbonSlots.includes(slot) ? 0.34 : 0.13);
  addSurfaceLighting(ctx, size, size);
  addOriginalEDSGraphics(ctx, size, size, livery, slot);

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
    ctx.strokeStyle = livery.accent;
    ctx.lineWidth = size * 0.018;
    ctx.beginPath();
    ctx.arc(center, center, size * 0.34, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = mix(livery.accent, '#ffffff', 0.35);
    ctx.lineWidth = size * 0.012;
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

  if (slot === 'cockpit') {
    ctx.fillStyle = '#080a0d';
    ctx.fillRect(size * 0.29, size * 0.16, size * 0.42, size * 0.68);
    ctx.fillStyle = livery.accent;
    ctx.fillRect(size * 0.34, size * 0.28, size * 0.09, size * 0.5);
    ctx.fillRect(size * 0.57, size * 0.28, size * 0.09, size * 0.5);
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
  return new THREE.MeshPhysicalMaterial({
    name: `EDS_DEV_${livery.id}_${slot}`,
    map: texture,
    color: '#ffffff',
    roughness: isWheel ? 0.56 : isMechanical ? 0.42 : isPaint ? livery.roughness : 0.48,
    metalness: isWheel ? 0.36 : isMechanical ? 0.48 : isPaint ? livery.metalness : 0.18,
    clearcoat: isPaint ? livery.clearcoat : slot === 'wings' ? 0.42 : 0.16,
    clearcoatRoughness: isPaint ? 0.1 : 0.24,
    envMapIntensity: isPaint ? 1.45 : 1.05,
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
