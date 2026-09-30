import { TeamId } from '../../types';

export interface Team3DLivery {
  teamId: TeamId;
  teamName: string;
  fullName: string;
  carModelName: string;
  shortCarName: string;
  carImage: string;
  powerUnit: string;
  powerUnitSupplier: string;
  engineOutput: string;
  base: string;
  teamPrincipal: string;
  driversVi: string;
  driversEn: string;
  // 3D Material properties
  bodyColor: string;
  bodyRoughness: number;
  bodyMetalness: number;
  bodyClearcoat?: number;
  wingColor: string;
  wingRoughness: number;
  wingMetalness: number;
  haloColor: string;
  haloRoughness: number;
  haloMetalness: number;
  floorColor: string;
  accentColor: string;
  highlightColor: string;
  // Engineering highlights
  aeroPhilosophyVi: string;
  aeroPhilosophyEn: string;
  powertrainNoteVi: string;
  powertrainNoteEn: string;
}

export const TEAM_3D_LIVERIES: Record<TeamId, Team3DLivery> = {
  ferrari: {
    teamId: 'ferrari',
    teamName: 'Ferrari',
    fullName: 'Scuderia Ferrari HP',
    carModelName: 'Ferrari SF-24 / SF-26',
    shortCarName: 'SF-24',
    carImage: '/images/teams/sf24.jpg',
    powerUnit: 'Ferrari 066/12 1.6L V6 Turbo Hybrid',
    powerUnitSupplier: 'Scuderia Ferrari (Maranello, Italy)',
    engineOutput: '1,050+ HP · 15,000 RPM · >52% Hiệu suất nhiệt',
    base: 'Maranello, Italy',
    teamPrincipal: 'Frédéric Vasseur',
    driversVi: 'Charles Leclerc #16 · Lewis Hamilton #44',
    driversEn: 'Charles Leclerc #16 · Lewis Hamilton #44',
    bodyColor: '#dc0000', // Authentic Ferrari Rosso Corsa
    bodyRoughness: 0.14,
    bodyMetalness: 0.28,
    bodyClearcoat: 1.0,
    wingColor: '#1a1a1a', // Carbon black wing with yellow & red aero tips
    wingRoughness: 0.22,
    wingMetalness: 0.35,
    haloColor: '#dc0000',
    haloRoughness: 0.18,
    haloMetalness: 0.4,
    floorColor: '#0f1012',
    accentColor: '#ffe500', // Modena Yellow
    highlightColor: '#ffffff',
    aeroPhilosophyVi:
      'Hốc gió dạng bồn tắm (Bathtub downwash sidepods) dẫn luồng khí áp suất cao ép sát eo xe xuống thẳng sàn sau và bộ khuếch tán.',
    aeroPhilosophyEn:
      'Aggressive bathtub-style downwash sidepod architecture guiding high-energy airflows along the flanks to the beam wing and diffuser.',
    powertrainNoteVi:
      'Động cơ Ferrari 066/12 nổi danh với công nghệ buồng đốt phụ TJI, giải phóng công suất vượt 1050 mã lực kết hợp mô-tơ MGU-K thế hệ mới.',
    powertrainNoteEn:
      'The Ferrari 066/12 power unit excels with Turbulent Jet Ignition (TJI) combustion delivering 1050+ combined horsepower with responsive MGU-K hybrid recovery.',
  },

  mercedes: {
    teamId: 'mercedes',
    teamName: 'Mercedes',
    fullName: 'Mercedes-AMG PETRONAS Formula One Team',
    carModelName: 'Mercedes-AMG F1 W15 / W17 E Performance',
    shortCarName: 'W15',
    carImage: '/images/teams/w15.jpg',
    powerUnit: 'Mercedes-AMG M15 E Performance 1.6L V6 Turbo Hybrid',
    powerUnitSupplier: 'Mercedes-AMG High Performance Powertrains (Brixworth, UK)',
    engineOutput: '1,050+ HP · Brixworth Hybrid Power · 350kW MGU-K',
    base: 'Brackley, United Kingdom',
    teamPrincipal: 'Toto Wolff',
    driversVi: 'George Russell #63 · Kimi Antonelli #12',
    driversEn: 'George Russell #63 · Kimi Antonelli #12',
    bodyColor: '#c8ccce', // Iconic Silver Arrows metallic body
    bodyRoughness: 0.16,
    bodyMetalness: 0.65, // High metallic sheen for classic Silver Arrow look
    bodyClearcoat: 1.0,
    wingColor: '#00a19c', // Iconic Petronas Emerald Turquoise on wings & aero
    wingRoughness: 0.2,
    wingMetalness: 0.35,
    haloColor: '#00a19c', // Petronas Turquoise Halo
    haloRoughness: 0.2,
    haloMetalness: 0.4,
    floorColor: '#0e1012',
    accentColor: '#00a19c',
    highlightColor: '#eb142b',
    aeroPhilosophyVi:
      'Triết lý khí động học tinh gọn với rãnh dẫn khí sườn dốc (Undercut Channel) và cánh gió trước đa tầng triệt tiêu nhiễu động bánh xe.',
    aeroPhilosophyEn:
      'Refined aerodynamic flow-conditioning with sculpted undercut sidepod channels and multi-element front wings shedding front-wheel wake.',
    powertrainNoteVi:
      'Động cơ Mercedes-AMG M15 huyền thoại về độ ổn định và hiệu suất thu hồi nhiệt năng MGU-H, thống trị kỷ nguyên động cơ Turbo Hybrid.',
    powertrainNoteEn:
      'Mercedes-AMG M15 power unit setting the benchmark in thermodynamic efficiency and sustained hybrid energy harvesting across full race distances.',
  },

  mclaren: {
    teamId: 'mclaren',
    teamName: 'McLaren',
    fullName: 'McLaren Formula 1 Team',
    carModelName: 'McLaren MCL38 / MCL40',
    shortCarName: 'MCL38',
    carImage: '/images/teams/mcl.jpg',
    powerUnit: 'Mercedes-AMG M15 E Performance 1.6L V6 Turbo Hybrid',
    powerUnitSupplier: 'Mercedes-AMG High Performance Powertrains (Customer Unit)',
    engineOutput: '1,050+ HP · 15,000 RPM · Hệ truyền động Carbon 8 cấp',
    base: 'Woking, United Kingdom',
    teamPrincipal: 'Andrea Stella',
    driversVi: 'Lando Norris #4 · Oscar Piastri #81',
    driversEn: 'Lando Norris #4 · Oscar Piastri #81',
    bodyColor: '#ff8000', // Authentic Papaya Orange
    bodyRoughness: 0.15,
    bodyMetalness: 0.22,
    bodyClearcoat: 0.95,
    wingColor: '#14171a', // Anthracite Carbon with Papaya & Stealth Blue accents
    wingRoughness: 0.25,
    wingMetalness: 0.3,
    haloColor: '#ff8000',
    haloRoughness: 0.18,
    haloMetalness: 0.3,
    floorColor: '#0e1012',
    accentColor: '#47c7fc', // Stealth Blue
    highlightColor: '#141416',
    aeroPhilosophyVi:
      'Hệ thống hốc gió hớt gầm sâu nhất đoàn đua (Extreme Undercut) và sàn xe Venturi tối ưu lực ép khi vào các góc cua tốc độ cao.',
    aeroPhilosophyEn:
      'Class-leading extreme undercut sidepod geometry feeding high-velocity air into an optimized ground-effect floor for apex stability.',
    powertrainNoteVi:
      'Tích hợp hoàn hảo khối động cơ Mercedes-AMG M15 với bộ làm mát nội bộ siêu gọn do đội ngũ kỹ sư tại Woking tự phát triển.',
    powertrainNoteEn:
      'Seamlessly packaged Mercedes-AMG M15 power unit paired with bespoke Woking-engineered compact cooling architecture.',
  },

  redbull: {
    teamId: 'redbull',
    teamName: 'Red Bull',
    fullName: 'Oracle Red Bull Racing',
    carModelName: 'Red Bull Racing RB20 / RB22',
    shortCarName: 'RB20',
    carImage: '/images/teams/rb20.jpg',
    powerUnit: 'Honda RBPTH002 1.6L V6 Turbo Hybrid',
    powerUnitSupplier: 'Red Bull Powertrains / Honda HRC',
    engineOutput: '1,050+ HP · Động cơ Honda HRC vô địch thế giới',
    base: 'Milton Keynes, United Kingdom',
    teamPrincipal: 'Christian Horner',
    driversVi: 'Max Verstappen #1 · Isack Hadjar #6',
    driversEn: 'Max Verstappen #1 · Isack Hadjar #6',
    bodyColor: '#050f26', // Red Bull Matte Midnight Navy
    bodyRoughness: 0.46, // Distinctive Matte Satin Finish
    bodyMetalness: 0.18,
    bodyClearcoat: 0.0, // Zero clearcoat for matte velvet feel
    wingColor: '#e10600', // Red Bull Racing Red / Yellow
    wingRoughness: 0.32,
    wingMetalness: 0.25,
    haloColor: '#050f26',
    haloRoughness: 0.46,
    haloMetalness: 0.2,
    floorColor: '#0c0e10',
    accentColor: '#fcd700', // Sunburst Yellow
    highlightColor: '#e10600',
    aeroPhilosophyVi:
      'Tuyệt tác khí động học với các hốc hút gió sườn đảo ngược (Overbite Inlet) và hệ thống treo trước Pull-rod chống chúi đầu khi phanh gấp.',
    aeroPhilosophyEn:
      'Pioneering overbite sidepod intake philosophy combined with anti-dive pull-rod front suspension maintaining steady platform ground clearance.',
    powertrainNoteVi:
      'Động cơ Honda RBPTH002 mang lại khả năng phân bổ mô-men xoắn tức thời và độ bền cơ học đã giành nhiều danh hiệu vô địch thế giới liên tiếp.',
    powertrainNoteEn:
      'Honda RBPTH002 power unit delivers instantaneous torque deployment, surgical driveability and proven championship-winning endurance.',
  },

  astonmartin: {
    teamId: 'astonmartin',
    teamName: 'Aston Martin',
    fullName: 'Aston Martin Aramco Formula One Team',
    carModelName: 'Aston Martin AMR25 / AMR26',
    shortCarName: 'AMR25',
    carImage: '/images/teams/astonmartin.jpg',
    powerUnit: 'Mercedes-AMG M15 1.6L V6 Turbo Hybrid',
    powerUnitSupplier: 'Mercedes-AMG HPP (Silverstone Customer)',
    engineOutput: '1,050+ HP · Hệ thống treo khí động học Mercedes',
    base: 'Silverstone, United Kingdom',
    teamPrincipal: 'Mike Krack',
    driversVi: 'Fernando Alonso #14 · Lance Stroll #18',
    driversEn: 'Fernando Alonso #14 · Lance Stroll #18',
    bodyColor: '#00594f', // British Racing Metallic Emerald Green
    bodyRoughness: 0.17,
    bodyMetalness: 0.48, // Metallic flake
    bodyClearcoat: 1.0,
    wingColor: '#cedc00', // Fluorescent Lime Essence
    wingRoughness: 0.22,
    wingMetalness: 0.25,
    haloColor: '#00594f',
    haloRoughness: 0.2,
    haloMetalness: 0.45,
    floorColor: '#0e1110',
    accentColor: '#cedc00',
    highlightColor: '#0b1311',
    aeroPhilosophyVi:
      'Máng trượt khí động học sườn xe sâu hút không khí dồn về phía sau kết hợp cánh sau DRS tối ưu lực cản tại đường thẳng.',
    aeroPhilosophyEn:
      'Deep waterslide sidepod gulley directing undisturbed ambient flow directly to the rear beam wing and upper diffuser.',
    powertrainNoteVi:
      'Sử dụng động cơ và hộp số Mercedes-AMG đặt trong khung gầm do đội ngũ kỹ sư tại đại bản doanh công nghệ cao Silverstone thiết kế.',
    powertrainNoteEn:
      'Mercedes-AMG powerplant housed within an ultra-stiff carbon cell developed inside the new state-of-the-art Silverstone AMR campus.',
  },

  alpine: {
    teamId: 'alpine',
    teamName: 'Alpine',
    fullName: 'BWT Alpine Formula One Team',
    carModelName: 'Alpine A525 / A526',
    shortCarName: 'A525',
    carImage: '/images/teams/alpine.jpg',
    powerUnit: 'Renault E-Tech RE25 1.6L V6 Turbo Hybrid',
    powerUnitSupplier: 'Alpine Racing (Viry-Châtillon, France)',
    engineOutput: '1,020+ HP · 15,000 RPM · Khung gầm Enstone Carbon',
    base: 'Enstone, United Kingdom / Viry, France',
    teamPrincipal: 'Oliver Oakes',
    driversVi: 'Pierre Gasly #10 · Franco Colapinto #43',
    driversEn: 'Pierre Gasly #10 · Franco Colapinto #43',
    bodyColor: '#0090ff', // Alpine Royal Blue
    bodyRoughness: 0.15,
    bodyMetalness: 0.32,
    bodyClearcoat: 1.0,
    wingColor: '#ff87bc', // BWT Bubblegum Pink
    wingRoughness: 0.22,
    wingMetalness: 0.25,
    haloColor: '#0090ff',
    haloRoughness: 0.2,
    haloMetalness: 0.35,
    floorColor: '#0e1014',
    accentColor: '#ff87bc',
    highlightColor: '#111827',
    aeroPhilosophyVi:
      'Cấu trúc thân xe gọn gàng với triết lý tối giản hóa bề mặt ướt khí động và mũi xe dẹt hạ thấp trọng tâm quán tính.',
    aeroPhilosophyEn:
      'Slimline packaging prioritizing reduced wetted aero area with an ultra-low nosecone profile shifting roll centers forward.',
    powertrainNoteVi:
      'Động cơ Renault E-Tech phát triển tại Viry-Châtillon kết hợp bộ phận pin hồi lưu năng lượng điện phục vụ tăng tốc tức thì.',
    powertrainNoteEn:
      'Renault E-Tech hybrid unit engineered at Viry-Châtillon tuned for punchy corner-exit electrical deployment.',
  },

  racingbulls: {
    teamId: 'racingbulls',
    teamName: 'Racing Bulls',
    fullName: 'Visa Cash App RB Formula One Team',
    carModelName: 'Racing Bulls VCARB 02 / 03',
    shortCarName: 'VCARB 02',
    carImage: '/images/teams/racingbulls.jpg',
    powerUnit: 'Honda RBPTH002 1.6L V6 Turbo Hybrid',
    powerUnitSupplier: 'Red Bull Powertrains / Honda HRC',
    engineOutput: '1,050+ HP · Honda HRC · Hệ thống treo Red Bull',
    base: 'Faenza, Italy',
    teamPrincipal: 'Laurent Mekies',
    driversVi: 'Liam Lawson #30 · Arvid Lindblad #3',
    driversEn: 'Liam Lawson #30 · Arvid Lindblad #3',
    bodyColor: '#1634cb', // Gloss Royal Racing Blue
    bodyRoughness: 0.14,
    bodyMetalness: 0.38,
    bodyClearcoat: 1.0,
    wingColor: '#e2e8f0', // Clean Silver-White
    wingRoughness: 0.2,
    wingMetalness: 0.3,
    haloColor: '#1634cb',
    haloRoughness: 0.18,
    haloMetalness: 0.4,
    floorColor: '#0e1012',
    accentColor: '#ffffff',
    highlightColor: '#d90429',
    aeroPhilosophyVi:
      'Thừa hưởng cấu trúc hình học hệ thống treo và khí động học tương đồng với cỗ máy vô địch RB20 của đội mẹ Red Bull Racing.',
    aeroPhilosophyEn:
      'Direct aerodynamic and suspension synergy sharing proven pull-rod and floor concepts with the sister Red Bull Racing outfit.',
    powertrainNoteVi:
      'Trang bị khối động cơ Honda RBPTH002 cùng hệ thống thu hồi năng lượng hybrid đồng nhất với Oracle Red Bull Racing.',
    powertrainNoteEn:
      'Powered by the championship-winning Honda RBPTH002 hybrid unit alongside matched Red Bull transmission components.',
  },

  haas: {
    teamId: 'haas',
    teamName: 'Haas',
    fullName: 'MoneyGram Haas F1 Team',
    carModelName: 'Haas VF-25 / VF-26',
    shortCarName: 'VF-25',
    carImage: '/images/teams/haas.jpg',
    powerUnit: 'Ferrari 066/12 1.6L V6 Turbo Hybrid',
    powerUnitSupplier: 'Scuderia Ferrari (Maranello Customer)',
    engineOutput: '1,050+ HP · Hộp số & Hệ thống treo Ferrari',
    base: 'Kannapolis, United States / Banbury, UK',
    teamPrincipal: 'Ayao Komatsu',
    driversVi: 'Esteban Ocon #31 · Oliver Bearman #87',
    driversEn: 'Esteban Ocon #31 · Oliver Bearman #87',
    bodyColor: '#e5e7eb', // Storm Pearl White
    bodyRoughness: 0.2,
    bodyMetalness: 0.22,
    bodyClearcoat: 0.95,
    wingColor: '#e6002b', // Haas Racing Red
    wingRoughness: 0.22,
    wingMetalness: 0.3,
    haloColor: '#27272a', // Matte Graphite Carbon
    haloRoughness: 0.35,
    haloMetalness: 0.35,
    floorColor: '#0e1012',
    accentColor: '#e6002b',
    highlightColor: '#18181b',
    aeroPhilosophyVi:
      'Triết lý khí động học theo trường phái Downwash của Ferrari, tối ưu hóa việc dẫn gió làm mát và giải quyết hiện tượng thoái hóa lốp.',
    aeroPhilosophyEn:
      'Ferrari-aligned downwash aero concept focusing on tyre-deg preservation and consistent aerodynamic platform balance.',
    powertrainNoteVi:
      'Sử dụng toàn bộ cụm động cơ đốt trong, mô-tơ MGU-K và hộp số 8 cấp được cung cấp trực tiếp từ đại bản doanh Maranello của Ferrari.',
    powertrainNoteEn:
      'Propelled by Ferrari’s works 066/12 hybrid powertrain and rear-end mechanical assembly straight from Maranello.',
  },

  williams: {
    teamId: 'williams',
    teamName: 'Williams',
    fullName: 'Williams Racing',
    carModelName: 'Williams FW47 / FW48',
    shortCarName: 'FW47',
    carImage: '/images/teams/williams.jpg',
    powerUnit: 'Mercedes-AMG M15 1.6L V6 Turbo Hybrid',
    powerUnitSupplier: 'Mercedes-AMG HPP (Grove Customer)',
    engineOutput: '1,050+ HP · Hệ thống truyền động Mercedes 8 cấp',
    base: 'Grove, United Kingdom',
    teamPrincipal: 'James Vowles',
    driversVi: 'Carlos Sainz #55 · Alex Albon #23',
    driversEn: 'Carlos Sainz #55 · Alex Albon #23',
    bodyColor: '#002447', // Deep Williams Heritage Navy
    bodyRoughness: 0.16,
    bodyMetalness: 0.36,
    bodyClearcoat: 1.0,
    wingColor: '#00e5ff', // Electrifying Cyan / Bright Blue
    wingRoughness: 0.2,
    wingMetalness: 0.3,
    haloColor: '#002447',
    haloRoughness: 0.2,
    haloMetalness: 0.4,
    floorColor: '#0e1012',
    accentColor: '#00e5ff',
    highlightColor: '#00a0de',
    aeroPhilosophyVi:
      'Thân xe thiết kế cho tốc độ đường thẳng vượt trội, kết hợp sàn xe thế hệ mới giảm độ nhạy cảm trước gió tạt ngang góc cua.',
    aeroPhilosophyEn:
      'Renowned straight-line velocity pedigree coupled with modernized floor fences forgiving in sudden crosswind conditions.',
    powertrainNoteVi:
      'Động cơ Mercedes-AMG M15 cung cấp sức kéo uy mãnh và độ tin cậy cơ học cao giúp đội đua Grove cạnh tranh vị trí top đầu.',
    powertrainNoteEn:
      'Mercedes-AMG M15 power unit delivering relentless torque delivery and unmatched mechanical reliability for the Grove team.',
  },

  audi: {
    teamId: 'audi',
    teamName: 'Audi',
    fullName: 'Audi Formula One Team',
    carModelName: 'Audi F1 R26 (Sauber C45)',
    shortCarName: 'C45',
    carImage: '/images/teams/audi.jpg',
    powerUnit: 'Audi Sport F1 Power Unit',
    powerUnitSupplier: 'Audi Motorsport (Neuburg an der Donau, Germany)',
    engineOutput: '1,050+ HP · Động cơ xuất xưởng Neuburg Đức',
    base: 'Hinwil, Switzerland / Neuburg, Germany',
    teamPrincipal: 'Mattia Binotto',
    driversVi: 'Nico Hülkenberg #27 · Gabriel Bortoleto #5',
    driversEn: 'Nico Hülkenberg #27 · Gabriel Bortoleto #5',
    bodyColor: '#c4c8cc', // Matte Titanium Silver
    bodyRoughness: 0.18,
    bodyMetalness: 0.58,
    bodyClearcoat: 0.95,
    wingColor: '#f50537', // Audi Sport High-Voltage Red
    wingRoughness: 0.2,
    wingMetalness: 0.3,
    haloColor: '#c4c8cc',
    haloRoughness: 0.18,
    haloMetalness: 0.5,
    floorColor: '#101114',
    accentColor: '#f50537',
    highlightColor: '#18181b',
    aeroPhilosophyVi:
      'Triết lý "Vorsprung durch Technik": Thiết kế khí động học sắc bén nguyên khối phát triển song song tại Hinwil và Neuburg.',
    aeroPhilosophyEn:
      'Vorsprung durch Technik: Ultra-sharp monolithic aerodynamic surfaces refined in Hinwil’s state-of-the-art wind tunnel.',
    powertrainNoteVi:
      'Cột mốc lịch sử khi Audi tự nghiên cứu và chế tạo toàn bộ khối động cơ Turbo Hybrid tại Neuburg phục vụ kỷ nguyên F1.',
    powertrainNoteEn:
      'Audi’s historic all-new factory power unit engineered from the ground up at the Competence Center Motorsport in Neuburg.',
  },

  cadillac: {
    teamId: 'cadillac',
    teamName: 'Cadillac',
    fullName: 'Cadillac Formula 1 Team',
    carModelName: 'Cadillac MAC-26',
    shortCarName: 'MAC-26',
    carImage: '/images/teams/cadillac.jpg',
    powerUnit: 'Ferrari 066/12 / GM F1 Twin-Turbo V6 Hybrid',
    powerUnitSupplier: 'General Motors / Cadillac Racing',
    engineOutput: '1,050+ HP · Hợp tác động cơ Maranello & GM',
    base: 'Fishers, Indiana, United States / Silverstone, UK',
    teamPrincipal: 'Michael Andretti',
    driversVi: 'Sergio Pérez #11 · Valtteri Bottas #77',
    driversEn: 'Sergio Pérez #11 · Valtteri Bottas #77',
    bodyColor: '#141518', // Stealth Matte Velvet Black
    bodyRoughness: 0.42,
    bodyMetalness: 0.25,
    bodyClearcoat: 0.15,
    wingColor: '#d4af37', // Cadillac Racing Satin Gold
    wingRoughness: 0.22,
    wingMetalness: 0.65,
    haloColor: '#d4af37',
    haloRoughness: 0.22,
    haloMetalness: 0.65,
    floorColor: '#0c0d0e',
    accentColor: '#d4af37',
    highlightColor: '#3a3d45',
    aeroPhilosophyVi:
      'Thiết kế khí động học mang đậm phong cách cơ bắp Mỹ với cánh gió trước hình khiên và hốc gió tản nhiệt cỡ lớn.',
    aeroPhilosophyEn:
      'Bold American motorsport aerodynamic identity incorporating high-authority front wing planes and aggressive radiator gills.',
    powertrainNoteVi:
      'Khởi đầu với sự kết hợp động cơ Ferrari và dần chuyển giao công nghệ sang động cơ GM F1 Twin-Turbo tự phát triển.',
    powertrainNoteEn:
      'Debuting with proven Maranello hybrid power while developing GM’s dedicated American factory F1 power unit.',
  },
};

export const getTeam3DLivery = (teamId: TeamId): Team3DLivery => {
  return TEAM_3D_LIVERIES[teamId] || TEAM_3D_LIVERIES.ferrari;
};
