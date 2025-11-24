import express from 'express'
import userController from './user.controller.ts';
const userRouter  = express.Router();

userRouter.post('/create',userController.createUser)
userRouter.get('/get', userController.getUser)
userRouter.put('/update', userController.updateUser)
userRouter.delete('/delete', userController.deleteUser)


export default userRouter
