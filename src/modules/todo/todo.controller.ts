import { validateData } from '$/lib/validateData.ts'
import apiResponse from '$/utils/apiResponse.ts'
import { RequestHandler } from 'express'
import todoService from './todo.service.ts'
import { createTodoSchema } from './todo.validators.ts'

const todoController = {
  create: async (req, res, next) => {
    try {
      console.log(req.body)
      const { title } = validateData(createTodoSchema, req.body)

      await todoService.create(title)

      return apiResponse(res, 201, {
        success: true,
        message: 'Todo Created Successfully',
      })
    } catch (err) {
      next(err)
    }
  },

  getList: async (req, res, next) => {
    try {
      const todos: unknown[] = await todoService.getList()

      return apiResponse(res, 200, {
        success: true,
        message: 'Todo Fetched Successfully',
        data: todos,
      })
    } catch (err) {
      next(err)
    }
  },
} satisfies Record<string, RequestHandler>

export default todoController
