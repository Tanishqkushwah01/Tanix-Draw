import mongoose from "mongoose";

const canvasSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    roomId: {
      type: String,
      required: true,
      unique: true,
    },

    joinCode: {
      type: String,
      required: true,
    },

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    canvasTheme: {
      type: String,
      enum: ["paper", "dark"],
      default: "paper",
    },
    
    tag: {
      type: String,
      default: "GENERAL",
    },

    cardColor: {
      type: String,
      default: "#f5c4be",
    },

    showGrid: {
      type: Boolean,
      default: true,
    },

    cameraX: {
      type: Number,
      default: 0,
    },

    cameraY: {
      type: Number,
      default: 0,
    },

    cameraScale: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);


const canvasModel = mongoose.model("Canvas", canvasSchema);

export default canvasModel;