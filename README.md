# 🏥 ShasthyoShohay — AI-powered Healthcare Support System

A web app where **patients, doctors, hospitals, and pharmacies** connect in one place.  
বাংলায় সহজ অভিজ্ঞতা — **উপসর্গ বিশ্লেষণ, ডাক্তার খোঁজ, জরুরি সহায়তা, প্রেসক্রিপশন ম্যানেজমেন্ট**—সব এক প্ল্যাটফর্মে।

---

## ⚡ Quick Start (TL;DR)
Minimal things you need to run **UI + API on one port (4000)** with MySQL.

### 1) `.env` (root)
```bash
# Server
PORT=4000
JWT_SECRET=replace_with_a_long_random_string

# MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=shasthyo
```

### 2) MySQL bootstrap (very small)
```sql
-- Create database (adjust name if you like)
CREATE DATABASE IF NOT EXISTS shasthyo
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE shasthyo;
```

> Full table schema is provided further below in **Database Schema (MySQL)**. Run that after the bootstrap.

### 3) Install & Run
```bash
npm install
npm run dev           # http://localhost:4000  (Express + Vite single port)
# Production-like:
npm run build
npm run preview       # http://localhost:4000  (serves dist/ + API)
```

---

## 🚀 Features

### 👤 Patient
- AI Symptom Checker (chat + analysis)  
- Doctor search (filters + map)  
- Upload prescriptions & compare medicine prices  
- Daily medicine reminders  
- Medical records vault  
- Personalized health tips

### 👨‍⚕️ Doctor
- Today’s appointments  
- Live emergency support (video call)  
- Access patient reports/prescriptions  
- Create & manage prescriptions  
- Analytics (patient count, follow-ups)

### 🏥 Hospital
- Overview (doctors, patients, beds)  
- Emergency case monitoring  
- Admissions & bed management  
- Doctor schedules & availability  
- Pharmacy + prescription integration  
- Reports (inflow, response time)

### 💊 Pharmacy
- Detect medicines from uploaded prescriptions  
- Brand price comparison  
- Alternative brand suggestions  
- Nearest pharmacy locations

### 🚨 Emergency
- Heart attack/stroke: first-aid guidance, CPR simulation  
- Accident: nearby hospitals with bed/ICU availability  
- Ambulance notifications & tracking  
- On-call doctor video/audio

---

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS v4, React Router v7  
- **Backend:** Node.js (Express 5), Zod (validation), bcrypt, JWT  
- **Database:** MySQL (mysql2)  
- **AI:** Custom service (symptom/prescription analysis)  
- **Maps:** Google Maps API (planned)  
- **RTC:** WebRTC / Twilio (planned)

---

## 📂 Project Structure

```
ShasthyoShohay/
├─ public/                   # static assets
├─ src/                      # React app (only frontend code here)
│  ├─ components/
│  ├─ pages/
│  ├─ chatbot/
│  ├─ main.jsx
│  └─ App.jsx
├─ server/                   # backend (Express + API)
│  ├─ index.js               # Express + Vite middleware (single-port)
│  ├─ db.js                  # MySQL pool
│  ├─ auth.js                # JWT helpers, requireAuth middleware
│  └─ validators.js          # Zod schemas
├─ index.html                # Vite entry
├─ vite.config.js
├─ package.json
├─ .env
└─ README.md
```

---

## 🔧 Scripts (package.json)

```json
{
  "scripts": {
    "dev": "nodemon server/index.js",
    "build": "vite build",
    "preview": "cross-env NODE_ENV=production node server/index.js",
    "lint": "eslint ."
  }
}
```
> On macOS/Linux you can replace `cross-env NODE_ENV=production` with `NODE_ENV=production`.

---

## 🔐 API (Auth & Registration)

All endpoints are served from the **same origin & port (4000)**.

| Method | Endpoint                    | Body (JSON)                                                                 | Notes |
|-------:|-----------------------------|------------------------------------------------------------------------------|------|
| POST   | `/api/patient/register`     | `{ name, phone, email, address, blood_group, password }`                    | Unique `email` & `phone` |
| POST   | `/api/doctor/register`      | `{ name, phone, email, address, degree, specialization, registration_no, password }` | Unique `email`, `phone`, `registration_no` |
| POST   | `/api/hospital/register`    | `{ name, phone, email, address, hospital_type, bed_number, password }`      | `bed_number >= 0` |
| POST   | `/api/pharmacist/register`  | `{ name, phone, email, address, license_no, password }`                     | Unique `email`, `phone`, `license_no` |
| POST   | `/api/auth/login`           | `{ role: 'patient'|'doctor'|'hospital'|'pharmacist', identifier, password }`| `identifier = email OR phone` |
| GET    | `/api/me`                   | —                                                                            | Requires `Authorization: Bearer <JWT>` |

