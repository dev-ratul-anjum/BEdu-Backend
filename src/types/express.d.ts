import { User } from '$/db/generated/client.ts'

declare global {
  namespace Express {
    interface Request {
      user?: Pick<User, 'id' | 'role' | 'username'>
    }
  }
}
