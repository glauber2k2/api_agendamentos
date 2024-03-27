import { Request, Response } from 'express'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailer = require('nodemailer')
import { getRepository } from 'typeorm'
import jwt from 'jsonwebtoken'

import User from '../models/User'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_ACCOUNT,
    pass: process.env.GMAIL_PASS,
  },
})

class MailController {
  async ForgotPassword(req: Request, res: Response) {
    const { email } = req.body
    const repository = getRepository(User)

    try {
      const user = await repository.findOne({ where: { email } })

      if (user) {
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
          expiresIn: 15 * 60 * 1000, //15 minutos
        })

        const resetPasswordLink = `${process.env.APP_BASEURL}/nova-senha?token=${token}`
        const emailHtml = `
        <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8">
              <style>
                .container {
                  margin: auto;
                  max-width: 500px;
                  height: 700px;
                }
                .header {
                  background-color: #100f0f;
                  color: white;
                  padding: 8px;
                  text-align: center;
                }
                .content {
                  height: 100%;
                }
                .content p{
                  color: black;
                  font-size: 14px;
                  margin-top: 14px;
                }
                .content small{
                  color: black;
                  font-size: 10px;
                }
                .btn, .btn:link, .btn:visited, .btn:hover, .btn:active {
                  margin-top: 10px;
                  width: 100%;
                  background-color: #7c3aed; 
                  color: white !important; 
                  padding: 10px 0; 
                  text-align: center;
                  font-weight: 600;
                  text-decoration: none; 
                  display: inline-block; 
                  font-size: 16px; 
                  border: none; 
                  cursor: pointer; 
                  border-radius: 6px;
                }

                .btn:hover {
                  background-color: #8243EF;
                }
            </style>
            </head>
            <body>
            <div class="container">
              <div class="header">
                <h2>TimeAlign</h2>
              </div>

              <div class="content">
                <p>Olá ${user.name},
                Recebemos uma solicitação para redefinir sua senha do TimeAlign.
                clique abaixo para escolher uma nova senha.
                </p>
                <a href="${resetPasswordLink}" class="btn">Redefinir</a>
                <small>enviamos esse email para ${user.email} por uma solicitação de redefinir senha, caso não tenha sido você, poderá ignorar esse email.
                </small>
              </div>
            </div>

            </body>
        </html>
        `

        await transporter.sendMail({
          from: `TimeAlign <${process.env.GMAIL_ACCOUNT}>`,
          to: user.email,
          subject: 'Redefinir senha',
          html: emailHtml,
        })

        return res.sendStatus(200)
      }
      return res.sendStatus(200)
    } catch (error) {
      return res.sendStatus(500)
    }
  }
}

export default new MailController()
