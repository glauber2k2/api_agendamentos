import { Router } from 'express'

import authMiddleware from '../app/middlewares/authMiddleware'
import CompanyController from '../app/controllers/CompanyController'

const router = Router()

/**
 * @swagger
 * /companies:
 *   post:
 *     summary: Criar Empresa.
 *     description: Rota para criar empresa/unidade.
 *     tags: [Company]
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               nome_fantasia:
 *                 type: string
 *               cnpj:
 *                 type: string
 *               isVisible:
 *                 type: boolean
 *               identify:
 *                 type: string
 *               main_company_id:
 *                 type: string
 */
router.post('/companies', authMiddleware, CompanyController.create)

/**
 * @swagger
 * /user_companies:
 *   get:
 *     summary: Listar Empresas do usuário.
 *     tags: [Company]
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de empresas vinculadas ao usuário.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   identifier:
 *                     type: string
 *                   isVisible:
 *                     type: boolean
 *                   name:
 *                     type: string
 *                   business_name:
 *                     type: string
 *                   cnpj:
 *                     type: string
 *                   description:
 *                     type: string
 */
router.get(
  '/user_companies',
  authMiddleware,
  CompanyController.listUserCompanies,
)

/**
 * @swagger
 * /companies:
 *   get:
 *     summary: Lista todas as empresas ou aplica filtros opcionais.
 *     description: Rota para listar todas as empresas ou aplicar filtros opcionais.
 *     tags: [Company]
 *     parameters:
 *       - in: query
 *         name: childBy
 *         schema:
 *           type: string
 *         description: ID da empresa pai para filtrar as empresas filhas.
 *       - in: query
 *         name: identifier
 *         schema:
 *           type: string
 *         description: Identificador da empresa para recuperar uma empresa específica.
 *       - in: query
 *         name: visibleCompanies
 *         schema:
 *           type: boolean
 *         description: Filtra as empresas que são visíveis (true) ou não (false).
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   identifier:
 *                     type: string
 *                   isVisible:
 *                     type: boolean
 *                   name:
 *                     type: string
 *                   business_name:
 *                     type: string
 *                   cnpj:
 *                     type: string
 *                   description:
 *                     type: string
 *       '400':
 *         description: Parâmetros de consulta inválidos.
 *       '404':
 *         description: Empresa não encontrada.
 *       '500':
 *         description: Erro interno do servidor.
 */
router.get('/companies', CompanyController.listCompanies)

export default router
