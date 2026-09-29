import mongoose from "mongoose";
import shapeModel from "../models/shape.model.js";
import canvasModel from "../models/canvas.model.js";
import { getRoom } from "../sockets/roomManager.js";


export const updateShapes = async (req, res) => {
  try {
    const { canvasId } = req.params;
    const { shapes } = req.body;

     
    if (!mongoose.Types.ObjectId.isValid(canvasId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid canvas ID",
      });
    }

     
    if (!Array.isArray(shapes)) {
      return res.status(400).json({
        success: false,
        message: "Shapes must be an array",
      });
    }

     
    const canvas = await canvasModel.findById(canvasId);

    if (!canvas) {
      return res.status(404).json({
        success: false,
        message: "Canvas not found",
      });
    }

     
    const isOwner = canvas.ownerId.toString() === req.userId;

    let canEdit = isOwner;

    if (!canEdit) {
      const room = getRoom(canvas.roomId);
      const member = room?.users?.get(req.userId);
      canEdit = member?.permission === "editor";
    }

    if (!canEdit) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

     
    const isSavedShape = (shape) =>
      shape._id && mongoose.Types.ObjectId.isValid(shape._id);

    const existingShapeIds = shapes
      .filter(isSavedShape)
      .map((shape) => shape._id);

     
    const incomingClientIds = shapes
      .filter((shape) => !isSavedShape(shape) && shape.clientId)
      .map((shape) => shape.clientId);

    const clientIdToDbId = new Map();

    if (incomingClientIds.length > 0) {
      const found = await shapeModel
        .find({ canvasId, clientId: { $in: incomingClientIds } })
        .select("_id clientId")
        .lean();

      found.forEach((doc) => clientIdToDbId.set(doc.clientId, doc._id));
    }

     
    const handledClientIds = new Set();
    const matchedShapeIds = [];
    const operations = [];

    for (const shape of shapes) {
      const { _id, canvasId: ignoredCanvasId, ...shapeData } = shape;

      if (isSavedShape(shape)) {
        operations.push({
          updateOne: {
            filter: { _id: _id, canvasId: canvasId },
            update: { $set: shapeData },
          },
        });
        continue;
      }

      if (shape.clientId) {
        if (handledClientIds.has(shape.clientId)) continue;
        handledClientIds.add(shape.clientId);

        const dbId = clientIdToDbId.get(shape.clientId);

        if (dbId) {
          matchedShapeIds.push(dbId);
          operations.push({
            updateOne: {
              filter: { _id: dbId, canvasId: canvasId },
              update: { $set: shapeData },
            },
          });
          continue;
        }
      }

      operations.push({
        insertOne: {
          document: { ...shapeData, canvasId: canvasId },
        },
      });
    }

    
    let bulkResult = null;

    if (operations.length > 0) {
      bulkResult = await shapeModel.bulkWrite(
        operations
      );
    }

   
    const insertedShapeIds = bulkResult
      ? Object.values(
        bulkResult.insertedIds || {}
      )
      : [];

     
    const savedShapeIds = [
      ...existingShapeIds,
      ...matchedShapeIds,
      ...insertedShapeIds,
    ];

    
     
    await shapeModel.deleteMany({
      canvasId: canvasId,
      _id: {
        $nin: savedShapeIds,
      },
    });

    
    const updatedShapes = await shapeModel
      .find({
        canvasId: canvasId,
      })
      .sort({
        zIndex: 1,
        createdAt: 1,
      });

     
    return res.status(200).json({
      success: true,
      message: "Shapes saved successfully",
      shapes: updatedShapes,
    });

  } catch (error) {
    console.error(
      "Update Shapes Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};