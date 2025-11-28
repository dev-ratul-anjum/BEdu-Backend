import { Api_Error } from '$/middleware/error.ts'
import z from 'zod'

export function validate_data<T extends z.ZodType<any, any>>(
  schema: T,
  data: z.infer<T>,
) {
  try {
    return schema.parse(data)
  } catch (err) {
    if (err instanceof z.ZodError) {
      throw new Api_Error(err.issues[0].message, 400, err.stack)
    }

    throw err
  }
}
