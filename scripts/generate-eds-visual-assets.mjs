import fs from 'node:fs/promises';
import path from 'node:path';

const vehicleStudies = [
  'ferrari',
  'mclaren',
  'redbull',
  'mercedes',
  'astonmartin',
  'alpine',
  'racingbulls',
  'haas',
  'williams',
  'audi',
  'cadillac',
];

const driverProfiles = [
  ['leclerc', 16],
  ['hamilton', 44],
  ['norris', 4],
  ['piastri', 81],
  ['verstappen', 1],
  ['hadjar', 6],
  ['russell', 63],
  ['antonelli', 12],
  ['alonso', 14],
  ['stroll', 18],
  ['gasly', 10],
  ['colapinto', 43],
  ['lawson', 30],
  ['lindblad', 41],
  ['ocon', 31],
  ['bearman', 87],
  ['sainz', 55],
  ['albon', 23],
  ['hulkenberg', 27],
  ['bortoleto', 5],
  ['perez', 11],
  ['bottas', 77],
  ['tsunoda', 22],
  ['ricciardo', 3],
  ['magnussen', 20],
  ['zhou', 24],
  ['sargeant', 2],
  ['doohan', 61],
];

const palettes = [
  ['#ff3b30', '#f5f7fa'],
  ['#00d4ff', '#dff9ff'],
  ['#f5b642', '#fff0bd'],
  ['#a87cff', '#f0e8ff'],
  ['#35d07f', '#dfffee'],
  ['#ff6d9e', '#ffe3ed'],
];

const outputRoot = path.resolve('public/images/eds');
const vehicleRoot = path.join(outputRoot, 'vehicle-studies');
const driverRoot = path.join(outputRoot, 'driver-profiles');

