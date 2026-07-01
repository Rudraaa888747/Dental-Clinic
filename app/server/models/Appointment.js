import mongoose from 'mongoose'

const appointmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    service: { type: String, required: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
    treatment: { type: mongoose.Schema.Types.ObjectId, ref: 'Treatment' },
    invoice: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' },
    date: { type: String, required: true },
    time: { type: String, required: true },
    notes: String,
    consultationNotes: String,
    paymentMethod: {
      type: String,
      enum: ['cash', 'upi', 'card', 'emi', 'insurance'],
      default: 'cash',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true },
)

export const Appointment = mongoose.model('Appointment', appointmentSchema)
