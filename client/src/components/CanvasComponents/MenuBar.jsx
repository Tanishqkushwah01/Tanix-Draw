import { Menu } from "lucide-react";

const MenuBar = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
       className="
        absolute
        top-4
        left-5
        z-20
        w-10
        h-10
        bg-[#ECECF4]
        text-[#6A6A6F]
        rounded-[10px]
        flex
        items-center
        justify-center
        border
        border-[#e2e2e8]
        shadow-sm
        cursor-pointer
        hover:bg-gray-300
        transition-all
        duration-200
      "
    >
      <Menu size={18} strokeWidth={1.8} />
    </button>
  );
};

export default MenuBar;