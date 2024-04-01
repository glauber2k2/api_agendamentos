import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import Company from '../models/Company'
import UserCompany from '../models/CompanyUser'
import User from '../models/User'
import Invitation from '../models/Invitation'

class CompanyController {
  //TODO: Adaptar para aceitar convite e ser contratado.
  async addUserToCompany(req: Request, res: Response) {
    const { userId, companyId } = req.body

    try {
      const userRepository = getRepository(User)
      const companyRepository = getRepository(Company)
      const userCompanyRepository = getRepository(UserCompany)

      // Verifique se o usuário e a empresa existem
      const user = await userRepository.findOne(userId)
      const company = await companyRepository.findOne(companyId)
      if (!user || !company) {
        return res.status(404).json({
          success: false,
          message: 'Usuário ou empresa não encontrados.',
        })
      }

      // Crie uma nova entrada na tabela de junção UserCompany
      const newUserCompany = new UserCompany()
      newUserCompany.user = user
      newUserCompany.company = company
      await userCompanyRepository.save(newUserCompany)

      return res.status(201).json({
        success: true,
        message: 'Usuário adicionado à empresa com sucesso.',
      })
    } catch (error) {
      console.error('Error adding user to company:', error)
      return res.status(500).json({
        success: false,
        message: 'Ocorreu um erro ao adicionar usuário à empresa.',
        error,
      })
    }
  }

  async createInvitation(req: Request, res: Response) {
    const { companyId, invitedUsername } = req.body

    try {
      const companyRepository = getRepository(Company)
      const invitationRepository = getRepository(Invitation)
      const userRepository = getRepository(User)

      // Verificar se a empresa existe
      const company = await companyRepository.findOne(companyId)
      if (!company) {
        return res.status(404).json({
          success: false,
          message: 'Empresa não encontrada.',
        })
      }

      // Encontrar o usuário pelo nome de usuário
      const invitedUser = await userRepository.findOne({
        where: { username: invitedUsername },
      })
      if (!invitedUser) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado.',
        })
      }

      // Verificar se a empresa já enviou 5 convites
      const totalInvitations = await invitationRepository.count({
        where: { invitingCompany: company, status: 'pending' },
      })
      if (totalInvitations >= 5) {
        return res.status(400).json({
          success: false,
          message: 'Limite máximo de convites atingido para esta empresa.',
        })
      }

      // Criar o convite
      const invitation = invitationRepository.create({
        invitedUser,
        invitingCompany: company,
      })
      await invitationRepository.save(invitation)

      return res.status(201).json({
        success: true,
        message: 'Convite enviado com sucesso.',
        invitation,
      })
    } catch (error) {
      console.error('Error creating invitation:', error)
      return res.status(500).json({
        success: false,
        message: 'Ocorreu um erro ao criar o convite.',
        error,
      })
    }
  }
}

export default new CompanyController()
