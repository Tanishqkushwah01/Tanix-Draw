

const isPointInsideCircle = (x, y, shape) => {
  const centerX = shape.x + shape.width / 2;
  const centerY = shape.y + shape.height / 2;

  const radiusX = Math.abs(shape.width / 2);
  const radiusY = Math.abs(shape.height / 2);

  const value =
    ((x - centerX) * (x - centerX)) /
      (radiusX * radiusX) +
    ((y - centerY) * (y - centerY)) /
      (radiusY * radiusY);

  return value <= 1;
};

export default isPointInsideCircle;