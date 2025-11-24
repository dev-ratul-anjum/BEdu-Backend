import z from 'zod'
import ApiError from '../utils/ApiError.ts'

export function validateData<T extends z.ZodType<any, any>>(
  schema: T,
  data: z.infer<T>,
) {
  try {
    return schema.parse(data)
  } catch (err) {
    if (err instanceof z.ZodError)
      throw new ApiError(err.issues[0].message, 400)

    throw err
  }
}
