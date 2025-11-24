import ApiError from '$/utils/ApiError.ts'
import apiResponse from '$/utils/apiResponse.ts'
import { ErrorRequestHandler, RequestHandler } from 'express'

export const notFoundHandler: RequestHandler = (_req, res, next) => {
  res.status(404).send('Sorry, that page cannot be found!')
}

export const globalErrorHandler: ErrorRequestHandler = (
  err,
  _req,
  res,
  _next,
) => {
  if (err instanceof ApiError) {
    return apiResponse(res, err.statusCode, {
      success: false,
      message: err.message,
    })
  }

  return apiResponse(res, 500, {
    success: false,
    message: 'Internal server error',
  })
}
