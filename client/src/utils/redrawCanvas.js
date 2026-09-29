import drawRectangle from "./drawing/drawRectangle";
import drawCircle from "./drawing/drawCircle";
import drawLine from "./drawing/drawLine";
import drawArrow from "./drawing/drawArrow";
import drawDiamond from "./drawing/drawDiamond";
import drawPencil from "./drawing/drawPencil";
import drawSelectionBox from "./selection/drawSelectionBox";
import drawText from "./drawing/drawText";
import drawGrid from "./drawGrid";

const redrawCanvas = (
  ctx,
  canvas,
  shapes,
  selectedShapeIndex = null,
  cameraX = 0,
  cameraY = 0,
  cameraScale = 1,
  showGrid = false,
   gridColor
) => {

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

     if (showGrid) {
   
      const resolvedGridColor =
      gridColor ||
      (canvas.dataset.theme === "black"
        ? "rgba(255,255,255,0.15)"
        : "rgba(0,0,0,0.15)");

    drawGrid(
      ctx,
      canvas,
      cameraX,
      cameraY,
      cameraScale,
      resolvedGridColor
    );
  }

  ctx.save();

  ctx.translate(cameraX, cameraY);
  ctx.scale(cameraScale, cameraScale);

  shapes.forEach((shape, index) => {
   
    switch (shape.type) {


      case "rectangle":
        drawRectangle(ctx, shape);
        break;

      case "circle":
        drawCircle(ctx, shape);
        break;

      case "line":
        drawLine(ctx, shape);
        break;

      case "arrow":
        drawArrow(ctx, shape);
        break;

      case "diamond":
        drawDiamond(ctx, shape);
        break;

      case "pencil":
        drawPencil(ctx, shape);
        break;

      case "text":
        drawText(ctx, shape);
        break;

      default:
        break;
    }

    if (index === selectedShapeIndex) {
      drawSelectionBox(ctx, shape);
    }

  });

  ctx.restore();
};

export default redrawCanvas;