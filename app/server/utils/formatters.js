export function normalizePhone(phone = '') {
  return phone.replace(/\D/g, '')
}

export function formatCurrency(amount = 0) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function createInvoiceNumber() {
  const year = new Date().getFullYear()
  const serial = Math.floor(100 + Math.random() * 900)
  return `INV-${year}-${serial}`
}

export function startOfToday() {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  return date
}

export function addDays(date, days) {
  const value = new Date(date)
  value.setDate(value.getDate() + days)
  return value
}
