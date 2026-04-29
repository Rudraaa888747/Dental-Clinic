import mongoose from 'mongoose'

const inquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true },
)

export const Inquiry = mongoose.model('Inquiry', inquirySchema)
