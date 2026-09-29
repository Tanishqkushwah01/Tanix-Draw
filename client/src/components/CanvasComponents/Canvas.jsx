import { memo, useEffect, useRef, useState } from 'react';
import getMousePos from '../../utils/getMousePos';
import redrawCanvas from "../../utils/redrawCanvas";
import drawCircle from '../../utils/drawing/drawCircle';
import drawRectangle from '../../utils/drawing/drawRectangle';
import drawLine from '../../utils/drawing/drawLine';
import drawArrow from '../../utils/drawing/drawArrow';
import drawDiamond from '../../utils/drawing/drawDiamond';
import drawPencil from "../../utils/drawing/drawPencil";
import isShapeHit from '../../utils/eraserHelper/isShapeHit';
import eraseAtPoint from "../../utils/eraserHelper/eraseAtPoint";
import getShapeBounds from "../../utils/selection/getShapeBounds";
import getClickedHandle from "../../utils/selection/getClickedHandle";
import screenToWorld from "../../utils/screenToWorld";
import { saveShapes } from "../Api/shapeApi";
import getSocket from '../websocket/socket';
import drawCursor from "../../utils/drawing/drawCursor";
import getUserColor from "../../utils/getUserColor";
import { resolveBaseCursor, getResizeCursor } from "../../utils/getCursorForTool";

