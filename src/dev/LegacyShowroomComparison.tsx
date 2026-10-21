import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  DEFAULT_EDS_LIVERY_ID,
  EDS_LIVERIES,
  EDS_LIVERY_IDS,
  getEDSLivery,
  type EDSLiveryId,
} from '../data/showroom/edsLiveries';
import { LegacyDetailedCar, type LegacyDetailedCarStats } from './LegacyDetailedCar';

type ReviewMode = 'legacy-original' | 'legacy-eds' | 'eds-g01' | 'eds-g02' | 'eds-g03';
type G03InspectionMode = 'diffuse' | 'reflective' | 'wireframe';
type CameraPreset =
  | 'front-three-quarter'
  | 'side'
  | 'top'
  | 'front'
  | 'rear'
  | 'rear-three-quarter'
  | 'nose-monocoque-closeup'
  | 'sidepod-inlet-closeup'
  | 'sidepod-floor-closeup'
  | 'rear-underfloor-closeup'
  | 'diffuser-exit-closeup'
  | 'diffuser-low-rear-closeup'
  | 'diffuser-underside-closeup'
  | 'halo-rear-mount-closeup'
  | 'halo-rear-right-mount-closeup'
  | 'halo-front-mount-closeup'
  | 'halo-upper-junction-closeup'
  | 'sidepod-topology-closeup'
  | 'diffuser-topology-closeup'
  | 'halo-topology-closeup'
  | 'engine-cover-closeup'
  | 'front-wing-closeup'
  | 'rear-wing-closeup'
  | 'halo-mounts-closeup';

const REVIEW_MODES: Array<{ id: ReviewMode; label: string; note: string }> = [
  { id: 'legacy-original', label: 'A · Original C42', note: 'Neutral material geometry baseline' },
  {
    id: 'legacy-eds',
    label: 'B · Detailed + EDS',
    note: 'Same geometry and UVs; original EDS skin',
  },
  { id: 'eds-g01', label: 'C · EDS-G01', note: 'Current commercial original prototype' },
  { id: 'eds-g02', label: 'D · EDS-G02', note: 'Postponed local candidate, when available' },
  { id: 'eds-g03', label: 'E · EDS-G03', note: 'R3.2 Revision 6 Gate 2 review' },
];

const CAMERA_PRESETS: Record<
  CameraPreset,
  { position: [number, number, number]; target: [number, number, number] }
> = {
  'front-three-quarter': { position: [4.8, 1.95, 4.85], target: [0, 0.42, 0] },
  side: { position: [7.2, 1.35, 0], target: [0, 0.38, 0] },
  top: { position: [0.01, 7.8, 0], target: [0, 0.15, 0] },
  front: { position: [0, 0.95, 6.25], target: [0, 0.32, 0.75] },
  rear: { position: [0, 1.05, -6.25], target: [0, 0.38, -0.7] },
  'rear-three-quarter': { position: [-4.8, 1.8, -4.8], target: [0, 0.4, -0.35] },
  'nose-monocoque-closeup': { position: [2.25, 1.08, 3.15], target: [0, 0.47, 1.05] },
  'sidepod-inlet-closeup': { position: [2.2, 1.02, 1.52], target: [0.5, 0.46, 0.24] },
  'sidepod-floor-closeup': { position: [2.75, 0.76, 0.25], target: [0.52, 0.35, -0.08] },
  'rear-underfloor-closeup': { position: [-2.4, 0.45, -3.1], target: [-0.28, 0.2, -1.48] },
  'diffuser-exit-closeup': { position: [-1.2, 0.16, -3.15], target: [0, 0.2, -1.95] },
  'diffuser-low-rear-closeup': { position: [0, 0.15, -3.05], target: [0, 0.18, -1.98] },
  'diffuser-underside-closeup': { position: [0.45, 0.1, -2.75], target: [0, 0.18, -1.93] },
  'halo-rear-mount-closeup': { position: [-1.35, 1.22, -0.55], target: [-0.25, 0.68, -0.1] },
  'halo-rear-right-mount-closeup': { position: [1.35, 1.22, -0.55], target: [0.25, 0.68, -0.1] },
  'halo-front-mount-closeup': { position: [0.9, 1.25, 1.35], target: [0, 0.68, 0.65] },
  'halo-upper-junction-closeup': { position: [0.43, 1.13, 0.12], target: [0, 0.895, 0.5] },
  'sidepod-topology-closeup': { position: [1.32, 0.82, 0.92], target: [0.5, 0.46, 0.24] },
  'diffuser-topology-closeup': { position: [0.1, 0.18, -2.85], target: [0, 0.2, -2.03] },
  'halo-topology-closeup': { position: [-0.92, 1.15, -0.3], target: [-0.25, 0.68, -0.1] },
  'engine-cover-closeup': { position: [-2.1, 1.46, -2.0], target: [0, 0.77, -0.7] },
  'front-wing-closeup': { position: [2.15, 0.62, 3.35], target: [0.18, 0.2, 2.12] },
  'rear-wing-closeup': { position: [-2.1, 1.22, -3.35], target: [0, 0.9, -2.12] },
  'halo-mounts-closeup': { position: [1.85, 1.62, 0.82], target: [0, 0.72, 0.18] },
};

