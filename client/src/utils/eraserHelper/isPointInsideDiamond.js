


const isPointInsideDiamond = (x, y, shape) => {
  const centerX = shape.x + shape.width / 2;
  const centerY = shape.y + shape.height / 2;

  const dx = Math.abs(x - centerX);
  const dy = Math.abs(y - centerY);

  return (
    dx / (Math.abs(shape.width) / 2) +
      dy / (Math.abs(shape.height) / 2) <=
    1
  );
};

export default isPointInsideDiamond;