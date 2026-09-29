const isPointOnPencil = (x, y, shape) => {
  const tolerance = 5;

  if (!shape.points || shape.points.length < 2) {
    return false;
  }

  for (let i = 0; i < shape.points.length - 1; i++) {
    const p1 = shape.points[i];
    const p2 = shape.points[i + 1];

    const A = x - p1.x;
    const B = y - p1.y;
    const C = p2.x - p1.x;
    const D = p2.y - p1.y;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;

    let param = -1;

    if (lenSq !== 0) {
      param = dot / lenSq;
    }

    let xx, yy;

    if (param < 0) {
      xx = p1.x;
      yy = p1.y;
    } else if (param > 1) {
      xx = p2.x;
      yy = p2.y;
    } else {
      xx = p1.x + param * C;
      yy = p1.y + param * D;
    }

    const dx = x - xx;
    const dy = y - yy;

    if (Math.sqrt(dx * dx + dy * dy) <= tolerance) {
      return true;
    }
  }

  return false;
};

export default isPointOnPencil;