interface RuntimeStats {
  gpu: string;
  calls: number;
  triangles: number;
  geometries: number;
  textures: number;
  frameSamples: number;
  medianRafMs: number | null;
  p95RafMs: number | null;
}

interface ReviewApi {
  ready: boolean;
  setMode: (mode: ReviewMode) => void;
  setLivery: (livery: EDSLiveryId) => void;
  setView: (view: CameraPreset) => void;
  setInspection: (inspection: G03InspectionMode) => void;
  getStats: () => RuntimeStats & {
    mode: ReviewMode;
    livery: EDSLiveryId;
    inspection: G03InspectionMode;
    geometry: LegacyDetailedCarStats | null;
  };
}

declare global {
  interface Window {
    __legacySkinReview?: ReviewApi;
  }
}

const CameraRig: React.FC<{ preset: CameraPreset }> = ({ preset }) => {
  const { camera } = useThree();
  useEffect(() => {
    const view = CAMERA_PRESETS[preset];
    camera.position.set(...view.position);
    camera.lookAt(...view.target);
    camera.updateProjectionMatrix();
  }, [camera, preset]);
  return null;
};

const LocalStudioEnvironment: React.FC = () => {
  const { gl } = useThree();
  const environment = useMemo(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const texture = pmrem.fromScene(room).texture;
    room.dispose();
    pmrem.dispose();
    return texture;
  }, [gl]);
  useEffect(() => {
    return () => environment.dispose();
  }, [environment]);
  return <primitive object={environment} attach="environment" />;
};

const DarkCyclorama: React.FC = () => (
  <mesh>
    <sphereGeometry args={[12, 16, 8]} />
    <meshBasicMaterial color="#070a0f" side={THREE.BackSide} />
  </mesh>
);

const PerformanceProbe: React.FC<{
  statsRef: React.MutableRefObject<RuntimeStats>;
  resetKey: string;
}> = ({ statsRef, resetKey }) => {
  const { gl } = useThree();
  const samples = useRef<number[]>([]);
  useEffect(() => {
    const context = gl.getContext();
    const debug = context.getExtension('WEBGL_debug_renderer_info');
    statsRef.current.gpu = debug
      ? String(context.getParameter(debug.UNMASKED_RENDERER_WEBGL))
      : 'GPU renderer unavailable';
  }, [gl, statsRef]);
  useEffect(() => {
    samples.current = [];
  }, [resetKey]);
  useFrame((_state, delta) => {
    if (delta > 0 && delta < 0.5) {
      samples.current.push(delta * 1000);
      if (samples.current.length > 360) samples.current.shift();
    }
    const ordered = samples.current.slice(30).sort((a, b) => a - b);
    statsRef.current = {
      ...statsRef.current,
      calls: gl.info.render.calls,
      triangles: gl.info.render.triangles,
      geometries: gl.info.memory.geometries,
      textures: gl.info.memory.textures,
      frameSamples: ordered.length,
      medianRafMs: ordered[Math.floor(ordered.length / 2)] ?? null,
      p95RafMs: ordered[Math.floor(ordered.length * 0.95)] ?? null,
    };
  });
  return null;
};

