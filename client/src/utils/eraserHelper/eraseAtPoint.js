import isShapeHit from "./isShapeHit";
import redrawCanvas from "../redrawCanvas";

const eraseAtPoint = (
    x,
    y,
    shapesRef,
    ctxRef,
    canvasRef,
    cameraX,
    cameraY,
    cameraScale,
    showGrid,
    socket,
    roomId
) => {
    try {

        let deleted = false;
        let deletedShapeId = null;

        for (let i = shapesRef.current.length - 1; i >= 0; i--) {
            if (isShapeHit(x, y, shapesRef.current[i])) {
                deletedShapeId =
                    shapesRef.current[i].clientId || shapesRef.current[i]._id;

                shapesRef.current.splice(i, 1);
                deleted = true;
                break;  
            }
        }

        if (deleted) {

            if (deletedShapeId && socket?.readyState === WebSocket.OPEN) {
                socket.send(
                    JSON.stringify({
                        type: "shape-deleted",
                        roomId,
                        shapeId: deletedShapeId,
                    })
                );
            }

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
        }

    } catch (err) {
        console.error(err);
    }
};

export default eraseAtPoint;