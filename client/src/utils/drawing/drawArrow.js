

const drawArrow = (ctx, shape) => {
  const { x1, y1, x2, y2 } = shape;

  const headLength = 15;

  const angle = Math.atan2(
    y2 - y1,
    x2 - x1
  );

  // Main line
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  // Arrow head
  ctx.beginPath();

  ctx.moveTo(x2, y2);

  ctx.lineTo(
    x2 - headLength * Math.cos(angle - Math.PI / 6),
    y2 - headLength * Math.sin(angle - Math.PI / 6)
  );

  ctx.moveTo(x2, y2);

  ctx.lineTo(
    x2 - headLength * Math.cos(angle + Math.PI / 6),
    y2 - headLength * Math.sin(angle + Math.PI / 6)
  );

  ctx.stroke();
};

export default drawArrow;