const EDSReviewCar: React.FC<{ model: 'eds-g01' | 'eds-g02'; liveryId: EDSLiveryId }> = ({
  model,
  liveryId,
}) => {
  const { scene } = useGLTF(`/models/${model}.glb`);
  const livery = getEDSLivery(liveryId);
  const clone = useMemo(() => scene.clone(true), [scene]);
  const materials = useMemo(() => {
    const material = (name: string, color: string, roughness: number, metalness: number) =>
      new THREE.MeshPhysicalMaterial({
        name: `EDS_DEV_COMPARISON_${name}`,
        color,
        roughness,
        metalness,
        clearcoat: name === 'paint' ? livery.clearcoat : 0.18,
        clearcoatRoughness: 0.14,
        envMapIntensity: 1.3,
      });
    return {
      paint: material('paint', livery.primary, livery.roughness, livery.metalness),
      accent: material('accent', livery.accent, 0.28, 0.42),
      carbon: material('carbon', '#10151a', 0.64, 0.08),
      metal: material('metal', '#59636d', 0.4, 0.68),
      tire: material('tire', '#080a0c', 0.84, 0.02),
    };
  }, [livery]);
  useEffect(() => {
    clone.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      const current = Array.isArray(object.material) ? object.material[0] : object.material;
      const name = `${object.name} ${current?.name ?? ''}`.toLowerCase();
      object.material = name.includes('tire')
        ? materials.tire
        : name.includes('rim') || name.includes('metal') || name.includes('mechanical')
          ? materials.metal
          : name.includes('carbon') ||
              name.includes('floor') ||
              name.includes('diffuser') ||
              name.includes('cockpit')
            ? materials.carbon
            : name.includes('accent') || name.includes('wing') || name.includes('halo')
              ? materials.accent
              : materials.paint;
      object.castShadow = true;
      object.receiveShadow = true;
    });
    return () => Object.values(materials).forEach((material) => material.dispose());
  }, [clone, materials]);
  return <primitive object={clone} />;
};

const EDSG03ReviewCar: React.FC<{ inspection: G03InspectionMode; preset: CameraPreset }> = ({
  inspection,
  preset,
}) => {
  const { scene } = useGLTF('/models/eds-g03-preview.glb');
  const clone = useMemo(() => {
    const next = scene.clone(true);
    next.userData.inspectionMode = inspection;
    return next;
  }, [inspection, scene]);
  const inspectionMaterials = useMemo(() => {
    if (inspection === 'diffuse') return null;
    if (inspection === 'wireframe') {
      return Object.fromEntries(
        ['body', 'aero', 'tire', 'mechanical', 'cockpit'].map((category) => [
          category,
          new THREE.MeshBasicMaterial({
            name: `EDS_G03_WIREFRAME_${category.toUpperCase()}`,
            color: category === 'body' ? '#91d9ea' : '#708994',
            wireframe: true,
            transparent: true,
            opacity: 0.72,
            depthWrite: false,
          }),
        ]),
      ) as Record<string, THREE.Material>;
    }
    const palette: Record<string, string> = {
      body: '#aeb8c0',
      aero: '#87939d',
      tire: '#11161b',
      mechanical: '#65717a',
      cockpit: '#202930',
    };
    return Object.fromEntries(
      Object.entries(palette).map(([category, color]) => [
        category,
        new THREE.MeshPhysicalMaterial({
          name: `EDS_G03_R3_2_INSPECTION_${category.toUpperCase()}`,
          color,
          roughness: category === 'tire' ? 0.78 : 0.3,
          metalness: category === 'mechanical' ? 0.42 : 0.08,
          clearcoat: category === 'body' || category === 'aero' ? 0.36 : 0,
          clearcoatRoughness: 0.24,
          envMapIntensity: 0.82,
        }),
      ]),
    ) as Record<string, THREE.Material>;
  }, [inspection]);
  useEffect(() => {
    clone.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      const category = object.name.replace('EDS_G03_', '').toLowerCase();
      object.visible =
        inspection !== 'wireframe' ||
        category === 'body' ||
        (preset.startsWith('halo-') && category === 'mechanical');
      if (inspectionMaterials) {
        object.material = inspectionMaterials[category] ?? inspectionMaterials.body;
      }
      object.castShadow = true;
      object.receiveShadow = true;
    });
    return () => {
      Object.values(inspectionMaterials ?? {}).forEach((material) => material.dispose());
    };
  }, [clone, inspection, inspectionMaterials, preset]);
  // G03 is authored with -Z front. The review-only rotation matches the legacy viewer's
  // +Z-front camera convention without altering the GLB hardpoint coordinate system.
  return <primitive object={clone} rotation={[0, Math.PI, 0]} />;
};

