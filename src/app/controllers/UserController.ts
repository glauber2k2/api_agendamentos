import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailer = require('nodemailer')

import User from '../models/User'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_ACCOUNT,
    pass: process.env.GMAIL_PASS,
  },
})

class UserController {
  async sendMailForgotPass(req: Request, res: Response) {
    const { email } = req.body
    const repository = getRepository(User)

    try {
      const user = await repository.findOne({ where: { email } })

      if (user) {
        await transporter.sendMail({
          from: 'TimeAlign',
          to: user.email,
          subject: 'Redefinir senha',
          html: '<b>Link para redefinir senha.</b>',
        })

        return res.sendStatus(200)
      }
      return res.sendStatus(200)
    } catch (error) {
      return res.sendStatus(500)
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
