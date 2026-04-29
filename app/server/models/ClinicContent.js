import mongoose from 'mongoose'

const clinicContentSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    content: { type: Object, required: true },
  },
  { timestamps: true },
)

export const ClinicContent = mongoose.model('ClinicContent', clinicContentSchema)
