import express from 'express'
import { isDatabaseConnected } from '../config/db.js'
import { defaultContent } from '../data/defaultContent.js'
import { Appointment } from '../models/Appointment.js'
import { ClinicContent } from '../models/ClinicContent.js'
import { Inquiry } from '../models/Inquiry.js'

function normalizePhone(phone = '') {
  return phone.replace(/\D/g, '')
}

function isValidPhone(phone) {
  const normalized = normalizePhone(phone)
  return normalized.length >= 7 && normalized.length <= 15
}

function isValidFutureDate(dateValue) {
  const date = new Date(dateValue)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return !Number.isNaN(date.getTime()) && date >= today
}

const router = express.Router()

router.get('/health', (_request, response) => {
  response.json({ ok: true })
})

router.get('/content', async (_request, response) => {
  if (!isDatabaseConnected()) {
    return response.status(503).json({
      message: 'Content is unavailable until the database is available.',
    })
  }

  const record = await ClinicContent.findOne({ key: 'website-content' }).lean()
  return response.json({ content: record?.content || defaultContent })
})

router.post('/appointments', async (request, response) => {
  const { name, phone, service, date, time } = request.body

  if (!name || !phone || !service || !date || !time) {
    return response.status(400).json({ message: 'Please complete all appointment fields.' })
  }

  if (!isValidPhone(phone)) {
    return response.status(400).json({ message: 'Please provide a valid phone number.' })
  }

  if (!isValidFutureDate(date)) {
    return response.status(400).json({ message: 'Please select a valid appointment date.' })
  }

  if (!isDatabaseConnected()) {
    return response.status(503).json({
      message: 'Appointments cannot be booked until the database is available.',
    })
  }

  const payload = {
    name: name.trim(),
    phone: normalizePhone(phone),
    service,
    date,
    time,
    status: 'pending',
  }

  const appointment = await Appointment.create(payload)
  return response.status(201).json({ appointment })
})

router.post('/inquiries', async (request, response) => {
  const { name, phone, message } = request.body

  if (!name || !phone || !message) {
    return response.status(400).json({ message: 'Please complete all contact form fields.' })
  }

  if (!isValidPhone(phone)) {
    return response.status(400).json({ message: 'Please provide a valid phone number.' })
  }

  if (!isDatabaseConnected()) {
    return response.status(503).json({
      message: 'Contact submissions are unavailable until the database is available.',
    })
  }

  const normalizedPhone = normalizePhone(phone)
  const inquiry = await Inquiry.create({
    name: name.trim(),
    phone: normalizedPhone,
    message: message.trim(),
  })
  return response.status(201).json({ inquiry })
})

export default router
