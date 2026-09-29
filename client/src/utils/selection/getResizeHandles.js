const getResizeHandles = (
  minX,
  minY,
  maxX,
  maxY
) => {
  return [
    { x: minX, y: minY, position: "nw" },
    { x: (minX + maxX) / 2, y: minY, position: "n" },
    { x: maxX, y: minY, position: "ne" },

    { x: minX, y: (minY + maxY) / 2, position: "w" },
    { x: maxX, y: (minY + maxY) / 2, position: "e" },

    { x: minX, y: maxY, position: "sw" },
    { x: (minX + maxX) / 2, y: maxY, position: "s" },
    { x: maxX, y: maxY, position: "se" },
  ];
};

export default getResizeHandles;
