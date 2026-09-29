const worldToScreen = (
  x,
  y,
  cameraX,
  cameraY,
  cameraScale
) => {
  return {
    screenX: x * cameraScale + cameraX,
    screenY: y * cameraScale + cameraY,
  };
};

export default worldToScreen;