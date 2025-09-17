// server/server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "node:path";
import fsp from "node:fs/promises";
import { fileURLToPath } from "url";
import app from "./app.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function start() {
  const port = Number(process.env.PORT) || 4000;
  const isProd = process.env.NODE_ENV === "production";
  // repo root (where index.html lives)
  const projectRoot = path.resolve(__dirname, "..");

  if (!isProd) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      root: projectRoot,
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(vite.middlewares);

    // Serve SPA via Vite for non-API paths
    app.use(async (req, res, next) => {
      if (req.originalUrl.startsWith("/api")) return next();
      try {
        const indexPath = path.join(projectRoot, "index.html");
        let html = await fsp.readFile(indexPath, "utf-8");
        html = await vite.transformIndexHtml(req.originalUrl, html);
        res.status(200).setHeader("Content-Type", "text/html").end(html);
      } catch (e) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    // Serve built files in prod
    const dist = path.join(projectRoot, "dist");
    app.use(express.static(dist));
    app.get(/^\/(?!api).*/, (_req, res) => {
      res.sendFile(path.join(dist, "index.html"));
    });
  }

  app.listen(port, () => {
    console.log(`✅ App (API + UI) listening on http://localhost:${port}`);
  });
}

start();
