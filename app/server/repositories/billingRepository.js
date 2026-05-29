import { EMIPlan } from '../models/EMIPlan.js'
import { Invoice } from '../models/Invoice.js'
import { Payment } from '../models/Payment.js'

export async function createInvoice(payload) {
  return await Invoice.create(payload)
}

export async function updateInvoice(id, payload) {
  return await Invoice.findByIdAndUpdate(id, payload, { new: true })
    .populate('patient doctor treatment appointment')
    .lean()
}

export async function findInvoices() {
  return await Invoice.find()
    .populate('patient doctor treatment appointment')
    .sort({ createdAt: -1 })
    .lean()
}

export async function findInvoiceById(id) {
  return await Invoice.findById(id).populate('patient doctor treatment appointment').lean()
}

export async function createPayment(payload) {
  return await Payment.create(payload)
}

export async function findPaymentsByPatient(patientId) {
  return await Payment.find({ patient: patientId }).sort({ createdAt: -1 }).lean()
}

export async function createEmiPlan(payload) {
  return await EMIPlan.create(payload)
}

export async function findEmiPlanByInvoice(invoiceId) {
  return await EMIPlan.findOne({ invoice: invoiceId }).lean()
}

export async function findEmiPlans() {
  return await EMIPlan.find().populate('patient invoice').sort({ createdAt: -1 }).lean()
}
