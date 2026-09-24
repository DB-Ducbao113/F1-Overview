import { AnatomyPart } from '../types';

export const ANATOMY_PARTS: AnatomyPart[] = [
  {
    id: 'front-wing',
    name: 'Front Wing Assembly',
    vietnameseName: 'Cánh Gió Trước 4 Tầng',
    category: 'aerodynamics',
    material: 'Toray T1000 Prepreg Carbon Fiber + Nomex Core',
    weightKg: 10.5,
    explodedOffset: [0, 0, 1.9], // Slides 1.9m forward
    description: 'Cánh lướt gió trước 4 tầng uốn lượn hướng luồng khí vào dưới gầm xe và điều hướng khí bẩn (outwash) ra khỏi lốp trước.',
    technicalRole: 'Tạo 25-30% downforce phía trước và quyết định chất lượng luồng không khí đi vào toàn bộ phần còn lại của xe.'
  },
  {
    id: 'rear-wing',
    name: 'Rear Wing & DRS Actuator',
    vietnameseName: 'Cánh Gió Sau & Cơ Cấu DRS',
    category: 'aerodynamics',
    material: 'High-Modulus Carbon Fiber + Hydraulic Actuator',
    weightKg: 12.0,
    explodedOffset: [0, 0.45, -1.8], // Slides backward and slightly up
    description: 'Bao gồm cánh chính chịu tải, cánh phụ DRS mở hé bằng piston thủy lực, và cánh dầm kép (beam wing) trợ lực cho bộ khuếch tán.',
    technicalRole: 'Cung cấp lực ép đuôi xe tối đa ở góc cua và giảm 20-30km/h lực cản gió khi kích hoạt DRS trên đoạn thẳng.'
  },
  {
    id: 'venturi-floor',
    name: 'Venturi Underfloor & Diffuser',
    vietnameseName: 'Sàn Venturi & Bộ Khuếch Tán (Ground Effect)',
    category: 'aerodynamics',
    material: 'Multi-ply Carbon Composite + Jabroc/Titanium Skid Block',
    weightKg: 38.0,
    explodedOffset: [0, -0.7, 0], // Lowers downward
    description: 'Trái tim của kỷ nguyên 2022-2025. Hai đường hầm Venturi khổng lồ kéo dài từ cửa hút gió bên hông đến tận đuôi xe, tạo chênh lệch áp suất cực lớn.',
    technicalRole: 'Tạo ra hơn 60% tổng lực ép downforce của xe theo nguyên lý Bernoulli mà sinh ra rất ít lực cản so với cánh gió truyền thống.'
  },
  {
    id: 'halo',
    name: 'Halo Cockpit Protection System',
    vietnameseName: 'Khung Bảo Vệ Đầu Halo',
    category: 'safety',
    material: 'Grade 5 Titanium (Ti6Al4V)',
    weightKg: 7.0,
    explodedOffset: [0, 0.85, 0], // Elevates straight up
    description: 'Cấu trúc hình chữ Y ngược bao bọc buồng lái người lái. Được trang bị lớp vỏ khí động học carbon siêu mỏng bao quanh bên ngoài.',
    technicalRole: 'Có khả năng chịu được lực va đập lên tới 12 tấn (tương đương trọng lượng của 2 chiếc xe buýt 2 tầng Luân Đôn).'
  },
  {
    id: 'power-unit',
    name: '1.6L V6 Turbo Hybrid Power Unit',
    vietnameseName: 'Động Cơ Hybrid V6 Turbo 1.6L',
    category: 'powertrain',
    material: 'Bespoke Aluminum Alloy, Titanium Valves, Inconel Exhaust',
    weightKg: 151.0,
    explodedOffset: [0, 0.4, -0.6], // Rises up and slightly back
    description: 'Khối động cơ nhiệt hiệu suất nhiệt trên 50%, tích hợp bộ tăng áp điện tử MGU-H và mô-tơ điện thu hồi động năng MGU-K (120 kW).',
    technicalRole: 'Sản sinh tổng công suất trên 1,050 mã lực ở tốc độ vòng tua tối đa 15,000 RPM, sử dụng nhiên liệu sinh học bền vững.'
  },
  {
    id: 'chassis',
    name: 'Carbon Monocoque Survival Cell',
    vietnameseName: 'Khung Thân Monocoque & Buồng Lái',
    category: 'chassis',
    material: 'Carbon-Fiber Honeycomb Sandwich + Zylon Penetration Panels',
    weightKg: 45.0,
    explodedOffset: [0, 0.25, 0], // Lifts slightly
    description: 'Bộ khung xương sống của xe. Nơi chứa ghế đua bọc khuôn người lái, bình chứa nhiên liệu Kevlar dẻo và bình ắc quy năng lượng ERS.',
    technicalRole: 'Bảo vệ phi công nguyên vẹn trong các vụ va chạm lên đến hơn 50G giảm tốc đột ngột.'
  },
  {
    id: 'wheels-front-left',
    name: 'Front Left 18" Wheel & Aero Deflector',
    vietnameseName: 'Bánh Trước Trái 18-inch & Cánh Chắn Gió',
    category: 'suspension',
    material: 'Forged BBS Magnesium + Pirelli P Zero Slick Compound',
    weightKg: 18.5,
    explodedOffset: [-1.1, 0, 1.2], // Expands diagonally out left
    description: 'Vành đúc magiê 18 inch chuẩn BBS đi kèm ốp mâm khí động học và vè chắn bùn trên lốp để dập luồng khí xoáy bất lợi.',
    technicalRole: 'Cung cấp độ bám đường ngang lên tới 5G và chịu được nhiệt độ phanh carbon-carbon vượt quá 1000°C.'
  },
  {
    id: 'wheels-front-right',
    name: 'Front Right 18" Wheel & Aero Deflector',
    vietnameseName: 'Bánh Trước Phải 18-inch & Cánh Chắn Gió',
    category: 'suspension',
    material: 'Forged BBS Magnesium + Pirelli P Zero Slick Compound',
    weightKg: 18.5,
    explodedOffset: [1.1, 0, 1.2], // Expands diagonally out right
    description: 'Vành đúc magiê 18 inch chuẩn BBS đi kèm ốp mâm khí động học và vè chắn bùn trên lốp.',
    technicalRole: 'Cung cấp lực bám cua và chuyển hướng lái với độ chính xác phản hồi mili-giây.'
  },
  {
    id: 'wheels-rear-left',
    name: 'Rear Left 18" Wheel',
    vietnameseName: 'Bánh Sau Trái 18-inch (Bản Rộng)',
    category: 'suspension',
    material: 'Forged BBS Magnesium + Pirelli P Zero (325mm Width)',
    weightKg: 21.0,
    explodedOffset: [-1.1, 0, -1.2], // Expands diagonally back left
    description: 'Bản lốp sau siêu rộng 325mm truyền toàn bộ 1050 mã lực xuống mặt đường mà không làm đứt gãy kết cấu lốp.',
    technicalRole: 'Cung cấp lực kéo tối đa (traction) khi thoát cua và phục vụ hệ thống phanh tái sinh MGU-K.'
  },
  {
    id: 'wheels-rear-right',
    name: 'Rear Right 18" Wheel',
    vietnameseName: 'Bánh Sau Phải 18-inch (Bản Rộng)',
    category: 'suspension',
    material: 'Forged BBS Magnesium + Pirelli P Zero (325mm Width)',
    weightKg: 21.0,
    explodedOffset: [1.1, 0, -1.2], // Expands diagonally back right
    description: 'Bản lốp sau siêu rộng 325mm truyền động năng từ hộp số liền lạc 8 cấp ly hợp kép.',
    technicalRole: 'Chịu tải mô-men xoắn tức thời từ mô tơ điện MGU-K mà không bị trượt bánh mất kiểm soát.'
  }
];
