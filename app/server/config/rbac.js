export const ROLE_LABELS = {
  admin: 'Admin',
  dentist: 'Dentist',
  receptionist: 'Receptionist',
  finance_manager: 'Finance Manager',
  assistant: 'Assistant',
}

export const PERMISSIONS = {
  managePatients: 'manage_patients',
  manageAppointments: 'manage_appointments',
  manageInvoices: 'manage_invoices',
  manageBilling: 'manage_billing',
  manageReviews: 'manage_reviews',
  generateReports: 'generate_reports',
}

export const ROLE_PERMISSIONS = {
  admin: Object.values(PERMISSIONS),
  dentist: [
    PERMISSIONS.managePatients,
    PERMISSIONS.manageAppointments,
    PERMISSIONS.manageReviews,
  ],
  receptionist: [
    PERMISSIONS.managePatients,
    PERMISSIONS.manageAppointments,
  ],
  finance_manager: [
    PERMISSIONS.manageInvoices,
    PERMISSIONS.manageBilling,
    PERMISSIONS.generateReports,
  ],
  assistant: [
    PERMISSIONS.managePatients,
    PERMISSIONS.manageAppointments,
    PERMISSIONS.manageReviews,
  ],
}

export function getPermissionsForRole(role = 'assistant') {
  return ROLE_PERMISSIONS[role] || []
}

export function can(role, permission) {
  return getPermissionsForRole(role).includes(permission)
}
