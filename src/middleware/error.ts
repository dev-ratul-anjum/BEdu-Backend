import apiResponse from '$/middleware/apiResponse.ts'
import { ErrorRequestHandler, RequestHandler } from 'express'
import { ZodError } from 'zod'

export class ApiError extends Error {
  statusCode: number

  constructor(message: string, statusCode: number, stack?: string) {
    super(message)
    this.statusCode = statusCode
    if (stack) {
      this.stack = stack
    } else {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

export const notFoundHandler: RequestHandler = (_req, res, next) => {
  return apiResponse(res, 404, {
    error: true,
    message: 'Sorry, that page cannot be found!',
  })
}

export const globalErrorHandler: ErrorRequestHandler = async (
  error,
  req,
  res,
  next,
) => {
  process.env.NODE_ENV === 'development'
    ? console.log('globalErrorHandler', error)
    : console.log('Error from globalError', error)

  let statusCode = 500
  let message = 'Something went wrong'
  let errorMessages = []
  let path = req.originalUrl // Capture the request path

  if (error?.name === 'ValidatorError') {
    const simplifiedMessage = handleValidationError(error)
    statusCode = simplifiedMessage?.statusCode
    message = simplifiedMessage?.message
    errorMessages = simplifiedMessage?.errorMessages
  } else if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error)
    statusCode = simplifiedError.statusCode
    message = simplifiedError.message
    errorMessages = simplifiedError.errorMessages
  } else if (error?.name === 'CastError') {
    const simplifiedError = handleCastError(error)
    statusCode = simplifiedError.statusCode
    message = simplifiedError.message
    errorMessages = simplifiedError.errorMessages
  } else if (error instanceof ApiError) {
    statusCode = error?.statusCode || 500
    message = error?.message || 'An error occurred'
    errorMessages = error?.message ? [{ path: '', message: message }] : []
  } else if (error instanceof Error) {
    message = error.message
    errorMessages = error?.message ? [{ path: '', message: error.message }] : []
  }

  return apiResponse(res, statusCode, {
    error: true,
    message,
    path,
    request_id: new Date().getTime(),
  })
}

const handleValidationError = (err: any) => {
  const errors = Object.values(err.errors).map((element: any) => ({
    path: element?.path,
    message: element?.message,
  }))

  return {
    statusCode: 400,
    message: 'Validation Error',
    errorMessages: errors,
  }
}

const handleZodError = (error: ZodError) => {
  const errors = error.issues.map((issue) => ({
    path: issue?.path[issue.path.length - 1],
    message: issue?.message,
  }))

  return {
    statusCode: 400,
    message: 'Validation Error from handleZodError',
    errorMessages: errors,
  }
}

const handleCastError = (error: any) => {
  const errors = [
    {
      path: error.path,
      message: error.message,
    },
  ]

  return {
    statusCode: 400,
    message: 'CastError',
    errorMessages: errors,
  }
}