const Canvas = ({ selectedTool, setSelectedTool, isToolLocked, showGrid, theme, drawingPencil, shapesRef, canvasId, roomId, canDraw = true, onLocalCursorMove }) => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);


  // this is for the select shape tool (mousePointer)
  const selectedShapeIndex = useRef(null);

  // this is for the move shape 
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartY = useRef(0);


  // this is for the rezise of the shpaes 
  const isResizing = useRef(false);
  const resizeHandle = useRef(null);

  //  this i s for the pencil 
  const currentPath = useRef(null);

  // this is fo r the eraser 
  const isErasing = useRef(false);

  const startX = useRef(0);
  const startY = useRef(0);
  const isDrawing = useRef(false);


  // this is for the text 
  const [isTyping, setIsTyping] = useState(false);
  const [textValue, setTextValue] = useState("");
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });



  const [textScreenPosition, setTextScreenPosition] = useState({ x: 0, y: 0 });

  //  this is for the hand tolll
  const isPanning = useRef(false);
  const isTemporaryPanning = useRef(false);
  const panStartX = useRef(0);
  const panStartY = useRef(0);
  const cameraX = useRef(0);
  const cameraY = useRef(0);

  // for the zoom in and out 
  const cameraScale = useRef(1);

  // live cursors ke liye
  const overlayCanvasRef = useRef(null);
  const cursorsRef = useRef({});
  const lastCursorSendRef = useRef(0);


  // auto save adding
  const saveTimerRef = useRef(null);
  const isSavingRef = useRef(false);
  const needsResaveRef = useRef(false);

  const showGridRef = useRef(showGrid);
  useEffect(() => { showGridRef.current = showGrid; }, [showGrid]);

  const canDrawRef = useRef(canDraw);
  useEffect(() => { canDrawRef.current = canDraw; }, [canDraw]);



  const saveCameraPosition = () => {
    if (!roomId) return;
    localStorage.setItem(
      `tkdraw-camera-${roomId}`,
      JSON.stringify({
        x: cameraX.current,
        y: cameraY.current,
        scale: cameraScale.current,
      })
    );
  };


  useEffect(() => {
    const overlay = overlayCanvasRef.current;
    if (!overlay) return;

    const ctx = overlay.getContext("2d");
    let rafId;

    const loop = () => {
      ctx.clearRect(0, 0, overlay.width, overlay.height);

      Object.values(cursorsRef.current).forEach((cursor) => {
        const screenX = cursor.x * cameraScale.current + cameraX.current;
        const screenY = cursor.y * cameraScale.current + cameraY.current;

        drawCursor(ctx, {
          screenX,
          screenY,
          username: cursor.username,
          color: cursor.color,
        });
      });

      rafId = requestAnimationFrame(loop);
    };

    loop();

    return () => cancelAnimationFrame(rafId);
  }, []);


  useEffect(() => {
    if (!canvasRef.current) return;

    canvasRef.current.style.cursor = resolveBaseCursor(selectedTool, canDraw);
  }, [selectedTool, canDraw]);





  useEffect(() => {
    if (!ctxRef.current || !canvasRef.current) return;

    ctxRef.current.strokeStyle = drawingPencil;
    ctxRef.current.fillStyle = drawingPencil;
    ctxRef.current.lineWidth = 2;

    redrawCanvas(
      ctxRef.current,
      canvasRef.current,
      shapesRef.current,
      selectedShapeIndex.current,
      cameraX.current,
      cameraY.current,
      cameraScale.current,
      showGrid
    );
  }, [showGrid, theme, drawingPencil]);


  const flushAutoSave = async () => {
    if (!canvasId || !canDrawRef.current) return;

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }

    if (isSavingRef.current) {
      needsResaveRef.current = true;
      return;
    }

    try {
      isSavingRef.current = true;

      const response = await saveShapes(canvasId, [...shapesRef.current]);

      if (response.data.success) {

        const savedByClientId = new Map(
          response.data.shapes
            .filter((s) => s.clientId)
            .map((s) => [s.clientId, s])
        );

        shapesRef.current.forEach((shape) => {
          if (!shape._id && shape.clientId) {
            const saved = savedByClientId.get(shape.clientId);
            if (saved) shape._id = saved._id;
          }
        });
      }
    } catch (error) {
      console.error("Auto save error:", error);

      const status = error.response?.status;
      if (!status || status >= 500) {
        setTimeout(() => triggerAutoSave(), 5000);
      }
    } finally {
      isSavingRef.current = false;

      if (needsResaveRef.current) {
        needsResaveRef.current = false;
        triggerAutoSave();
      }
    }
  };

  const triggerAutoSave = () => {
    if (!canvasId) return;

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = setTimeout(() => {
      flushAutoSave();
    }, 1200);
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      flushAutoSave();
    };

    const handleVisibilityChangeForSave = () => {
      if (document.visibilityState === "hidden") {
        flushAutoSave();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChangeForSave);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChangeForSave);
    };
  }, [canvasId]);


  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const overlay = overlayCanvasRef.current;

      if (!canvas) return;

      const oldWidth = canvas.width;
      const oldHeight = canvas.height;

      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      const dx = (newWidth - oldWidth) / 2;
      const dy = (newHeight - oldHeight) / 2;

      cameraX.current += dx;
      cameraY.current += dy;

      canvas.width = newWidth;
      canvas.height = newHeight;

      if (overlay) {
        overlay.width = newWidth;
        overlay.height = newHeight;
      }

      ctxRef.current.strokeStyle = drawingPencil;
      ctxRef.current.fillStyle = drawingPencil;
      ctxRef.current.lineWidth = 2;

      redrawCanvas(
        ctxRef.current,
        canvasRef.current,
        shapesRef.current,
        selectedShapeIndex.current,
        cameraX.current,
        cameraY.current,
        cameraScale.current,
        showGrid
      );

      saveCameraPosition();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [showGrid, drawingPencil]);

  useEffect(() => {
    const handleMessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "cursor-move") {
        cursorsRef.current[data.userId] = {
          x: data.x,
          y: data.y,
          username: data.username,
          color: cursorsRef.current[data.userId]?.color || getUserColor(data.userId),
        };
        return;
      }

      if (data.type === "users-list") {
        const activeIds = new Set(data.users.map((u) => u.userId));

        Object.keys(cursorsRef.current).forEach((id) => {
          if (!activeIds.has(id)) {
            delete cursorsRef.current[id];
          }
        });

        return;
      }

      if (data.type === "shape-created") {
        shapesRef.current.push(data.shape);
      }


      else if (data.type === "shape-updated") {
        const index = shapesRef.current.findIndex(
          (s) =>
            (data.shape.clientId && s.clientId === data.shape.clientId) ||
            (data.shape._id && s._id === data.shape._id)
        );

        if (index !== -1) {
          shapesRef.current[index] = data.shape;
        }
      }

      else if (data.type === "shape-deleted") {
        const selectedShape = shapesRef.current[selectedShapeIndex.current];

        shapesRef.current = shapesRef.current.filter(
          (s) => s.clientId !== data.shapeId && s._id !== data.shapeId
        );

        if (selectedShapeIndex.current !== null) {
          const newIndex = selectedShape
            ? shapesRef.current.indexOf(selectedShape)
            : -1;

          if (newIndex === -1) {
            selectedShapeIndex.current = null;
            isDragging.current = false;
            isResizing.current = false;
            resizeHandle.current = null;
          } else {
            selectedShapeIndex.current = newIndex;
          }
        }
      }

      else if (data.type === "canvas-cleared") {
        shapesRef.current = [];
        selectedShapeIndex.current = null;
        isDragging.current = false;
        isResizing.current = false;
        resizeHandle.current = null;
      }

      else {
        return;
      }

      redrawCanvas(
        ctxRef.current,
        canvasRef.current,
        shapesRef.current,
        selectedShapeIndex.current,
        cameraX.current,
        cameraY.current,
        cameraScale.current,
        showGrid
      );
    };

    const socket = getSocket();
    socket?.addEventListener("message", handleMessage);

    return () => {
      socket?.removeEventListener("message", handleMessage);
    };
  }, [showGrid]);


  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        redrawCanvas(
          ctxRef.current,
          canvasRef.current,
          shapesRef.current,
          selectedShapeIndex.current,
          cameraX.current,
          cameraY.current,
          cameraScale.current,
          showGrid
        );
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [showGrid]);

  const handleKeyDown = (e) => {

    if (!e.ctrlKey) return;

    if (e.key === "=" || e.key === "+") {

      e.preventDefault();

      cameraScale.current *= 1.1;
    }

    else if (e.key === "-") {

      e.preventDefault();

      cameraScale.current *= 0.9;
    }

    cameraScale.current = Math.max(
      0.2,
      Math.min(cameraScale.current, 3)
    );

    redrawCanvas(
      ctxRef.current,
      canvasRef.current,
      shapesRef.current,
      selectedShapeIndex.current,
      cameraX.current,
      cameraY.current,
      cameraScale.current,
      showGridRef.current
    );
    saveCameraPosition();
  };

  useEffect(() => {

    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    ctxRef.current = ctx;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if (overlayCanvasRef.current) {
      overlayCanvasRef.current.width = window.innerWidth;
      overlayCanvasRef.current.height = window.innerHeight;
    }

    const preventContextMenu = (e) => { e.preventDefault() };

    canvas.addEventListener("contextmenu", preventContextMenu);

    window.addEventListener("keydown", handleKeyDown);

    canvas.addEventListener("wheel", handleWheel, { passive: false });

    const savedShapes = shapesRef.current;

    const savedCamera = roomId
      ? JSON.parse(localStorage.getItem(`tkdraw-camera-${roomId}`) || "null")
      : null;

    if (savedCamera) {
      cameraX.current = savedCamera.x;
      cameraY.current = savedCamera.y;
      cameraScale.current = savedCamera.scale;
    } else {
      cameraScale.current = 0.5;
    }

    ctxRef.current.strokeStyle = drawingPencil;
    ctxRef.current.fillStyle = drawingPencil;

    if (savedShapes) {



      redrawCanvas(
        ctxRef.current,
        canvasRef.current,
        shapesRef.current,
        selectedShapeIndex.current,
        cameraX.current,
        cameraY.current,
        cameraScale.current,
        showGrid
      );
    }

    return () => {
      canvas.removeEventListener("contextmenu", preventContextMenu);
      canvas.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
    };

  }, []);




  const handleMouseDown = (e) => {

    if (!canDraw && selectedTool !== "hand" && e.button !== 2) {
      return;
    }
    const { x, y } = getMousePos(e, canvasRef.current);

    const { worldX, worldY } = screenToWorld(
      x,
      y,
      cameraX.current,
      cameraY.current,
      cameraScale.current
    );


    if (e.button === 2) {

      isDrawing.current = false;
      isDragging.current = false;
      isResizing.current = false;

      isTemporaryPanning.current = true;
      if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";

      panStartX.current = x;
      panStartY.current = y;

      return;
    }
    if (selectedTool === "hand") {

      isPanning.current = true;
      if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";

      panStartX.current = x;
      panStartY.current = y;

      return;
    }

    if (selectedTool === "mousePointer") {

      const selIdx = selectedShapeIndex.current;
      const selShape = selIdx !== null ? shapesRef.current[selIdx] : null;
      const selBounds = selShape ? getShapeBounds(selShape) : null;

      if (selShape && selBounds) {

        const clickedHandle =
          getClickedHandle(
            worldX,
            worldY,
            selShape,
            selBounds.minX - 10,
            selBounds.minY - 10,
            selBounds.maxX + 10,
            selBounds.maxY + 10
          );

        if (clickedHandle) {

          isResizing.current = true;

          resizeHandle.current = clickedHandle.position;

          if (canvasRef.current) {
            canvasRef.current.style.cursor = getResizeCursor(clickedHandle.position);
          }

          dragStartX.current = worldX;
          dragStartY.current = worldY;

          redrawCanvas(
            ctxRef.current,
            canvasRef.current,
            shapesRef.current,
            selectedShapeIndex.current,
            cameraX.current,
            cameraY.current,
            cameraScale.current,
            showGrid
          );

          return;
        }
      }

      for (
        let i = shapesRef.current.length - 1;
        i >= 0;
        i--
      ) {

        const shape = shapesRef.current[i];

        if (isShapeHit(worldX, worldY, shape)) {

          selectedShapeIndex.current = i;

          isDragging.current = true;

          if (canvasRef.current) canvasRef.current.style.cursor = "move";

          dragStartX.current = worldX;
          dragStartY.current = worldY;

          redrawCanvas(
            ctxRef.current,
            canvasRef.current,
            shapesRef.current,
            selectedShapeIndex.current,
            cameraX.current,
            cameraY.current,
            cameraScale.current,
            showGrid
          );

          return;
        }
      }

      selectedShapeIndex.current = null;

      isDragging.current = false;

      isResizing.current = false;

      resizeHandle.current = null;

      redrawCanvas(
        ctxRef.current,
        canvasRef.current,
        shapesRef.current,
        null,
        cameraX.current,
        cameraY.current,
        cameraScale.current,
        showGrid
      );

      return;
    }


    else if (selectedTool === "eraser") {

      isErasing.current = true;

      eraseAtPoint(
        worldX,
        worldY,
        shapesRef,
        ctxRef,
        canvasRef,
        cameraX,
        cameraY,
        cameraScale,
        showGrid,
        getSocket(),
        roomId
      );

      return;
    }
   
    else if (selectedTool === "text") {

      setTextPosition({
        x: worldX,
        y: worldY,
      });

      const screenX =
        worldX * cameraScale.current + cameraX.current;

      const screenY =
        worldY * cameraScale.current + cameraY.current;

      setTextScreenPosition({
        x: screenX,
        y: screenY,
      });

      setTextValue("");
      setIsTyping(true);

      return;
    }

     isDrawing.current = true;

    startX.current = worldX;
    startY.current = worldY;

    if (selectedTool === "pencil") {

      currentPath.current = {
        type: "pencil",
        points: [{
          x: worldX,
          y: worldY
        }]
      };
    }
  };



  const handleMouseMove = (e) => {

    const { x, y } = getMousePos(e, canvasRef.current);

    const { worldX, worldY } = screenToWorld(
      x,
      y,
      cameraX.current,
      cameraY.current,
      cameraScale.current
    );

    const now = Date.now();
    if (roomId && now - lastCursorSendRef.current > 50) {
      lastCursorSendRef.current = now;

      const socket = getSocket();
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      if (userInfo?._id) {
        onLocalCursorMove?.(userInfo._id, worldX, worldY, userInfo.username || "User");
      }

      if (socket?.readyState === WebSocket.OPEN && userInfo?._id) {
        socket.send(
          JSON.stringify({
            type: "cursor-move",
            roomId,
            userId: userInfo._id,
            username: userInfo.username || "User",
            x: worldX,
            y: worldY,
          })
        );
      }
    }

    if (
      selectedTool === "mousePointer" &&
      canDraw &&
      !isDragging.current &&
      !isResizing.current
    ) {
      let hoverCursor = "default";

      const hovSelIdx = selectedShapeIndex.current;
      const hovSelShape = hovSelIdx !== null ? shapesRef.current[hovSelIdx] : null;
      const hovSelBounds = hovSelShape ? getShapeBounds(hovSelShape) : null;
      let handleHovered = false;

      if (hovSelShape && hovSelBounds) {
        const hoveredHandle = getClickedHandle(
          worldX,
          worldY,
          hovSelShape,
          hovSelBounds.minX - 10,
          hovSelBounds.minY - 10,
          hovSelBounds.maxX + 10,
          hovSelBounds.maxY + 10
        );

        if (hoveredHandle) {
          hoverCursor = getResizeCursor(hoveredHandle.position);
          handleHovered = true;
        }
      }

      if (!handleHovered) {
        for (let i = shapesRef.current.length - 1; i >= 0; i--) {
          const shape = shapesRef.current[i];

          if (isShapeHit(worldX, worldY, shape)) {
            hoverCursor = "move";
            break;
          }
        }
      }

      if (canvasRef.current) {
        canvasRef.current.style.cursor = hoverCursor;
      }
    }

    if (isPanning.current || isTemporaryPanning.current) {



      const dx = x - panStartX.current;
      const dy = y - panStartY.current;

      cameraX.current += dx;
      cameraY.current += dy;

      panStartX.current = x;
      panStartY.current = y;

      redrawCanvas(
        ctxRef.current,
        canvasRef.current,
        shapesRef.current,
        selectedShapeIndex.current,
        cameraX.current,
        cameraY.current,
        cameraScale.current,
        showGrid
      );

      return;
    }



    
    if (
      selectedTool === "mousePointer" &&
      isResizing.current &&
      selectedShapeIndex.current !== null
    ) {

      const shape =
        shapesRef.current[
        selectedShapeIndex.current
        ];

      if (
        shape.type === "rectangle" ||
        shape.type === "circle" ||
        shape.type === "diamond"
      ) {

        const right = shape.x + shape.width;

        const bottom = shape.y + shape.height;

        switch (resizeHandle.current) {

          case "se":
            shape.width = worldX - shape.x;
            shape.height = worldY - shape.y;
            break;

          case "e":
            shape.width = worldX - shape.x;
            break;

          case "s":
            shape.height = worldY - shape.y;
            break;

          case "w":
            shape.x = worldX;
            shape.width = right - worldX;
            break;

          case "n":
            shape.y = worldY;
            shape.height = bottom - worldY;
            break;

          case "nw":
            shape.x = worldX;
            shape.y = worldY;
            shape.width = right - worldX;
            shape.height = bottom - worldY;
            break;

          case "ne":
            shape.y = worldY;
            shape.width = worldX - shape.x;
            shape.height = bottom - worldY;
            break;

          case "sw":
            shape.x = worldX;
            shape.width = right - worldX;
            shape.height = worldY - shape.y;
            break;

          default:
            break;
        }
      }

      // Line / Arrow
      else if (
        shape.type === "line" ||
        shape.type === "arrow"
      ) {

        switch (resizeHandle.current) {

          case "start":
            shape.x1 = worldX;
            shape.y1 = worldY;
            break;

          case "end":
            shape.x2 = worldX;
            shape.y2 = worldY;
            break;

          default:
            break;
        }
      }

      // Pencil
      else if (shape.type === "pencil") {

        const bounds = getShapeBounds(shape);

        const oldMinX = bounds.minX;
        const oldMinY = bounds.minY;
        const oldMaxX = bounds.maxX;
        const oldMaxY = bounds.maxY;

        const oldWidth =
          oldMaxX - oldMinX;

        const oldHeight =
          oldMaxY - oldMinY;

        if (
          oldWidth <= 0 ||
          oldHeight <= 0
        ) {
          return;
        }

        let newMinX = oldMinX;
        let newMinY = oldMinY;
        let newMaxX = oldMaxX;
        let newMaxY = oldMaxY;

        switch (resizeHandle.current) {

          case "e":
            newMaxX = worldX;
            break;

          case "w":
            newMinX = worldX;
            break;

          case "s":
            newMaxY = worldY;
            break;

          case "n":
            newMinY = worldY;
            break;

          case "se":
            newMaxX = worldX;
            newMaxY = worldY;
            break;

          case "sw":
            newMinX = worldX;
            newMaxY = worldY;
            break;

          case "ne":
            newMaxX = worldX;
            newMinY = worldY;
            break;

          case "nw":
            newMinX = worldX;
            newMinY = worldY;
            break;

          default:
            return;
        }

        const newWidth =
          newMaxX - newMinX;

        const newHeight =
          newMaxY - newMinY;

        if (
          newWidth <= 0 ||
          newHeight <= 0
        ) {
          return;
        }

        const scaleX =
          newWidth / oldWidth;

        const scaleY =
          newHeight / oldHeight;

        shape.points.forEach((point) => {

          point.x =
            newMinX +
            (point.x - oldMinX) *
            scaleX;

          point.y =
            newMinY +
            (point.y - oldMinY) *
            scaleY;

        });
      }

      // Text
      else if (shape.type === "text") {

        const dx = worldX - dragStartX.current;

        shape.fontSize += dx * 0.2;

        shape.fontSize = Math.max(8, shape.fontSize);

        dragStartX.current = worldX;
      }

      redrawCanvas(
        ctxRef.current,
        canvasRef.current,
        shapesRef.current,
        selectedShapeIndex.current,
        cameraX.current,
        cameraY.current,
        cameraScale.current,
        showGrid
      );

      return;
    }
   

    if (
      selectedTool === "mousePointer" &&
      isDragging.current &&
      selectedShapeIndex.current !== null
    ) {

      const dx =
        worldX - dragStartX.current;

      const dy =
        worldY - dragStartY.current;

      const shape =
        shapesRef.current[
        selectedShapeIndex.current
        ];

      if (
        shape.type === "rectangle" ||
        shape.type === "circle" ||
        shape.type === "diamond"
      ) {

        shape.x += dx;
        shape.y += dy;
      }

      else if (
        shape.type === "line" ||
        shape.type === "arrow"
      ) {

        shape.x1 += dx;
        shape.y1 += dy;

        shape.x2 += dx;
        shape.y2 += dy;
      }

      else if (shape.type === "pencil") {

        shape.points.forEach(
          (point) => {

            point.x += dx;
            point.y += dy;

          }
        );
      }

      else if (shape.type === "text") {

        shape.x += dx;
        shape.y += dy;
      }

      dragStartX.current = worldX;
      dragStartY.current = worldY;

      redrawCanvas(
        ctxRef.current,
        canvasRef.current,
        shapesRef.current,
        selectedShapeIndex.current,
        cameraX.current,
        cameraY.current,
        cameraScale.current,
        showGrid
      );

      return;
    }

     if (selectedTool === "eraser" && isErasing.current) {

      eraseAtPoint(
        worldX,
        worldY,
        shapesRef,
        ctxRef,
        canvasRef,
        cameraX,
        cameraY,
        cameraScale,
        showGrid,
        getSocket(),
        roomId
      );

      return;
    }

    if (!isDrawing.current) return;

    if (
      selectedTool !== "rectangle" &&
      selectedTool !== "circle" &&
      selectedTool !== "line" &&
      selectedTool !== "arrow" &&
      selectedTool !== "diamond" &&
      selectedTool !== "pencil"
    ) {
      return;
    }

    const width = worldX - startX.current;

    const height = worldY - startY.current;

    ctxRef.current.strokeStyle = drawingPencil;

    ctxRef.current.lineWidth = 2;

    redrawCanvas(
      ctxRef.current,
      canvasRef.current,
      shapesRef.current,
      selectedShapeIndex.current,
      cameraX.current,
      cameraY.current,
      cameraScale.current,
      showGrid
    );

    ctxRef.current.save();

    ctxRef.current.translate(
      cameraX.current,
      cameraY.current
    );

    ctxRef.current.scale(
      cameraScale.current,
      cameraScale.current
    );



    if (selectedTool === "rectangle") {

      drawRectangle(
        ctxRef.current,
        {
          x: startX.current,
          y: startY.current,
          width,
          height,
        }
      );
    }

    else if (
      selectedTool === "circle"
    ) {

      drawCircle(
        ctxRef.current,
        {
          x: startX.current,
          y: startY.current,
          width,
          height,
        }
      );
    }

    else if (
      selectedTool === "line"
    ) {

      drawLine(
        ctxRef.current,
        {
          x1: startX.current,
          y1: startY.current,
          x2: worldX,
          y2: worldY,
        }
      );
    }

    else if (
      selectedTool === "arrow"
    ) {

      drawArrow(
        ctxRef.current,
        {
          x1: startX.current,
          y1: startY.current,
          x2: worldX,
          y2: worldY,
        }
      );
    }

    else if (
      selectedTool === "diamond"
    ) {

      drawDiamond(
        ctxRef.current,
        {
          x: startX.current,
          y: startY.current,
          width,
          height,
        }
      );
    }

    else if (
      selectedTool === "pencil"
    ) {

      currentPath.current.points.push({
        x: worldX,
        y: worldY,
      });

     
      drawPencil(
        ctxRef.current,
        currentPath.current
      );
    }
    ctxRef.current.restore();
  };


  const handleMouseUp = (e) => {



    const wasDrawing = isDrawing.current;
    isDrawing.current = false;
    isPanning.current = false;

    if (canvasRef.current) {
      canvasRef.current.style.cursor = resolveBaseCursor(selectedTool, canDraw);
    }
    saveCameraPosition();
    
    const { x, y } = getMousePos(
      e,
      canvasRef.current
    );

    const { worldX, worldY } = screenToWorld(
      x,
      y,
      cameraX.current,
      cameraY.current,
      cameraScale.current
    );

    if (isTemporaryPanning.current) {

      isTemporaryPanning.current = false;
      saveCameraPosition();

      return;
    }

    // Eraser
    if (selectedTool === "eraser") {

      isErasing.current = false;

     
      triggerAutoSave();

      if (!isToolLocked) {
        setSelectedTool("mousePointer");
      }

      return;
    }

    // Mouse Pointer
    if (selectedTool === "mousePointer") {

      redrawCanvas(
        ctxRef.current,
        canvasRef.current,
        shapesRef.current,
        selectedShapeIndex.current,
        cameraX.current,
        cameraY.current,
        cameraScale.current,
        showGrid
      );

      if (
        (isDragging.current || isResizing.current) &&
        selectedShapeIndex.current !== null
      ) {
        triggerAutoSave();

        const updatedShape = shapesRef.current[selectedShapeIndex.current];
        const socket = getSocket();

        if (socket?.readyState === WebSocket.OPEN) {
          socket.send(
            JSON.stringify({
              type: "shape-updated",
              roomId: roomId,
              shape: updatedShape,
            })
          );
        }
      }

      isDragging.current = false;
      isResizing.current = false;
      resizeHandle.current = null;

      return;
    }

    const width =
      worldX - startX.current;

    const height =
      worldY - startY.current;

    if (
      selectedTool !== "rectangle" &&
      selectedTool !== "circle" &&
      selectedTool !== "line" &&
      selectedTool !== "arrow" &&
      selectedTool !== "diamond" &&
      selectedTool !== "pencil" &&
      selectedTool !== "text"
    ) {
      return;
    }

    let shape = null;

    // Rectangle / Circle / Diamond
    if (
      selectedTool === "rectangle" ||
      selectedTool === "circle" ||
      selectedTool === "diamond"
    ) {

      shape = {
        type: selectedTool,
        x: startX.current,
        y: startY.current,
        width,
        height,
      };
    }

    // Line / Arrow
    else if (
      selectedTool === "line" ||
      selectedTool === "arrow"
    ) {

      shape = {
        type: selectedTool,
        x1: startX.current,
        y1: startY.current,
        x2: worldX,
        y2: worldY,
      };
    }

    // Pencil
    else if (
      selectedTool === "pencil"
    ) {

      shape = currentPath.current;
    }



    if (shape) {
      const tiny = (n) => Math.abs(n) < 2;

      if (
        (selectedTool === "rectangle" ||
          selectedTool === "circle" ||
          selectedTool === "diamond") &&
        tiny(shape.width) &&
        tiny(shape.height)
      ) {
        shape = null;
      } else if (
        (selectedTool === "line" || selectedTool === "arrow") &&
        tiny(shape.x2 - shape.x1) &&
        tiny(shape.y2 - shape.y1)
      ) {
        shape = null;
      } else if (
        selectedTool === "pencil" &&
        (!shape.points || shape.points.length < 2)
      ) {
        shape = null;
      }
    }

    if (shape && wasDrawing && canDraw) {
      if (!shape.clientId) {
        shape.clientId = crypto.randomUUID();
      }
      shapesRef.current.push(shape);

      const socket = getSocket();

      if (socket?.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            type: "shape-created",
            roomId: roomId,
            shape,
          })
        );
      }

      triggerAutoSave();
    }


    

    redrawCanvas(
      ctxRef.current,
      canvasRef.current,
      shapesRef.current,
      selectedShapeIndex.current,
      cameraX.current,
      cameraY.current,
      cameraScale.current,
      showGrid
    );

    if (!isToolLocked) {
      setSelectedTool(
        "mousePointer"
      );
    }
  };


  const handleWheel = (e) => {
    e.preventDefault();

    const { x, y } = getMousePos(
      e,
      canvasRef.current
    );

    const worldXBefore =
      (x - cameraX.current) /
      cameraScale.current;

    const worldYBefore =
      (y - cameraY.current) /
      cameraScale.current;

    if (e.deltaY < 0) {
      cameraScale.current *= 1.1;
    } else {
      cameraScale.current *= 0.9;
    }

    cameraScale.current = Math.max(
      0.2,
      Math.min(cameraScale.current, 3)
    );

    cameraX.current =
      x -
      worldXBefore *
      cameraScale.current;

    cameraY.current =
      y -
      worldYBefore *
      cameraScale.current;

    redrawCanvas(
      ctxRef.current,
      canvasRef.current,
      shapesRef.current,
      selectedShapeIndex.current,
      cameraX.current,
      cameraY.current,
      cameraScale.current,
      showGridRef.current
    );
    saveCameraPosition();
  };



  return (
    <div className="relative w-screen h-screen">
      


      <canvas
        ref={canvasRef}
        data-theme={theme}
        style={{ background: theme }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />

      <canvas
        ref={overlayCanvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "none",
        }}
      />

      {isTyping && (
        <>

          <textarea
            autoFocus
            value={textValue}
            onChange={(e) =>
              setTextValue(e.target.value)
            }

            onKeyDown={(e) => {

              if (e.key === "Enter") {

                e.preventDefault();

                if (!textValue.trim()) {
                  setTextValue("");
                  setIsTyping(false);
                  return;
                }

                const textShape = {
                  type: "text",
                  clientId: crypto.randomUUID(),
                  x: textPosition.x,
                  y: textPosition.y,
                  text: textValue,
                  fontSize: 24,
                  fillColor: drawingPencil,
                };

                shapesRef.current.push(textShape);

                triggerAutoSave();

                const socket = getSocket();

                if (socket?.readyState === WebSocket.OPEN) {
                  socket.send(
                    JSON.stringify({
                      type: "shape-created",
                      roomId: roomId,
                      shape: textShape,
                    })
                  );
                }

                redrawCanvas(
                  ctxRef.current,
                  canvasRef.current,
                  shapesRef.current,
                  selectedShapeIndex.current,
                  cameraX.current,
                  cameraY.current,
                  cameraScale.current,
                  showGrid
                );

                setTextValue("");
                setIsTyping(false);
              }
            }}

            style={{
              position: "absolute",
              left: textScreenPosition.x,
              top: textScreenPosition.y,
              background: "transparent",
              color: "white",
              border: "none",
              outline: "none",
              resize: "none",
              overflow: "hidden",
              fontSize: "24px",
              zIndex: 100,
              color: drawingPencil,
            }}
          />
        </>
      )}

    </div>
  );
};


export default memo(Canvas);