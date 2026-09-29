import { useState } from "react";
import {
  getRoomPreview,
  UsersIcon,
  ClockIcon,
} from "./dashboardIcons";
import { Pencil, Trash2 } from "lucide-react";

const EyeIcon = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
    <path
      d="M1 8s2.5-4.5 7-4.5S15 8 15 8s-2.5 4.5-7 4.5S1 8 1 8z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
    <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
    <path
      d="M2 2l12 12M6.6 6.7A2 2 0 008 10a2 2 0 001.35-3.4M4.2 4.4C2.4 5.4 1 8 1 8s2.5 4.5 7 4.5c1.2 0 2.25-.32 3.15-.8M9.8 3.62C9.2 3.54 8.6 3.5 8 3.5c4.5 0 7 4.5 7 4.5a11 11 0 01-2.1 2.6"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const RoomCard = ({ room, isNew, onClick, onEdit, onDelete }) => {
  const preview = getRoomPreview(room.tag, room.roomId || room._id);
  const [showCode, setShowCode] = useState(false);  

  const toggleCode = (e) => {
    e.stopPropagation(); 
    setShowCode((v) => !v);
  };

  return (
    <div
      onClick={onClick}
      style={{ backgroundColor: room.cardColor }}
      className={`
        border-2 border-fg rounded-2xl overflow-hidden cursor-pointer
        transition-transform duration-200
        hover:-translate-y-1 hover:shadow-[6px_6px_0_#1a1a1a]
        ${
          isNew
            ? "animate-[popIn_0.35s_cubic-bezier(.34,1.56,.64,1)_both]"
            : "animate-[fadeUp_0.5s_ease_both]"
        }
      `}
    >
      {/* Preview */}
      <div className="bg-white m-2.5 border-[1.5px] border-fg rounded-[10px] min-h-35 flex items-center justify-center overflow-hidden">
        <div className="w-full py-2">{preview}</div>
      </div>

      {/* Footer */}
      <div className="px-3.5 pb-3.5 pt-3">
        <div className="flex justify-between items-start mb-2">
          <span className="font-[Georgia,serif] text-[17px] font-bold text-fg leading-tight">
            {room.title}
          </span>

          <span className="text-[10px] font-bold tracking-[0.08em] text-muted mt-1">
            {room.tag}
          </span>
        </div>

        <div className="flex items-center gap-3.5">
          <span className="flex items-center gap-1 text-xs text-muted">
            <UsersIcon /> 1
          </span>

          <span className="flex items-center gap-1 text-xs text-muted">
            <ClockIcon />
            {new Date(room.createdAt).toLocaleDateString()}
          </span>

          <div className="ml-auto flex items-center gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(room);
              }}
              title="Edit"
              className="w-7.5 h-7.5 flex items-center justify-center bg-white/70 border-[1.5px] border-fg rounded-lg hover:bg-white transition-colors cursor-pointer"
            >
              <Pencil size={14} className="text-fg" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(room);
              }}
              title="Delete"
              className="w-7.5 h-7.5 flex items-center justify-center bg-white/70 border-[1.5px] border-accent rounded-lg hover:bg-accent/10 transition-colors cursor-pointer"
            >
              <Trash2 size={14} className="text-accent" />
            </button>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <span className="text-[11px] text-[#8a8070] font-[Georgia,serif] italic">
            Room #{room.roomId}
          </span>

          <button
            type="button"
            onClick={toggleCode}
            className="flex items-center gap-1 text-[11px] font-semibold text-accent hover:text-fg transition-colors cursor-pointer"
          >
            {showCode ? <EyeOffIcon /> : <EyeIcon />}
            {showCode ? room.joinCode ?? room.roomId : "code"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;