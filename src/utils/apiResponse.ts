import { type Response } from 'express'

export default function apiResponse<T extends unknown>(
  response: Response,
  statusCode: number,
  { success, message, data = null }: TOptions<T>,
) {
  return response.status(statusCode).json({ success, message, data })
}

type TOptions<T extends unknown> = {
  success: boolean
  message: string
  data?: T | null | undefined
}
