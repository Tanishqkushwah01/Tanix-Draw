import { Lock, LockOpen, MousePointer2, Hand, Square, Diamond, Circle, ArrowRight, Minus, Pencil, Type, Eraser } from "lucide-react";

const Toolbar = ({ selectedTool, setSelectedTool, isToolLocked, setIsToolLocked, canDraw = true }) => {
  const same = "hover:bg-purple-100 transition-all duration-200 cursor-pointer w-8 h-8 flex items-center justify-center rounded-md";
  const active = "bg-purple-300 cursor-pointer w-8 h-8 flex items-center justify-center rounded-md";
  const disabled = "opacity-30 cursor-not-allowed w-8 h-8 flex items-center justify-center rounded-md";

  const drawBtn = (tool, Icon) => (
    <button
      onClick={() => canDraw && setSelectedTool(tool)}
      disabled={!canDraw}
      className={!canDraw ? disabled : (selectedTool === tool ? active : same)}
    >
      <Icon size={18} />
    </button>
  );

  return (
    <div
      className="
        bg-[#fcfcfc]
        border
        border-gray-200
        shadow-sm
        rounded-md
        px-2
        flex
        items-center
        gap-0.5
        w-fit py-1
      "
    >
      <button
        onClick={() => setIsToolLocked(prev => !prev)}
        className={`${isToolLocked ? active : same}`}>
        {isToolLocked ? <Lock size={18} /> : <LockOpen size={18} />}
      </button>

      <div className="w-px h-8 bg-gray-300 mx-1"></div>

      <button onClick={() => setSelectedTool("mousePointer")}
        className={`${selectedTool === "mousePointer" ? active : same}`}>
        <MousePointer2 size={18} />
      </button>

      <button onClick={() => setSelectedTool("hand")}
        className={`${selectedTool === "hand" ? active : same}`}>
        <Hand size={18} />
      </button>

      {drawBtn("rectangle", Square)}
      {drawBtn("diamond", Diamond)}
      {drawBtn("circle", Circle)}
      {drawBtn("arrow", ArrowRight)}
      {drawBtn("line", Minus)}
      {drawBtn("pencil", Pencil)}
      {drawBtn("text", Type)}
      {drawBtn("eraser", Eraser)}
    </div>
  )
}

export default Toolbar;