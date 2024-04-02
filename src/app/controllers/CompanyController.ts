import { Request, Response } from 'express'
import { getRepository } from 'typeorm'

import Company from '../models/Company'
import User from '../models/User'
import { apiResponse } from '../../utils/apiResponse'

class CompanyController {
  async listUserCompanies(req: Request, res: Response) {
    const id = req.userId

    try {
      const companyRepository = getRepository(Company)

      const companies = await companyRepository.find({
        where: { user: id },
      })
      return apiResponse(
        res,
        200,
        'Empresas listadas com sucesso.',
        true,
        companies,
      )
    } catch (error) {
      console.error('Error listing companies:', error)
      return apiResponse(res, 500, 'Erro ao listas empresas', false, error)
    }
  }

  async listCompanies(req: Request, res: Response) {
    try {
      const { ChildBy, identifier, visibleCompanies } = req.query
      const companyRepository = getRepository(Company)
      let companies

      // Se o filtro ChildBy estiver presente na query params
      if (ChildBy) {
        // Verifica se o parentId foi fornecido
        const childCompanies = await companyRepository.find({
          where: { main_company_id: ChildBy },
        })
        return apiResponse(
          res,
          200,
          'Sucesso ao listar empresas.',
          true,
          childCompanies,
        )
      }

      // Se o filtro identifier estiver presente na query params
      if (identifier) {
        const company = await companyRepository.findOne({
          where: { identifier },
        })
        if (!company) {
          return apiResponse(res, 404, 'Empresa não encontrada.', false)
        }
        companies = [company]
      } else {
        // Se o filtro visibleCompanies estiver presente na query params
        if (visibleCompanies) {
          companies = await companyRepository.find({
            where: { isVisible: true },
          })
        } else {
          // Retorna todas as empresas sem filtro
          companies = await companyRepository.find()
        }
      }

      return apiResponse(
        res,
        200,
        'Sucesso ao listar empresas.',
        true,
        companies,
      )
    } catch (error) {
      console.error('Error fetching companies:', error)
      return apiResponse(
        res,
        500,
        'Ocorreu um erro ao listar empresas.',
        false,
        error,
      )
    }
  }

  async create(req: Request, res: Response) {
    const {
      name,
      business_name,
      cnpj,
      identifier,
      description,
      main_identifier,
    } = req.body
    const userId = req.userId

    try {
      const userRepository = getRepository(User)
      const user = await userRepository.findOne(userId)

      if (!user) {
        return apiResponse(res, 404, 'Usuário não encontrado', false)
      }

      const companyRepository = getRepository(Company)
      let mainCompanyInstance = null

      if (main_identifier) {
        mainCompanyInstance = await companyRepository
          .createQueryBuilder('company')
          .leftJoinAndSelect('company.user', 'user')
          .where('company.identifier = :identifier', {
            identifier: main_identifier,
          })
          .getOne()

        if (!mainCompanyInstance) {
          return apiResponse(
            res,
            404,
            'Empresa principal não encontrada.',
            false,
          )
        }
      }

      if (
        mainCompanyInstance &&
        mainCompanyInstance.user &&
        mainCompanyInstance.user.id !== userId
      ) {
        return apiResponse(
          res,
          403,
          'A empresa principal não pertence ao usuário.',
          false,
        )
      }

      // Cria a empresa filha
      const company = companyRepository.create({
        name,
        business_name,
        cnpj,
        identifier,
        description,
        main_company_id: mainCompanyInstance, // Vincula a empresa ao mainCompany (empresa pai), se fornecido
        user,
      })

      await companyRepository.save(company)

      return apiResponse(
        res,
        201,
        'Empresa cadastrada com sucesso.',
        true,
        company,
      )
    } catch (error) {
      console.error('Error creating company:', error)
      return apiResponse(
        res,
        500,
        'Ocorreu um erro ao cadastrar a empresa.',
        false,
      )
    }
  }
}

export default new CompanyController()
