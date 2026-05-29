import { createPrintableReport, createCsv } from '../utils/reporting.js'
import { formatCurrency } from '../utils/formatters.js'

export function generateReport(type, source) {
  const builders = {
    revenue: () => {
      const rows = source.invoices.map((invoice) => ({
        invoice: invoice.invoiceNumber,
        patient: invoice.patient?.fullName || 'Unknown',
        status: invoice.status,
        total: invoice.totalAmount,
        paid: invoice.amountPaid,
        balance: invoice.balanceDue,
      }))

      const summary = [
        { label: 'Revenue', value: formatCurrency(source.invoices.reduce((sum, invoice) => sum + invoice.totalAmount, 0)) },
        { label: 'Collected', value: formatCurrency(source.invoices.reduce((sum, invoice) => sum + invoice.amountPaid, 0)) },
        { label: 'Outstanding', value: formatCurrency(source.invoices.reduce((sum, invoice) => sum + invoice.balanceDue, 0)) },
      ]

      return { title: 'Revenue Report', rows, summary }
    },
    treatments: () => {
      const rows = source.appointments.map((appointment) => ({
        patient: appointment.patient?.fullName || appointment.name,
        treatment: appointment.treatment?.name || appointment.service,
        doctor: appointment.doctor?.fullName || 'Unassigned',
        status: appointment.status,
        date: appointment.date,
      }))

      const summary = [
        { label: 'Appointments', value: source.appointments.length },
        { label: 'Completed', value: source.appointments.filter((item) => item.status === 'completed').length },
        { label: 'Pending', value: source.appointments.filter((item) => item.status === 'pending').length },
      ]

      return { title: 'Treatment Report', rows, summary }
    },
    patients: () => {
      const rows = source.patients.map((patient) => ({
        patient: patient.fullName,
        phone: patient.phone,
        status: patient.status,
        joined: new Date(patient.createdAt).toLocaleDateString('en-IN'),
      }))
      const summary = [
        { label: 'Patients', value: source.patients.length },
        { label: 'Active', value: source.patients.filter((patient) => patient.status === 'Active').length },
        { label: 'Follow-up', value: source.patients.filter((patient) => patient.status === 'Follow-up').length },
      ]
      return { title: 'Patient Report', rows, summary }
    },
    doctors: () => {
      const rows = source.appointments.map((appointment) => ({
        doctor: appointment.doctor?.fullName || 'Unassigned',
        patient: appointment.patient?.fullName || appointment.name,
        treatment: appointment.treatment?.name || appointment.service,
        status: appointment.status,
      }))
      const summary = [
        { label: 'Doctors', value: source.doctors.length },
        { label: 'Assigned bookings', value: source.appointments.filter((item) => item.doctor).length },
        { label: 'Completed', value: source.appointments.filter((item) => item.status === 'completed').length },
      ]
      return { title: 'Doctor Performance Report', rows, summary }
    },
    emi: () => {
      const rows = source.emiPlans.map((plan) => ({
        patient: plan.patient?.fullName || 'Unknown',
        installments: `${plan.paidInstallments}/${plan.totalInstallments}`,
        monthlyAmount: plan.installmentAmount,
        nextDueDate: plan.nextDueDate ? new Date(plan.nextDueDate).toLocaleDateString('en-IN') : '',
        status: plan.status,
      }))
      const summary = [
        { label: 'EMI Plans', value: source.emiPlans.length },
        { label: 'Overdue', value: source.emiPlans.filter((plan) => plan.status === 'overdue').length },
        { label: 'Portfolio', value: formatCurrency(source.emiPlans.reduce((sum, plan) => sum + plan.totalAmount, 0)) },
      ]
      return { title: 'EMI Report', rows, summary }
    },
  }

  const report = (builders[type] || builders.revenue)()
  return {
    ...report,
    csv: createCsv(report.rows),
    printable: createPrintableReport(report.title, report.summary, report.rows),
  }
}
