import jwt from 'jsonwebtoken'

function parseCookie(cookieHeader = '') {
  return cookieHeader.split(';').reduce((acc, part) => {
    const [key, value] = part.trim().split('=')
    if (key && value) {
      acc[key] = decodeURIComponent(value)
    }
    return acc
  }, {})
}

export function requireAuth(request, response, next) {
  const authorization = request.headers.authorization
  const cookieHeader = request.headers.cookie
  const tokenFromHeader = authorization?.startsWith('Bearer ')
    ? authorization.split(' ')[1]
    : null
  const tokenFromCookie = parseCookie(cookieHeader).clinic_admin_token
  const token = tokenFromHeader || tokenFromCookie

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
