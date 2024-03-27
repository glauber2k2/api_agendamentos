import { Router } from 'express'

import authMiddleware from './app/middlewares/authMiddleware'

import UserController from './app/controllers/UserController'
import AuthController from './app/controllers/AuthController'
import MailController from './app/controllers/MailController'
import CompanyController from './app/controllers/CompanyController'

const router = Router()

router.post('/auth', AuthController.authenticate)

router.post('/users', UserController.store)
router.post('/new_password', UserController.newPassword)
router.put('/users', authMiddleware, UserController.update)
router.get('/users', authMiddleware, UserController.getById)

router.post('/recover_password', MailController.ForgotPassword)

router.post('/companies', CompanyController.create)
router.get('/companies/:userId?', CompanyController.list)
export default router
