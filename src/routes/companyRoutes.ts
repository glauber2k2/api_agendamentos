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
router.get(
  '/user_companies',
  authMiddleware,
  CompanyController.listUserCompanies,
)
router.get(
  '/children_companies/:parentCompanyId',
  CompanyController.listChildCompanies,
)
router.get('/companies/:identifier?', CompanyController.getCompanyByIdentifier)

export default router
