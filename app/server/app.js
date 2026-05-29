import dotenv from 'dotenv'
import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import adminRoutes from './routes/adminRoutes.js'
import publicRoutes from './routes/publicRoutes.js'
import { ensureOperationalSeedData } from './services/clinicBootstrapService.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootEnvPath = path.resolve(__dirname, '../../.env')
const frontendDistPath = path.resolve(__dirname, '../dist')

dotenv.config({ path: rootEnvPath })

const app = express()
app.use(express.json())

app.use(async (_request, _response, next) => {
  await ensureOperationalSeedData()
  next()
})

app.use('/api', publicRoutes)
app.use('/api/admin', adminRoutes)

const hasFrontendBuild = fs.existsSync(path.join(frontendDistPath, 'index.html'))

if (hasFrontendBuild) {
  app.use(express.static(frontendDistPath))
}

app.use((request, response, next) => {
  if (request.path.startsWith('/api')) {
    return next()
  }

  if (!hasFrontendBuild) {
    return response.status(503).send(
      'Frontend build not found. Run "npm run build" from the project root first.',
    )
  }

  return response.sendFile(path.join(frontendDistPath, 'index.html'))
})

app.use((error, _request, response, _next) => {
  console.error(error)
  response.status(error.status || 500).json({ message: error.message || 'Internal server error.' })
})

export default app
