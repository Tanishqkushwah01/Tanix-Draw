

const drawPencil = (ctx, shape) => {
  const { points } = shape;

  if (!points || points.length < 2) {
    return;
  }

  ctx.beginPath();

  ctx.moveTo(
    points[0].x,
    points[0].y
  );

  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(
      points[i].x,
      points[i].y
    );
  }

  ctx.stroke();
};

export default drawPencil;