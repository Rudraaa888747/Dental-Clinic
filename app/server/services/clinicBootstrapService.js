import { Doctor } from '../models/Doctor.js'
import { AdminUser } from '../models/AdminUser.js'
import { FileAsset } from '../models/FileAsset.js'
import { MedicalRecord } from '../models/MedicalRecord.js'
import { Permission } from '../models/Permission.js'
import { Prescription } from '../models/Prescription.js'
import { Review } from '../models/Review.js'
import { Treatment } from '../models/Treatment.js'
import { Patient } from '../models/Patient.js'
import { upsertPermission, upsertRole } from '../repositories/clinicRepository.js'
import bcrypt from 'bcryptjs'
import { syncTreatmentCatalogFromContent } from './treatmentCatalogService.js'

let seeded = false

const basePatientSeeds = [
  {
    fullName: 'Vikram Sharma',
    phone: '9876543210',
    email: 'vikram@example.com',
    age: 34,
    gender: 'Male',
    bloodGroup: 'B+',
    allergies: 'Mild latex sensitivity',
    dentalHistory: 'Completed consultation and 3D scan',
    medicalHistory: 'No systemic conditions reported',
    status: 'Active',
  },
  {
    fullName: 'Ananya Desai',
    phone: '9898989898',
    email: 'ananya@example.com',
    age: 29,
    gender: 'Female',
    bloodGroup: 'O+',
    dentalHistory: 'Cosmetic smile design evaluation',
    medicalHistory: 'History of enamel sensitivity',
    status: 'Follow-up',
  },
  {
    fullName: 'Rahul Verma',
    phone: '9811122233',
    email: 'rahul.verma@example.com',
    age: 41,
    gender: 'Male',
    bloodGroup: 'A+',
    dentalHistory: 'Root canal completed on lower molar',
    medicalHistory: 'Occasional hypertension under control',
    status: 'Completed',
  },
  {
    fullName: 'Sneha Patel',
    phone: '9822233344',
    email: 'sneha.patel@example.com',
    age: 32,
    gender: 'Female',
    bloodGroup: 'AB+',
    dentalHistory: 'Teeth whitening and enamel polish consultation',
    medicalHistory: 'No known medical concerns',
    status: 'Active',
  },
  {
    fullName: 'Arjun Malhotra',
    phone: '9833344455',
    email: 'arjun.malhotra@example.com',
    age: 37,
    gender: 'Male',
    bloodGroup: 'O-',
    dentalHistory: 'Planning veneer smile makeover',
    medicalHistory: 'Mild clenching habit reported',
    status: 'Prospect',
  },
  {
    fullName: 'Priya Nair',
    phone: '9844455566',
    email: 'priya.nair@example.com',
    age: 27,
    gender: 'Female',
    bloodGroup: 'B-',
    dentalHistory: 'Clear aligner refinement phase',
    medicalHistory: 'No systemic conditions reported',
    status: 'Active',
  },
]

const reviewSeedMap = {
  'Vikram Sharma': {
    rating: 5,
    comment: 'Incredible experience. The aligner workflow felt premium from day one.',
    featured: true,
    adminReply: 'Thank you, Vikram. We loved guiding your smile journey.',
    repliedAt: new Date(),
  },
  'Ananya Desai': {
    rating: 5,
    comment: 'Transparent pricing and a beautiful clinic. Highly recommended.',
    requestStatus: 'received',
  },
  'Rahul Verma': {
    rating: 5,
    comment: 'The root canal was surprisingly calm and painless. The team explained every step with confidence.',
    adminReply: 'We are so glad your treatment felt comfortable, Rahul. Thank you for trusting us.',
    repliedAt: new Date(),
  },
  'Sneha Patel': {
    rating: 5,
    comment: 'The clinic atmosphere feels luxurious, but the care is still warm and personal. Whitening results were excellent.',
    featured: true,
  },
  'Arjun Malhotra': {
    rating: 4,
    comment: 'Very impressive consultation experience and digital smile planning. Looking forward to starting treatment.',
  },
  'Priya Nair': {
    rating: 5,
    comment: 'My aligner follow-ups are always on time, and the doctors make the whole process feel effortless.',
    adminReply: 'Thank you, Priya. We are excited to keep your smile journey seamless.',
    repliedAt: new Date(),
  },
}