const vehicleSvg = (id, index) => {
  const [accent, highlight] = palettes[index % palettes.length];
  const code = String(index + 1).padStart(2, '0');
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" role="img" aria-labelledby="title desc">
  <title id="title">Podium EDS-G01 vehicle field study ${code}</title>
  <desc id="desc">Original brand-neutral engineering illustration generated from Podium EDS design language.</desc>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#07090d"/><stop offset="1" stop-color="#151a22"/></linearGradient>
    <linearGradient id="body" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#151a21"/><stop offset=".45" stop-color="${accent}"/><stop offset="1" stop-color="#252c36"/></linearGradient>
    <radialGradient id="glow"><stop stop-color="${accent}" stop-opacity=".35"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/></radialGradient>
    <filter id="shadow" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="22"/></filter>
    <pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse"><path d="M64 0H0V64" fill="none" stroke="#ffffff" stroke-opacity=".045"/></pattern>
  </defs>
  <rect width="1600" height="900" fill="url(#bg)"/>
  <rect width="1600" height="900" fill="url(#grid)"/>
  <ellipse cx="820" cy="530" rx="650" ry="310" fill="url(#glow)"/>
  <path d="M130 650H1470" stroke="#ffffff" stroke-opacity=".16"/>
  <ellipse cx="805" cy="677" rx="595" ry="48" fill="#000" opacity=".62" filter="url(#shadow)"/>
  <g transform="translate(0 24)">
    <g fill="#090b0f" stroke="#434b57" stroke-width="12">
      <circle cx="438" cy="588" r="137"/><circle cx="1178" cy="588" r="137"/>
    </g>
    <g fill="none" stroke="${highlight}" stroke-opacity=".72" stroke-width="7">
      <circle cx="438" cy="588" r="88"/><circle cx="1178" cy="588" r="88"/>
    </g>
    <g fill="#11161d" stroke="#707987" stroke-width="5">
      <circle cx="438" cy="588" r="43"/><circle cx="1178" cy="588" r="43"/>
    </g>
    <path d="M166 543L312 523 358 548 347 579 152 581Z" fill="#141920" stroke="${accent}" stroke-width="8"/>
    <path d="M1250 485L1398 474 1437 502 1422 530 1244 534Z" fill="#141920" stroke="${accent}" stroke-width="8"/>
    <path d="M310 551C421 510 551 490 656 472L748 392 905 395 1007 475 1238 520 1267 578 1120 601 1008 570 592 572 493 607 329 593Z" fill="url(#body)" stroke="#9da6b4" stroke-opacity=".45" stroke-width="4"/>
    <path d="M670 470L744 389 902 392 961 465 862 475 799 433 731 476Z" fill="#0a0d12" stroke="${highlight}" stroke-opacity=".55" stroke-width="4"/>
    <path d="M742 395C765 326 849 317 884 392" fill="none" stroke="${accent}" stroke-width="18" stroke-linecap="round"/>
    <path d="M496 575L641 512 1007 508 1127 591 991 622 602 618Z" fill="#080b10" stroke="#58616e" stroke-width="4"/>
    <path d="M586 580L1019 580" stroke="${accent}" stroke-width="9"/>
    <path d="M700 491L601 424 451 399" fill="none" stroke="#9aa4b1" stroke-width="11" stroke-linecap="round"/>
    <path d="M930 487L1070 425 1185 405" fill="none" stroke="#9aa4b1" stroke-width="11" stroke-linecap="round"/>
    <path d="M152 581H346M1250 533H1437" stroke="${highlight}" stroke-width="5" opacity=".7"/>
  </g>
  <g font-family="Arial, Helvetica, sans-serif" fill="#fff">
    <text x="100" y="112" font-size="28" font-weight="700" letter-spacing="9">PODIUM EDS / ORIGINAL VISUAL SYSTEM</text>
    <text x="100" y="178" font-size="64" font-weight="800" letter-spacing="3">EDS-G01</text>
    <text x="100" y="218" fill="${highlight}" font-size="20" font-weight="700" letter-spacing="6">VEHICLE FIELD STUDY ${code}</text>
    <text x="1460" y="118" text-anchor="end" font-size="24" font-weight="700">${id.toUpperCase()}</text>
    <text x="1460" y="152" text-anchor="end" fill="#8c96a5" font-size="17" letter-spacing="3">INDEPENDENT EDITORIAL CONFIGURATION</text>
    <text x="100" y="814" fill="#9aa4b1" font-size="17" letter-spacing="3">ORIGINAL CHASSIS • NO CONSTRUCTOR MARKS • NOT AN OFFICIAL TEAM RENDER</text>
  </g>
</svg>
`;
};

const driverSvg = (id, number, index) => {
  const [accent, highlight] = palettes[index % palettes.length];
  const code = id.slice(0, 3).toUpperCase();
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" role="img" aria-labelledby="title desc">
  <title id="title">Podium EDS independent driver data profile ${code}</title>
  <desc id="desc">Original abstract helmet graphic; it is not a portrait or endorsement image.</desc>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#080a0e"/><stop offset="1" stop-color="#1a2029"/></linearGradient>
    <linearGradient id="shell" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${highlight}"/><stop offset=".52" stop-color="${accent}"/><stop offset="1" stop-color="#171c24"/></linearGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M48 0H0V48" fill="none" stroke="#fff" stroke-opacity=".05"/></pattern>
  </defs>
  <rect width="1200" height="675" fill="url(#bg)"/>
  <rect width="1200" height="675" fill="url(#grid)"/>
  <path d="M0 570L1200 390V675H0Z" fill="${accent}" opacity=".12"/>
  <g transform="translate(130 120)">
    <path d="M88 326C61 288 48 239 52 186 60 77 139 10 244 20 345 30 410 104 404 211 400 283 363 340 304 374L127 374Z" fill="url(#shell)" stroke="#fff" stroke-opacity=".45" stroke-width="5"/>
    <path d="M107 174C154 126 241 105 346 134L386 178C299 204 207 211 111 199Z" fill="#05070a" stroke="${highlight}" stroke-opacity=".7" stroke-width="5"/>
    <path d="M128 374L304 374 364 448 70 448Z" fill="#0a0d12" stroke="#596371" stroke-width="5"/>
    <path d="M91 294C162 334 269 338 363 287" fill="none" stroke="${highlight}" stroke-width="8" opacity=".75"/>
    <circle cx="342" cy="249" r="13" fill="${accent}"/>
  </g>
  <g font-family="Arial, Helvetica, sans-serif" fill="#fff">
    <text x="610" y="118" font-size="22" font-weight="700" letter-spacing="7">PODIUM EDS / DRIVER DATA PROFILE</text>
    <text x="610" y="265" font-size="172" font-weight="800" letter-spacing="-8">${String(number).padStart(2, '0')}</text>
    <text x="620" y="328" fill="${highlight}" font-size="45" font-weight="800" letter-spacing="12">${code}</text>
    <text x="620" y="394" fill="#9ba5b4" font-size="18" letter-spacing="4">ABSTRACT EDITORIAL IDENTIFIER</text>
    <text x="620" y="430" fill="#9ba5b4" font-size="18" letter-spacing="4">NO LIKENESS • NO SPONSOR MARKS</text>
    <text x="80" y="620" font-size="16" fill="#9ba5b4" letter-spacing="3">INDEPENDENT MOTORSPORT ENGINEERING ARCHIVE</text>
  </g>
</svg>
`;
};

await fs.mkdir(vehicleRoot, { recursive: true });
await fs.mkdir(driverRoot, { recursive: true });

await Promise.all([
  ...vehicleStudies.map((id, index) =>
    fs.writeFile(path.join(vehicleRoot, `${id}.svg`), vehicleSvg(id, index), 'utf8'),
  ),
  ...driverProfiles.map(([id, number], index) =>
    fs.writeFile(path.join(driverRoot, `${id}.svg`), driverSvg(id, number, index), 'utf8'),
  ),
]);

console.log(
  `Generated ${vehicleStudies.length} EDS-G01 vehicle studies and ${driverProfiles.length} abstract driver profiles.`,
);
