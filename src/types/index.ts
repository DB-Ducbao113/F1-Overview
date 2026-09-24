export type CarId =
  | 'w15'
  | 'sf24'
  | 'mcl38'
  | 'rb20'
  | 'racingbulls'
  | 'alpine'
  | 'haas'
  | 'audi'
  | 'williams'
  | 'astonmartin'
  | 'cadillac';

export type NavTab = 'home' | 'models' | 'compare' | 'gallery';

export type ViewMode = 'showroom' | 'xray' | 'aero';

export type CameraPreset = 'isometric' | 'front' | 'side' | 'top' | 'floor' | 'rear';

export interface CarSpecs {
  id: CarId;
  name: string;
  shortName: string;
  team: string;
  drivers: string[];
  year: number;
  engine: string;
  designer: string;
  primaryColor: string;
  accentColor: string;
  highlightColor: string;
  weightKg: number;
  horsepower: number;
  topSpeedKmh: number;
  zeroToHundredSec: number;
  downforceAt250KmhKgf: number;
  dragCoefficient: number;
  suspensionFront: string;
  suspensionRear: string;
  aeroPhilosophy: string;
  description: string;
  groundEffectNotes: string;
  image: string;
}

export interface AnatomyPart {
  id: string;
  name: string;
  vietnameseName: string;
  category: 'aerodynamics' | 'safety' | 'powertrain' | 'chassis' | 'suspension';
  material: string;
  weightKg: number;
  explodedOffset: [number, number, number]; // [x, y, z] in meters
  description: string;
  technicalRole: string;
}
