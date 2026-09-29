const drawGrid = (
  ctx,
  canvas,
  cameraX,
  cameraY,
  cameraScale,
  gridColor
) => {
  const gridSize = 50;

  const scaledGridSize = gridSize * cameraScale;

  if (scaledGridSize <= 0) return;

  ctx.save();

  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 1;

  const startX =
    ((cameraX % scaledGridSize) + scaledGridSize) %
    scaledGridSize;

  const startY =
    ((cameraY % scaledGridSize) + scaledGridSize) %
    scaledGridSize;

  for (
    let x = startX;
    x < canvas.width;
    x += scaledGridSize
  ) {
    ctx.beginPath();
    ctx.moveTo(Math.round(x) + 0.5, 0);
    ctx.lineTo(
      Math.round(x) + 0.5,
      canvas.height
    );
    ctx.stroke();
  }

  for (
    let y = startY;
    y < canvas.height;
    y += scaledGridSize
  ) {
    ctx.beginPath();
    ctx.moveTo(0, Math.round(y) + 0.5);
    ctx.lineTo(
      canvas.width,
      Math.round(y) + 0.5
    );
    ctx.stroke();
  }

  ctx.restore();
};

export default drawGrid;