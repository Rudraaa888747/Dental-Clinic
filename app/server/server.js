import http from 'http'
import { Server } from 'socket.io'
import { connectDB } from './config/db.js'
import app from './app.js'
import { extractAuthToken } from './middleware/auth.js'
import { registerSocketServer } from './services/socketService.js'
import jwt from 'jsonwebtoken'

const port = process.env.PORT || 5000

if (!process.env.JWT_SECRET) {
  console.error('Missing JWT_SECRET. The server will not start without a valid secret.')
  process.exit(1)
}

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not configured. The server will not start.')
  process.exit(1)
}

connectDB().then((connected) => {
  if (!connected) {
    console.error('Failed to connect to MongoDB. The server will not start.')
    process.exit(1)
  }

  const server = http.createServer(app)
  const io = new Server(server, {
    cors: {
      origin: true,
      credentials: true,
    },
  })

  io.use((socket, next) => {
    try {
      const fakeRequest = {
        headers: {
          authorization: socket.handshake.auth?.token
            ? `Bearer ${socket.handshake.auth.token}`
            : undefined,
          cookie: socket.handshake.headers.cookie,
        },
      }
      const token = extractAuthToken(fakeRequest)

      if (!token) {
        return next(new Error('Unauthorized socket connection.'))
      }

      socket.data.user = jwt.verify(token, process.env.JWT_SECRET)
      return next()
    } catch {
      return next(new Error('Invalid socket token.'))
    }
  })

  io.on('connection', (socket) => {
    const role = socket.data.user?.role
    if (role) {
      socket.join(`role:${role}`)
    }
  })

  registerSocketServer(io)

  server.listen(port, '0.0.0.0', () => {
    console.log(`API running on port ${port}`)
  })
})
