import bcrypt from 'bcryptjs'
import express from 'express'
import jwt from 'jsonwebtoken'
import { isDatabaseConnected } from '../config/db.js'
import { defaultContent } from '../data/defaultContent.js'
import { requireAuth } from '../middleware/auth.js'
import { Appointment } from '../models/Appointment.js'
import { ClinicContent } from '../models/ClinicContent.js'
import { Inquiry } from '../models/Inquiry.js'

const router = express.Router()
const LOGIN_WINDOW_MS = 15 * 60 * 1000
const LOCKOUT_MS = 30 * 60 * 1000
const MAX_LOGIN_ATTEMPTS = 5
const loginAttempts = new Map()

function isOnboardingAllowed() {
  return process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD
}

function getConfiguredAdminCredentials() {
  return {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  }
}

function getIpAddress(request) {
  const forwarded = request.headers['x-forwarded-for']
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  return request.ip || 'unknown'
}

function isRateLimited(ip) {
  const now = Date.now()
  const entry = loginAttempts.get(ip) || {
    count: 0,
    firstAttempt: now,
    blockedUntil: 0,
  }

  if (entry.blockedUntil && now < entry.blockedUntil) {
    return true
  }

  if (now - entry.firstAttempt > LOGIN_WINDOW_MS) {
    entry.count = 0
    entry.firstAttempt = now
    entry.blockedUntil = 0
  }

  entry.count += 1

  if (entry.count > MAX_LOGIN_ATTEMPTS) {
    entry.blockedUntil = now + LOCKOUT_MS
  }

  loginAttempts.set(ip, entry)

  return entry.blockedUntil && now < entry.blockedUntil
}

router.post('/login', async (request, response) => {
  const { email, password } = request.body
  const ip = getIpAddress(request)

  if (isRateLimited(ip)) {
    return response.status(429).json({
      message:
        'Too many login attempts. Please try again after 30 minutes or contact the administrator.',
    })
  }

  if (!email || !password) {
    return response.status(400).json({ message: 'Email and password are required.' })
  }

  if (!isOnboardingAllowed()) {
    return response.status(500).json({
      message:
        'Admin credentials are not configured. Set ADMIN_EMAIL and ADMIN_PASSWORD before starting the server.',
    })
  }

  const { email: configuredEmail, password: configuredPassword } =
    getConfiguredAdminCredentials()
  const passwordHash = await bcrypt.hash(configuredPassword, 10)
  const isValid =
    email === configuredEmail && (await bcrypt.compare(password, passwordHash))

  if (!isValid) {
    return response.status(401).json({ message: 'Invalid admin credentials.' })
  }

  loginAttempts.delete(ip)

  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  })

  response.cookie('clinic_admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000,
    path: '/',
  })

  return response.json({ success: true })
})

router.post('/logout', (_request, response) => {
  response.clearCookie('clinic_admin_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  })
  return response.json({ success: true })
})

router.use(requireAuth)

router.get('/dashboard', async (_request, response) => {
  if (!isDatabaseConnected()) {
    return response.status(503).json({
      message: 'Database unavailable. Admin dashboard is unavailable until the database is available.',
    })
  }

  const appointments = await Appointment.find().sort({ createdAt: -1 }).lean()
  const inquiries = await Inquiry.find().sort({ createdAt: -1 }).lean()
  const record = await ClinicContent.findOne({ key: 'website-content' }).lean()

  response.json({
    appointments,
    inquiries,
    content: record?.content || defaultContent,
  })
})


router.patch('/appointments/:id', async (request, response) => {
  const { status } = request.body
  const { id } = request.params

  if (!['pending', 'confirmed', 'completed'].includes(status)) {
    return response.status(400).json({ message: 'Invalid appointment status.' })
  }

  if (!isDatabaseConnected()) {
    return response.status(503).json({
      message: 'Appointment status updates are unavailable until the database is available.',
    })
  }

  const appointment = await Appointment.findByIdAndUpdate(
    id,
    { status },
    { new: true },
  ).lean()

  return response.json({ appointment })
})

export default router
