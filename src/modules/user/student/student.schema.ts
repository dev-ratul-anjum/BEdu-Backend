import { GuardianRelation } from "$/db/generated/enums.js";
import { z } from "zod";

const rawSchoolName = process.env.SCHOOL_NAME;
if (!rawSchoolName) {
  throw new Error("Environment variable SCHOOL_NAME is not defined.");
}
const SCHOOL_NAME = rawSchoolName.trim().toUpperCase();

const usernamePattern = new RegExp(`^${SCHOOL_NAME}-\\d+$`);

// Guardian schema
export const guardian_schema = z.object({
  relation: z.enum(GuardianRelation, {
    error: "Relation must be one of: FATHER, MOTHER, OTHER",
  }),
  phone: z.string().min(1, "Guardian phone number is required"),
  name: z.string().min(1, "Guardian name is required"),
  occupation: z.string().optional(),
});

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

export type TCreate_student_schema = z.infer<typeof create_student_schema>;
