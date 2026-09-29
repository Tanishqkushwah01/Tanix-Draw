const isPointOnHandle = (
  mouseX,
  mouseY,
  handleX,
  handleY,
  size = 8
) => {

  
  return (
    mouseX >= handleX - size &&
    mouseX <= handleX + size &&
    mouseY >= handleY - size &&
    mouseY <= handleY + size
  );
};

export default isPointOnHandle;