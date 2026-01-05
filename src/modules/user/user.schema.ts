import { GuardianRelation } from "$/db/generated/enums.js";
import { z } from "zod";

// --- Profile Schemas ---
const super_admin_profile_schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email().optional(),
});

const admin_profile_schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email().optional(),
});

const teacher_profile_schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().optional(),
  degree: z.string().optional(),
  index_number: z.string().optional(),
  designation: z.string().optional(),
  joining_date: z.coerce.date().optional(),
});

const parent_profile_schema = z.object({
  father_name: z.string().min(1, "Father name cannot be empty").optional(),
  father_occupation: z
    .string()
    .min(1, "Father occupation cannot be empty")
    .optional(),
  father_photo: z.string().min(1, "Father photo cannot be empty").optional(),
  father_phone: z.string().min(1, "Father phone cannot be empty").optional(),
  mother_name: z.string().min(1, "Mohther name cannot be empty").optional(),
  mother_occupation: z
    .string()
    .min(1, "Mohther occupation cannot be empty")
    .optional(),
  mother_photo: z.string().min(1, "Mohther photo cannot be empty").optional(),
  mother_phone: z.string().min(1, "Mohther phone cannot be empty").optional(),

  guardian_name: z.string().min(1, "Guardian name cannot be empty").optional(),
  guardian_occupation: z
    .string()
    .min(1, "Guardian occupation cannot be empty")
    .optional(),
  guardian_photo: z
    .string()
    .min(1, "Guardian photo cannot be empty")
    .optional(),
  guardian_phone: z
    .string()
    .min(1, "Guardian phone cannot be empty")
    .optional(),
  guardian_relation: z
    .string()
    .min(1, "Guardian relation cannot be empty")
    .optional(),
  guardian_email: z
    .string()
    .min(1, "Guardian email cannot be empty")
    .optional(),
  guardian_address: z
    .string()
    .min(1, "Guardian address cannot be empty")
    .optional(),
});

// Guardian schema
export const guardian_schema = z.object({
  relation: z.enum(GuardianRelation, {
    error: "Relation must be one of: FATHER, MOTHER, OTHER",
  }),
  phone: z.string().min(1, "Guardian phone number is required"),
  name: z.string().min(1, "Guardian name is required"),
  occupation: z.string().optional(),
});

const rawSchoolName = process.env.SCHOOL_NAME;
if (!rawSchoolName) {
  throw new Error("Environment variable SCHOOL_NAME is not defined.");
}
const SCHOOL_NAME = rawSchoolName.trim().toUpperCase();

const usernamePattern = new RegExp(`^${SCHOOL_NAME}-\\d+$`);

export const profile_by_role = {
  ADMIN: "admin_profile",
  TEACHER: "teacher_profile",
  STUDENT: "student_profile",
} as const;

const user_schema = z.object({
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

const student_profile_schema = z.object({
  first_name: z.string().min(1, "Frist name is required"),
  last_name: z.string().min(1, "Last name is required"),
  roll_no: z.number().optional(),
  date_of_birth: z.coerce.date(),
  addmission_date: z.coerce.date().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"], {
    message: "Gender must be one of: MALE, FEMALE, OTHER",
  }),
  religion: z
    .enum(["ISLAM", "HINDUISM"], {
      message: "Religion must be one of: ISLAM, HINDUISM",
    })
    .optional(),

  blood_group: z
    .enum(
      [
        "A_POS",
        "A_NEG",
        "B_POS",
        "B_NEG",
        "AB_POS",
        "AB_NEG",
        "O_POS",
        "O_NEG",
      ],
      {
        message:
          "Blood group must be one of: A_POS, A_NEG, B_POS, B_NEG, AB_POS, AB_NEG, O_POS, O_NEG",
      }
    )
    .optional(),
  photo: z.string().optional(),
  current_address: z.string().optional(),
  permanent_address: z.string().optional(),
  class_id: z.string().min(1, "Class id cannot be empty"),
  section_id: z.string().min(1, "Section id cannot be empty"),
});

