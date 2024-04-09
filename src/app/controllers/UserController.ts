import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import jwt, { JwtPayload } from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

import User from '../models/User'
import { apiResponse } from '../../utils/apiResponse'
import sendEmail from '../../utils/sendMail'

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

      const samePassword = await bcrypt.compare(newPassword, user.password)
      if (samePassword) {
        return apiResponse(res, 409, 'senha não pode ser igual a atual.', false)
      }

      user.password = await bcrypt.hash(newPassword, 8)

      await repository.save(user)
      await sendEmail(
        user.email,
        `Senha alterada.`,
        `<p>Sua senha foi alterada, caso não tenha sido você que realizou a mudança, envie um email para: <b>timealignservice@gmail.com</b>.
      </p>`,
      )
      return apiResponse(res, 200, 'senha alterada com sucesso', true)
    } catch (error) {
      return apiResponse(res, 400, 'token invalido ou expirado', false, error)
    }
  }

  async getById(req: Request, res: Response) {
    const id = req.userId
    const repository = getRepository(User)

    try {
      const user = await repository.findOne(id)

      if (!user) {
        return apiResponse(res, 404, 'usuario não encontrado.', false)
      }
      delete user.password
      return apiResponse(res, 200, 'dados retornados com sucesso.', true, user)
    } catch (error) {
      console.error('Error retrieving user:', error)
      return apiResponse(res, 500, 'falha ao retornar dados', false, error)
    }
  }

  async update(req: Request, res: Response) {
    const id = req.userId
    const repository = getRepository(User)
    const dataToUpdate = req.body

    try {
      let user = await repository.findOne(id)
      if (!user) {
        return apiResponse(res, 404, 'Usuário não encontrado.', false)
      }

      const usernameExists = await repository.findOne({
        where: { username: dataToUpdate.username },
      })

      if (user.username === dataToUpdate.username) {
        return apiResponse(res, 409, 'Usuário igual ao atual', false)
      }
      if (usernameExists) {
        return apiResponse(res, 409, 'Nome de usuário já existe.', false)
      }
      if (user.email === dataToUpdate.email) {
        return apiResponse(res, 409, 'Email igual ao atual', false)
      }

      user = repository.merge(user, dataToUpdate)
      await repository.save(user)
      delete user.password

      return apiResponse(res, 200, 'Usuário atualizado.', true, user)
    } catch (error) {
      console.error('Error updating user:', error)
      return apiResponse(res, 500, 'Erro ao atualizar usuário.', true)
    }
  }

  async store(req: Request, res: Response) {
    const repository = getRepository(User)
    const { email, password, name, username } = req.body

    const userExists = await repository.findOne({ where: { username } })
    const emailExists = await repository.findOne({ where: { email } })

    if (emailExists) {
      return apiResponse(res, 409, 'Email já existente', false)
    }

    if (userExists) {
      return apiResponse(res, 409, 'Usuário já existente', false)
    }

    const encryptedPassword = bcrypt.hashSync(password, 8)

    const user = repository.create({
      email,
      password: encryptedPassword,
      name,
      username,
    })
    await repository.save(user)

    delete user.password
    return apiResponse(res, 200, 'Usuario criado.', true, user)
  }
}

export default new UserController()
