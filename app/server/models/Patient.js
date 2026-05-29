import mongoose from 'mongoose'

const patientSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true, index: true },
    email: { type: String, trim: true, lowercase: true },
    age: Number,
    gender: { type: String, enum: ['Male', 'Female', 'Other', 'Prefer not to say'] },
    bloodGroup: String,
    avatarUrl: String,
    allergies: String,
    medicalHistory: String,
    dentalHistory: String,
    notes: String,
    status: {
      type: String,
      enum: ['Active', 'Follow-up', 'Completed', 'Prospect'],
      default: 'Active',
    },
    tags: [String],
    lastVisitAt: Date,
  },
  { timestamps: true },
)

export const Patient = mongoose.model('Patient', patientSchema)