const ReviewScene: React.FC<{
  mode: ReviewMode;
  liveryId: EDSLiveryId;
  inspection: G03InspectionMode;
  preset: CameraPreset;
  onLegacyReady: (stats: LegacyDetailedCarStats) => void;
  statsRef: React.MutableRefObject<RuntimeStats>;
}> = ({ mode, liveryId, inspection, preset, onLegacyReady, statsRef }) => (
  <>
    <color attach="background" args={['#070a0f']} />
    <CameraRig preset={preset} />
    <LocalStudioEnvironment />
    <PerformanceProbe statsRef={statsRef} resetKey={`${mode}:${liveryId}:${inspection}`} />
    <ambientLight intensity={0.34} />
    <directionalLight position={[6, 8, 4.5]} intensity={1.72} castShadow />
    <directionalLight position={[-5, 3.5, -3.5]} intensity={0.58} color="#9edce2" />
    <directionalLight position={[0, 3, -5]} intensity={0.72} color="#d7e6ff" />
    <Suspense fallback={null}>
      {mode === 'legacy-original' || mode === 'legacy-eds' ? (
        <LegacyDetailedCar
          liveryId={liveryId}
          original={mode === 'legacy-original'}
          onReady={onLegacyReady}
        />
      ) : mode === 'eds-g03' ? (
        <EDSG03ReviewCar inspection={inspection} preset={preset} />
      ) : (
        <EDSReviewCar model={mode} liveryId={liveryId} />
      )}
      <ContactShadows
        position={[0, 0.005, 0]}
        opacity={0.34}
        scale={8}
        blur={3.2}
        far={4}
        color="#000000"
      />
    </Suspense>
    <DarkCyclorama />
    <OrbitControls
      makeDefault
      enableDamping
      minDistance={preset.includes('closeup') ? 0.35 : 3.2}
      maxDistance={8}
      target={CAMERA_PRESETS[preset].target}
    />
  </>
);

const getInitialValue = <T extends string>(key: string, allowed: readonly T[], fallback: T): T => {
  const value = new URLSearchParams(window.location.search).get(key) as T | null;
  return value && allowed.includes(value) ? value : fallback;
};

