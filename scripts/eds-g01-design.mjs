export const EDS_G01_DESIGN = Object.freeze({
  id: 'EDS-G01',
  revision: 'M2-P2-R1',
  length: 5.05,
  width: 2.0,
  wheelbase: 3.6,
  frontAxleZ: -1.75,
  rearAxleZ: 1.85,
  frontTrack: 1.78,
  rearTrack: 1.72,
  frontWheelRadius: 0.36,
  rearWheelRadius: 0.38,
  designLanguage: [
    'split-keel spear nose',
    'hexagonal cockpit opening',
    'twin delta Venturi shoulders',
    'compact teardrop sidepods',
    'bridge-supported rear wing',
  ],
});

export const EDS_G01_PARTS = Object.freeze({
  wings: { code: 'EDS-AERO-FW04', focus: [0, 0.25, -2.28] },
  drs: { code: 'EDS-AERO-RW02', focus: [0, 0.92, 2.2] },
  power_unit: { code: 'EDS-PU-HYB01', focus: [0, 0.58, 0.72] },
  halo: { code: 'EDS-SAFE-H01', focus: [0, 0.82, -0.28] },
  sidepods: { code: 'EDS-THERM-SP02', focus: [0.62, 0.42, 0.2] },
  tires: { code: 'EDS-CHASSIS-W18', focus: [0.89, 0.36, -1.75] },
  floor: { code: 'EDS-AERO-VT02', focus: [0, 0.16, 1.45] },
});
