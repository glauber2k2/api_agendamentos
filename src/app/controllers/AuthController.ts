import bcrypt from 'bcryptjs'
import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import jwt from 'jsonwebtoken'

import User from '../models/User'

class AuthController {
  async authenticate(req: Request, res: Response) {
    const repository = getRepository(User)
    const { username, password } = req.body

    const user = await repository.findOne({ where: { username } })

    if (!user) {
      return res.sendStatus(401)
    }

    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return res.sendStatus(401)
    }

    //TODO: Alterar chave "secret" para .env
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    })

    delete user.password

    return res.json({
      user,
      token,
    })
  }
}

export default new AuthController()
