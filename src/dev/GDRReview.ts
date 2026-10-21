import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const query = new URLSearchParams(location.search);
const region = query.get('region') ?? 'diffuser';
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
if (region === 'diffuser-rev6') {
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
loader.load(
  '/gdr-prototype.glb',
  ({ scene: model }) => {
    model.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      object.geometry.computeVertexNormals();
      const material =
        mode === 'wireframe'
          ? new THREE.MeshBasicMaterial({
              color: '#b0edfc',
              wireframe: true,
              side: THREE.DoubleSide,
            })
          : mode === 'diffuse'
            ? new THREE.MeshBasicMaterial({ color: '#b4c2cb', side: THREE.DoubleSide })
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