**Response (login success):**
```json
{
  "token": "jwt_token_here",
  "user": { "id": 1, "role": "patient", "name": "John", "email": "x@y.z", "phone": "..." }
}
```

---

## 🗄️ Database Schema (MySQL)

> Run this after you’ve created the database with the small bootstrap above.

```sql
CREATE TABLE patient_users (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name           VARCHAR(100)     NOT NULL,
  phone          VARCHAR(20)      NOT NULL,
  email          VARCHAR(190)     NOT NULL,
  address        VARCHAR(255)     NOT NULL,
  blood_group    ENUM('A+','A-','B+','B-','AB+','AB-','O+','O-') NOT NULL,
  password_hash  VARCHAR(255)     NOT NULL,
  created_at     TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP
                                    ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_patient_email (email),
  UNIQUE KEY uq_patient_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE doctor_users (
  id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name             VARCHAR(100)     NOT NULL,
  phone            VARCHAR(20)      NOT NULL,
  email            VARCHAR(190)     NOT NULL,
  address          VARCHAR(255)     NOT NULL,
  degree           VARCHAR(120)     NOT NULL,
  specialization   VARCHAR(120)     NOT NULL,
  registration_no  VARCHAR(120)     NOT NULL,
  password_hash    VARCHAR(255)     NOT NULL,
  created_at       TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP
                                     ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_doctor_email (email),
  UNIQUE KEY uq_doctor_phone (phone),
  UNIQUE KEY uq_doctor_reg (registration_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE hospital_users (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name           VARCHAR(150)     NOT NULL,
  phone          VARCHAR(20)      NOT NULL,
  email          VARCHAR(190)     NOT NULL,
  address        VARCHAR(255)     NOT NULL,
  hospital_type  VARCHAR(50)      NOT NULL,
  bed_number     INT UNSIGNED     NOT NULL,
  password_hash  VARCHAR(255)     NOT NULL,
  created_at     TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP
                                    ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT chk_beds_nonnegative CHECK (bed_number >= 0),
  UNIQUE KEY uq_hospital_email (email),
  UNIQUE KEY uq_hospital_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE pharmacist_users (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name           VARCHAR(100)     NOT NULL,
  phone          VARCHAR(20)      NOT NULL,
  email          VARCHAR(190)     NOT NULL,
  address        VARCHAR(255)     NOT NULL,
  license_no     VARCHAR(120)     NOT NULL,
  password_hash  VARCHAR(255)     NOT NULL,
  created_at     TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP
                                    ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_pharm_email (email),
  UNIQUE KEY uq_pharm_phone (phone),
  UNIQUE KEY uq_pharm_license (license_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 🧩 Frontend Notes

- Call APIs with **relative URLs** (same origin):
  ```js
  await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role, identifier, password })
  });
  ```
- Store `{ token, user }` in `localStorage` (remember me) or `sessionStorage`.  
- Protect routes by checking token existence/expiry (attach `Authorization: Bearer <token>`).

---

## 🧪 Health Check

- Backend: `GET /api/health` → `{ ok: true }`  
- Browser console quick test:
  ```js
  fetch("/api/health").then(r => r.json())
  ```

---

## 🔒 Security

- Passwords: **bcrypt** hashed  
- Auth: **JWT** via `Authorization: Bearer <token>`  
- Validation: **Zod** on all input  
- Add rate limiting & `helmet` for production

---

## 🗺️ Roadmap

- ✅ Bangla + English UI  
- ✅ Single-port deploy (Express + Vite)  
- ⏳ AI integrations (symptom, Rx analysis)  
- ⏳ Push notifications (reminders)  
- ⏳ Mobile app (React Native)

---

## 📄 License & Disclaimer

This project is for **educational purposes**.  
**Disclaimer:** This is **not medical advice**. For diagnosis or treatment, **consult a licensed physician**.
