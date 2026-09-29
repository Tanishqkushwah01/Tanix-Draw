const screenToWorld = (
  x,
  y,
  cameraX,
  cameraY,
  cameraScale
) => {
  return {
    worldX: (x - cameraX) / cameraScale,
    worldY: (y - cameraY) / cameraScale,
  };
};

export default screenToWorld;