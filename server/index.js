// server/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import path from "node:path";
import fs from "node:fs/promises";

import { pool } from "./db.js";
import { signToken, requireAuth } from "./auth.js";
import {
  loginSchema,
  patientReg,
  doctorReg,
  hospitalReg,
  pharmacistReg,
} from "./validators.js";

dotenv.config();

const app = express();

// You can keep CORS; same-origin won’t need it but harmless in dev
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

/* ---------- Helpers ---------- */
const TABLES = {
  patient: { name: "patient_users", id: "id", pass: "password_hash" },
  doctor: { name: "doctor_users", id: "id", pass: "password_hash" },
  hospital: { name: "hospital_users", id: "id", pass: "password_hash" },
  pharmacist: { name: "pharmacist_users", id: "id", pass: "password_hash" },
};
const byEmailOrPhone = (table) =>
  `SELECT * FROM ${table} WHERE email = ? OR phone = ? LIMIT 1`;

/* ---------- Health ---------- */
app.get("/api/health", (req, res) => res.json({ ok: true }));

/* ---------- Register: Patient ---------- */
app.post("/api/patient/register", async (req, res) => {
  const parsed = patientReg.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.flatten() });
  const { name, phone, email, address, blood_group, password } = parsed.data;
  try {
    const [exists] = await pool.query(byEmailOrPhone("patient_users"), [
      email,
      phone,
    ]);
    if (exists.length)
      return res.status(409).json({ error: "Email or phone already exists" });

    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      `INSERT INTO patient_users (name, phone, email, address, blood_group, password_hash)
       VALUES (?,?,?,?,?,?)`,
      [name, phone, email, address, blood_group, hash]
    );
    res.status(201).json({ message: "Patient registered" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

/* ---------- Register: Doctor ---------- */
app.post("/api/doctor/register", async (req, res) => {
  const parsed = doctorReg.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.flatten() });
  const {
    name,
    phone,
    email,
    address,
    degree,
    specialization,
    registration_no,
    password,
  } = parsed.data;
  try {
    const [exists] = await pool.query(byEmailOrPhone("doctor_users"), [
      email,
      phone,
    ]);
    if (exists.length)
      return res.status(409).json({ error: "Email or phone already exists" });

    const [regExists] = await pool.query(
      `SELECT id FROM doctor_users WHERE registration_no = ? LIMIT 1`,
      [registration_no]
    );
    if (regExists.length)
      return res.status(409).json({ error: "Registration number already exists" });

    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      `INSERT INTO doctor_users (name, phone, email, address, degree, specialization, registration_no, password_hash)
       VALUES (?,?,?,?,?,?,?,?)`,
      [name, phone, email, address, degree, specialization, registration_no, hash]
    );
    res.status(201).json({ message: "Doctor registered" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

/* ---------- Register: Hospital ---------- */
app.post("/api/hospital/register", async (req, res) => {
  const parsed = hospitalReg.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.flatten() });
  const { name, phone, email, address, hospital_type, bed_number, password } =
    parsed.data;
  try {
    const [exists] = await pool.query(byEmailOrPhone("hospital_users"), [
      email,
      phone,
    ]);
    if (exists.length)
      return res.status(409).json({ error: "Email or phone already exists" });

    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      `INSERT INTO hospital_users (name, phone, email, address, hospital_type, bed_number, password_hash)
       VALUES (?,?,?,?,?,?,?)`,
      [name, phone, email, address, hospital_type, bed_number, hash]
    );
    res.status(201).json({ message: "Hospital registered" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

/* ---------- Register: Pharmacist ---------- */
app.post("/api/pharmacist/register", async (req, res) => {
  const parsed = pharmacistReg.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.flatten() });
  const { name, phone, email, address, license_no, password } = parsed.data;
  try {
    const [exists] = await pool.query(byEmailOrPhone("pharmacist_users"), [
      email,
      phone,
    ]);
    if (exists.length)
      return res.status(409).json({ error: "Email or phone already exists" });

    const [licExists] = await pool.query(
      `SELECT id FROM pharmacist_users WHERE license_no = ? LIMIT 1`,
      [license_no]
    );
    if (licExists.length)
      return res.status(409).json({ error: "License already exists" });

    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      `INSERT INTO pharmacist_users (name, phone, email, address, license_no, password_hash)
       VALUES (?,?,?,?,?,?)`,
      [name, phone, email, address, license_no, hash]
    );
    res.status(201).json({ message: "Pharmacist registered" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

/* ---------- Login ---------- */
app.post("/api/auth/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.flatten() });

  const { role, identifier, password } = parsed.data;
  const t = TABLES[role];
  try {
    const [rows] = await pool.query(
      `SELECT * FROM ${t.name} WHERE email = ? OR phone = ? LIMIT 1`,
      [identifier, identifier]
    );
    if (!rows.length) return res.status(401).json({ error: "User not found" });

    const user = rows[0];
    const ok = await bcrypt.compare(password, user[t.pass]);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = signToken({ sub: user.id, role });
    res.json({
      token,
      user: {
        id: user.id,
        role,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

/* ---------- Protected example ---------- */
app.get("/api/me", requireAuth, (req, res) => {
  res.json({ me: req.user });
});

async function start() {
  const port = Number(process.env.PORT) || 4000;
  const isProd = process.env.NODE_ENV === "production";
  const projectRoot = process.cwd(); // where index.html lives

  if (!isProd) {
    // DEV: Vite middleware (no '*' routes in Express 5)
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      root: projectRoot,
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(vite.middlewares);

    // SPA fallback for non-/api requests (no path string, so no path-to-regexp issues)
    app.use(async (req, res, next) => {
      if (req.originalUrl.startsWith("/api")) return next();
      try {
        const indexPath = path.join(projectRoot, "index.html");
        let html = await fs.readFile(indexPath, "utf-8");
        html = await vite.transformIndexHtml(req.originalUrl, html);
        res.status(200).setHeader("Content-Type", "text/html").end(html);
      } catch (e) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    // PROD: Serve built assets from /dist and SPA fallback using regex (no '*')
    const dist = path.join(projectRoot, "dist");
    app.use(express.static(dist));
    app.get(/^\/(?!api).*/, (req, res) => {
      res.sendFile(path.join(dist, "index.html"));
    });
  }

  app.listen(port, () => {
    console.log(`✅ App (API + UI) listening on http://localhost:${port}`);
  });
}

start();