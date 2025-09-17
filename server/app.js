// server/app.js
import express from "express";
import cors from "cors";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.routes.js";
import patientRoutes from "./routes/patient.routes.js";

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Static uploads
const UPLOADS_ROOT = path.join(__dirname, "uploads");
fs.mkdirSync(UPLOADS_ROOT, { recursive: true });
app.use("/uploads", express.static(UPLOADS_ROOT));

// Health
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Routes
app.use("/api", authRoutes);
app.use("/api", patientRoutes);

// Multer + generic error handler
app.use((err, _req, res, next) => {
  if (err?.name === "MulterError") {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({ error: "Max 3MB allowed" });
    }
    return res.status(400).json({ error: err.message });
  }
  if (err?.message && /Only .* allowed/i.test(err.message)) {
    return res.status(400).json({ error: err.message });
  }
  next(err);
});

export default app;
