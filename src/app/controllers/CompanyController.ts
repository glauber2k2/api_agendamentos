import { Request, Response } from 'express'
import { getRepository } from 'typeorm'

import Company from '../models/Company'
import User from '../models/User'

class CompanyController {
  async list(req: Request, res: Response) {
    const userId = req.params.userId
    const repository = getRepository(User)

    const user = await repository.findOne(userId)

    if (!user) {
      return res.sendStatus(404)
    }

    try {
      const companyRepository = getRepository(Company)

      if (userId) {
        const companies = await companyRepository.find({
          where: { user: userId },
        })
        return res.json(companies)
      }

      const companies = await companyRepository.find()
      return res.json(companies)
    } catch (error) {
      console.error('Error listing companies:', error)
      return res.sendStatus(500)
    }
  }

  async create(req: Request, res: Response) {
    const { nome, nome_fantasia, cnpj, plano, descricao, usuario_vinculado } =
      req.body

    try {
      const userRepository = getRepository(User)
      const user = await userRepository.findOne(usuario_vinculado)

      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado.' })
      }

      const companyRepository = getRepository(Company)
      const company = companyRepository.create({
        nome,
        nome_fantasia,
        cnpj,
        plano,
        descricao,
        user,
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
