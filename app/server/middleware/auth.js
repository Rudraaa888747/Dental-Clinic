import jwt from 'jsonwebtoken'
import { can } from '../config/rbac.js'

export function parseCookie(cookieHeader = '') {
  return cookieHeader.split(';').reduce((acc, part) => {
    const [key, value] = part.trim().split('=')
    if (key && value) {
      acc[key] = decodeURIComponent(value)
    }
    return acc
  }, {})
}

export function extractAuthToken(request) {
  const authorization = request.headers.authorization
  const cookieHeader = request.headers.cookie
  const tokenFromHeader = authorization?.startsWith('Bearer ')
    ? authorization.split(' ')[1]
    : null
  const tokenFromCookie = parseCookie(cookieHeader).clinic_admin_token
  return tokenFromHeader || tokenFromCookie
}

export function requireAuth(request, response, next) {
  // Authentication bypassed: automatically grant super_admin access
  request.user = {
    _id: 'admin_bypass',
    fullName: 'Admin User',
    role: 'admin',
    roleLabel: 'Super Admin',
    permissions: ['manage_appointments', 'manage_patients', 'manage_invoices', 'manage_billing', 'manage_reviews', 'generate_reports', 'manage_settings']
  }
  next()
}

export function requirePermission(permission) {
  return (request, response, next) => {
    if (!request.user) {
      return response.status(401).json({ message: 'Unauthorized access.' })
    }

    if (!can(request.user.role, permission)) {
      return response.status(403).json({ message: 'You do not have permission to perform this action.' })
    }

    next()
  }
}
