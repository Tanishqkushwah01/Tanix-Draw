import mongoose from "mongoose";

const shapeSchema = new mongoose.Schema(
  {
    canvasId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Canvas",
      required: true,
      index: true,
    },
    clientId: {
      type: String,
    },

    type: {
      type: String,
      required: true,
      enum: [
        "rectangle",
        "circle",
        "diamond",
        "line",
        "arrow",
        "pencil",
        "text",
      ],
    },

    x: Number,
    y: Number,

    width: Number,
    height: Number,

    radius: Number,

    x1: Number,
    y1: Number,
    x2: Number,
    y2: Number,

    points: [
      {
        x: Number,
        y: Number,
      },
    ],

    text: String,

    strokeColor: {
      type: String,
      default: "#FFFFFF",
    },

    fillColor: {
      type: String,
      default: "transparent",
    },

    strokeWidth: {
      type: Number,
      default: 2,
    },

    fontSize: {
      type: Number,
      default: 20,
    },

    fontFamily: {
      type: String,
      default: "Arial",
    },
  },
  {
    timestamps: true,
  }
);


const ShapeModel = mongoose.model("Shape", shapeSchema);
export default ShapeModel;