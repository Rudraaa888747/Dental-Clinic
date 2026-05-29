import { assert, isValidFutureDate, isValidPhone } from './sharedValidators.js'

export function validatePublicAppointmentPayload(payload = {}) {
  assert(payload.name?.trim(), 'Please complete all appointment fields.')
  assert(payload.phone?.trim(), 'Please complete all appointment fields.')
  assert(payload.service?.trim(), 'Please complete all appointment fields.')
  assert(payload.date, 'Please complete all appointment fields.')
  assert(payload.time, 'Please complete all appointment fields.')
  assert(isValidPhone(payload.phone), 'Please provide a valid phone number.')
  assert(isValidFutureDate(payload.date), 'Please select a valid appointment date.')
}

export function validateAdminBookingPayload(payload = {}) {
  assert(payload.patientId, 'Select a patient before confirming the booking.')
  assert(payload.treatmentId, 'Select a treatment before confirming the booking.')
  assert(payload.doctorId, 'Assign a doctor before confirming the booking.')
  assert(payload.date, 'Choose an appointment date.')
  assert(payload.time, 'Choose an appointment time.')
  assert(isValidFutureDate(payload.date), 'Please select a valid appointment date.')
  assert(payload.paymentMethod, 'Select a payment method.')
}
