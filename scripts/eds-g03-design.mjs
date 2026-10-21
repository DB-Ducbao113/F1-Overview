// EDS-G03 independently authored hardpoint registry. Units are metres.
// Native authoring coordinates: +Y up, -Z front/nose, +Z rear, +/-X left/right.
export const EDS_G03_DESIGN = Object.freeze({
  id: 'EDS-G03',
  revision: 'R3.2-primary-surfaces-1',
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
      width: 0.48,
      sillY: 0.59,
    },
    halo: {
      frontMount: [0, 0.65, -0.65],
      rearMounts: [
        [-0.26, 0.66, 0.12],
        [0.26, 0.66, 0.12],
      ],
      top: [0, 0.94, -0.46],
    },
    sidepods: {
      inletCenters: [
        [-0.46, 0.47, -0.38],
        [0.46, 0.47, -0.38],
      ],
      envelope: { x: [-0.66, 0.66], y: [0.22, 0.63], z: [-0.55, 1.22] },
    },
    floor: {
      startZ: -1.08,
      endZ: 2.3,
      maxHalfWidth: 0.68,
      rearHalfWidth: 0.58,
      shellThickness: 0.065,
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
      span: 1.36,
      root: [0, 0.91, 2.1],
      envelope: { x: [-0.68, 0.68], y: [0.82, 1.18], z: [2.06, 2.45] },
    },
    diffuser: {
      inlet: { width: 1.12, y: 0.08, z: 1 },
      exit: { width: 1.16, y: 0.34, z: 2.3 },
    },
  },
  futureHotspots: {
    wings: [0, 0.22, -2.42],
    drs: [0, 1.03, 2.18],
    power_unit: [0, 0.58, 0.82],
    halo: [0, 0.9, -0.38],
    sidepods: [0.56, 0.45, 0.16],
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
    'front-three-quarter': { position: [4.8, 1.95, -4.85], target: [0, 0.42, 0] },
    side: { position: [7.2, 1.35, 0], target: [0, 0.38, 0] },
    top: { position: [0.01, 7.8, 0], target: [0, 0.15, 0] },
    front: { position: [0, 0.95, -6.25], target: [0, 0.32, -0.75] },
    rear: { position: [0, 1.05, 6.25], target: [0, 0.38, 0.7] },
    'rear-three-quarter': { position: [-4.8, 1.8, 4.8], target: [0, 0.4, 0.35] },
  },
  originalDesignMarkers: [
    'low split-keel nose with a shallow centre valley',
    'crescent sidepod inlet and falling outer shoulder',
    'twin-ridge engine cover taper around a compact airbox',
    'forward-swept front-wing tips with clipped pentagonal endplates',
    'continuous floor edge rising into a twin-channel diffuser exit',
  ],
  revisionHistory: {
    baselineCommit: 'c182a66',
    baselineRevision: 'R3.1-blockout-1',
    decision: 'OWNER GATE 1 REVISE',
    lockedWithoutChange: [
      'overall dimensions',
      'front and rear axle stations',
      'wheelbase',
      'front and rear track',
      'wheel radii and widths',
      'ground plane',
      'front wing envelope',
    ],
    gate1Approval: {
      baselineCommit: '0808b72',
      decision: 'GO',
      approvedRevision: 'R3.1-revision-1',
    },
  },
  surfaceAuthoring: {
    workflow: 'deterministic spline and connected cross-section lofts',
    bodyRadialSegments: 56,
    bodyAxialSegments: 144,
    sidepodRadialSegments: 44,
    sidepodAxialSegments: 88,
    wingSpanSegments: 48,
    wingChordSegments: 18,
    inspectionMaterials: ['neutral-diffuse', 'subtle-reflective'],
  },
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
