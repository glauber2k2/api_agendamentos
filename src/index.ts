import 'reflect-metadata'
import express from 'express'
import cors from 'cors'

import './database/connect'
import routes from './routes'

const app = express()

app.use(cors({
  origin: '*',
  credentials: true // Permite que cookies sejam enviados pelo cliente
}));

app.use(express.json())
app.use(routes)

app.listen(process.env.PORT || 8000, () => 
console.log('✅ Server started.' ))