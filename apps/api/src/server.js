import express from "express";
import cors from "cors";
import http from "http";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import env from "./config/env.js";
import authRoutes from "./routes/auth/authRoutes.js";
import userRoutes from "./routes/users/userRoutes.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";
import { createSocketServer } from "./sockets/socketServer.js";

const app = express();
const server = http.createServer(app);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const upload = multer({ dest: path.join(__dirname, "../uploads") });

app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime(), timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(201).json({
    file: {
      originalName: req.file?.originalname,
      mimetype: req.file?.mimetype,
      size: req.file?.size,
      localPath: req.file?.filename,
    },
  });
});

app.use(errorMiddleware);
createSocketServer(server, env.clientUrl);

server.listen(env.port, () => {
  console.log(`API server running on http://localhost:${env.port}`);
});
