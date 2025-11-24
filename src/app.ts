import cors from 'cors'
import express from 'express'
import corsOptions from './lib/corsOptions.ts'
import { globalErrorHandler, notFoundHandler } from './middleware/error.ts'
import appRouter from './router.ts'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors(corsOptions))
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(express.json())

app.use('/api', appRouter)

app.use(notFoundHandler)
app.use(globalErrorHandler)

export default app
