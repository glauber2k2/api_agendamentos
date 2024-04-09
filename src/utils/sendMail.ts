// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailer = require('nodemailer')

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_ACCOUNT,
      pass: process.env.GMAIL_PASS,
    },
  })
}

const sendEmail = async (to: string, subject: string, htmlContent: string) => {
  const transporter = createTransporter()

  try {
    await transporter.sendMail({
      from: `TimeAlign <${process.env.GMAIL_ACCOUNT}>`,
      to: to,
      subject: subject,
      html: htmlContent,
    })

    console.log('E-mail enviado com sucesso.')
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error)
  }
}

export default sendEmail
