import { Router } from 'express'
import apiResponse from './middleware/apiResponse.ts'
import userRouter from './modules/user/user.routes.ts'

const appRouter = Router({ caseSensitive: true })

appRouter.all('/health-check', async (_req, res) => {
  return apiResponse(res, 200, {
    success: true,
    message: 'OK! Server is in good health',
  })
})

appRouter.use('/user', userRouter)

export default appRouter
