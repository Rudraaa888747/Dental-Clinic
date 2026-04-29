import mongoose from 'mongoose'

const appointmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    service: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed'],
      default: 'pending',
    },
  },
  { timestamps: true },
)

export const Appointment = mongoose.model('Appointment', appointmentSchema)
