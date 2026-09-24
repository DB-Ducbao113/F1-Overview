import { CarSpecs } from '../types';

export const CARS_DATA: Record<string, CarSpecs> = {
  w15: {
    id: 'w15',
    name: 'Mercedes-AMG F1 W15 E Performance',
    shortName: 'W15',
    team: 'Mercedes-AMG Petronas F1 Team',
    drivers: ['George Russell #63', 'Kimi Antonelli #12'],
    year: 2025,
    engine: 'Mercedes-AMG M15 1.6L V6 Turbo Hybrid',
    designer: 'James Allison & John Owen',
    primaryColor: '#00a19c', // Petronas Emerald Cyan
    accentColor: '#c0c0c0',  // Silver Arrow Liquid Silver
    highlightColor: '#eb142b', // Ineos Red
    weightKg: 798,
    horsepower: 1055,
    topSpeedKmh: 352,
    zeroToHundredSec: 2.3,
    downforceAt250KmhKgf: 1840,
    dragCoefficient: 0.73,
    suspensionFront: 'Push-rod',
    suspensionRear: 'Push-rod',
    aeroPhilosophy: 'Mũi vuốt nhọn (Arrow Nose) + Sàn Venturi ổn định cao',
    description: 'Thân xe thế hệ mới tối ưu luồng khí và loại bỏ zeropod, đem lại độ cân bằng khí động học vượt trội ở tốc độ cao.',
    groundEffectNotes: 'Hầm Venturi đáy sàn xe triệt tiêu hiện tượng nảy gầm porpoising, duy trì lực ép liên tục.',
    image: '/images/teams/w15.jpg'
  },
  sf24: {
    id: 'sf24',
    name: 'Ferrari SF-24',
    shortName: 'SF-24',
    team: 'Scuderia Ferrari HP',
    drivers: ['Charles Leclerc #16', 'Lewis Hamilton #44'],
    year: 2025,
    engine: 'Ferrari 066/12 1.6L V6 Turbo Hybrid',
    designer: 'Enrico Cardile & Diego Tondi',
    primaryColor: '#e80020', // Scuderia Corsa Red
    accentColor: '#ffffff',  // Bianco White
    highlightColor: '#ffe500', // Modena Yellow
    weightKg: 798,
    horsepower: 1050,
    topSpeedKmh: 351,
    zeroToHundredSec: 2.4,
    downforceAt250KmhKgf: 1820,
    dragCoefficient: 0.75,
    suspensionFront: 'Push-rod',
    suspensionRear: 'Pull-rod',
    aeroPhilosophy: 'Máng trượt Scalloped Sidepod + Dầm cánh beam wing',
    description: 'Thân xe đỏ Rosso Corsa với rãnh máng trượt khí động học, dẫn luồng khí sạch trực tiếp tới cánh sau.',
    groundEffectNotes: 'Sàn Venturi dốc đều về bộ khuếch tán sau, giữ lực ép ổn định khi xe vào góc cua tốc độ cao.',
    image: '/images/teams/sf24.jpg'
  },
  mcl38: {
    id: 'mcl38',
    name: 'McLaren MCL38',
    shortName: 'MCL38',
    team: 'McLaren Formula 1 Team',
    drivers: ['Lando Norris #4', 'Oscar Piastri #81'],
    year: 2025,
    engine: 'Mercedes-AMG M15 1.6L V6 Turbo Hybrid',
    designer: 'Rob Marshall & Peter Prodromou',
    primaryColor: '#ff8000', // Papaya Orange
    accentColor: '#47c7fc',  // Neon Cyan Aero
    highlightColor: '#141416', // Carbon Black
    weightKg: 798,
    horsepower: 1052,
    topSpeedKmh: 350,
    zeroToHundredSec: 2.3,
    downforceAt250KmhKgf: 1860,
    dragCoefficient: 0.72,
    suspensionFront: 'Pull-rod',
    suspensionRear: 'Push-rod',
    aeroPhilosophy: 'Thắt eo Coke-Bottle sâu + Sợi carbon trần siêu nhẹ',
    description: 'Cỗ máy vô địch phân hạng với màu cam Papaya và hông xe carbon trần, đạt lực nén vượt trội trên mọi trường đua.',
    groundEffectNotes: 'Sàn xe thích ứng dải rộng, duy trì độ bám đường đỉnh cao từ cua chậm đến cua tốc độ cao.',
    image: '/images/teams/mcl38.jpg'
  },
  rb20: {
    id: 'rb20',
    name: 'Red Bull Racing RB20',
    shortName: 'RB20',
    team: 'Oracle Red Bull Racing',
    drivers: ['Max Verstappen #1', 'Isack Hadjar #6'],
    year: 2025,
    engine: 'Honda RBPTH002 1.6L V6 Turbo Hybrid',
    designer: 'Adrian Newey & Pierre Waché',
    primaryColor: '#0600ef', // Matte Navy Blue
    accentColor: '#cc1e4a',  // Crimson Bull Red
    highlightColor: '#fcd700', // Racing Yellow
    weightKg: 798,
    horsepower: 1055,
    topSpeedKmh: 353,
    zeroToHundredSec: 2.3,
    downforceAt250KmhKgf: 1870,
    dragCoefficient: 0.71,
    suspensionFront: 'Pull-rod',
    suspensionRear: 'Push-rod',
    aeroPhilosophy: 'Hốc gió Overbite + Cặp kênh thoát nhiệt kép',
    description: 'Kiệt tác khí động học với hốc gió đảo ngược Overbite độc đáo và hệ thống làm mát tích hợp tối ưu lực cản.',
    groundEffectNotes: 'Ống Venturi tạo hơn 60% lực nén với lực cản cực thấp, kiểm soát hoàn hảo luồng khí nhiễu từ lốp xe.',
    image: '/images/teams/rb20.jpg'
  },
  racingbulls: {
    id: 'racingbulls',
    name: 'Visa Cash App RB VCARB 02',
    shortName: 'VCARB',
    team: 'Visa Cash App RB F1 Team',
    drivers: ['Liam Lawson #30', 'Arvid Lindblad #41'],
    year: 2025,
    engine: 'Honda RBPTH002 1.6L V6 Turbo Hybrid',
    designer: 'Jody Egginton & Laurent Mekies',
    primaryColor: '#6692ff', // Metallic Racing Blue
    accentColor: '#ffffff',  // Gloss White
    highlightColor: '#d90429', // Bull Red
    weightKg: 798,
    horsepower: 1045,
    topSpeedKmh: 348,
    zeroToHundredSec: 2.4,
    downforceAt250KmhKgf: 1780,
    dragCoefficient: 0.75,
    suspensionFront: 'Pull-rod',
    suspensionRear: 'Push-rod',
    aeroPhilosophy: 'Hốc gió thuôn dài + Khung gầm đồng bộ Red Bull',
    description: 'Sắc xanh hoàng gia kim loại nổi bật, ứng dụng cơ cấu treo pull-rod đồng bộ với đội đua mẹ Red Bull.',
    groundEffectNotes: 'Sàn xe thiết kế cho sự ổn định ở dải tốc độ trung bình, giúp tay đua làm chủ khúc cua kỹ thuật.',
    image: '/images/teams/racingbulls.jpg'
  },
  alpine: {
    id: 'alpine',
    name: 'Alpine A525',
    shortName: 'A525',
    team: 'BWT Alpine F1 Team',
    drivers: ['Pierre Gasly #10', 'Franco Colapinto #43'],
    year: 2025,
    engine: 'Renault E-Tech RE25 1.6L V6 Turbo Hybrid',
    designer: 'David Sanchez & Oliver Oakes',
    primaryColor: '#0090ff', // Alpine Electric Blue
    accentColor: '#ff87bc',  // BWT Pink
    highlightColor: '#111827', // Obsidian Carbon
    weightKg: 798,
    horsepower: 1040,
    topSpeedKmh: 347,
    zeroToHundredSec: 2.4,
    downforceAt250KmhKgf: 1770,
    dragCoefficient: 0.76,
    suspensionFront: 'Push-rod',
    suspensionRear: 'Push-rod',
    aeroPhilosophy: 'Cánh gió mở rộng + Cửa thoát nhiệt tối ưu',
    description: 'Thiết kế phối màu xanh Alpine và hồng BWT, tập trung mở rộng cánh gió trước và tối ưu nhiệt độ động cơ.',
    groundEffectNotes: 'Kênh dẫn khí gầm ưu tiên lực nén trên đường thẳng dài và hạn chế chao đảo khi phanh dốc.',
    image: '/images/teams/alpine.jpg'
  },
  haas: {
    id: 'haas',
    name: 'Haas VF-25',
    shortName: 'VF-25',
    team: 'MoneyGram Haas F1 Team',
    drivers: ['Esteban Ocon #31', 'Oliver Bearman #87'],
    year: 2025,
    engine: 'Ferrari 066/12 1.6L V6 Turbo Hybrid',
    designer: 'Andrea De Zordo & Ayao Komatsu',
    primaryColor: '#b6babd', // Slate Silver
    accentColor: '#e6002b',  // Haas Racing Red
    highlightColor: '#18181b', // Carbon Black
    weightKg: 798,
    horsepower: 1045,
    topSpeedKmh: 349,
    zeroToHundredSec: 2.4,
    downforceAt250KmhKgf: 1790,
    dragCoefficient: 0.74,
    suspensionFront: 'Push-rod',
    suspensionRear: 'Pull-rod',
    aeroPhilosophy: 'Sidepod hạ thấp + Rãnh chia khí sàn carbon cứng',
    description: 'Đại diện nước Mỹ trang bị động cơ Ferrari mạnh mẽ, thiết kế thu gọn thân xe nhằm tối đa hóa tốc độ.',
    groundEffectNotes: 'Rãnh chia khí cạnh sàn carbon cứng, duy trì áp suất âm gầm xe ổn định ngay cả khi chém gờ kerb.',
    image: '/images/teams/haas.jpg'
  },
  audi: {
    id: 'audi',
    name: 'Audi F1 R26 (Sauber C45)',
    shortName: 'R26',
    team: 'Audi F1 Team',
    drivers: ['Nico Hülkenberg #27', 'Gabriel Bortoleto #5'],
    year: 2025,
    engine: 'Audi Sport F1 1.6L V6 Turbo Hybrid',
    designer: 'Mattia Binotto & James Key',
    primaryColor: '#f50537', // Audi Sport Red
    accentColor: '#e5e7eb',  // Brushed Aluminium
    highlightColor: '#1c1917', // Carbon Black
    weightKg: 798,
    horsepower: 1048,
    topSpeedKmh: 350,
    zeroToHundredSec: 2.3,
    downforceAt250KmhKgf: 1810,
    dragCoefficient: 0.73,
    suspensionFront: 'Push-rod',
    suspensionRear: 'Push-rod',
    aeroPhilosophy: 'Khí động học nguyên khối Vorprung Durch Technik',
    description: 'Kỷ nguyên mới của Audi tại F1 với kết cấu nguyên khối chính xác của kỹ thuật Đức và thân xe bạc đỏ thể thao.',
    groundEffectNotes: 'Đường hầm Venturi kép cân bằng hoàn hảo giữa lực nén và độ êm ái khi vượt khúc cua gắt.',
    image: '/images/teams/audi.jpg'
  },
  williams: {
    id: 'williams',
    name: 'Williams FW47',
    shortName: 'FW47',
    team: 'Williams Racing',
    drivers: ['Carlos Sainz #55', 'Alexander Albon #23'],
    year: 2025,
    engine: 'Mercedes-AMG M15 1.6L V6 Turbo Hybrid',
    designer: 'Pat Fry & James Vowles',
    primaryColor: '#00a0de', // Electric Blue
    accentColor: '#041e42',  // Heritage Navy
    highlightColor: '#22c55e', // Neon Flow
    weightKg: 798,
    horsepower: 1052,
    topSpeedKmh: 354,
    zeroToHundredSec: 2.3,
    downforceAt250KmhKgf: 1800,
    dragCoefficient: 0.70,
    suspensionFront: 'Push-rod',
    suspensionRear: 'Push-rod',
    aeroPhilosophy: 'Hệ số cản thấp + Tối ưu hóa hiệu suất DRS',
    description: 'Vua tốc độ đường thẳng với hệ số cản thấp nhất giải đấu, phát huy tối đa sức mạnh động cơ Mercedes.',
    groundEffectNotes: 'Hình học sàn xe Venturi giải phóng lực nén tối ưu khi mở DRS, bứt phá thần tốc tại các đoạn thẳng dài.',
    image: '/images/teams/williams.jpg'
  },
  astonmartin: {
    id: 'astonmartin',
    name: 'Aston Martin AMR25',
    shortName: 'AMR25',
    team: 'Aston Martin Aramco F1 Team',
    drivers: ['Fernando Alonso #14', 'Lance Stroll #18'],
    year: 2025,
    engine: 'Mercedes-AMG M15 1.6L V6 Turbo Hybrid',
    designer: 'Dan Fallows & Adrian Newey',
    primaryColor: '#229971', // British Racing Green
    accentColor: '#cedc00',  // Neon Lime
    highlightColor: '#0b1311', // Emerald Dark
    weightKg: 798,
    horsepower: 1050,
    topSpeedKmh: 351,
    zeroToHundredSec: 2.4,
    downforceAt250KmhKgf: 1835,
    dragCoefficient: 0.73,
    suspensionFront: 'Push-rod',
    suspensionRear: 'Push-rod',
    aeroPhilosophy: 'Màu xanh lục Racing Green + Máng dốc sidepod sâu',
    description: 'Cỗ máy quý tộc Anh Quốc được dẫn dắt bởi Fernando Alonso, nổi bật với màu xanh ngọc và máng gió dốc sâu.',
    groundEffectNotes: 'Kênh Venturi hạn chế sự thay đổi tâm áp suất khí động học khi xe nhún gầm hoặc đổi hướng.',
    image: '/images/teams/astonmartin.jpg'
  },
  cadillac: {
    id: 'cadillac',
    name: 'Cadillac F1 CT6-R',
    shortName: 'CT6-R',
    team: 'Cadillac F1 Team',
    drivers: ['Sergio Pérez #11', 'Valtteri Bottas #77'],
    year: 2026,
    engine: 'Cadillac GM Twin-Turbo V6 Hybrid',
    designer: 'Pat Symonds & Michael Andretti',
    primaryColor: '#8a8d8f', // Titanium Grey
    accentColor: '#d4af37',  // Cadillac Gold
    highlightColor: '#09090b', // Matte Black
    weightKg: 798,
    horsepower: 1050,
    topSpeedKmh: 351,
    zeroToHundredSec: 2.3,
    downforceAt250KmhKgf: 1830,
    dragCoefficient: 0.72,
    suspensionFront: 'Push-rod',
    suspensionRear: 'Push-rod',
    aeroPhilosophy: 'Titanium Stealth + Bộ khuếch tán gầm sau cỡ lớn',
    description: 'Đội đua thứ 11 từ tập đoàn General Motors, mang phong cách cơ bắp Mỹ kết hợp công nghệ khí động học đỉnh cao.',
    groundEffectNotes: 'Ống hầm Venturi phẳng mở rộng ở cửa thoát sau, tối đa hóa lực hút chân không gầm xe.',
    image: '/images/teams/cadillac.jpg'
  }
};
