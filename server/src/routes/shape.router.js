import express from "express";
import  authMiddleware  from "../middleware/auth.middleware.js";
import * as shapeController from "../controllers/shape.controller.js";

const router = express.Router();

router.put("/:canvasId", authMiddleware, shapeController.updateShapes);

export default router;