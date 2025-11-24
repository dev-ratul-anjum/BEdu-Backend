import { validateData } from '$/lib/validateData.ts'
import apiResponse from '$/utils/apiResponse.ts'
import { RequestHandler } from 'express'
import { createUserSchema } from './user.schema.ts'
import userService from './user.service.ts'

const userController = {
  create: async (req, res, next) => {
    try {
      const data = validateData(createUserSchema, req.body)

      const newUser = await userService.create(data)

      return apiResponse(res, 200, {
        success: true,
        message: 'User created successfully',
        data: newUser,
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
