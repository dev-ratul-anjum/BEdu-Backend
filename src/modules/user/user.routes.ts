import express from 'express'
import userController from './user.controller.ts'
const userRouter = express.Router()

userRouter.post('/create', userController.create)
userRouter.get('/getList', userController.getList)
userRouter.put('/update', userController.update)
userRouter.delete('/delete', userController.delete)

export default userRouter
