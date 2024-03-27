import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import jwt, { JwtPayload } from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

import User from '../models/User'

interface MyJwtPayload extends JwtPayload {
  userId: string
}

class UserController {
  async newPassword(req: Request, res: Response) {
    const { newPassword, token } = req.body

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as MyJwtPayload
      const userId = decoded.userId

      const repository = getRepository(User)
      const user = await repository.findOne(userId)

      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado.' })
      }

      user.password = await bcrypt.hash(newPassword, 8)

      await repository.save(user)

      return res.status(200).json({ message: 'Senha alterada com sucesso.' })
    } catch (error) {
      return res.status(400).json({ message: 'Token inválido ou expirado.' })
    }
  }

  async getById(req: Request, res: Response) {
    const id = req.userId
    const repository = getRepository(User)

    try {
      const user = await repository.findOne(id)

      if (!user) {
        return res.sendStatus(404)
      }
      delete user.password
      return res.json(user)
    } catch (error) {
      console.error('Error retrieving user:', error)
      return res.sendStatus(500)
    }
  }

  async update(req: Request, res: Response) {
    const id = req.userId
    const repository = getRepository(User)
    const dataToUpdate = req.body

    try {
      let user = await repository.findOne(id)
      if (!user) {
        return res.sendStatus(404)
      }

      user = repository.merge(user, dataToUpdate)
      await repository.save(user)
      delete user.password

      return res.json(user)
    } catch (error) {
      console.error('Error updating user:', error)
      return res.sendStatus(500)
    }
  }

  async store(req: Request, res: Response) {
    const repository = getRepository(User)
    const { email, password, name, username } = req.body

    const userExists = await repository.findOne({ where: { username } })
    const emailExists = await repository.findOne({ where: { email } })

    if (userExists || emailExists) {
      return res.sendStatus(409)
    }

    const user = repository.create({ email, password, name, username })
    await repository.save(user)

    delete user.password
    return res.json(user)
  }
}

export default new UserController()
