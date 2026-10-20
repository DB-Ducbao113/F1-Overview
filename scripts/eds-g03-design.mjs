// EDS-G03 independently authored hardpoint registry. Units are metres.
// Native authoring coordinates: +Y up, -Z front/nose, +Z rear, +/-X left/right.
export const EDS_G03_DESIGN = Object.freeze({
  id: 'EDS-G03',
  revision: 'R3.1-blockout-1',
  units: 'metres',
  coordinateSystem: {
    up: '+Y',
    front: '-Z',
    rear: '+Z',
    centerline: 'X=0',
    groundPlaneY: 0,
  },
  dimensions: {
    length: 5.05,
    width: 2.0,
    height: 1.18,
    bounds: {
      min: [-1, 0, -2.6],
      max: [1, 1.18, 2.45],
    },
  },
  axles: {
    frontZ: -1.75,
    rearZ: 1.85,
    wheelbase: 3.6,
    frontTrack: 1.78,
    rearTrack: 1.72,
  },
  wheels: {
    front: { radius: 0.36, width: 0.22, centerY: 0.36 },
    rear: { radius: 0.38, width: 0.28, centerY: 0.38 },
  },
  overhangs: {
    front: 0.85,
    rear: 0.6,
  },
  landmarks: {
    noseTip: [0, 0.3, -2.48],
    monocoqueShoulders: [
      [-0.34, 0.55, -0.72],
      [0.34, 0.55, -0.72],
    ],
    cockpitOpening: {
      frontZ: -0.58,
      rearZ: 0.28,
      width: 0.52,
      sillY: 0.62,
    },
    halo: {
      frontMount: [0, 0.66, -0.68],
      rearMounts: [
        [-0.3, 0.67, 0.15],
        [0.3, 0.67, 0.15],
      ],
      top: [0, 1.08, -0.3],
    },
    sidepods: {
      inletCenters: [
        [-0.51, 0.49, -0.43],
        [0.51, 0.49, -0.43],
      ],
      envelope: { x: [-0.76, 0.76], y: [0.2, 0.73], z: [-0.62, 1.18] },
    },
    airbox: [0, 0.95, 0.5],
    engineCoverTaper: [0, 0.43, 1.57],
    suspensionStations: {
      frontInner: [0.3, 0.43, -1.75],
      rearInner: [0.32, 0.45, 1.85],
    },
    frontWing: {
      span: 2.0,
      root: [0, 0.15, -2.46],
      envelope: { x: [-1, 1], y: [0.08, 0.34], z: [-2.6, -2.2] },
    },
    rearWing: {
      span: 1.48,
      root: [0, 0.9, 2.08],
      envelope: { x: [-0.74, 0.74], y: [0.7, 1.18], z: [1.98, 2.45] },
    },
    diffuser: {
      inlet: { width: 1.18, y: 0.08, z: 0.95 },
      exit: { width: 1.32, y: 0.36, z: 2.3 },
    },
  },
  futureHotspots: {
    wings: [0, 0.22, -2.42],
    drs: [0, 1.03, 2.18],
    power_unit: [0, 0.58, 0.82],
    halo: [0, 0.98, -0.3],
    sidepods: [0.65, 0.5, 0.16],
    tires: [0.89, 0.36, -1.75],
    floor: [0, 0.13, 1.2],
  },
  showroomCameras: {
    hero: { position: [4.1, 1.7, -4.15], target: [0, 0.42, 0], fov: 38 },
    side: { position: [5.45, 1.15, 0], target: [0, 0.38, 0], fov: 38 },
    top: { position: [0.01, 6.7, 0], target: [0, 0.15, 0], fov: 38 },
    rear: { position: [-4.15, 1.55, 4.1], target: [0, 0.4, 0.35], fov: 38 },
  },
  standardizedReviewCameras: {
    'front-three-quarter': { position: [4.1, 1.7, -4.15], target: [0, 0.42, 0] },
    side: { position: [5.45, 1.15, 0], target: [0, 0.38, 0] },
    top: { position: [0.01, 6.7, 0], target: [0, 0.15, 0] },
    front: { position: [0, 0.82, -5.25], target: [0, 0.32, -0.75] },
    rear: { position: [0, 0.94, 5.25], target: [0, 0.38, 0.7] },
    'rear-three-quarter': { position: [-4.15, 1.55, 4.1], target: [0, 0.4, 0.35] },
  },
  originalDesignMarkers: [
    'low split-keel nose with a shallow centre valley',
    'crescent sidepod inlet and falling outer shoulder',
    'twin-ridge engine cover taper around a compact airbox',
    'forward-swept front-wing tips with clipped pentagonal endplates',
    'continuous floor edge rising into a twin-channel diffuser exit',
  ],
});

export function getEDS_G03TargetRatios() {
  const { dimensions, axles, wheels } = EDS_G03_DESIGN;
  return {
    wheelbaseToLength: axles.wheelbase / dimensions.length,
    widthToLength: dimensions.width / dimensions.length,
    frontWheelDiameterToLength: (2 * wheels.front.radius) / dimensions.length,
    rearWheelDiameterToLength: (2 * wheels.rear.radius) / dimensions.length,
  };
}
