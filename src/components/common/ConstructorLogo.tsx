import React from 'react';
import { TeamId } from '../../types';

interface ConstructorLogoProps {
  teamId: TeamId;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  badgeMode?: boolean;
  lang?: 'vi' | 'en';
}

export const ConstructorLogo: React.FC<ConstructorLogoProps> = ({
  teamId,
  className = '',
  size = 'md',
  showText = false,
  badgeMode = false,
  lang = 'vi',
}) => {
  const sizeMap = {
    sm: 'w-6 h-6',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const dim = sizeMap[size] || sizeMap.md;

  const renderLogoSvg = () => {
    switch (teamId) {
      case 'mclaren':
        // McLaren Speedmark: Iconic curved aerodynamic swoosh in McLaren Papaya
        return (
          <svg viewBox="0 0 100 100" className={`${dim} shrink-0 drop-shadow-md`} fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="mclarenGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FF9B26" />
                <stop offset="100%" stopColor="#FF6600" />
              </linearGradient>
            </defs>
            {/* Speedmark curved boomerang */}
            <path
              d="M15 62C28 40 52 26 84 22C68 36 50 56 36 74C30 81 24 82 20 78C16 74 14 68 15 62Z"
              fill="url(#mclarenGrad)"
            />
            {/* Aerodynamic trailing edge */}
            <path
              d="M84 22C60 27 38 42 22 66C20 69 18 72 17 75C16 71 18 64 22 58C36 38 58 24 84 22Z"
              fill="#FFFFFF"
              opacity="0.35"
            />
          </svg>
        );

      case 'ferrari':
        // Scuderia Ferrari: Yellow Shield with Italian Flag and Prancing Horse
        return (
          <svg viewBox="0 0 100 120" className={`${dim} shrink-0 drop-shadow-md`} fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Shield Body (Giallo Modena) */}
            <path
              d="M10 12C10 12 50 8 90 12C90 48 84 94 50 114C16 94 10 48 10 12Z"
              fill="#FFF200"
              stroke="#111111"
              strokeWidth="2.5"
            />
            {/* Tricolore Flag Top Band (Green / White / Red) */}
            <path d="M10 12H36.6V20H11.5C11 17 10.5 14.5 10 12Z" fill="#009246" />
            <path d="M36.6 12H63.3V20H36.6V12Z" fill="#FFFFFF" />
            <path d="M63.3 12H90C89.5 14.5 89 17 88.5 20H63.3V12Z" fill="#CE2B37" />
            <line x1="10" y1="20" x2="90" y2="20" stroke="#111111" strokeWidth="1.5" />
            {/* Stylized Prancing Horse (Cavallino Rampante) */}
            <g fill="#111111">
              {/* Head & Mane */}
              <path d="M56 32C55 29 51 28 48 30C45 32 44 35 45 37C47 38 50 37 52 36C54 35 56 36 57 37C59 36 60 34 58 33C57 32 56 32 56 32Z" />
              {/* Body & Arched Back */}
              <path d="M49 37C47 41 45 46 47 52C48 55 52 58 53 62C54 66 52 71 50 75C48 78 47 82 48 85C49 87 52 87 53 84C55 81 57 76 56 71C56 67 58 63 60 59C62 55 61 50 58 46C56 42 54 39 49 37Z" />
              {/* Forelegs Reaching Up */}
              <path d="M51 44C47 43 43 40 40 37C38 35 36 36 38 38C41 42 45 47 48 48L51 44Z" />
              <path d="M53 49C49 49 44 47 41 45C39 44 38 46 40 48C43 51 47 54 51 53L53 49Z" />
              {/* Hind Legs & Tail */}
              <path d="M48 83C45 85 41 90 40 96C39 98 42 98 43 96C46 92 49 88 51 86L48 83Z" />
              <path d="M53 84C55 87 58 92 60 97C61 99 63 98 62 96C60 91 57 86 54 83L53 84Z" />
              <path d="M46 54C42 57 38 63 36 71C35 75 36 78 38 75C40 70 43 64 47 60L46 54Z" />
              {/* "S" and "F" letters */}
              <text x="24" y="105" fontFamily="sans-serif" fontSize="13" fontWeight="900" fill="#111111">S</text>
              <text x="66" y="105" fontFamily="sans-serif" fontSize="13" fontWeight="900" fill="#111111">F</text>
            </g>
          </svg>
        );

      case 'mercedes':
        // Mercedes-AMG: Iconic Three-Pointed Star within Circle
        return (
          <svg viewBox="0 0 100 100" className={`${dim} shrink-0 drop-shadow-md`} fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="mercChrome" x1="15" y1="15" x2="85" y2="85" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="45%" stopColor="#E2E8F0" />
                <stop offset="75%" stopColor="#94A3B8" />
                <stop offset="100%" stopColor="#CBD5E1" />
              </linearGradient>
            </defs>
            {/* Outer Ring */}
            <circle cx="50" cy="50" r="42" stroke="url(#mercChrome)" strokeWidth="6" />
            <circle cx="50" cy="50" r="39" stroke="#00A19C" strokeWidth="1.5" opacity="0.8" />
            {/* 3-Pointed Star Points */}
            {/* Top Ray */}
            <polygon points="50,14 47,48 50,50" fill="url(#mercChrome)" />
            <polygon points="50,14 53,48 50,50" fill="#64748B" />
            {/* Bottom Right Ray */}
            <polygon points="81,68 52,48 50,50" fill="url(#mercChrome)" />
            <polygon points="81,68 50,53 50,50" fill="#64748B" />
            {/* Bottom Left Ray */}
            <polygon points="19,68 50,53 50,50" fill="url(#mercChrome)" />
            <polygon points="19,68 48,48 50,50" fill="#64748B" />
          </svg>
        );

      case 'redbull':
        // Red Bull Racing: Dual Charging Bulls & Sun Disc
        return (
          <svg viewBox="0 0 110 90" className={`${dim} shrink-0 drop-shadow-md`} fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Sun Disc */}
            <circle cx="55" cy="45" r="28" fill="#FFD700" />
            <circle cx="55" cy="45" r="24" fill="#FFA500" opacity="0.6" />
            {/* Left Charging Bull */}
            <path
              d="M12 56C18 52 24 50 31 51C36 52 42 49 46 45C50 41 53 37 54 34C51 34 47 36 44 38C43 35 41 33 37 34C31 35 26 40 23 44C19 46 15 50 12 56Z"
              fill="#E10600"
            />
            <path
              d="M26 38C23 35 19 36 16 38C15 37 17 34 20 33C24 32 27 34 29 36L26 38Z"
              fill="#FFD700"
            />
            {/* Right Charging Bull */}
            <path
              d="M98 56C92 52 86 50 79 51C74 52 68 49 64 45C60 41 57 37 56 34C59 34 63 36 66 38C67 35 69 33 73 34C79 35 84 40 87 44C91 46 95 50 98 56Z"
              fill="#E10600"
            />
            <path
              d="M84 38C87 35 91 36 94 38C95 37 93 34 90 33C86 32 83 34 81 36L84 38Z"
              fill="#FFD700"
            />
          </svg>
        );

      case 'astonmartin':
        // Aston Martin: Iconic Spread Wings
        return (
          <svg viewBox="0 0 120 60" className={`${dim} shrink-0 drop-shadow-md`} fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Left Wings */}
            <path
              d="M10 26C24 23 42 27 54 34C44 37 28 36 14 30L10 26Z"
              fill="#00594F"
              stroke="#CEDC00"
              strokeWidth="1.2"
            />
            <path d="M16 28C28 26 42 29 52 35" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.6" />
            {/* Right Wings */}
            <path
              d="M110 26C96 23 78 27 66 34C76 37 92 36 106 30L110 26Z"
              fill="#00594F"
              stroke="#CEDC00"
              strokeWidth="1.2"
            />
            <path d="M104 28C92 26 78 29 68 35" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.6" />
            {/* Center Enamel Plaque */}
            <rect x="36" y="24" width="48" height="15" rx="3" fill="#00594F" stroke="#CEDC00" strokeWidth="1.5" />
            <text x="60" y="34.5" fontFamily="sans-serif" fontSize="6.5" fontWeight="900" fill="#FFFFFF" textAnchor="middle" letterSpacing="0.8">
              ASTON MARTIN
            </text>
          </svg>
        );

      case 'alpine':
        // Alpine: Stylized Chevron "A" Arrow
        return (
          <svg viewBox="0 0 100 100" className={`${dim} shrink-0 drop-shadow-md`} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M25 80L50 18L75 80H58L50 56L42 80H25Z"
              fill="#0090FF"
            />
            {/* Horizontal Arrow Slash */}
            <path d="M38 58H62L66 68H34L38 58Z" fill="#FF87BC" />
            {/* French Flag Accent Tip */}
            <path d="M47 18H53L51 26H49L47 18Z" fill="#FFFFFF" />
          </svg>
        );

      case 'racingbulls':
        // Visa Cash App RB: Charging Bull on Royal Blue Shield
        return (
          <svg viewBox="0 0 100 100" className={`${dim} shrink-0 drop-shadow-md`} fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="10" width="80" height="80" rx="18" fill="#1634CB" stroke="#FFFFFF" strokeWidth="2.5" />
            {/* Charging Bull Silhouette */}
            <path
              d="M26 62C32 55 40 52 48 54C54 55 60 52 64 47C69 42 73 36 74 32C71 33 67 36 63 38C61 35 59 32 54 34C47 36 41 42 38 47C33 50 28 55 26 62Z"
              fill="#FFFFFF"
            />
            <text x="50" y="78" fontFamily="sans-serif" fontSize="12" fontWeight="900" fill="#FFFFFF" textAnchor="middle">
              VCARB
            </text>
          </svg>
        );

      case 'haas':
        // Haas F1 Team: Red Outer Gear Ring & White "H"
        return (
          <svg viewBox="0 0 100 100" className={`${dim} shrink-0 drop-shadow-md`} fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="42" fill="#E6002B" />
            <circle cx="50" cy="50" r="33" fill="#18181B" />
            {/* Bold Italic H */}
            <path
              d="M36 28H44V44H56V28H64V72H56V54H44V72H36V28Z"
              fill="#FFFFFF"
            />
          </svg>
        );

      case 'williams':
        // Williams Racing: Split Chevron "W"
        return (
          <svg viewBox="0 0 100 100" className={`${dim} shrink-0 drop-shadow-md`} fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="42" fill="#002447" stroke="#00A3E0" strokeWidth="2.5" />
            {/* Double V Chevron forming W */}
            <path
              d="M22 34L36 68L48 42L40 34H32L36 44L28 34H22Z"
              fill="#00A3E0"
            />
            <path
              d="M78 34L64 68L52 42L60 34H68L64 44L72 34H78Z"
              fill="#FFFFFF"
            />
          </svg>
        );

      case 'audi':
        // Audi F1 Team: Four Interlocking Rings
        return (
          <svg viewBox="0 0 120 60" className={`${dim} shrink-0 drop-shadow-md`} fill="none" xmlns="http://www.w3.org/2000/svg">
            <g stroke="#C4C8CC" strokeWidth="3.5" fill="none">
              <circle cx="28" cy="30" r="16" />
              <circle cx="49" cy="30" r="16" />
              <circle cx="70" cy="30" r="16" />
              <circle cx="91" cy="30" r="16" />
            </g>
            <circle cx="91" cy="30" r="16" stroke="#FF1801" strokeWidth="1.5" fill="none" opacity="0.7" />
          </svg>
        );

      case 'cadillac':
        // Cadillac: Geometric Crest
        return (
          <svg viewBox="0 0 100 90" className={`${dim} shrink-0 drop-shadow-md`} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M15 28C35 22 65 22 85 28C80 56 60 76 50 82C40 76 20 56 15 28Z"
              fill="#18181B"
              stroke="#D4AF37"
              strokeWidth="2.5"
            />
            {/* Geometric Crown and Chevrons */}
            <path d="M26 36H48V46H26V36Z" fill="#D4AF37" />
            <path d="M52 36H74V46H52V36Z" fill="#C41E3A" />
            <path d="M36 50H64V58H36V50Z" fill="#D4AF37" />
            <circle cx="50" cy="66" r="4" fill="#FFFFFF" />
          </svg>
        );

      default:
        return null;
    }
  };

  const getTeamLabel = () => {
    switch (teamId) {
      case 'mclaren':
        return 'McLAREN RACING';
      case 'ferrari':
        return 'SCUDERIA FERRARI';
      case 'mercedes':
        return 'MERCEDES-AMG F1';
      case 'redbull':
        return 'RED BULL RACING';
      case 'astonmartin':
        return 'ASTON MARTIN F1';
      case 'alpine':
        return 'BWT ALPINE F1';
      case 'racingbulls':
        return 'VISA CASH APP RB';
      case 'haas':
        return 'HAAS F1 TEAM';
      case 'williams':
        return 'WILLIAMS RACING';
      case 'audi':
        return 'AUDI F1 TEAM';
      case 'cadillac':
        return 'CADILLAC F1 TEAM';
      default:
        return 'FORMULA 1';
    }
  };

  // Badge Mode: Renders a sleek floating badge container with official branding
  if (badgeMode) {
    return (
      <div
        className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/20 shadow-xl transition-all ${className}`}
      >
        {renderLogoSvg()}
        <div className="flex flex-col text-left">
          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-black flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {lang === 'vi' ? 'PHỤ TÙNG CHÍNH HÃNG' : 'OFFICIAL COMPONENT'}
          </span>
          <span className="text-xs font-display font-black tracking-wider text-white uppercase leading-tight">
            {getTeamLabel()}
          </span>
        </div>
      </div>
    );
  }

  // Standard inline logo with optional text
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {renderLogoSvg()}
      {showText && (
        <span className="font-display text-xs sm:text-sm font-black tracking-wide text-white uppercase">
          {getTeamLabel()}
        </span>
      )}
    </div>
  );
};
