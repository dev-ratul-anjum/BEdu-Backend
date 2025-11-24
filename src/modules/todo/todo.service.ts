import db from '$/lib/db.ts'
import todoController from './todo.controller.ts'

const todoService = {
  create: async (title: string) => {
    try {
      const res = await db.query(
        'insert into todos (title) values ($1) returning *',
        [title],
      )

      return res.rows[0]
    } catch (error) {
      throw error
    }
  },

  getList: async () => {
    try {
      const res = await db.query('select * from todos order by id desc')

      return res.rows
    } catch (error) {
      throw error
    }
  },
} satisfies Record<keyof typeof todoController, unknown>

export default todoService
