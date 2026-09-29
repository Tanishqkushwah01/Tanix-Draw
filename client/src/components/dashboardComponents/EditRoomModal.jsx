import { useState } from "react";
import { XIcon } from "./dashboardIcons";

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
    <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function EditRoomModal({ room, colors, onClose, onSave }) {
  const [roomName, setRoomName] = useState(room.title);
  const [tag, setTag] = useState(room.tag);
  const [cardColor, setCardColor] = useState(room.cardColor);
  const [saving, setSaving] = useState(false);

  const tags = ["PRODUCT", "ENGINEERING", "THINKING", "DESIGN", "PLANNING", "MARKETING"];

  const handleSubmit = async () => {
    if (!roomName.trim()) return;
    setSaving(true);
    await onSave({ roomName, tag, cardColor });
    setSaving(false);
  };

  return (
    <div style={{ backgroundColor: cardColor }} className="w-full max-w-90 rounded-2xl p-5">
      <div className="flex justify-between items-center mb-5">
        <h2 className="font-[Georgia,serif] text-xl font-bold tracking-[-0.4px]">
          Edit board
        </h2>
        <button
          onClick={onClose}
          className="bg-transparent border-none cursor-pointer text-muted p-1 rounded-md transition-colors hover:bg-black/5"
        >
          <XIcon />
        </button>
      </div>

      <label className="block text-[11px] font-semibold text-muted mb-1.5 tracking-[0.06em]">
        BOARD NAME
      </label>
      <input
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        placeholder="e.g. Product Roadmap, System Design…"
        className="w-full px-3.5 py-2.5 text-sm border-2 border-fg rounded-lg bg-white font-inherit mb-4 outline-none transition-colors focus:border-accent"
      />

      <label className="block text-[11px] font-semibold text-muted mb-1.5 tracking-[0.06em]">
        TAG
      </label>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {tags.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTag(item)}
            className={`relative rounded-lg border-2 py-2 text-[11px] font-semibold tracking-[0.02em] transition-all cursor-pointer ${
              tag === item
                ? "border-accent bg-fg text-white shadow-[2px_2px_0_#1a1a1a] -translate-y-px"
                : "border-line bg-white text-fg hover:border-fg/40"
            }`}
          >
            {tag === item && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-accent border border-white flex items-center justify-center text-white">
                <CheckIcon />
              </span>
            )}
            {item}
          </button>
        ))}
      </div>

      <label className="block text-[11px] font-semibold text-muted mb-1.5 tracking-[0.06em]">
        CARD COLOR
      </label>
      <div className="flex gap-2 mb-5 flex-wrap">
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => setCardColor(color)}
            style={{ backgroundColor: color }}
            aria-label={color}
            className={`relative w-7 h-7 rounded-full border-2 cursor-pointer transition-transform ${
              cardColor === color
                ? "border-fg scale-110 shadow-[2px_2px_0_#1a1a1a]"
                : "border-white/60 hover:scale-105"
            }`}
          >
            {cardColor === color && (
              <span className="absolute inset-0 flex items-center justify-center text-fg">
                <CheckIcon />
              </span>
            )}
          </button>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={saving}
        className="w-full bg-fg text-white border-none rounded-lg py-3 text-sm font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all duration-200 hover:bg-[#333] hover:-translate-y-px disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save changes"}
      </button>
    </div>
  );
}