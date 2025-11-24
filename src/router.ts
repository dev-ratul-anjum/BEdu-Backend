import { Router } from 'express'
import apiResponse from './utils/apiResponse.ts'

const appRouter = Router({ caseSensitive: true })

appRouter.all('/health-check', async (_req, res) => {
  return apiResponse(res, 200, {
    success: true,
    message: 'OK! Server is in good health',
  })
})

// appRouter.use('/todo', todoRoutes)

export default appRouter