export async function ensureOperationalSeedData() {
  if (seeded) return

  await Promise.all([
    AdminUser.updateMany(
      {
        role: {
          $exists: true,
          $nin: ['admin', 'dentist', 'receptionist', 'finance_manager', 'assistant'],
        },
      },
      { $set: { role: 'admin' } },
    ),
  ])

  const [doctorCount, treatmentCount, permissionCount, patientCount, reviewCount, adminCount] =
    await Promise.all([
      Doctor.countDocuments(),
      Treatment.countDocuments(),
      Permission.countDocuments(),
      Patient.countDocuments(),
      Review.countDocuments(),
      AdminUser.countDocuments(),
    ])

  if (!doctorCount) {
    await Doctor.insertMany([
      { fullName: 'Dr. Aanya Kapoor', specialty: 'Cosmetic Dentistry', email: 'aanya@azureos.local', phone: '+919876543210' },
      { fullName: 'Dr. Rudra Mehta', specialty: 'Orthodontics', email: 'rudra@azureos.local', phone: '+919845612340' },
      { fullName: 'Dr. Ira Sen', specialty: 'Endodontics', email: 'ira@azureos.local', phone: '+919912345678' },
    ])
  }

  if (!treatmentCount) {
    await Treatment.insertMany([
      { name: 'Invisible Aligners', category: 'Orthodontics', basePrice: 80000, durationMinutes: 90 },
      { name: 'Porcelain Veneers', category: 'Cosmetic', basePrice: 85000, durationMinutes: 120 },
      { name: 'Root Canal', category: 'Restorative', basePrice: 15000, durationMinutes: 75 },
      { name: 'Teeth Whitening', category: 'Cosmetic', basePrice: 8500, durationMinutes: 45 },
    ])
  }

  if (!permissionCount) {
    const permissions = await Promise.all(
      [
        ['appointments.manage', 'Manage appointments'],
        ['patients.manage', 'Manage patients'],
        ['billing.manage', 'Manage billing'],
        ['reviews.manage', 'Manage reviews'],
        ['reports.export', 'Export reports'],
      ].map(([key, label]) => upsertPermission(key, { key, label })),
    )

    await Promise.all([
      upsertRole('admin', { name: 'admin', label: 'Admin', permissions }),
      upsertRole('dentist', { name: 'dentist', label: 'Dentist', permissions: permissions.slice(0, 2) }),
      upsertRole('receptionist', { name: 'receptionist', label: 'Receptionist', permissions: permissions.slice(0, 2) }),
      upsertRole('finance_manager', { name: 'finance_manager', label: 'Finance Manager', permissions: permissions.slice(2, 5) }),
    ])
  }

  if (!adminCount) {
    const sharedPassword = process.env.ADMIN_PASSWORD || 'AzureOS123'
    const passwordHash = await bcrypt.hash(sharedPassword, 10)
    const configuredEmail = process.env.ADMIN_EMAIL || 'admin@azureos.local'

    await AdminUser.insertMany([
      { email: configuredEmail, passwordHash, fullName: 'Dr. Aanya Kapoor', role: 'admin' },
      { email: 'dentist@azureos.local', passwordHash, fullName: 'Dr. Rudra Mehta', role: 'dentist' },
      { email: 'reception@azureos.local', passwordHash, fullName: 'Mira Sethi', role: 'receptionist' },
      { email: 'finance@azureos.local', passwordHash, fullName: 'Kabir Khanna', role: 'finance_manager' },
      { email: 'assistant@azureos.local', passwordHash, fullName: 'Sara Nair', role: 'assistant' },
    ])
  }

  if (!patientCount || !reviewCount) {
    void patientCount
    void reviewCount
  }

  const doctors = await Doctor.find().sort({ createdAt: 1 }).limit(3)
  const createdPatients = []

  for (const patientSeed of basePatientSeeds) {
    let patient = await Patient.findOne({ phone: patientSeed.phone })

    if (!patient) {
      patient = await Patient.create(patientSeed)
    }

    createdPatients.push(patient)
  }

  const [aanya, rudra, ira] = doctors
  const doctorAssignments = {
    'Vikram Sharma': aanya,
    'Ananya Desai': rudra,
    'Rahul Verma': ira || rudra,
    'Sneha Patel': aanya,
    'Arjun Malhotra': rudra,
    'Priya Nair': aanya,
  }

  const medicalSeeds = {
    'Vikram Sharma': {
      diagnosis: 'Class II malocclusion',
      notes: 'Candidate for aligner treatment.',
    },
    'Ananya Desai': {
      diagnosis: 'Smile makeover planning',
      notes: 'Needs veneer mockup review.',
    },
    'Rahul Verma': {
      diagnosis: 'Post endodontic recovery',
      notes: 'Healing is progressing well after root canal treatment.',
    },
    'Sneha Patel': {
      diagnosis: 'Extrinsic enamel staining',
      notes: 'Excellent candidate for whitening maintenance plan.',
    },
    'Arjun Malhotra': {
      diagnosis: 'Cosmetic veneer candidate',
      notes: 'Requested high-definition digital smile preview.',
    },
    'Priya Nair': {
      diagnosis: 'Aligner refinement review',
      notes: 'Final rotation corrections look on track.',
    },
  }

  const prescriptionSeeds = {
    'Vikram Sharma': {
      medications: [{ name: 'Ibuprofen', dosage: '200mg', instructions: 'After aligner fitting if needed' }],
      notes: 'Soft diet for 24 hours.',
    },
    'Ananya Desai': {
      medications: [{ name: 'Fluoride Gel', dosage: 'Night use', instructions: 'Apply daily for 2 weeks' }],
      notes: 'Avoid cold beverages.',
    },
    'Rahul Verma': {
      medications: [{ name: 'Amoxicillin', dosage: '500mg', instructions: 'Twice daily for 3 days after procedure' }],
      notes: 'Review discomfort in next follow-up if sensitivity persists.',
    },
    'Sneha Patel': {
      medications: [{ name: 'Desensitizing Paste', dosage: 'Pea-sized amount', instructions: 'Use nightly for 5 days' }],
      notes: 'Use a soft-bristle brush for 1 week.',
    },
    'Priya Nair': {
      medications: [{ name: 'Orthodontic Wax', dosage: 'As needed', instructions: 'Use for tray edge irritation if required' }],
      notes: 'Continue wearing aligners 22 hours daily.',
    },
  }

  const fileSeeds = {
    'Vikram Sharma': {
      label: 'Panoramic X-Ray',
      type: 'xray',
      url: 'https://example.com/files/panoramic-xray.jpg',
      mimeType: 'image/jpeg',
    },
    'Ananya Desai': {
      label: 'Veneer Mockup',
      type: 'report',
      url: 'https://example.com/files/veneer-mockup.pdf',
      mimeType: 'application/pdf',
    },
    'Rahul Verma': {
      label: 'Root Canal Progress Scan',
      type: 'report',
      url: 'https://example.com/files/root-canal-progress.pdf',
      mimeType: 'application/pdf',
    },
    'Priya Nair': {
      label: 'Aligner Tracking Photos',
      type: 'treatment-photo',
      url: 'https://example.com/files/aligner-tracking.jpg',
      mimeType: 'image/jpeg',
    },
  }

  for (const patient of createdPatients) {
    const patientName = patient.fullName
    const assignedDoctor = doctorAssignments[patientName]

    if (medicalSeeds[patientName]) {
      const existingMedicalRecord = await MedicalRecord.findOne({ patient: patient._id })
      if (!existingMedicalRecord) {
        await MedicalRecord.create({
          patient: patient._id,
          doctor: assignedDoctor?._id,
          ...medicalSeeds[patientName],
        })
      }
    }

    if (prescriptionSeeds[patientName]) {
      const existingPrescription = await Prescription.findOne({ patient: patient._id })
      if (!existingPrescription) {
        await Prescription.create({
          patient: patient._id,
          doctor: assignedDoctor?._id,
          ...prescriptionSeeds[patientName],
        })
      }
    }

    if (fileSeeds[patientName]) {
      const existingFile = await FileAsset.findOne({ patient: patient._id, label: fileSeeds[patientName].label })
      if (!existingFile) {
        await FileAsset.create({
          patient: patient._id,
          uploadedBy: 'system',
          ...fileSeeds[patientName],
        })
      }
    }

    if (reviewSeedMap[patientName]) {
      const existingReview = await Review.findOne({ patient: patient._id })
      if (!existingReview) {
        await Review.create({
          patient: patient._id,
          ...reviewSeedMap[patientName],
        })
      }
    }
  }

  await syncTreatmentCatalogFromContent()

  seeded = true
}
