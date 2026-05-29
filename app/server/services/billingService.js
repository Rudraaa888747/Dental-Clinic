import { createAppointment } from '../repositories/appointmentRepository.js'
import { createEmiPlan, createInvoice, createPayment, findInvoiceById, updateInvoice } from '../repositories/billingRepository.js'
import { addDays, createInvoiceNumber } from '../utils/formatters.js'
import { createOperationalNotification } from './notificationService.js'
import { logActivity } from './activityLogService.js'
import { emitClinicEvent } from './socketService.js'

function resolveInvoiceStatus(totalAmount, amountPaid, dueDate) {
  if (amountPaid >= totalAmount) return 'Paid'
  if (amountPaid > 0) return 'Partial'
  if (dueDate && new Date(dueDate) < new Date()) return 'Overdue'
  return 'Pending'
}

function buildEmiSchedule({ dueDate, totalAmount, emiInstallments, amountPaid = 0 }) {
  const installmentAmount = Math.ceil(totalAmount / emiInstallments)
  const paidInstallments = Math.min(
    emiInstallments,
    Math.floor(Number(amountPaid || 0) / Math.max(installmentAmount, 1)),
  )

  const schedule = Array.from({ length: emiInstallments }, (_, index) => ({
    dueDate: addDays(dueDate, index * 30),
    amount: installmentAmount,
    status: index < paidInstallments ? 'paid' : 'pending',
  }))

  return {
    installmentAmount,
    paidInstallments,
    schedule,
  }
}

export async function createBookingWithFinancials(payload, actor) {
  const invoiceNumber = createInvoiceNumber()
  const appointment = await createAppointment({
    name: payload.patientName,
    phone: payload.patientPhone,
    service: payload.treatmentName,
    patient: payload.patientId,
    doctor: payload.doctorId,
    treatment: payload.treatmentId,
    date: payload.date,
    time: payload.time,
    notes: payload.notes,
    consultationNotes: payload.notes,
    paymentMethod: payload.paymentMethod,
    status: 'confirmed',
  })

  const subtotal = payload.estimatedAmount
  const amountPaid = payload.paymentMethod === 'emi' ? 0 : payload.advanceAmount || subtotal
  const dueDate = addDays(new Date(`${payload.date}T00:00:00`), 7)

  const invoice = await createInvoice({
    invoiceNumber,
    patient: payload.patientId,
    appointment: appointment._id,
    doctor: payload.doctorId,
    treatment: payload.treatmentId,
    lineItems: [{ label: payload.treatmentName, amount: subtotal }],
    subtotal,
    totalAmount: subtotal,
    amountPaid,
    balanceDue: Math.max(subtotal - amountPaid, 0),
    paymentMethod: payload.paymentMethod,
    transactionDetails: payload.transactionDetails,
    dueDate,
    status: resolveInvoiceStatus(subtotal, amountPaid, dueDate),
    shareUrl: `https://wa.me/?text=${encodeURIComponent(`Invoice ${invoiceNumber} for ${payload.patientName}`)}`,
  })

  appointment.invoice = invoice._id
  await appointment.save()

  if (amountPaid > 0) {
    await createPayment({
      patient: payload.patientId,
      invoice: invoice._id,
      amount: amountPaid,
      method: payload.paymentMethod,
      status: 'paid',
      transactionReference: payload.transactionDetails || `TXN-${Date.now()}`,
    })
  }

  let emiPlan = null

  if (payload.paymentMethod === 'emi') {
    const { installmentAmount, paidInstallments, schedule } = buildEmiSchedule({
      dueDate,
      totalAmount: subtotal,
      emiInstallments: payload.emiInstallments,
      amountPaid,
    })

    emiPlan = await createEmiPlan({
      patient: payload.patientId,
      invoice: invoice._id,
      totalAmount: subtotal,
      installmentAmount,
      totalInstallments: payload.emiInstallments,
      paidInstallments,
      nextDueDate: schedule.find((item) => item.status === 'pending')?.dueDate,
      status: 'active',
      schedule,
    })
  }

  await Promise.all([
    createOperationalNotification({
      title: 'New appointment confirmed',
      body: `${payload.patientName} booked ${payload.treatmentName} on ${payload.date} at ${payload.time}.`,
      type: 'appointment',
      entityType: 'Appointment',
      entityId: appointment._id,
    }),
    logActivity({
      actorEmail: actor?.email,
      actorRole: actor?.role || 'admin',
      action: 'booking.created',
      entityType: 'Appointment',
      entityId: appointment._id,
      metadata: { patientId: payload.patientId, invoiceId: invoice._id },
    }),
  ])

  emitClinicEvent('appointment:created', { appointment })
  emitClinicEvent('invoice:created', { invoice })
  if (emiPlan) {
    emitClinicEvent('emi:created', { emiPlan })
  }

  return { appointment, invoice, emiPlan }
}

