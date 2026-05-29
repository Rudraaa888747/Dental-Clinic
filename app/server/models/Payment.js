import mongoose from 'mongoose'

const paymentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    invoice: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice', required: true },
    amount: { type: Number, required: true },
    method: {
      type: String,
      enum: ['cash', 'upi', 'card', 'emi', 'insurance'],
      required: true,
    },
    status: {
      type: String,
      enum: ['paid', 'pending', 'failed'],
      default: 'paid',
    },
    transactionReference: String,
    paidAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

export const Payment = mongoose.model('Payment', paymentSchema)
