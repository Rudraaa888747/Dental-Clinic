import mongoose from 'mongoose'

const emiInstallmentSchema = new mongoose.Schema(
  {
    dueDate: Date,
    amount: Number,
    status: {
      type: String,
      enum: ['pending', 'paid', 'overdue'],
      default: 'pending',
    },
  },
  { _id: false },
)

const emiPlanSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    invoice: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice', required: true },
    totalAmount: { type: Number, required: true },
    installmentAmount: { type: Number, required: true },
    totalInstallments: { type: Number, required: true },
    paidInstallments: { type: Number, default: 0 },
    nextDueDate: Date,
    status: {
      type: String,
      enum: ['active', 'completed', 'overdue'],
      default: 'active',
    },
    schedule: [emiInstallmentSchema],
  },
  { timestamps: true },
)

export const EMIPlan = mongoose.model('EMIPlan', emiPlanSchema)
