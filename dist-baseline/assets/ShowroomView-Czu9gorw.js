const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f ||
    (m.f = [
      'assets/Showroom3DLoader-BSskS5J-.js',
      'assets/vendor-react-B62-MmwA.js',
      'assets/vendor-three-CZCoFc9s.js',
      'assets/vendor-icons-Brb4Fsqu.js',
      'assets/ShowroomScene-DPwOKgBc.js',
      'assets/index-C6BcaiY-.js',
      'assets/vendor-core-ckwbz45p.js',
      'assets/index-CWaiePfj.css',
      'assets/2026-C_6k-Hdd.js',
      'assets/ConstructorLogo-BPzo8jEn.js',
    ]),
) => i.map((i) => d[i]);
import { _ as ke } from './vendor-core-ckwbz45p.js';
import { R as D, r as s, j as e, m as ln, i as cn, L as hn } from './vendor-react-B62-MmwA.js';
import { C as dn } from './2026-C_6k-Hdd.js';
import { C as V } from './ConstructorLogo-BPzo8jEn.js';
import {
  X as _,
  S as Y,
  n as Ee,
  o as Te,
  Z as ae,
  g as un,
  j as mn,
  p as Ve,
  q as Se,
  r as gn,
  s as pn,
  t as bn,
  u as re,
  v as Ne,
  i as Me,
  w as Re,
  x as xn,
  B as ge,
  P as Q,
  h as ee,
  y as pe,
  z as $,
  G as oe,
  l as be,
  U as xe,
  T as fe,
  I as fn,
  J as vn,
  K as wn,
  L as je,
  N as Cn,
  A as yn,
} from './vendor-icons-Brb4Fsqu.js';
import { T as B, u as kn, E as En } from './index-C6BcaiY-.js';
const k = [
    {
      id: 'wings',
      nameVi: 'Cánh Gió Trước & Khí Động Học',
      nameEn: 'Front Wing & Aerodynamics',
      categoryVi: 'Khí Động Học (Aero)',
      categoryEn: 'Aerodynamics',
      summaryVi:
        'Tạo lực nén bánh trước, cân bằng lực nén và điều hướng luồng khí dưới sàn xe (Venturi).',
      summaryEn:
        'Generates front downforce, balances car pitch, and guides clean airflow into the Venturi tunnels.',
      descriptionVi:
        'Cánh gió trước là bộ phận khí động học đầu tiên đón nhận luồng không khí va chạm với xe F1. Được chế tạo từ hơn 40 lớp sợi carbon siêu nhẹ, cánh gió không chỉ tạo ra hàng trăm kilogram lực nén ở tốc độ cao mà còn chia tách luồng khí: một phần đưa vào làm mát phanh và động cơ, phần còn lại tạo thành các luồng xoáy Y250 Vortex định hướng quanh lốp trước để triệt tiêu lực cản gió hỗn loạn.',
      descriptionEn:
        'The front wing is the primary aerodynamic surface encountering undisturbed air. Fabricated from over 40 plies of aerospace-grade carbon fiber, it generates critical front-axle downforce and channels high-energy vortices around the front wheel wake, sealing the ground-effect underfloor tunnels.',
      imageUrl: '/images/showroom/wings_drs.webp',
      position: [0, 0.28, -2.25],
      cameraPos: [1.2, 0.9, -3.2],
      cameraTarget: [0, 0.25, -2.2],
      specs: [
        {
          labelVi: 'Vật liệu chế tạo',
          labelEn: 'Construction',
          value: 'Carbon Fiber Pre-preg T1000',
        },
        { labelVi: 'Lực nén tối đa', labelEn: 'Peak Downforce', value: '~450 kg @ 250 km/h' },
        {
          labelVi: 'Chiều rộng tiêu chuẩn',
          labelEn: 'Regulation Width',
          value: '1900 mm (FIA 2026)',
        },
        {
          labelVi: 'Số tầng cánh (Flaps)',
          labelEn: 'Cascade Elements',
          value: '4 Adjustable Elements',
        },
      ],
      highlightsVi: [
        'Điều chỉnh góc mở (Angle of Attack) từng chặng đua để tối ưu hóa giữa tốc độ thẳng và ôm cua.',
        'Endplates tích hợp hốc dẫn khí Outwash hạn chế luồng nhiễu động từ bánh xe trước.',
        'Tạo lực ép trực tiếp lên trục bánh trước giúp triệt tiêu hiện tượng thiếu lái (Understeer).',
      ],
      highlightsEn: [
        'Tunable angle of attack at each race weekend for ideal top speed vs downforce ratio.',
        'Outwash endplate geometry pushing turbulent tire wake away from floor edges.',
        'Provides high front-end authority, combating understeer in high-speed apexes.',
      ],
    },
    {
      id: 'drs',
      nameVi: 'Cánh Gió Sau & Hệ Thống DRS',
      nameEn: 'Rear Wing & DRS Flap',
      categoryVi: 'Khí Động Học & Tốc Độ',
      categoryEn: 'Aero & Overtaking',
      summaryVi: 'Hệ thống giảm lực cản DRS mở góc cánh gió sau, tăng thêm 15–25 km/h khi vượt xe.',
      summaryEn:
        'Drag Reduction System hydraulic actuator opens the upper rear flap to gain 15-25 km/h.',
      descriptionVi:
        'Hệ thống DRS (Drag Reduction System) được điều khiển thủy lực với tốc độ phản hồi tính bằng mili-giây. Khi tay đua nằm trong khoảng cách dưới 1 giây sau xe phía trước tại vùng DRS Detection Point, đèn báo trên vô lăng sẽ sáng. Kích hoạt DRS làm nâng cánh phụ phía sau lên tối đa 85 mm, giảm 30% lực cản khí động của toàn xe và mang lại lợi thế vượt trội trên các đoạn thẳng dài.',
      descriptionEn:
        'The Drag Reduction System utilizes an ultra-fast hydraulic actuator to pivot the upper rear wing flap open by up to 85 mm. When trailing within 1 second through FIA designated zones, DRS sheds 30% of total aerodynamic drag, unleashing up to 25 km/h top-speed advantage.',
      imageUrl: '/images/showroom/wings_drs.webp',
      position: [0, 0.95, 2.15],
      cameraPos: [-1.4, 1.4, 3.1],
      cameraTarget: [0, 0.85, 2.1],
      specs: [
        {
          labelVi: 'Độ mở cánh gió (Slot Gap)',
          labelEn: 'Flap Opening Gap',
          value: '85 mm (Max FIA)',
        },
        { labelVi: 'Tốc độ tăng thêm', labelEn: 'Top Speed Delta', value: '+15 to +25 km/h' },
        {
          labelVi: 'Thời gian kích hoạt',
          labelEn: 'Actuation Response',
          value: '< 250 milliseconds',
        },
        {
          labelVi: 'Cơ cấu điều khiển',
          labelEn: 'Actuator Mechanism',
          value: 'High-pressure Hydraulic',
        },
      ],
      highlightsVi: [
        'Tự động đóng lại ngay lập tức khi tay đua chạm nhẹ vào bàn đạp phanh.',
        'Kết hợp với Beam Wing kép phía dưới để tạo lực hút khổng lồ từ bộ khuếch tán sàn xe (Diffuser).',
        'Đèn LED mưa (Rain Light) an toàn FIA tích hợp ngay tâm đuôi xe với khả năng cảnh báo sạc năng lượng ERS.',
      ],
      highlightsEn: [
        'Instantly snaps shut the moment the driver initiates braking pressure.',
        'Works in synergy with lower beam wings to extract massive underfloor diffuser suction.',
        'Integrated FIA rain/energy recovery LED light at the rear impact structure.',
      ],
    },
    {
      id: 'power_unit',
      nameVi: 'Bộ Động Cơ Hybrid V6 Turbo 1.6L',
      nameEn: 'V6 Turbo Hybrid Power Unit',
      categoryVi: 'Hệ Thống Động Lực (Powertrain)',
      categoryEn: 'Powertrain & ERS',
      summaryVi:
        'Cỗ máy 1000+ mã lực kết hợp động cơ đốt trong V6 Turbo và hệ thống hồi lưu điện năng MGU-K.',
      summaryEn:
        '1000+ HP hybrid marvel pairing a 1.6L Turbo V6 with an MGU-K regenerative electric motor.',
      descriptionVi:
        'Power Unit hiện đại của F1 là đỉnh cao hiệu suất nhiệt trên thế giới (vượt ngưỡng 50%). Bao gồm 5 thành phần chính theo luật 2026 (đã bỏ MGU-H): Động cơ đốt trong (ICE) 1.6L vòng tua 15,000 RPM, Bộ tăng áp đơn Turbocharger, Mô-tơ điện thu hồi động năng MGU-K 350 kW (470 HP), Bộ pin lưu trữ năng lượng (Energy Store), và Hộp điều khiển điện tử (Control Electronics).',
      descriptionEn:
        'The modern Formula 1 Power Unit achieves world-record thermal efficiency beyond 50%. Under 2026 regulations (MGU-H removed) it comprises five integrated elements: 1.6L Internal Combustion Engine (15,000 RPM), Turbocharger, 350 kW MGU-K kinetic recuperation motor, upgraded Energy Store battery, and Control Electronics.',
      imageUrl: '/images/showroom/power_unit.webp',
      position: [0.95, 0.6, 0.65],
      cameraPos: [1.8, 1.3, 0.5],
      cameraTarget: [0, 0.48, 0.65],
      specs: [
        {
          labelVi: 'Dung tích & cấu hình',
          labelEn: 'Displacement',
          value: '1.6 L, 90° V6 Single Turbo',
        },
        { labelVi: 'Tổng công suất', labelEn: 'Combined Output', value: '1,050+ Horsepower (BHP)' },
        { labelVi: 'Vòng tua tối đa', labelEn: 'RPM Limit', value: '15,000 RPM' },
        {
          labelVi: 'Năng lượng pin ERS',
          labelEn: 'Battery Deployment',
          value: '8.5 MJ per lap (MGU-K, 2026)',
        },
        {
          labelVi: 'Hiệu suất nhiệt',
          labelEn: 'Thermal Efficiency',
          value: '> 52% (Cao nhất thế giới)',
        },
      ],
      highlightsVi: [
        'Công nghệ đánh lửa tia nén buồng đốt phụ (Pre-Chamber Ignition TJI) đốt cháy kiệt nhiên liệu.',
        'Thu hồi điện năng khi phanh lên tới 8.5 MJ mỗi vòng, mô-tơ MGU-K 350 kW phóng gần 470 mã lực điện hỗ trợ tức thì.',
        'Sử dụng nhiên liệu sinh học 100% bền vững hướng đến tương lai xanh Net Zero.',
      ],
      highlightsEn: [
        'Turbulent Jet Ignition (TJI) pre-chamber system maximizing fuel combustion completeness.',
        'Harvests up to 8.5 MJ per lap under braking, 350 kW MGU-K deploying nearly 470 electric BHP on corner exit.',
        'Transitioning to 100% advanced sustainable drop-in biofuel.',
      ],
    },
    {
      id: 'halo',
      nameVi: 'Khung Bảo Vệ Buồng Lái Halo',
      nameEn: 'Titanium Halo Cockpit Protection',
      categoryVi: 'An Toàn Tay Đua (Safety)',
      categoryEn: 'Driver Safety System',
      summaryVi:
        'Khung vòng Titan Grade 5 chịu lực va chạm 12.3 tấn, bảo vệ vùng đầu tay đua tuyệt đối.',
      summaryEn:
        'Grade 5 Titanium loop rated to withstand 12.3 tonnes of impact force protecting the driver.',
      descriptionVi:
        'Được giới thiệu từ năm 2018 bởi FIA, hệ thống Halo đã cứu sống nhiều tay đua trong các vụ tai nạn kinh hoàng (như Romain Grosjean tại Bahrain 2020 hay Guanyu Zhou tại Silverstone 2022). Khung Halo chỉ nặng 7 kg nhưng có thể chịu được lực ép thẳng đứng 121 kN (tương đương 12 tấn, gấp 2 lần xe buýt 2 tầng Luân Đôn). Lớp vỏ carbon bên ngoài được vát khí động học với các rãnh chia gió vi mô.',
      descriptionEn:
        'Mandated by the FIA in 2018, the Halo has proven life-saving in multiple severe impacts. Fabricated from high-tensile Grade 5 Titanium, the structure weighs just 7 kg yet survives a 121 kN (12.3 tonne) static load. Teams wrap the bare titanium in custom aerodynamic carbon fairings with micro vortex-generators.',
      imageUrl: '/images/showroom/halo_safety.webp',
      position: [0, 0.82, -0.35],
      cameraPos: [0.9, 1.25, -1.2],
      cameraTarget: [0, 0.65, -0.35],
      specs: [
        {
          labelVi: 'Vật liệu chính',
          labelEn: 'Primary Material',
          value: 'Grade 5 Titanium (Ti6Al4V)',
        },
        { labelVi: 'Trọng lượng khung', labelEn: 'Weight', value: '7.0 kg (Unfaired)' },
        {
          labelVi: 'Tải trọng kiểm định',
          labelEn: 'Static Test Load',
          value: '121 kN (12.3 Tonnes)',
        },
        {
          labelVi: 'Góc nhìn tay đua',
          labelEn: 'Driver Visibility',
          value: 'Vùng khuất < 0.25 giây não bộ bù trừ',
        },
      ],
      highlightsVi: [
        'Gắn kết trực tiếp vào khung nguyên khối Monocoque Carbon bằng bu lông cường lực cao.',
        'Lớp vỏ khí động học bọc ngoài giúp luồng khí vào hộp gió Airbox trên đỉnh xe không bị xoáy.',
        'Thiết kế chữ Y ngược giúp tay đua có thể thoát hiểm khẩn cấp trong vòng dưới 7 giây.',
      ],
      highlightsEn: [
        'Rigidly bolted into the structural carbon monocoque safety cell.',
        'Custom aero fairing channels clean, undisturbed laminar air directly into the engine airbox.',
        'Allows driver emergency egress in under seven seconds.',
      ],
    },
    {
      id: 'sidepods',
      nameVi: 'Hốc Gió Thân Xe & Hệ Tản Nhiệt',
      nameEn: 'Sidepods & Cooling Undercut',
      categoryVi: 'Khí Động Học & Tản Nhiệt',
      categoryEn: 'Aero & Thermal',
      summaryVi:
        'Hốc hút khí làm mát bộ tản nhiệt và tạo đường lượn Undercut dẫn luồng khí về sàn xe.',
      summaryEn:
        'Intakes cooling air for radiators while deep undercuts guide high-velocity air toward the floor.',
      descriptionVi:
        'Hốc gió Sidepods đóng vai trò kép: vừa giải nhiệt cho khối động cơ hơn 1000 mã lực thông qua dàn tản nhiệt nước và khí nạp (Intercoolers), vừa định hình khí động học quan trọng nhất thân xe. Thiết kế hớt gầm sâu (Extreme Undercut) và bề mặt dốc phía trên (Downwash Ramp) ép luồng không khí áp suất cao đi dọc theo eo thân xe chảy thẳng xuống bề mặt khuếch tán sàn sau.',
      descriptionEn:
        'Sidepods fulfill a vital dual role: thermal management for the 1000+ HP powertrain via radiator intercoolers, and macro airflow conditioning. Aggressive undercut channels accelerate high-pressure ambient air along the waistline, feeding downwash currents directly to the rear diffuser.',
      imageUrl: '/images/showroom/sidepods_cooling.webp',
      position: [0.85, 0.38, 0.05],
      cameraPos: [2.5, 1.2, -0.2],
      cameraTarget: [0.4, 0.35, 0.05],
      specs: [
        {
          labelVi: 'Kiến trúc khí động',
          labelEn: 'Aero Philosophy',
          value: 'Deep Undercut Downwash',
        },
        {
          labelVi: 'Nhiệt độ giải tỏa',
          labelEn: 'Heat Dissipation',
          value: '> 140 kW nhiệt lượng thải',
        },
        {
          labelVi: 'Thân vỏ',
          labelEn: 'Bodywork Shell',
          value: 'Ultra-thin Carbon-Nomex Honeycomb',
        },
        {
          labelVi: 'Hệ thống an toàn',
          labelEn: 'Crash Structure',
          value: 'FIA Side Impact Spars (SIS)',
        },
      ],
      highlightsVi: [
        'Cấu trúc chống va đập cạnh sườn SIS bảo vệ tay đua khỏi các cú đâm ngang góc.',
        'Các khe mang cá Louvers mở rộng linh hoạt tùy theo nhiệt độ ngoài trời (như Bahrain hay Singapore).',
        'Định hình luồng xoáy ngăn không cho nhiễu động bánh trước tràn vào gầm xe.',
      ],
      highlightsEn: [
        'Houses FIA-mandated Side Impact Spars (SIS) absorbing lateral crash energy.',
        'Interchangeable cooling louvers adapted per circuit ambient temperature.',
        'Acts as an aerodynamic barrier sealing floor edges from tire turbulence.',
      ],
    },
    {
      id: 'tires',
      nameVi: 'Lốp Pirelli 18-inch & Phanh Đĩa Carbon',
      nameEn: 'Pirelli 18-inch Tires & Carbon Brakes',
      categoryVi: 'Độ Bám Đường & Phanh',
      categoryEn: 'Grip & Deceleration',
      summaryVi:
        'Lốp rãnh thấp 18-inch kết hợp đĩa phanh carbon Brembo phát sáng trên 1,000°C khi hãm phanh 5G.',
      summaryEn:
        'Low-profile 18-inch Pirelli rubber paired with carbon brake discs glowing at 1,000°C under 5G.',
      descriptionVi:
        'Lốp Pirelli 18-inch với thành lốp thấp giúp xe F1 phản hồi lái cực nhạy và giảm hiện tượng nhún không kiểm soát. Ẩn phía sau mâm hợp kim ma-giê BBS là hệ thống phanh carbon-carbon Brembo với hơn 1,000 lỗ thông gió li ti. Khi phanh từ 340 km/h xuống 80 km/h chỉ trong 100 mét, đĩa phanh sản sinh lực hãm trên 5G và bốc cháy đỏ rực ở nhiệt độ trên 1,000°C.',
      descriptionEn:
        'Pirelli 18-inch low-profile tires deliver immediate steering response and rigid lateral compliance. Behind the forged magnesium wheels reside Brembo carbon-carbon brake discs drilled with over 1,000 cooling holes, generating brutal 5G deceleration from 340 km/h while glowing white-hot above 1,000°C.',
      imageUrl: '/images/showroom/pirelli_tires.webp',
      position: [0.96, 0.35, -1.45],
      cameraPos: [1.9, 0.65, -1.8],
      cameraTarget: [0.85, 0.35, -1.45],
      specs: [
        {
          labelVi: 'Đường kính mâm',
          labelEn: 'Wheel Diameter',
          value: '18 inches (Magnesium Forged)',
        },
        {
          labelVi: 'Hợp chất lốp khô',
          labelEn: 'Slick Compounds',
          value: 'C1 to C5 (Hard / Medium / Soft)',
        },
        { labelVi: 'Nhiệt độ hoạt động', labelEn: 'Operating Window', value: '100°C – 130°C' },
        {
          labelVi: 'Nhiệt độ đĩa phanh',
          labelEn: 'Brake Disc Temp',
          value: 'Up to 1,050°C (Glowing Red)',
        },
        {
          labelVi: 'Lực hãm tối đa',
          labelEn: 'Peak Deceleration',
          value: '> 5.5 G Lực trọng trường',
        },
      ],
      highlightsVi: [
        'Đĩa phanh được khoan hơn 1,000 lỗ thông gió vi mô để giải nhiệt tức thời.',
        'Mâm xe có ốp khí động học (Wheel Covers) giảm thiểu luồng gió xoáy quanh vành bánh xe.',
        'Chiến thuật thay lốp Undercut/Overcut quyết định phần lớn thắng bại trong mỗi chặng đua.',
      ],
      highlightsEn: [
        'Discs feature over 1,000 precision ventilation holes for rapid thermal relief.',
        'Mandatory aerodynamic wheel rim covers reducing chaotic wheel rim vortices.',
        'Tire degradation curves form the core cornerstone of Grand Prix pit-stop strategy.',
      ],
    },
    {
      id: 'floor',
      nameVi: 'Sàn Venturi & Bộ Khuếch Tán',
      nameEn: 'Venturi Floor & Diffuser',
      categoryVi: 'Hiệu Ứng Mặt Đất (Ground Effect)',
      categoryEn: 'Ground Effect',
      summaryVi:
        'Hầm gió Venturi dưới gầm tạo ~60% lực nén, tấm gỗ Jabroc 10mm và đèn mưa FIA ở đuôi xe.',
      summaryEn:
        'Venturi tunnels generate ~60% of total downforce, with the 10mm Jabroc plank and FIA rain light at the tail.',
      descriptionVi:
        'Sàn xe hiệu ứng mặt đất là nguồn lực nén lớn nhất của F1 hiện đại. Hai hầm gió Venturi tăng tốc luồng khí dưới gầm, tạo vùng áp suất thấp hút xe xuống mặt đường. Tim gầm là tấm gỗ Jabroc dày 10mm kiểm định độ cao gầm xe, hai bên là các cánh chia gió Strake, phía trên là cánh dầm Beam Wing khuếch đại lực hút của bộ khuếch tán Diffuser. Cụm đèn LED đỏ FIA ở đuôi vừa báo mưa vừa nhấp nháy xanh khi thu hồi năng lượng ERS.',
      descriptionEn:
        'The ground-effect floor is the largest downforce source on a modern F1 car. Twin Venturi tunnels accelerate underbody airflow, creating low-pressure suction. A 10mm Jabroc reference plank controls ride height, flanked by diffuser strakes, with the beam wing above amplifying extraction. The FIA LED rain light doubles as a green ERS harvesting indicator.',
      imageUrl: '/images/showroom/sidepods_cooling.webp',
      position: [0, 0.25, 1.2],
      cameraPos: [0, 1, 3.4],
      cameraTarget: [0, 0.3, 1.1],
      specs: [
        { labelVi: 'Nguồn lực nén', labelEn: 'Downforce Share', value: '~60% tổng lực nén xe' },
        { labelVi: 'Tấm tham chiếu gầm', labelEn: 'Reference Plank', value: 'Jabroc 10 mm (FIA)' },
        { labelVi: 'Đèn an toàn đuôi', labelEn: 'Rear Light', value: 'FIA RL24 LED (Đỏ/Xanh ERS)' },
        { labelVi: 'Cánh khuếch đại', labelEn: 'Extraction Wing', value: 'Beam Wing kép' },
      ],
      highlightsVi: [
        'Tấm gỗ Jabroc mòn quá 1mm sau chặng đua sẽ khiến xe bị loại khỏi kết quả.',
        'Các cánh Strake dọc chia luồng khuếch tán, chân gắn guốc titan chống mài mòn.',
        'Đèn mưa LED đỏ rực khi trời mưa, nhấp nháy xanh khi pin ERS đang sạc.',
      ],
      highlightsEn: [
        'Excessive Jabroc plank wear beyond 1mm means disqualification after the race.',
        'Longitudinal diffuser strakes with titanium skid shoes preventing wear damage.',
        'Ruby rain LED glowing red in wet conditions, flashing green while the ERS battery charges.',
      ],
    },
  ],
  ne = {
    ferrari: {
      teamId: 'ferrari',
      teamName: 'Ferrari',
      fullName: 'Scuderia Ferrari HP',
      carModelName: 'Ferrari SF-26 · 2026',
      shortCarName: 'SF-26',
      carImage: '/images/teams/sf24.webp',
      powerUnit: 'Ferrari 066/12 1.6L V6 Turbo Hybrid',
      powerUnitSupplier: 'Scuderia Ferrari (Maranello, Italy)',
      engineOutput: '1,050+ HP · 15,000 RPM · >52% Hiệu suất nhiệt',
      base: 'Maranello, Italy',
      teamPrincipal: 'Frédéric Vasseur',
      driversVi: 'Charles Leclerc #16 · Lewis Hamilton #44',
      driversEn: 'Charles Leclerc #16 · Lewis Hamilton #44',
      bodyColor: '#e8002d',
      noseColor: '#e8002d',
      engineCoverColor: '#e8002d',
      sidepodColor: '#e8002d',
      airboxColor: '#e8002d',
      endplateColor: '#ffdf00',
      bodyRoughness: 0.12,
      bodyMetalness: 0.3,
      bodyClearcoat: 1,
      wingColor: '#121417',
      wingRoughness: 0.22,
      wingMetalness: 0.35,
      haloColor: '#e8002d',
      haloRoughness: 0.16,
      haloMetalness: 0.4,
      floorColor: '#0a0b0d',
      accentColor: '#ffdf00',
      highlightColor: '#0096d6',
      wheelCoverColor: '#15171c',
      wheelAccentColor: '#e8002d',
      wheelSecondaryColor: '#ffdf00',
      wheelRimColor: '#e8002d',
      wheelPirelliCompound: 'soft',
      mirrorColor: '#e8002d',
      mirrorAccentColor: '#ffdf00',
      floorEdgeAccentColor: '#ffdf00',
      seatbeltColor: '#e8002d',
      diffuserAccentColor: '#ffdf00',
      rainLightColor: '#ff0033',
      aeroPhilosophyVi:
        'Hốc gió dạng bồn tắm (Bathtub downwash sidepods) dẫn luồng khí áp suất cao ép sát eo xe xuống thẳng sàn sau và bộ khuếch tán.',
      aeroPhilosophyEn:
        'Aggressive bathtub-style downwash sidepod architecture guiding high-energy airflows along the flanks to the beam wing and diffuser.',
      powertrainNoteVi:
        'Động cơ Ferrari 066/12 nổi danh với công nghệ buồng đốt phụ TJI, giải phóng công suất vượt 1050 mã lực kết hợp mô-tơ MGU-K thế hệ mới.',
      powertrainNoteEn:
        'The Ferrari 066/12 power unit excels with Turbulent Jet Ignition (TJI) combustion delivering 1050+ combined horsepower with responsive MGU-K hybrid recovery.',
      schematicImage: '/images/showroom/schematics/ferrari.webp',
      schematicCode: 'FER-SF26-AERO-8K',
      schematicTitleVi: 'Sơ đồ CAD khí động học 8K Scuderia Ferrari (Project 674)',
      schematicTitleEn: 'Scuderia Ferrari SF-26 8K Aerodynamic CAD Schematic',
    },
    mercedes: {
      teamId: 'mercedes',
      teamName: 'Mercedes',
      fullName: 'Mercedes-AMG PETRONAS Formula One Team',
      carModelName: 'Mercedes-AMG F1 W17 · 2026',
      shortCarName: 'W17',
      carImage: '/images/teams/w15.webp',
      powerUnit: 'Mercedes-AMG M15 E Performance 1.6L V6 Turbo Hybrid',
      powerUnitSupplier: 'Mercedes-AMG High Performance Powertrains (Brixworth, UK)',
      engineOutput: '1,050+ HP · Brixworth Hybrid Power · 350kW MGU-K',
      base: 'Brackley, United Kingdom',
      teamPrincipal: 'Toto Wolff',
      driversVi: 'George Russell #63 · Kimi Antonelli #12',
      driversEn: 'George Russell #63 · Kimi Antonelli #12',
      bodyColor: '#c8ccd0',
      noseColor: '#c8ccd0',
      engineCoverColor: '#0a0b0d',
      sidepodColor: '#0a0b0d',
      airboxColor: '#e10600',
      endplateColor: '#e10600',
      bodyRoughness: 0.16,
      bodyMetalness: 0.65,
      bodyClearcoat: 1,
      noseRoughness: 0.14,
      noseMetalness: 0.82,
      sidepodRoughness: 0.18,
      sidepodMetalness: 0.2,
      engineCoverRoughness: 0.18,
      engineCoverMetalness: 0.2,
      wingColor: '#0e1014',
      wingRoughness: 0.2,
      wingMetalness: 0.25,
      haloColor: '#121418',
      haloRoughness: 0.25,
      haloMetalness: 0.4,
      floorColor: '#08090b',
      accentColor: '#00a19c',
      highlightColor: '#00f5d4',
      wheelCoverColor: '#0d1014',
      wheelAccentColor: '#00a19c',
      wheelSecondaryColor: '#c8ccd0',
      wheelRimColor: '#c8ccd0',
      wheelPirelliCompound: 'medium',
      mirrorColor: '#c8ccd0',
      mirrorAccentColor: '#00a19c',
      floorEdgeAccentColor: '#00a19c',
      seatbeltColor: '#00a19c',
      diffuserAccentColor: '#00a19c',
      rainLightColor: '#ff0033',
      aeroPhilosophyVi:
        'Triết lý khí động học tinh gọn với rãnh dẫn khí sườn dốc (Undercut Channel) và cánh gió trước đa tầng triệt tiêu nhiễu động bánh xe.',
      aeroPhilosophyEn:
        'Refined aerodynamic flow-conditioning with sculpted undercut sidepod channels and multi-element front wings shedding front-wheel wake.',
      powertrainNoteVi:
        'Động cơ Mercedes-AMG M15 huyền thoại về độ ổn định và hiệu suất thu hồi nhiệt năng MGU-H, thống trị kỷ nguyên động cơ Turbo Hybrid.',
      powertrainNoteEn:
        'Mercedes-AMG M15 power unit setting the benchmark in thermodynamic efficiency and sustained hybrid energy harvesting across full race distances.',
      schematicImage: '/images/showroom/schematics/mercedes.webp',
      schematicCode: 'MERC-W17-AERO-8K',
      schematicTitleVi: 'Bản vẽ kỹ thuật khí động học 8K Mercedes-AMG F1 W17',
      schematicTitleEn: 'Mercedes-AMG F1 W17 8K Aerodynamic Blueprint',
    },
    mclaren: {
      teamId: 'mclaren',
      teamName: 'McLaren',
      fullName: 'McLaren Formula 1 Team',
      carModelName: 'McLaren MCL38 / MCL40',
      shortCarName: 'MCL38',
      carImage: '/images/teams/mcl38.webp',
      powerUnit: 'Mercedes-AMG M15 E Performance 1.6L V6 Turbo Hybrid',
      powerUnitSupplier: 'Mercedes-AMG High Performance Powertrains (Customer Unit)',
      engineOutput: '1,050+ HP · 15,000 RPM · Hệ truyền động Carbon 8 cấp',
      base: 'Woking, United Kingdom',
      teamPrincipal: 'Andrea Stella',
      driversVi: 'Lando Norris #4 · Oscar Piastri #81',
      driversEn: 'Lando Norris #4 · Oscar Piastri #81',
      bodyColor: '#ff8000',
      noseColor: '#ff8000',
      engineCoverColor: '#121417',
      sidepodColor: '#ff8000',
      airboxColor: '#121417',
      endplateColor: '#121417',
      bodyRoughness: 0.16,
      bodyMetalness: 0.25,
      bodyClearcoat: 1,
      wingColor: '#121417',
      wingRoughness: 0.22,
      wingMetalness: 0.3,
      haloColor: '#ff8000',
      haloRoughness: 0.18,
      haloMetalness: 0.3,
      floorColor: '#0c0d10',
      accentColor: '#ff8000',
      highlightColor: '#47c7fc',
      wheelCoverColor: '#111317',
      wheelAccentColor: '#ff8000',
      wheelSecondaryColor: '#47c7fc',
      wheelRimColor: '#ff8000',
      wheelPirelliCompound: 'medium',
      mirrorColor: '#ff8000',
      mirrorAccentColor: '#47c7fc',
      floorEdgeAccentColor: '#ff8000',
      seatbeltColor: '#ff8000',
      diffuserAccentColor: '#ff8000',
      rainLightColor: '#ff0033',
      aeroPhilosophyVi:
        'Hệ thống hốc gió hớt gầm sâu nhất đoàn đua (Extreme Undercut) và sàn xe Venturi tối ưu lực ép khi vào các góc cua tốc độ cao.',
      aeroPhilosophyEn:
        'Class-leading extreme undercut sidepod geometry feeding high-velocity air into an optimized ground-effect floor for apex stability.',
      powertrainNoteVi:
        'Tích hợp hoàn hảo khối động cơ Mercedes-AMG M15 với bộ làm mát nội bộ siêu gọn do đội ngũ kỹ sư tại Woking tự phát triển.',
      powertrainNoteEn:
        'Seamlessly packaged Mercedes-AMG M15 power unit paired with bespoke Woking-engineered compact cooling architecture.',
      schematicImage: '/images/showroom/schematics/mclaren.webp',
      schematicCode: 'MCL-38-CFD-8K',
      schematicTitleVi: 'Sơ đồ CFD & Khí động học 8K McLaren Racing MCL38',
      schematicTitleEn: 'McLaren Racing MCL38 8K CFD Aerodynamics Schematic',
    },
    redbull: {
      teamId: 'redbull',
      teamName: 'Red Bull',
      fullName: 'Oracle Red Bull Racing',
      carModelName: 'Red Bull Racing RB20 / RB22',
      shortCarName: 'RB20',
      carImage: '/images/teams/rb20.webp',
      powerUnit: 'Honda RBPTH002 1.6L V6 Turbo Hybrid',
      powerUnitSupplier: 'Red Bull Powertrains / Honda HRC',
      engineOutput: '1,050+ HP · Động cơ Honda HRC vô địch thế giới',
      base: 'Milton Keynes, United Kingdom',
      teamPrincipal: 'Christian Horner',
      driversVi: 'Max Verstappen #1 · Isack Hadjar #6',
      driversEn: 'Max Verstappen #1 · Isack Hadjar #6',
      bodyColor: '#0c192c',
      noseColor: '#0c192c',
      engineCoverColor: '#0c192c',
      sidepodColor: '#0c192c',
      airboxColor: '#ffce00',
      endplateColor: '#0c192c',
      bodyRoughness: 0.7,
      bodyMetalness: 0.1,
      bodyClearcoat: 0,
      wingColor: '#0c0f16',
      wingRoughness: 0.35,
      wingMetalness: 0.2,
      haloColor: '#0c192c',
      haloRoughness: 0.65,
      haloMetalness: 0.12,
      floorColor: '#080a0e',
      accentColor: '#ffce00',
      highlightColor: '#ed1a3b',
      wheelCoverColor: '#0c192c',
      wheelAccentColor: '#ffce00',
      wheelSecondaryColor: '#ed1a3b',
      wheelRimColor: '#ffce00',
      wheelPirelliCompound: 'medium',
      mirrorColor: '#0c192c',
      mirrorAccentColor: '#ffce00',
      floorEdgeAccentColor: '#ed1a3b',
      seatbeltColor: '#ed1a3b',
      diffuserAccentColor: '#ffce00',
      rainLightColor: '#ff0033',
      aeroPhilosophyVi:
        'Tuyệt tác khí động học với các hốc hút gió sườn đảo ngược (Overbite Inlet) và hệ thống treo trước Pull-rod chống chúi đầu khi phanh gấp.',
      aeroPhilosophyEn:
        'Pioneering overbite sidepod intake philosophy combined with anti-dive pull-rod front suspension maintaining steady platform ground clearance.',
      powertrainNoteVi:
        'Động cơ Honda RBPTH002 mang lại khả năng phân bổ mô-men xoắn tức thời và độ bền cơ học đã giành nhiều danh hiệu vô địch thế giới liên tiếp.',
      powertrainNoteEn:
        'Honda RBPTH002 power unit delivers instantaneous torque deployment, surgical driveability and proven championship-winning endurance.',
      schematicImage: '/images/showroom/schematics/redbull.webp',
      schematicCode: 'RBR-RB20-01-8K',
      schematicTitleVi: 'Sơ đồ CAD khí động học 8K Oracle Red Bull Racing RB20',
      schematicTitleEn: 'Oracle Red Bull Racing RB20-01 8K CAD Schematic',
    },
    astonmartin: {
      teamId: 'astonmartin',
      teamName: 'Aston Martin',
      fullName: 'Aston Martin Aramco Formula One Team',
      carModelName: 'Aston Martin AMR25 / AMR26',
      shortCarName: 'AMR25',
      carImage: '/images/teams/astonmartin.webp',
      powerUnit: 'Mercedes-AMG M15 1.6L V6 Turbo Hybrid',
      powerUnitSupplier: 'Mercedes-AMG HPP (Silverstone Customer)',
      engineOutput: '1,050+ HP · Hệ thống treo khí động học Mercedes',
      base: 'Silverstone, United Kingdom',
      teamPrincipal: 'Mike Krack',
      driversVi: 'Fernando Alonso #14 · Lance Stroll #18',
      driversEn: 'Fernando Alonso #14 · Lance Stroll #18',
      bodyColor: '#006f62',
      noseColor: '#006f62',
      engineCoverColor: '#006f62',
      sidepodColor: '#006f62',
      airboxColor: '#006f62',
      endplateColor: '#006f62',
      bodyRoughness: 0.15,
      bodyMetalness: 0.65,
      bodyClearcoat: 1,
      wingColor: '#0e1214',
      wingRoughness: 0.22,
      wingMetalness: 0.35,
      haloColor: '#006f62',
      haloRoughness: 0.18,
      haloMetalness: 0.5,
      floorColor: '#080b0a',
      accentColor: '#cedc00',
      highlightColor: '#006f62',
      wheelCoverColor: '#003d35',
      wheelAccentColor: '#cedc00',
      wheelSecondaryColor: '#006f62',
      wheelRimColor: '#cedc00',
      wheelPirelliCompound: 'medium',
      mirrorColor: '#006f62',
      mirrorAccentColor: '#cedc00',
      floorEdgeAccentColor: '#cedc00',
      seatbeltColor: '#cedc00',
      diffuserAccentColor: '#cedc00',
      rainLightColor: '#ff0033',
      aeroPhilosophyVi:
        'Máng trượt khí động học sườn xe sâu hút không khí dồn về phía sau kết hợp cánh sau DRS tối ưu lực cản tại đường thẳng.',
      aeroPhilosophyEn:
        'Deep waterslide sidepod gulley directing undisturbed ambient flow directly to the rear beam wing and upper diffuser.',
      powertrainNoteVi:
        'Sử dụng động cơ và hộp số Mercedes-AMG đặt trong khung gầm do đội ngũ kỹ sư tại đại bản doanh công nghệ cao Silverstone thiết kế.',
      powertrainNoteEn:
        'Mercedes-AMG powerplant housed within an ultra-stiff carbon cell developed inside the new state-of-the-art Silverstone AMR campus.',
      schematicImage: '/images/showroom/schematics/astonmartin.webp',
      schematicCode: 'AMR-24-SILVERSTONE-8K',
      schematicTitleVi: 'Sơ đồ CAD khí động học 8K Aston Martin AMR24 / AMR25',
      schematicTitleEn: 'Aston Martin Aramco AMR24 / AMR25 8K CAD Blueprint',
    },
    alpine: {
      teamId: 'alpine',
      teamName: 'Alpine',
      fullName: 'BWT Alpine Formula One Team',
      carModelName: 'Alpine A525 / A526',
      shortCarName: 'A525',
      carImage: '/images/teams/alpine.webp',
      powerUnit: 'Renault E-Tech RE25 1.6L V6 Turbo Hybrid',
      powerUnitSupplier: 'Alpine Racing (Viry-Châtillon, France)',
      engineOutput: '1,020+ HP · 15,000 RPM · Khung gầm Enstone Carbon',
      base: 'Enstone, United Kingdom / Viry, France',
      teamPrincipal: 'Oliver Oakes',
      driversVi: 'Pierre Gasly #10 · Franco Colapinto #43',
      driversEn: 'Pierre Gasly #10 · Franco Colapinto #43',
      bodyColor: '#0090ff',
      noseColor: '#0090ff',
      engineCoverColor: '#0090ff',
      sidepodColor: '#fd4bc7',
      airboxColor: '#0090ff',
      endplateColor: '#121417',
      bodyRoughness: 0.15,
      bodyMetalness: 0.42,
      bodyClearcoat: 1,
      wingColor: '#121417',
      wingRoughness: 0.22,
      wingMetalness: 0.3,
      haloColor: '#0090ff',
      haloRoughness: 0.18,
      haloMetalness: 0.4,
      floorColor: '#0c0e12',
      accentColor: '#fd4bc7',
      highlightColor: '#0090ff',
      wheelCoverColor: '#0d1722',
      wheelAccentColor: '#fd4bc7',
      wheelSecondaryColor: '#0090ff',
      wheelRimColor: '#0090ff',
      wheelPirelliCompound: 'soft',
      mirrorColor: '#0090ff',
      mirrorAccentColor: '#fd4bc7',
      floorEdgeAccentColor: '#fd4bc7',
      seatbeltColor: '#0090ff',
      diffuserAccentColor: '#fd4bc7',
      rainLightColor: '#ff0033',
      aeroPhilosophyVi:
        'Cấu trúc thân xe gọn gàng với triết lý tối giản hóa bề mặt ướt khí động và mũi xe dẹt hạ thấp trọng tâm quán tính.',
      aeroPhilosophyEn:
        'Slimline packaging prioritizing reduced wetted aero area with an ultra-low nosecone profile shifting roll centers forward.',
      powertrainNoteVi:
        'Động cơ Renault E-Tech phát triển tại Viry-Châtillon kết hợp bộ phận pin hồi lưu năng lượng điện phục vụ tăng tốc tức thì.',
      powertrainNoteEn:
        'Renault E-Tech hybrid unit engineered at Viry-Châtillon tuned for punchy corner-exit electrical deployment.',
      schematicImage: '/images/showroom/schematics/alpine.webp',
      schematicCode: 'ALP-A525-TECH-8K',
      schematicTitleVi: 'Sơ đồ CAD khí động học 8K BWT Alpine A525 Renault E-Tech',
      schematicTitleEn: 'BWT Alpine F1 Team A525 8K CAD Aero Blueprint',
    },
    racingbulls: {
      teamId: 'racingbulls',
      teamName: 'Racing Bulls',
      fullName: 'Visa Cash App Racing Bulls Formula One Team',
      carModelName: 'Racing Bulls VCARB 02 / 03',
      shortCarName: 'VCARB 02',
      carImage: '/images/teams/racingbulls.webp',
      powerUnit: 'Honda RBPTH002 1.6L V6 Turbo Hybrid',
      powerUnitSupplier: 'Red Bull Powertrains / Honda HRC',
      engineOutput: '1,050+ HP · Honda HRC · Hệ thống treo Red Bull',
      base: 'Faenza, Italy',
      teamPrincipal: 'Laurent Mekies',
      driversVi: 'Liam Lawson #30 · Arvid Lindblad #41',
      driversEn: 'Liam Lawson #30 · Arvid Lindblad #41',
      bodyColor: '#1434cb',
      noseColor: '#1434cb',
      engineCoverColor: '#1434cb',
      sidepodColor: '#1434cb',
      airboxColor: '#1434cb',
      endplateColor: '#121417',
      bodyRoughness: 0.14,
      bodyMetalness: 0.55,
      bodyClearcoat: 1,
      wingColor: '#121417',
      wingRoughness: 0.2,
      wingMetalness: 0.3,
      haloColor: '#1434cb',
      haloRoughness: 0.18,
      haloMetalness: 0.45,
      floorColor: '#0a0c10',
      accentColor: '#ffffff',
      highlightColor: '#d90429',
      wheelCoverColor: '#0e2270',
      wheelAccentColor: '#ffffff',
      wheelSecondaryColor: '#d90429',
      wheelRimColor: '#ffffff',
      wheelPirelliCompound: 'medium',
      mirrorColor: '#1434cb',
      mirrorAccentColor: '#ffffff',
      floorEdgeAccentColor: '#ffffff',
      seatbeltColor: '#1434cb',
      diffuserAccentColor: '#d90429',
      rainLightColor: '#ff0033',
      aeroPhilosophyVi:
        'Thừa hưởng cấu trúc hình học hệ thống treo và khí động học tương đồng với cỗ máy vô địch RB20 của đội mẹ Red Bull Racing.',
      aeroPhilosophyEn:
        'Direct aerodynamic and suspension synergy sharing proven pull-rod and floor concepts with the sister Red Bull Racing outfit.',
      powertrainNoteVi:
        'Trang bị khối động cơ Honda RBPTH002 cùng hệ thống thu hồi năng lượng hybrid đồng nhất với Oracle Red Bull Racing.',
      powertrainNoteEn:
        'Powered by the championship-winning Honda RBPTH002 hybrid unit alongside matched Red Bull transmission components.',
      schematicImage: '/images/showroom/schematics/racingbulls.webp',
      schematicCode: 'VCARB-01-FAENZA-8K',
      schematicTitleVi: 'Sơ đồ CAD khí động học 8K Visa Cash App RB VCARB 01',
      schematicTitleEn: 'Visa Cash App RB 01 8K Chassis & Aero Schematic',
    },
    haas: {
      teamId: 'haas',
      teamName: 'Haas',
      fullName: 'MoneyGram Haas F1 Team',
      carModelName: 'Haas VF-25 / VF-26',
      shortCarName: 'VF-25',
      carImage: '/images/teams/haas.webp',
      powerUnit: 'Ferrari 066/12 1.6L V6 Turbo Hybrid',
      powerUnitSupplier: 'Scuderia Ferrari (Maranello Customer)',
      engineOutput: '1,050+ HP · Hộp số & Hệ thống treo Ferrari',
      base: 'Kannapolis, United States / Banbury, UK',
      teamPrincipal: 'Ayao Komatsu',
      driversVi: 'Esteban Ocon #31 · Oliver Bearman #87',
      driversEn: 'Esteban Ocon #31 · Oliver Bearman #87',
      bodyColor: '#ffffff',
      noseColor: '#ffffff',
      engineCoverColor: '#121417',
      sidepodColor: '#121417',
      airboxColor: '#121417',
      endplateColor: '#121417',
      bodyRoughness: 0.18,
      bodyMetalness: 0.25,
      bodyClearcoat: 1,
      wingColor: '#121417',
      wingRoughness: 0.22,
      wingMetalness: 0.3,
      haloColor: '#ffffff',
      haloRoughness: 0.2,
      haloMetalness: 0.25,
      floorColor: '#0a0c0e',
      accentColor: '#e10600',
      highlightColor: '#ffffff',
      wheelCoverColor: '#181b20',
      wheelAccentColor: '#e10600',
      wheelSecondaryColor: '#ffffff',
      wheelRimColor: '#ffffff',
      wheelPirelliCompound: 'soft',
      mirrorColor: '#ffffff',
      mirrorAccentColor: '#e10600',
      floorEdgeAccentColor: '#e10600',
      seatbeltColor: '#e10600',
      diffuserAccentColor: '#e10600',
      rainLightColor: '#ff0033',
      aeroPhilosophyVi:
        'Triết lý khí động học theo trường phái Downwash của Ferrari, tối ưu hóa việc dẫn gió làm mát và giải quyết hiện tượng thoái hóa lốp.',
      aeroPhilosophyEn:
        'Ferrari-aligned downwash aero concept focusing on tyre-deg preservation and consistent aerodynamic platform balance.',
      powertrainNoteVi:
        'Sử dụng toàn bộ cụm động cơ đốt trong, mô-tơ MGU-K và hộp số 8 cấp được cung cấp trực tiếp từ đại bản doanh Maranello của Ferrari.',
      powertrainNoteEn:
        'Propelled by Ferrari’s works 066/12 hybrid powertrain and rear-end mechanical assembly straight from Maranello.',
      schematicImage: '/images/showroom/schematics/haas.webp',
      schematicCode: 'HAAS-VF24-SPEC-8K',
      schematicTitleVi: 'Sơ đồ CAD khí động học 8K MoneyGram Haas VF-24 / VF-25',
      schematicTitleEn: 'MoneyGram Haas F1 Team VF-24 8K Chassis Schematic',
    },
    williams: {
      teamId: 'williams',
      teamName: 'Williams',
      fullName: 'Williams Racing',
      carModelName: 'Williams FW47 / FW48',
      shortCarName: 'FW47',
      carImage: '/images/teams/williams.webp',
      powerUnit: 'Mercedes-AMG M15 1.6L V6 Turbo Hybrid',
      powerUnitSupplier: 'Mercedes-AMG HPP (Grove Customer)',
      engineOutput: '1,050+ HP · Hệ thống truyền động Mercedes 8 cấp',
      base: 'Grove, United Kingdom',
      teamPrincipal: 'James Vowles',
      driversVi: 'Carlos Sainz #55 · Alex Albon #23',
      driversEn: 'Carlos Sainz #55 · Alex Albon #23',
      bodyColor: '#001f54',
      noseColor: '#001f54',
      engineCoverColor: '#001f54',
      sidepodColor: '#001f54',
      airboxColor: '#b87333',
      endplateColor: '#001f54',
      bodyRoughness: 0.16,
      bodyMetalness: 0.45,
      bodyClearcoat: 1,
      wingColor: '#0a111a',
      wingRoughness: 0.2,
      wingMetalness: 0.3,
      haloColor: '#001f54',
      haloRoughness: 0.2,
      haloMetalness: 0.4,
      floorColor: '#080b0f',
      accentColor: '#00a3e0',
      highlightColor: '#b87333',
      wheelCoverColor: '#00173d',
      wheelAccentColor: '#00a3e0',
      wheelSecondaryColor: '#ffffff',
      wheelRimColor: '#00a3e0',
      wheelPirelliCompound: 'medium',
      mirrorColor: '#001f54',
      mirrorAccentColor: '#00a3e0',
      floorEdgeAccentColor: '#00a3e0',
      seatbeltColor: '#005aff',
      diffuserAccentColor: '#00a3e0',
      rainLightColor: '#ff0033',
      aeroPhilosophyVi:
        'Thân xe thiết kế cho tốc độ đường thẳng vượt trội, kết hợp sàn xe thế hệ mới giảm độ nhạy cảm trước gió tạt ngang góc cua.',
      aeroPhilosophyEn:
        'Renowned straight-line velocity pedigree coupled with modernized floor fences forgiving in sudden crosswind conditions.',
      powertrainNoteVi:
        'Động cơ Mercedes-AMG M15 cung cấp sức kéo uy mãnh và độ tin cậy cơ học cao giúp đội đua Grove cạnh tranh vị trí top đầu.',
      powertrainNoteEn:
        'Mercedes-AMG M15 power unit delivering relentless torque delivery and unmatched mechanical reliability for the Grove team.',
      schematicImage: '/images/showroom/schematics/williams.webp',
      schematicCode: 'WIL-FW46-GROVE-8K',
      schematicTitleVi: 'Sơ đồ CAD khí động học 8K Williams Racing FW46 / FW47',
      schematicTitleEn: 'Williams Racing FW46 8K CAD Chassis & Aero Flow Blueprint',
    },
    audi: {
      teamId: 'audi',
      teamName: 'Audi',
      fullName: 'Audi Formula One Team (Stake Sauber)',
      carModelName: 'Audi F1 R26 / Sauber C44',
      shortCarName: 'C44',
      carImage: '/images/teams/audi.webp',
      powerUnit: 'Ferrari 066/12 / Audi Sport F1 Power Unit',
      powerUnitSupplier: 'Audi Motorsport / Sauber Motorsport',
      engineOutput: '1,050+ HP · Khung gầm Carbon Hinwil',
      base: 'Hinwil, Switzerland / Neuburg, Germany',
      teamPrincipal: 'Mattia Binotto',
      driversVi: 'Nico Hülkenberg #27 · Gabriel Bortoleto #5',
      driversEn: 'Nico Hülkenberg #27 · Gabriel Bortoleto #5',
      bodyColor: '#52ff00',
      noseColor: '#0d0e11',
      engineCoverColor: '#0d0e11',
      sidepodColor: '#0d0e11',
      airboxColor: '#0d0e11',
      endplateColor: '#52ff00',
      bodyRoughness: 0.16,
      bodyMetalness: 0.35,
      bodyClearcoat: 1,
      wingColor: '#52ff00',
      wingRoughness: 0.2,
      wingMetalness: 0.3,
      haloColor: '#0d0e11',
      haloRoughness: 0.22,
      haloMetalness: 0.3,
      floorColor: '#080a0c',
      accentColor: '#52ff00',
      highlightColor: '#ffffff',
      wheelCoverColor: '#16191d',
      wheelAccentColor: '#52ff00',
      wheelSecondaryColor: '#c4c9ce',
      wheelRimColor: '#c4c9ce',
      wheelPirelliCompound: 'soft',
      mirrorColor: '#0d0e11',
      mirrorAccentColor: '#52ff00',
      floorEdgeAccentColor: '#52ff00',
      seatbeltColor: '#52ff00',
      diffuserAccentColor: '#52ff00',
      rainLightColor: '#ff0033',
      aeroPhilosophyVi:
        'Triết lý "Vorsprung durch Technik": Thiết kế khí động học sắc bén nguyên khối phát triển song song tại Hinwil và Neuburg.',
      aeroPhilosophyEn:
        'Vorsprung durch Technik: Ultra-sharp monolithic aerodynamic surfaces refined in Hinwil’s state-of-the-art wind tunnel.',
      powertrainNoteVi:
        'Cột mốc lịch sử khi Audi tự nghiên cứu và chế tạo toàn bộ khối động cơ Turbo Hybrid tại Neuburg phục vụ kỷ nguyên F1.',
      powertrainNoteEn:
        'Audi’s historic all-new factory power unit engineered from the ground up at the Competence Center Motorsport in Neuburg.',
      schematicImage: '/images/showroom/schematics/audi.webp',
      schematicCode: 'AUDI-R26-NEUBURG-8K',
      schematicTitleVi: 'Sơ đồ CAD khí động học 8K Audi F1 Team (Neuburg Spec)',
      schematicTitleEn: 'Audi Sport F1 Power Unit & Aero 8K Schematic (RS F1-01)',
    },
    cadillac: {
      teamId: 'cadillac',
      teamName: 'Cadillac',
      fullName: 'Cadillac Formula 1 Team',
      carModelName: 'Cadillac MAC-26',
      shortCarName: 'MAC-26',
      carImage: '/images/teams/cadillac.webp',
      powerUnit: 'Ferrari 066/12 / GM F1 Twin-Turbo V6 Hybrid',
      powerUnitSupplier: 'General Motors / Cadillac Racing',
      engineOutput: '1,050+ HP · Hợp tác động cơ Maranello & GM',
      base: 'Fishers, Indiana, United States / Silverstone, UK',
      teamPrincipal: 'Michael Andretti',
      driversVi: 'Sergio Pérez #11 · Valtteri Bottas #77',
      driversEn: 'Sergio Pérez #11 · Valtteri Bottas #77',
      bodyColor: '#0a0b0d',
      noseColor: '#0a0b0d',
      engineCoverColor: '#0a0b0d',
      sidepodColor: '#0a0b0d',
      airboxColor: '#0a0b0d',
      endplateColor: '#0a0b0d',
      bodyRoughness: 0.38,
      bodyMetalness: 0.3,
      bodyClearcoat: 0.3,
      wingColor: '#0a0b0d',
      wingRoughness: 0.22,
      wingMetalness: 0.45,
      haloColor: '#0a0b0d',
      haloRoughness: 0.25,
      haloMetalness: 0.4,
      floorColor: '#08090a',
      accentColor: '#cda851',
      highlightColor: '#cda851',
      wheelCoverColor: '#0a0b0d',
      wheelAccentColor: '#cda851',
      wheelSecondaryColor: '#ffffff',
      wheelRimColor: '#cda851',
      wheelPirelliCompound: 'medium',
      mirrorColor: '#0a0b0d',
      mirrorAccentColor: '#cda851',
      floorEdgeAccentColor: '#cda851',
      seatbeltColor: '#cda851',
      diffuserAccentColor: '#cda851',
      rainLightColor: '#ff0033',
      aeroPhilosophyVi:
        'Thiết kế khí động học mang đậm phong cách cơ bắp Mỹ với cánh gió trước hình khiên và hốc gió tản nhiệt cỡ lớn.',
      aeroPhilosophyEn:
        'Bold American motorsport aerodynamic identity incorporating high-authority front wing planes and aggressive radiator gills.',
      powertrainNoteVi:
        'Khởi đầu với sự kết hợp động cơ Ferrari và dần chuyển giao công nghệ sang động cơ GM F1 Twin-Turbo tự phát triển.',
      powertrainNoteEn:
        'Debuting with proven Maranello hybrid power while developing GM’s dedicated American factory F1 power unit.',
      schematicImage: '/images/showroom/schematics/cadillac.webp',
      schematicCode: 'CAD-MAC26-USA-8K',
      schematicTitleVi: 'Sơ đồ CAD khí động học 8K Cadillac F1 Team MAC-26',
      schematicTitleEn: 'Cadillac F1 Chassis & Aerodynamic 8K Schematic (MAC-26)',
    },
  };
