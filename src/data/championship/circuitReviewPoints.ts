/**
 * Circuit Street View & Track Review Points Database
 * Contains real-world photo checkpoints, Google Street View coordinates,
 * apex speeds, corner telemetry, and driving review notes for F1 tracks.
 */

export interface TrackReviewPoint {
  id: string;
  circuitId: string;
  nameVi: string;
  nameEn: string;
  turnLabel: string;
  turnNumber?: number;
  sectionType: 'straight' | 'hairpin' | 'chicane' | 'sweeper' | 'grid';
  // SVG coordinates for placing camera pin on the schematic track map
  svgPoint: { x: number; y: number };
  // Real GPS coordinates for Google Street View link
  lat: number;
  lng: number;
  // Real photo URL
  imageUrl: string;
  // Corner engineering telemetry
  telemetry: {
    gear: number;
    speedKmh: number;
    brakingDistanceM?: number;
    gForceLateral?: number;
  };
  descriptionVi: string;
  descriptionEn: string;
  racingTipVi: string;
  racingTipEn: string;
}

export const CIRCUIT_REVIEW_POINTS: Record<string, TrackReviewPoint[]> = {
  'albert-park': [
    {
      id: 'ap-grid',
      circuitId: 'albert-park',
      nameVi: 'Vạch Xuất Phát & Đường Thẳng Pit',
      nameEn: 'Main Start/Finish Pit Straight',
      turnLabel: 'Main Straight',
      sectionType: 'grid',
      svgPoint: { x: 120, y: 300 },
      lat: -37.8497,
      lng: 144.968,
      imageUrl: '/images/circuits/albert_park_pit_straight.jpg',
      telemetry: {
        gear: 8,
        speedKmh: 330,
        brakingDistanceM: 65,
        gForceLateral: 1.2,
      },
      descriptionVi:
        'Đoạn đường thẳng dài nhất chặng đua, nơi 20 chiếc xe F1 dàn hàng trên vạch xuất phát và tăng tốc từ 0 lên hơn 320 km/h trước khi dồn vào khúc cua Turn 1.',
      descriptionEn:
        'The main straight of Albert Park where 20 F1 cars launch off the grid, accelerating from 0 to over 320 km/h before the heavy braking zone into Turn 1.',
      racingTipVi: 'Tận dụng tối đa cánh gió DRS và luồng gió hút (slipstream) của xe phía trước để vượt xe.',
      racingTipEn: 'Deploy maximum DRS and tow behind the leading car for prime overtaking into Turn 1.',
    },
    {
      id: 'ap-turn-1',
      circuitId: 'albert-park',
      nameVi: 'Khúc Cua Turn 1 & 2 - Jones Chicane',
      nameEn: 'Turn 1 & 2 - Jones Chicane',
      turnLabel: 'Turn 1-2',
      turnNumber: 1,
      sectionType: 'chicane',
      svgPoint: { x: 95, y: 240 },
      lat: -37.8465,
      lng: 144.965,
      imageUrl: '/images/circuits/albert_park_turn_1.jpg',
      telemetry: {
        gear: 3,
        speedKmh: 145,
        brakingDistanceM: 95,
        gForceLateral: 4.5,
      },
      descriptionVi:
        'Khu vực phanh gấp căng thẳng nhất vòng đua: xe giảm tốc đột ngột từ 320 km/h xuống 145 km/h trong chưa đầy 100m. Điểm nóng của các pha tranh chấp ngay sau pha xuất phát.',
      descriptionEn:
        'The hardest braking zone of the circuit: cars scrub speed from 320 km/h to 145 km/h in under 100m. Major overtaking hotspot on Lap 1.',
      racingTipVi: 'Bám gờ kerb phải ở Turn 1 rồi đổi hướng nhanh sang trái ở Turn 2, tránh để bánh xe khóa cứng (lock-up).',
      racingTipEn: 'Clip the right kerb at Turn 1 and transition rapidly left for Turn 2 without locking up.',
    },
    {
      id: 'ap-turn-3',
      circuitId: 'albert-park',
      nameVi: 'Khúc Cua Turn 3 - Brabham Corner',
      nameEn: 'Turn 3 - Brabham Corner',
      turnLabel: 'Turn 3',
      turnNumber: 3,
      sectionType: 'hairpin',
      svgPoint: { x: 110, y: 190 },
      lat: -37.843,
      lng: 144.969,
      imageUrl: '/images/circuits/albert_park_turn_1.jpg',
      telemetry: {
        gear: 2,
        speedKmh: 105,
        brakingDistanceM: 80,
        gForceLateral: 3.8,
      },
      descriptionVi:
        'Góc cua vuông 90 độ hẹp với gờ giảm tốc bên trong. Xe cần chuyển về số 2 để có lực kéo tối ưu khi tăng tốc thoát cua.',
      descriptionEn:
        'Tight 90-degree right hand corner with prominent kerbs. Requires downshifting to 2nd gear for optimal traction out of the corner.',
      racingTipVi: 'Chậm ở lối vào, nhanh ở lối thoát (Slow in, fast out) để chuẩn bị cho đoạn tăng tốc tiếp theo.',
      racingTipEn: 'Prioritize exit traction to carry momentum down into the Lakeside run.',
    },
    {
      id: 'ap-lakeside',
      circuitId: 'albert-park',
      nameVi: 'Khúc Cong Ven Hồ Albert Park - Turn 8 & 9',
      nameEn: 'Lakeside Sweeper - Turn 8 & 9',
      turnLabel: 'Lakeside Run',
      turnNumber: 9,
      sectionType: 'sweeper',
      svgPoint: { x: 290, y: 50 },
      lat: -37.842,
      lng: 144.975,
      imageUrl: '/images/circuits/albert_park_lakeside.jpg',
      telemetry: {
        gear: 7,
        speedKmh: 310,
        brakingDistanceM: 30,
        gForceLateral: 4.8,
      },
      descriptionVi:
        'Khúc đường cong tốc độ cao chạy dọc theo mặt nước hồ Albert Park thơ mộng với nền phía xa là đường chân trời thành phố Melbourne. Xe mở cánh DRS và chịu lực ép G-Force lên tới 4.8G.',
      descriptionEn:
        'Stunning high-speed sweeping curve tracing the perimeter of Albert Park Lake with the Melbourne city skyline in the background. DRS enabled at over 300 km/h with 4.8G lateral load.',
      racingTipVi: 'Giữ vô lăng ổn định, tránh rung lắc vì bất kỳ dao động nào ở tốc độ 300 km/h cũng có thể khiến xe mất bám đường.',
      racingTipEn: 'Hold a silky smooth line as any sudden steering jerk at 300 km/h can unsettle the floor aerodynamics.',
    },
    {
      id: 'ap-turn-11',
      circuitId: 'albert-park',
      nameVi: 'Khúc Chicane Clark - Turn 11 & 12',
      nameEn: 'Turn 11 & 12 - Clark Chicane',
      turnLabel: 'Turn 11-12',
      turnNumber: 11,
      sectionType: 'chicane',
      svgPoint: { x: 425, y: 180 },
      lat: -37.848,
      lng: 144.978,
      imageUrl: '/images/circuits/albert_park_turn_1.jpg',
      telemetry: {
        gear: 6,
        speedKmh: 240,
        brakingDistanceM: 50,
        gForceLateral: 4.4,
      },
      descriptionVi:
        'Khúc cua chuyển hướng trái - phải ở tốc độ rất cao (240 km/h). Chiếc xe F1 phải nhảy lên gờ kerb để rút ngắn quỹ đạo mà vẫn giữ được độ bám khí động học.',
      descriptionEn:
        'Ultra-fast left-right chicane taken in 6th gear at 240 km/h. Drivers aggressively attack the kerbs to straighten out the trajectory.',
      racingTipVi: 'Đòi hỏi sự tự tin tột độ vào lực nén khí động học (downforce) của xe.',
      racingTipEn: 'Requires absolute trust in the vehicle aerodynamic downforce floor sealing.',
    },
    {
      id: 'ap-final',
      circuitId: 'albert-park',
      nameVi: 'Khúc Cua Cuối Turn 14 & Lối Vào Pit',
      nameEn: 'Turn 14 - Ascari & Pit Entry',
      turnLabel: 'Turn 14',
      turnNumber: 14,
      sectionType: 'hairpin',
      svgPoint: { x: 370, y: 315 },
      lat: -37.852,
      lng: 144.972,
      imageUrl: '/images/circuits/albert_park_pit_straight.jpg',
      telemetry: {
        gear: 3,
        speedKmh: 120,
        brakingDistanceM: 70,
        gForceLateral: 3.6,
      },
      descriptionVi:
        'Khúc cua cuối cùng khép lại 1 vòng đua Albert Park. Lối rẽ vào Pit Lane nằm ở bên phải ngay trước khúc cua này.',
      descriptionEn:
        'The final corner completing the Albert Park lap. The pit entry lane peels off to the right just before the apex.',
      racingTipVi: 'Đạp ga sớm và mượt mà để đạt vận tốc tối đa ngay khi lao ra đường thẳng đích.',
      racingTipEn: 'Get on the throttle as early as possible to maximize speed onto the main straight.',
    },
  ],
};

/**
 * Retrieve review checkpoints for a given circuit
 */
export function getCircuitReviewPoints(circuitId: string): TrackReviewPoint[] {
  return CIRCUIT_REVIEW_POINTS[circuitId] || CIRCUIT_REVIEW_POINTS['albert-park'];
}
