import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import connectDB from "./config/db.js";
import { isAllowedOrigin } from "./config/cors.js";


const app = express();

if (process.env.TRUST_PROXY === "true") {
  app.set("trust proxy", 1);
}

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || isAllowedOrigin(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,  
  })
);

app.use((req, res, next) => {
  const isSafeMethod = ["GET", "HEAD", "OPTIONS"].includes(req.method);
  const origin = req.headers.origin;

  if (!isSafeMethod && origin && !isAllowedOrigin(origin)) {
    return res.status(403).json({ success: false, message: "Forbidden origin" });
  }
  next();
});
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

 connectDB();


import userRouter from "./routes/user.router.js";
import canvasRouter from "./routes/cavas.router.js";
import shapeRouter from "./routes/shape.router.js";
import setupWebSocket from "./sockets/socket.js";


app.get("/health", (req, res) => res.status(200).send("ok"));

app.use("/api/auth",userRouter);

app.use('/api/canvas',canvasRouter);

app.use("/api/shapes",shapeRouter);




const server = http.createServer(app);

setupWebSocket(server);

server.listen(process.env.PORT);