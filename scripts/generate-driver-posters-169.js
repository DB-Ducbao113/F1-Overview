import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.resolve(__dirname, '../public/images/drivers');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const TEAM_THEMES = {
  ferrari: { primary: '#dc2626', secondary: '#ffe500', accent: '#ffffff', name: 'Scuderia Ferrari', carColor: '#ef4444' },
  mclaren: { primary: '#ff8000', secondary: '#00d2be', accent: '#1f2937', name: 'McLaren F1 Team', carColor: '#f97316' },
  redbull: { primary: '#1e40af', secondary: '#ef4444', accent: '#f59e0b', name: 'Red Bull Racing', carColor: '#1d4ed8' },
  mercedes: { primary: '#00a19c', secondary: '#00e5ff', accent: '#ffffff', name: 'Mercedes-AMG PETRONAS', carColor: '#0d9488' },
  astonmartin: { primary: '#00594f', secondary: '#cedc00', accent: '#10b981', name: 'Aston Martin Aramco', carColor: '#047857' },
  alpine: { primary: '#0090ff', secondary: '#ff87bc', accent: '#38bdf8', name: 'BWT Alpine F1 Team', carColor: '#0284c7' },
  racingbulls: { primary: '#4338ca', secondary: '#38bdf8', accent: '#f43f5e', name: 'Visa Cash App RB', carColor: '#3b82f6' },
  haas: { primary: '#b91c1c', secondary: '#e5e7eb', accent: '#9ca3af', name: 'MoneyGram Haas F1 Team', carColor: '#dc2626' },
  williams: { primary: '#0369a1', secondary: '#00e5ff', accent: '#ffffff', name: 'Williams Racing', carColor: '#0284c7' },
  audi: { primary: '#15803d', secondary: '#f50537', accent: '#4ade80', name: 'Audi Revolut F1 Team', carColor: '#16a34a' },
  cadillac: { primary: '#b45309', secondary: '#fbbf24', accent: '#dc2626', name: 'Cadillac F1 Team', carColor: '#d97706' },
};

