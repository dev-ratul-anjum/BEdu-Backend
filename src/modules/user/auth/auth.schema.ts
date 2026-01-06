import { z } from "zod";

const rawSchoolName = process.env.SCHOOL_NAME;
if (!rawSchoolName) {
  throw new Error("Environment variable SCHOOL_NAME is not defined.");
}
const SCHOOL_NAME = rawSchoolName.trim().toUpperCase();

const usernamePattern = new RegExp(`^${SCHOOL_NAME}-\\d+$`);

export const user_schema = z.object({
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
});

export const login_schema = z.object({
  username: z.string().min(1, "Username is required"),

  password: z.string().min(1, "Password is required"),
});

export const guardian_login_schema = z.object({
  phone: z.string().min(1, "Guardian phone number is required"),
});

export type TLogin_schema = z.infer<typeof login_schema>;
export type TGuardian_login_schema = z.infer<typeof guardian_login_schema>;
