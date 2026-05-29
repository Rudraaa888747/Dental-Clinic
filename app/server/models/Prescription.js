import mongoose from 'mongoose'

const medicationSchema = new mongoose.Schema(
  {
    name: String,
    dosage: String,
    instructions: String,
  },
  { _id: false },
)

const prescriptionSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
    medications: [medicationSchema],
    notes: String,
  },
  { timestamps: true },
)

export const Prescription = mongoose.model('Prescription', prescriptionSchema)
