import api_response from '$/middleware/api_response.ts'
import { ErrorRequestHandler, RequestHandler } from 'express'
import { ZodError } from 'zod'

export class Api_Error extends Error {
  status_code: number

  constructor(message: string, status_code: number, stack?: string) {
    super(message)
    this.status_code = status_code
    if (stack) {
      this.stack = stack
    } else {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

export const not_found_handler: RequestHandler = (_req, res, next) => {
  return api_response(res, 404, {
    error: true,
    message: 'Sorry, that page cannot be found!',
  })
}

export const global_error_handler: ErrorRequestHandler = async (
  error,
  req,
  res,
  next,
) => {
  process.env.NODE_ENV === 'development'
    ? console.log('globalErrorHandler', error)
    : console.log('Error from globalError', error)

  let status_code = 500
  let message = 'Something went wrong'
  let error_essages = []
  let path = req.originalUrl // Capture the request path

  if (error?.name === 'ValidatorError') {
    const simplifiedMessage = handle_validation_error(error)
    status_code = simplifiedMessage?.status_code
    message = simplifiedMessage?.message
    error_essages = simplifiedMessage?.error_messages
  } else if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error)
    status_code = simplifiedError.status_code
    message = simplifiedError.message
    error_essages = simplifiedError.error_messages
  } else if (error?.name === 'CastError') {
    const simplifiedError = handle_cast_error(error)
    status_code = simplifiedError.status_code
    message = simplifiedError.message
    error_essages = simplifiedError.error_messages
  } else if (error instanceof Api_Error) {
    status_code = error?.status_code || 500
    message = error?.message || 'An error occurred'
    error_essages = error?.message ? [{ path: '', message: message }] : []
  } else if (error instanceof Error) {
    message = error.message
    error_essages = error?.message ? [{ path: '', message: error.message }] : []
  }

  return api_response(res, status_code, {
    error: true,
    message,
    path,
    request_id: new Date().getTime(),
  })
}

const handle_validation_error = (err: any) => {
  const errors = Object.values(err.errors).map((element: any) => ({
    path: element?.path,
    message: element?.message,
  }))

  return {
    status_code: 400,
    message: 'Validation Error',
    error_messages: errors,
  }
}

const handleZodError = (error: ZodError) => {
  const errors = error.issues.map((issue) => ({
    path: issue?.path[issue.path.length - 1],
    message: issue?.message,
  }))

  return {
    status_code: 400,
    message: 'Validation Error from handleZodError',
    error_messages: errors,
  }
}

const handle_cast_error = (error: any) => {
  const errors = [
    {
      path: error.path,
      message: error.message,
    },
  ]

  return {
    status_code: 400,
    message: 'CastError',
    error_messages: errors,
  }
}
