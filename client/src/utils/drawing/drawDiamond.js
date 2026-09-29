

const drawDiamond = (ctx, shape) => {
  const { x, y, width, height } = shape;

  ctx.beginPath();

  ctx.moveTo(x + width / 2, y); // top

  ctx.lineTo(x + width, y + height / 2); // right

  ctx.lineTo(x + width / 2, y + height); // bottom

  ctx.lineTo(x, y + height / 2); // left

  ctx.closePath();

  ctx.stroke();
};

export default drawDiamond;