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
  ferrari: {
    primary: '#dc2626',
    secondary: '#ffe500',
    name: 'Ferrari',
    gradient: ['#dc2626', '#ffe500'],
  },
  mclaren: {
    primary: '#ff8000',
    secondary: '#00d2be',
    name: 'McLaren',
    gradient: ['#ff8000', '#38bdf8'],
  },
  redbull: {
    primary: '#1e40af',
    secondary: '#ef4444',
    name: 'Red Bull Racing',
    gradient: ['#1e40af', '#f59e0b'],
  },
  mercedes: {
    primary: '#00a19c',
    secondary: '#14b8a6',
    name: 'Mercedes-AMG',
    gradient: ['#0f766e', '#2dd4bf'],
  },
  astonmartin: {
    primary: '#00594f',
    secondary: '#cedc00',
    name: 'Aston Martin',
    gradient: ['#047857', '#a3e635'],
  },
  alpine: {
    primary: '#0090ff',
    secondary: '#ff87bc',
    name: 'Alpine',
    gradient: ['#0284c7', '#f472b6'],
  },
  racingbulls: {
    primary: '#4338ca',
    secondary: '#38bdf8',
    name: 'Racing Bulls',
    gradient: ['#4338ca', '#60a5fa'],
  },
  haas: {
    primary: '#b91c1c',
    secondary: '#e5e7eb',
    name: 'Haas F1 Team',
    gradient: ['#b91c1c', '#f87171'],
  },
  williams: {
    primary: '#0369a1',
    secondary: '#00e5ff',
    name: 'Williams Racing',
    gradient: ['#0369a1', '#38bdf8'],
  },
  audi: {
    primary: '#15803d',
    secondary: '#f50537',
    name: 'Audi F1 Team',
    gradient: ['#15803d', '#4ade80'],
  },
  cadillac: {
    primary: '#b45309',
    secondary: '#fbbf24',
    name: 'Cadillac F1 Team',
    gradient: ['#b45309', '#fde047'],
  },
};

