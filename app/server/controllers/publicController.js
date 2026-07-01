import { Appointment } from '../models/Appointment.js'
import { defaultContent } from '../data/defaultContent.js'
import { findClinicContentByKey, createInquiry, createNotification } from '../repositories/clinicRepository.js'
import { normalizePhone } from '../utils/formatters.js'
import { validatePublicAppointmentPayload } from '../validators/bookingValidators.js'
import { emitRoleEvent } from '../services/socketService.js'

export async function getHealth(_request, response) {
  response.json({ ok: true })
}

export async function getContent(_request, response) {
  const record = await findClinicContentByKey('website-content')
  return response.json({ content: record?.content || defaultContent })
}

export async function createPublicAppointment(request, response) {
  const payload = request.body
  validatePublicAppointmentPayload(payload)

  const appointment = await Appointment.create({
    name: payload.name.trim(),
    phone: normalizePhone(payload.phone),
    service: payload.service.trim(),
    date: payload.date,
    time: payload.time,
    status: 'pending',
  })

  const notification = await createNotification({
    type: 'appointment',
    title: 'New Online Booking',
    body: `${appointment.name} booked a ${appointment.service}.`,
    entityType: 'appointment',
    entityId: appointment._id,
  })
  
  emitRoleEvent('admin', 'notification:new', { notification })
  emitRoleEvent('admin', 'appointment:created', { appointment })

  return response.status(201).json({ appointment })
}

export async function createPublicInquiry(request, response) {
  const { name, phone, message } = request.body

  if (!name || !phone || !message) {
    return response.status(400).json({ message: 'Please complete all contact form fields.' })
  }

  const inquiry = await createInquiry({
    name: name.trim(),
    phone: normalizePhone(phone),
    message: message.trim(),
  })

  const notification = await createNotification({
    type: 'inquiry',
    title: 'New Patient Inquiry',
    body: `Inquiry from ${inquiry.name}: ${inquiry.message.substring(0, 50)}...`,
    entityType: 'inquiry',
    entityId: inquiry._id,
  })

  emitRoleEvent('admin', 'notification:new', { notification })

  return response.status(201).json({ inquiry })
}
