import * as fs from 'fs';
const c = fs.readFileSync('src/components/showroom/F1Car3DModel.tsx', 'utf8');
console.log('Has useShowroomTextureSet:', c.includes('useShowroomTextureSet'));
console.log('Has acquireSet:', c.includes('acquireSet'));
console.log('Has import from showroomTextureCache:', c.includes("from './showroomTextureCache'"));
console.log('Has F1_HOTSPOTS:', c.includes('F1_HOTSPOTS'));
console.log('Has Html import:', c.includes("from '@react-three/drei'"));
console.log('File length:', c.length);
console.log('Has useShowroomTextureSet call:', c.includes('useShowroomTextureSet('));