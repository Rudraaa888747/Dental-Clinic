import mongoose from 'mongoose'

const adminUserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    fullName: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'dentist', 'receptionist', 'finance_manager', 'assistant'],
      required: true,
    },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
)

export const AdminUser = mongoose.model('AdminUser', adminUserSchema)