for (const n of dn) {
  const t = ne[n.teamId];
  t &&
    ((t.carModelName = `${n.name} · ${n.season}`),
    (t.shortCarName = n.shortName),
    (t.schematicTitleVi = `Sơ đồ minh họa — ${n.name} · ${n.season}`),
    (t.schematicTitleEn = `Illustrative schematic — ${n.name} · ${n.season}`));
}
const z = (n) => ne[n] || ne.ferrari,
  ve = {
    ferrari: {
      wings: {
        titleVi: 'Cánh Gió Trước Cận Cảnh · Ferrari SF-26',
        titleEn: 'Ferrari SF-26 Front Wing Macro Close-up',
        partCode: 'FER-AERO-FW-26',
        imageUrl: '/images/showroom/closeups/ferrari_wings.webp',
        conceptVi:
          'Cận cảnh cánh gió trước Ferrari trong sắc đỏ Rosso Corsa kết hợp sọc vàng Modena đặc trưng. Kết cấu sợi carbon 40 lớp chịu lực nén hơn 450 kg tại 250 km/h với các khe chia gió Outwash triệt tiêu nhiễu động bánh xe.',
        conceptEn:
          'Macro close-up of the Ferrari front wing in iconic Rosso Corsa with Modena yellow accents. Aerospace-grade 40-ply carbon fiber generating over 450 kg downforce with outwash endplate strakes.',
        highlightsVi: [
          'Vật liệu Carbon T1000 siêu nhẹ sơn phủ bóng Rosso Corsa thủ công tại Maranello.',
          '4 tầng cánh Flaps điều chỉnh góc tấn công bằng vít vi chỉnh titan cấp độ milimet.',
          'Rãnh dẫn khí Outwash điều hướng luồng xoáy Y250 bọc ngoài bánh xe trước.',
        ],
        highlightsEn: [
          'Ultra-lightweight T1000 carbon fiber finished in hand-polished Rosso Corsa.',
          'Four cascade wing elements with millimeter-precision titanium angle-of-attack adjusters.',
          'Outwash endplate flow-conditioners routing Y250 vortex wake around the front tires.',
        ],
        specs: [
          { labelVi: 'Vật liệu', labelEn: 'Material', value: 'Carbon Pre-preg T1000 & Titanium' },
          { labelVi: 'Lực nén cực đại', labelEn: 'Peak Downforce', value: '460 kg @ 250 km/h' },
          { labelVi: 'Trọng lượng cụm cánh', labelEn: 'Assembly Weight', value: '9.8 kg' },
          { labelVi: 'Quy chuẩn', labelEn: 'Regulation', value: 'FIA 2026 1900mm Envelope' },
        ],
      },
      power_unit: {
        titleVi: 'Bộ Động Cơ Hybrid Ferrari 066/12 Cận Cảnh',
        titleEn: 'Ferrari 066/12 Power Unit Cutaway Close-up',
        partCode: 'FER-PU-066/12-HYBRID',
        imageUrl: '/images/showroom/closeups/ferrari_power_unit.webp',
        conceptVi:
          'Cận cảnh khối động cơ Ferrari 066/12 với nắp máy sơn sần đỏ Cavallino Rampante huyền thoại. Cụm tăng áp đơn Turbocharger kết nối cổ xả titan nung màu xanh tím cùng mô-tơ MGU-K dây quấn cam chống quá nhiệt.',
        conceptEn:
          'Direct macro cutaway of Ferrari’s 066/12 power unit featuring the crackle-red cam covers with the chrome prancing horse, glowing titanium exhaust headers, and high-voltage MGU-K motor.',
        highlightsVi: [
          'Buồng đốt phụ TJI (Turbulent Jet Ignition) đạt áp suất nén cực đại trên 300 bar.',
          'Cổ góp xả bằng hợp kim Inconel & Titanium chịu nhiệt độ khí xả trên 1,000°C.',
          'Mô-tơ điện MGU-K 350 kW thu hồi 8.5 MJ điện năng mỗi vòng đua, phóng thêm gần 470 mã lực tức thì.',
        ],
        highlightsEn: [
          'Turbulent Jet Ignition (TJI) combustion chambers operating above 300 bar pressure.',
          'Inconel and titanium exhaust headers built to sustain 1,000°C+ thermal blasts.',
          'MGU-K motor recuperating 8.5 MJ per lap, deploying nearly 470 instant electric horsepower.',
        ],
        specs: [
          { labelVi: 'Cấu hình', labelEn: 'Layout', value: '1.6L 90° V6 Turbo + MGU-K (2026)' },
          { labelVi: 'Tổng công suất', labelEn: 'Peak Output', value: '1,050+ Mã Lực (BHP)' },
          { labelVi: 'Vòng tua tối đa', labelEn: 'RPM Limit', value: '15,000 RPM' },
          { labelVi: 'Hiệu suất nhiệt', labelEn: 'Thermal Efficiency', value: '> 52.4% (Kỷ lục)' },
        ],
      },
      halo: {
        titleVi: 'Khung An Toàn Halo & Vô Lăng Ferrari Cận Cảnh',
        titleEn: 'Ferrari Halo & Cockpit Display Close-up',
        partCode: 'FER-SAFE-HALO-TITAN',
        imageUrl: '/images/showroom/closeups/ferrari_halo.webp',
        conceptVi:
          'Góc nhìn cận cảnh từ buồng lái Ferrari SF-26 qua vòm Halo titan sơn đỏ Rosso Corsa. Phía trước là vô lăng sợi carbon tích hợp màn hình OLED hiển thị vòng tua máy, số đang gài và hệ thống ERS.',
        conceptEn:
          'Cockpit perspective of the Ferrari SF-26 titanium Halo in vibrant Rosso Corsa, framing the carbon fiber race steering wheel with its telemetry OLED display and rev LED shift lights.',
        highlightsVi: [
          'Khung hợp kim Titan Grade 5 chịu lực ép tĩnh 121 kN (tương đương 12.3 tấn).',
          'Lớp vỏ khí động carbon bọc ngoài với cánh dẫn khí vi mô chống nhiễu động vào Airbox.',
          'Vô lăng carbon hiển thị dữ liệu thời gian thực: phân bổ phanh, bản đồ vi sai và DRS.',
        ],
        highlightsEn: [
          'Grade 5 Titanium core withstanding 121 kN (12.3 tonnes) static load.',
          'Aerodynamic carbon fairing with micro-vortex generators feeding clean air to engine airbox.',
          'Full carbon steering wheel with real-time brake bias, differential maps, and DRS indicators.',
        ],
        specs: [
          { labelVi: 'Vật liệu khung', labelEn: 'Structure', value: 'Titanium Grade 5 (Ti6Al4V)' },
          { labelVi: 'Trọng lượng thô', labelEn: 'Bare Weight', value: '7.0 kg' },
          { labelVi: 'Khả năng chịu tải', labelEn: 'Test Load', value: '121 kN (12.3 Tấn)' },
          { labelVi: 'Thời gian thoát hiểm', labelEn: 'Egress Limit', value: '< 7.0 Giây' },
        ],
      },
      drs: {
        titleVi: 'Cánh Gió Sau & Cơ Cấu Mở DRS · Ferrari SF-26',
        titleEn: 'Ferrari SF-26 Rear Wing & DRS Actuator Close-up',
        partCode: 'FER-AERO-RW-DRS',
        imageUrl: '/images/showroom/closeups/ferrari_drs.webp',
        conceptVi:
          'Cận cảnh cánh gió sau Ferrari với pít-tông thủy lực kích hoạt nâng cánh phụ DRS lên 85 mm. Khi mở, toàn bộ lực cản không khí phần đuôi giảm 30%, tăng ngay 20 km/h trên đoạn thẳng.',
        conceptEn:
          'Macro close-up of Ferrari’s rear wing showing the high-pressure hydraulic DRS actuator pivoting open by 85 mm, cutting drag by 30% for a 20 km/h overtake boost.',
        highlightsVi: [
          'Thời gian mở/đóng thủy lực dưới 250 mili-giây, ngắt tức thì khi đạp phanh.',
          'Cánh phụ Beam Wing phía dưới tăng cường hiệu suất hút gió của bộ khuếch tán sàn.',
          'Đèn an toàn mưa LED FIA tích hợp cảnh báo sạc năng lượng ERS.',
        ],
        highlightsEn: [
          'Sub-250ms hydraulic actuation response snapping shut on brake pedal contact.',
          'Lower beam wings amplifying rear underfloor diffuser suction.',
          'Integrated FIA rain LED with flashing green hybrid energy deployment warning.',
        ],
        specs: [
          { labelVi: 'Độ mở cánh (Slot Gap)', labelEn: 'Flap Opening', value: '85 mm (Chuẩn FIA)' },
          { labelVi: 'Tốc độ tăng thêm', labelEn: 'Top Speed Gain', value: '+18 – 25 km/h' },
          { labelVi: 'Áp suất thủy lực', labelEn: 'Hydraulic Pressure', value: '200+ Bar' },
          { labelVi: 'Giảm lực cản', labelEn: 'Drag Reduction', value: '~30% Total Drag' },
        ],
      },
      sidepods: {
        titleVi: 'Hốc Gió Sườn & Rãnh Khí Động Bathtub · Ferrari SF-26',
        titleEn: 'Ferrari SF-26 Bathtub Sidepod & Undercut Close-up',
        partCode: 'FER-AERO-SP-BATHTUB',
        imageUrl: '/images/showroom/closeups/ferrari_sidepods.webp',
        conceptVi:
          'Cận cảnh thiết kế sườn xe dạng bồn tắm (Bathtub downwash sidepods) độc quyền của Ferrari. Hốc gió dẫn luồng khí làm mát động cơ và ép dòng khí áp suất cao đi sát eo xe về sàn sau.',
        conceptEn:
          'Macro view of Ferrari’s signature bathtub-style sidepod gulley, channeling cooling ambient air to radiators while pressing high-energy airflow down to the diffuser.',
        highlightsVi: [
          'Máng trượt khí động dẫn luồng không khí sạch dồn vào cánh sau Beam Wing.',
          'Cấu trúc chống va đập cạnh sườn SIS tiêu chuẩn FIA bảo vệ tay đua.',
          'Các khe tản nhiệt mang cá mở rộng linh hoạt tùy theo nhiệt độ ngoài trời.',
        ],
        highlightsEn: [
          'Downwash channel sweeping clean air directly to the rear beam wing.',
          'FIA-certified Side Impact Spars (SIS) absorbing lateral crash energy.',
          'Interchangeable cooling louvers customized per race weekend temperature.',
        ],
        specs: [
          {
            labelVi: 'Kiến trúc khí động',
            labelEn: 'Aero Architecture',
            value: 'Sculpted Bathtub Downwash',
          },
          { labelVi: 'Nhiệt lượng tản', labelEn: 'Thermal Relief', value: '> 145 kW' },
          { labelVi: 'Vật liệu thân vỏ', labelEn: 'Bodywork', value: 'Carbon-Nomex Honeycomb' },
          { labelVi: 'Độ dày thành vỏ', labelEn: 'Shell Thickness', value: '1.2 – 1.8 mm' },
        ],
      },
      tires: {
        titleVi: 'Lốp Pirelli 18-Inch & Phanh Đĩa Carbon Brembo Cận Cảnh',
        titleEn: 'Pirelli 18-inch Tire & Brembo Carbon Brake Close-up',
        partCode: 'FER-CHASSIS-BRK-BREMBO',
        imageUrl: '/images/showroom/closeups/ferrari_tires.webp',
        conceptVi:
          'Cận cảnh mâm hợp kim Magiê 18 inch kết hợp cùm phanh Brembo và đĩa phanh carbon-carbon. Hơn 1,000 lỗ thông gió li ti giúp đĩa phanh giải nhiệt khi đạt nhiệt độ trên 1,000°C sau cú phanh 5G.',
        conceptEn:
          'Close-up of the 18-inch forged magnesium rim housing Brembo carbon-carbon brake discs. Over 1,000 cooling holes dissipate heat as discs glow red at 1,000°C under 5G deceleration.',
        highlightsVi: [
          'Đĩa phanh carbon Brembo dày 32mm với 1,050 lỗ tản nhiệt khoan chéo.',
          'Mâm xe có ốp khí động học (Wheel Cover) triệt tiêu nhiễu động vành xoay.',
          'Hợp chất lốp mềm P Zero Red C5 cho độ bám cơ học đỉnh cao khi ôm cua.',
        ],
        highlightsEn: [
          'Brembo 32mm carbon brake disc with 1,050 diagonally drilled cooling vents.',
          'Aerodynamic wheel covers eliminating chaotic rim turbulence.',
          'Pirelli P Zero Red C5 soft compound providing peak mechanical grip in corners.',
        ],
        specs: [
          { labelVi: 'Đường kính mâm', labelEn: 'Rim Size', value: '18 inches (Forged Magnesium)' },
          { labelVi: 'Nhiệt độ đĩa phanh', labelEn: 'Brake Disc Temp', value: 'Up to 1,050°C' },
          { labelVi: 'Lực hãm phanh', labelEn: 'Peak Decel', value: '> 5.5 G' },
          { labelVi: 'Áp suất lốp', labelEn: 'Tire Pressure', value: '21.5 – 24.0 PSI' },
        ],
      },
    },
    mclaren: {
      wings: {
        titleVi: 'Cánh Gió Trước Cận Cảnh · McLaren MCL38',
        titleEn: 'McLaren MCL38 Front Wing Macro Close-up',
        partCode: 'MCL-AERO-FW-38',
        imageUrl: '/images/showroom/closeups/mclaren_wings.webp',
        conceptVi:
          'Cận cảnh cánh gió trước McLaren MCL38 trong sắc cam Papaya huyền thoại kết hợp sợi carbon dệt đen bóng. Cụm cánh đa tầng với các rãnh Outwash dẫn luồng xoáy bọc quanh bánh trước, tối ưu hóa lực nén 465 kg tại 250 km/h.',
        conceptEn:
          'Macro close-up of the McLaren MCL38 front wing assembly finished in iconic Papaya Orange and raw carbon fiber weave. Multi-tier cascades generate 465 kg downforce with extreme outwash endplates.',
        highlightsVi: [
          'Sợi carbon Toray T1100 siêu nhẹ sơn phủ cam Papaya thủ công tại Trung tâm Công nghệ Woking.',
          'Bộ 4 tầng cánh Flaps điều chỉnh góc mở chính xác đến từng phần mười độ.',
          'Cụm Endplate dốc tạo luồng gió bọc quanh lốp trước giảm thiểu lực cản cuộn xoáy.',
        ],
        highlightsEn: [
          'Ultra-lightweight Toray T1100 carbon finished in iconic Woking Papaya.',
          'Precision 4-element adjustable cascade for surgical downforce tuning.',
          'Aggressive outwash endplates routing tire wake far away from floor tunnels.',
        ],
        specs: [
          { labelVi: 'Vật liệu', labelEn: 'Material', value: 'Pre-preg Carbon T1100 & Titanium' },
          { labelVi: 'Lực nén cực đại', labelEn: 'Peak Downforce', value: '465 kg @ 250 km/h' },
          { labelVi: 'Khối lượng cụm', labelEn: 'Assembly Weight', value: '9.6 kg' },
          { labelVi: 'Màu tem', labelEn: 'Livery', value: 'McLaren Papaya & Anthracite' },
        ],
      },
      power_unit: {
        titleVi: 'Bộ Động Cơ Mercedes-AMG M15 Hybrid · McLaren MCL38',
        titleEn: 'McLaren MCL38 Mercedes-AMG M15 Power Unit Close-up',
        partCode: 'MCL-PU-M15-HYBRID',
        imageUrl: '/images/showroom/closeups/mclaren_power_unit.webp',
        conceptVi:
          'Cận cảnh khu vực động cơ McLaren MCL38 với cửa hút gió Airbox bọc tem Android/Google. Bên trong là cỗ máy Mercedes-AMG M15 1.6L V6 Turbo Hybrid công suất hơn 1,050 mã lực, tối ưu khí động học thân xe cực mỏng.',
        conceptEn:
          'Close-up of the McLaren MCL38 engine compartment and overhead airbox featuring Android/Google branding. Houses the Mercedes-AMG M15 1.6L V6 Turbo Hybrid delivering over 1,050 combined horsepower.',
        highlightsVi: [
          'Cấu trúc tách rời Turbo nén và xả (Split-Turbo) đặt gọn trong khoang máy hẹp của McLaren.',
          'Hệ thống thu hồi động năng MGU-K 350 kW và pin lưu trữ ERS phóng thêm gần 470 mã lực tức thì.',
          'Thân vỏ carbon ôm sát động cơ giảm tối đa lực cản không khí ở tốc độ cao.',
        ],
        highlightsEn: [
          'Pioneering split-turbo layout tightly integrated into McLaren’s ultra-compact chassis.',
          'MGU-K motor and battery energy store deploying nearly 470 instantaneous electric BHP.',
          'Shrink-wrapped carbon engine cover minimizing aerodynamic drag profile.',
        ],
        specs: [
          {
            labelVi: 'Khối động cơ',
            labelEn: 'Engine Type',
            value: 'Mercedes-AMG M15 1.6L V6 Turbo',
          },
          { labelVi: 'Tổng công suất', labelEn: 'Total Output', value: '1,050+ HP' },
          { labelVi: 'Hiệu suất nhiệt', labelEn: 'Thermal Efficiency', value: '> 51%' },
          {
            labelVi: 'Đối tác động cơ',
            labelEn: 'Engine Partner',
            value: 'Mercedes-AMG High Performance',
          },
        ],
      },
      halo: {
        titleVi: 'Khung Bảo Vệ Titan Halo Cam Papaya · McLaren MCL38',
        titleEn: 'McLaren MCL38 Papaya Titanium Halo Close-up',
        partCode: 'MCL-SAFE-HALO-PAPAYA',
        imageUrl: '/images/showroom/closeups/mclaren_halo.webp',
        conceptVi:
          'Cận cảnh vòm an toàn Halo titan trên xe McLaren MCL38 phủ sơn cam Papaya rực rỡ. Bảo vệ tối đa khoang lái của Lando Norris và Oscar Piastri trước mọi lực va chạm cực hạn lên tới 12.3 tấn.',
        conceptEn:
          'Macro close-up of the McLaren MCL38 Grade 5 Titanium Halo in vibrant Papaya Orange, shielding drivers Lando Norris and Oscar Piastri against catastrophic 12.3-tonne static impacts.',
        highlightsVi: [
          'Lõi hợp kim Titan Grade 5 chịu tải trọng tĩnh 121 kN đạt chuẩn kiểm định an toàn FIA.',
          'Lớp ốp khí động học bọc ngoài hướng luồng gió trực diện vào cửa hút Airbox phía sau.',
          'Góc quan sát buồng lái tích hợp gương chiếu hậu khí động và camera hành trình HD.',
        ],
        highlightsEn: [
          'Grade 5 Titanium core withstanding 121 kN (12.3 tonnes) static FIA proof load.',
          'Sculpted carbon aerodynamic fairing laminating airflow into the overhead engine intake.',
          'Optimized cockpit aperture with integrated aerodynamic mirrors and HD onboard cameras.',
        ],
        specs: [
          {
            labelVi: 'Vật liệu cốt',
            labelEn: 'Core Material',
            value: 'Titanium Grade 5 (Ti6Al4V)',
          },
          { labelVi: 'Trọng lượng khung', labelEn: 'Weight', value: '7.0 kg' },
          { labelVi: 'Khả năng chịu tải', labelEn: 'Load Capacity', value: '121 kN (12.3 Tấn)' },
          { labelVi: 'Màu sơn', labelEn: 'Finish', value: 'McLaren Papaya Gloss' },
        ],
      },
      drs: {
        titleVi: 'Cánh Gió Sau DRS Thương Hiệu OKX · McLaren MCL38',
        titleEn: 'McLaren MCL38 Rear Wing & OKX DRS Mechanism Close-up',
        partCode: 'MCL-AERO-DRS-OKX',
        imageUrl: '/images/showroom/closeups/mclaren_drs.webp',
        conceptVi:
          'Cận cảnh cánh gió đuôi McLaren MCL38 với nhận diện OKX và cơ cấu mở cánh DRS điều khiển thủy lực. Mở góc 85 mm giúp xe đạt vận tốc tức thời trên 345 km/h trên những đoạn thẳng dài.',
        conceptEn:
          'Close-up of the McLaren MCL38 rear wing displaying OKX livery and rapid hydraulic DRS flap actuator. Opening 85 mm delivers a top speed surge beyond 345 km/h.',
        highlightsVi: [
          'Thời gian bung mở cánh lướt gió dưới 200 mili-giây qua pít-tông thủy lực 200 bar.',
          'Tự động đóng cánh an toàn chỉ trong 1 phần trăm giây ngay khi phát hiện đạp phanh.',
          'Cánh Beam Wing phía dưới khuếch đại dòng hút của bộ khuếch tán sàn sau.',
        ],
        highlightsEn: [
          'Sub-200ms rapid hydraulic actuation driven by 200+ bar pressure lines.',
          'Instant fail-safe closure triggered the millisecond braking pressure begins.',
          'Lower beam wing elements amplifying ground-effect underfloor suction.',
        ],
        specs: [
          { labelVi: 'Độ mở cánh DRS', labelEn: 'DRS Slot Gap', value: '85 mm (FIA Spec)' },
          { labelVi: 'Tốc độ tăng thêm', labelEn: 'Top Speed Gain', value: '+20 – 24 km/h' },
          { labelVi: 'Vật liệu', labelEn: 'Composite', value: 'High-Modulus Pre-preg Carbon' },
          { labelVi: 'Tài trợ chính', labelEn: 'Livery Sponsor', value: 'OKX & Android' },
        ],
      },
      sidepods: {
        titleVi: 'Hốc Gió Sườn Undercut & Rãnh Downwash · McLaren MCL38',
        titleEn: 'McLaren MCL38 Downwash Sidepod & Undercut Close-up',
        partCode: 'MCL-AERO-SP-DOWNWASH',
        imageUrl: '/images/showroom/closeups/mclaren_sidepods.webp',
        conceptVi:
          'Cận cảnh thiết kế sườn xe khí động học của McLaren MCL38 với hốc gió thuôn dài, rãnh khoét sâu Undercut và máng trượt Downwash ép dòng khí áp suất cao xuống sàn xe và cánh sau.',
        conceptEn:
          'Macro close-up of the McLaren MCL38 sidepod architecture showcasing aggressive undercuts and smooth downwash gulleys directing high-energy airflow toward the rear diffuser.',
        highlightsVi: [
          'Rãnh khoét sườn Undercut cực sâu tối đa hóa luồng khí chảy vào sàn gầm Venturi.',
          'Vỏ carbon chịu nhiệt phủ logo Vuse và Tezos bảo vệ dàn tản nhiệt kép bên trong.',
          'Khe tản nhiệt mang cá mở rộng tùy biến theo nhiệt độ từng chặng đua.',
        ],
        highlightsEn: [
          'Deep waist undercut feeding massive laminar airflow into underfloor Venturi tunnels.',
          'Thermal-insulated carbon body panels carrying Vuse and Tezos sponsor decals.',
          'Modular cooling gills optimized for track temperature demands.',
        ],
        specs: [
          {
            labelVi: 'Triết lý khí động',
            labelEn: 'Aero Concept',
            value: 'Extreme Downwash Undercut',
          },
          { labelVi: 'Giải nhiệt động cơ', labelEn: 'Cooling Capacity', value: '> 145 kW' },
          {
            labelVi: 'Vật liệu thân vỏ',
            labelEn: 'Body Composite',
            value: 'Carbon-Nomex Honeycomb',
          },
          { labelVi: 'Màu hoàn thiện', labelEn: 'Finish', value: 'Papaya Orange & Matte Carbon' },
        ],
      },
      tires: {
        titleVi: 'Lốp Pirelli & Ốp Mâm Google Chrome Cận Cảnh · McLaren',
        titleEn: 'McLaren MCL38 Pirelli Tires & Google Chrome Wheel Covers',
        partCode: 'MCL-CHASSIS-BRK-CHROME',
        imageUrl: '/images/showroom/closeups/mclaren_tires.webp',
        conceptVi:
          'Cận cảnh mâm hợp kim ma-giê 18 inch trên xe McLaren MCL38 trang bị ốp mâm khí động học đa sắc màu Google Chrome đặc trưng, kết hợp cùm phanh Brembo carbon chịu nhiệt trên 1,000°C.',
        conceptEn:
          'Close-up of the 18-inch forged magnesium rim on the McLaren MCL38 featuring signature Google Chrome rainbow aero wheel covers and Brembo carbon-carbon brake discs enduring 1,000°C+ stops.',
        highlightsVi: [
          'Ốp mâm khí động học Google Chrome triệt tiêu luồng xoáy hỗn loạn của vành bánh xoay.',
          'Đĩa phanh carbon Brembo tản nhiệt qua hơn 1,000 lỗ khoan chéo chịu lực phanh 5.5G.',
          'Hợp chất lốp Pirelli P Zero tối ưu hóa độ bám đường trên từng mét cua.',
        ],
        highlightsEn: [
          'Signature Google Chrome aerodynamic wheel covers smoothing wheel rim turbulence.',
          'Brembo carbon-carbon brake rotor with 1,000+ cooling vents absorbing 5.5G deceleration.',
          'Pirelli P Zero compound delivering pinpoint mechanical grip.',
        ],
        specs: [
          { labelVi: 'Kích cỡ mâm', labelEn: 'Rim Size', value: '18 inches (Forged Magnesium)' },
          { labelVi: 'Nhiệt độ phanh tối đa', labelEn: 'Max Brake Temp', value: '1,050°C' },
          { labelVi: 'Lực hãm phanh', labelEn: 'Deceleration', value: '> 5.5 G' },
          { labelVi: 'Đối tác bánh xe', labelEn: 'Partners', value: 'Pirelli & Google Chrome' },
        ],
      },
    },
    mercedes: {
      wings: {
        titleVi: 'Cánh Gió Trước Cận Cảnh · Mercedes-AMG W15',
        titleEn: 'Mercedes-AMG W15 Front Wing Macro Close-up',
        partCode: 'MB-AERO-FW-W15',
        imageUrl: '/images/showroom/closeups/mercedes_wings.webp',
        conceptVi:
          'Cận cảnh cánh gió trước Mercedes W15 phối màu Bạc Mũi Tên Bạc (Silver Arrows) kết hợp dải xanh ngọc lục bảo Petronas. Thiết kế mũi xe thanh mảnh với các rãnh chia gió triệt tiêu nhiễu động bánh xe.',
        conceptEn:
          'Macro close-up of the Mercedes W15 front wing finished in Silver Arrow metallic and Petronas Emerald Turquoise. Features a sculpted needle nose and cascades shedding front-tire turbulence.',
        highlightsVi: [
          'Vỏ cánh trước hoàn thiện phủ bạc metallic kết hợp điểm nhấn xanh Petronas.',
          'Mũi xe vuốt dốc tối ưu hóa luồng khí chảy vào họng gầm Venturi.',
          'Cụm điều khiển góc cánh bằng sợi carbon đa hướng gia cố titan.',
        ],
        highlightsEn: [
          'Silver Arrow metallic surface with Petronas turquoise aerodynamic tips.',
          'Low-drag nosecone profile conditioning laminar flow into underfloor tunnels.',
          'Multi-element carbon flap assembly with titanium-reinforced pivots.',
        ],
        specs: [
          { labelVi: 'Vật liệu', labelEn: 'Material', value: 'High-Modulus Carbon & Titanium' },
          { labelVi: 'Lực nén cực đại', labelEn: 'Peak Downforce', value: '455 kg @ 250 km/h' },
          { labelVi: 'Khối lượng cụm', labelEn: 'Weight', value: '10.1 kg' },
          { labelVi: 'Triết lý', labelEn: 'Philosophy', value: 'Silver Arrow Low-Wake Flow' },
        ],
      },
      power_unit: {
        titleVi: 'Động Cơ Mercedes-AMG M15 E Performance Cận Cảnh',
        titleEn: 'Mercedes-AMG M15 E Performance Power Unit Close-up',
        partCode: 'MB-PU-M15-BRIXWORTH',
        imageUrl: '/images/showroom/closeups/mercedes_power_unit.webp',
        conceptVi:
          'Cận cảnh cỗ máy Mercedes-AMG M15 chế tác tại Brixworth, vương quốc Anh. Động cơ tăng áp Turbo Hybrid dẫn đầu về độ tin cậy và hiệu suất thu hồi động năng MGU-K 350 kW theo luật 2026 (đã bỏ MGU-H).',
        conceptEn:
          'Detailed engineering cutaway of the Brixworth-built Mercedes-AMG M15 power unit, renowned for unrivaled reliability and thermodynamic energy harvesting.',
        highlightsVi: [
          'Thiết kế tách rời trục Turbo nén và xả (Split-Turbo) đặt ở hai đầu động cơ.',
          'Bộ tản nhiệt nước tích hợp siêu nhỏ gọn ép sát khối máy V6.',
          'Công suất hơn 1050 mã lực kết hợp mô-tơ MGU-K bền bỉ qua trọn vẹn mùa giải.',
        ],
        highlightsEn: [
          'Pioneering split-turbo architecture separating compressor and turbine.',
          'Ultra-compact water-to-air charge coolers nestled tightly against the V6 block.',
          '1050+ combined horsepower with class-leading season endurance.',
        ],
        specs: [
          { labelVi: 'Cấu hình', labelEn: 'Engine Type', value: '1.6L 90° V6 Single Turbo Hybrid' },
          { labelVi: 'Công suất', labelEn: 'Total Output', value: '1,050+ HP' },
          { labelVi: 'Địa điểm chế tác', labelEn: 'Origin', value: 'Brixworth, United Kingdom' },
          { labelVi: 'Dung lượng ERS', labelEn: 'Battery Energy', value: '8.5 MJ per lap (2026)' },
        ],
      },
      halo: {
        titleVi: 'Khung Bảo Vệ Halo Xanh Ngọc Petronas · Mercedes W15',
        titleEn: 'Mercedes W15 Petronas Turquoise Halo Close-up',
        partCode: 'MB-SAFE-HALO-PETRONAS',
        imageUrl: '/images/showroom/closeups/mercedes_halo.webp',
        conceptVi:
          'Cận cảnh khung Halo titan phủ sơn xanh ngọc lục bảo Petronas nổi bật trên nền xe bạc W15. Khung bảo vệ đạt chuẩn FIA bảo vệ buồng lái tay đua khỏi các va chạm tốc độ cao.',
        conceptEn:
          'Macro close-up of the Mercedes W15 Halo finished in iconic Petronas turquoise, enclosing the high-tech cockpit and protecting the driver from heavy impacts.',
        highlightsVi: [
          'Lớp sơn phủ Petronas Turquoise đặc trưng hòa quyện cùng thân xe Silver Arrows.',
          'Rãnh cánh nhỏ vi mô trên đỉnh Halo điều hướng khí thẳng vào cửa hút Airbox.',
          'Hệ thống ngắt điện khẩn cấp tích hợp trên khung Halo.',
        ],
        highlightsEn: [
          'Signature Petronas turquoise livery accentuating the Silver Arrow chassis.',
          'Micro fairing fins guiding clean airflow directly to the engine intake scoop.',
          'Integrated cockpit emergency power cut-off buttons.',
        ],
        specs: [
          { labelVi: 'Vật liệu', labelEn: 'Core Material', value: 'Titanium Grade 5' },
          { labelVi: 'Lực thử nghiệm', labelEn: 'Static Load', value: '12.3 Tấn' },
          { labelVi: 'Màu sơn', labelEn: 'Livery Finish', value: 'Petronas Turquoise Gloss' },
          { labelVi: 'Trọng lượng', labelEn: 'Weight', value: '7.0 kg' },
        ],
      },
      drs: {
        titleVi: 'Cánh Gió Sau DRS Mercedes-AMG W15 Cận Cảnh',
        titleEn: 'Mercedes-AMG W15 Rear Wing DRS Close-up',
        partCode: 'MB-AERO-RW-DRS-15',
        imageUrl: '/images/showroom/closeups/mercedes_drs.webp',
        conceptVi:
          'Cận cảnh cánh đuôi Mercedes W15 với cơ cấu DRS thủy lực siêu nhạy, mở góc lướt gió giải phóng tốc độ tối đa trên 340 km/h.',
        conceptEn:
          'Close-up of the Mercedes W15 rear wing with rapid hydraulic DRS actuator opening for 340+ km/h straight-line runs.',
        highlightsVi: [
          'Cánh phụ DRS mở góc 85 mm bằng cơ cấu thủy lực siêu chính xác.',
          'Chữ AMG và logo ngôi sao ba cánh khắc laser sắc nét.',
          'Cánh Beam Wing kép nâng cao hiệu suất hút gầm sau.',
        ],
        highlightsEn: [
          'Precision 85mm hydraulic flap clearance.',
          'Laser-etched AMG and three-pointed star livery.',
          'Dual beam wing profile boosting diffuser efficiency.',
        ],
        specs: [
          { labelVi: 'Độ mở cánh', labelEn: 'Gap', value: '85 mm' },
          { labelVi: 'Gia tốc tốc độ', labelEn: 'Speed Delta', value: '+20 km/h' },
          { labelVi: 'Vật liệu', labelEn: 'Material', value: 'High-stiffness Carbon' },
          { labelVi: 'Đèn cảnh báo', labelEn: 'Rain Light', value: 'FIA Ultra-bright LED' },
        ],
      },
      sidepods: {
        titleVi: 'Hốc Gió Undercut Khí Động · Mercedes W15 Cận Cảnh',
        titleEn: 'Mercedes W15 Undercut Sidepod Channel Close-up',
        partCode: 'MB-AERO-SP-UNDERCUT',
        imageUrl: '/images/showroom/closeups/mercedes_sidepods.webp',
        conceptVi:
          'Cận cảnh hốc hút gió sườn dốc (Undercut Channel) Mercedes W15. Luồng không khí áp suất cao được gia tốc qua sườn xe, cấp năng lượng trực tiếp cho sàn gầm Venturi.',
        conceptEn:
          'Close-up of the sculpted undercut sidepod channels on the Mercedes W15, accelerating ambient flow around the chassis toward the diffuser.',
        highlightsVi: [
          'Đường rãnh khoét sâu dưới hốc gió gia tốc luồng khí sườn xe.',
          'Bố trí dàn tản nhiệt góc nghiêng tối ưu trọng tâm xe.',
          'Vỏ carbon chịu nhiệt bảo vệ hệ thống tản nhiệt nội bộ.',
        ],
        highlightsEn: [
          'Deep undercut channel guiding high-velocity air along the chassis waist.',
          'Angled radiator packaging lowering the overall roll center.',
          'Heat-shielded carbon panels protecting internal intercoolers.',
        ],
        specs: [
          { labelVi: 'Kiểu dáng', labelEn: 'Profile', value: 'Deep Undercut Channel' },
          { labelVi: 'Công suất làm mát', labelEn: 'Cooling Power', value: '> 140 kW' },
          { labelVi: 'Vật liệu', labelEn: 'Composite', value: 'Carbon-Nomex' },
          { labelVi: 'Màu sơn', labelEn: 'Finish', value: 'Silver Metallic & Teal' },
        ],
      },
      tires: {
        titleVi: 'Lốp Pirelli 18-Inch Mercedes W15 Cận Cảnh',
        titleEn: 'Mercedes W15 Pirelli Tire & Carbon Brakes Close-up',
        partCode: 'MB-CHASSIS-WHEEL-18',
        imageUrl: '/images/showroom/closeups/mercedes_tires.webp',
        conceptVi:
          'Cận cảnh vành mâm hợp kim ma-giê 18-inch với ốp mâm khí động học và đĩa phanh carbon chịu lực hãm trên 5G.',
        conceptEn:
          'Close-up of the 18-inch magnesium wheel with aero covers and carbon-carbon brake discs capable of 5G braking forces.',
        highlightsVi: [
          'Ốp mâm phẳng triệt tiêu luồng xoáy hỗn loạn của bánh trước.',
          'Đĩa phanh carbon tản nhiệt nhanh qua hơn 1,000 lỗ vi mô.',
          'Van cảm biến áp suất và nhiệt độ lốp theo thời gian thực.',
        ],
        highlightsEn: [
          'Flush wheel covers shedding aerodynamic wheel wake.',
          'High-thermal-relief carbon brake discs with 1,000+ drilled vents.',
          'Real-time tire pressure and temperature telemetry sensors.',
        ],
        specs: [
          { labelVi: 'Kích cỡ mâm', labelEn: 'Wheel Size', value: '18 inches' },
          { labelVi: 'Vật liệu', labelEn: 'Material', value: 'Forged Magnesium' },
          { labelVi: 'Gia tốc phanh', labelEn: 'Deceleration', value: '> 5.5 G' },
          { labelVi: 'Nhà cung cấp', labelEn: 'Tire Supplier', value: 'Pirelli Motorsport' },
        ],
      },
    },
    redbull: {
      wings: {
        titleVi: 'Cánh Gió Trước Cận Cảnh · Red Bull RB20',
        titleEn: 'Red Bull Racing RB20 Front Wing Close-up',
        partCode: 'RBR-AERO-FW-RB20',
        imageUrl: '/images/showroom/closeups/redbull_wings.webp',
        conceptVi:
          'Cận cảnh cánh gió trước Red Bull RB20 trong lớp sơn xanh mờ Midnight Navy kết hợp dải vàng và biểu tượng bò tót đỏ. Góc cánh được tối ưu để tạo lực nén cực mạnh cho mũi xe khi vào cua tốc độ cao.',
        conceptEn:
          'Close-up of the Red Bull RB20 front wing in signature matte Midnight Navy with sunburst yellow accents, generating pinpoint front-axle bite in high-speed apexes.',
        highlightsVi: [
          'Lớp sơn mờ Velvet Satin đặc trưng giúp giảm trọng lượng nước sơn.',
          'Cấu trúc khí động học mũi xe kết hợp hệ thống treo trước Pull-rod chống chúi.',
          'Endplate vuốt cong triệt tiêu lực cản không khí hỗn loạn.',
        ],
        highlightsEn: [
          'Distinctive matte velvet finish shedding unneeded paint weight.',
          'Nosecone aero working in unison with anti-dive pull-rod front suspension.',
          'Curved endplate winglets directing turbulent wheel wake outboard.',
        ],
        specs: [
          { labelVi: 'Vật liệu', labelEn: 'Material', value: 'Carbon Fiber Pre-preg' },
          { labelVi: 'Lực nén', labelEn: 'Downforce', value: '470 kg @ 250 km/h' },
          { labelVi: 'Bề mặt sơn', labelEn: 'Finish', value: 'Matte Satin Velvet' },
          { labelVi: 'Đặc tính', labelEn: 'Key Trait', value: 'Anti-Dive Platform Grip' },
        ],
      },
      power_unit: {
        titleVi: 'Động Cơ Honda RBPTH002 Cận Cảnh · Red Bull',
        titleEn: 'Honda RBPTH002 Power Unit Cutaway · Red Bull',
        partCode: 'RBR-PU-HONDA-HRC',
        imageUrl: '/images/showroom/closeups/redbull_power_unit.webp',
        conceptVi:
          'Cận cảnh khối động cơ Honda RBPTH002 do Honda HRC phát triển cho Red Bull Racing. Cỗ máy vô địch thế giới nổi tiếng với độ tin cậy cơ học và khả năng phân bổ mô-men xoắn tức thời.',
        conceptEn:
          'Cutaway close-up of the championship-winning Honda RBPTH002 power unit developed by Honda HRC, famed for rapid torque delivery and bulletproof endurance.',
        highlightsVi: [
          'Bộ tăng áp Honda hiệu suất cao với vòng tua đạt trên 100,000 RPM.',
          'Hệ thống thu hồi động năng MGU-K và pin ERS đạt độ bền vượt trội.',
          'Tối ưu hóa khả năng thoát cua với độ trễ chân ga gần như bằng 0.',
        ],
        highlightsEn: [
          'Ultra-high-efficiency Honda turbocharger spinning beyond 100,000 RPM.',
          'Rugged MGU-K and energy store battery system with proven reliability.',
          'Near-zero turbo lag providing surgical corner-exit acceleration.',
        ],
        specs: [
          { labelVi: 'Động cơ', labelEn: 'Engine', value: '1.6L V6 Turbo Hybrid' },
          { labelVi: 'Tổng công suất', labelEn: 'Peak Output', value: '1,050+ HP' },
          {
            labelVi: 'Hợp tác kỹ thuật',
            labelEn: 'Partnership',
            value: 'Red Bull Powertrains / Honda HRC',
          },
          { labelVi: 'Danh hiệu', labelEn: 'Titles', value: 'Championship Winning Unit' },
        ],
      },
      halo: {
        titleVi: 'Khung Halo Sơn Mờ Cận Cảnh · Red Bull RB20',
        titleEn: 'Red Bull RB20 Matte Navy Halo Close-up',
        partCode: 'RBR-SAFE-HALO-MATTE',
        imageUrl: '/images/showroom/closeups/redbull_halo.webp',
        conceptVi:
          'Cận cảnh khung Halo titan trong sắc xanh bóng đêm mờ của Red Bull, bảo vệ khoang lái của Max Verstappen trước mọi hiểm nguy trên đường đua.',
        conceptEn:
          'Close-up of the Red Bull titanium Halo safety cell finished in matte midnight navy, protecting the driver cockpit against severe track impacts.',
        highlightsVi: [
          'Vỏ ngoài carbon sơn mờ triệt tiêu hoàn toàn hiện tượng phản chiếu ánh đèn đêm (Singapore, Bahrain).',
          'Cánh định hướng khí laminating luồng gió vào hộp nạp trên nóc xe.',
          'Khả năng chịu va chạm tĩnh 12.3 tấn.',
        ],
        highlightsEn: [
          'Matte finish eliminating glare during floodlit night races.',
          'Aerodynamic fairing laminating airflow into the overhead engine airbox.',
          'Rated to withstand a 12.3-tonne static load.',
        ],
        specs: [
          { labelVi: 'Vật liệu', labelEn: 'Structure', value: 'Titanium Grade 5' },
          { labelVi: 'Trọng lượng', labelEn: 'Weight', value: '7.0 kg' },
          { labelVi: 'Tải trọng', labelEn: 'Load Limit', value: '121 kN' },
          { labelVi: 'Màu sắc', labelEn: 'Colorway', value: 'Midnight Navy Matte' },
        ],
      },
      drs: {
        titleVi: 'Cánh Gió Sau DRS Red Bull RB20 Cận Cảnh',
        titleEn: 'Red Bull RB20 Rear Wing DRS Close-up',
        partCode: 'RBR-AERO-RW-DRS',
        imageUrl: '/images/showroom/closeups/redbull_drs.webp',
        conceptVi:
          'Cận cảnh cánh sau Red Bull RB20 kết hợp hệ thống mở DRS thủy lực giúp xe đạt vận tốc kinh ngạc tại Monza và Spa-Francorchamps.',
        conceptEn:
          'Macro close-up of the Red Bull rear wing DRS mechanism delivering ferocious straight-line top speed at high-speed temples like Monza and Spa.',
        highlightsVi: [
          'Cơ chế mở DRS phản ứng siêu nhạy dưới 250 mili-giây.',
          'Cánh Beam Wing kép tối ưu áp suất đáy sàn xe.',
          'Độ ổn định thân xe tuyệt đối khi đóng cánh gió ở tốc độ phanh gấp.',
        ],
        highlightsEn: [
          'Sub-250ms hydraulic DRS actuation.',
          'Dual beam wing elements extracting maximum floor diffuser suction.',
          'Flawless aerodynamic stability on rapid flap closure under braking.',
        ],
        specs: [
          { labelVi: 'Khe hở DRS', labelEn: 'Slot Gap', value: '85 mm' },
          { labelVi: 'Tăng tốc độ', labelEn: 'Delta Speed', value: '+22 km/h' },
          { labelVi: 'Cơ chế', labelEn: 'Actuation', value: 'High-pressure Hydraulic' },
          { labelVi: 'Sơn phủ', labelEn: 'Finish', value: 'Carbon & Bull Red' },
        ],
      },
      sidepods: {
        titleVi: 'Hốc Gió Sườn Overbite Độc Quyền · Red Bull RB20',
        titleEn: 'Red Bull RB20 Revolutionary Overbite Sidepod Close-up',
        partCode: 'RBR-AERO-SP-OVERBITE',
        imageUrl: '/images/showroom/closeups/redbull_sidepods.webp',
        conceptVi:
          'Cận cảnh thiết kế hốc hút gió sườn đảo ngược (Overbite Inlet) đột phá của Red Bull. Cửa hút khí nhô ra phía trên tạo khe hút gió hẹp nằm ngang giải phóng luồng khí khổng lồ xuống sàn xe.',
        conceptEn:
          'Close-up of Red Bull’s groundbreaking overbite sidepod geometry with an extended upper lip, exposing a massive undercut path for floor downforce.',
        highlightsVi: [
          'Môi trên hốc gió kéo dài về phía trước, che chắn miệng hút khỏi luồng nhiễu động.',
          'Rãnh sườn xe khoét sâu tối đa cho phép luồng khí sạch chạy thẳng về bộ khuếch tán.',
          'Bố trí tản nhiệt nghiêng kết hợp khe mang cá làm mát động cơ.',
        ],
        highlightsEn: [
          'Extended overbite upper cowl shielding the intake from turbulent wake.',
          'Class-leading extreme waist undercut feeding high-energy air directly to the diffuser.',
          'Compact internal radiators paired with interchangeable cooling gills.',
        ],
        specs: [
          { labelVi: 'Kiến trúc', labelEn: 'Concept', value: 'Revolutionary Overbite Intake' },
          { labelVi: 'Tản nhiệt', labelEn: 'Heat Duty', value: '> 145 kW' },
          { labelVi: 'Vỏ sườn', labelEn: 'Body Shell', value: 'Ultra-thin Carbon Honeycomb' },
          { labelVi: 'Lợi thế', labelEn: 'Advantage', value: 'Floor Sealing & Low Drag' },
        ],
      },
      tires: {
        titleVi: 'Lốp Pirelli & Phanh Đĩa Carbon Red Bull RB20 Cận Cảnh',
        titleEn: 'Red Bull RB20 18-inch Wheel & Carbon Brake Close-up',
        partCode: 'RBR-CHASSIS-BRK-18',
        imageUrl: '/images/showroom/closeups/redbull_tires.webp',
        conceptVi:
          'Cận cảnh hệ thống phanh carbon và lốp Pirelli 18-inch trên cỗ máy RB20, hỗ trợ những pha phanh muộn thần sầu của các tay đua Red Bull.',
        conceptEn:
          'Close-up of the carbon-carbon brake rotor and Pirelli 18-inch tire on the RB20, enabling signature late-braking dive-bombs into slow corners.',
        highlightsVi: [
          'Đĩa phanh carbon chịu nhiệt độ tức thời trên 1,000°C khi hãm phanh từ 340 km/h.',
          'Hệ thống ống dẫn gió làm mát phanh tối ưu khí động học bánh xe.',
          'Kiểm soát nhiệt độ lốp vượt trội hạn chế tối đa hiện tượng quá nhiệt.',
        ],
        highlightsEn: [
          'Carbon discs operating reliably beyond 1,000°C under 5G deceleration.',
          'Bespoke brake cooling ducting conditioning aerodynamic wheel rim airflow.',
          'Superior thermal tire management preventing thermal degradation.',
        ],
        specs: [
          { labelVi: 'Đường kính mâm', labelEn: 'Wheel Size', value: '18 inches' },
          { labelVi: 'Vật liệu phanh', labelEn: 'Brake Material', value: 'Carbon-Carbon' },
          { labelVi: 'Lực phanh', labelEn: 'Braking Force', value: '> 5.5 G' },
          { labelVi: 'Hợp chất', labelEn: 'Compounds', value: 'Pirelli C1 – C5' },
        ],
      },
    },
    astonmartin: N(
      'astonmartin',
      'Aston Martin Aramco',
      'AMR25',
      '#00594f',
      'British Racing Metallic Green & Lime',
    ),
    alpine: N('alpine', 'BWT Alpine F1', 'A525', '#0090ff', 'Alpine Royal Blue & Bubblegum Pink'),
    racingbulls: N(
      'racingbulls',
      'Visa Cash App RB',
      'VCARB 02',
      '#1634cb',
      'Gloss Royal Racing Blue & White',
    ),
    haas: N('haas', 'MoneyGram Haas F1', 'VF-25', '#e5e7eb', 'Storm Pearl White & Haas Red'),
    williams: N('williams', 'Williams Racing', 'FW47', '#002447', 'Williams Heritage Navy & Cyan'),
    audi: N('audi', 'Audi F1 Team', 'R26', '#c4c8cc', 'Matte Titanium Silver & High-Voltage Red'),
    cadillac: N(
      'cadillac',
      'Cadillac F1 Team',
      'MAC-26',
      '#141518',
      'Stealth Velvet Black & Satin Gold',
    ),
  };
