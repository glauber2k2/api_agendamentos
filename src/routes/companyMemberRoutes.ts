import { Router } from 'express'

import authMiddleware from '../app/middlewares/authMiddleware'
import CompanyMemberController from '../app/controllers/CompanyMemberController'

const router = Router()

router.post(
  '/invite_member',
  authMiddleware,
  CompanyMemberController.createInvitation,
)
router.post(
  '/invite_action',
  authMiddleware,
  CompanyMemberController.addUserToCompany,
)

export default router
