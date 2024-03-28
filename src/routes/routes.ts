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
 *     summary: Autenticação do usuário
 *     description: Rota responsável por autenticar o usuário no sistema.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nome de usuário do usuário.
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Senha do usuário.
 *     responses:
 *       '200':
 *         description: Autenticação bem-sucedida. Retorna o token de acesso.
 *       '401':
 *         description: Falha na autenticação. Credenciais inválidas.
 *       '500':
 *         description: Erro interno do servidor.
 */
router.post('/auth', AuthController.authenticate)

router.post('/recover_password', MailController.ForgotPassword)

export default router
