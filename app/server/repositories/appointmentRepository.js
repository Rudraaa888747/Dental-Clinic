import { Appointment } from '../models/Appointment.js'

export async function createAppointment(payload) {
  return await Appointment.create(payload)
}

export async function findAppointments() {
  return await Appointment.find()
    .populate('patient doctor treatment invoice')
    .sort({ createdAt: -1 })
    .lean()
}

export async function updateAppointmentStatus(id, status) {
  return await Appointment.findByIdAndUpdate(id, { status }, { new: true })
    .populate('patient doctor treatment invoice')
    .lean()
}
