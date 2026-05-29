import { ClinicContent } from '../models/ClinicContent.js'
import { Doctor } from '../models/Doctor.js'
import { FileAsset } from '../models/FileAsset.js'
import { Inquiry } from '../models/Inquiry.js'
import { MedicalRecord } from '../models/MedicalRecord.js'
import { Notification } from '../models/Notification.js'
import { Permission } from '../models/Permission.js'
import { Prescription } from '../models/Prescription.js'
import { Role } from '../models/Role.js'
import { Treatment } from '../models/Treatment.js'

export async function findClinicContentByKey(key) {
  return await ClinicContent.findOne({ key }).lean()
}

export async function findInquiries() {
  return await Inquiry.find().sort({ createdAt: -1 }).lean()
}

export async function createInquiry(payload) {
  return await Inquiry.create(payload)
}

export async function findDoctors() {
  return await Doctor.find({ active: true }).sort({ fullName: 1 }).lean()
}

export async function findTreatments() {
  return await Treatment.find({ active: true }).sort({ name: 1 }).lean()
}

export async function upsertTreatment(query, payload) {
  return await Treatment.findOneAndUpdate(query, payload, {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
  })
}

export async function updateClinicContent(key, content) {
  return await ClinicContent.findOneAndUpdate(
    { key },
    { key, content },
    { upsert: true, new: true },
  ).lean()
}

export async function createNotification(payload) {
  return await Notification.create(payload)
}

export async function findNotifications() {
  return await Notification.find().sort({ createdAt: -1 }).limit(8).lean()
}

export async function findMedicalRecordsByPatient(patientId) {
  return await MedicalRecord.find({ patient: patientId }).populate('doctor').sort({ createdAt: -1 }).lean()
}

export async function findPrescriptionsByPatient(patientId) {
  return await Prescription.find({ patient: patientId }).populate('doctor').sort({ createdAt: -1 }).lean()
}

export async function findFilesByPatient(patientId) {
  return await FileAsset.find({ patient: patientId }).sort({ createdAt: -1 }).lean()
}

export async function upsertPermission(key, payload) {
  return await Permission.findOneAndUpdate({ key }, payload, { upsert: true, new: true })
}

export async function upsertRole(name, payload) {
  return await Role.findOneAndUpdate({ name }, payload, { upsert: true, new: true })
}
