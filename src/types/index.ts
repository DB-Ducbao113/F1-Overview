export type CarId = 'rb20' | 'sf24' | 'mcl38';

export type ViewMode = 'showroom' | 'xray' | 'aero';

export type CameraPreset = 'isometric' | 'front' | 'side' | 'top' | 'floor' | 'rear';

export interface CarSpecs {
  id: CarId;
  name: string;
  team: string;
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
  description: string;
  groundEffectNotes: string;
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
