import { connectDB } from './config/db.js'
import app from './app.js'

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

  app.listen(port, () => {
    console.log(`API running on port ${port}`)
  })
})
