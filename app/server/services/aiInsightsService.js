import { formatCurrency } from '../utils/formatters.js'

export function buildAiInsights({ appointments, inquiries, invoices, patients, emiPlans }) {
  const overdueInvoices = invoices.filter((invoice) => invoice.status === 'Overdue')
  const pendingEmi = emiPlans.filter((plan) => plan.status !== 'completed')
  const missedLeads = inquiries.filter((inquiry) => {
    const inquiryPhone = inquiry.phone
    return !patients.some((patient) => patient.phone === inquiryPhone)
  })
  const completedAppointments = appointments.filter((item) => item.status === 'completed').length
  const conversionRate = appointments.length ? Math.round((completedAppointments / appointments.length) * 100) : 0

  return [
    {
      id: 'missed-leads',
      title: 'Missed high-intent leads',
      body: `${missedLeads.length} inquiry${missedLeads.length === 1 ? '' : 'ies'} have not been converted into patient records yet.`,
      actionLabel: 'Prompt follow-up',
      accent: 'amber',
    },
    {
      id: 'overdue-payments',
      title: 'Collections attention',
      body: `${overdueInvoices.length} invoice${overdueInvoices.length === 1 ? '' : 's'} are overdue. Exposure: ${formatCurrency(
        overdueInvoices.reduce((sum, invoice) => sum + (invoice.balanceDue || 0), 0),
      )}.`,
      actionLabel: 'Send reminders',
      accent: 'rose',
    },
    {
      id: 'emi-pipeline',
      title: 'EMI portfolio health',
      body: `${pendingEmi.length} active EMI plan${pendingEmi.length === 1 ? '' : 's'} need monitoring this cycle.`,
      actionLabel: 'Review EMI queue',
      accent: 'emerald',
    },
    {
      id: 'conversion',
      title: 'Treatment conversion insight',
      body: `${conversionRate}% of scheduled appointments are already marked completed.`,
      actionLabel: 'Inspect schedule',
      accent: 'sky',
    },
  ]
}
