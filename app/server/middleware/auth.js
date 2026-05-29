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
  const token = extractAuthToken(request)

  if (!token) {
    return response.status(401).json({ message: 'Unauthorized access.' })
  }

  try {
    request.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    response.status(401).json({ message: 'Invalid or expired token.' })
  }
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