export async function updateInvoicePayment(invoiceId, payload, actor) {
  const invoice = await findInvoiceById(invoiceId)

  if (!invoice) {
    const error = new Error('Invoice not found.')
    error.status = 404
    throw error
  }

  const amountPaid = Math.min(invoice.totalAmount, (invoice.amountPaid || 0) + Number(payload.amount || 0))
  const status = resolveInvoiceStatus(invoice.totalAmount, amountPaid, invoice.dueDate)

  const updatedInvoice = await updateInvoice(invoiceId, {
    amountPaid,
    balanceDue: Math.max(invoice.totalAmount - amountPaid, 0),
    status,
    paymentMethod: payload.method || invoice.paymentMethod,
    transactionDetails: payload.transactionDetails !== undefined ? payload.transactionDetails : invoice.transactionDetails,
  })

  await Promise.all([
    createPayment({
      patient: invoice.patient._id,
      invoice: invoice._id,
      amount: Number(payload.amount || 0),
      method: payload.method || invoice.paymentMethod,
      status: 'paid',
      transactionReference: payload.transactionDetails || payload.transactionReference || `TXN-${Date.now()}`,
    }),
    logActivity({
      actorEmail: actor?.email,
      actorRole: actor?.role || 'admin',
      action: 'invoice.payment_recorded',
      entityType: 'Invoice',
      entityId: invoice._id,
      metadata: payload,
    }),
    createOperationalNotification({
      title: updatedInvoice.status === 'Paid' ? 'Invoice settled' : 'Payment recorded',
      body: `${invoice.patient.fullName} payment updated for ${invoice.invoiceNumber}.`,
      type: updatedInvoice.status === 'Paid' ? 'payment_confirmed' : 'payment_pending',
      entityType: 'Invoice',
      entityId: invoice._id,
    }),
  ])

  emitClinicEvent('invoice:updated', { invoice: updatedInvoice })

  return updatedInvoice
}

export async function createStandaloneInvoice(payload, actor) {
  const invoiceNumber = createInvoiceNumber()
  const dueDate = payload.dueDate
    ? new Date(`${payload.dueDate}T00:00:00`)
    : addDays(new Date(), 7)
  const totalAmount = Number(payload.totalAmount || 0)
  const amountPaid = Math.min(totalAmount, Number(payload.amountPaid || 0))
  const status = resolveInvoiceStatus(totalAmount, amountPaid, dueDate)

  const invoice = await createInvoice({
    invoiceNumber,
    patient: payload.patientId,
    doctor: payload.doctorId || undefined,
    treatment: payload.treatmentId,
    lineItems: [
      {
        label: payload.lineItemLabel || payload.treatmentName || 'Dental Treatment',
        amount: totalAmount,
      },
    ],
    subtotal: totalAmount,
    totalAmount,
    amountPaid,
    balanceDue: Math.max(totalAmount - amountPaid, 0),
    paymentMethod: payload.paymentMethod,
    transactionDetails: payload.transactionDetails,
    dueDate,
    status,
    shareUrl: `https://wa.me/?text=${encodeURIComponent(`Invoice ${invoiceNumber} for ${payload.patientName}`)}`,
  })

  if (amountPaid > 0) {
    await createPayment({
      patient: payload.patientId,
      invoice: invoice._id,
      amount: amountPaid,
      method: payload.paymentMethod,
      status: 'paid',
      transactionReference: payload.transactionDetails || `TXN-${Date.now()}`,
    })
  }

  let emiPlan = null

  if (payload.paymentMethod === 'emi') {
    const { installmentAmount, paidInstallments, schedule } = buildEmiSchedule({
      dueDate,
      totalAmount,
      emiInstallments: Number(payload.emiInstallments || 6),
      amountPaid,
    })

    emiPlan = await createEmiPlan({
      patient: payload.patientId,
      invoice: invoice._id,
      totalAmount,
      installmentAmount,
      totalInstallments: Number(payload.emiInstallments || 6),
      paidInstallments,
      nextDueDate: schedule.find((item) => item.status === 'pending')?.dueDate,
      status: paidInstallments >= Number(payload.emiInstallments || 6) ? 'completed' : 'active',
      schedule,
    })
  }

  await Promise.all([
    createOperationalNotification({
      title: 'New invoice created',
      body: `${payload.patientName} billing record ${invoiceNumber} is now live.`,
      type: payload.paymentMethod === 'emi' ? 'payment_pending' : 'billing_created',
      entityType: 'Invoice',
      entityId: invoice._id,
    }),
    logActivity({
      actorEmail: actor?.email,
      actorRole: actor?.role || 'admin',
      action: 'invoice.created',
      entityType: 'Invoice',
      entityId: invoice._id,
      metadata: {
        patientId: payload.patientId,
        amount: totalAmount,
        paymentMethod: payload.paymentMethod,
      },
    }),
  ])

  const hydratedInvoice = await findInvoiceById(invoice._id)
  emitClinicEvent('invoice:created', { invoice: hydratedInvoice })
  if (emiPlan) {
    emitClinicEvent('emi:created', { emiPlan })
  }

  return { invoice: hydratedInvoice, emiPlan }
}
