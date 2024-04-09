import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import Company from '../models/Company'
import UserCompany from '../models/CompanyUser'
import User from '../models/User'
import Invitation from '../models/Invitation'
import { apiResponse } from '../../utils/apiResponse'
import sendEmail from '../../utils/sendMail'

class CompanyController {
  async addUserToCompany(req: Request, res: Response) {
    const { invitationId, userId, status } = req.body

    try {
      const userRepository = getRepository(User)
      const userCompanyRepository = getRepository(UserCompany)
      const invitationRepository = getRepository(Invitation)

      const invitation = await invitationRepository.findOne(invitationId, {
        relations: ['invitingCompany'],
      })

      if (!invitation) {
        return apiResponse(res, 404, 'Convite não encontrado.', false)
      }

      if (invitation.status !== 'pending') {
        return apiResponse(res, 400, 'Esse convite já foi processado.', false)
      }

      if (status !== 'accepted' && status !== 'rejected') {
        return apiResponse(res, 400, 'status não valido.', false)
      }

      invitation.status = status
      await invitationRepository.save(invitation)

      if (status === 'accepted') {
        const user = await userRepository.findOne(userId)
        if (!user) {
          return apiResponse(res, 404, 'Usuário não encontrado', false)
        }

        const newUserCompany = userCompanyRepository.create({
          user,
          company: invitation.invitingCompany,
        })
        await userCompanyRepository.save(newUserCompany)

        return apiResponse(res, 201, 'Usuário adicionado a empresa', true)
      }

      return apiResponse(res, 200, 'Convite rejeitado.', true)
    } catch (error) {
      console.error('Error adding user to company:', error)
      return apiResponse(res, 500, 'Erro ao adicionar usuário à empresa', false)
    }
  }

  async createInvitation(req: Request, res: Response) {
    const { companyId, invitedUsername } = req.body

    try {
      const companyRepository = getRepository(Company)
      const invitationRepository = getRepository(Invitation)
      const userRepository = getRepository(User)

      const company = await companyRepository.findOne(companyId)
      if (!company) {
        return apiResponse(res, 404, 'Empresa não encontrada.', false)
      }

      const invitedUser = await userRepository.findOne({
        where: { username: invitedUsername },
      })
      if (!invitedUser) {
        return apiResponse(res, 404, 'Usuário não encontrado.', false)
      }

      const existingInvitation = await invitationRepository.findOne({
        where: { invitedUser, status: 'pending' },
      })
      if (existingInvitation) {
        return apiResponse(
          res,
          400,
          'Já existe um convite pendente para este usuário.',
          false,
        )
      }

      const totalInvitations = await invitationRepository.count({
        where: { invitingCompany: company, status: 'pending' },
      })
      if (totalInvitations >= 10) {
        return apiResponse(
          res,
          400,
          'Limites de convites por empresa atingido.',
          false,
        )
      }

      const invitation = invitationRepository.create({
        invitedUser,
        invitingCompany: company,
      })
      await invitationRepository.save(invitation)
      await sendEmail(
        invitedUser.email,
        `Convite de ${company.name}`,
        `<p>Você recebeu um convite para fazer parte de <b>${company.name}</b> no sistema da TimeAlign.
      </p>`,
      )

      return apiResponse(res, 201, 'Convite enviado.', true, invitation)
    } catch (error) {
      console.error('Error creating invitation:', error)
      return apiResponse(res, 500, 'Erro ao enviar convite.', false)
    }
  }

  async listInvitations(req: Request, res: Response) {
    const { status, companyId, userId } = req.query

    try {
      const invitationRepository = getRepository(Invitation)

      const filters: {
        status?: string
        invitingCompany?: string
        invitedUser?: string
      } = {}

      if (status) filters.status = status as string
      if (companyId) filters.invitingCompany = companyId as string
      if (userId) filters.invitedUser = userId as string

      const invitations = await invitationRepository.find({
        where: filters,
        relations: ['invitingCompany', 'invitedUser'],
      })

      if (invitations.length === 0) {
        return apiResponse(
          res,
          404,
          'Nenhum convite encontrado com os filtros aplicados.',
          false,
        )
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

      return apiResponse(res, 200, 'Convites listados.', true, {
        invitations: formattedInvitations,
      })
    } catch (error) {
      console.error('Error listing invitations:', error)
      return apiResponse(res, 500, 'Erro ao listar convites.', false, error)
    }
  }
}

export default new CompanyController()
