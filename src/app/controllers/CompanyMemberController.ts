import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import Company from '../models/Company'
import UserCompany from '../models/CompanyUser'
import User from '../models/User'
import Invitation from '../models/Invitation'

class CompanyController {
  async addUserToCompany(req: Request, res: Response) {
    const { invitationId, userId, status } = req.body

    try {
      const userRepository = getRepository(User)
      const userCompanyRepository = getRepository(UserCompany)
      const invitationRepository = getRepository(Invitation)

      // Verificar se o convite existe
      const invitation = await invitationRepository.findOne(invitationId, {
        relations: ['invitingCompany'],
      })

      if (!invitation) {
        return res.status(404).json({
          success: false,
          message: 'Convite não encontrado.',
        })
      }

      // Verificar se o convite ainda está pendente
      if (invitation.status !== 'pending') {
        return res.status(400).json({
          success: false,
          message: 'O convite já foi processado.',
        })
      }

      // Verificar se o status é válido
      if (status !== 'accepted' && status !== 'rejected') {
        return res.status(400).json({
          success: false,
          message: 'Status de convite inválido.',
        })
      }

      // Aceitar ou rejeitar o convite
      invitation.status = status
      await invitationRepository.save(invitation)

      if (status === 'accepted') {
        // Adicionar usuário à empresa se o convite for aceito
        const user = await userRepository.findOne(userId)
        if (!user) {
          return res.status(404).json({
            success: false,
            message: 'Usuário não encontrado.',
          })
        }

        const newUserCompany = userCompanyRepository.create({
          user,
          company: invitation.invitingCompany,
        })
        await userCompanyRepository.save(newUserCompany)

        return res.status(201).json({
          success: true,
          message: 'Usuário adicionado à empresa com sucesso.',
        })
      }

      return res.status(200).json({
        success: true,
        message: 'Convite rejeitado com sucesso.',
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

  async listInvitations(req: Request, res: Response) {
    // Extrai os filtros da query string
    const { status, companyId, userId } = req.query

    try {
      const invitationRepository = getRepository(Invitation)

      // Define o tipo do objeto filters
      const filters: {
        status?: string
        invitingCompany?: string
        invitedUser?: string
      } = {}

      // Aplica os filtros se estiverem presentes
      if (status) filters.status = status as string
      if (companyId) filters.invitingCompany = companyId as string
      if (userId) filters.invitedUser = userId as string

      // Realiza a busca no banco de dados com os filtros aplicados
      const invitations = await invitationRepository.find({
        where: filters,
        relations: ['invitingCompany', 'invitedUser'], // Inclui as relações na consulta
      })

      if (invitations.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Nenhum convite encontrado com os filtros aplicados.',
        })
      }

      // Mapeia os convites para incluir apenas as informações necessárias
      const formattedInvitations = invitations.map((invitation) => ({
        id: invitation.id,
        status: invitation.status,
        company: {
          id: invitation.invitingCompany.id,
          name: invitation.invitingCompany.name,
        },
        user: {
          id: invitation.invitedUser.id,
          name: invitation.invitedUser.name,
        },
      }))

      return res.status(200).json({
        success: true,
        invitations: formattedInvitations,
      })
    } catch (error) {
      console.error('Error listing invitations:', error)
      return res.status(500).json({
        success: false,
        message: 'Ocorreu um erro ao listar os convites.',
        error,
      })
    }
  }
}

export default new CompanyController()
