import { Role } from '$/db/generated/enums.ts'
import { z } from 'zod'

export const createUserSchema = z.object({
  username: z.string('username is required'),
  password: z.string().min(8, 'password must be at least 8 charecters long'),
  role: z.custom<Role>(),
})

export type TCreateUserSchema = z.infer<typeof createUserSchema>

export const loginUserSchema = createUserSchema.pick({
  username: true,
  password: true,
})

export type TLoginUserSchema = z.infer<typeof loginUserSchema>
