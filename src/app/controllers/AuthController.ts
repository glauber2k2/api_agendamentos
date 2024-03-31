import bcrypt from 'bcryptjs'
import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import jwt from 'jsonwebtoken'

import User from '../models/User'
import { apiResponse } from '../../utils/apiResponse'

class AuthController {
  async authenticate(req: Request, res: Response) {
    const repository = getRepository(User)
    const { username, password } = req.body

    const user = await repository.findOne({ where: { username } })

    if (!user) {
      return apiResponse(res, 401, 'Usuário não encontrado.', false)
    }

    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return apiResponse(res, 401, 'Senha incorreta', false)
    }

    //TODO: Alterar chave "secret" para .env
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    })

    delete user.password

    return apiResponse(res, 200, 'Autenticado', true, {
      user,
      token,
    })
  }
}

export default new AuthController()
