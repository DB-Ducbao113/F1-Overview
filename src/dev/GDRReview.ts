import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

const query = new URLSearchParams(location.search);
const region = query.get('region') ?? 'diffuser';
const modelScale = Number(query.get('scale') ?? '1');
const modelRotationY = Number(query.get('rotationY') ?? '0');
const mode =
  query.get('mode') === 'reflective'
    ? 'reflective'
    : query.get('mode') === 'wireframe'
      ? 'wireframe'
      : 'diffuse';
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setSize(900, 650);
renderer.setPixelRatio(1);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color('#090d13');
scene.add(new THREE.HemisphereLight('#e8f3ff', '#56606b', 2.5));
scene.add(new THREE.AmbientLight('#dce8f1', 1.1));
const key = new THREE.DirectionalLight('#ffffff', 3.1);
key.position.set(1.5, 3.5, 2.3);
scene.add(key);
const rim = new THREE.DirectionalLight('#9ecfe5', 1.5);
rim.position.set(-2.5, 1.7, -2.5);
scene.add(rim);

const camera = new THREE.PerspectiveCamera(38, 900 / 650, 0.05, 30);
const revision7Views: Record<string, { position: [number, number, number]; target: [number, number, number] }> = {
  'design-front-three-quarter': { position: [4.8, 1.95, -4.85], target: [0, 0.42, 0] },
  'design-side': { position: [7.2, 1.35, 0], target: [0, 0.38, 0] },
  'design-top': { position: [0, 9.3, 0], target: [0, 0.25, 0] },
  'design-front': { position: [0, 1.15, -6.6], target: [0, 0.42, -0.25] },
  'design-rear': { position: [0, 1.1, 6.6], target: [0, 0.43, 0.3] },
  'design-rear-three-quarter': { position: [-4.8, 1.8, 4.8], target: [0, 0.4, 0.35] },
  'full-front-three-quarter': { position: [4.8, 1.95, -4.85], target: [0, 0.42, 0] },
  'full-side': { position: [7.2, 1.35, 0], target: [0, 0.38, 0] },
  'full-rear-three-quarter': { position: [-4.8, 1.8, 4.8], target: [0, 0.4, 0.35] },
  'diffuser-outlet': { position: [0, 0.28, 2.82], target: [0, 0.27, 2.22] },
  'halo-front-mount': { position: [0.66, 0.85, -1.05], target: [0, 0.65, -0.65] },
  'halo-rear-left': { position: [-0.86, 0.93, 0.58], target: [-0.26, 0.66, 0.12] },
  'halo-rear-right': { position: [0.86, 0.93, 0.58], target: [0.26, 0.66, 0.12] },
  'halo-upper-t': { position: [0.43, 1.13, -0.12], target: [0, 0.895, -0.5] },
  'sidepod-regression': { position: [1.18, 0.86, -1.08], target: [0.45, 0.45, -0.18] },
};
if (revision7Views[region]) {
  camera.position.set(...revision7Views[region].position);
  camera.lookAt(...revision7Views[region].target);
} else if (region === 'diffuser-r7-rear') {
  camera.position.set(0, 0.20, 3.35);
  camera.lookAt(0, 0.24, 2.04);
} else if (region === 'diffuser-r7-under') {
  camera.position.set(0.42, 0.08, 2.92);
  camera.lookAt(0, 0.25, 1.97);
} else if (region === 'halo-r7-rear') {
  camera.position.set(-1.12, 1.02, 0.91);
  camera.lookAt(-0.26, 0.68, 0.12);
} else if (region === 'halo-r7-side') {
  camera.position.set(-1.05, 0.86, -0.62);
  camera.lookAt(-0.26, 0.68, 0.12);
} else if (region === 'diffuser-rev6') {
  camera.position.set(0.46, 0.24, 3.12);
  camera.lookAt(0, 0.26, 2.12);
} else if (region === 'halo-upper') {
  camera.position.set(0.43, 1.13, -0.12);
  camera.lookAt(0, 0.895, -0.5);
} else if (region === 'diffuser') {
  camera.position.set(0.6, 0.29, 4.15);
  camera.lookAt(0, 0.27, 1.8);
} else {
  camera.position.set(1.16, 1.26, 1.35);
  camera.lookAt(0.2, 0.67, 0.03);
}

const materials: THREE.Material[] = [];
const loader = new GLTFLoader();
loader.setMeshoptDecoder(MeshoptDecoder);
loader.load(
  '/gdr-prototype.glb',
  ({ scene: model }) => {
    model.scale.setScalar(Number.isFinite(modelScale) ? modelScale : 1);
    model.rotation.y = Number.isFinite(modelRotationY) ? modelRotationY : 0;
    model.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      const material =
        mode === 'wireframe'
          ? new THREE.MeshBasicMaterial({
              color: '#b0edfc',
              wireframe: true,
              side: THREE.DoubleSide,
            })
          : mode === 'diffuse'
            ? new THREE.MeshLambertMaterial({ color: '#b4c2cb', side: THREE.DoubleSide })
            : new THREE.MeshPhongMaterial({
                color: object.name.includes('tube') ? '#9faeb9' : '#c2d0d8',
                specular: '#e5f1fa',
                shininess: 78,
                emissive: '#303a42',
                side: THREE.DoubleSide,
              });
      materials.push(material);
      object.material = material;
    });
    scene.add(model);
    renderer.render(scene, camera);
    (window as Window & { __gdrReady?: boolean; __gdrStats?: unknown }).__gdrReady = true;
    (window as Window & { __gdrReady?: boolean; __gdrStats?: unknown }).__gdrStats = {
      calls: renderer.info.render.calls,
      triangles: renderer.info.render.triangles,
      geometries: renderer.info.memory.geometries,
      textures: renderer.info.memory.textures,
    };
  },
  undefined,
  (error) => {
    console.error('GDR prototype load failure', error);
  },
);

window.addEventListener('beforeunload', () => {
  materials.forEach((material) => material.dispose());
  renderer.dispose();
});
