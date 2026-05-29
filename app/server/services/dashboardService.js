import { findAppointments } from '../repositories/appointmentRepository.js'
import { findEmiPlans, findInvoices } from '../repositories/billingRepository.js'
import { findClinicContentByKey, findDoctors, findInquiries, findNotifications, findTreatments } from '../repositories/clinicRepository.js'
import { findPatients } from '../repositories/patientRepository.js'
import { listReviews } from './reviewService.js'
import { buildAiInsights } from './aiInsightsService.js'
import { defaultContent } from '../data/defaultContent.js'
import { listActivityLogs } from './activityLogService.js'
import { listAdminUsers } from '../repositories/adminRepository.js'
import { listNotifications } from './notificationService.js'
import { ROLE_LABELS } from '../config/rbac.js'

export async function getDashboardPayload(user) {
  const [appointments, inquiries, contentRecord, patients, invoices, doctors, treatments, reviewBundle, notificationBundle, emiPlans, activityLogs, adminUsers] =
    await Promise.all([
      findAppointments(),
      findInquiries(),
      findClinicContentByKey('website-content'),
      findPatients(),
      findInvoices(),
      findDoctors(),
      findTreatments(),
      listReviews(),
      listNotifications(),
      findEmiPlans(),
      listActivityLogs(),
      listAdminUsers(),
    ])

  const revenue = invoices.reduce((sum, invoice) => sum + (invoice.amountPaid || 0), 0)

  return {
    appointments,
    inquiries,
    patients,
    invoices,
    doctors,
    treatments,
    reviews: reviewBundle.reviews,
    reviewAnalytics: reviewBundle.analytics,
    notifications: notificationBundle.notifications,
    unreadNotifications: notificationBundle.unreadCount,
    emiPlans,
    activityLogs,
    adminUsers,
    aiInsights: buildAiInsights({ appointments, inquiries, invoices, patients, emiPlans }),
    currentUser: user
      ? {
          ...user,
          roleLabel: ROLE_LABELS[user.role],
        }
      : null,
    metrics: {
      totalConsultations: appointments.length,
      pendingTriage: appointments.filter((item) => item.status === 'pending').length,
      confirmedToday: appointments.filter((item) => item.status === 'confirmed').length,
      treatmentsCompleted: appointments.filter((item) => item.status === 'completed').length,
      monthlyRevenue: revenue,
      totalPatients: patients.length,
    },
    content: contentRecord?.content || defaultContent,
  }
}
