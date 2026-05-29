import mongoose from 'mongoose'

const treatmentSchema = new mongoose.Schema(
  {
    sourceId: { type: String, index: true },
    name: { type: String, required: true, trim: true },
    category: String,
    basePrice: { type: Number, default: 0 },
    priceLabel: String,
    durationLabel: String,
    durationMinutes: { type: Number, default: 60 },
    painLevel: String,
    recovery: String,
    technology: String,
    icon: String,
    description: String,
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
)

export const Treatment = mongoose.model('Treatment', treatmentSchema)
