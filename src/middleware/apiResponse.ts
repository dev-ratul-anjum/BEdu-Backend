import { type Response } from 'express'

export default function apiResponse<T extends unknown>(
  response: Response,
  statusCode: number,
  { data = null, ...rest }: TOptions<T>,
) {
  return response.status(statusCode).json({ data, ...rest })
}

type TOptions<T extends unknown> = {
  message: string
  error?: boolean
  success?: boolean
  data?: T | null | undefined
  [x: string]: unknown
}