const DRIVERS = [
  // Ferrari
  {
    id: 'leclerc',
    number: 16,
    code: 'LEC',
    name: 'Charles Leclerc',
    teamId: 'ferrari',
    flag: '🇲🇨',
    country: 'Monaco',
  },
  {
    id: 'hamilton',
    number: 44,
    code: 'HAM',
    name: 'Lewis Hamilton',
    teamId: 'ferrari',
    flag: '🇬🇧',
    country: 'United Kingdom',
  },
  // McLaren
  {
    id: 'norris',
    number: 4,
    code: 'NOR',
    name: 'Lando Norris',
    teamId: 'mclaren',
    flag: '🇬🇧',
    country: 'United Kingdom',
  },
  {
    id: 'piastri',
    number: 81,
    code: 'PIA',
    name: 'Oscar Piastri',
    teamId: 'mclaren',
    flag: '🇦🇺',
    country: 'Australia',
  },
  // Red Bull
  {
    id: 'verstappen',
    number: 1,
    code: 'VER',
    name: 'Max Verstappen',
    teamId: 'redbull',
    flag: '🇳🇱',
    country: 'Netherlands',
  },
  {
    id: 'hadjar',
    number: 6,
    code: 'HAD',
    name: 'Isack Hadjar',
    teamId: 'redbull',
    flag: '🇫🇷',
    country: 'France',
  },
  // Mercedes
  {
    id: 'russell',
    number: 63,
    code: 'RUS',
    name: 'George Russell',
    teamId: 'mercedes',
    flag: '🇬🇧',
    country: 'United Kingdom',
  },
  {
    id: 'antonelli',
    number: 12,
    code: 'ANT',
    name: 'Kimi Antonelli',
    teamId: 'mercedes',
    flag: '🇮🇹',
    country: 'Italy',
  },
  // Aston Martin
  {
    id: 'alonso',
    number: 14,
    code: 'ALO',
    name: 'Fernando Alonso',
    teamId: 'astonmartin',
    flag: '🇪🇸',
    country: 'Spain',
  },
  {
    id: 'stroll',
    number: 18,
    code: 'STR',
    name: 'Lance Stroll',
    teamId: 'astonmartin',
    flag: '🇨🇦',
    country: 'Canada',
  },
  // Alpine
  {
    id: 'gasly',
    number: 10,
    code: 'GAS',
    name: 'Pierre Gasly',
    teamId: 'alpine',
    flag: '🇫🇷',
    country: 'France',
  },
  {
    id: 'colapinto',
    number: 43,
    code: 'COL',
    name: 'Franco Colapinto',
    teamId: 'alpine',
    flag: '🇦🇷',
    country: 'Argentina',
  },
  {
    id: 'doohan',
    number: 61,
    code: 'DOO',
    name: 'Jack Doohan',
    teamId: 'alpine',
    flag: '🇦🇺',
    country: 'Australia',
  },
  // Racing Bulls
  {
    id: 'lawson',
    number: 30,
    code: 'LAW',
    name: 'Liam Lawson',
    teamId: 'racingbulls',
    flag: '🇳🇿',
    country: 'New Zealand',
  },
  {
    id: 'lindblad',
    number: 41,
    code: 'LIN',
    name: 'Arvid Lindblad',
    teamId: 'racingbulls',
    flag: '🇬🇧',
    country: 'United Kingdom',
  },
  {
    id: 'tsunoda',
    number: 22,
    code: 'TSU',
    name: 'Yuki Tsunoda',
    teamId: 'racingbulls',
    flag: '🇯🇵',
    country: 'Japan',
  },
  {
    id: 'ricciardo',
    number: 3,
    code: 'RIC',
    name: 'Daniel Ricciardo',
    teamId: 'racingbulls',
    flag: '🇦🇺',
    country: 'Australia',
  },
  // Haas
  {
    id: 'ocon',
    number: 31,
    code: 'OCO',
    name: 'Esteban Ocon',
    teamId: 'haas',
    flag: '🇫🇷',
    country: 'France',
  },
  {
    id: 'bearman',
    number: 87,
    code: 'BEA',
    name: 'Oliver Bearman',
    teamId: 'haas',
    flag: '🇬🇧',
    country: 'United Kingdom',
  },
  {
    id: 'magnussen',
    number: 20,
    code: 'MAG',
    name: 'Kevin Magnussen',
    teamId: 'haas',
    flag: '🇩🇰',
    country: 'Denmark',
  },
  // Williams
  {
    id: 'sainz',
    number: 55,
    code: 'SAI',
    name: 'Carlos Sainz',
    teamId: 'williams',
    flag: '🇪🇸',
    country: 'Spain',
  },
  {
    id: 'albon',
    number: 23,
    code: 'ALB',
    name: 'Alexander Albon',
    teamId: 'williams',
    flag: '🇹🇭',
    country: 'Thailand',
  },
  {
    id: 'sargeant',
    number: 2,
    code: 'SAR',
    name: 'Logan Sargeant',
    teamId: 'williams',
    flag: '🇺🇸',
    country: 'United States',
  },
  // Audi
  {
    id: 'hulkenberg',
    number: 27,
    code: 'HUL',
    name: 'Nico Hülkenberg',
    teamId: 'audi',
    flag: '🇩🇪',
    country: 'Germany',
  },
  {
    id: 'bortoleto',
    number: 5,
    code: 'BOR',
    name: 'Gabriel Bortoleto',
    teamId: 'audi',
    flag: '🇧🇷',
    country: 'Brazil',
  },
  {
    id: 'zhou',
    number: 24,
    code: 'ZHO',
    name: 'Zhou Guanyu',
    teamId: 'audi',
    flag: '🇨🇳',
    country: 'China',
  },
  // Cadillac
  {
    id: 'perez',
    number: 11,
    code: 'PER',
    name: 'Sergio Pérez',
    teamId: 'cadillac',
    flag: '🇲🇽',
    country: 'Mexico',
  },
  {
    id: 'bottas',
    number: 77,
    code: 'BOT',
    name: 'Valtteri Bottas',
    teamId: 'cadillac',
    flag: '🇫🇮',
    country: 'Finland',
  },
];

