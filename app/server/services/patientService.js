import { findAppointments } from '../repositories/appointmentRepository.js'
import { findFilesByPatient, findMedicalRecordsByPatient, findPrescriptionsByPatient } from '../repositories/clinicRepository.js'
import { findEmiPlans, findInvoices, findPaymentsByPatient } from '../repositories/billingRepository.js'
import { createPatient, findPatientById, findPatientByPhone, findPatients } from '../repositories/patientRepository.js'
import { normalizePhone } from '../utils/formatters.js'
import { validatePatientPayload } from '../validators/patientValidators.js'
import { createOperationalNotification } from './notificationService.js'
import { logActivity } from './activityLogService.js'
import { emitClinicEvent } from './socketService.js'

export async function registerPatient(payload, actor) {
  validatePatientPayload(payload)
  const phone = normalizePhone(payload.phone)
  const existing = await findPatientByPhone(phone)

  if (existing) {
    const error = new Error('A patient with this phone number already exists.')
    error.status = 409
    throw error
  }

  const patient = await createPatient({
    ...payload,
    phone,
    fullName: payload.fullName.trim(),
  })

  await Promise.all([
    createOperationalNotification({
      title: 'New patient created',
      body: `${patient.fullName} was added to the clinic system.`,
      type: 'patient_created',
      entityType: 'Patient',
      entityId: patient._id,
    }),
    logActivity({
      actorEmail: actor?.email,
      actorRole: actor?.role || 'assistant',
      action: 'patient.created',
      entityType: 'Patient',
      entityId: patient._id,
      metadata: { patientName: patient.fullName },
    }),
  ])

  emitClinicEvent('patient:created', { patient })
  return patient
}

export async function listPatients() {
  return await findPatients()
}

export async function getPatientProfile(patientId) {
  const patient = await findPatientById(patientId)

  if (!patient) {
    const error = new Error('Patient not found.')
    error.status = 404
    throw error
  }

  const [appointments, invoices, emiPlans, payments, medicalRecords, prescriptions, files] =
    await Promise.all([
      findAppointments(),
      findInvoices(),
      findEmiPlans(),
      findPaymentsByPatient(patientId),
      findMedicalRecordsByPatient(patientId),
      findPrescriptionsByPatient(patientId),
      findFilesByPatient(patientId),
    ])

  const patientAppointments = appointments.filter(
    (appointment) => `${appointment.patient?._id || appointment.patient}` === `${patientId}`,
  )
  const patientInvoices = invoices.filter(
    (invoice) => `${invoice.patient?._id || invoice.patient}` === `${patientId}`,
  )
  const patientEmiPlans = emiPlans.filter(
    (plan) => `${plan.patient?._id || plan.patient}` === `${patientId}`,
  )
  const lifetimeValue = patientInvoices.reduce((sum, invoice) => sum + (invoice.totalAmount || 0), 0)

  return {
    patient,
    appointments: patientAppointments,
    invoices: patientInvoices,
    emiPlans: patientEmiPlans,
    payments,
    medicalRecords,
    prescriptions,
    files,
    lifetimeValue,
  }
}
