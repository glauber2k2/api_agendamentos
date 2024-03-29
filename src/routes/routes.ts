import { Router } from 'express'

import userRoutes from './userRoutes'
import companyRoutes from './companyRoutes'

import AuthController from '../app/controllers/AuthController'
import MailController from '../app/controllers/MailController'

const router = Router()

router.use(userRoutes)
router.use(companyRoutes)

/**
 * @swagger
 * /auth:
 *   post:
 *     summary: Autenticar no sistema.
 *     description: Rota para autenticar no sistema.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Usuario autenticado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 name:
 *                   type: string
 *                 username:
 *                   type: string
 */
router.post('/auth', AuthController.authenticate)

/**
 * @swagger
 * /recover_password:
 *   post:
 *     summary: Enviar email para recuperação de senha.
 *     description: Rota para enviar um email com instruções para recuperação de senha.
 *     tags: [Mail]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 */
router.post('/recover_password', MailController.ForgotPassword)

export default router
