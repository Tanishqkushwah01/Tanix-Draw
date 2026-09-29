import getResizeHandles from "./getResizeHandles";
import isPointOnHandle from "./isPointOnHandle";

const getClickedHandle = (
  mouseX,
  mouseY,
  shape,
  minX,
  minY,
  maxX,
  maxY
) => {

  let handles = [];

  if (
    shape.type === "line" ||
    shape.type === "arrow"
  ) {
    handles = [
      {
        x: shape.x1,
        y: shape.y1,
        position: "start",
      },
      {
        x: shape.x2,
        y: shape.y2,
        position: "end",
      },
    ];
  } else {
    handles = getResizeHandles(
      minX,
      minY,
      maxX,
      maxY
    );
  }

  for (const handle of handles) {
    if (
      isPointOnHandle(
        mouseX,
        mouseY,
        handle.x,
        handle.y
      )
    ) {
      return handle;
    }
  }

  return null;
};

export default getClickedHandle;