const DRIVERS = [
  // Ferrari
  { id: 'leclerc', number: 16, code: 'LEC', name: 'CHARLES LECLERC', teamId: 'ferrari', flag: '🇲🇨', country: 'Monaco', gp: 'MONACO GP • HOME RACE', delta: 'P1 > P1', flagColors: ['#dc2626', '#ffffff'] },
  { id: 'hamilton', number: 44, code: 'HAM', name: 'LEWIS HAMILTON', teamId: 'ferrari', flag: '🇬🇧', country: 'United Kingdom', gp: 'BRITISH GP • 9X RECORD', delta: 'P1 > P1', flagColors: ['#00247d', '#cf142b', '#ffffff'] },
  // McLaren
  { id: 'norris', number: 4, code: 'NOR', name: 'LANDO NORRIS', teamId: 'mclaren', flag: '🇬🇧', country: 'United Kingdom', gp: 'MIAMI GP • MAIDEN VICTORY', delta: 'P5 > P1', flagColors: ['#00247d', '#cf142b', '#ffffff'] },
  { id: 'piastri', number: 81, code: 'PIA', name: 'OSCAR PIASTRI', teamId: 'mclaren', flag: '🇦🇺', country: 'Australia', gp: 'HUNGARIAN GP • VICTORY', delta: 'P2 > P1', flagColors: ['#00247d', '#ffffff', '#cf142b'] },
  // Red Bull
  { id: 'verstappen', number: 1, code: 'VER', name: 'MAX VERSTAPPEN', teamId: 'redbull', flag: '🇳🇱', country: 'Netherlands', gp: 'DUTCH GP • WORLD CHAMPION', delta: 'P1 > P1', flagColors: ['#ae1c28', '#ffffff', '#21468b'] },
  { id: 'hadjar', number: 6, code: 'HAD', name: 'ISACK HADJAR', teamId: 'redbull', flag: '🇫🇷', country: 'France', gp: 'AUSTRIAN GP • RED BULL RING', delta: 'P6 > P1', flagColors: ['#002654', '#ffffff', '#ed2939'] },
  // Mercedes
  { id: 'russell', number: 63, code: 'RUS', name: 'GEORGE RUSSELL', teamId: 'mercedes', flag: '🇬🇧', country: 'United Kingdom', gp: 'SILVERSTONE GP • HOME RACE', delta: 'P1 > P1', flagColors: ['#00247d', '#cf142b', '#ffffff'] },
  { id: 'antonelli', number: 12, code: 'ANT', name: 'KIMI ANTONELLI', teamId: 'mercedes', flag: '🇮🇹', country: 'Italy', gp: 'ITALIAN GP • HOME RACE', delta: 'P19 > P1', flagColors: ['#009246', '#ffffff', '#ce2b37'] },
  // Aston Martin
  { id: 'alonso', number: 14, code: 'ALO', name: 'FERNANDO ALONSO', teamId: 'astonmartin', flag: '🇪🇸', country: 'Spain', gp: 'SPANISH GP • 33RD VICTORY', delta: 'P2 > P1', flagColors: ['#aa151b', '#f1bf00', '#aa151b'] },
  { id: 'stroll', number: 18, code: 'STR', name: 'LANCE STROLL', teamId: 'astonmartin', flag: '🇨🇦', country: 'Canada', gp: 'CANADIAN GP • MONTREAL', delta: 'P7 > P1', flagColors: ['#ff0000', '#ffffff', '#ff0000'] },
  // Alpine
  { id: 'gasly', number: 10, code: 'GAS', name: 'PIERRE GASLY', teamId: 'alpine', flag: '🇫🇷', country: 'France', gp: 'MONZA GP • VICTORY GLORY', delta: 'P10 > P1', flagColors: ['#002654', '#ffffff', '#ed2939'] },
  { id: 'colapinto', number: 43, code: 'COL', name: 'FRANCO COLAPINTO', teamId: 'alpine', flag: '🇦🇷', country: 'Argentina', gp: 'BAKU GP • STREET MASTER', delta: 'P9 > P1', flagColors: ['#74acdf', '#ffffff', '#74acdf'] },
  { id: 'doohan', number: 61, code: 'DOO', name: 'JACK DOOHAN', teamId: 'alpine', flag: '🇦🇺', country: 'Australia', gp: 'AUSTRALIAN GP • ALBERT PARK', delta: 'P8 > P1', flagColors: ['#00247d', '#ffffff', '#cf142b'] },
  // Racing Bulls
  { id: 'lawson', number: 30, code: 'LAW', name: 'LIAM LAWSON', teamId: 'racingbulls', flag: '🇳🇿', country: 'New Zealand', gp: 'SINGAPORE GP • NIGHT SPRINT', delta: 'P6 > P1', flagColors: ['#00247d', '#ffffff', '#cc142b'] },
  { id: 'lindblad', number: 41, code: 'LIN', name: 'ARVID LINDBLAD', teamId: 'racingbulls', flag: '🇬🇧', country: 'United Kingdom', gp: 'SILVERSTONE GP • ROOKIE STAR', delta: 'P8 > P1', flagColors: ['#00247d', '#cf142b', '#ffffff'] },
  { id: 'tsunoda', number: 22, code: 'TSU', name: 'YUKI TSUNODA', teamId: 'racingbulls', flag: '🇯🇵', country: 'Japan', gp: 'SUZUKA GP • HOME HERO', delta: 'P6 > P1', flagColors: ['#ffffff', '#bc002d', '#ffffff'] },
  { id: 'ricciardo', number: 3, code: 'RIC', name: 'DANIEL RICCIARDO', teamId: 'racingbulls', flag: '🇦🇺', country: 'Australia', gp: 'MONACO GP • REDEMPTION WIN', delta: 'P1 > P1', flagColors: ['#00247d', '#ffffff', '#cf142b'] },
  // Haas
  { id: 'ocon', number: 31, code: 'OCO', name: 'ESTEBAN OCON', teamId: 'haas', flag: '🇫🇷', country: 'France', gp: 'HUNGARIAN GP • VICTORY HERO', delta: 'P8 > P1', flagColors: ['#002654', '#ffffff', '#ed2939'] },
  { id: 'bearman', number: 87, code: 'BEA', name: 'OLIVER BEARMAN', teamId: 'haas', flag: '🇬🇧', country: 'United Kingdom', gp: 'JEDDAH GP • SENSATIONAL RUN', delta: 'P7 > P1', flagColors: ['#00247d', '#cf142b', '#ffffff'] },
  { id: 'magnussen', number: 20, code: 'MAG', name: 'KEVIN MAGNUSSEN', teamId: 'haas', flag: '🇩🇰', country: 'Denmark', gp: 'INTERLAGOS GP • POLE HERO', delta: 'P4 > P1', flagColors: ['#c60c30', '#ffffff', '#c60c30'] },
  // Williams
  { id: 'sainz', number: 55, code: 'SAI', name: 'CARLOS SAINZ', teamId: 'williams', flag: '🇪🇸', country: 'Spain', gp: 'SINGAPORE GP • SMOOTH OPERATOR', delta: 'P1 > P1', flagColors: ['#aa151b', '#f1bf00', '#aa151b'] },
  { id: 'albon', number: 23, code: 'ALB', name: 'ALEXANDER ALBON', teamId: 'williams', flag: '🇹🇭', country: 'Thailand', gp: 'MONZA GP • TEMPLE OF SPEED', delta: 'P5 > P1', flagColors: ['#a51931', '#ffffff', '#2d2a4a'] },
  { id: 'sargeant', number: 2, code: 'SAR', name: 'LOGAN SARGEANT', teamId: 'williams', flag: '🇺🇸', country: 'United States', gp: 'AUSTIN GP • HOME SOIL', delta: 'P8 > P1', flagColors: ['#b22234', '#ffffff', '#3c3b6e'] },
  // Audi
  { id: 'hulkenberg', number: 27, code: 'HUL', name: 'NICO HÜLKENBERG', teamId: 'audi', flag: '🇩🇪', country: 'Germany', gp: 'NURBURGRING GP • GERMAN GRIT', delta: 'P4 > P1', flagColors: ['#000000', '#dd0000', '#ffce00'] },
  { id: 'bortoleto', number: 5, code: 'BOR', name: 'GABRIEL BORTOLETO', teamId: 'audi', flag: '🇧🇷', country: 'Brazil', gp: 'INTERLAGOS GP • SAMBA SPEED', delta: 'P6 > P1', flagColors: ['#009c3b', '#ffdf00', '#002776'] },
  { id: 'zhou', number: 24, code: 'ZHO', name: 'ZHOU GUANYU', teamId: 'audi', flag: '🇨🇳', country: 'China', gp: 'SHANGHAI GP • NATIONAL PRIDE', delta: 'P7 > P1', flagColors: ['#de2910', '#ffde00', '#de2910'] },
  // Cadillac
  { id: 'perez', number: 11, code: 'PER', name: 'SERGIO PÉREZ', teamId: 'cadillac', flag: '🇲🇽', country: 'Mexico', gp: 'MEXICO GP • KING OF STREETS', delta: 'P1 > P1', flagColors: ['#006847', '#ffffff', '#ce1126'] },
  { id: 'bottas', number: 77, code: 'BOT', name: 'VALTTERI BOTTAS', teamId: 'cadillac', flag: '🇫🇮', country: 'Finland', gp: 'AUSTRIAN GP • FLYING FINN', delta: 'P1 > P1', flagColors: ['#ffffff', '#003580', '#ffffff'] },
];

