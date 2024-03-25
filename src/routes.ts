import { Router } from 'express'

import authMiddleware from './app/middlewares/authMiddleware'

import UserController from './app/controllers/UserController'
import AuthController from './app/controllers/AuthController'

const router = Router()

router.post('/auth', AuthController.authenticate)
router.post('/users', UserController.store)
router.post('/sendmail', UserController.sendMail)
router.put('/users', authMiddleware, UserController.update)
router.get('/users', authMiddleware, UserController.getById)

export default router
