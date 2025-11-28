import { type Response } from 'express'

export default function api_response<T extends unknown>(
  response: Response,
  status_code: number,
  { data, ...rest }: TOptions<T>,
) {
  return response.status(status_code).json({ data, ...rest })
}

type TOptions<T extends unknown> = {
  message: string
  error?: boolean
  success?: boolean
  data?: T | null | undefined
  [x: string]: unknown
}