function generate169PosterSvg(d) {
  const team = TEAM_THEMES[d.teamId] || TEAM_THEMES.ferrari;
  const fColor1 = d.flagColors[0] || '#dc2626';
  const fColor2 = d.flagColors[1] || '#ffffff';
  const fColor3 = d.flagColors[2] || d.flagColors[0];

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%">
  <defs>
    <!-- Background Vignette -->
    <radialGradient id="stageGlow" cx="50%" cy="40%" r="65%">
      <stop offset="0%" stop-color="${team.primary}" stop-opacity="0.45"/>
      <stop offset="45%" stop-color="#0a101d" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#030508"/>
    </radialGradient>

    <!-- Metallic 3D Typography Gradient -->
    <linearGradient id="metal3D" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="25%" stop-color="#e2e8f0"/>
      <stop offset="50%" stop-color="#94a3b8"/>
      <stop offset="52%" stop-color="#cbd5e1"/>
      <stop offset="85%" stop-color="#64748b"/>
      <stop offset="100%" stop-color="#334155"/>
    </linearGradient>

    <!-- Golden Trophy Gradient -->
    <linearGradient id="goldTrophy" x1="20%" y1="0%" x2="80%" y2="100%">
      <stop offset="0%" stop-color="#fffbeb"/>
      <stop offset="25%" stop-color="#fef08a"/>
      <stop offset="55%" stop-color="#eab308"/>
      <stop offset="85%" stop-color="#ca8a04"/>
      <stop offset="100%" stop-color="#78350f"/>
    </linearGradient>

    <!-- Visor Iridescent Glow -->
    <linearGradient id="visorReflection" x1="0%" y1="0%" x2="100%" y2="60%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="20%" stop-color="${team.secondary}"/>
      <stop offset="50%" stop-color="${team.primary}"/>
      <stop offset="80%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#090d16"/>
    </linearGradient>

    <!-- Flare & Spark Filter -->
    <filter id="bloom" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="12" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <filter id="shadow3D">
      <feDropShadow dx="0" dy="16" stdDeviation="14" flood-color="#000000" flood-opacity="0.95"/>
    </filter>

    <!-- National Flag Dynamic Wave Gradients -->
    <linearGradient id="flagWave" x1="0%" y1="0%" x2="100%" y2="30%">
      <stop offset="0%" stop-color="${fColor1}" stop-opacity="0.85"/>
      <stop offset="30%" stop-color="${fColor2}" stop-opacity="0.85"/>
      <stop offset="65%" stop-color="${fColor3}" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="${fColor1}" stop-opacity="0.75"/>
    </linearGradient>
  </defs>

  <!-- 1. Deep Stadium Night Sky & Asphalt Stage -->
  <rect width="1920" height="1080" fill="#04060a"/>
  <rect width="1920" height="1080" fill="url(#stageGlow)"/>

  <!-- 2. Circuit Grandstand Silhouette & Stadium Floodlights -->
  <g opacity="0.25">
    <polygon points="0,550 350,420 700,500 1200,430 1600,480 1920,400 1920,750 0,750" fill="#0b1120"/>
    <!-- Floodlight Beams -->
    <polygon points="180,220 0,650 400,650" fill="${team.primary}" opacity="0.15"/>
    <polygon points="1740,220 1500,650 1920,650" fill="${team.secondary}" opacity="0.15"/>
  </g>

  <!-- 3. Giant Billowing National Celebration Flag (Top Sky) -->
  <path d="M 120,60 C 500,140 850,20 1200,100 C 1500,160 1750,80 1920,130 L 1920,480 C 1600,420 1250,510 900,430 C 550,360 250,450 0,400 L 0,80 Z" 
        fill="url(#flagWave)" opacity="0.45" filter="url(#bloom)"/>
  <path d="M 0,220 C 450,290 850,180 1300,260 C 1650,310 1800,240 1920,270" 
        stroke="#ffffff" stroke-width="4" stroke-opacity="0.3" fill="none"/>

  <!-- Grandstand Stadium Flare Smoke -->
  <circle cx="280" cy="460" r="260" fill="${team.primary}" opacity="0.2" filter="url(#bloom)"/>
  <circle cx="1640" cy="460" r="260" fill="${team.secondary}" opacity="0.2" filter="url(#bloom)"/>

  <!-- 4. Left Flanking Action Helmet Cutout -->
  <g transform="translate(300, 320)" opacity="0.95" filter="url(#shadow3D)">
    <!-- Helmet Aura -->
    <ellipse cx="0" cy="0" rx="140" ry="160" fill="${team.primary}" opacity="0.25" filter="url(#bloom)"/>
    <!-- Shell -->
    <path d="M -90,70 C -110,20 -115,-40 -90,-100 C -70,-160 -10,-180 30,-180 C 80,-180 125,-140 135,-80 C 145,-15 135,45 110,80 C 80,115 10,125 -40,120 Z" 
          fill="#111827" stroke="${team.primary}" stroke-width="5"/>
    <!-- Helmet Visor -->
    <path d="M -80,-25 C -55,-60 10,-70 70,-65 C 115,-60 130,-30 125,5 C 120,25 90,45 50,48 C -20,52 -75,20 -80,-25 Z" 
          fill="url(#visorReflection)" stroke="#ffffff" stroke-width="2"/>
    <!-- Driver Number Stamp on Helmet -->
    <text x="-10" y="30" font-family="system-ui, sans-serif" font-weight="900" font-size="28" fill="${team.secondary}" font-style="italic">
      #${d.number}
    </text>
  </g>

  <!-- 5. Right Flanking Action Helmet Cutout -->
  <g transform="translate(1620, 320)" opacity="0.95" filter="url(#shadow3D)">
    <!-- Helmet Aura -->
    <ellipse cx="0" cy="0" rx="140" ry="160" fill="${team.secondary}" opacity="0.25" filter="url(#bloom)"/>
    <!-- Shell -->
    <path d="M 90,70 C 110,20 115,-40 90,-100 C 70,-160 10,-180 -30,-180 C -80,-180 -125,-140 -135,-80 C -145,-15 -135,45 -110,80 C -80,115 -10,125 40,120 Z" 
          fill="#111827" stroke="${team.secondary}" stroke-width="5"/>
    <!-- Helmet Visor -->
    <path d="M 80,-25 C 55,-60 -10,-70 -70,-65 C -115,-60 -130,-30 -125,5 C -120,25 -90,45 -50,48 C 20,52 75,20 80,-25 Z" 
          fill="url(#visorReflection)" stroke="#ffffff" stroke-width="2"/>
    <!-- Driver Number Stamp -->
    <text x="-40" y="30" font-family="system-ui, sans-serif" font-weight="900" font-size="28" fill="${team.primary}" font-style="italic">
      #${d.number}
    </text>
  </g>

  <!-- 6. Center Champion Driver Celebration & Golden F1 Trophy -->
  <g transform="translate(960, 380)" filter="url(#shadow3D)">
    <!-- Golden Backlight Halo -->
    <circle cx="0" cy="-60" r="220" fill="url(#goldTrophy)" opacity="0.2" filter="url(#bloom)"/>

    <!-- Hero Golden Trophy Hoisted High -->
    <g transform="translate(0, -180)">
      <!-- Trophy Cup Body -->
      <path d="M -50,-80 L 50,-80 L 40,0 C 35,45 15,65 0,75 C -15,65 -35,45 -40,0 Z" 
            fill="url(#goldTrophy)" stroke="#ffffff" stroke-width="3"/>
      <!-- Trophy Handles -->
      <path d="M -48,-60 C -85,-55 -85,10 -40,15" fill="none" stroke="url(#goldTrophy)" stroke-width="8" stroke-linecap="round"/>
      <path d="M 48,-60 C 85,-55 85,10 40,15" fill="none" stroke="url(#goldTrophy)" stroke-width="8" stroke-linecap="round"/>
      <!-- Trophy Base -->
      <rect x="-35" y="75" width="70" height="25" rx="5" fill="#1e293b" stroke="url(#goldTrophy)" stroke-width="2"/>
      <rect x="-45" y="100" width="90" height="15" rx="4" fill="#0f172a" stroke="#ca8a04" stroke-width="2"/>
      <!-- Winner Plate -->
      <text x="0" y="92" font-family="system-ui, sans-serif" font-weight="900" font-size="11" fill="#fef08a" text-anchor="middle" letter-spacing="2">
        FORMULA 1
      </text>
      <!-- Sparkle Highlights -->
      <polygon points="0,-85 4,-65 24,-65 8,-50 14,-30 0,-42 -14,-30 -8,-50 -24,-65 -4,-65" fill="#ffffff" opacity="0.9" filter="url(#bloom)"/>
    </g>

    <!-- Driver Podium Celebration Torso (Team Suit) -->
    <path d="M -160,280 C -150,150 -120,40 -60,0 L 60,0 C 120,40 150,150 160,280 Z" 
          fill="#111827" stroke="${team.primary}" stroke-width="5"/>
    <!-- Racing Suit Collar & Zipper Accent -->
    <path d="M -50,10 L 0,60 L 50,10" fill="none" stroke="${team.secondary}" stroke-width="4"/>
    <line x1="0" y1="60" x2="0" y2="280" stroke="#475569" stroke-width="4"/>
    <!-- Team Sponsor Badge Patch -->
    <rect x="-105" y="100" width="85" height="36" rx="6" fill="${team.primary}" opacity="0.85"/>
    <text x="-62" y="123" font-family="system-ui, sans-serif" font-weight="900" font-size="13" fill="#ffffff" text-anchor="middle">
      ${d.teamId.toUpperCase()}
    </text>
    <rect x="20" y="100" width="85" height="36" rx="6" fill="#1e293b" stroke="${team.secondary}" stroke-width="2"/>
    <text x="62" y="123" font-family="system-ui, sans-serif" font-weight="900" font-size="13" fill="${team.secondary}" text-anchor="middle">
      #${d.number}
    </text>

    <!-- Celebration Arms Hoisted to Trophy -->
    <path d="M -110,60 L -40,-80 L -10,-70 L -70,90 Z" fill="#1f2937" stroke="${team.primary}" stroke-width="3"/>
    <path d="M 110,60 L 40,-80 L 10,-70 L 70,90 Z" fill="#1f2937" stroke="${team.primary}" stroke-width="3"/>

    <!-- Champion Driver Head / Cap -->
    <ellipse cx="0" cy="-35" rx="42" ry="50" fill="#fcd34d" opacity="0.25" filter="url(#bloom)"/>
    <ellipse cx="0" cy="-35" rx="38" ry="45" fill="#f8fafc"/>
    <!-- Cap Peak & Team Cap -->
    <path d="M -45,-50 C -40,-80 40,-80 45,-50 C 40,-35 -40,-35 -45,-50 Z" fill="${team.primary}"/>
    <path d="M -55,-40 C -20,-30 20,-30 55,-40 L 50,-28 C 15,-18 -15,-18 -50,-28 Z" fill="#0f172a"/>
    <text x="0" y="-55" font-family="system-ui, sans-serif" font-weight="900" font-size="14" fill="#ffffff" text-anchor="middle">
      PIRELLI
    </text>
  </g>

  <!-- 7. Asphalt Track Ground & High-Speed F1 Car -->
  <g transform="translate(0, 560)">
    <!-- Asphalt Track Bed -->
    <rect y="160" width="1920" height="360" fill="#080c14"/>
    <!-- Speed Blur Streaks on Asphalt -->
    <line x1="0" y1="210" x2="1920" y2="210" stroke="#1e293b" stroke-width="3" stroke-dasharray="80 120"/>
    <line x1="0" y1="270" x2="1920" y2="270" stroke="${team.primary}" stroke-width="4" stroke-opacity="0.5" stroke-dasharray="140 100"/>
    <line x1="0" y1="340" x2="1920" y2="340" stroke="#0f172a" stroke-width="6"/>

    <!-- F1 Car Silhouette Speeding Across (Left to Center-Right) -->
    <g transform="translate(240, 60)" filter="url(#shadow3D)">
      <!-- Car Body Aerodynamic Profile -->
      <path d="M -80,130 
               L 40,110 
               C 100,105 160,85 220,80 
               L 360,70 
               C 420,70 480,95 530,120 
               L 590,130 
               C 560,150 490,155 420,155 
               L -50,155 Z" 
            fill="${team.carColor}" 
            stroke="#ffffff" 
            stroke-width="2"/>
      <!-- Halo Safety Arch -->
      <path d="M 280,68 C 300,35 340,35 360,68 Z" fill="#0f172a" stroke="#e2e8f0" stroke-width="3"/>
      <!-- Front Wing Assembly -->
      <path d="M 540,120 L 640,125 L 635,150 L 530,145 Z" fill="#020617" stroke="${team.secondary}" stroke-width="3"/>
      <!-- Rear Wing Winglets -->
      <rect x="-100" y="45" width="45" height="85" rx="5" fill="#020617" stroke="${team.primary}" stroke-width="3"/>
      <rect x="-105" y="45" width="55" height="15" rx="3" fill="${team.primary}"/>
      <!-- Front Wheel & Slick Tire -->
      <ellipse cx="480" cy="140" rx="42" ry="45" fill="#020617" stroke="#dc2626" stroke-width="5"/>
      <circle cx="480" cy="140" r="22" fill="#334155"/>
      <!-- Rear Wheel & Slick Tire -->
      <ellipse cx="-20" cy="140" rx="52" ry="55" fill="#020617" stroke="#dc2626" stroke-width="6"/>
      <circle cx="-20" cy="140" r="28" fill="#334155"/>

      <!-- Spectacular Underfloor Sparks (Ground Effect Skid Blocks) -->
      <g filter="url(#bloom)">
        <!-- Giant Spark Burst -->
        <circle cx="160" cy="155" r="16" fill="#fef08a" opacity="0.95"/>
        <line x1="160" y1="155" x2="-80" y2="185" stroke="#fbbf24" stroke-width="5"/>
        <line x1="170" y1="155" x2="-140" y2="140" stroke="#f59e0b" stroke-width="4"/>
        <line x1="150" y1="155" x2="-200" y2="210" stroke="#ef4444" stroke-width="6"/>
        <line x1="180" y1="155" x2="-60" y2="120" stroke="#ffffff" stroke-width="3"/>
        <circle cx="90" cy="165" r="7" fill="#ffffff"/>
        <circle cx="30" cy="175" r="6" fill="#fef08a"/>
        <circle cx="-50" cy="190" r="5" fill="#f59e0b"/>
        <circle cx="-110" cy="170" r="4" fill="#fb923c"/>
        <circle cx="-160" cy="180" r="4" fill="#ef4444"/>
      </g>
    </g>
  </g>

  <!-- 8. Deep Cinematic Shadow Scrim for Typography -->
  <rect y="640" width="1920" height="440" fill="url(#stageGlow)" opacity="0.9"/>
  <rect y="740" width="1920" height="340" fill="#04060a" opacity="0.85"/>

  <!-- 9. Giant 3D Metallic Celebration Typography -->
  <g transform="translate(960, 770)" filter="url(#shadow3D)">
    <!-- Driver Full Name Tracking Bar -->
    <text x="0" y="0" 
          font-family="system-ui, -apple-system, sans-serif" 
          font-weight="900" 
          font-size="44" 
          fill="#ffffff" 
          text-anchor="middle" 
          letter-spacing="16">
      ${d.name}
    </text>

    <!-- GIGANTIC 3D EXTRUDED "WINNER" -->
    <!-- 3D Shadow Extrusion Layers -->
    <text x="0" y="138" font-family="system-ui, -apple-system, sans-serif" font-weight="950" font-size="160" fill="#020617" text-anchor="middle" letter-spacing="14">
      WINNER
    </text>
    <text x="0" y="134" font-family="system-ui, -apple-system, sans-serif" font-weight="950" font-size="160" fill="#0f172a" text-anchor="middle" letter-spacing="14">
      WINNER
    </text>
    <text x="0" y="130" font-family="system-ui, -apple-system, sans-serif" font-weight="950" font-size="160" fill="#334155" text-anchor="middle" letter-spacing="14">
      WINNER
    </text>
    <!-- Foreground Metallic Face -->
    <text x="0" y="125" 
          font-family="system-ui, -apple-system, sans-serif" 
          font-weight="950" 
          font-size="160" 
          fill="url(#metal3D)" 
          stroke="#ffffff" 
          stroke-width="3" 
          text-anchor="middle" 
          letter-spacing="14">
      WINNER
    </text>

    <!-- Subtitle: Grand Prix & Home Race Tag with National Flag Badge -->
    <g transform="translate(0, 185)">
      <rect x="-340" y="-24" width="680" height="38" rx="8" fill="#0b0f17" stroke="#334155" stroke-width="1.5"/>
      <text x="0" y="2" 
            font-family="system-ui, -apple-system, sans-serif" 
            font-weight="800" 
            font-size="22" 
            fill="#e2e8f0" 
            text-anchor="middle" 
            letter-spacing="8">
        ${d.flag}  ${d.gp}  ${d.flag}
      </text>
    </g>

    <!-- Position Delta: P__ > P1 -->
    <g transform="translate(0, 240)">
      <text x="0" y="0" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="44" text-anchor="middle" letter-spacing="6">
        <tspan fill="#e2e8f0">${d.delta.split('>')[0].trim()}</tspan>
        <tspan fill="#38bdf8" font-size="34"> &gt; </tspan>
        <tspan fill="${team.secondary}" filter="url(#bloom)">P1</tspan>
      </text>
    </g>
  </g>

  <!-- 10. Official F1 Vector Logo (Bottom Center) -->
  <g transform="translate(960, 1045)" filter="url(#bloom)">
    <!-- Official F1 Angular Icon in Pure White -->
    <path d="M -45,-15 L -20,-15 L -35,12 L -55,12 Z" fill="#ffffff"/>
    <path d="M -12,-15 L 25,-15 C 38,-15 48,-6 45,5 C 42,12 32,12 25,12 L 8,12 L 2,-1 C 12,-1 18,-2 18,-6 C 18,-9 14,-9 8,-9 L -7,-9 Z" fill="#ffffff"/>
    <polygon points="12,-4 32,-4 22,12 2,12" fill="#ffffff"/>
  </g>
</svg>`;
}

let count = 0;
for (const driver of DRIVERS) {
  const svgContent = generate169PosterSvg(driver);
  const filePath = path.join(OUTPUT_DIR, `${driver.id}.svg`);
  fs.writeFileSync(filePath, svgContent, 'utf-8');
  count++;
}

console.log(`Generated ${count} 16:9 celebration poster SVGs in ${OUTPUT_DIR}`);
