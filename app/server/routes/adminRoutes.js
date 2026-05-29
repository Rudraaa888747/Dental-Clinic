import bcrypt from 'bcryptjs'
import express from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { requireAuth, requirePermission } from '../middleware/auth.js'
import {
  createAdminBooking,
  createAdminPatient,
  createInvoiceRecord,
  generateAdminReport,
  getAdminDashboard,
  getActivityLogs,
  getAdminPatientProfile,
  getCatalog,
  getInvoiceList,
  getNotifications,
  getSettings,
  getSession,
  patchAppointmentStatus,
  patchInvoice,
  patchSettings,
  patchNotificationRead,
  replyReview,
  searchAdminEntities,
  syncTreatments,
} from '../controllers/adminController.js'
import { authenticateAdmin } from '../services/authService.js'
import { PERMISSIONS } from '../config/rbac.js'

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

  const { email: configuredEmail } = getConfiguredAdminCredentials()
  const authenticated = await authenticateAdmin({
    email: email === 'admin@example.com' ? configuredEmail : email,
    password,
  })

  loginAttempts.delete(ip)
  const token = authenticated.token

  response.cookie('clinic_admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000,
    path: '/',
  })

  return response.json({ success: true, token, user: authenticated.user })
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

router.get('/dashboard', asyncHandler(getAdminDashboard))
router.get('/session', asyncHandler(getSession))
router.get('/catalog', asyncHandler(getCatalog))
router.get('/settings', asyncHandler(getSettings))
router.get('/notifications', asyncHandler(getNotifications))
router.get('/activity-logs', asyncHandler(getActivityLogs))
router.get('/search', asyncHandler(searchAdminEntities))
router.get('/patients/:id', requirePermission(PERMISSIONS.managePatients), asyncHandler(getAdminPatientProfile))
router.get('/invoices', requirePermission(PERMISSIONS.manageInvoices), asyncHandler(getInvoiceList))
router.post('/patients', requirePermission(PERMISSIONS.managePatients), asyncHandler(createAdminPatient))
router.post('/bookings', requirePermission(PERMISSIONS.manageAppointments), asyncHandler(createAdminBooking))
router.post('/invoices', requirePermission(PERMISSIONS.manageBilling), asyncHandler(createInvoiceRecord))
router.post('/reports/generate', requirePermission(PERMISSIONS.generateReports), asyncHandler(generateAdminReport))
router.post('/treatments/sync', requirePermission(PERMISSIONS.manageAppointments), asyncHandler(syncTreatments))
router.patch('/appointments/:id', requirePermission(PERMISSIONS.manageAppointments), asyncHandler(patchAppointmentStatus))
router.patch('/invoices/:id', requirePermission(PERMISSIONS.manageBilling), asyncHandler(patchInvoice))
router.patch('/settings', asyncHandler(patchSettings))
router.patch('/notifications/:id/read', asyncHandler(patchNotificationRead))
router.post('/reviews/:id/reply', requirePermission(PERMISSIONS.manageReviews), asyncHandler(replyReview))

export default router
