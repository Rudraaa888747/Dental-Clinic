import { updateAppointmentStatus } from '../repositories/appointmentRepository.js'
import { findDoctors, findTreatments } from '../repositories/clinicRepository.js'
import { findInvoices, findEmiPlans } from '../repositories/billingRepository.js'
import { getDashboardPayload } from '../services/dashboardService.js'
import { registerPatient, getPatientProfile } from '../services/patientService.js'
import { createBookingWithFinancials, createStandaloneInvoice, updateInvoicePayment } from '../services/billingService.js'
import { replyToReview } from '../services/reviewService.js'
import { validateAdminBookingPayload } from '../validators/bookingValidators.js'
import { findPatientById } from '../repositories/patientRepository.js'
import { generateReport } from '../services/reportService.js'
import { listActivityLogs, logActivity } from '../services/activityLogService.js'
import { listNotifications, markNotificationRead } from '../services/notificationService.js'
import { buildCommandPaletteResults } from '../services/searchService.js'
import { emitClinicEvent } from '../services/socketService.js'
import { createOperationalNotification } from '../services/notificationService.js'
import { getSettingsBundle, syncTreatmentCatalogFromContent, updateClinicSettings } from '../services/treatmentCatalogService.js'

export async function getAdminDashboard(request, response) {
  response.json(await getDashboardPayload(request.user))
}

export async function createAdminPatient(request, response) {
  const patient = await registerPatient(request.body, request.user)
  response.status(201).json({ patient })
}

export async function createAdminBooking(request, response) {
  validateAdminBookingPayload(request.body)
  const patient = await findPatientById(request.body.patientId)
  const doctors = await findDoctors()
  const treatments = await findTreatments()
  const doctor = doctors.find((item) => `${item._id}` === `${request.body.doctorId}`)
  const treatment = treatments.find((item) => `${item._id}` === `${request.body.treatmentId}`)

  const result = await createBookingWithFinancials(
    {
      ...request.body,
      patientName: patient.fullName,
      patientPhone: patient.phone,
      treatmentName: treatment?.name || 'Consultation',
      estimatedAmount: Number(request.body.estimatedAmount || treatment?.basePrice || 0),
      advanceAmount: Number(request.body.advanceAmount || 0),
      emiInstallments: Number(request.body.emiInstallments || 6),
      doctorId: doctor?._id || request.body.doctorId,
    },
    request.user,
  )

  response.status(201).json(result)
}

export async function getAdminPatientProfile(request, response) {
  response.json(await getPatientProfile(request.params.id))
}

export async function patchAppointmentStatus(request, response) {
  const { status } = request.body
  if (!['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'].includes(status)) {
    return response.status(400).json({ message: 'Invalid appointment status.' })
  }

  const appointment = await updateAppointmentStatus(request.params.id, status)
  await Promise.all([
    logActivity({
      actorEmail: request.user.email,
      actorRole: request.user.role,
      action: 'appointment.status_updated',
      entityType: 'Appointment',
      entityId: appointment._id,
      metadata: { status },
    }),
    createOperationalNotification({
      title: `Appointment ${status}`,
      body: `${appointment.patient?.fullName || appointment.name} is now marked ${status}.`,
      type: status === 'confirmed' ? 'appointment_confirmed' : 'appointment_updated',
      entityType: 'Appointment',
      entityId: appointment._id,
    }),
  ])
  emitClinicEvent('appointment:updated', { appointment })
  response.json({ appointment })
}

export async function getInvoiceList(_request, response) {
  response.json({ invoices: await findInvoices(), emiPlans: await findEmiPlans() })
}

export async function patchInvoice(request, response) {
  const invoice = await updateInvoicePayment(request.params.id, request.body, request.user)
  response.json({ invoice })
}

export async function createInvoiceRecord(request, response) {
  const patient = await findPatientById(request.body.patientId)
  const doctors = await findDoctors()
  const treatments = await findTreatments()
  const doctor = doctors.find((item) => `${item._id}` === `${request.body.doctorId}`)
  const treatment = treatments.find((item) => `${item._id}` === `${request.body.treatmentId}`)

  const result = await createStandaloneInvoice(
    {
      ...request.body,
      patientName: patient?.fullName || 'Patient',
      treatmentName: treatment?.name || 'Dental Treatment',
      lineItemLabel: request.body.lineItemLabel || treatment?.name || 'Dental Treatment',
      totalAmount: Number(request.body.totalAmount || treatment?.basePrice || 0),
      amountPaid: Number(request.body.amountPaid || 0),
      emiInstallments: Number(request.body.emiInstallments || 6),
      doctorId: doctor?._id || request.body.doctorId,
    },
    request.user,
  )

  response.status(201).json(result)
}

export async function replyReview(request, response) {
  response.json({ review: await replyToReview(request.params.id, request.body, request.user) })
}

export async function getCatalog(_request, response) {
  const [doctors, treatments] = await Promise.all([findDoctors(), findTreatments()])
  response.json({ doctors, treatments })
}

export async function generateAdminReport(request, response) {
  const dashboard = await getDashboardPayload(request.user)
  await logActivity({
    actorEmail: request.user.email,
    actorRole: request.user.role,
    action: 'report.generated',
    entityType: 'Report',
    metadata: { type: request.body.type || 'revenue' },
  })
  response.json({ report: generateReport(request.body.type, dashboard) })
}

export async function getSession(request, response) {
  response.json({ user: request.user })
}

export async function getNotifications(_request, response) {
  response.json(await listNotifications())
}

export async function patchNotificationRead(request, response) {
  response.json({ notification: await markNotificationRead(request.params.id) })
}

export async function getActivityLogs(request, response) {
  response.json({ activityLogs: await listActivityLogs(request.query.q || '') })
}

export async function searchAdminEntities(request, response) {
  const dashboard = await getDashboardPayload(request.user)
  const source = {
    ...dashboard,
    patients: request.user.permissions.includes('manage_patients') ? dashboard.patients : [],
    appointments: request.user.permissions.includes('manage_appointments') ? dashboard.appointments : [],
    invoices:
      request.user.permissions.includes('manage_invoices') ||
      request.user.permissions.includes('manage_billing')
        ? dashboard.invoices
        : [],
    reviews: request.user.permissions.includes('manage_reviews') ? dashboard.reviews : [],
  }
  response.json({
    results: buildCommandPaletteResults(request.query.q || '', source),
  })
}

export async function getSettings(_request, response) {
  response.json(await getSettingsBundle())
}

export async function patchSettings(request, response) {
  response.json({ content: await updateClinicSettings(request.body, request.user) })
}

export async function syncTreatments(request, response) {
  response.json({ treatments: await syncTreatmentCatalogFromContent(request.user) })
}
