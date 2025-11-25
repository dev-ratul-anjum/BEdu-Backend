import { type Response } from 'express'
import jwt from 'jsonwebtoken'
import { to_milliseconds, to_seconds } from './time_converter.ts'

export const create_jwt_token = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: to_seconds(process.env.ACCESS_TOKEN_EXPIRES_IN),
  })
}

export const set_auth_cookie = (res: Response, token: string) => {
  res.cookie(process.env.ACCESS_TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    signed: true,
    maxAge: to_milliseconds(process.env.ACCESS_TOKEN_EXPIRES_IN),
  })
}

export const clear_auth_cookie = (res: Response) => {
  res.clearCookie(process.env.ACCESS_TOKEN_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    signed: true,
  })
}
