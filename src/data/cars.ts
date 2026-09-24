import { CarSpecs } from '../types';

export const CARS_DATA: Record<string, CarSpecs> = {
  rb20: {
    id: 'rb20',
    name: 'Red Bull RB20',
    team: 'Oracle Red Bull Racing',
    year: 2024,
    engine: 'Honda RBPTH002 1.6L V6 Turbo Hybrid',
    designer: 'Adrian Newey & Pierre Waché',
    primaryColor: '#0a192f', // Midnight matte navy
    accentColor: '#e10600',  // F1 Bull Red
    highlightColor: '#f59e0b', // Yellow nose ring
    weightKg: 798,
    horsepower: 1055,
    topSpeedKmh: 352,
    zeroToHundredSec: 2.3,
    downforceAt250KmhKgf: 1850,
    dragCoefficient: 0.74,
    description: 'Chiếc xe đỉnh cao của Adrian Newey với hốc lấy gió thẳng đứng (vertical inlet) triệt để và gờ thoát khí phình cao (shark gulley) tối ưu hóa luồng khí ra cánh đuôi.',
    groundEffectNotes: 'Kênh Venturi dưới sàn xe tạo ra hơn 60% tổng lực nén (downforce) mà không gây lực cản quá lớn, kết hợp với các cánh chia gió mép sàn (floor edge wings) kiểm soát hiện tượng cuộn khí bẩn từ bánh xe.'
  },
  sf24: {
    id: 'sf24',
    name: 'Ferrari SF-24',
    team: 'Scuderia Ferrari',
    year: 2024,
    engine: 'Ferrari 066/12 1.6L V6 Turbo Hybrid',
    designer: 'Enrico Cardile & Diego Tondi',
    primaryColor: '#c80000', // Corsa Red
    accentColor: '#ffffff',  // Bianco White
    highlightColor: '#ffdd00', // Modena Yellow accents
    weightKg: 798,
    horsepower: 1048,
    topSpeedKmh: 350,
    zeroToHundredSec: 2.4,
    downforceAt250KmhKgf: 1810,
    dragCoefficient: 0.76,
    description: 'Thiết kế lột xác của Ferrari với cấu trúc treo sau pull-rod được tinh chỉnh, giảm đáng kể hiện tượng nảy gầm (porpoising) và mang lại cửa sổ vận hành lốp cực rộng.',
    groundEffectNotes: 'Sàn xe SF-24 có hình học Venturi dốc dần đều về phía bộ khuếch tán sau (diffuser), tạo lực ép ổn định ngay cả khi xe đổi hướng đột ngột ở góc cua tốc độ cao.'
  },
  mcl38: {
    id: 'mcl38',
    name: 'McLaren MCL38',
    team: 'McLaren Formula 1 Team',
    year: 2024,
    engine: 'Mercedes-AMG F1 M15 E Performance',
    designer: 'Rob Marshall & Peter Prodromou',
    primaryColor: '#ff8000', // Papaya Orange
    accentColor: '#161616',  // Anthracite Carbon
    highlightColor: '#00f0ff', // Cyber Teal trim
    weightKg: 798,
    horsepower: 1050,
    topSpeedKmh: 351,
    zeroToHundredSec: 2.35,
    downforceAt250KmhKgf: 1880,
    dragCoefficient: 0.73,
    description: 'Cỗ máy nhanh nhất nửa sau mùa giải 2024. Sở hữu hiệu suất khí động học cực kỳ cân bằng ở mọi dải tốc độ nhờ thiết kế mép sàn xe nhiều tầng đột phá.',
    groundEffectNotes: 'Hệ thống rãnh hút gió mép sàn tạo ra một "bức tường khí nén" (air curtain) ngăn luồng khí nhiễu từ lốp sau tràn vào hầm Venturi, giữ áp suất âm cực sâu.'
  }
};
