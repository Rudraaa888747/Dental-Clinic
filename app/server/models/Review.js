import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true },
    source: { type: String, default: 'Google' },
    featured: { type: Boolean, default: false },
    requestStatus: {
      type: String,
      enum: ['pending', 'sent', 'received'],
      default: 'received',
    },
    adminReply: String,
    repliedAt: Date,
  },
  { timestamps: true },
)

export const Review = mongoose.model('Review', reviewSchema)
