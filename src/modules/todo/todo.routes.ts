import { Router } from 'express'
import todoController from './todo.controller.ts'

const todoRoutes = Router({ caseSensitive: true })

todoRoutes.post('/create', todoController.create)
todoRoutes.get('/getList', todoController.getList)

export default todoRoutes
