import { db } from '$/db/index.ts'
import { RequestHandler } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { Api_Error } from './error.ts'

const JWT_SECRET = process.env.JWT_SECRET

export const requireAuth: RequestHandler = async (req, res, next) => {
  try {
    const token = req.signedCookies[process.env.ACCESS_TOKEN_NAME]

    if (!token) {
      throw new Api_Error('Token is required', 401)
    }

    const decodedUser = jwt.verify(token, JWT_SECRET) as JwtPayload

    // Fetch fresh user data from Prisma (exclude password)
    const user = await db.user.findUnique({
      where: { id: decodedUser.userId },
      select: {
        id: true,
        role: true,
        username: true,
      },
    })

    if (!user) {
      throw new Api_Error('Invalid token', 401)
    }

    // Attach sanitized user object
    ;(req as any).user = user

    return next()
  } catch (error) {
    next(error)
  }
}
