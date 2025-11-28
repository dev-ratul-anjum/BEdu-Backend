import { requireAuth } from '$/middleware/auth.ts'
import { authorize_roles } from '$/utils/authorize_roles.ts'
import express from 'express'
import user_controller from './user.controller.ts'

const user_router = express.Router()

user_router.post(
  '/register',
  requireAuth,
  authorize_roles('ADMIN'),
  user_controller.register,
)
user_router.post('/login', user_controller.login)
user_router.get('/profile', requireAuth, (req, res) => {
  res.json({ message: 'Profile Page' })
})

export default user_router
