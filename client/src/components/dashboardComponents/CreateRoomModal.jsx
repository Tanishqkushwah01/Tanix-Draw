import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { XIcon } from "./dashboardIcons";

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
    <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function CreateRoomModal({
  onClose,
  cardColor,
  setRoomCreated,
  setCardColor,
  colors,
  onCreate,
  roomCreated,
  roomData,
  error,
  isCreating,
}) {
  const [roomName, setRoomName] = useState("Untitled board");
  const [canvasTheme, setCanvasTheme] = useState("paper");
  const [showGrid, setShowGrid] = useState(true);
  const [tag, setTag] = useState("PRODUCT");
  const [localError, setLocalError] = useState("");

  const navigate = useNavigate();

  const MAX_NAME_LENGTH = 22;
  const tags = ["PRODUCT", "ENGINEERING", "THINKING", "DESIGN", "PLANNING", "MARKETING"];

  const handleSubmit = () => {
    const trimmedName = roomName.trim();

    if (!trimmedName) {
      setLocalError("Board name is required");
      return;
    }

    if (roomName.length > MAX_NAME_LENGTH) {
      setLocalError(`Board name can be at most ${MAX_NAME_LENGTH} characters`);
      return;
    }

    if (!cardColor) {
      setLocalError("Please select a card color");
      return;
    }

    setLocalError("");

    onCreate({
      roomName: trimmedName,
      canvasTheme,
      showGrid,
      tag,
      cardColor,
    });
  };

  if (roomCreated) {
    return (
      <div style={{ background: cardColor }} className="w-full max-w-85 rounded-2xl p-5">
        <div className="flex justify-between items-center mb-5">
          <h2 className="font-[Georgia,serif] text-xl font-bold">Room created!</h2>
          <button
            className="cursor-pointer text-fg/70 p-1 rounded-md transition-colors hover:bg-black/5"
            onClick={() => {
              setRoomCreated(false);
              onClose();
            }}
          >
            <XIcon />
          </button>
        </div>

        <label className="block text-[11px] font-semibold mb-1.5 tracking-[0.06em] text-fg/70">
          ROOM ID
        </label>
        <div className="border-2 border-fg rounded-lg px-3.5 py-2.5 mb-4 bg-white/70 font-[Georgia,serif] font-bold tracking-widest text-fg">
          {roomData.roomId}
        </div>

        <label className="block text-[11px] font-semibold mb-1.5 tracking-[0.06em] text-fg/70">
          JOIN CODE
        </label>
        <div className="border-2 border-fg rounded-lg px-3.5 py-2.5 mb-5 bg-white/70 font-[Georgia,serif] font-bold tracking-widest text-fg">
          {roomData.joinCode}
        </div>

        <button
          onClick={() => navigate(`/canvas/${roomData.roomId}`)}
          className="w-full bg-fg cursor-pointer text-white rounded-lg py-3 text-sm font-semibold transition-all duration-200 hover:bg-[#333] hover:-translate-y-px"
        >
          Start drawing →
        </button>
      </div>
    );
  }

  // return (

  //   <div style={{ backgroundColor: cardColor }} className="w-full max-w-90 rounded-2xl p-5">
  return (
    <div style={{ backgroundColor: cardColor || "#f5f0e8" }} className="w-full max-w-90 rounded-2xl p-5">

      <div className="flex justify-between items-center mb-5">
        <h2 className="font-[Georgia,serif] text-xl font-bold tracking-[-0.4px]">
          Create a room
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
        maxLength={MAX_NAME_LENGTH}
        className="w-full px-3.5 py-2.5 text-sm border-2 border-fg rounded-lg bg-white font-inherit mb-4 outline-none transition-colors focus:border-accent"
      />

      <label className="block text-[11px] font-semibold text-muted mb-1.5 tracking-[0.06em]">
        CANVAS THEME
      </label>
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        <button
          type="button"
          onClick={() => setCanvasTheme("paper")}
          className={`border-2 rounded-xl p-2.5 text-left transition-all ${canvasTheme === "paper"
            ? "border-accent bg-bg shadow-[3px_3px_0_#1a1a1a]"
            : "border-line bg-white hover:border-fg/40"
            }`}
        >
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-bg border border-fg/30" />
            <span className="text-sm font-medium">Paper</span>
          </div>
          <p className="text-[11px] mt-1.5 text-muted leading-tight">Light workspace</p>
        </button>

        <button
          type="button"
          onClick={() => setCanvasTheme("dark")}
          className={`border-2 rounded-xl p-2.5 text-left transition-all ${canvasTheme === "dark"
            ? "border-accent bg-fg text-white shadow-[3px_3px_0_#1a1a1a]"
            : "border-line bg-white hover:border-fg/40"
            }`}
        >
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-black border border-white/30" />
            <span className="text-sm font-medium">Ink</span>
          </div>
          <p className={`text-[11px] mt-1.5 leading-tight ${canvasTheme === "dark" ? "opacity-70" : "text-muted"}`}>
            Dark workspace
          </p>
        </button>
      </div>

      <label className="block text-[11px] font-semibold text-muted mb-1.5 tracking-[0.06em]">
        TAG
      </label>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {tags.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTag(item)}
            className={`relative rounded-lg border-2 py-2 text-[11px] font-semibold tracking-[0.02em] transition-all cursor-pointer ${tag === item
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
      <div className="flex gap-2 mb-4 flex-wrap">
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => setCardColor(color)}
            style={{ backgroundColor: color }}
            aria-label={color}
            className={`relative w-7 h-7 rounded-full border-2 cursor-pointer transition-transform ${cardColor === color
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

      <label className="flex items-center justify-between border-2 border-fg rounded-lg px-3.5 py-2.5 mb-5 bg-white cursor-pointer">
        <div>
          <p className="text-[13px] font-semibold text-fg leading-tight">Show grid</p>
          <p className="text-[11px] text-muted leading-tight">Helps align shapes and diagrams</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={showGrid}
          onClick={() => setShowGrid((v) => !v)}
          className={`relative w-10 h-5.5 rounded-full transition-colors shrink-0 ${showGrid ? "bg-accent" : "bg-line"
            }`}
        >
          <span
            className={`absolute top-0.75 left-0.75 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${showGrid ? "translate-x-4.5" : "translate-x-0"
              }`}
          />
        </button>
      </label>

      {(localError || error) && (
        <p className="text-center text-[13px] text-accent italic font-[Georgia,serif] mb-4">
          {localError || error}
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={isCreating}
        className="w-full bg-fg text-white border-none rounded-lg py-3 text-sm font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all duration-200 hover:bg-[#333] hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isCreating ? "Creating..." : "Create room →"}
      </button>
    </div>
  );
}