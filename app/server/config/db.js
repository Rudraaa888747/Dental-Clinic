import mongoose from 'mongoose'
import dns from 'dns'

let connected = false

export async function connectDB() {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    console.warn('MONGODB_URI is not configured. Running with in-memory fallback.')
    return false
  }

  try {
    // Fix for "querySrv ECONNREFUSED" on some Windows machines
    dns.setServers(['8.8.8.8', '8.8.4.4'])
    
    await mongoose.connect(uri)
    connected = true
    console.log('MongoDB connected')
    return true
  } catch (error) {
    console.warn(`MongoDB connection failed: ${error.message}`)
    return false
  }
}

export function isDatabaseConnected() {
  return connected && mongoose.connection.readyState === 1
}
