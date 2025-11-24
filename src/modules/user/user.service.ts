import { db } from '$/db/index.ts'
import { TCreateUserSchema } from './user.schema.ts'

const userService = {
  create: async (data: TCreateUserSchema) => {
    try {
      const newUser = await db.user.create({
        data,
      })

      return newUser
    } catch (error) {
      throw error
    }
  },
  getList: () => {},
  delete: () => {},
  update: () => {},
}

export default userService
