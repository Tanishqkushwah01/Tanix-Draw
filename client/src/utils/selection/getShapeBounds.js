import measureTextWidth from "./measureTextWidth";

const getShapeBounds = (shape) => {

  // Rectangle, Circle, Diamond
  if (
    shape.type === "rectangle" ||
    shape.type === "circle" ||
    shape.type === "diamond"
  ) {

    const minX = Math.min(
      shape.x,
      shape.x + shape.width
    );

    const minY = Math.min(
      shape.y,
      shape.y + shape.height
    );

    const maxX = Math.max(
      shape.x,
      shape.x + shape.width
    );

    const maxY = Math.max(
      shape.y,
      shape.y + shape.height
    );

    return {
      minX,
      minY,
      maxX,
      maxY
    };
  }

  // Line & Arrow
  if (
    shape.type === "line" ||
    shape.type === "arrow"
  ) {

    const minX = Math.min(
      shape.x1,
      shape.x2
    );

    const minY = Math.min(
      shape.y1,
      shape.y2
    );

    const maxX = Math.max(
      shape.x1,
      shape.x2
    );

    const maxY = Math.max(
      shape.y1,
      shape.y2
    );

    return {
      minX,
      minY,
      maxX,
      maxY
    };
  }

  // Pencil
  if (shape.type === "pencil") {

    if (!Array.isArray(shape.points) || shape.points.length === 0) {
      return null;
    }

    const xs = shape.points.map(
      (point) => point.x
    );

    const ys = shape.points.map(
      (point) => point.y
    );

    const minX = Math.min(...xs);
    const minY = Math.min(...ys);

    const maxX = Math.max(...xs);
    const maxY = Math.max(...ys);

    return {
      minX,
      minY,
      maxX,
      maxY
    };
  }

    // Text
  if (shape.type === "text") {

    const width = measureTextWidth(
      shape.text,
      shape.fontSize
    );

    const height =
      shape.fontSize;

    return {
      minX: shape.x,
      minY: shape.y,
      maxX: shape.x + width,
      maxY: shape.y + height,
    };
  }

  return null;
};

export default getShapeBounds;