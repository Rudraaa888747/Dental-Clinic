import { assert, isValidPhone } from './sharedValidators.js'

export function validatePatientPayload(payload = {}) {
  assert(payload.fullName?.trim(), 'Patient full name is required.')
  assert(payload.phone?.trim(), 'Patient phone number is required.')
  assert(isValidPhone(payload.phone), 'Please provide a valid patient phone number.')
}
