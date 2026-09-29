const drawCursor = (ctx, cursor) => {
  const { screenX, screenY, username, color } = cursor;

  ctx.save();

  // Pointer arrow
  ctx.beginPath();
  ctx.moveTo(screenX, screenY);
  ctx.lineTo(screenX, screenY + 16);
  ctx.lineTo(screenX + 4, screenY + 12);
  ctx.lineTo(screenX + 7, screenY + 18);
  ctx.lineTo(screenX + 9, screenY + 17);
  ctx.lineTo(screenX + 6, screenY + 11);
  ctx.lineTo(screenX + 12, screenY + 10);
  ctx.closePath();

  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = "white";
  ctx.lineWidth = 1;
  ctx.stroke();

  // Name label
  ctx.font = "12px Arial";
  const textWidth = ctx.measureText(username).width;

  ctx.fillStyle = color;
  ctx.fillRect(screenX + 14, screenY + 6, textWidth + 10, 18);

  ctx.fillStyle = "white";
  ctx.fillText(username, screenX + 19, screenY + 19);

  ctx.restore();
};

export default drawCursor;