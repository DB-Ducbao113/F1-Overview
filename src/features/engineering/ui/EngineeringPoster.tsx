/** Readable engineering schematic used only while the R4.5 binary model is unavailable. */
export function EngineeringPoster({ unavailable }: { unavailable: boolean }) {
  return (
    <div className="itm-v2__poster" role="status" aria-live="polite">
      <svg viewBox="0 0 900 470" role="img" aria-label="Stylized Formula car top-view engineering schematic">
        <defs>
          <pattern id="itm-grid" width="38" height="38" patternUnits="userSpaceOnUse">
            <path d="M38 0H0V38" fill="none" stroke="#6a8da5" strokeOpacity=".18" />
          </pattern>
          <linearGradient id="itm-metal" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#182536" />
            <stop offset=".5" stopColor="#374b5e" />
            <stop offset="1" stopColor="#0b111b" />
          </linearGradient>
        </defs>
        <rect width="900" height="470" fill="url(#itm-grid)" />
        <g fill="none" stroke="#93b8cc" strokeOpacity=".22" strokeWidth="1">
          <path d="M40 235H860M450 25V445" strokeDasharray="6 10" />
          <circle cx="450" cy="235" r="205" strokeDasharray="3 15" />
          <circle cx="450" cy="235" r="160" />
        </g>
        {/* simplified reference silhouette — not a physical CAD claim */}
        <g transform="translate(450 235) rotate(-90)" strokeLinejoin="round">
          <g fill="#121b29" stroke="#b9cad4" strokeWidth="2.5">
            <rect x="-156" y="-170" width="88" height="62" rx="13" />
            <rect x="72" y="-170" width="88" height="62" rx="13" />
            <rect x="-156" y="108" width="88" height="62" rx="13" />
            <rect x="72" y="108" width="88" height="62" rx="13" />
          </g>
          <path d="M-238 -52H-175L-140 -35L-45 -29L7 -43H100L179 -23L226 -16V16L179 23L100 43H7L-45 29L-140 35L-175 52H-238Z" fill="url(#itm-metal)" stroke="#d1e4ef" strokeWidth="2.5"/>
          <path d="M-230 -98V98M-204 -111V111M194 -94V94M229 -94V94" stroke="#ff5937" strokeWidth="5" />
          <path d="M-160 -34H-104L-73 -48H50L97 -38M-160 34H-104L-73 48H50L97 38" fill="none" stroke="#d4e4ec" strokeWidth="1.8" />
          <path d="M-25 -23L43 -13L60 0L43 13L-25 23Z" fill="#101720" stroke="#ff6b48" strokeWidth="2" />
          <path d="M-20 -10H25M-20 10H25" stroke="#b6cad4" strokeWidth="1" />
          <path d="M-40 -34V34M120 -30V30" stroke="#ff5937" strokeWidth="3" />
          <path d="M-110 -36L-143 -83M-110 36L-143 83M125 -34L135 -88M125 34L135 88" stroke="#9cb9c8" strokeWidth="2" />
        </g>
        <g fill="none" stroke="#ff6b48" strokeWidth="1.5">
          <path d="M255 154L184 97H88" />
          <circle cx="255" cy="154" r="4" fill="#ff6b48" />
          <path d="M620 310L690 373H822" />
          <circle cx="620" cy="310" r="4" fill="#ff6b48" />
        </g>
        <g fill="#cbdce7" fontFamily="ui-monospace,monospace" fontSize="12" letterSpacing="2">
          <text x="83" y="89">01 / FRONT ASSEMBLY</text>
          <text x="692" y="365">02 / REAR SYSTEM</text>
          <text x="38" y="440" fill="#8295a6">SCHEMATIC REFERENCE / NOT TO SCALE</text>
        </g>
      </svg>
      <div className="itm-v2__poster-status">
        <span className="itm-v2__poster-dot" />
        <strong>{unavailable ? '3D SOURCE NOT INSTALLED' : 'LOADING 3D SOURCE'}</strong>
        {unavailable && <span>R4.5 GLB required — 3D inspection temporarily unavailable</span>}
      </div>
    </div>
  );
}
