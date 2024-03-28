import express from 'express'
import cors from 'cors'

import routes from './routes/routes'
import './database/connect'

import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const app = express()
app.use(express.json())

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TimeAlign - API Documentation',
      version: '1.0.0',
    },
  },
  apis: ['src/routes/*.ts'],
}

const swaggerSpec = swaggerJsdoc(swaggerOptions)

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use(cors())
app.use(routes)

app.listen(process.env.PORT || 8000, () => console.log('✅ Server started.'))
