import getResizeHandles from "./getResizeHandles";
import getShapeBounds from "./getShapeBounds";

const drawSelectionBox = (ctx, shape) => {
  ctx.save();

  const bounds = getShapeBounds(shape);

  if (!bounds) {
    ctx.restore();
    return;
  }

  let { minX, minY, maxX, maxY } = bounds;

  const padding = 10;

  minX -= padding;
  minY -= padding;

  maxX += padding;
  maxY += padding;





  ctx.strokeStyle = "#4F8CFF";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 4]);

  ctx.strokeRect(
    minX,
    minY,
    maxX - minX,
    maxY - minY
  );

  ctx.setLineDash([]);


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

  const handleSize = 10;

  handles.forEach((handle) => {
    ctx.shadowColor = "rgba(0,0,0,0.25)";
    ctx.shadowBlur = 6;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;

    ctx.fillStyle = "#FFFFFF";

    ctx.fillRect(
      handle.x - handleSize / 2,
      handle.y - handleSize / 2,
      handleSize,
      handleSize
    );

    ctx.strokeStyle = "#4F8CFF";
    ctx.lineWidth = 2;

    ctx.strokeRect(
      handle.x - handleSize / 2,
      handle.y - handleSize / 2,
      handleSize,
      handleSize
    );
  });



  ctx.restore();
};

export default drawSelectionBox;