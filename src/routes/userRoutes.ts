import { Router } from 'express'

import authMiddleware from '../app/middlewares/authMiddleware'
import UserController from '../app/controllers/UserController'

const router = Router()

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Criar usuário.
 *     description: Rota responsável por criar usuário no sistema.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 */
router.post('/users', UserController.store)

/**
 * @swagger
 * /new_password:
 *   post:
 *     summary: Redefinir senha.
 *     description: Rota redefinir a senha de um usuário.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 */
router.post('/new_password', UserController.newPassword)

/**
 * @swagger
 * /users:
 *   put:
 *     summary: Editar usuário.
 *     description: Rota para editar informações de um usuário.
 *     tags: [User]
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 */
router.put('/users', authMiddleware, UserController.update)

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Obter informações do usuário autenticado.
 *     description: Rota para obter informações do usuário autenticado.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Informações do usuário autenticado obtidas com sucesso.
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
router.get('/users', authMiddleware, UserController.getById)

export default router