function N(n, t, r, a, i) {
  return {
    wings: {
      titleVi: `Cánh Gió Trước Cận Cảnh · ${t} ${r}`,
      titleEn: `${t} ${r} Front Wing Macro Close-up`,
      partCode: `${n.toUpperCase()}-AERO-FW-26`,
      imageUrl: `/images/showroom/closeups/${n}_wings.webp`,
      conceptVi: `Cận cảnh cánh gió trước ${t} phối màu sắc đặc trưng (${i}). Cấu trúc sợi carbon đa lớp tối ưu hóa lực nén bánh trước và phân tách luồng khí sạch vào họng sàn gầm.`,
      conceptEn: `Macro close-up of ${t} ${r} front wing assembly finished in authentic team livery (${i}), guiding clean laminar airflow to the ground-effect tunnels.`,
      highlightsVi: [
        `Vỏ carbon hoàn thiện màu tem ${t} chống chịu lực nén hàng trăm kg.`,
        '4 tầng cánh khí động học điều chỉnh góc mở linh hoạt từng chặng đua.',
        'Endplate định hình luồng xoáy Outwash triệt tiêu nhiễu động bánh xe.',
      ],
      highlightsEn: [
        `Finished in official ${t} livery withstanding heavy downforce loads.`,
        'Adjustable 4-tier aerodynamic flap cascade tuned per circuit.',
        'Outwash endplates directing turbulent wheel wake away from the underfloor.',
      ],
      specs: [
        { labelVi: 'Vật liệu', labelEn: 'Construction', value: 'Carbon Fiber Pre-preg' },
        { labelVi: 'Lực nén cực đại', labelEn: 'Peak Downforce', value: '450+ kg @ 250 km/h' },
        { labelVi: 'Quy chuẩn', labelEn: 'Regulation', value: 'FIA 2026 Spec' },
        { labelVi: 'Màu tem', labelEn: 'Livery', value: i },
      ],
    },
    power_unit: {
      titleVi: `Bộ Động Cơ Hybrid Cận Cảnh · ${t}`,
      titleEn: `${t} V6 Turbo Hybrid Power Unit Cutaway`,
      partCode: `${n.toUpperCase()}-PU-HYBRID`,
      imageUrl: `/images/showroom/closeups/${n}_power_unit.webp`,
      conceptVi: `Cận cảnh khối động cơ đốt trong 1.6L V6 Turbo kết hợp mô-tơ điện thu hồi động năng MGU-K cung cấp hơn 1,000 mã lực cho cỗ máy ${r}.`,
      conceptEn: `Engineering cutaway of the 1.6L V6 Turbo Hybrid power unit delivering over 1,000 combined horsepower to the ${t} ${r}.`,
      highlightsVi: [
        'Công nghệ đánh lửa buồng đốt phụ TJI tối ưu hóa từng giọt nhiên liệu sinh học.',
        'Mô-tơ điện MGU-K 350 kW phóng thêm gần 470 mã lực điện tức thì khi ra khỏi góc cua.',
        'Khung gầm carbon ôm sát khối máy giảm thiểu lực cản khí động.',
      ],
      highlightsEn: [
        'Turbulent Jet Ignition maximizing thermal efficiency with sustainable biofuel.',
        'MGU-K motor deploying nearly 470 instantaneous electric horsepower on corner exit.',
        'Tightly packaged carbon monocoque cell minimizing aerodynamic drag.',
      ],
      specs: [
        { labelVi: 'Dung tích', labelEn: 'Displacement', value: '1.6 L V6 Turbo Hybrid' },
        { labelVi: 'Tổng công suất', labelEn: 'Power Output', value: '1,020+ – 1,050+ HP' },
        { labelVi: 'Hiệu suất nhiệt', labelEn: 'Thermal Efficiency', value: '> 50%' },
        { labelVi: 'Đội đua', labelEn: 'Constructor', value: t },
      ],
    },
    halo: {
      titleVi: `Khung Bảo Vệ Titan Halo Cận Cảnh · ${t}`,
      titleEn: `${t} Titanium Halo Safety Cell Close-up`,
      partCode: `${n.toUpperCase()}-SAFE-HALO`,
      imageUrl: `/images/showroom/closeups/${n}_halo.webp`,
      conceptVi: `Cận cảnh khung bảo vệ buồng lái Halo bằng hợp kim Titan Grade 5 sơn phối màu sắc thương hiệu ${t}, chịu lực va đập tĩnh 12.3 tấn.`,
      conceptEn: `Close-up of the Grade 5 Titanium Halo cockpit protection structure finished in ${t} colors, rated to survive a 12.3-tonne static impact.`,
      highlightsVi: [
        'Khung titan cường lực cao gắn chặt vào thân xe Monocoque nguyên khối.',
        'Lớp vỏ carbon khí động học dẫn luồng khí mượt mà vào hộp lấy gió Airbox.',
        'Thời gian thoát hiểm khẩn cấp dưới 7 giây cho tay đua.',
      ],
      highlightsEn: [
        'High-tensile titanium loop rigidly anchored into the monocoque safety cell.',
        'Aero fairing guiding undisturbed airflow into the overhead engine airbox.',
        'Emergency driver egress validated in under 7 seconds.',
      ],
      specs: [
        { labelVi: 'Vật liệu', labelEn: 'Material', value: 'Grade 5 Titanium' },
        { labelVi: 'Khối lượng', labelEn: 'Weight', value: '7.0 kg' },
        { labelVi: 'Tải trọng kiểm định', labelEn: 'Impact Rating', value: '121 kN (12.3 Tấn)' },
        { labelVi: 'Màu hoàn thiện', labelEn: 'Finish', value: i },
      ],
    },
    drs: {
      titleVi: `Cánh Gió Sau DRS Cận Cảnh · ${t}`,
      titleEn: `${t} Rear Wing DRS Mechanism Close-up`,
      partCode: `${n.toUpperCase()}-AERO-DRS`,
      imageUrl: `/images/showroom/closeups/${n}_drs.webp`,
      conceptVi: `Cận cảnh cánh gió đuôi xe ${t} với cơ cấu mở cánh lướt gió DRS điều khiển thủy lực giảm 30% lực cản khi vượt xe.`,
      conceptEn: `Close-up of the ${t} rear wing showing the hydraulic DRS actuator shedding 30% drag for high-speed overtaking maneuvers.`,
      highlightsVi: [
        'Độ mở cánh phụ tối đa 85 mm khi kích hoạt tại các đoạn thẳng DRS.',
        'Tự động đóng sập an toàn tức thì ngay khi tài xế chạm bàn đạp phanh.',
        'Kết hợp cánh Beam Wing kép khuếch đại lực hút từ sàn gầm.',
      ],
      highlightsEn: [
        '85mm slot gap clearance when activated through designated DRS straight zones.',
        'Automatic fail-safe closure the millisecond brake pedal pressure is detected.',
        'Integrated lower beam wing elements amplifying ground-effect floor suction.',
      ],
      specs: [
        { labelVi: 'Khe mở DRS', labelEn: 'Slot Gap', value: '85 mm' },
        { labelVi: 'Tốc độ tăng thêm', labelEn: 'Top Speed Gain', value: '+15 – 25 km/h' },
        { labelVi: 'Vật liệu', labelEn: 'Structure', value: 'Pre-preg Carbon Fiber' },
        { labelVi: 'Đội đua', labelEn: 'Team', value: t },
      ],
    },
    sidepods: {
      titleVi: `Hốc Gió Sườn & Tản Nhiệt Cận Cảnh · ${t}`,
      titleEn: `${t} Sidepod & Cooling Architecture Close-up`,
      partCode: `${n.toUpperCase()}-AERO-SP`,
      imageUrl: `/images/showroom/closeups/${n}_sidepods.webp`,
      conceptVi: `Cận cảnh hốc hút gió sườn và bề mặt uốn lượn khí động của ${r}. Định hình luồng khí ôm sát eo thân xe chảy thẳng xuống bộ khuếch tán sàn sau.`,
      conceptEn: `Close-up of the ${t} ${r} sidepod intakes and cooling louvers, accelerating high-pressure ambient air toward the rear diffuser.`,
      highlightsVi: [
        'Rãnh khoét gầm sâu Undercut gia tốc luồng khí áp suất cao dọc sườn xe.',
        'Cấu trúc chống va đập cạnh sườn SIS tiêu chuẩn FIA bảo vệ tay đua.',
        'Dàn tản nhiệt nước và khí nạp giải tỏa trên 140 kW nhiệt lượng động cơ.',
      ],
      highlightsEn: [
        'Sculpted undercut channels accelerating laminar flow toward the rear floor.',
        'FIA-mandated Side Impact Spars (SIS) absorbing lateral crash energy.',
        'High-capacity intercooler packaging dissipating over 140 kW of powertrain heat.',
      ],
      specs: [
        { labelVi: 'Kiến trúc khí động', labelEn: 'Aero Concept', value: 'Undercut Downwash' },
        { labelVi: 'Nhiệt lượng giải tỏa', labelEn: 'Cooling Capacity', value: '> 140 kW' },
        { labelVi: 'Vật liệu', labelEn: 'Composite', value: 'Carbon-Nomex' },
        { labelVi: 'Màu sắc', labelEn: 'Colorway', value: i },
      ],
    },
    tires: {
      titleVi: `Lốp Pirelli 18-Inch & Phanh Đĩa Carbon · ${t}`,
      titleEn: `${t} 18-inch Pirelli Tires & Carbon Brakes Close-up`,
      partCode: `${n.toUpperCase()}-CHASSIS-BRK`,
      imageUrl: `/images/showroom/closeups/${n}_tires.webp`,
      conceptVi:
        'Cận cảnh mâm hợp kim ma-giê 18 inch và đĩa phanh carbon-carbon với hơn 1,000 lỗ thông gió giải nhiệt khi hãm tốc 5G.',
      conceptEn:
        'Close-up of the 18-inch magnesium wheels and carbon-carbon brake discs with over 1,000 cooling holes absorbing brutal 5G deceleration.',
      highlightsVi: [
        'Đĩa phanh carbon bốc đỏ rực ở nhiệt độ trên 1,000°C khi phanh từ 340 km/h.',
        'Mâm xe có ốp khí động học (Wheel Cover) giảm thiểu luồng gió xoáy vành bánh.',
        'Lốp Pirelli 18-inch thành mỏng phản hồi chính xác từng chuyển động vô lăng.',
      ],
      highlightsEn: [
        'Brake discs glowing red at 1,000°C under heavy braking from 340 km/h.',
        'Aerodynamic wheel covers minimizing chaotic rim turbulence.',
        'Low-profile 18-inch Pirelli rubber delivering instantaneous steering precision.',
      ],
      specs: [
        { labelVi: 'Đường kính mâm', labelEn: 'Wheel Size', value: '18 inches' },
        { labelVi: 'Vật liệu đĩa phanh', labelEn: 'Discs', value: 'Carbon-Carbon' },
        { labelVi: 'Lực hãm tối đa', labelEn: 'Peak Decel', value: '> 5.5 G' },
        { labelVi: 'Nhà cung cấp', labelEn: 'Supplier', value: 'Pirelli & Brembo' },
      ],
    },
  };
}
const Tn = (n, t) => {
    const r = ve[n] || ve.ferrari;
    if (t === 'floor') {
      const a = r.sidepods,
        i = a.titleVi.includes('·') ? a.titleVi.split('·').slice(1).join('·').trim() : n;
      return {
        titleVi: `Sàn Venturi & Diffuser Cận Cảnh · ${i.replace(/\s*Cận Cảnh\s*$/, '').trim() || i}`,
        titleEn: `${n.toUpperCase()} Venturi Floor & Diffuser Close-up`,
        partCode: `${n.toUpperCase()}-FLOOR-DIFF`,
        imageUrl: a.imageUrl,
        conceptVi:
          'Cận cảnh hầm gió Venturi, tấm gỗ Jabroc 10mm tim gầm và cụm đèn mưa LED FIA ở đuôi xe — nguồn lực nén mặt đất lớn nhất cỗ máy F1 hiện đại.',
        conceptEn:
          'Close-up of the Venturi tunnels, 10mm Jabroc reference plank and FIA rain LED cluster at the tail — the largest ground-effect downforce source on a modern F1 car.',
        highlightsVi: [
          'Hai hầm gió Venturi tạo vùng áp suất thấp hút xe xuống mặt đường.',
          'Tấm gỗ Jabroc 10mm kiểm định độ cao gầm, mòn quá chuẩn sẽ bị loại.',
          'Đèn LED đỏ FIA kiêm báo xanh khi pin ERS đang thu hồi năng lượng.',
        ],
        highlightsEn: [
          'Twin Venturi tunnels generating low-pressure ground-effect suction.',
          '10mm Jabroc reference plank policing ride height; excess wear disqualifies the car.',
          'FIA red LED doubling as a green ERS harvesting indicator.',
        ],
        specs: [
          { labelVi: 'Nguồn lực nén', labelEn: 'Downforce Share', value: '~60% tổng lực nén' },
          { labelVi: 'Tấm tham chiếu', labelEn: 'Plank', value: 'Jabroc 10 mm' },
          { labelVi: 'Đèn đuôi', labelEn: 'Rear Light', value: 'FIA RL24 LED' },
          { labelVi: 'Khuếch đại', labelEn: 'Extraction', value: 'Beam Wing kép' },
        ],
      };
    }
    return r[t] || r.wings;
  },
  Vn = D.memo(({ hotspot: n, onClose: t, onSelectHotspot: r, teamId: a = 'ferrari', lang: i }) => {
    const [o, u] = s.useState(!1);
    if (
      (s.useEffect(() => {
        const h = (x) => {
          x.key === 'Escape' && (o ? u(!1) : t());
        };
        return (
          window.addEventListener('keydown', h),
          () => window.removeEventListener('keydown', h)
        );
      }, [o, t]),
      !n)
    )
      return null;
    const c = z(a),
      l = Tn(a, n.id),
      b = k.findIndex((h) => h.id === n.id),
      p = k[(b - 1 + k.length) % k.length],
      m = k[(b + 1) % k.length];
    return e.jsxs(e.Fragment, {
      children: [
        e.jsx('div', {
          className:
            'fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in cursor-pointer',
          onClick: t,
          'aria-label': i === 'vi' ? 'Nhấn để đóng bảng chi tiết' : 'Click to close drawer',
        }),
        e.jsxs('aside', {
          className:
            'fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-studio-950/95 text-white backdrop-blur-2xl border-l border-studio-800 shadow-2xl flex flex-col transition-all duration-300 animate-slide-left overflow-hidden',
          'aria-label': 'F1 Technical Hotspot Visualizer',
          children: [
            e.jsxs('div', {
              className:
                'p-3.5 sm:p-4 border-b border-studio-800/80 flex items-center justify-between gap-3 bg-studio-900/90 sticky top-0 z-10 shadow-sm',
              children: [
                e.jsxs('div', {
                  className: 'flex items-center gap-3 min-w-0',
                  children: [
                    e.jsx('span', {
                      className:
                        'w-8 h-8 rounded-xl flex items-center justify-center font-display text-xs font-black text-white shadow-md ring-2 ring-white/20 shrink-0',
                      style: { backgroundColor: c.bodyColor },
                      children: b + 1,
                    }),
                    e.jsxs('div', {
                      className: 'min-w-0',
                      children: [
                        e.jsxs('div', {
                          className: 'flex items-center gap-2 flex-wrap',
                          children: [
                            e.jsx(V, { teamId: a, size: 'sm' }),
                            e.jsx('span', {
                              className:
                                'text-[10px] font-black uppercase tracking-widest text-studio-400 truncate',
                              children: c.fullName,
                            }),
                          ],
                        }),
                        e.jsx('h3', {
                          className:
                            'font-display text-base sm:text-lg font-bold uppercase tracking-wide text-white leading-tight truncate',
                          children: i === 'vi' ? l.titleVi : l.titleEn,
                        }),
                      ],
                    }),
                  ],
                }),
                e.jsxs('button', {
                  type: 'button',
                  onClick: t,
                  className:
                    'flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-studio-800 hover:bg-studio-700 text-studio-300 hover:text-white transition-all border border-studio-700/80 shadow-md shrink-0 cursor-pointer active:scale-95',
                  'aria-label':
                    i === 'vi'
                      ? 'Đóng bảng chi tiết (hoặc bấm phím ESC)'
                      : 'Close drawer (or press ESC)',
                  children: [
                    e.jsx('span', {
                      className: 'text-xs font-bold hidden sm:inline',
                      children: i === 'vi' ? 'Đóng' : 'Close',
                    }),
                    e.jsx(_, { className: 'w-4 h-4 text-studio-300 hover:text-white' }),
                  ],
                }),
              ],
            }),
            e.jsxs('div', {
              className:
                'flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-studio-900/50 border-b border-studio-800/80 overflow-x-auto custom-scrollbar shrink-0',
              children: [
                e.jsxs('span', {
                  className:
                    'text-[10px] font-bold uppercase tracking-wider text-studio-400 shrink-0 mr-1 flex items-center gap-1',
                  children: [e.jsx(Y, { className: 'w-3 h-3 text-amber-400' }), 'Linh kiện:'],
                }),
                k.map((h, x) => {
                  const C = h.id === n.id;
                  return e.jsxs(
                    'button',
                    {
                      type: 'button',
                      onClick: () => r(h),
                      className: `flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all shrink-0 cursor-pointer border ${C ? 'bg-f1red text-white border-f1red shadow-sm' : 'bg-studio-950/60 text-studio-400 border-studio-800 hover:text-white hover:bg-studio-800'}`,
                      'aria-label': i === 'vi' ? h.nameVi : h.nameEn,
                      children: [
                        e.jsxs('span', {
                          className: 'font-mono text-[10px] opacity-80',
                          children: [x + 1, '.'],
                        }),
                        e.jsx('span', {
                          children: i === 'vi' ? h.nameVi.split(' ')[0] : h.nameEn.split(' ')[0],
                        }),
                      ],
                    },
                    h.id,
                  );
                }),
              ],
            }),
            e.jsxs('div', {
              className: 'flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar',
              children: [
                e.jsxs('div', {
                  className: 'space-y-2.5',
                  children: [
                    e.jsxs('div', {
                      className: 'flex items-center justify-between gap-2 px-1',
                      children: [
                        e.jsxs('span', {
                          className:
                            'text-[11px] font-bold uppercase tracking-wider text-studio-400 flex items-center gap-1.5',
                          children: [
                            e.jsx(Ee, { className: 'w-3.5 h-3.5 text-f1red' }),
                            i === 'vi'
                              ? `Chi Tiết Linh Kiện ${c.teamName}`
                              : `${c.teamName} Component View`,
                          ],
                        }),
                        e.jsx('span', {
                          className:
                            'font-mono text-[10px] text-studio-400 uppercase tracking-widest bg-studio-900 border border-studio-800 px-2 py-0.5 rounded',
                          children: c.carModelName,
                        }),
                      ],
                    }),
                    e.jsxs('div', {
                      className:
                        'relative rounded-2xl overflow-hidden border border-studio-700/60 shadow-xl group bg-black/90 aspect-video flex items-center justify-center',
                      children: [
                        e.jsx('img', {
                          src: l.imageUrl,
                          alt: i === 'vi' ? l.titleVi : l.titleEn,
                          className:
                            'w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer',
                          onClick: () => u(!0),
                          loading: 'lazy',
                        }),
                        e.jsx('div', {
                          className:
                            'absolute inset-0 bg-gradient-to-t from-studio-950 via-transparent to-black/40 opacity-80 pointer-events-none',
                        }),
                        e.jsx('div', {
                          className: 'absolute top-2.5 left-2.5 z-10 pointer-events-none',
                          children: e.jsx(V, { teamId: a, badgeMode: !0, size: 'sm', lang: i }),
                        }),
                        e.jsxs('div', {
                          className: 'absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5',
                          children: [
                            e.jsxs('span', {
                              className:
                                'inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md border border-white/20 text-[10px] font-mono font-bold text-amber-300',
                              children: [
                                e.jsx('span', {
                                  className: 'w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse',
                                }),
                                l.partCode,
                              ],
                            }),
                            e.jsx('button', {
                              type: 'button',
                              onClick: () => u(!0),
                              className:
                                'p-1.5 rounded-md bg-studio-900/85 hover:bg-studio-800 text-studio-200 hover:text-white border border-white/15 backdrop-blur-md transition-colors cursor-pointer',
                              'aria-label':
                                i === 'vi'
                                  ? 'Phóng to xem cận cảnh sắc nét'
                                  : 'Expand full macro view',
                              children: e.jsx(Te, { className: 'w-3.5 h-3.5' }),
                            }),
                          ],
                        }),
                        e.jsxs('div', {
                          className:
                            'absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-studio-300 font-medium z-10',
                          children: [
                            e.jsxs('div', {
                              className:
                                'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-studio-950/90 backdrop-blur-md border border-studio-700/70 text-[11px] font-bold text-white max-w-[70%]',
                              children: [
                                e.jsx('span', {
                                  className: 'w-2 h-2 rounded-full shrink-0',
                                  style: { backgroundColor: c.bodyColor },
                                }),
                                e.jsxs('span', {
                                  className: 'truncate',
                                  children: [l.partCode, ' · ', c.shortCarName],
                                }),
                              ],
                            }),
                            e.jsxs('button', {
                              type: 'button',
                              onClick: () => u(!0),
                              className:
                                'text-[11px] text-studio-300 hover:text-white font-mono flex items-center gap-1 bg-studio-900/80 px-2.5 py-1 rounded border border-studio-700/50 cursor-pointer shadow-sm',
                              children: [
                                e.jsx(ae, { className: 'w-3 h-3 text-f1red' }),
                                e.jsx('span', { children: i === 'vi' ? 'Phóng to' : 'Zoom In' }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                    e.jsxs('div', {
                      className:
                        'flex items-center justify-between text-[11px] px-1 text-studio-400',
                      children: [
                        e.jsx('span', {
                          className: 'font-medium text-studio-300 truncate max-w-[75%]',
                          children: i === 'vi' ? l.titleVi : l.titleEn,
                        }),
                        e.jsxs('span', {
                          className: 'font-mono text-[10px] text-f1red font-bold shrink-0',
                          children: [c.shortCarName, ' · 3D REFERENCE'],
                        }),
                      ],
                    }),
                  ],
                }),
                e.jsxs('div', {
                  className:
                    'p-4 rounded-2xl bg-gradient-to-br from-studio-900/90 to-studio-950 border border-studio-800 shadow-md space-y-3',
                  children: [
                    e.jsxs('div', {
                      className:
                        'flex items-center justify-between border-b border-studio-800/80 pb-2.5',
                      children: [
                        e.jsxs('div', {
                          className: 'flex items-center gap-2',
                          children: [
                            e.jsx('span', {
                              className: 'w-3 h-3 rounded-full shadow-sm',
                              style: { backgroundColor: c.bodyColor },
                            }),
                            e.jsxs('span', {
                              className: 'text-xs font-black uppercase tracking-wider text-white',
                              children: [
                                c.teamName,
                                ' · ',
                                i === 'vi' ? 'Phân Tích Cận Cảnh' : 'Macro Analysis',
                              ],
                            }),
                          ],
                        }),
                        e.jsx('span', {
                          className:
                            'text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded-md',
                          children: l.partCode,
                        }),
                      ],
                    }),
                    e.jsx('p', {
                      className: 'text-xs text-studio-300 leading-relaxed font-normal',
                      children: i === 'vi' ? l.conceptVi : l.conceptEn,
                    }),
                  ],
                }),
                e.jsxs('div', {
                  className: 'space-y-2.5',
                  children: [
                    e.jsxs('h4', {
                      className:
                        'text-xs font-bold uppercase tracking-wider text-studio-400 flex items-center gap-1.5',
                      children: [
                        e.jsx(Y, { className: 'w-3.5 h-3.5 text-amber-400' }),
                        i === 'vi'
                          ? 'Đặc Tính Nổi Bật Của Mẫu Xe Này'
                          : 'Constructor Design Features',
                      ],
                    }),
                    e.jsx('ul', {
                      className: 'space-y-2',
                      children: (i === 'vi' ? l.highlightsVi : l.highlightsEn).map((h, x) =>
                        e.jsxs(
                          'li',
                          {
                            className: 'flex items-start gap-2 text-xs sm:text-sm text-studio-300',
                            children: [
                              e.jsx(un, { className: 'w-4 h-4 text-f1red shrink-0 mt-0.5' }),
                              e.jsx('span', { children: h }),
                            ],
                          },
                          x,
                        ),
                      ),
                    }),
                  ],
                }),
                e.jsxs('div', {
                  className: 'space-y-3',
                  children: [
                    e.jsxs('h4', {
                      className:
                        'text-xs font-bold uppercase tracking-wider text-studio-400 flex items-center gap-1.5',
                      children: [
                        e.jsx(mn, { className: 'w-3.5 h-3.5 text-amber-400' }),
                        i === 'vi'
                          ? 'Thông Số Kỹ Thuật (FIA Regulation)'
                          : 'Technical Specifications',
                      ],
                    }),
                    e.jsx('div', {
                      className: 'grid grid-cols-1 sm:grid-cols-2 gap-2.5',
                      children: l.specs.map((h, x) =>
                        e.jsxs(
                          'div',
                          {
                            className:
                              'p-3 rounded-xl bg-studio-900/60 border border-studio-800/80 space-y-1',
                            children: [
                              e.jsx('span', {
                                className:
                                  'text-[10px] uppercase font-bold text-studio-400 block truncate',
                                children: i === 'vi' ? h.labelVi : h.labelEn,
                              }),
                              e.jsx('span', {
                                className: 'text-xs sm:text-sm font-black text-white block',
                                children: h.value,
                              }),
                            ],
                          },
                          x,
                        ),
                      ),
                    }),
                  ],
                }),
              ],
            }),
            e.jsxs('div', {
              className:
                'p-3.5 sm:p-4 border-t border-studio-800/80 bg-studio-900/90 flex items-center justify-between gap-2 sm:gap-3 sticky bottom-0 z-10 shadow-lg',
              children: [
                e.jsxs('button', {
                  type: 'button',
                  onClick: () => r(p),
                  className:
                    'flex-1 py-2.5 px-2.5 rounded-xl bg-studio-800 hover:bg-studio-700 text-xs font-bold text-studio-200 hover:text-white transition-colors flex items-center justify-center gap-1 cursor-pointer',
                  'aria-label': i === 'vi' ? 'Xem linh kiện trước' : 'Previous component',
                  children: [
                    e.jsx(Ve, { className: 'w-4 h-4 shrink-0' }),
                    e.jsx('span', {
                      className: 'hidden sm:inline',
                      children: i === 'vi' ? 'Trước' : 'Prev',
                    }),
                  ],
                }),
                e.jsxs('button', {
                  type: 'button',
                  onClick: t,
                  className:
                    'py-2.5 px-4 rounded-xl bg-studio-800 hover:bg-studio-700 text-xs font-bold text-studio-300 hover:text-white border border-studio-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95',
                  'aria-label': i === 'vi' ? 'Đóng cửa sổ này (ESC)' : 'Close this panel (ESC)',
                  children: [
                    e.jsx(_, { className: 'w-4 h-4 text-studio-400' }),
                    e.jsx('span', { children: i === 'vi' ? 'Đóng' : 'Close' }),
                  ],
                }),
                e.jsxs('button', {
                  type: 'button',
                  onClick: () => r(m),
                  className:
                    'flex-1 py-2.5 px-2.5 rounded-xl bg-f1red hover:bg-f1red/90 text-xs font-bold text-white transition-colors flex items-center justify-center gap-1 shadow-md shadow-f1red/20 cursor-pointer',
                  'aria-label': i === 'vi' ? 'Xem linh kiện tiếp' : 'Next component',
                  children: [
                    e.jsx('span', {
                      className: 'hidden sm:inline',
                      children: i === 'vi' ? 'Tiếp' : 'Next',
                    }),
                    e.jsx(Se, { className: 'w-4 h-4 shrink-0' }),
                  ],
                }),
              ],
            }),
          ],
        }),
        o &&
          e.jsxs('div', {
            role: 'dialog',
            'aria-modal': 'true',
            className:
              'fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-6 animate-fade-in',
            onClick: () => u(!1),
            children: [
              e.jsxs('div', {
                className:
                  'flex items-center justify-between gap-4 pb-4 border-b border-studio-800',
                onClick: (h) => h.stopPropagation(),
                children: [
                  e.jsxs('div', {
                    className: 'flex items-center gap-3',
                    children: [
                      e.jsx(V, { teamId: a, size: 'md' }),
                      e.jsxs('div', {
                        children: [
                          e.jsxs('div', {
                            className: 'flex items-center gap-2',
                            children: [
                              e.jsx('span', {
                                className:
                                  'text-xs font-mono font-bold text-amber-300 bg-amber-950/80 border border-amber-800/80 px-2 py-0.5 rounded',
                                children: l.partCode,
                              }),
                              e.jsx('span', {
                                className: 'text-xs text-studio-300 font-mono',
                                children: c.fullName,
                              }),
                            ],
                          }),
                          e.jsx('h2', {
                            className:
                              'text-base sm:text-xl font-display font-black uppercase text-white mt-0.5',
                            children: i === 'vi' ? l.titleVi : l.titleEn,
                          }),
                        ],
                      }),
                    ],
                  }),
                  e.jsx('div', {
                    className: 'flex items-center gap-2',
                    children: e.jsxs('button', {
                      type: 'button',
                      onClick: () => u(!1),
                      className:
                        'flex items-center gap-2 py-2 px-3.5 rounded-xl bg-studio-800/90 hover:bg-studio-700 text-white transition-colors cursor-pointer border border-studio-700 shadow-md font-bold text-xs',
                      'aria-label':
                        i === 'vi' ? 'Đóng chế độ phóng to (ESC)' : 'Close full view (ESC)',
                      children: [
                        e.jsx('span', { children: i === 'vi' ? 'Đóng (ESC)' : 'Close (ESC)' }),
                        e.jsx(_, { className: 'w-5 h-5 text-studio-400' }),
                      ],
                    }),
                  }),
                ],
              }),
              e.jsx('div', {
                className:
                  'flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden cursor-zoom-out',
                onClick: () => u(!1),
                children: e.jsxs('div', {
                  className:
                    'relative max-w-6xl max-h-full rounded-2xl overflow-hidden border border-studio-700/60 shadow-2xl bg-studio-950',
                  onClick: (h) => h.stopPropagation(),
                  children: [
                    e.jsx('img', {
                      src: l.imageUrl,
                      alt: i === 'vi' ? l.titleVi : l.titleEn,
                      className: 'max-h-[75vh] w-auto object-contain mx-auto select-none',
                    }),
                    e.jsx('div', {
                      className: 'absolute top-4 left-4 pointer-events-none',
                      children: e.jsx(V, { teamId: a, badgeMode: !0, size: 'sm', lang: i }),
                    }),
                  ],
                }),
              }),
              e.jsxs('div', {
                className:
                  'pt-3 border-t border-studio-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-studio-400',
                onClick: (h) => h.stopPropagation(),
                children: [
                  e.jsxs('div', {
                    className: 'flex items-center gap-4 flex-wrap',
                    children: [
                      e.jsxs('span', {
                        children: [
                          'Đội đua: ',
                          e.jsx('strong', { className: 'text-white', children: c.fullName }),
                        ],
                      }),
                      e.jsxs('span', {
                        children: [
                          'Linh kiện: ',
                          e.jsx('strong', { className: 'text-white', children: l.partCode }),
                        ],
                      }),
                      e.jsxs('span', {
                        children: [
                          'Mẫu xe: ',
                          e.jsx('strong', { className: 'text-white', children: c.carModelName }),
                        ],
                      }),
                    ],
                  }),
                  e.jsx('div', {
                    className: 'text-[11px] font-mono text-studio-500',
                    children: 'NHẤN PHÍM ESC HOẶC CLICK VÙNG NGOÀI ĐỂ ĐÓNG',
                  }),
                ],
              }),
            ],
          }),
      ],
    });
  }),
  Sn = [
    { id: 'mclaren', name: 'McLaren' },
    { id: 'ferrari', name: 'Ferrari' },
    { id: 'redbull', name: 'Red Bull' },
    { id: 'mercedes', name: 'Mercedes' },
    { id: 'astonmartin', name: 'Aston Martin' },
    { id: 'alpine', name: 'Alpine' },
    { id: 'racingbulls', name: 'Racing Bulls' },
    { id: 'haas', name: 'Haas' },
    { id: 'williams', name: 'Williams' },
    { id: 'audi', name: 'Audi' },
    { id: 'cadillac', name: 'Cadillac' },
  ],
  Nn = D.memo(({ selectedTeamId: n, onSelectTeam: t, lang: r }) =>
    e.jsxs('div', {
      className: 'flex items-center gap-2 pt-1 border-t border-studio-850/80',
      children: [
        e.jsxs('div', {
          className:
            'hidden lg:flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-studio-400 shrink-0 pr-1',
          children: [
            e.jsx(gn, { className: 'w-3.5 h-3.5 text-f1red' }),
            e.jsx('span', { children: r === 'vi' ? 'Tem xe:' : 'Liveries:' }),
          ],
        }),
        e.jsx('div', {
          className:
            'flex items-center gap-1.5 overflow-x-auto py-1 px-0.5 custom-scrollbar w-full',
          children: Sn.map(({ id: a, name: i }) => {
            const o = B[a],
              u = n === a;
            return e.jsxs(
              'button',
              {
                type: 'button',
                onClick: () => t(a),
                className: `flex items-center gap-2 px-2.5 py-1.5 min-h-[44px] sm:min-h-0 rounded-xl text-xs font-bold transition-all duration-200 shrink-0 border cursor-pointer select-none ${u ? 'bg-studio-900 text-white shadow-lg ring-1 ring-white/40' : 'bg-studio-950/80 text-studio-400 border-studio-800/80 hover:bg-studio-900 hover:text-white hover:border-studio-700'}`,
                style: u
                  ? {
                      borderColor: o.accentColor || o.primaryColor,
                      boxShadow: `0 4px 14px ${o.primaryColor}24`,
                    }
                  : void 0,
                children: [
                  e.jsx(V, { teamId: a, size: 'sm', className: 'w-4 h-4 shrink-0' }),
                  e.jsx('span', {
                    className:
                      'w-3 h-3 rounded-full border border-black/50 shrink-0 relative overflow-hidden',
                    style: { backgroundColor: o.primaryColor },
                    children: e.jsx('span', {
                      className: 'absolute inset-y-0 right-0 w-1/2',
                      style: { backgroundColor: o.accentColor || o.primaryColor },
                    }),
                  }),
                  e.jsx('span', {
                    className: u ? 'text-white font-black' : 'text-studio-300 font-semibold',
                    children: i,
                  }),
                  u &&
                    e.jsx(pn, {
                      className: 'w-3.5 h-3.5 ml-0.5',
                      style: { color: o.accentColor || '#34d399' },
                    }),
                ],
              },
              a,
            );
          }),
        }),
      ],
    }),
  ),
  te = 1023,
  Mn = (n) => ({ isMobileLayout: n <= te }),
  Rn = (n) => {
    if (typeof window > 'u') return null;
    let t = window.innerWidth <= te,
      r = 0;
    const a = () => {
      r ||
        (r = window.requestAnimationFrame(() => {
          r = 0;
          const i = window.innerWidth <= te;
          i !== t && ((t = i), n(i));
        }));
    };
    return (
      window.addEventListener('resize', a, { passive: !0 }),
      () => {
        (window.removeEventListener('resize', a), r && window.cancelAnimationFrame(r));
      }
    );
  },
  y = [
    { id: 'pano_branding', labelVi: 'Vách Logo', labelEn: 'Launch Wall', tag: '1/4' },
    { id: 'pano_drivers', labelVi: 'Vách Tay Đua', labelEn: 'Drivers Wall', tag: '2/4' },
    { id: 'pano_technical', labelVi: 'Vách Kỹ Thuật', labelEn: 'Tech Specs', tag: '3/4' },
    { id: 'pano_achievements', labelVi: 'Vách Thành Tích', labelEn: 'Records Wall', tag: '4/4' },
  ],
  jn = D.memo(
    ({
      cameraPreset: n,
      onSelectPreset: t,
      autoRotate: r,
      onToggleAutoRotate: a,
      onResetView: i,
      lang: o,
      showHotspots: u = !1,
      onToggleHotspots: c,
      onOpenSchematic: l,
      isMobileLayout: b = !1,
    }) => {
      const [p, m] = s.useState(() => !b),
        [h, x] = s.useState('pano'),
        [C, R] = s.useState(!1),
        v = y.findIndex((g) => g.id === n);
      s.useEffect(() => {
        if (!C) return;
        const g = setInterval(() => {
          const L = v >= 0 ? (v + 1) % y.length : 0;
          t(y[L].id);
        }, 5500);
        return () => clearInterval(g);
      }, [C, v, t]);
      const j = () => {
          const g = v >= 0 ? (v + 1) % y.length : 0;
          t(y[g].id);
        },
        S = () => {
          const g = v >= 0 ? (v - 1 + y.length) % y.length : y.length - 1;
          t(y[g].id);
        },
        F = () => {
          C ? R(!1) : (R(!0), v < 0 && t(y[0].id));
        },
        A = [
          {
            id: 'pano_branding',
            labelVi: 'Vách Logo',
            labelEn: 'Launch Wall',
            tag: 'LOGO',
            icon: e.jsx(be, { className: 'w-3.5 h-3.5 text-amber-400' }),
          },
          {
            id: 'pano_drivers',
            labelVi: 'Vách Tay Đua',
            labelEn: 'Drivers Wall',
            tag: 'TAY ĐUA',
            icon: e.jsx(xe, { className: 'w-3.5 h-3.5 text-sky-400' }),
          },
          {
            id: 'pano_technical',
            labelVi: 'Vách Kỹ Thuật',
            labelEn: 'Tech Specs',
            tag: 'KỸ THUẬT',
            icon: e.jsx($, { className: 'w-3.5 h-3.5 text-emerald-400' }),
          },
          {
            id: 'pano_achievements',
            labelVi: 'Vách Thành Tích',
            labelEn: 'Records Wall',
            tag: 'KỶ LỤC',
            icon: e.jsx(fe, { className: 'w-3.5 h-3.5 text-yellow-400' }),
          },
          {
            id: 'overview',
            labelVi: 'Toàn Cảnh Xe & Sàn 360°',
            labelEn: '360° Stage Overview',
            tag: 'ORBIT',
            icon: e.jsx(fn, { className: 'w-3.5 h-3.5 text-purple-400' }),
            isWide: !0,
          },
        ],
        W = [
          {
            id: 'branding',
            labelVi: 'Đọc Vách Logo',
            labelEn: 'Read Launch Wall',
            tag: 'LOGO',
            icon: e.jsx(be, { className: 'w-3.5 h-3.5 text-amber-400' }),
          },
          {
            id: 'drivers',
            labelVi: 'Đọc Vách Tay Đua',
            labelEn: 'Read Drivers Wall',
            tag: 'TAY ĐUA',
            icon: e.jsx(xe, { className: 'w-3.5 h-3.5 text-sky-400' }),
          },
          {
            id: 'technical',
            labelVi: 'Đọc Vách Kỹ Thuật',
            labelEn: 'Read Tech Specs',
            tag: 'KỸ THUẬT',
            icon: e.jsx($, { className: 'w-3.5 h-3.5 text-emerald-400' }),
          },
          {
            id: 'achievements',
            labelVi: 'Đọc Bảng Thành Tích',
            labelEn: 'Read Records Wall',
            tag: 'KỶ LỤC',
            icon: e.jsx(fe, { className: 'w-3.5 h-3.5 text-yellow-400' }),
          },
        ],
        P = [
          {
            id: 'front',
            labelVi: 'Mũi & Cánh Trước',
            labelEn: 'Front Wing & Nose',
            tag: 'FRONT',
            icon: e.jsx($, { className: 'w-3.5 h-3.5 text-red-400' }),
          },
          {
            id: 'cockpit',
            labelVi: 'Buồng Lái & Halo',
            labelEn: 'Cockpit & Halo',
            tag: 'COCKPIT',
            icon: e.jsx(vn, { className: 'w-3.5 h-3.5 text-blue-400' }),
          },
          {
            id: 'rear',
            labelVi: 'Cánh Đuôi & DRS',
            labelEn: 'Rear Wing & DRS',
            tag: 'REAR',
            icon: e.jsx(pe, { className: 'w-3.5 h-3.5 text-amber-400' }),
          },
          {
            id: 'top',
            labelVi: 'Bình Đồ Từ Trên',
            labelEn: 'Top-Down Aero',
            tag: 'TOP',
            icon: e.jsx(ge, { className: 'w-3.5 h-3.5 text-purple-400' }),
          },
        ],
        q = b ? 'fixed inset-x-2 bottom-2 z-30 pb-[env(safe-area-inset-bottom)]' : '';
      return e.jsx('div', {
        className: b
          ? `z-30 pointer-events-auto ${q}`
          : 'flex flex-col items-end pointer-events-auto',
        children: e.jsxs('div', {
          className: b
            ? 'rounded-2xl bg-studio-950/95 border border-studio-800 shadow-2xl p-2 text-white w-full max-h-[70dvh] overflow-y-auto overscroll-contain'
            : 'rounded-2xl bg-studio-950/92 backdrop-blur-2xl border border-studio-800 shadow-2xl p-2 sm:p-2.5 text-white w-[290px] sm:w-[320px] transition-all',
          children: [
            e.jsxs('div', {
              className:
                'flex items-center justify-between pb-1.5 border-b border-studio-800/80 mb-2',
              children: [
                e.jsxs('div', {
                  className: 'flex items-center gap-1.5',
                  children: [
                    e.jsx('span', { className: 'w-2 h-2 rounded-full bg-f1red animate-pulse' }),
                    e.jsxs('span', {
                      className:
                        'text-[11px] font-black uppercase tracking-wider text-studio-200 flex items-center gap-1',
                      children: [
                        e.jsx(bn, { className: 'w-3.5 h-3.5 text-f1red' }),
                        o === 'vi' ? 'Điều Khiển 3D' : '3D Controls',
                      ],
                    }),
                  ],
                }),
                e.jsxs('div', {
                  className: 'flex items-center gap-1',
                  children: [
                    e.jsx('button', {
                      type: 'button',
                      onClick: i,
                      className:
                        'p-1.5 rounded-md text-studio-400 hover:text-white hover:bg-studio-800 transition-colors cursor-pointer min-w-[44px] min-h-[44px] sm:min-w-[26px] sm:min-h-[26px] flex items-center justify-center',
                      title: o === 'vi' ? 'Đặt lại góc nhìn mặc định' : 'Reset view',
                      'aria-label': 'Reset view',
                      children: e.jsx(re, { className: 'w-3.5 h-3.5' }),
                    }),
                    e.jsx('button', {
                      type: 'button',
                      onClick: () => m(!p),
                      className:
                        'p-1.5 rounded-md text-studio-400 hover:text-white hover:bg-studio-800 transition-colors cursor-pointer min-w-[44px] min-h-[44px] sm:min-w-[26px] sm:min-h-[26px] flex items-center justify-center',
                      title: p
                        ? o === 'vi'
                          ? 'Thu gọn'
                          : 'Collapse'
                        : o === 'vi'
                          ? 'Mở rộng'
                          : 'Expand',
                      'aria-label': 'Toggle expand',
                      children: p
                        ? e.jsx(Ne, { className: 'w-3.5 h-3.5' })
                        : e.jsx(Me, { className: 'w-3.5 h-3.5' }),
                    }),
                  ],
                }),
              ],
            }),
            p &&
              e.jsxs('div', {
                className: 'space-y-2.5 animate-fade-in',
                children: [
                  e.jsxs('div', {
                    className: 'space-y-1.5',
                    children: [
                      e.jsxs('div', {
                        className:
                          'grid grid-cols-3 gap-1 bg-studio-900/90 p-1 rounded-xl border border-studio-800',
                        children: [
                          e.jsxs('button', {
                            type: 'button',
                            onClick: () => {
                              (x('pano'), n && !A.some((g) => g.id === n) && t('pano_branding'));
                            },
                            className: `py-1 px-1 rounded-lg text-[10px] font-bold transition-all text-center flex items-center justify-center gap-1 cursor-pointer ${h === 'pano' ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-md font-black' : 'text-studio-400 hover:text-white hover:bg-studio-800/60'}`,
                            children: [
                              e.jsx(Re, { className: 'w-3 h-3 shrink-0' }),
                              e.jsx('span', {
                                className: 'truncate',
                                children: o === 'vi' ? 'Toàn Cảnh' : 'Panoramas',
                              }),
                            ],
                          }),
                          e.jsxs('button', {
                            type: 'button',
                            onClick: () => {
                              (x('direct'), n && !W.some((g) => g.id === n) && t('branding'));
                            },
                            className: `py-1 px-1 rounded-lg text-[10px] font-bold transition-all text-center flex items-center justify-center gap-1 cursor-pointer ${h === 'direct' ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md font-black' : 'text-studio-400 hover:text-white hover:bg-studio-800/60'}`,
                            children: [
                              e.jsx(xn, { className: 'w-3 h-3 shrink-0' }),
                              e.jsx('span', {
                                className: 'truncate',
                                children: o === 'vi' ? 'Đọc Bảng' : 'Read Boards',
                              }),
                            ],
                          }),
                          e.jsxs('button', {
                            type: 'button',
                            onClick: () => {
                              (x('car'), n && !P.some((g) => g.id === n) && t('front'));
                            },
                            className: `py-1 px-1 rounded-lg text-[10px] font-bold transition-all text-center flex items-center justify-center gap-1 cursor-pointer ${h === 'car' ? 'bg-gradient-to-r from-red-500 to-f1red text-white shadow-md font-black' : 'text-studio-400 hover:text-white hover:bg-studio-800/60'}`,
                            children: [
                              e.jsx(ge, { className: 'w-3 h-3 shrink-0' }),
                              e.jsx('span', {
                                className: 'truncate',
                                children: o === 'vi' ? 'Chi Tiết Xe' : 'Car Aero',
                              }),
                            ],
                          }),
                        ],
                      }),
                      h === 'pano' &&
                        e.jsxs('div', {
                          className:
                            'flex items-center justify-between gap-1 p-1 rounded-xl bg-studio-900/90 border border-studio-800',
                          children: [
                            e.jsx('button', {
                              type: 'button',
                              onClick: S,
                              className:
                                'p-1 rounded-lg text-studio-400 hover:text-white hover:bg-studio-800 transition-colors cursor-pointer min-w-[26px] min-h-[26px] flex items-center justify-center',
                              title: o === 'vi' ? 'Vách trước' : 'Previous wall',
                              'aria-label': 'Previous wall',
                              children: e.jsx(Ve, { className: 'w-3.5 h-3.5' }),
                            }),
                            e.jsx('button', {
                              type: 'button',
                              onClick: F,
                              className: `flex-1 py-1 px-2 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${C ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black border-amber-400 shadow-md' : 'bg-studio-800 text-white border-studio-700 hover:bg-studio-700'}`,
                              children: C
                                ? e.jsxs(e.Fragment, {
                                    children: [
                                      e.jsx(Q, { className: 'w-3 h-3 text-black animate-pulse' }),
                                      e.jsx('span', {
                                        children: o === 'vi' ? 'Dừng Tour Duyệt' : 'Pause Tour',
                                      }),
                                    ],
                                  })
                                : e.jsxs(e.Fragment, {
                                    children: [
                                      e.jsx(ee, { className: 'w-3 h-3 text-amber-400' }),
                                      e.jsx('span', {
                                        children:
                                          o === 'vi' ? 'Tour Duyệt 4 Vách' : 'Review 4 Walls',
                                      }),
                                    ],
                                  }),
                            }),
                            e.jsx('button', {
                              type: 'button',
                              onClick: j,
                              className:
                                'p-1 rounded-lg text-studio-400 hover:text-white hover:bg-studio-800 transition-colors cursor-pointer min-w-[26px] min-h-[26px] flex items-center justify-center',
                              title: o === 'vi' ? 'Vách kế tiếp' : 'Next wall',
                              'aria-label': 'Next wall',
                              children: e.jsx(Se, { className: 'w-3.5 h-3.5' }),
                            }),
                          ],
                        }),
                      h === 'direct' &&
                        e.jsxs('p', {
                          className:
                            'text-[9px] text-sky-400/90 font-medium px-1 flex items-center gap-1',
                          children: [
                            e.jsx('span', { children: '✦' }),
                            e.jsx('span', {
                              children:
                                o === 'vi'
                                  ? 'Góc nhìn thẳng trực diện ngang tầm mắt để đọc chữ sắc nét'
                                  : 'Direct eye-level perspective for sharp text reading',
                            }),
                          ],
                        }),
                      e.jsx('div', {
                        className: 'grid grid-cols-2 gap-1.5',
                        children: (h === 'pano' ? A : h === 'direct' ? W : P).map((g) => {
                          const L = n === g.id;
                          return e.jsxs(
                            'button',
                            {
                              type: 'button',
                              onClick: () => {
                                (C && R(!1), t(g.id));
                              },
                              className: `flex items-center justify-between p-1.5 rounded-xl transition-all cursor-pointer border text-left ${g.isWide ? 'col-span-2' : ''} ${L ? 'bg-studio-900 border-amber-500 shadow-md shadow-amber-500/20 text-white' : 'bg-studio-900/70 border-studio-800/80 hover:bg-studio-850 hover:border-studio-700 text-studio-300 hover:text-white'}`,
                              children: [
                                e.jsxs('div', {
                                  className: 'flex items-center gap-1.5 min-w-0 pr-1',
                                  children: [
                                    g.icon,
                                    e.jsx('span', {
                                      className: 'font-bold text-[10px] sm:text-[11px] truncate',
                                      children: o === 'vi' ? g.labelVi : g.labelEn,
                                    }),
                                  ],
                                }),
                                e.jsx('span', {
                                  className: `text-[8px] font-mono px-1 py-0.5 rounded font-black shrink-0 ${L ? 'bg-amber-500 text-black' : 'bg-studio-800 text-studio-400'}`,
                                  children: g.tag,
                                }),
                              ],
                            },
                            g.id,
                          );
                        }),
                      }),
                    ],
                  }),
                  e.jsxs('div', {
                    className: 'pt-2 border-t border-studio-800/80',
                    children: [
                      e.jsx('div', {
                        className: 'flex items-center justify-between mb-1.5 px-0.5',
                        children: e.jsxs('span', {
                          className:
                            'text-[10px] font-black uppercase tracking-wider text-studio-400 flex items-center gap-1',
                          children: [
                            e.jsx(pe, { className: 'w-3 h-3 text-amber-400' }),
                            o === 'vi' ? 'Tiện Ích Tương Tác:' : 'Interactive Tools:',
                          ],
                        }),
                      }),
                      e.jsxs('div', {
                        className: 'grid grid-cols-2 gap-1.5',
                        children: [
                          c &&
                            e.jsxs('button', {
                              type: 'button',
                              onClick: c,
                              className: `p-1.5 rounded-xl border flex items-center justify-between gap-1 text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer ${u ? 'bg-f1red/20 text-red-200 border-f1red/70 shadow-sm' : 'bg-studio-900/70 text-studio-400 border-studio-800 hover:text-white hover:bg-studio-800'}`,
                              title:
                                o === 'vi'
                                  ? 'Bật/Tắt 6 điểm kỹ thuật trên thân xe'
                                  : 'Toggle 6 engineering hotspots',
                              children: [
                                e.jsxs('div', {
                                  className: 'flex items-center gap-1.5 min-w-0',
                                  children: [
                                    e.jsx($, {
                                      className: `w-3.5 h-3.5 shrink-0 ${u ? 'text-f1red' : 'text-studio-400'}`,
                                    }),
                                    e.jsx('span', {
                                      className: 'truncate',
                                      children: o === 'vi' ? 'Điểm Kỹ Thuật' : 'Hotspots',
                                    }),
                                  ],
                                }),
                                e.jsx('span', {
                                  className: `text-[8px] font-black uppercase px-1 py-0.5 rounded shrink-0 ${u ? 'bg-f1red text-white' : 'bg-studio-800 text-studio-400'}`,
                                  children: u
                                    ? o === 'vi'
                                      ? 'BẬT'
                                      : 'ON'
                                    : o === 'vi'
                                      ? 'ẨN'
                                      : 'OFF',
                                }),
                              ],
                            }),
                          e.jsxs('button', {
                            type: 'button',
                            onClick: a,
                            className: `p-1.5 rounded-xl border flex items-center justify-between gap-1 text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer ${r ? 'bg-sky-950/80 text-sky-200 border-sky-500/70 shadow-sm' : 'bg-studio-900/70 text-studio-400 border-studio-800 hover:text-white hover:bg-studio-800'}`,
                            title:
                              o === 'vi' ? 'Tự động xoay xe 360 độ' : 'Toggle 360 auto-rotation',
                            children: [
                              e.jsxs('div', {
                                className: 'flex items-center gap-1.5 min-w-0',
                                children: [
                                  r
                                    ? e.jsx(Q, { className: 'w-3.5 h-3.5 shrink-0 text-sky-400' })
                                    : e.jsx(ee, {
                                        className: 'w-3.5 h-3.5 shrink-0 text-studio-400',
                                      }),
                                  e.jsx('span', {
                                    className: 'truncate',
                                    children: o === 'vi' ? 'Tự Xoay Xe' : 'Auto-Rotate',
                                  }),
                                ],
                              }),
                              e.jsx('span', {
                                className: `text-[8px] font-black uppercase px-1 py-0.5 rounded shrink-0 ${r ? 'bg-sky-500 text-black' : 'bg-studio-800 text-studio-400'}`,
                                children: r
                                  ? o === 'vi'
                                    ? 'CHẠY'
                                    : 'ON'
                                  : o === 'vi'
                                    ? 'DỪNG'
                                    : 'OFF',
                              }),
                            ],
                          }),
                          l &&
                            e.jsxs('button', {
                              type: 'button',
                              onClick: l,
                              className:
                                'col-span-2 p-1.5 rounded-xl border bg-gradient-to-r from-red-950/70 via-studio-900 to-amber-950/50 hover:from-red-900/80 hover:to-amber-900/60 border-amber-500/50 text-amber-300 hover:text-white flex items-center justify-between gap-1 text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer shadow-sm',
                              title:
                                o === 'vi'
                                  ? 'Xem bản vẽ CAD 2D gốc và đối chiếu từng bộ phận'
                                  : 'View original 2D CAD blueprint and compare components',
                              children: [
                                e.jsxs('div', {
                                  className: 'flex items-center gap-1.5 min-w-0',
                                  children: [
                                    e.jsx(oe, { className: 'w-3.5 h-3.5 shrink-0 text-amber-400' }),
                                    e.jsx('span', {
                                      className: 'truncate',
                                      children:
                                        o === 'vi' ? 'So Sánh Bản Gốc 2D' : 'Compare 2D Blueprint',
                                    }),
                                  ],
                                }),
                                e.jsx('span', {
                                  className:
                                    'text-[8px] font-black uppercase px-1 py-0.5 rounded bg-amber-500 text-black shrink-0',
                                  children: '8K CAD',
                                }),
                              ],
                            }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
          ],
        }),
      });
    },
  ),
  An = D.memo(({ activeHotspot: n, onSelectHotspot: t, teamId: r, lang: a }) => {
    const i = z(r);
    return e.jsx('div', {
      className:
        'w-full bg-studio-950/95 backdrop-blur-xl border-t border-b border-studio-800/80 py-3 px-3 sm:px-6 shadow-xl z-20',
      children: e.jsxs('div', {
        className:
          'max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3',
        children: [
          e.jsxs('div', {
            className: 'flex items-center gap-2.5 shrink-0',
            children: [
              e.jsx('div', {
                className:
                  'w-8 h-8 rounded-xl bg-f1red/10 border border-f1red/30 flex items-center justify-center text-f1red',
                children: e.jsx(Ee, { className: 'w-4 h-4' }),
              }),
              e.jsxs('div', {
                children: [
                  e.jsxs('div', {
                    className: 'flex items-center gap-2',
                    children: [
                      e.jsxs('span', {
                        className:
                          'text-[10px] font-mono uppercase tracking-wider text-amber-300 font-bold flex items-center gap-1',
                        children: [
                          e.jsx(Y, { className: 'w-3 h-3 text-amber-400' }),
                          a === 'vi'
                            ? `${k.length} LINH KIỆN KỸ THUẬT`
                            : `${k.length} TECHNICAL COMPONENTS`,
                        ],
                      }),
                      e.jsx('span', {
                        className: 'w-2 h-2 rounded-full shadow-xs',
                        style: { backgroundColor: i.bodyColor },
                      }),
                    ],
                  }),
                  e.jsx('h3', {
                    className:
                      'font-display text-xs sm:text-sm font-black uppercase text-white tracking-wide',
                    children:
                      a === 'vi'
                        ? `Soi Chi Tiết Mẫu Xe ${i.shortCarName}`
                        : `Inspect ${i.shortCarName} Parts`,
                  }),
                ],
              }),
            ],
          }),
          e.jsx('div', {
            className: 'flex items-center gap-2 overflow-x-auto py-1 custom-scrollbar',
            children: k.map((o, u) => {
              const c = (n == null ? void 0 : n.id) === o.id;
              return e.jsxs(
                'button',
                {
                  type: 'button',
                  onClick: () => t(o),
                  className: `flex items-center gap-2 py-2 px-3 min-h-[44px] sm:min-h-0 rounded-xl text-xs font-bold transition-all duration-200 shrink-0 border cursor-pointer ${c ? 'bg-gradient-to-r from-f1red to-red-700 text-white border-white/60 shadow-lg shadow-f1red/30 scale-105' : 'bg-studio-900/90 text-studio-300 border-studio-800 hover:bg-studio-850 hover:text-white hover:border-studio-700'}`,
                  'aria-label': a === 'vi' ? `Xem cận cảnh ${o.nameVi}` : `Inspect ${o.nameEn}`,
                  children: [
                    e.jsx('span', {
                      className: `w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 ${c ? 'bg-white text-f1red shadow-sm' : 'bg-studio-800 text-studio-300'}`,
                      children: u + 1,
                    }),
                    e.jsx('span', {
                      className: 'whitespace-nowrap',
                      children: a === 'vi' ? o.nameVi : o.nameEn,
                    }),
                  ],
                },
                o.id,
              );
            }),
          }),
        ],
      }),
    });
  }),
  Pn = D.memo(
    ({
      enableWheelZoom: n,
      onToggleWheelZoom: t,
      onZoom: r,
      onResetView: a,
      autoRotate: i,
      onToggleAutoRotate: o,
      cameraPreset: u,
      onSelectPreset: c,
      lang: l,
      onOpenSchematic: b,
    }) => {
      const p = [
          { id: 'pano_branding', labelVi: 'Vách Logo', labelEn: 'Launch Wall', code: 'LOGO' },
          { id: 'pano_drivers', labelVi: 'Vách Tay Đua', labelEn: 'Drivers Wall', code: 'TAY ĐUA' },
          {
            id: 'pano_technical',
            labelVi: 'Vách Kỹ Thuật',
            labelEn: 'Tech Specs',
            code: 'KỸ THUẬT',
          },
          {
            id: 'pano_achievements',
            labelVi: 'Vách Thành Tích',
            labelEn: 'Records Wall',
            code: 'KỶ LỤC',
          },
        ],
        m = p.findIndex((x) => x.id === u),
        h = () => {
          if (!c) return;
          const x = m >= 0 ? (m + 1) % p.length : 0;
          c(p[x].id);
        };
      return e.jsx('div', {
        className: 'relative bottom-4 left-1/2 -translate-x-1/2 w-fit z-20 pointer-events-auto',
        children: e.jsxs('div', {
          className:
            'flex items-center gap-1.5 sm:gap-2.5 p-1.5 sm:p-2 rounded-2xl bg-studio-950/85 backdrop-blur-xl border border-studio-800/90 shadow-2xl shadow-black/80 text-white select-none',
          children: [
            e.jsxs('div', {
              className:
                'flex items-center bg-studio-900/90 rounded-xl p-1 border border-studio-800 gap-1',
              children: [
                e.jsxs('div', {
                  className:
                    'hidden md:flex items-center gap-1.5 px-2 text-[10px] font-black uppercase tracking-wider text-studio-400',
                  children: [
                    e.jsx(wn, { className: 'w-3.5 h-3.5 text-amber-400' }),
                    e.jsx('span', { children: l === 'vi' ? 'Lăn Chuột:' : 'Wheel:' }),
                  ],
                }),
                e.jsxs('button', {
                  type: 'button',
                  onClick: () => {
                    n && t();
                  },
                  className: `flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${n ? 'text-studio-400 hover:text-white hover:bg-studio-800/50' : 'bg-studio-800 text-white border border-studio-700 shadow-sm'}`,
                  title:
                    l === 'vi'
                      ? 'Chế độ cuộn trang: Lăn chuột để cuộn xem hồ sơ kỹ thuật bên dưới'
                      : 'Page Scroll: Mouse wheel scrolls the web page down to the dossier',
                  children: [
                    e.jsx('span', { children: l === 'vi' ? 'Cuộn Trang' : 'Page Scroll' }),
                    !n &&
                      e.jsx('span', {
                        className: 'w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5',
                      }),
                  ],
                }),
                e.jsxs('button', {
                  type: 'button',
                  onClick: () => {
                    n || t();
                  },
                  className: `flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${n ? 'bg-amber-500 text-black border border-amber-400 shadow-md shadow-amber-500/20 font-black' : 'text-studio-400 hover:text-white hover:bg-studio-800/50'}`,
                  title:
                    l === 'vi'
                      ? 'Chế độ Zoom 3D: Lăn chuột để phóng to / thu nhỏ xe F1'
                      : '3D Zoom: Mouse wheel zooms the F1 car in/out',
                  children: [
                    e.jsx('span', { children: l === 'vi' ? 'Zoom 3D' : '3D Zoom' }),
                    n &&
                      e.jsx('span', {
                        className: 'w-1.5 h-1.5 rounded-full bg-black animate-pulse ml-0.5',
                      }),
                  ],
                }),
              ],
            }),
            e.jsx('div', { className: 'w-[1px] h-6 bg-studio-800/90 hidden sm:block' }),
            e.jsxs('div', {
              className:
                'flex items-center bg-studio-900/90 rounded-xl p-1 border border-studio-800 gap-0.5',
              children: [
                e.jsx('button', {
                  type: 'button',
                  onClick: () => r('out'),
                  className:
                    'p-2.5 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 text-studio-300 hover:text-white hover:bg-studio-800 rounded-lg transition-colors cursor-pointer',
                  title: l === 'vi' ? 'Thu nhỏ xe (-)' : 'Zoom Out (-)',
                  'aria-label': l === 'vi' ? 'Thu nhỏ xe' : 'Zoom Out',
                  children: e.jsx(je, { className: 'w-3.5 h-3.5' }),
                }),
                e.jsx('div', { className: 'w-[1px] h-4 bg-studio-800' }),
                e.jsx('button', {
                  type: 'button',
                  onClick: () => r('in'),
                  className:
                    'p-2.5 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 text-studio-300 hover:text-white hover:bg-studio-800 rounded-lg transition-colors cursor-pointer',
                  title: l === 'vi' ? 'Phóng to xe (+)' : 'Zoom In (+)',
                  'aria-label': l === 'vi' ? 'Phóng to xe' : 'Zoom In',
                  children: e.jsx(ae, { className: 'w-3.5 h-3.5' }),
                }),
              ],
            }),
            e.jsx('div', { className: 'w-[1px] h-6 bg-studio-800/90 hidden sm:block' }),
            e.jsxs('div', {
              className: 'flex items-center gap-1',
              children: [
                c &&
                  e.jsxs('button', {
                    type: 'button',
                    onClick: h,
                    className: `p-2.5 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 sm:px-2.5 sm:py-1.5 rounded-xl border flex items-center gap-1.5 text-[11px] font-bold transition-all cursor-pointer ${m >= 0 ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-sm' : 'bg-studio-900/90 text-studio-400 border-studio-800 hover:text-white hover:bg-studio-800'}`,
                    title:
                      l === 'vi'
                        ? 'Xem toàn cảnh 4 vách bảng (Logo · Tay Đua · Kỹ Thuật · Thành Tích)'
                        : 'Cycle 4 panoramic wall angles',
                    'aria-label': l === 'vi' ? 'Toàn cảnh 4 vách' : '4-Wall Panorama',
                    children: [
                      e.jsx(Re, {
                        className: `w-3.5 h-3.5 ${m >= 0 ? 'text-amber-400' : 'text-studio-400'}`,
                      }),
                      e.jsx('span', {
                        className: 'hidden md:inline',
                        children:
                          m >= 0
                            ? l === 'vi'
                              ? p[m].labelVi
                              : p[m].labelEn
                            : l === 'vi'
                              ? '4 Bảng'
                              : '4 Walls',
                      }),
                      m >= 0 &&
                        e.jsx('span', {
                          className:
                            'text-[9px] font-mono px-1 rounded bg-amber-500 text-black font-black',
                          children: p[m].code,
                        }),
                    ],
                  }),
                e.jsxs('button', {
                  type: 'button',
                  onClick: o,
                  className: `p-2.5 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 sm:px-2.5 sm:py-1.5 rounded-xl border flex items-center gap-1.5 text-[11px] font-bold transition-all cursor-pointer ${i ? 'bg-sky-500/20 text-sky-300 border-sky-500/60 shadow-sm' : 'bg-studio-900/90 text-studio-400 border-studio-800 hover:text-white hover:bg-studio-800'}`,
                  title: i
                    ? l === 'vi'
                      ? 'Tạm dừng tự xoay 360°'
                      : 'Pause 360° rotation'
                    : l === 'vi'
                      ? 'Bật tự xoay 360°'
                      : 'Start 360° rotation',
                  'aria-label': l === 'vi' ? 'Tự xoay 360°' : '360° Auto-Rotate',
                  children: [
                    i
                      ? e.jsx(Q, { className: 'w-3.5 h-3.5 text-sky-400' })
                      : e.jsx(ee, { className: 'w-3.5 h-3.5' }),
                    e.jsx('span', { className: 'hidden md:inline', children: '360°' }),
                  ],
                }),
                e.jsxs('button', {
                  type: 'button',
                  onClick: a,
                  className:
                    'p-2.5 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 sm:px-2.5 sm:py-1.5 rounded-xl bg-studio-900/90 text-studio-400 hover:text-white hover:bg-studio-800 border border-studio-800 flex items-center gap-1.5 text-[11px] font-bold transition-all cursor-pointer',
                  title: l === 'vi' ? 'Đặt lại góc nhìn mặc định' : 'Reset to default camera view',
                  'aria-label': l === 'vi' ? 'Đặt lại góc nhìn' : 'Reset View',
                  children: [
                    e.jsx(re, { className: 'w-3.5 h-3.5' }),
                    e.jsx('span', {
                      className: 'hidden md:inline',
                      children: l === 'vi' ? 'Mặc Định' : 'Reset',
                    }),
                  ],
                }),
                b &&
                  e.jsxs('button', {
                    type: 'button',
                    onClick: b,
                    className:
                      'p-2.5 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 sm:px-2.5 sm:py-1.5 rounded-xl bg-gradient-to-r from-red-600/30 to-amber-500/20 text-amber-300 hover:text-white hover:from-red-600/50 hover:to-amber-500/40 border border-amber-500/50 flex items-center gap-1.5 text-[11px] font-bold transition-all cursor-pointer shadow-sm',
                    title:
                      l === 'vi'
                        ? 'So sánh xe 3D với Bản Vẽ Kỹ Thuật CAD 2D Gốc & Bảng màu'
                        : 'Compare 3D car with Original 2D CAD Blueprint & Color Matrix',
                    'aria-label': l === 'vi' ? 'Bản Gốc 2D' : '2D Blueprint',
                    children: [
                      e.jsx(oe, { className: 'w-3.5 h-3.5 text-amber-400' }),
                      e.jsx('span', {
                        className: 'hidden sm:inline',
                        children: l === 'vi' ? 'Bản Gốc 2D' : '2D CAD',
                      }),
                    ],
                  }),
              ],
            }),
          ],
        }),
      });
    },
  ),
  Ln = ({ isOpen: n, onClose: t, teamId: r, lang: a }) => {
    const [i, o] = s.useState(1),
      [u, c] = s.useState(!1),
      l = s.useMemo(() => B[r] || B.ferrari, [r]),
      b = s.useMemo(() => z(r), [r]);
    if (
      (s.useEffect(() => {
        n && o(1);
      }, [n, r]),
      s.useEffect(() => {
        if (!n || typeof document > 'u') return;
        const m = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const h = (x) => {
          x.key === 'Escape' && t();
        };
        return (
          window.addEventListener('keydown', h),
          () => {
            ((document.body.style.overflow = m), window.removeEventListener('keydown', h));
          }
        );
      }, [n, t]),
      !n)
    )
      return null;
    const p = e.jsx('div', {
      role: 'dialog',
      'aria-modal': 'true',
      className:
        'fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fade-in',
      onClick: t,
      children: e.jsxs('div', {
        className: `bg-studio-950 border border-studio-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white transition-all duration-300 ${u ? 'w-full h-full rounded-none' : 'w-full max-w-6xl max-h-[94vh]'}`,
        onClick: (m) => m.stopPropagation(),
        children: [
          e.jsxs('div', {
            className:
              'flex items-center justify-between px-5 py-4 border-b border-studio-800/80 bg-studio-900/60 backdrop-blur-md shrink-0',
            children: [
              e.jsxs('div', {
                className: 'flex items-center gap-3',
                children: [
                  e.jsx(V, { teamId: r, size: 'md' }),
                  e.jsxs('div', {
                    children: [
                      e.jsxs('div', {
                        className: 'flex items-center gap-2',
                        children: [
                          e.jsx('span', {
                            className:
                              'text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-f1red/20 text-f1red border border-f1red/30',
                            children: a === 'vi' ? 'BẢN VẼ KỸ THUẬT CAD 2D' : '2D CAD SCHEMATIC',
                          }),
                          e.jsx('span', {
                            className: 'text-xs font-mono text-studio-400 font-bold',
                            children: b.schematicCode,
                          }),
                        ],
                      }),
                      e.jsx('h2', {
                        className:
                          'font-display text-base sm:text-lg font-black uppercase tracking-wide text-white flex items-center gap-2 mt-0.5',
                        children: e.jsx('span', {
                          children: a === 'vi' ? b.schematicTitleVi : b.schematicTitleEn,
                        }),
                      }),
                    ],
                  }),
                ],
              }),
              e.jsxs('div', {
                className: 'flex items-center gap-2',
                children: [
                  e.jsx('button', {
                    type: 'button',
                    onClick: () => c((m) => !m),
                    className:
                      'p-2 rounded-xl bg-studio-800/80 hover:bg-studio-700 text-studio-300 hover:text-white transition-colors cursor-pointer',
                    title: u
                      ? a === 'vi'
                        ? 'Thu nhỏ cửa sổ'
                        : 'Exit Fullscreen'
                      : a === 'vi'
                        ? 'Phóng to toàn màn hình'
                        : 'Fullscreen',
                    children: u
                      ? e.jsx(Cn, { className: 'w-4 h-4' })
                      : e.jsx(Te, { className: 'w-4 h-4' }),
                  }),
                  e.jsx('button', {
                    type: 'button',
                    onClick: t,
                    className:
                      'p-2 rounded-xl bg-studio-800/80 hover:bg-red-600/30 text-studio-300 hover:text-red-400 transition-colors cursor-pointer',
                    title: a === 'vi' ? 'Đóng cửa sổ' : 'Close',
                    children: e.jsx(_, { className: 'w-4 h-4' }),
                  }),
                ],
              }),
            ],
          }),
          e.jsxs('div', {
            className:
              'flex flex-wrap items-center justify-between gap-3 px-5 py-2.5 bg-studio-950/90 border-b border-studio-800/60 shrink-0',
            children: [
              e.jsxs('div', {
                className: 'flex items-center gap-2 text-xs font-mono text-studio-300',
                children: [
                  e.jsx('span', { className: 'w-2 h-2 rounded-full bg-emerald-400 animate-pulse' }),
                  e.jsx('span', {
                    children:
                      a === 'vi'
                        ? 'Sơ đồ CAD khí động học 2D chính hãng chuẩn 8K (Chiếu cạnh & Chiếu trên tỉ lệ 1:1)'
                        : 'Authentic 8K 2D CAD Aerodynamic Flow Schematic (Side Elevation & Top-Down Plan View 1:1)',
                  }),
                ],
              }),
              e.jsxs('div', {
                className: 'flex items-center gap-2',
                children: [
                  e.jsx('button', {
                    type: 'button',
                    onClick: () => o((m) => Math.max(0.75, Number((m - 0.25).toFixed(2)))),
                    className:
                      'p-1.5 rounded-lg bg-studio-800 hover:bg-studio-700 text-studio-200 transition-colors cursor-pointer',
                    title: a === 'vi' ? 'Thu nhỏ' : 'Zoom Out',
                    children: e.jsx(je, { className: 'w-3.5 h-3.5' }),
                  }),
                  e.jsxs('span', {
                    className:
                      'text-xs font-mono font-bold px-2.5 py-1 rounded bg-studio-900 border border-studio-800 min-w-[52px] text-center',
                    children: [Math.round(i * 100), '%'],
                  }),
                  e.jsx('button', {
                    type: 'button',
                    onClick: () => o((m) => Math.min(3, Number((m + 0.25).toFixed(2)))),
                    className:
                      'p-1.5 rounded-lg bg-studio-800 hover:bg-studio-700 text-studio-200 transition-colors cursor-pointer',
                    title: a === 'vi' ? 'Phóng to' : 'Zoom In',
                    children: e.jsx(ae, { className: 'w-3.5 h-3.5' }),
                  }),
                  e.jsxs('button', {
                    type: 'button',
                    onClick: () => o(1),
                    className:
                      'inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-studio-800 hover:bg-studio-700 text-[11px] font-bold text-studio-200 transition-colors cursor-pointer',
                    title: a === 'vi' ? 'Đặt lại kích thước chuẩn' : 'Reset Zoom',
                    children: [
                      e.jsx(re, { className: 'w-3 h-3' }),
                      e.jsx('span', { children: '100%' }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          e.jsx('div', {
            className:
              'flex-1 overflow-auto p-3 sm:p-5 flex items-center justify-center bg-[#05070b]',
            children: e.jsxs('div', {
              className: `relative rounded-2xl border border-studio-800 bg-[#06080c] overflow-hidden flex items-center justify-center w-full shadow-2xl transition-all duration-200 ${u ? 'h-full min-h-[500px]' : 'min-h-[460px] max-h-[70vh]'}`,
              children: [
                e.jsx('div', {
                  className:
                    'transition-transform duration-200 ease-out max-w-full max-h-full flex items-center justify-center p-2',
                  style: { transform: `scale(${i})`, transformOrigin: 'center center' },
                  children: e.jsx('img', {
                    src: b.schematicImage,
                    alt: a === 'vi' ? b.schematicTitleVi : b.schematicTitleEn,
                    className:
                      'max-h-[68vh] w-auto object-contain rounded-xl shadow-2xl select-none',
                    loading: 'eager',
                    decoding: 'async',
                  }),
                }),
                e.jsxs('div', {
                  className:
                    'absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-black/85 backdrop-blur-md border border-white/10 text-[10px] font-mono text-studio-400 select-none pointer-events-none',
                  children: [
                    l.name.toUpperCase(),
                    ' · 2026 TECHNICAL SPECIFICATION · 1:1 CAD SCALE',
                  ],
                }),
              ],
            }),
          }),
          e.jsxs('div', {
            className:
              'px-5 py-3 border-t border-studio-800/80 bg-studio-950 flex flex-wrap items-center justify-between gap-3 text-xs text-studio-400 shrink-0',
            children: [
              e.jsxs('div', {
                className: 'flex items-center gap-2',
                children: [
                  e.jsx('span', { className: 'w-2 h-2 rounded-full bg-emerald-400' }),
                  e.jsx('span', {
                    children:
                      a === 'vi'
                        ? `${l.name} · Động cơ: ${b.powerUnit} · Khối lượng: 798kg (FIA Min Weight)`
                        : `${l.name} · PU: ${b.powerUnit} · Mass: 798kg (FIA Min Weight)`,
                  }),
                ],
              }),
              e.jsx('div', {
                className: 'flex items-center gap-2',
                children: e.jsx('button', {
                  type: 'button',
                  onClick: t,
                  className:
                    'px-4 py-1.5 rounded-xl bg-studio-800 hover:bg-studio-700 text-white font-bold transition-colors cursor-pointer',
                  children: a === 'vi' ? 'Đóng' : 'Close',
                }),
              }),
            ],
          }),
        ],
      }),
    });
    return typeof document > 'u' ? p : ln.createPortal(p, document.body);
  },
  Ae = '(prefers-reduced-motion: reduce)',
  Bn = (n) => {
    if (typeof window > 'u' || typeof window.matchMedia != 'function') return null;
    const t = window.matchMedia(Ae),
      r = (a) => n(a.matches);
    return typeof t.addEventListener == 'function'
      ? (t.addEventListener('change', r),
        { current: t.matches, unsubscribe: () => t.removeEventListener('change', r) })
      : (t.addListener(r), { current: t.matches, unsubscribe: () => t.removeListener(r) });
  },
  Hn = () =>
    typeof window > 'u' || typeof window.matchMedia != 'function'
      ? !1
      : window.matchMedia(Ae).matches,
  Dn = () => {
    const [n, t] = s.useState(() => Hn());
    return (
      s.useEffect(() => {
        const r = Bn(t);
        if (r) return (t(r.current), r.unsubscribe);
      }, []),
      n
    );
  },
  Fn = (n) => (n ? 'demand' : 'never'),
  Wn = (n) => !n,
  nt = (n) => (n ? 0 : 2e3),
  tt = 1,
  it = 1,
  In = 1,
  M = {
    car: {
      entries: new Map(),
      inactiveOrder: [],
      hits: 0,
      misses: 0,
      evictionScheduled: !1,
      evictionEpoch: 0,
    },
    studio: {
      entries: new Map(),
      inactiveOrder: [],
      hits: 0,
      misses: 0,
      evictionScheduled: !1,
      evictionEpoch: 0,
    },
  },
  Pe = (n) => {
    if (n && typeof n.dispose == 'function')
      try {
        n.dispose();
      } catch {}
  },
  se = (n) => {
    (n.textures.forEach((t) => Pe(t)), n.textures.clear());
  },
  Le = (n) => {
    (n.forEach((t) => Pe(t)), n.clear());
  },
  le = (n) => {
    const t = M[n];
    for (; t.inactiveOrder.length > In;) {
      const r = t.inactiveOrder[t.inactiveOrder.length - 1],
        a = t.entries.get(r);
      (a && a.refCount === 0 && (se(a), t.entries.delete(r)), t.inactiveOrder.pop());
    }
  },
  Gn = (n) => {
    const t = M[n];
    if (t.evictionScheduled) return;
    t.evictionScheduled = !0;
    const r = t.evictionEpoch;
    queueMicrotask(() => {
      t.evictionEpoch === r && ((t.evictionScheduled = !1), le(n));
    });
  },
  ie = (n, t) => {
    n.inactiveOrder = n.inactiveOrder.filter((r) => r !== t);
  },
  Be = (n, t, r) => {
    let a = !1;
    return () => {
      if (a) return;
      a = !0;
      const i = M[n],
        o = i.entries.get(t);
      if (o === r && !(o.refCount <= 0) && ((o.refCount -= 1), !(o.refCount > 0))) {
        if (o.disposeWhenUnused) {
          (ie(i, t), se(o), i.entries.delete(t));
          return;
        }
        (ie(i, t), i.inactiveOrder.unshift(t), Gn(n));
      }
    };
  },
  Un = (n, t) => {
    const r = M[n],
      a = r.entries.get(t);
    return a
      ? (a.refCount === 0 && ie(r, t),
        (a.refCount += 1),
        (a.disposeWhenUnused = !1),
        (a.lastUsed = performance.now()),
        (r.hits += 1),
        le(n),
        { textures: a.textures, release: Be(n, t, a), hit: !0, key: t })
      : null;
  },
  at = (n, t, r) => {
    const a = Un(n, t);
    if (a) return (Le(r), a);
    const i = M[n],
      o = {
        id: Symbol(t),
        textures: r,
        refCount: 1,
        lastUsed: performance.now(),
        disposeWhenUnused: !1,
      };
    return (
      i.entries.set(t, o),
      (i.misses += 1),
      le(n),
      { textures: r, release: Be(n, t, o), hit: !1, key: t }
    );
  },
  rt = (n) => {
    Le(n);
  },
  we = (n) => {
    const t = M[n];
    let r = 0,
      a = 0,
      i = 0;
    return (
      t.entries.forEach((o) => {
        (o.refCount > 0 && (r += 1), (a += o.refCount), o.disposeWhenUnused && (i += 1));
      }),
      {
        entries: t.entries.size,
        referencedEntries: r,
        totalReferences: a,
        pendingDisposals: i,
        inactiveOrderLength: t.inactiveOrder.length,
        hits: t.hits,
        misses: t.misses,
      }
    );
  },
  On = (n) => {
    ['car', 'studio'].forEach((r) => {
      const a = M[r];
      (a.entries.forEach((i, o) => {
        i.refCount === 0 ? (se(i), a.entries.delete(o)) : (i.disposeWhenUnused = !0);
      }),
        (a.inactiveOrder.length = 0),
        (a.hits = 0),
        (a.misses = 0),
        (a.evictionScheduled = !1),
        (a.evictionEpoch += 1));
    });
  },
  Ce = {
    ferrari: {
      teamId: 'ferrari',
      teamName: 'Ferrari',
      primarySponsor: 'Scuderia Ferrari HP',
      rearWingText: 'Ferrari',
      rearWingSub: 'HP',
      rearWingBg: '#18181b',
      rearWingTextColor: '#ffffff',
      rearWingAccent: '#ffe500',
      sidepodText: 'HP',
      sidepodSub: 'Shell',
      sidepodTextColor: '#ffffff',
      engineCoverText: 'Cavallino',
      engineCoverLogo: '🐎',
      haloText: 'HP · FERRARI',
      noseSponsor: 'Shell',
      drivers: [
        { number: '16', name: 'Charles Leclerc', code: 'LEC' },
        { number: '44', name: 'Lewis Hamilton', code: 'HAM' },
      ],
      accentStripe: '#ffe500',
    },
    mercedes: {
      teamId: 'mercedes',
      teamName: 'Mercedes',
      primarySponsor: 'PETRONAS',
      rearWingText: 'PETRONAS',
      rearWingSub: 'PRIMAX',
      rearWingBg: '#090a0f',
      rearWingTextColor: '#00a19c',
      rearWingAccent: '#e10600',
      sidepodText: 'PETRONAS',
      sidepodSub: 'TeamViewer',
      sidepodTextColor: '#ffffff',
      engineCoverText: 'AMG',
      engineCoverLogo: '⭐',
      haloText: 'PETRONAS',
      noseSponsor: 'INEOS',
      drivers: [
        { number: '63', name: 'George Russell', code: 'RUS' },
        { number: '12', name: 'Kimi Antonelli', code: 'ANT' },
      ],
      accentStripe: '#00a19c',
    },
    redbull: {
      teamId: 'redbull',
      teamName: 'Red Bull',
      primarySponsor: 'Oracle Red Bull Racing',
      rearWingText: 'ORACLE',
      rearWingSub: 'RED BULL',
      rearWingBg: '#050714',
      rearWingTextColor: '#ffffff',
      rearWingAccent: '#ff1801',
      sidepodText: 'ORACLE',
      sidepodSub: 'BYBIT',
      sidepodTextColor: '#facc15',
      engineCoverText: 'Red Bull',
      engineCoverLogo: '🐂',
      haloText: 'ORACLE',
      noseSponsor: 'Mobil 1',
      drivers: [
        { number: '1', name: 'Max Verstappen', code: 'VER' },
        { number: '6', name: 'Isack Hadjar', code: 'HAD' },
      ],
      accentStripe: '#facc15',
    },
    mclaren: {
      teamId: 'mclaren',
      teamName: 'McLaren',
      primarySponsor: 'McLaren F1 Team',
      rearWingText: 'OKX',
      rearWingSub: 'VELO',
      rearWingBg: '#121214',
      rearWingTextColor: '#ffffff',
      rearWingAccent: '#ff8000',
      sidepodText: 'OKX',
      sidepodSub: 'Chrome',
      sidepodTextColor: '#ff8000',
      engineCoverText: 'McLaren',
      engineCoverLogo: '🏎️',
      haloText: 'Google Chrome',
      noseSponsor: 'DP WORLD',
      drivers: [
        { number: '4', name: 'Lando Norris', code: 'NOR' },
        { number: '81', name: 'Oscar Piastri', code: 'PIA' },
      ],
      accentStripe: '#4ade80',
    },
    astonmartin: {
      teamId: 'astonmartin',
      teamName: 'Aston Martin',
      primarySponsor: 'Aramco',
      rearWingText: 'ARAMCO',
      rearWingSub: 'COGNIZANT',
      rearWingBg: '#021814',
      rearWingTextColor: '#ffffff',
      rearWingAccent: '#cbf348',
      sidepodText: 'ARAMCO',
      sidepodSub: 'JCB',
      sidepodTextColor: '#cbf348',
      engineCoverText: 'Aston Martin',
      engineCoverLogo: '🦅',
      haloText: 'ARAMCO',
      noseSponsor: 'Boss',
      drivers: [
        { number: '14', name: 'Fernando Alonso', code: 'ALO' },
        { number: '18', name: 'Lance Stroll', code: 'STR' },
      ],
      accentStripe: '#cbf348',
    },
    alpine: {
      teamId: 'alpine',
      teamName: 'Alpine',
      primarySponsor: 'BWT Alpine F1 Team',
      rearWingText: 'BWT',
      rearWingSub: 'ALPINE',
      rearWingBg: '#081426',
      rearWingTextColor: '#fd4bc7',
      rearWingAccent: '#0090ff',
      sidepodText: 'BWT',
      sidepodSub: 'Renault',
      sidepodTextColor: '#ffffff',
      engineCoverText: 'Alpine A',
      engineCoverLogo: '🔺',
      haloText: 'BWT',
      noseSponsor: 'Castrol',
      drivers: [
        { number: '10', name: 'Pierre Gasly', code: 'GAS' },
        { number: '43', name: 'Jack Doohan', code: 'DOO' },
      ],
      accentStripe: '#fd4bc7',
    },
    racingbulls: {
      teamId: 'racingbulls',
      teamName: 'Racing Bulls',
      primarySponsor: 'Visa Cash App RB',
      rearWingText: 'VISA',
      rearWingSub: 'Cash App',
      rearWingBg: '#020b24',
      rearWingTextColor: '#ffffff',
      rearWingAccent: '#3b82f6',
      sidepodText: 'VISA',
      sidepodSub: 'HUGO',
      sidepodTextColor: '#60a5fa',
      engineCoverText: 'RB Bulls',
      engineCoverLogo: '⚡',
      haloText: 'CASH APP',
      noseSponsor: 'TUDOR',
      drivers: [
        { number: '22', name: 'Yuki Tsunoda', code: 'TSU' },
        { number: '30', name: 'Liam Lawson', code: 'LAW' },
      ],
      accentStripe: '#ffffff',
    },
    haas: {
      teamId: 'haas',
      teamName: 'Haas',
      primarySponsor: 'MoneyGram Haas F1 Team',
      rearWingText: 'MoneyGram',
      rearWingSub: 'HAAS',
      rearWingBg: '#111113',
      rearWingTextColor: '#ffffff',
      rearWingAccent: '#e10600',
      sidepodText: 'MoneyGram',
      sidepodSub: 'TGR Toyota',
      sidepodTextColor: '#ffffff',
      engineCoverText: 'Haas CNC',
      engineCoverLogo: '🛠️',
      haloText: 'MoneyGram',
      noseSponsor: 'Chipotle',
      drivers: [
        { number: '31', name: 'Esteban Ocon', code: 'OCO' },
        { number: '87', name: 'Oliver Bearman', code: 'BEA' },
      ],
      accentStripe: '#e10600',
    },
    williams: {
      teamId: 'williams',
      teamName: 'Williams',
      primarySponsor: 'Williams Racing',
      rearWingText: 'KOMATSU',
      rearWingSub: 'GULF',
      rearWingBg: '#041026',
      rearWingTextColor: '#ffffff',
      rearWingAccent: '#00a3e0',
      sidepodText: 'KOMATSU',
      sidepodSub: 'KRAKEN',
      sidepodTextColor: '#38bdf8',
      engineCoverText: 'Williams W',
      engineCoverLogo: '🔋',
      haloText: 'KOMATSU',
      noseSponsor: 'Gulf Oil',
      drivers: [
        { number: '23', name: 'Alexander Albon', code: 'ALB' },
        { number: '55', name: 'Carlos Sainz', code: 'SAI' },
      ],
      accentStripe: '#38bdf8',
    },
    audi: {
      teamId: 'audi',
      teamName: 'Audi',
      primarySponsor: 'Audi F1 Team',
      rearWingText: 'AUDI SPORT',
      rearWingSub: 'REVOLUT',
      rearWingBg: '#121214',
      rearWingTextColor: '#ffffff',
      rearWingAccent: '#f97316',
      sidepodText: 'AUDI',
      sidepodSub: 'Revolut',
      sidepodTextColor: '#ffffff',
      engineCoverText: 'Vorsprung',
      engineCoverLogo: '⭕⭕⭕⭕',
      haloText: 'AUDI SPORT',
      noseSponsor: 'BP Castrol',
      drivers: [
        { number: '27', name: 'Nico Hülkenberg', code: 'HUL' },
        { number: '5', name: 'Gabriel Bortoleto', code: 'BOR' },
      ],
      accentStripe: '#f97316',
    },
    cadillac: {
      teamId: 'cadillac',
      teamName: 'Cadillac',
      primarySponsor: 'Cadillac Formula 1 Team',
      rearWingText: 'CADILLAC',
      rearWingSub: 'TWINSPARK',
      rearWingBg: '#09090b',
      rearWingTextColor: '#e2b342',
      rearWingAccent: '#ffffff',
      sidepodText: 'CADILLAC',
      sidepodSub: 'GM Power',
      sidepodTextColor: '#e2b342',
      engineCoverText: 'Cadillac Racing',
      engineCoverLogo: '🛡️',
      haloText: 'CADILLAC',
      noseSponsor: 'General Motors',
      drivers: [
        { number: '99', name: 'Cadillac Driver A', code: 'CAD' },
        { number: '98', name: 'Cadillac Driver B', code: 'GM' },
      ],
      accentStripe: '#e2b342',
    },
  },
  Kn = (n) => Ce[n] || Ce.ferrari,
  $n = s.lazy(() =>
    ke(() => import('./Showroom3DLoader-BSskS5J-.js'), __vite__mapDeps([0, 1, 2, 3])).then((n) => ({
      default: n.ShowroomLoadingPanel,
    })),
  ),
  _n = s.lazy(() =>
    ke(
      () => import('./ShowroomScene-DPwOKgBc.js'),
      __vite__mapDeps([4, 1, 2, 5, 6, 3, 7, 8, 9]),
    ).then((n) => ({ default: n.ShowroomScene })),
  ),
  zn = () =>
    typeof window < 'u' && new URLSearchParams(window.location.search).has('showroomDiagnostics'),
  ye = ({ teamName: n, carModelName: t, primaryColor: r, lang: a }) =>
    e.jsxs('div', {
      className:
        'w-full h-full flex flex-col items-center justify-center p-8 text-center bg-[#09090e] text-white',
      children: [
        e.jsx('div', {
          className:
            'w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-black mb-4 shadow-xl',
          style: { backgroundColor: r },
          children: 'F1',
        }),
        e.jsxs('h3', {
          className: 'font-display text-xl font-bold uppercase tracking-wider mb-2 text-white',
          children: [n, ' — ', t],
        }),
        e.jsxs('div', {
          className:
            'inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-4',
          children: [
            e.jsx('span', { children: '⚠️' }),
            e.jsx('span', {
              children:
                a === 'vi'
                  ? 'Chế độ 2D (Thiết bị chưa bật tăng tốc đồ họa WebGL)'
                  : '2D Mode (WebGL hardware acceleration unavailable)',
            }),
          ],
        }),
        e.jsx('p', {
          className: 'text-xs text-studio-400 max-w-md leading-relaxed mb-6',
          children:
            a === 'vi'
              ? 'Bạn có thể kích hoạt tăng tốc phần cứng trong cài đặt trình duyệt để xem mô hình 3D xoay 360°, hoặc cuộn xuống dưới để khám phá trọn bộ hồ sơ kỹ thuật chi tiết của xe.'
              : 'Enable hardware acceleration in your browser settings for full 360° 3D interaction, or scroll down to explore the complete technical dossier.',
        }),
        e.jsx('button', {
          onClick: () => {
            var i;
            (i = document.getElementById('technical-dossier')) == null ||
              i.scrollIntoView({ behavior: 'smooth' });
          },
          className:
            'px-5 py-2.5 rounded-xl bg-f1red text-white text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition-all cursor-pointer shadow-lg shadow-f1red/20',
          children: a === 'vi' ? 'Xem Hồ Sơ Kỹ Thuật Chi Tiết ↓' : 'View Technical Dossier ↓',
        }),
      ],
    }),
  qn = () => {
    const { lang: n } = kn(),
      [t, r] = cn(),
      a = t.get('team'),
      i = a && B[a] ? a : null,
      [o, u] = s.useState(i),
      [c, l] = s.useState(i || 'mercedes');
    i && i !== o && (u(i), l(i));
    const b = s.useCallback(
        (d) => {
          (l(d), r({ team: d }, { replace: !0 }));
        },
        [r],
      ),
      [p, m] = s.useState(null),
      [h, x] = s.useState('overview'),
      [C, R] = s.useState(0),
      v = Dn(),
      [j, S] = s.useState(() => Wn(v)),
      F = s.useRef(v);
    s.useEffect(() => {
      F.current !== v && ((F.current = v), v && S(!1));
    }, [v]);
    const [A, W] = s.useState(!1),
      [P, q] = s.useState(!1),
      [g, L] = s.useState(0),
      [He, De] = s.useState(null),
      [Fe, We] = s.useState(!1),
      [Ie, I] = s.useState(!1),
      ce = s.useRef(null),
      [Ge, Ue] = s.useState(!0),
      [Oe, Ke] = s.useState(() => typeof document > 'u' || document.visibilityState === 'visible'),
      [J, he] = s.useState(!1),
      [$e, _e] = s.useState(0),
      [ze, qe] = s.useState(null),
      [G, Je] = s.useState({ key: '', car: !1, studio: !1 });
    (s.useEffect(() => () => On(), []),
      s.useEffect(() => {
        if (!zn()) return;
        const d = window;
        d.__SHOWROOM_CACHE_STATS__ = () => ({ car: we('car'), studio: we('studio') });
      }, []),
      s.useEffect(() => {
        const d = () => Ke(document.visibilityState === 'visible');
        return (
          document.addEventListener('visibilitychange', d),
          () => document.removeEventListener('visibilitychange', d)
        );
      }, []),
      s.useEffect(() => {
        const d = ce.current;
        if (!d || typeof IntersectionObserver > 'u') return;
        const w = new IntersectionObserver(([T]) => Ue(T.isIntersecting), {
          rootMargin: '160px 0px',
          threshold: 0.01,
        });
        return (w.observe(d), () => w.disconnect());
      }, []));
    const de = Oe && Ge && !J,
      [H, Xe] = s.useState(() => Mn(typeof window > 'u' ? 1920 : window.innerWidth).isMobileLayout);
    s.useEffect(() => {
      const d = Rn(Xe);
      return () => {
        d && d();
      };
    }, []);
    const U = `${c}:${n}:${$e}`,
      O = ze === U,
      Ze = G.key === U && G.car,
      Ye = G.key === U && G.studio,
      Qe = `${c}:${n}:${(p == null ? void 0 : p.id) ?? 'none'}:${A}:${h ?? 'none'}:${C}:${j}:${P}:${g}:${v}`;
    (s.useEffect(() => {
      O && performance.mark('showroom:loader-hidden');
    }, [O]),
      s.useCallback((d) => {
        (he(d), d || _e((w) => w + 1));
      }, []));
    const en = s.useCallback((d, w) => {
        Je((T) => {
          const K =
            T.key === d ? { ...T, [w]: !0 } : { key: d, car: w === 'car', studio: w === 'studio' };
          return T.key === K.key && T.car === K.car && T.studio === K.studio ? T : K;
        });
      }, []),
      nn = s.useCallback(() => {
        W((d) => !d);
      }, []),
      ue = s.useCallback(() => {
        S((d) => !d);
      }, []),
      tn = s.useCallback(() => {
        q((d) => !d);
      }, []);
    s.useEffect(() => {
      const d = () => {
        We(window.scrollY > 450);
      };
      return (
        window.addEventListener('scroll', d, { passive: !0 }),
        () => window.removeEventListener('scroll', d)
      );
    }, []);
    const an = () => {
        var d;
        (d = document.getElementById('technical-dossier')) == null ||
          d.scrollIntoView({ behavior: 'smooth' });
      },
      rn = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      on = s.useCallback((d) => {
        (De(d), L((w) => w + 1));
      }, []),
      me = s.useCallback(() => {
        (m(null), x('overview'), R((d) => d + 1), S(!0));
      }, []),
      X = s.useCallback((d) => {
        (x(d), R((w) => w + 1), m(null), S(!1));
      }, []),
      Z = s.useCallback((d) => {
        (m(d), x(null), S(!1));
      }, []),
      E = s.useMemo(() => B[c] || B.ferrari, [c]),
      f = s.useMemo(() => z(c), [c]),
      sn = s.useMemo(() => Kn(c), [c]);
    return e.jsxs('div', {
      className: 'min-h-screen bg-studio-950 text-white flex flex-col font-sans',
      children: [
        e.jsx('div', {
          className:
            'bg-studio-950/95 backdrop-blur-xl border-b border-studio-800/80 sticky top-16 z-30 shadow-md',
          children: e.jsxs('div', {
            className: 'page-container py-2.5 space-y-2',
            children: [
              e.jsxs('div', {
                className:
                  'flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5',
                children: [
                  e.jsxs('div', {
                    className: 'flex items-center gap-2.5 min-w-0',
                    children: [
                      e.jsx('span', {
                        className:
                          'w-7 h-7 rounded-lg bg-f1red flex items-center justify-center font-display text-[11px] font-black text-white shadow-md shadow-f1red/30 shrink-0',
                        children: '3D',
                      }),
                      e.jsxs('div', {
                        className: 'flex items-center gap-2 flex-wrap',
                        children: [
                          e.jsx('h1', {
                            className:
                              'font-display text-sm sm:text-base font-black uppercase tracking-wider text-white',
                            children:
                              n === 'vi'
                                ? 'Showroom Kỹ Thuật 3D Xe F1'
                                : 'F1 3D Technical Showroom',
                          }),
                          e.jsx('span', {
                            className:
                              'text-[9px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-950/80 border border-emerald-700/80 px-2 py-0.5 rounded-full',
                            children: n === 'vi' ? 'MẪU THAM CHIẾU' : 'REFERENCE MODEL',
                          }),
                        ],
                      }),
                    ],
                  }),
                  e.jsxs('div', {
                    className: 'flex items-center gap-2 shrink-0 self-end sm:self-center',
                    children: [
                      e.jsxs('button', {
                        type: 'button',
                        onClick: () => I(!0),
                        className:
                          'inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[44px] sm:min-h-0 rounded-xl bg-gradient-to-r from-red-600/25 to-amber-500/20 hover:from-red-600/35 hover:to-amber-500/30 text-xs font-bold text-amber-300 hover:text-white transition-all border border-amber-500/40 cursor-pointer shadow-sm',
                        title:
                          n === 'vi'
                            ? 'Xem bản vẽ CAD 2D gốc & bảng màu xe'
                            : 'View original 2D CAD blueprint & color matrix',
                        children: [
                          e.jsx(oe, { className: 'w-3.5 h-3.5 text-amber-400' }),
                          e.jsx('span', {
                            children: n === 'vi' ? 'Bản Vẽ CAD 2D' : '2D Blueprint',
                          }),
                        ],
                      }),
                      e.jsxs('button', {
                        type: 'button',
                        onClick: an,
                        className:
                          'inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[44px] sm:min-h-0 rounded-xl bg-studio-900 hover:bg-studio-800 text-xs font-bold text-studio-200 hover:text-white transition-colors border border-studio-700/70 cursor-pointer shadow-sm',
                        children: [
                          e.jsx('span', {
                            children: n === 'vi' ? 'Hồ Sơ Kỹ Thuật' : 'Technical Dossier',
                          }),
                          e.jsx(Me, { className: 'w-3.5 h-3.5 text-f1red' }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              e.jsx(Nn, { selectedTeamId: c, onSelectTeam: b, lang: n }),
            ],
          }),
        }),
        e.jsxs('div', {
          ref: ce,
          className:
            'relative w-full h-[620px] sm:h-[680px] lg:h-[720px] overflow-hidden bg-gradient-to-b from-[#0f1118] via-[#07080c] to-[#020204] select-none',
          children: [
            e.jsx('div', {
              className:
                'absolute inset-0 pointer-events-none transition-colors duration-700 ease-out',
              style: {
                background: `radial-gradient(ellipse 65% 55% at 50% 38%, ${E.primaryColor}16 0%, transparent 68%)`,
              },
            }),
            e.jsxs('div', {
              className:
                'absolute bottom-4 left-4 z-10 pointer-events-none hidden lg:flex flex-col text-[10px] font-mono tracking-widest text-studio-500 uppercase select-none space-y-0.5',
              children: [
                e.jsxs('span', {
                  className: 'inline-flex items-center gap-1 text-studio-400 font-bold',
                  children: [
                    e.jsx('span', { children: 'STUDIO' }),
                    e.jsx('span', { children: f.shortCarName }),
                    e.jsx('span', { children: '·' }),
                    e.jsx('span', { children: 'PHOTOMETRIC STAGE' }),
                  ],
                }),
                e.jsx('span', { children: 'CALIBRATION: 5600K CRI 98 // CYCLORAMA SPEC' }),
              ],
            }),
            e.jsx('div', {
              className: 'absolute top-3 left-3 sm:top-4 sm:left-4 z-20 pointer-events-none',
              children: e.jsxs('div', {
                className: H
                  ? 'p-2 rounded-2xl bg-studio-950/85 border border-studio-800/80 shadow-xl flex items-center gap-1.5 max-w-[190px]'
                  : 'p-3 sm:p-3.5 rounded-2xl bg-studio-950/85 backdrop-blur-xl border border-studio-800/80 shadow-2xl space-y-1.5 max-w-[280px] sm:max-w-xs',
                children: [
                  e.jsxs('div', {
                    className: 'flex items-center gap-2 min-w-0',
                    children: [
                      e.jsx(V, { teamId: c, size: 'sm' }),
                      e.jsxs('span', {
                        className: H
                          ? 'text-[10px] font-black uppercase tracking-wider text-white truncate'
                          : 'text-[10px] font-black uppercase tracking-widest text-studio-400',
                        children: [
                          E.name,
                          !H && e.jsxs(e.Fragment, { children: [' · ', f.carModelName] }),
                        ],
                      }),
                    ],
                  }),
                  !H &&
                    e.jsx('h2', {
                      className:
                        'font-display text-sm sm:text-base font-black uppercase text-white leading-tight',
                      children: E.fullName,
                    }),
                  e.jsxs('div', {
                    className:
                      'text-[11px] text-studio-300 space-y-0.5 pt-1.5 border-t border-studio-800/60 font-medium',
                    children: [
                      e.jsxs('p', { className: 'truncate', children: ['⚡ ', E.powerUnit] }),
                      e.jsxs('p', {
                        className: 'text-studio-400',
                        children: [n === 'vi' ? 'Trụ sở:' : 'Base:', ' ', E.base],
                      }),
                    ],
                  }),
                ],
              }),
            }),
            e.jsx('div', {
              className: 'absolute top-3 right-3 sm:top-4 sm:right-4 z-20',
              children: e.jsx(jn, {
                cameraPreset: h,
                onSelectPreset: X,
                autoRotate: j,
                onToggleAutoRotate: ue,
                onResetView: me,
                lang: n,
                showHotspots: A,
                onToggleHotspots: nn,
                onOpenSchematic: () => I(!0),
                isMobileLayout: H,
              }),
            }),
            e.jsx(En, {
              fallback: e.jsx(ye, {
                teamName: E.name,
                carModelName: f.carModelName,
                primaryColor: E.primaryColor,
                lang: n,
              }),
              children: e.jsx(s.Suspense, {
                fallback: null,
                children: e.jsx(_n, {
                  selectedTeamId: c,
                  lang: n,
                  isCanvasActive: de,
                  frameloopMode: Fn(de),
                  sceneRevision: Qe,
                  activeHotspot: p,
                  handleSelectHotspot: Z,
                  showHotspots: A,
                  startupSceneKey: U,
                  handleScenePartReady: en,
                  cameraPreset: h,
                  presetTrigger: C,
                  autoRotate: j,
                  startupReady: O,
                  reducedMotion: v,
                  enableWheelZoom: P,
                  zoomTrigger: g,
                  zoomDirection: He,
                  onContextStateChange: he,
                  isCarReady: Ze,
                  isStudioReady: Ye,
                  setUsableSceneKey: qe,
                }),
              }),
            }),
            !O &&
              !J &&
              e.jsx('div', {
                className:
                  'absolute inset-0 z-30 flex items-center justify-center bg-studio-950/35 pointer-events-none',
                children: e.jsx(s.Suspense, { fallback: null, children: e.jsx($n, {}) }),
              }),
            J &&
              e.jsx('div', {
                className: 'absolute inset-0 z-30',
                children: e.jsx(ye, {
                  teamName: E.name,
                  carModelName: f.carModelName,
                  primaryColor: E.primaryColor,
                  lang: n,
                }),
              }),
            e.jsx('div', {
              className:
                'absolute inset-x-0 bottom-0 pb-[env(safe-area-inset-bottom)] pointer-events-none m3c-hud-safe',
              children: e.jsx(Pn, {
                enableWheelZoom: P,
                onToggleWheelZoom: tn,
                onZoom: on,
                onResetView: me,
                autoRotate: j,
                onToggleAutoRotate: ue,
                cameraPreset: h,
                onSelectPreset: X,
                lang: n,
                onOpenSchematic: () => I(!0),
              }),
            }),
            e.jsx(Vn, {
              hotspot: p,
              teamId: c,
              onClose: () => {
                (m(null), x('overview'));
              },
              onSelectHotspot: Z,
              lang: n,
            }),
            e.jsx(Ln, { isOpen: Ie, onClose: () => I(!1), teamId: c, lang: n, onFocusPart: X }),
          ],
        }),
        e.jsx(An, { activeHotspot: p, onSelectHotspot: Z, teamId: c, lang: n }),
        e.jsx('div', {
          id: 'technical-dossier',
          className: 'bg-studio-950 text-white border-t border-studio-800 py-12 scroll-mt-14',
          children: e.jsxs('div', {
            className: 'page-container space-y-10',
            children: [
              e.jsxs('div', {
                className:
                  'flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-studio-800 pb-6',
                children: [
                  e.jsxs('div', {
                    children: [
                      e.jsxs('div', {
                        className: 'flex items-center gap-2',
                        children: [
                          e.jsx(V, { teamId: c, size: 'sm' }),
                          e.jsx('span', {
                            className: 'text-xs font-black uppercase tracking-widest text-f1red',
                            children:
                              n === 'vi' ? 'Hồ Sơ Kỹ Thuật Đội Đua' : 'Technical Dossier & Machine',
                          }),
                        ],
                      }),
                      e.jsxs('h3', {
                        className:
                          'font-display text-2xl sm:text-3xl font-black uppercase text-white mt-1 flex items-center gap-3 flex-wrap',
                        children: [
                          e.jsx('span', { children: f.fullName }),
                          e.jsx('span', {
                            className:
                              'text-sm font-bold tracking-wider text-studio-400 font-mono bg-studio-900 border border-studio-800 px-3 py-1 rounded-full',
                            children: f.carModelName,
                          }),
                        ],
                      }),
                    ],
                  }),
                  e.jsx('div', {
                    className: 'flex items-center gap-3',
                    children: e.jsxs(hn, {
                      to: `/teams/${c}?season=2026`,
                      className:
                        'inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider border border-white/15 backdrop-blur-md transition-all cursor-pointer',
                      children: [
                        e.jsx('span', { children: n === 'vi' ? 'Xem Hồ Sơ Đội' : 'Team Profile' }),
                        e.jsx(yn, { className: 'w-3.5 h-3.5 text-f1red' }),
                      ],
                    }),
                  }),
                ],
              }),
              e.jsxs('div', {
                className:
                  'flex flex-wrap items-center gap-4 text-xs text-studio-300 font-mono py-2.5 px-4 rounded-xl bg-studio-900/60 border border-studio-800/80',
                children: [
                  e.jsxs('div', {
                    children: [
                      e.jsx('span', {
                        className: 'text-studio-500 font-sans',
                        children: n === 'vi' ? 'Tay đua: ' : 'Drivers: ',
                      }),
                      e.jsx('span', {
                        className: 'text-white font-bold',
                        children: n === 'vi' ? f.driversVi : f.driversEn,
                      }),
                    ],
                  }),
                  e.jsx('div', { className: 'w-1 h-1 rounded-full bg-studio-700 hidden sm:block' }),
                  e.jsxs('div', {
                    children: [
                      e.jsx('span', {
                        className: 'text-studio-500 font-sans',
                        children: n === 'vi' ? 'Lãnh đội: ' : 'Principal: ',
                      }),
                      e.jsx('span', { className: 'text-studio-200', children: f.teamPrincipal }),
                    ],
                  }),
                  e.jsx('div', { className: 'w-1 h-1 rounded-full bg-studio-700 hidden sm:block' }),
                  e.jsxs('div', {
                    children: [
                      e.jsx('span', {
                        className: 'text-studio-500 font-sans',
                        children: n === 'vi' ? 'Trụ sở: ' : 'Base: ',
                      }),
                      e.jsx('span', { className: 'text-studio-200', children: f.base }),
                    ],
                  }),
                  e.jsx('div', { className: 'w-1 h-1 rounded-full bg-studio-700 hidden sm:block' }),
                  e.jsxs('div', {
                    children: [
                      e.jsx('span', {
                        className: 'text-studio-500 font-sans',
                        children: n === 'vi' ? 'Tài trợ chính: ' : 'Title Partner: ',
                      }),
                      e.jsx('span', {
                        className: 'text-amber-300 font-bold',
                        children: sn.primarySponsor,
                      }),
                    ],
                  }),
                ],
              }),
              e.jsxs('div', {
                className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4',
                children: [
                  e.jsx('div', {
                    className:
                      'p-5 rounded-2xl bg-studio-900/60 border border-studio-800 space-y-2 flex flex-col justify-between',
                    children: e.jsxs('div', {
                      className: 'space-y-2',
                      children: [
                        e.jsxs('div', {
                          className: 'flex items-center justify-between',
                          children: [
                            e.jsx('div', {
                              className:
                                'w-8 h-8 rounded-lg bg-red-950/70 border border-red-800/80 flex items-center justify-center text-f1red font-bold text-sm',
                              children: '01',
                            }),
                            e.jsx('span', {
                              className:
                                'text-[10px] font-bold uppercase tracking-wider text-studio-500 font-mono',
                              children: 'Aerodynamics',
                            }),
                          ],
                        }),
                        e.jsx('h4', {
                          className: 'font-display text-base font-bold text-white uppercase',
                          children:
                            n === 'vi' ? 'Khí Động Học & Khung Gầm' : 'Aero & Ground Effect',
                        }),
                        e.jsx('p', {
                          className: 'text-xs text-studio-400 leading-relaxed',
                          children: n === 'vi' ? f.aeroPhilosophyVi : f.aeroPhilosophyEn,
                        }),
                      ],
                    }),
                  }),
                  e.jsx('div', {
                    className:
                      'p-5 rounded-2xl bg-studio-900/60 border border-studio-800 space-y-2 flex flex-col justify-between',
                    children: e.jsxs('div', {
                      className: 'space-y-2',
                      children: [
                        e.jsxs('div', {
                          className: 'flex items-center justify-between',
                          children: [
                            e.jsx('div', {
                              className:
                                'w-8 h-8 rounded-lg bg-amber-950/70 border border-amber-800/80 flex items-center justify-center text-amber-400 font-bold text-sm',
                              children: '02',
                            }),
                            e.jsx('span', {
                              className:
                                'text-[10px] font-bold uppercase tracking-wider text-studio-500 font-mono',
                              children: 'Power Unit',
                            }),
                          ],
                        }),
                        e.jsxs('h4', {
                          className:
                            'font-display text-base font-bold text-white uppercase truncate',
                          children: [
                            f.powerUnit.split(' ')[0],
                            ' ',
                            f.powerUnit.split(' ')[1] || 'Hybrid',
                          ],
                        }),
                        e.jsx('p', {
                          className: 'text-xs text-studio-300 font-mono',
                          children: f.powerUnit,
                        }),
                        e.jsx('p', {
                          className: 'text-xs text-studio-400 leading-relaxed',
                          children: n === 'vi' ? f.powertrainNoteVi : f.powertrainNoteEn,
                        }),
                      ],
                    }),
                  }),
                  e.jsx('div', {
                    className:
                      'p-5 rounded-2xl bg-studio-900/60 border border-studio-800 space-y-2 flex flex-col justify-between',
                    children: e.jsxs('div', {
                      className: 'space-y-2',
                      children: [
                        e.jsxs('div', {
                          className: 'flex items-center justify-between',
                          children: [
                            e.jsx('div', {
                              className:
                                'w-8 h-8 rounded-lg bg-emerald-950/70 border border-emerald-800/80 flex items-center justify-center text-emerald-400 font-bold text-sm',
                              children: '03',
                            }),
                            e.jsx('span', {
                              className:
                                'text-[10px] font-bold uppercase tracking-wider text-studio-500 font-mono',
                              children: 'Safety Cell',
                            }),
                          ],
                        }),
                        e.jsx('h4', {
                          className: 'font-display text-base font-bold text-white uppercase',
                          children: n === 'vi' ? 'An Toàn Titan Halo' : 'Titanium Halo Cell',
                        }),
                        e.jsx('p', {
                          className: 'text-xs text-studio-400 leading-relaxed',
                          children:
                            n === 'vi'
                              ? `Khung bảo vệ Titan Grade 5 sơn phối màu ${f.teamName} chịu lực va chạm tĩnh 12.3 tấn bảo vệ tuyệt đối vùng buồng lái tay đua.`
                              : `Grade 5 Titanium safety cell finished in ${f.teamName} livery withstanding 12.3 tonnes of impact force shielding the cockpit.`,
                        }),
                      ],
                    }),
                  }),
                  e.jsx('div', {
                    className:
                      'p-5 rounded-2xl bg-studio-900/60 border border-studio-800 space-y-2 flex flex-col justify-between',
                    children: e.jsxs('div', {
                      className: 'space-y-2',
                      children: [
                        e.jsxs('div', {
                          className: 'flex items-center justify-between',
                          children: [
                            e.jsx('div', {
                              className:
                                'w-8 h-8 rounded-lg bg-sky-950/70 border border-sky-800/80 flex items-center justify-center text-sky-400 font-bold text-sm',
                              children: '04',
                            }),
                            e.jsx('span', {
                              className:
                                'text-[10px] font-bold uppercase tracking-wider text-studio-500 font-mono',
                              children: 'Pirelli & Brakes',
                            }),
                          ],
                        }),
                        e.jsx('h4', {
                          className: 'font-display text-base font-bold text-white uppercase',
                          children:
                            n === 'vi' ? 'Lốp Pirelli 18-Inch & Phanh' : '18-Inch Pirelli & Brakes',
                        }),
                        e.jsx('p', {
                          className: 'text-xs text-studio-400 leading-relaxed',
                          children:
                            n === 'vi'
                              ? 'Thành lốp mỏng 18 inch kết hợp mâm hợp kim Magiê và đĩa phanh Carbon Brembo đạt 1,000°C khi hãm tốc từ 340 km/h.'
                              : 'Low-profile rubber minimizes sidewall deflection, paired with Brembo carbon-carbon brake discs glowing red at 1,000°C.',
                        }),
                      ],
                    }),
                  }),
                ],
              }),
            ],
          }),
        }),
        Fe &&
          e.jsxs('button', {
            type: 'button',
            onClick: rn,
            className:
              'fixed bottom-6 right-6 z-40 p-3 rounded-2xl bg-f1red/95 hover:bg-f1red text-white shadow-2xl backdrop-blur-md border border-white/20 transition-all hover:scale-110 cursor-pointer animate-fade-in flex items-center gap-2 text-xs font-bold shadow-f1red/30 active:scale-95',
            'aria-label': n === 'vi' ? 'Lên đầu trang xem xe 3D' : 'Back to 3D Stage',
            children: [
              e.jsx(Ne, { className: 'w-4 h-4' }),
              e.jsx('span', {
                className: 'hidden sm:inline',
                children: n === 'vi' ? 'Lên Đầu Trang 3D' : 'Back to 3D',
              }),
            ],
          }),
      ],
    });
  },
  ot = Object.freeze(
    Object.defineProperty({ __proto__: null, ShowroomView: qn }, Symbol.toStringTag, {
      value: 'Module',
    }),
  );
export { tt as C, k as F, it as S, Un as a, at as b, Kn as c, rt as d, nt as e, ot as f, z as g };
