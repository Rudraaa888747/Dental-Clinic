import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getPermissionsForRole, ROLE_LABELS } from '../config/rbac.js'
import { findAdminByEmail } from '../repositories/adminRepository.js'

export async function authenticateAdmin({ email, password }) {
  const user = await findAdminByEmail(email)

  if (!user) {
    const error = new Error('Invalid admin credentials.')
    error.status = 401
    throw error
  }

  const isValid = await bcrypt.compare(password, user.passwordHash)

  if (!isValid) {
    const error = new Error('Invalid admin credentials.')
    error.status = 401
    throw error
  }

  const payload = {
    sub: `${user._id}`,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    permissions: getPermissionsForRole(user.role),
  }

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1d',
  })

  return {
    token,
    user: {
      id: `${user._id}`,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      roleLabel: ROLE_LABELS[user.role],
      permissions: getPermissionsForRole(user.role),
    },
  }
}
