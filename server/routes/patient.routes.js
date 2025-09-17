// server/routes/patient.routes.js
import { Router } from "express";
import bcrypt from "bcrypt";
import multer from "multer";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "url";

import { pool } from "../db.js";
import { requireAuth } from "../auth.js";
import { patientReg, bimaUpsert, healthSnapshot } from "../validators.js";

const router = Router();

/* ---------- Paths for uploads ---------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_ROOT = path.join(__dirname, "..", "uploads");
const AVATAR_DIR = path.join(UPLOADS_ROOT, "avatars");
fs.mkdirSync(AVATAR_DIR, { recursive: true });

/* ---------- Helpers ---------- */
const byEmailOrPhone = (table) =>
  `SELECT * FROM ${table} WHERE email = ? OR phone = ? LIMIT 1`;

// IMPORTANT: map "" -> null (not 0)
const toNumOrNull = (v) => {
  if (v === undefined || v === null) return null;
  if (typeof v === "string" && v.trim() === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

/* ---------- Multer ---------- */
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, AVATAR_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || ".jpg");
    const uid = req.user?.sub || "anon";
    cb(null, `patient-${uid}-${Date.now()}${ext}`);
  },
});
const fileFilter = (_req, file, cb) => {
  const t = (file.mimetype || "").toLowerCase();
  const ok = ["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(t);
  cb(ok ? null : new Error("Only PNG/JPEG/WebP allowed"), ok);
};
const uploadAvatar = multer({
  storage,
  fileFilter,
  limits: { fileSize: 3 * 1024 * 1024 },
});

/* ====================================================================
   Patient Register + Profile
   ==================================================================== */
router.post("/patient/register", async (req, res) => {
  const parsed = patientReg.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { name, phone, email, address, blood_group, password } = parsed.data;

  try {
    const [exists] = await pool.query(byEmailOrPhone("patient_users"), [email, phone]);
    if (exists.length) return res.status(409).json({ error: "Email or phone already exists" });

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

router.get("/patient/me", requireAuth, async (req, res) => {
  try {
    if (req.user.role !== "patient") return res.status(403).json({ error: "Forbidden" });
    const [rows] = await pool.query(
      `SELECT id, name, phone, email, address, blood_group, avatar_url
         FROM patient_users WHERE id = ? LIMIT 1`,
      [req.user.sub]
    );
    if (!rows.length) return res.status(404).json({ error: "Not found" });
    res.json({ profile: rows[0] });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/patient/me", requireAuth, async (req, res) => {
  try {
    if (req.user.role !== "patient") return res.status(403).json({ error: "Forbidden" });
    const { name, phone, email, address, blood_group } = req.body || {};

    if (email || phone) {
      const [dupe] = await pool.query(
        `SELECT id FROM patient_users WHERE (email = ? OR phone = ?) AND id <> ? LIMIT 1`,
        [email || "", phone || "", req.user.sub]
      );
      if (dupe.length) return res.status(409).json({ error: "Email or phone already in use" });
    }

    await pool.query(
      `UPDATE patient_users
         SET name = COALESCE(?, name),
             phone = COALESCE(?, phone),
             email = COALESCE(?, email),
             address = COALESCE(?, address),
             blood_group = COALESCE(?, blood_group)
       WHERE id = ?`,
      [name, phone, email, address, blood_group, req.user.sub]
    );

    const [rows] = await pool.query(
      `SELECT id, name, phone, email, address, blood_group, avatar_url
         FROM patient_users WHERE id = ? LIMIT 1`,
      [req.user.sub]
    );
    res.json({ profile: rows[0], message: "Profile updated" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

router.post(
  "/patient/me/avatar",
  requireAuth,
  uploadAvatar.single("avatar"),
  async (req, res) => {
    try {
      if (req.user.role !== "patient") return res.status(403).json({ error: "Forbidden" });
      if (!req.file) return res.status(400).json({ error: "No file uploaded" });

      const publicPath = `/uploads/avatars/${req.file.filename}`;
      await pool.query(`UPDATE patient_users SET avatar_url = ? WHERE id = ?`, [
        publicPath,
        req.user.sub,
      ]);
      res.json({ avatar_url: publicPath, message: "Avatar updated" });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Server error" });
    }
  }
);

router.put("/patient/me/password", requireAuth, async (req, res) => {
  try {
    if (req.user.role !== "patient") return res.status(403).json({ error: "Forbidden" });
    const { current_password, new_password } = req.body || {};
    if (!current_password || !new_password) return res.status(400).json({ error: "Missing fields" });

    const [rows] = await pool.query(`SELECT password_hash FROM patient_users WHERE id = ?`, [
      req.user.sub,
    ]);
    if (!rows.length) return res.status(404).json({ error: "Not found" });

    const ok = await bcrypt.compare(current_password, rows[0].password_hash);
    if (!ok) return res.status(401).json({ error: "Current password wrong" });

    const hash = await bcrypt.hash(new_password, 10);
    await pool.query(`UPDATE patient_users SET password_hash = ? WHERE id = ?`, [
      hash,
      req.user.sub,
    ]);
    res.json({ message: "Password changed" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

/* ====================================================================
   Bima (Insurance)
   ==================================================================== */
router.get("/patient/bima", requireAuth, async (req, res) => {
  try {
    if (req.user.role !== "patient") return res.status(403).json({ error: "Forbidden" });

    const [rows] = await pool.query(
      `SELECT id, provider, policy_no, status, DATE_FORMAT(valid_till, '%Y-%m-%d') AS valid_till
         FROM patient_bima WHERE patient_id = ? LIMIT 1`,
      [req.user.sub]
    );
    res.json({ bima: rows[0] || null });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/patient/bima", requireAuth, async (req, res) => {
  try {
    if (req.user.role !== "patient") return res.status(403).json({ error: "Forbidden" });

    const parsed = bimaUpsert.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const { provider, policy_no, status, valid_till } = parsed.data;

    const [exists] = await pool.query(
      `SELECT id FROM patient_bima WHERE patient_id = ? LIMIT 1`,
      [req.user.sub]
    );

    if (exists.length) {
      await pool.query(
        `UPDATE patient_bima SET provider=?, policy_no=?, status=?, valid_till=? WHERE patient_id=?`,
        [provider, policy_no, status, valid_till || null, req.user.sub]
      );
    } else {
      await pool.query(
        `INSERT INTO patient_bima (patient_id, provider, policy_no, status, valid_till)
         VALUES (?,?,?,?,?)`,
        [req.user.sub, provider, policy_no, status, valid_till || null]
      );
    }

    const [rows] = await pool.query(
      `SELECT id, provider, policy_no, status, DATE_FORMAT(valid_till, '%Y-%m-%d') AS valid_till
         FROM patient_bima WHERE patient_id = ? LIMIT 1`,
      [req.user.sub]
    );
    res.json({ bima: rows[0], message: "Bima saved" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

/* ====================================================================
   Health History (BMI/BP/Age/Wt/Ht)
   ==================================================================== */
router.get("/patient/health/history", requireAuth, async (req, res) => {
  try {
    if (req.user.role !== "patient") return res.status(403).json({ error: "Forbidden" });
    const limit = Math.min(Math.max(parseInt(req.query.limit || "50", 10), 1), 200);

    const [rows] = await pool.query(
      `SELECT id, patient_id, age, height_cm, weight_kg, bp_sys, bp_dia, bmi, recorded_at
         FROM patient_health_history
        WHERE patient_id = ?
        ORDER BY recorded_at DESC, id DESC
        LIMIT ?`,
      [req.user.sub, limit]
    );
    res.json({ history: rows });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/patient/health/snapshot", requireAuth, async (req, res) => {
  try {
    if (req.user.role !== "patient") return res.status(403).json({ error: "Forbidden" });

    // normalize numbers: "" -> null, valid numbers remain numbers
    const payload = {
      age: toNumOrNull(req.body.age),
      height_cm: toNumOrNull(req.body.height_cm),
      weight_kg: toNumOrNull(req.body.weight_kg),
      bp_sys: toNumOrNull(req.body.bp_sys),
      bp_dia: toNumOrNull(req.body.bp_dia),
    };

    const parsed = healthSnapshot.safeParse(payload);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }

    const { age, height_cm, weight_kg, bp_sys, bp_dia } = parsed.data;

    // Guard BMI against zero/empty height
    let bmi = null;
    if (height_cm != null && weight_kg != null && Number(height_cm) > 0 && Number(weight_kg) > 0) {
      const m = Number(height_cm) / 100;
      bmi = Math.round((Number(weight_kg) / (m * m)) * 10) / 10;
    }

    const [ins] = await pool.query(
      `INSERT INTO patient_health_history
       (patient_id, age, height_cm, weight_kg, bp_sys, bp_dia, bmi)
       VALUES (?,?,?,?,?,?,?)`,
      [req.user.sub, age, height_cm, weight_kg, bp_sys, bp_dia, bmi]
    );

    const [rows] = await pool.query(
      `SELECT id, patient_id, age, height_cm, weight_kg, bp_sys, bp_dia, bmi, recorded_at
         FROM patient_health_history WHERE id = ? LIMIT 1`,
      [ins.insertId]
    );

    return res.status(201).json({ snapshot: rows[0] });
  } catch (e) {
    console.error("Health snapshot insert failed:", e?.sqlMessage || e?.message, e);
    return res.status(500).json({ error: e?.sqlMessage || e?.message || "Server error" });
  }
});

router.delete("/patient/health/snapshot/:id", requireAuth, async (req, res) => {
  try {
    if (req.user.role !== "patient") return res.status(403).json({ error: "Forbidden" });
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: "Invalid id" });

    const [del] = await pool.query(
      `DELETE FROM patient_health_history WHERE id = ? AND patient_id = ?`,
      [id, req.user.sub]
    );
    if (del.affectedRows === 0) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
