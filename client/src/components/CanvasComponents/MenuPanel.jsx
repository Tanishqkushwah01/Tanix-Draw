import {
    Users,
    Trash2,
    Sun,
    Moon,
    Grid3X3,
    LayoutDashboard,
} from "lucide-react";

const MenuPanel = ({ onCollaboration, isOwner, onClearCanvas, showGrid, onToggleGrid, canvasTheme, onToggleTheme, onGoToDashboard }) => {


    const menuItem =
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-gray-700 hover:bg-purple-100 transition-all duration-150 cursor-pointer";

    return (
        <div
            className="
        absolute
        top-17
        left-5
        z-30
        w-60
        bg-white
        border
        border-gray-200
        rounded-xl
        shadow-[0_8px_25px_rgba(0,0,0,0.12)]
        p-2
      "
        >

            <button
                onClick={onCollaboration}
                className={menuItem}
            >
                <Users size={18} />
                <span>Live collaboration</span>
            </button>

            {isOwner && (
                <button onClick={onClearCanvas} className={menuItem}>
                    <Trash2 size={18} />
                    <span>Clear canvas</span>
                </button>
            )}

            <div className="w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm text-gray-700">
                <div className="flex items-center gap-3">
                    <Sun size={18} />
                    <span>Theme</span>
                </div>

                <div className="flex bg-gray-100 rounded-lg p-0.5 gap-0.5">
                    <button
                        onClick={() => onToggleTheme("paper")}
                        className={`w-7 h-7 rounded-md flex items-center justify-center cursor-pointer ${canvasTheme === "paper" ? "bg-white shadow-sm" : ""
                            }`}
                    >
                        <Sun size={15} className={canvasTheme === "paper" ? "text-gray-800" : "text-gray-400"} />
                    </button>
                     

                    <button
                        onClick={() => onToggleTheme("dark")}
                        className={`w-7 h-7 rounded-md flex items-center justify-center cursor-pointer ${canvasTheme === "dark" ? "bg-gray-900 shadow-sm" : ""
                            }`}
                    >
                        <Moon size={15} className={canvasTheme === "dark" ? "text-white" : "text-gray-400"} />
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm text-gray-700">
                <div className="flex items-center gap-3">
                    <Grid3X3 size={18} />
                    <span>Grid</span>
                </div>

                <button
                    onClick={() => onToggleGrid(!showGrid)}
                    className={`w-9 h-5 rounded-full relative transition-colors duration-200 cursor-pointer ${showGrid ? "bg-purple-500" : "bg-gray-300"
                        }`}
                >
                    <span
                        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${showGrid ? "translate-x-4" : "translate-x-0"
                            }`}
                    />
                </button>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-200 my-2" />

            {/* Dashboard */}
            <button onClick={onGoToDashboard} className={menuItem}>
                <LayoutDashboard size={18} />
                <span>Go to dashboard</span>
            </button>

        </div>
    );
};

export default MenuPanel;