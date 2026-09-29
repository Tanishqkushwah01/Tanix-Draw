const isPointInsideRectangle = (x, y, shape) => {
  const left = Math.min(
    shape.x,
    shape.x + shape.width
  );

  const right = Math.max(
    shape.x,
    shape.x + shape.width
  );

  const top = Math.min(
    shape.y,
    shape.y + shape.height
  );

  const bottom = Math.max(
    shape.y,
    shape.y + shape.height
  );

  return (
    x >= left &&
    x <= right &&
    y >= top &&
    y <= bottom
  );
};

export default isPointInsideRectangle;