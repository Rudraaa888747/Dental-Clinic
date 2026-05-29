import mongoose from 'mongoose'

const invoiceLineItemSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    amount: { type: Number, required: true },
  },
  { _id: false },
)

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
    treatment: { type: mongoose.Schema.Types.ObjectId, ref: 'Treatment' },
    lineItems: [invoiceLineItemSchema],
    subtotal: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    amountPaid: { type: Number, default: 0 },
    balanceDue: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['Paid', 'Pending', 'Partial', 'Overdue'],
      default: 'Pending',
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'upi', 'card', 'emi', 'insurance'],
      default: 'cash',
    },
    transactionDetails: { type: String },
    dueDate: Date,
    shareUrl: String,
  },
  { timestamps: true },
)

export const Invoice = mongoose.model('Invoice', invoiceSchema)
