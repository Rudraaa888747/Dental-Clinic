import { Patient } from '../models/Patient.js'

export async function createPatient(payload) {
  return await Patient.create(payload)
}

export async function findPatients() {
  return await Patient.find().sort({ createdAt: -1 }).lean()
}

export async function findPatientById(id) {
  return await Patient.findById(id).lean()
}

export async function findPatientByPhone(phone) {
  return await Patient.findOne({ phone }).lean()
}
