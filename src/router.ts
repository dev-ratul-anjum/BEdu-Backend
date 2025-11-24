import { Router } from 'express'
import todoRoutes from './modules/todo/todo.routes.ts'
import apiResponse from './utils/apiResponse.ts'

const appRouter = Router({ caseSensitive: true })

appRouter.all('/health-check', (_req, res) =>
  apiResponse(res, 200, {
    success: true,
    message: 'OK! Server is in good health',
  }),
)

appRouter.use('/todo', todoRoutes)

export default appRouter
