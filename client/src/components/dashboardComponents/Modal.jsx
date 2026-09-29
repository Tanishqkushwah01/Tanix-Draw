

export default function Modal({ onClose, children ,cardColor,
  setCardColor,
  colors}) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-200 bg-fg/55 backdrop-blur-sm flex items-center justify-center animate-[fadeIn_0.18s_ease]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
    style={{ backgroundColor: cardColor }}
        
        className="bg-card border-2 border-fg rounded-[20px] shadow-[8px_8px_0_#1a1a1a] px-10 py-9 w-full max-w-110 animate-[slideUp_0.22s_ease]"
      >
        {children}
      </div>
    </div>
  );
}