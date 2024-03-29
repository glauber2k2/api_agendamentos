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
 * /user_companies/{parentCompanyId}:
 *   get:
 *     summary: Listar Empresas vinculadas a empresa principal.
 *     description: Rota para listar empresas vinculadas a empresa principal.
 *     tags: [Company]
 *     parameters:
 *       - in: path
 *         name: parentCompanyId
 *         required: true
 *         description: ID da empresa principal para o qual buscar as empresas vinculadas.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Retorno das empresas vinculadas a empresa principal.
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
  '/children_companies/:parentCompanyId',
  CompanyController.listChildCompanies,
)

/**
 * @swagger
 * /companies/{identifier}:
 *   get:
 *     summary: Obter informações da empresa por identificador ou listar todas as empresas.
 *     description:
 *       Rota para obter informações de uma empresa específica com base no identificador fornecido
 *       ou listar todas as empresas se nenhum identificador for fornecido.
 *     tags: [Company]
 *     parameters:
 *       - in: path
 *         name: identifier
 *         required: false
 *         description: O identificador da empresa a ser retornada.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Informações da empresa recuperadas com sucesso.
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
router.get('/companies/:identifier?', CompanyController.getCompanyByIdentifier)

export default router
