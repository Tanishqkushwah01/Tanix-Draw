

export const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const LinkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M6.5 9.5a3.536 3.536 0 005 0l2-2a3.536 3.536 0 00-5-5l-1 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M9.5 6.5a3.536 3.536 0 00-5 0l-2 2a3.536 3.536 0 005 5l1-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const UsersIcon = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
    <circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M1.5 13c0-2.485 2.015-4.5 4.5-4.5s4.5 2.015 4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="12" cy="5" r="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M14.5 13c0-1.93-1.12-3.6-2.75-4.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const ClockIcon = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 5v3.5l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <rect x="6" y="6" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M4 10H3a1 1 0 01-1-1V3a1 1 0 011-1h6a1 1 0 011 1v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

 
export const svgForTag = {
  PRODUCT: [
    <svg viewBox="0 0 180 120" xmlns="http://www.w3.org/2000/svg">
      <polygon points="62,60 42,80 62,100 82,80" fill="white" stroke="#1a1a1a" strokeWidth="2" />
      <line x1="82" y1="80" x2="130" y2="80" stroke="#1a1a1a" strokeWidth="2" markerEnd="url(#p0a)" />
      <rect x="130" y="66" width="34" height="28" rx="3" fill="white" stroke="#e8735a" strokeWidth="2" />
      <defs>
        <marker id="p0a" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="#1a1a1a" />
        </marker>
      </defs>
    </svg>,
    <svg viewBox="0 0 180 120" xmlns="http://www.w3.org/2000/svg">
      <rect x="16" y="34" width="70" height="10" rx="2" fill="#e8735a" opacity="0.85" />
      <rect x="16" y="56" width="112" height="10" rx="2" fill="#1a1a1a" opacity="0.15" />
      <rect x="16" y="78" width="46" height="10" rx="2" fill="#1a1a1a" opacity="0.15" />
      <circle cx="150" cy="39" r="6" fill="white" stroke="#e8735a" strokeWidth="2" />
      <circle cx="150" cy="61" r="6" fill="white" stroke="#1a1a1a" strokeWidth="2" />
      <circle cx="150" cy="83" r="6" fill="white" stroke="#1a1a1a" strokeWidth="2" />
    </svg>,
    <svg viewBox="0 0 180 120" xmlns="http://www.w3.org/2000/svg">
      <rect x="14" y="46" width="36" height="28" rx="3" fill="white" stroke="#1a1a1a" strokeWidth="2" />
      <line x1="50" y1="60" x2="72" y2="60" stroke="#1a1a1a" strokeWidth="2" markerEnd="url(#p2a)" />
      <polygon points="98,44 116,60 98,76 80,60" fill="white" stroke="#e8735a" strokeWidth="2" />
      <line x1="116" y1="60" x2="138" y2="60" stroke="#1a1a1a" strokeWidth="2" markerEnd="url(#p2b)" />
      <rect x="138" y="48" width="30" height="24" rx="3" fill="white" stroke="#1a1a1a" strokeWidth="2" />
      <defs>
        <marker id="p2a" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="#1a1a1a" />
        </marker>
        <marker id="p2b" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="#1a1a1a" />
        </marker>
      </defs>
    </svg>,
  ],

  ENGINEERING: [
    <svg viewBox="0 0 180 120" xmlns="http://www.w3.org/2000/svg">
      <rect x="12" y="42" width="44" height="32" rx="3" fill="white" stroke="#1a1a1a" strokeWidth="2" />
      <rect x="68" y="28" width="44" height="32" rx="3" fill="white" stroke="#1a1a1a" strokeWidth="2" />
      <rect x="124" y="54" width="44" height="32" rx="3" fill="white" stroke="#e8735a" strokeWidth="2" />
      <line x1="56" y1="58" x2="68" y2="44" stroke="#1a1a1a" strokeWidth="1.5" />
      <line x1="112" y1="44" x2="124" y2="63" stroke="#1a1a1a" strokeWidth="1.5" />
    </svg>,
    <svg viewBox="0 0 180 120" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="40" width="50" height="34" rx="3" fill="white" stroke="#1a1a1a" strokeWidth="2" />
      <path d="M70 50 H108 V80 H140" fill="none" stroke="#4a9be8" strokeWidth="2" markerEnd="url(#e1a)" />
      <rect x="140" y="64" width="26" height="26" rx="3" fill="white" stroke="#1a1a1a" strokeWidth="2" />
      <defs>
        <marker id="e1a" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="#4a9be8" />
        </marker>
      </defs>
    </svg>,
    <svg viewBox="0 0 180 120" xmlns="http://www.w3.org/2000/svg">
      <rect x="40" y="24" width="100" height="20" rx="3" fill="white" stroke="#1a1a1a" strokeWidth="2" />
      <rect x="40" y="50" width="100" height="20" rx="3" fill="white" stroke="#1a1a1a" strokeWidth="2" />
      <rect x="40" y="76" width="100" height="20" rx="3" fill="white" stroke="#e8735a" strokeWidth="2" />
      <circle cx="52" cy="34" r="2.5" fill="#1a1a1a" />
      <circle cx="52" cy="60" r="2.5" fill="#1a1a1a" />
      <circle cx="52" cy="86" r="2.5" fill="#e8735a" />
    </svg>,
  ],

  THINKING: [
    <svg viewBox="0 0 180 120" xmlns="http://www.w3.org/2000/svg">
      <circle cx="90" cy="60" r="20" fill="white" stroke="#1a1a1a" strokeWidth="2" />
      <line x1="110" y1="58" x2="145" y2="38" stroke="#1a1a1a" strokeWidth="1.5" />
      <circle cx="150" cy="35" r="12" fill="white" stroke="#e8735a" strokeWidth="1.5" />
      <line x1="113" y1="65" x2="148" y2="84" stroke="#1a1a1a" strokeWidth="1.5" />
      <circle cx="152" cy="88" r="10" fill="white" stroke="#1a1a1a" strokeWidth="1.5" />
      <line x1="70" y1="52" x2="38" y2="34" stroke="#1a1a1a" strokeWidth="1.5" />
      <circle cx="32" cy="30" r="10" fill="white" stroke="#1a1a1a" strokeWidth="1.5" />
    </svg>,
    <svg viewBox="0 0 180 120" xmlns="http://www.w3.org/2000/svg">
      <circle cx="90" cy="60" r="34" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeDasharray="5 4" />
      <circle cx="90" cy="60" r="14" fill="white" stroke="#e8735a" strokeWidth="2" />
    </svg>,
    <svg viewBox="0 0 180 120" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="42" r="16" fill="white" stroke="#1a1a1a" strokeWidth="2" />
      <circle cx="120" cy="42" r="16" fill="white" stroke="#1a1a1a" strokeWidth="2" />
      <circle cx="90" cy="88" r="16" fill="white" stroke="#e8735a" strokeWidth="2" />
      <line x1="74" y1="48" x2="106" y2="48" stroke="#1a1a1a" strokeWidth="1.5" />
      <line x1="68" y1="55" x2="82" y2="76" stroke="#1a1a1a" strokeWidth="1.5" />
      <line x1="112" y1="55" x2="98" y2="76" stroke="#1a1a1a" strokeWidth="1.5" />
    </svg>,
  ],

  DESIGN: [
    <svg viewBox="0 0 180 120" xmlns="http://www.w3.org/2000/svg">
      <rect x="30" y="24" width="120" height="72" rx="4" fill="white" stroke="#1a1a1a" strokeWidth="2" />
      <rect x="30" y="24" width="120" height="16" rx="4" fill="#8a6fdb" opacity="0.85" />
      <rect x="42" y="54" width="60" height="8" rx="2" fill="#1a1a1a" opacity="0.15" />
      <rect x="42" y="70" width="40" height="8" rx="2" fill="#1a1a1a" opacity="0.15" />
    </svg>,
    <svg viewBox="0 0 180 120" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="20" fill="#e8735a" opacity="0.85" />
      <circle cx="94" cy="60" r="20" fill="#5ba4e8" opacity="0.85" />
      <circle cx="128" cy="60" r="20" fill="#5bc97a" opacity="0.85" />
    </svg>,
    <svg viewBox="0 0 180 120" xmlns="http://www.w3.org/2000/svg">
      <path d="M46 22 H110 L128 40 V98 H46 Z" fill="white" stroke="#1a1a1a" strokeWidth="2" strokeLinejoin="round" />
      <path d="M110 22 V40 H128 Z" fill="white" stroke="#1a1a1a" strokeWidth="2" strokeLinejoin="round" />
      <line x1="60" y1="58" x2="112" y2="58" stroke="#8a6fdb" strokeWidth="2" />
      <line x1="60" y1="72" x2="96" y2="72" stroke="#8a6fdb" strokeWidth="2" />
    </svg>,
  ],

  PLANNING: [
    <svg viewBox="0 0 180 120" xmlns="http://www.w3.org/2000/svg">
      <rect x="36" y="24" width="108" height="72" rx="4" fill="white" stroke="#1a1a1a" strokeWidth="2" />
      <line x1="36" y1="46" x2="144" y2="46" stroke="#1a1a1a" strokeWidth="2" />
      <line x1="90" y1="46" x2="90" y2="96" stroke="#1a1a1a" strokeWidth="1.5" />
      <rect x="46" y="56" width="34" height="26" rx="2" fill="#e8c45b" opacity="0.7" />
      <rect x="100" y="56" width="34" height="26" rx="2" fill="white" stroke="#1a1a1a" strokeWidth="1.5" />
    </svg>,
    <svg viewBox="0 0 180 120" xmlns="http://www.w3.org/2000/svg">
      <rect x="40" y="30" width="14" height="14" rx="2" fill="white" stroke="#e8735a" strokeWidth="2" />
      <path d="M43 37 l3 3 5 -6" fill="none" stroke="#e8735a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="64" y1="37" x2="140" y2="37" stroke="#1a1a1a" strokeWidth="1.5" opacity="0.35" />
      <rect x="40" y="58" width="14" height="14" rx="2" fill="white" stroke="#1a1a1a" strokeWidth="2" />
      <line x1="64" y1="65" x2="140" y2="65" stroke="#1a1a1a" strokeWidth="1.5" opacity="0.35" />
      <rect x="40" y="86" width="14" height="14" rx="2" fill="white" stroke="#1a1a1a" strokeWidth="2" />
      <line x1="64" y1="93" x2="120" y2="93" stroke="#1a1a1a" strokeWidth="1.5" opacity="0.35" />
    </svg>,
    <svg viewBox="0 0 180 120" xmlns="http://www.w3.org/2000/svg">
      <line x1="24" y1="60" x2="156" y2="60" stroke="#1a1a1a" strokeWidth="2" />
      <circle cx="46" cy="60" r="8" fill="white" stroke="#1a1a1a" strokeWidth="2" />
      <circle cx="90" cy="60" r="8" fill="white" stroke="#e8735a" strokeWidth="2" />
      <circle cx="134" cy="60" r="8" fill="white" stroke="#1a1a1a" strokeWidth="2" />
    </svg>,
  ],

  MARKETING: [
    <svg viewBox="0 0 180 120" xmlns="http://www.w3.org/2000/svg">
      <rect x="40" y="66" width="18" height="28" fill="#1a1a1a" opacity="0.2" />
      <rect x="72" y="46" width="18" height="48" fill="#1a1a1a" opacity="0.35" />
      <rect x="104" y="26" width="18" height="68" fill="#e8735a" />
      <line x1="30" y1="94" x2="132" y2="94" stroke="#1a1a1a" strokeWidth="1.5" />
    </svg>,
    <svg viewBox="0 0 180 120" xmlns="http://www.w3.org/2000/svg">
      <circle cx="90" cy="60" r="34" fill="none" stroke="#1a1a1a" strokeWidth="2" />
      <circle cx="90" cy="60" r="22" fill="none" stroke="#1a1a1a" strokeWidth="2" />
      <circle cx="90" cy="60" r="10" fill="#e8735a" />
    </svg>,
    <svg viewBox="0 0 180 120" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 50 L92 30 V90 L32 70 Z" fill="white" stroke="#1a1a1a" strokeWidth="2" strokeLinejoin="round" />
      <path d="M92 30 L138 42 V78 L92 90" fill="none" stroke="#e8735a" strokeWidth="2" strokeLinejoin="round" />
      <path d="M108 50 Q118 60 108 70" fill="none" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
    </svg>,
  ],

  DEFAULT: [
    <svg viewBox="0 0 180 120" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="38" width="60" height="44" rx="4" fill="white" stroke="#1a1a1a" strokeWidth="2" />
      <path d="M80 60 Q120 40 140 60" fill="none" stroke="#e8735a" strokeWidth="2" markerEnd="url(#d0a)" />
      <circle cx="152" cy="60" r="22" fill="white" stroke="#1a1a1a" strokeWidth="2" />
      <defs>
        <marker id="d0a" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="#e8735a" />
        </marker>
      </defs>
    </svg>,
    <svg viewBox="0 0 180 120" xmlns="http://www.w3.org/2000/svg">
      <circle cx="46" cy="60" r="24" fill="white" stroke="#1a1a1a" strokeWidth="2" />
      <line x1="70" y1="60" x2="112" y2="60" stroke="#1a1a1a" strokeWidth="2" markerEnd="url(#d1a)" />
      <circle cx="136" cy="60" r="24" fill="white" stroke="#e8735a" strokeWidth="2" />
      <defs>
        <marker id="d1a" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="#1a1a1a" />
        </marker>
      </defs>
    </svg>,
    <svg viewBox="0 0 180 120" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="42" width="52" height="36" rx="4" fill="white" stroke="#1a1a1a" strokeWidth="2" />
      <line x1="72" y1="60" x2="106" y2="60" stroke="#1a1a1a" strokeWidth="2" markerEnd="url(#d2a)" />
      <polygon points="132,38 158,60 132,82 106,60" fill="white" stroke="#e8735a" strokeWidth="2" />
      <defs>
        <marker id="d2a" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="#1a1a1a" />
        </marker>
      </defs>
    </svg>,
  ],
};

 
const hashString = (str = "") => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

export const getRoomPreview = (tag, seed) => {
  const variants = svgForTag[tag] || svgForTag.DEFAULT;
  const index = hashString(String(seed)) % variants.length;
  return variants[index];
};