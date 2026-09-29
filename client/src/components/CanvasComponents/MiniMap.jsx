import { memo, useEffect, useRef } from "react";
import getUserColor from "../../utils/getUserColor";
import getShapeBounds from "../../utils/selection/getShapeBounds";

const MiniMap = ({ shapesRef, cursors = {}, userId }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    (shapesRef?.current || []).forEach((shape) => {
      const bounds = getShapeBounds(shape);
      if (!bounds) return;
      minX = Math.min(minX, bounds.minX);
      minY = Math.min(minY, bounds.minY);
      maxX = Math.max(maxX, bounds.maxX);
      maxY = Math.max(maxY, bounds.maxY);
    });

    Object.values(cursors).forEach((cursor) => {
      minX = Math.min(minX, cursor.x);
      minY = Math.min(minY, cursor.y);
      maxX = Math.max(maxX, cursor.x);
      maxY = Math.max(maxY, cursor.y);
    });

    if (!isFinite(minX)) {
      minX = 0; minY = 0; maxX = 1000; maxY = 1000;
    }

    const padding = 100;
    minX -= padding;
    minY -= padding;
    maxX += padding;
    maxY += padding;

    const worldWidth = maxX - minX || 1;
    const worldHeight = maxY - minY || 1;

    const scale = Math.min(width / worldWidth, height / worldHeight);

    const offsetX = (width - worldWidth * scale) / 2;
    const offsetY = (height - worldHeight * scale) / 2;

    const toMiniMap = (x, y) => ({
      mx: offsetX + (x - minX) * scale,
      my: offsetY + (y - minY) * scale,
    });

    ctx.fillStyle = "rgba(255,255,255,0.3)";
    (shapesRef?.current || []).forEach((shape) => {
      const bounds = getShapeBounds(shape);
      if (!bounds) return;
      const { mx, my } = toMiniMap(
        (bounds.minX + bounds.maxX) / 2,
        (bounds.minY + bounds.maxY) / 2
      );
      ctx.fillRect(mx - 1, my - 1, 2, 2);
    });

    // ---- har user ka cursor dot + naam ----
    Object.entries(cursors).forEach(([id, cursor]) => {
      const { mx, my } = toMiniMap(cursor.x, cursor.y);
      const color = getUserColor(id);
      const isMe = id === userId;

      ctx.beginPath();
      ctx.arc(mx, my, isMe ? 5 : 4, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = "white";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.font = "9px Arial";
      ctx.fillStyle = "white";
      ctx.fillText(cursor.username || "User", mx + 7, my + 3);
    });
  }, [shapesRef, cursors, userId]);

  return (
    <canvas
      ref={canvasRef}
      width={216}
      height={130}
      className="w-full h-32.5 rounded-lg bg-[#102b36] border border-white/10"
    />
  );
};


export default memo(MiniMap);