import { validateData } from '$/lib/validateData.ts'
import apiResponse from '$/utils/apiResponse.ts'
import { RequestHandler } from 'express'
import { createUserSchema, loginUserSchema } from './user.schema.ts'
import userService from './user.service.ts'

const userController = {
  register: async (req, res, next) => {
    try {
      const data = validateData(createUserSchema, req.body)


      const newUser = await userService.register(data)


      return apiResponse(res, 200, {
        success: true,
        message: 'User created successfully',
        data: newUser,
      })
    } catch (error) {
      next(error)
    }
  },
  login : async (req, res, next) =>{
    try {
      const data = validateData(loginUserSchema, req.body)

      const {user, token} = await userService.login(data)

      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 1000,
      })

      return apiResponse(res, 200, {
        success: true,
        message: 'User logged in successfully',
        data: user,
      })
    } catch (error) {
      next(error)
    }
  },
  getList: async (req, res) => {},
  update: async (req, res) => {},
  delete: async (req, res) => {},
} satisfies Record<string, RequestHandler>

export default userController
