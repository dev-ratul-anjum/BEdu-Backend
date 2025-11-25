import express from 'express'
import userController from './user.controller.ts'

const userRouter = express.Router()

userRouter.patch('/register', userController.register)
userRouter.post('/login', userController.login)

export default userRouter
