import { AdminUser } from '../models/AdminUser.js'

export async function findAdminByEmail(email) {
  return await AdminUser.findOne({ email: email.toLowerCase().trim(), active: true })
}

export async function listAdminUsers() {
  return await AdminUser.find({ active: true }).sort({ role: 1, fullName: 1 }).lean()
}
