

const drawLine = (ctx, shape) => {
  ctx.beginPath();

  ctx.moveTo(
    shape.x1,
    shape.y1
  );

  ctx.lineTo(
    shape.x2,
    shape.y2
  );

  ctx.stroke();
};

export default drawLine;