function generateDriverSvg(driver) {
  const theme = TEAM_THEMES[driver.teamId] || TEAM_THEMES.ferrari;
  const c1 = theme.gradient[0];
  const c2 = theme.gradient[1];

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 1280" width="100%" height="100%">
  <defs>
    <!-- Dark Background Gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#070a10"/>
      <stop offset="50%" stop-color="#0c1018"/>
      <stop offset="100%" stop-color="#040609"/>
    </linearGradient>

    <!-- Team Accent Radial Glow -->
    <radialGradient id="teamGlow" cx="50%" cy="38%" r="48%">
      <stop offset="0%" stop-color="${c1}" stop-opacity="0.45"/>
      <stop offset="60%" stop-color="${c2}" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#070a10" stop-opacity="0"/>
    </radialGradient>

    <!-- Helmet Visor Metallic Gradient -->
    <linearGradient id="visorGrad" x1="0%" y1="0%" x2="100%" y2="50%">
      <stop offset="0%" stop-color="#111827"/>
      <stop offset="25%" stop-color="${c1}"/>
      <stop offset="55%" stop-color="${c2}"/>
      <stop offset="85%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>

    <!-- Helmet Shell Gradient -->
    <linearGradient id="shellGrad" x1="20%" y1="0%" x2="80%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95"/>
      <stop offset="35%" stop-color="#e2e8f0"/>
      <stop offset="70%" stop-color="#94a3b8"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>

    <!-- Carbon Fiber Pattern -->
    <pattern id="carbon" width="12" height="12" patternUnits="userSpaceOnUse">
      <rect width="6" height="6" fill="#0b0f17"/>
      <rect x="6" width="6" height="6" fill="#080c13"/>
      <rect y="6" width="6" height="6" fill="#080c13"/>
      <rect x="6" y="6" width="6" height="6" fill="#05080e"/>
    </pattern>

    <!-- Glow Filter -->
    <filter id="neon" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="16" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- 1. Background Fill -->
  <rect width="720" height="1280" fill="url(#bgGrad)"/>
  <rect width="720" height="1280" fill="url(#carbon)" opacity="0.6"/>

  <!-- 2. Team Color Glow -->
  <circle cx="360" cy="460" r="380" fill="url(#teamGlow)"/>

  <!-- 3. Dynamic Speed Vortex Lines -->
  <g stroke="${c1}" stroke-width="1.5" opacity="0.25">
    <path d="M -50,200 L 770,380" stroke-dasharray="12 18"/>
    <path d="M -50,320 L 770,500" stroke-dasharray="8 14"/>
    <path d="M -50,440 L 770,620" stroke-dasharray="20 20"/>
    <path d="M -50,560 L 770,740" stroke-dasharray="6 12"/>
    <path d="M -50,680 L 770,860" stroke-dasharray="14 16"/>
  </g>

  <!-- 4. Massive Driver Number Watermark -->
  <text x="360" y="550" 
        font-family="system-ui, -apple-system, sans-serif" 
        font-weight="900" 
        font-size="340" 
        text-anchor="middle" 
        fill="${c1}" 
        fill-opacity="0.08" 
        stroke="${c2}" 
        stroke-width="2" 
        stroke-opacity="0.15" 
        letter-spacing="-10">
    #${driver.number}
  </text>

  <!-- 5. Vertical Side Label -->
  <g transform="translate(48, 620) rotate(-90)">
    <text font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="16" fill="${c1}" letter-spacing="8" opacity="0.8">
      FORMULA 1 PILOT · ${driver.code} · #${driver.number}
    </text>
  </g>

  <!-- 6. Racing Helmet Silhouette & Transformative Art Portrait -->
  <g id="helmet" transform="translate(360, 480)">
    <!-- Helmet Aura / Backlight -->
    <ellipse cx="0" cy="-20" rx="200" ry="210" fill="${c1}" opacity="0.2" filter="url(#neon)"/>

    <!-- Helmet Outer Shell (Aerodynamic Profile) -->
    <path d="M -150,110 
             C -165,60 -175,-30 -150,-110 
             C -125,-190 -60,-230 0,-230 
             C 70,-230 140,-185 165,-105 
             C 185,-25 175,65 155,115 
             C 140,150 90,175 40,180 
             L -50,180 
             C -105,175 -135,145 -150,110 Z" 
          fill="url(#shellGrad)" 
          stroke="${c1}" 
          stroke-width="4"/>

    <!-- Top Air Vent / Aero Duct -->
    <path d="M -40,-225 C -15,-240 15,-240 40,-225 L 25,-195 L -25,-195 Z" fill="#0f172a" stroke="${c2}" stroke-width="2"/>

    <!-- Helmet Visor Assembly -->
    <path d="M -135,-35 
             C -110,-75 -30,-95 45,-95 
             C 115,-95 150,-65 160,-25 
             C 165,15 150,45 125,55 
             C 65,80 -60,80 -125,50 
             C -142,35 -145,-5 -135,-35 Z" 
          fill="url(#visorGrad)" 
          stroke="#000000" 
          stroke-width="6"/>

    <!-- Visor Tint Reflection Highlight Strip -->
    <path d="M -115,-25 C -50,-55 30,-55 130,-15 L 120,5 C 30,-30 -40,-30 -110,-5 Z" 
          fill="#ffffff" 
          opacity="0.6"/>

    <!-- Aerodynamic Chin Bar & Vents -->
    <g fill="#0f172a" stroke="${c1}" stroke-width="1.5">
      <rect x="-35" y="105" width="70" height="8" rx="3"/>
      <rect x="-45" y="122" width="90" height="8" rx="3"/>
      <rect x="-30" y="139" width="60" height="8" rx="3"/>
    </g>

    <!-- Driver Car Number On Helmet Side -->
    <text x="-95" y="105" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="34" fill="${c1}" font-style="italic">
      #${driver.number}
    </text>

    <!-- Sponsor / Team Stripe Accent -->
    <path d="M -160,-20 C -60,0 60,0 160,-20 L 155,-5 C 60,15 -60,15 -155,-5 Z" fill="${c2}" opacity="0.9"/>
  </g>

  <!-- 7. Bottom Gradient Scrim for Readability -->
  <rect y="760" width="720" height="520" fill="url(#bgGrad)" opacity="0.95"/>
  <rect y="840" width="720" height="440" fill="#070a10"/>

  <!-- 8. Driver Identity Panel (Bottom) -->
  <g transform="translate(60, 940)">
    <!-- Flag & Country Header -->
    <text x="0" y="0" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="28" fill="#94a3b8" letter-spacing="3">
      ${driver.flag}  ${driver.country.toUpperCase()}  ·  #${driver.number}
    </text>

    <!-- Giant Driver Name -->
    <text x="0" y="65" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="52" fill="#ffffff" letter-spacing="-1">
      ${driver.name}
    </text>

    <!-- Team Badge Pill -->
    <rect x="0" y="100" width="380" height="44" rx="22" fill="${c1}" fill-opacity="0.15" stroke="${c1}" stroke-width="2"/>
    <circle cx="22" cy="122" r="8" fill="${c1}"/>
    <text x="42" y="128" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="18" fill="#ffffff" letter-spacing="1">
      ${theme.name.toUpperCase()}  ·  2026
    </text>

    <!-- Driver Code Badge (Right Corner) -->
    <text x="600" y="65" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="64" fill="${c1}" text-anchor="end" opacity="0.9">
      ${driver.code}
    </text>
  </g>

  <!-- 9. Top Header Brand Bar -->
  <g transform="translate(60, 80)">
    <text font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="16" fill="${c1}" letter-spacing="4">
      GROUND EFFECT HUB  ·  FAN TRIBUTE ARCHIVE
    </text>
    <line x1="0" y1="20" x2="600" y2="20" stroke="${c1}" stroke-width="2" opacity="0.5"/>
  </g>
</svg>`;
}

let count = 0;
for (const driver of DRIVERS) {
  const svgContent = generateDriverSvg(driver);
  const filePath = path.join(OUTPUT_DIR, `${driver.id}.svg`);
  fs.writeFileSync(filePath, svgContent, 'utf-8');
  count++;
}

console.log(`Generated ${count} transformative driver SVG portraits in ${OUTPUT_DIR}`);
