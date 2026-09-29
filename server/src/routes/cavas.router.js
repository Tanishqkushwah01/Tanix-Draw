import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import * as canvasController from "../controllers/canvas.controller.js";
const router = express.Router();

router.post("/", authMiddleware, canvasController.createCanvas);

router.get("/", authMiddleware, canvasController.getMyCanvases);

router.get("/:id", authMiddleware, canvasController.getCanvasById);

router.post("/request-join", authMiddleware, canvasController.requestJoinRoom);

router.get(  "/join-request/:requestId",  authMiddleware,  canvasController.getJoinRequestStatus);



router.put("/:id", authMiddleware, canvasController.updateCanvas);

router.delete("/:id", authMiddleware, canvasController.deleteCanvas);

export default router;