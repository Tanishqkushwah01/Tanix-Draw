const drawText = (ctx, shape) => {

  ctx.save();

  ctx.font = `${shape.fontSize}px Arial`;

  ctx.fillStyle = ctx.strokeStyle; // theme ke saath badle

  ctx.textBaseline = "top";

  ctx.fillText(
    shape.text,
    shape.x,
    shape.y
  );

  ctx.restore();
};

export default drawText;