export const create_student_schema = z.object({
  user: user_schema,

  student_profile: student_profile_schema,
  guardians: z
    .array(guardian_schema)
    .min(1, "At least one guardian is required"),
});

// --- User Schema ---
// export const create_user_schema = z
//   .object({
//     username: z
//       .string()
//       .min(1, "Username is required")
//       .regex(
//         usernamePattern,
//         `Username must follow the format: ${SCHOOL_NAME}-<number> (e.g. ${SCHOOL_NAME}-101)`
//       ),

//     password: z
//       .string()
//       .min(8, "Password must be at least 8 characters long")
//       .regex(/[A-Za-z]/, "Password must contain at least one letter")
//       .regex(/\d/, "Password must contain at least one number"),

//     role: z.enum(["ADMIN", "TEACHER", "STUDENT"], {
//       message: "Role must be one of: ADMIN, TEACHER, STUDENT",
//     }),
//     admin_profile: admin_profile_schema.optional(),
//     teacher_profile: teacher_profile_schema.optional(),
//     student_profile: student_profile_schema.optional(),
//     guardians: z
//       .array(guardian_schema)
//       .min(1, "At least one guardian is required"),
//   })
//   .superRefine((data, ctx) => {
//     const required_field = profile_by_role[data.role];
//     if (!required_field) {
//       ctx.addIssue({
//         code: "custom",
//         message: "Invalid role",
//         path: ["role"],
//       });
//       return;
//     }
//     if (!data[required_field]) {
//       ctx.addIssue({
//         code: "custom",
//         message: `${required_field} is required for role '${data.role}'`,
//         path: [required_field],
//       });
//       return;
//     }
//   });

export const login_user_schema = z.object({
  username: z.string().min(1, "Username is required"),

  password: z.string().min(1, "Password is required"),
});

export const update_user_schema = z
  .object({
    username: z
      .string()
      .min(1, "Username is required")
      .regex(
        usernamePattern,
        `Username must follow the format: ${SCHOOL_NAME}-<number> (e.g. ${SCHOOL_NAME}-101)`
      )
      .optional(),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Za-z]/, "Password must contain at least one letter")
      .regex(/\d/, "Password must contain at least one number")
      .optional(),

    role: z
      .enum(["ADMIN", "TEACHER", "STUDENT"], {
        message:
          "Role must be one of: ADMIN, SUPER_ADMIN, TEACHER, STUDENT, PARENT",
      })
      .optional(),
    super_admin_profile: super_admin_profile_schema.partial().optional(),
    admin_profile: admin_profile_schema.partial().optional(),
    teacher_profile: teacher_profile_schema.partial().optional(),
    student_profile: student_profile_schema.partial().optional(),
    parent_profile: parent_profile_schema.partial().optional(),
  })
  .superRefine((data, ctx) => {
    // If role is provided, we must enforce the STRICT profile schema
    if (data.role) {
      const required_field = profile_by_role[data.role];
      const profileData = data[required_field];

      if (!profileData) {
        ctx.addIssue({
          code: "custom",
          message: `${required_field} is required for role '${data.role}'`,
          path: [required_field],
        });
        return;
      }

      // Map to get the ORIGINAL (non-partial) schema
      const schemaMap = {
        SUPER_ADMIN: super_admin_profile_schema,
        ADMIN: admin_profile_schema,
        TEACHER: teacher_profile_schema,
        STUDENT: student_profile_schema,
        PARENT: parent_profile_schema,
      };

      const strictSchema = schemaMap[data.role];

      // Re-validate the data against the strict schema
      const result = strictSchema.safeParse(profileData);

      if (!result.success) {
        // Forward the errors from the strict validation to the main context
        result.error.issues.forEach((issue) => {
          ctx.addIssue({
            ...issue,
            path: [required_field, ...issue.path], // ensure the error points to 'student_profile.roll_no' etc.
          });
        });
      }
    }
  });

// export type TCreate_user_schema = z.infer<typeof create_user_schema>;
export type TCreate_student_schema = z.infer<typeof create_student_schema>;
export type TLogin_user_schema = z.infer<typeof login_user_schema>;
export type TUpdate_user_schema = z.infer<typeof update_user_schema>;
