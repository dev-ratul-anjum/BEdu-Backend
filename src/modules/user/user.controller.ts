import { validateData } from '$/lib/validateData.ts'
import apiResponse from '$/middleware/apiResponse.ts'
import { createJwtToken, setAuthCookie } from '$/utils/authHelpers.ts'
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

  login: async (req, res, next) => {
    try {
      const data = validateData(loginUserSchema, req.body)

      const { user } = await userService.login(data)

      const token = createJwtToken(user.id)
      setAuthCookie(res, token)

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
