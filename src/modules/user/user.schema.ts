import { Role } from "$/db/generated/enums.ts";
import { z } from "zod";

// --- Profile Schemas ---
const adminProfileSchema = z.object({
  name: z.string(),
  email: z.string().email().optional(),
});

const accountantProfileSchema = z.object({
  name: z.string(),
});

const teacherProfileSchema = z.object({
  name: z.string(),
  email: z.string().optional(),
  degree: z.string().optional(),
  indexNumber: z.string().optional(),
  designation: z.string().optional(),
  joiningDate: z.string().optional(),
});

const parentProfileSchema = z.object({
  name: z.string(),
  email: z.string().email().optional(),
});

const studentProfileSchema = z.object({
  name: z.string(),
  rollNo: z.number(),
  dateOfBirth: z.string().datetime(),
  gender: z.string(),
  bloodGroup: z.string().optional(),
  address: z.string().optional(),
  classId: z.string(),
  sectionId: z.string(),
});

// --- User Schema ---
export const createUserSchema = z
  .object({
    username: z.string(),
    password: z.string(),
    role: z.custom<Role>(),

    admin: adminProfileSchema.optional(),
    accountantProfile: accountantProfileSchema.optional(),
    teacherProfile: teacherProfileSchema.optional(),
    studentProfile: studentProfileSchema.optional(),
    parentProfile: parentProfileSchema.optional(),
  })
  .superRefine((data, ctx) => {
    // Role → User model profile field mapping
    const profileByRole = {
      ADMIN: "admin",
      ACCOUNTANT: "accountantProfile",
      TEACHER: "teacherProfile",
      PARENT: "parentProfile",
      STUDENT: "studentProfile",
    } as const;

    const requiredField =
      profileByRole[data.role as keyof typeof profileByRole];

    // Invalid role
    if (!requiredField) {
      ctx.addIssue({
        code: "custom",
        message: "Invalid role",
        path: ["role"],
      });
      return;
    }

    // Required profile missing
    if (!data[requiredField]) {
      ctx.addIssue({
        code: "custom",
        message: `${requiredField} is required for role '${data.role}'`,
        path: [requiredField],
      });
    }

    // Extra profiles forbidden
    const allFields = [
      "admin",
      "accountantProfile",
      "teacherProfile",
      "studentProfile",
      "parentProfile",
    ] as const;

    allFields.forEach((key) => {
      if (key !== requiredField && data[key] != null) {
        ctx.addIssue({
          code: "custom",
          message: `${key} should not be provided for role '${data.role}'`,
          path: [key],
        });
      }
    });
  });

export type TCreateUserSchema = z.infer<typeof createUserSchema>;

export const loginUserSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type TLoginUserSchema = z.infer<typeof loginUserSchema>;
