import { UserRole } from "$/db/generated/enums.js";
import { z } from "zod";

// --- Profile Schemas ---
const admin_profile_Schema = z.object({
  name: z.string(),
  email: z.email().optional(),
});

const accountant_profile_schema = z.object({
  name: z.string(),
});

const teacher_profile_schema = z.object({
  name: z.string(),
  email: z.string().optional(),
  degree: z.string().optional(),
  indexNumber: z.string().optional(),
  designation: z.string().optional(),
  joiningDate: z.string().optional(),
});

const parent_profile_schema = z.object({
  name: z.string(),
  email: z.string().email().optional(),
});

const student_profile_schema = z.object({
  name: z.string(),
  rollNo: z.number(),
  dateOfBirth: z.string().datetime(),
  gender: z.string(),
  bloodGroup: z.string().optional(),
  address: z.string().optional(),
  classId: z.string(),
  sectionId: z.string(),
});

const rawSchoolName = process.env.SCHOOL_NAME;
if (!rawSchoolName) {
  throw new Error("Environment variable SCHOOL_NAME is not defined.");
}
const SCHOOL_NAME = rawSchoolName.trim().toUpperCase();

const usernamePattern = new RegExp(`^${SCHOOL_NAME}-\\d+$`);

// --- User Schema ---
export const create_user_schema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .regex(
      usernamePattern,
      `Username must follow the format: ${SCHOOL_NAME}-<number> (e.g. ${SCHOOL_NAME}-101)`
    ),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Za-z]/, "Password must contain at least one letter")
    .regex(/\d/, "Password must contain at least one number"),

  role: z.enum(["ADMIN", "SUPER_ADMIN", "TEACHER", "STUDENT", "PARENT"], {
    message:
      "Role must be one of: ADMIN, SUPER_ADMIN, TEACHER, STUDENT, PARENT",
  }),
});

export const login_user_schema = z.object({
  username: z.string().min(1, "Username is required"),

  password: z.string().min(1, "Password is required"),
});

export type TCreate_user_schema = z.infer<typeof create_user_schema>;

export type TLogin_user_schema = z.infer<typeof login_user_schema>;
