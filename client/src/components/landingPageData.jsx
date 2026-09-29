// Reusable class strings (Tailwind v4 utilities)
export const eyebrow = "mb-3 text-[15px] text-accent italic";
export const sectionTitle =
  "mb-12 font-serif text-[clamp(28px,3.5vw,48px)] leading-[1.15] font-bold tracking-[-1px]";
export const highlight =
  "bg-[linear-gradient(180deg,transparent_60%,var(--color-accent-light)_60%)] px-1";
export const cursorLabel =
  "rounded px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap text-white";
export const hoverLift =
  "transition duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0_var(--color-fg)]";
export const wrap = "mx-auto max-w-[1280px] px-6 py-16 md:px-20 md:py-25";

 

export const features = [
  { icon: "▤", bg: "#d4e8d4", title: "Infinite space", desc: "Pan, zoom, and use the minimap to jump around. Your ideas don't fit in a rectangle." },
  { icon: "✎", bg: "#f5c4be", title: "Complete toolkit", desc: "Rectangles, circles, diamonds, arrows, lines, freehand pencil and text, plus an eraser and resize handles." },
  { icon: "⚇", bg: "#b8d4e8", title: "Live cursors", desc: "See your teammates' cursors and every change they make, the moment they make it." },
  { icon: "▦", bg: "#f5e6b8", title: "Private rooms", desc: "Create a room, invite people with a join code, and manage all your boards from one dashboard." },
  { icon: "⊙", bg: "#d4c4e8", title: "Saved automatically", desc: "Your boards are stored in your account, so you can pick up where you left off on any device." },
  { icon: "✓", bg: "#ddd8cc", title: "Secure sign-in", desc: "Email OTP verification and password reset keep your account and your boards safe." },
];

// export const steps = [
//   { num: "01", title: "Open it up", desc: "No signup, no install. Just one click and you're sketching." },
//   { num: "02", title: "Draw, type, drag", desc: "Shapes, arrows, sticky notes, freehand. Combine them however you like." },
//   { num: "03", title: "Share & collaborate", desc: "Send a code. Multiple cursors, live updates, instant feedback." },
//   { num: "04", title: "Export & embed", desc: "Save as PNG/SVG or drop the live board into your docs." },
// ];

export const steps = [
  { num: "01", title: "Create your account", desc: "Sign up with your email and verify it with a one-time code. It takes under a minute." },
  { num: "02", title: "Start a room", desc: "Open your dashboard, name your board and create a room. A fresh canvas is ready right away." },
  { num: "03", title: "Invite your team", desc: "Share the join code. Anyone with it can hop in and draw on the same board." },
  { num: "04", title: "Pick up anytime", desc: "Close the tab whenever you like. Your board is waiting in your dashboard next time." },
];

export const marker = (id) => (
  <defs>
    <marker id={id} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
      <path d="M0,0 L0,6 L6,3 z" fill="#1a1a1a" />
    </marker>
  </defs>
);

export const useCases = [
  {
    label: "System diagrams", tag: "ENGINEERING", bg: "#c8dce8",
    svg: (
      <svg viewBox="0 0 180 120">
        <rect x="20" y="42" width="58" height="36" rx="3" fill="white" stroke="#1a1a1a" strokeWidth="2" />
        <rect x="102" y="42" width="58" height="36" rx="3" fill="white" stroke="#1a1a1a" strokeWidth="2" />
        <line x1="78" y1="60" x2="102" y2="60" stroke="#1a1a1a" strokeWidth="2" markerEnd="url(#ua)" />
        {marker("ua")}
      </svg>
    ),
  },
  {
    label: "User flows", tag: "PRODUCT", bg: "#f5c4be",
    svg: (
      <svg viewBox="0 0 180 120">
        <polygon points="62,60 42,80 62,100 82,80" fill="white" stroke="#1a1a1a" strokeWidth="2" />
        <line x1="82" y1="80" x2="130" y2="80" stroke="#1a1a1a" strokeWidth="2" markerEnd="url(#ub)" />
        {marker("ub")}
      </svg>
    ),
  },
  {
    label: "Mind maps", tag: "THINKING", bg: "#c8e8c8",
    svg: (
      <svg viewBox="0 0 180 120">
        <circle cx="90" cy="60" r="22" fill="white" stroke="#1a1a1a" strokeWidth="2" />
        <line x1="112" y1="58" x2="148" y2="40" stroke="#1a1a1a" strokeWidth="2" />
        <line x1="113" y1="65" x2="149" y2="82" stroke="#1a1a1a" strokeWidth="2" />
        <line x1="68" y1="52" x2="38" y2="36" stroke="#1a1a1a" strokeWidth="2" />
      </svg>
    ),
  },
];

export function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid size-8.5 place-items-center rounded-[10px] bg-accent text-base font-bold text-white">
        T
      </span>
      <span className="text-lg font-semibold tracking-[-0.3px]">Tanix Draw</span>
    </div>
  );
}