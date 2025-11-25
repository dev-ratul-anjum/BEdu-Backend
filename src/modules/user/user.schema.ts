import { Role } from '$/db/generated/enums.ts'
import { z } from 'zod'

// --- Profile Schemas ---
const admin_profile_Schema = z.object({
  name: z.string(),
  email: z.email().optional(),
})

const accountant_profile_schema = z.object({
  name: z.string(),
})

const teacher_profile_schema = z.object({
  name: z.string(),
  email: z.string().optional(),
  degree: z.string().optional(),
  indexNumber: z.string().optional(),
  designation: z.string().optional(),
  joiningDate: z.string().optional(),
})

const parent_profile_schema = z.object({
  name: z.string(),
  email: z.string().email().optional(),
})

const student_profile_schema = z.object({
  name: z.string(),
  rollNo: z.number(),
  dateOfBirth: z.string().datetime(),
  gender: z.string(),
  bloodGroup: z.string().optional(),
  address: z.string().optional(),
  classId: z.string(),
  sectionId: z.string(),
})

// --- User Schema ---
export const create_user_schema = z
  .object({
    username: z.string(),
    password: z.string(),
    role: z.custom<Role>(),

    admin_profile: admin_profile_Schema.optional(),
    accountant_profile: accountant_profile_schema.optional(),
    teacher_profile: teacher_profile_schema.optional(),
    student_profile: student_profile_schema.optional(),
    parent_profile: parent_profile_schema.optional(),
  })
  .superRefine((data, ctx) => {
    // Role → User model profile field mapping
    const profile_by_role = {
      ADMIN: 'admin_profile',
      ACCOUNTANT: 'accountant_profile',
      TEACHER: 'teacher_profile',
      STUDENT: 'student_profile',
      PARENT: 'parent_profile',
    } as const

    const required_field = profile_by_role[data.role]

    // Invalid role
    if (!required_field) {
      ctx.addIssue({
        code: 'custom',
        message: 'Invalid role',
        path: ['role'],
      })
      return
    }

    // Required profile missing
    if (!data[required_field]) {
      ctx.addIssue({
        code: 'custom',
        message: `${required_field} is required for role '${data.role}'`,
        path: [required_field],
      })
    }

    // Extra profiles forbidden
    const all_fields = [
      'admin_profile',
      'accountant_profile',
      'teacher_profile',
      'student_profile',
      'parent_profile',
    ] as const

    all_fields.forEach((key) => {
      if (key !== required_field && data[key] != null) {
        ctx.addIssue({
          code: 'custom',
          message: `${key} should not be provided for role '${data.role}'`,
          path: [key],
        })
      }
    })
  })

export const login_user_schema = create_user_schema.pick({
  username: true,
  password: true,
})

export type TCreate_user_schema = z.infer<typeof create_user_schema>

export type TLogin_user_schema = z.infer<typeof login_user_schema>
