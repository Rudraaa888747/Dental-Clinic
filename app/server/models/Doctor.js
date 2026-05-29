import mongoose from 'mongoose'

const doctorSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    specialty: { type: String, required: true },
    email: String,
    phone: String,
    avatarUrl: String,
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
)

export const Doctor = mongoose.model('Doctor', doctorSchema)