export const LegacyShowroomComparison: React.FC = () => {
  const [mode, setMode] = useState<ReviewMode>(() =>
    getInitialValue(
      'mode',
      REVIEW_MODES.map((item) => item.id),
      'legacy-eds',
    ),
  );
  const [liveryId, setLiveryId] = useState<EDSLiveryId>(() =>
    getInitialValue('livery', EDS_LIVERY_IDS, DEFAULT_EDS_LIVERY_ID),
  );
  const [preset, setPreset] = useState<CameraPreset>(() =>
    getInitialValue('view', Object.keys(CAMERA_PRESETS) as CameraPreset[], 'front-three-quarter'),
  );
  const [inspection, setInspection] = useState<G03InspectionMode>(() =>
    getInitialValue('inspection', ['diffuse', 'reflective', 'wireframe'] as const, 'diffuse'),
  );
  const [legacyStats, setLegacyStats] = useState<LegacyDetailedCarStats | null>(null);
  const statsRef = useRef<RuntimeStats>({
    gpu: 'Pending',
    calls: 0,
    triangles: 0,
    geometries: 0,
    textures: 0,
    frameSamples: 0,
    medianRafMs: null,
    p95RafMs: null,
  });
  const onLegacyReady = useCallback((stats: LegacyDetailedCarStats) => setLegacyStats(stats), []);

  useEffect(() => {
    window.__legacySkinReview = {
      ready: true,
      setMode,
      setLivery: setLiveryId,
      setView: setPreset,
      setInspection,
      getStats: () => ({
        ...statsRef.current,
        mode,
        livery: liveryId,
        inspection,
        geometry: legacyStats,
      }),
    };
    return () => {
      delete window.__legacySkinReview;
    };
  }, [inspection, legacyStats, liveryId, mode]);

  const selectedMode = REVIEW_MODES.find((item) => item.id === mode) ?? REVIEW_MODES[1];
  return (
    <main className="min-h-screen bg-studio-950 p-4 text-white sm:p-6">
      <div className="mx-auto max-w-[1500px] space-y-4">
        <header className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4">
          <p className="font-mono text-xs font-bold uppercase tracking-wider text-amber-300">
            DEV ONLY · C42 EXCLUDED FROM COMMERCIAL BUILD
          </p>
          <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl font-black uppercase">
                Legacy detailed chassis · EDS skin lab
              </h1>
              <p className="mt-1 text-sm text-studio-300">
                A/B uses identical geometry, UVs, camera, zoom, lighting and framing. No team logos,
                sponsor artwork or tire lettering are generated.
              </p>
            </div>
            <div className="text-right font-mono text-[11px] uppercase text-studio-300">
              <div>{selectedMode.label}</div>
              <div className="text-cyan-300">{EDS_LIVERIES[liveryId].name}</div>
            </div>
          </div>
        </header>

        <section className="grid gap-3 xl:grid-cols-[260px_minmax(0,1fr)_250px]">
          <aside className="space-y-3 rounded-2xl border border-studio-800 bg-studio-900/80 p-3">
            <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-studio-300">
              Model comparison
            </h2>
            {REVIEW_MODES.map((item) => (
              <button
                key={item.id}
                type="button"
                data-review-mode={item.id}
                onClick={() => setMode(item.id)}
                className={`w-full rounded-xl border p-3 text-left transition ${mode === item.id ? 'border-cyan-400 bg-cyan-400/10' : 'border-studio-700 bg-black/20 hover:border-studio-500'}`}
              >
                <span className="block text-xs font-black uppercase">{item.label}</span>
                <span className="mt-1 block text-[11px] text-studio-400">{item.note}</span>
              </button>
            ))}
          </aside>

          <div className="h-[72vh] min-h-[560px] overflow-hidden rounded-2xl border border-studio-700 bg-[#070a0f]">
            <Canvas
              camera={{ position: CAMERA_PRESETS[preset].position, fov: 38, near: 0.1, far: 60 }}
              dpr={[1, 1.5]}
              shadows
              gl={{ antialias: true, powerPreference: 'high-performance' }}
              onCreated={({ gl }) => {
                gl.toneMapping = THREE.ACESFilmicToneMapping;
                gl.toneMappingExposure = 1.02;
              }}
            >
              <ReviewScene
                mode={mode}
                liveryId={liveryId}
                preset={preset}
                inspection={inspection}
                onLegacyReady={onLegacyReady}
                statsRef={statsRef}
              />
            </Canvas>
          </div>

          <aside className="space-y-4 rounded-2xl border border-studio-800 bg-studio-900/80 p-3">
            <div>
              <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-studio-300">
                G03 inspection
              </h2>
              <div className="mt-2 grid grid-cols-2 gap-1.5">
                {(['diffuse', 'reflective', 'wireframe'] as const).map((value) => (
                  <button
                    key={value}
                    type="button"
                    data-review-inspection={value}
                    onClick={() => setInspection(value)}
                    className={`rounded-lg border px-2 py-2 text-[10px] font-bold uppercase ${inspection === value ? 'border-cyan-400 bg-cyan-400/10 text-cyan-200' : 'border-studio-700 bg-black/20 text-studio-300'}`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-studio-300">
                EDS skin
              </h2>
              <div className="mt-2 space-y-1.5">
                {EDS_LIVERY_IDS.map((id) => (
                  <button
                    key={id}
                    type="button"
                    data-review-livery={id}
                    onClick={() => setLiveryId(id)}
                    className={`flex w-full items-center gap-2 rounded-lg border px-2.5 py-2 text-left text-xs ${liveryId === id ? 'border-cyan-400 bg-cyan-400/10' : 'border-studio-700 bg-black/20'}`}
                  >
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ background: EDS_LIVERIES[id].accent }}
                    />
                    {EDS_LIVERIES[id].name}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-studio-300">
                Matched camera
              </h2>
              <div className="mt-2 grid grid-cols-2 gap-1.5">
                {(Object.keys(CAMERA_PRESETS) as CameraPreset[]).map((view) => (
                  <button
                    key={view}
                    type="button"
                    data-review-view={view}
                    onClick={() => setPreset(view)}
                    className={`rounded-lg border px-2 py-2 text-[10px] font-bold uppercase ${preset === view ? 'border-amber-400 bg-amber-400/10 text-amber-200' : 'border-studio-700 bg-black/20 text-studio-300'}`}
                  >
                    {view.replace(/-/g, ' ')}
                  </button>
                ))}
              </div>
            </div>
            {legacyStats && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3 font-mono text-[10px] uppercase text-emerald-200">
                Geometry shared: {legacyStats.sharedGeometryCount}/{legacyStats.meshCount}
                <br />
                Owned runtime textures: {legacyStats.ownedTextureCount}
              </div>
            )}
          </aside>
        </section>
      </div>
    </main>
  );
};

useGLTF.preload('/models/eds-g01.glb');
useGLTF.preload('/models/eds-g02.glb');
useGLTF.preload('/models/eds-g03-preview.glb');
