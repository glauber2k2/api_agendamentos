import { Request, Response } from 'express'
import { getRepository } from 'typeorm'

import Company from '../models/Company'
import User from '../models/User'

class CompanyController {
  async listUserCompanies(req: Request, res: Response) {
    const id = req.userId

    try {
      const companyRepository = getRepository(Company)

      const companies = await companyRepository.find({
        where: { user: id },
      })
      return res.json(companies)
    } catch (error) {
      console.error('Error listing companies:', error)
      return res.sendStatus(500)
    }
  }

  async listCompanies(req: Request, res: Response) {
    const parentId = req.params.parentCompanyId

    try {
      const companyRepository = getRepository(Company)
      let childCompanies

      if (!parentId) {
        // Se nenhum parentId for fornecido, lista todas as empresas
        childCompanies = await companyRepository.find()
      } else {
        // Caso contrário, filtra as empresas pelo parentId fornecido
        childCompanies = await companyRepository.find({
          where: { main_company_id: parentId },
        })
      }

      return res.json(childCompanies)
    } catch (error) {
      console.error('Error fetching child companies:', error)
      return res.sendStatus(500)
    }
  }

  async create(req: Request, res: Response) {
    const {
      nome,
      nome_fantasia,
      cnpj,
      identifier,
      descricao,
      main_company_id,
    } = req.body
    const id = req.userId

    try {
      const userRepository = getRepository(User)
      const user = await userRepository.findOne(id)

      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado.' })
      }

      const companyRepository = getRepository(Company)
      let mainCompanyInstance = null

      // Verifica se foi fornecido o ID da empresa principal
      if (main_company_id) {
        // Se fornecido, busca a empresa correspondente pelo ID
        mainCompanyInstance = await companyRepository.findOne(main_company_id)

        if (!mainCompanyInstance) {
          return res
            .status(404)
            .json({ message: 'Empresa principal não encontrada.' })
        }
      }

      // Cria a empresa filha
      const company = companyRepository.create({
        nome,
        nome_fantasia,
        cnpj,
        identifier,
        descricao,
        main_company_id: mainCompanyInstance, // Vincula a empresa ao mainCompany (empresa pai), se fornecido
        user, // Vincula a empresa ao usuário
      })

      await companyRepository.save(company)

      return res.status(201).json(company)
    } catch (error) {
      console.error('Error creating company:', error)
      return res.sendStatus(500)
    }
  }
}

export default new CompanyController()
