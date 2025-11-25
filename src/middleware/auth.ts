import { db } from '$/db/index.ts'
import { RequestHandler } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { ApiError } from './error.ts'

const JWT_SECRET = process.env.JWT_SECRET

export const requireAuth: RequestHandler = async (req, res, next) => {
  try {
    const token = req.signedCookies?.token

    if (!token) {
      throw new ApiError('Token is required', 401)
    }

    const decodedUser = jwt.verify(token, JWT_SECRET) as JwtPayload

    // Fetch fresh user data from Prisma (exclude password)
    const user = await db.user.findUnique({
      where: { id: decodedUser.id },
      select: {
        id: true,
        role: true,
        username: true,
      },
    })

    if (!user) {
      throw new ApiError('Invalid token', 401)
    }

    // Attach sanitized user object
    ;(req as any).user = user

    return next()
  } catch (error) {
    next(error)
  }
}
