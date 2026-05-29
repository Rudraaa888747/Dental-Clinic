import { normalizePhone, startOfToday } from '../utils/formatters.js'

export function isValidPhone(phone) {
  const normalized = normalizePhone(phone)
  return normalized.length >= 7 && normalized.length <= 15
}

export function isValidFutureDate(dateValue) {
  const date = new Date(dateValue)
  return !Number.isNaN(date.getTime()) && date >= startOfToday()
}

export function assert(condition, message, status = 400) {
  if (!condition) {
    const error = new Error(message)
    error.status = status
    throw error
  }
}
