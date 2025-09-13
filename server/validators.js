import { z } from "zod";

// Common
export const loginSchema = z.object({
  role: z.enum(["patient","doctor","hospital","pharmacist"]),
  identifier: z.string().min(3),        // email or phone
  password: z.string().min(6)
});

// Per-role payloads (mirror your placeholders)
export const patientReg = z.object({
  name: z.string().min(2),
  phone: z.string().min(6),
  email: z.string().email(),
  address: z.string().min(2),
  blood_group: z.enum(["A+","A-","B+","B-","AB+","AB-","O+","O-"]),
  password: z.string().min(6),
  confirm_password: z.string().min(6)
}).refine(d=>d.password===d.confirm_password,{path:["confirm_password"],message:"Passwords do not match"});

export const doctorReg = z.object({
  name: z.string().min(2),
  phone: z.string().min(6),
  email: z.string().email(),
  address: z.string().min(2),
  degree: z.string().min(2),
  specialization: z.string().min(2),
  registration_no: z.string().min(2),
  password: z.string().min(6),
  confirm_password: z.string().min(6)
}).refine(d=>d.password===d.confirm_password,{path:["confirm_password"],message:"Passwords do not match"});

export const hospitalReg = z.object({
  name: z.string().min(2),
  phone: z.string().min(6),
  email: z.string().email(),
  address: z.string().min(2),
  hospital_type: z.string().min(3), // "government" | "private" | "clinic" (free text per your schema)
  bed_number: z.coerce.number().int().nonnegative(),
  password: z.string().min(6),
  confirm_password: z.string().min(6)
}).refine(d=>d.password===d.confirm_password,{path:["confirm_password"],message:"Passwords do not match"});

export const pharmacistReg = z.object({
  name: z.string().min(2),
  phone: z.string().min(6),
  email: z.string().email(),
  address: z.string().min(2),
  license_no: z.string().min(2),
  password: z.string().min(6),
  confirm_password: z.string().min(6)
}).refine(d=>d.password===d.confirm_password,{path:["confirm_password"],message:"Passwords do not match"});
