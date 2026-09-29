

import isPointInsideRectangle from "./isPointInsideRectangle";
import isPointInsideCircle from "./isPointInsideCircle";
import isPointInsideDiamond from "./isPointInsideDiamond";
import isPointOnLine from "./isPointOnLine";
import isPointOnPencil from "./isPointOnPencil";
import getShapeBounds from "../selection/getShapeBounds";

const isShapeHit = (x, y, shape) => {
  switch (shape.type) {
    case "rectangle":
      return isPointInsideRectangle(x, y, shape);

    case "circle":
      return isPointInsideCircle(x, y, shape);

    case "diamond":
      return isPointInsideDiamond(x, y, shape);

    case "line":
      return isPointOnLine(x, y, shape);

    case "arrow":
      return isPointOnLine(x, y, shape);

    case "pencil":
      return isPointOnPencil(x, y, shape);

    case "text": {

      const bounds = getShapeBounds(shape);

      return (
        x >= bounds.minX &&
        x <= bounds.maxX &&
        y >= bounds.minY &&
        y <= bounds.maxY
      );
    }

    default:
      return false;
  }
};

export default isShapeHit;