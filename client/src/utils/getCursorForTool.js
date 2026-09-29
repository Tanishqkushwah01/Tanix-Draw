

export const ERASER_CURSOR =
  'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij4KPGNpcmNsZSBjeD0iOCIgY3k9IjgiIHI9IjYiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMi41Ii8+CjxjaXJjbGUgY3g9IjgiIGN5PSI4IiByPSI2IiBmaWxsPSJub25lIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjEiLz4KPC9zdmc+") 8 8, auto';


export const getBaseCursor = (tool) => {
  switch (tool) {
    case "mousePointer":
      return "default";

    case "hand":
      return "grab";

    case "eraser":
      return ERASER_CURSOR;

    case "rectangle":
    case "circle":
    case "diamond":
    case "line":
    case "arrow":
    case "text":
    case "pencil":
      return "crosshair";

    default:
      return "default";
  }
};

export const getResizeCursor = (position) => {
  switch (position) {
    case "n":
    case "s":
      return "ns-resize";

    case "e":
    case "w":
      return "ew-resize";

    case "ne":
    case "sw":
      return "nesw-resize";

    case "nw":
    case "se":
      return "nwse-resize";

    case "start":
    case "end":
      return "crosshair";

    default:
      return "default";
  }
};


export const resolveBaseCursor = (tool, canDraw) => {
  if (!canDraw && tool !== "hand") {
    return "not-allowed";
  }
  return getBaseCursor(tool);
};