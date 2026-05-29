import React, { useEffect, useMemo, useState } from 'react'
import { X, Calendar, User, FileText, Download, CheckCircle2, DollarSign, CreditCard, Clock, Wallet, Shield } from 'lucide-react'
import { api } from '../../lib/api'

function ModalWrapper({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.body.setAttribute('data-lenis-prevent', 'true')
    } else {
      document.body.style.overflow = ''
      document.body.removeAttribute('data-lenis-prevent')
    }
    return () => {
      document.body.style.overflow = ''
      document.body.removeAttribute('data-lenis-prevent')
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-[#020817]/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`bg-[#0F172A] border-t sm:border border-white/10 rounded-t-[32px] sm:rounded-[32px] w-full ${maxWidth} shadow-[0_-20px_60px_rgba(0,0,0,0.6)] sm:shadow-2xl overflow-hidden flex flex-col max-h-[92dvh] lg:max-h-[85dvh]`}>
        <div className="flex justify-between items-center p-5 sm:p-6 border-b border-white/5 bg-[#111827]">
          <h3 className="text-xl font-display font-medium text-white">{title}</h3>
          <button onClick={onClose} className="p-2 bg-white/5 rounded-full text-support-300 hover:text-white transition-colors active:scale-95">
            <X size={20} />
          </button>
        </div>
        <div className="p-5 sm:p-6 overflow-y-auto custom-scrollbar flex-1 text-support-200">
          {children}
        </div>
      </div>
    </div>
  )
}

const bookingInitialState = {
  patientMode: 'existing',
  patientId: '',
  newPatientName: '',
  newPatientPhone: '',
  newPatientEmail: '',
  treatmentId: '',
  doctorId: '',
  date: '',
  time: '',
  notes: '',
  paymentMethod: 'upi',
  transactionDetails: '',
  advanceAmount: '',
  emiInstallments: '6',
}

const patientInitialState = {
  fullName: '',
  phone: '',
  email: '',
  age: '',
  gender: '',
  bloodGroup: '',
  avatarUrl: '',
  allergies: '',
  medicalHistory: '',
  dentalHistory: '',
  notes: '',
}

const billingInitialState = {
  patientId: '',
  treatmentId: '',
  doctorId: '',
  lineItemLabel: '',
  totalAmount: '',
  amountPaid: '',
  paymentMethod: 'upi',
  transactionDetails: '',
  dueDate: '',
  emiInstallments: '6',
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export function NewBookingModal({
  isOpen,
  onClose,
  showToast,
  patients = [],
  doctors = [],
  treatments = [],
  onCreated,
}) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(bookingInitialState)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isOpen) {
      setStep(1)
      setForm(bookingInitialState)
      setSubmitting(false)
      setError('')
    }
  }, [isOpen])

  const selectedTreatment = useMemo(
    () => treatments.find((item) => item._id === form.treatmentId),
    [form.treatmentId, treatments],
  )

  const selectedPatient = useMemo(
    () => patients.find((item) => item._id === form.patientId),
    [form.patientId, patients],
  )

  const estimatedAmount = selectedTreatment?.basePrice || 0

  async function handleComplete() {
    if (form.patientMode === 'new') {
      if (!form.newPatientName || form.newPatientName.trim() === '') {
        setError('New Patient Full Name is required')
        return
      }
      if (!form.newPatientPhone || form.newPatientPhone.trim() === '') {
        setError('New Patient Phone is required')
        return
      }
      if (!/^\d{10}$/.test(form.newPatientPhone.trim())) {
        setError('New Patient Phone must be exactly 10 digits')
        return
      }
    } else if (!form.patientId) {
      setError('Please select a patient')
      return
    }

    if (!form.treatmentId) {
      setError('Please select a treatment')
      return
    }

    setError('')
    setSubmitting(true)

    try {
      let patientId = form.patientId

      if (form.patientMode === 'new') {
        const response = await api.createPatient({
          fullName: form.newPatientName,
          phone: form.newPatientPhone,
          email: form.newPatientEmail,
          status: 'Active',
        })
        patientId = response.patient._id
      }

      const response = await api.createAdminBooking({
        patientId,
        treatmentId: form.treatmentId,
        doctorId: form.doctorId,
        date: form.date,
        time: form.time,
        notes: form.notes,
        paymentMethod: form.paymentMethod,
        transactionDetails: form.transactionDetails,
        estimatedAmount,
        advanceAmount: form.advanceAmount || 0,
        emiInstallments: form.emiInstallments || 6,
      })

      onCreated?.(response)
      showToast('Booking, invoice, and payment workflow created successfully.')
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to complete booking')
    } finally {
      setSubmitting(false)
    }
  }

  const steps = [
    'Patient',
    'Treatment',
    'Doctor',
    'Date & Time',
    'Notes',
    'Payment',
    'Confirm',
  ]

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="New Booking Pipeline" maxWidth="max-w-4xl">
      <div className="mb-8">
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {steps.map((label, index) => (
            <div key={label} className="space-y-2">
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div className={`h-full bg-gold transition-all ${step >= index + 1 ? 'w-full' : 'w-0'}`}></div>
              </div>
              <p className={`hidden sm:block text-[10px] uppercase tracking-[0.25em] truncate ${step >= index + 1 ? 'text-gold' : 'text-support-300/50'}`}>
                {label}
              </p>
            </div>
          ))}
        </div>
        <div className="sm:hidden mt-3 text-center">
          <p className="text-[10px] font-semibold text-gold uppercase tracking-widest">
            Step {step} of {steps.length}: {steps[step - 1]}
          </p>
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <div className="flex gap-3">
            {[
              ['existing', 'Existing Patient'],
              ['new', 'New Patient'],
            ].map(([mode, label]) => (
              <button
                key={mode}
                type="button"
                onClick={() => setForm((value) => ({ ...value, patientMode: mode }))}
                className={`flex-1 rounded-2xl border px-5 py-4 text-left transition-colors ${
                  form.patientMode === mode
                    ? 'border-gold/40 bg-gold/10 text-gold'
                    : 'border-white/10 bg-[#111827] text-support-200'
                }`}
              >
                <p className="text-sm font-medium">{label}</p>
              </button>
            ))}
          </div>

          {form.patientMode === 'existing' ? (
            <select
              value={form.patientId}
              onChange={(event) => setForm((value) => ({ ...value, patientId: event.target.value }))}
              className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold outline-none"
            >
              <option value="">Select patient...</option>
              {patients.map((patient) => (
                <option key={patient._id} value={patient._id}>
                  {patient.fullName} • {patient.phone}
                </option>
              ))}
            </select>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input placeholder="Full Name" value={form.newPatientName} onChange={(event) => setForm((value) => ({ ...value, newPatientName: event.target.value }))} className="bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold outline-none" />
              <input placeholder="Phone Number (10 digits)" type="tel" maxLength="10" value={form.newPatientPhone} onChange={(event) => { const val = event.target.value.replace(/\D/g, '').slice(0, 10); setForm((value) => ({ ...value, newPatientPhone: val })) }} className="bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold outline-none" />
              <input placeholder="Email" value={form.newPatientEmail} onChange={(event) => setForm((value) => ({ ...value, newPatientEmail: event.target.value }))} className="bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold outline-none" />
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {treatments.map((treatment) => (
            <button
              key={treatment._id}
              type="button"
              onClick={() => setForm((value) => ({ ...value, treatmentId: treatment._id }))}
              className={`rounded-2xl border p-5 text-left transition-colors ${
                form.treatmentId === treatment._id
                  ? 'border-gold/40 bg-gold/10'
                  : 'border-white/10 bg-[#111827]'
              }`}
            >
              <p className="text-white font-medium">{treatment.name}</p>
              <p className="text-xs text-support-300 mt-2">{treatment.category}</p>
              <p className="text-gold mt-4">₹{Number(treatment.basePrice || 0).toLocaleString('en-IN')}</p>
            </button>
          ))}
        </div>
      )}

      {step === 3 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {doctors.map((doctor) => (
            <button
              key={doctor._id}
              type="button"
              onClick={() => setForm((value) => ({ ...value, doctorId: doctor._id }))}
              className={`rounded-2xl border p-5 text-left transition-colors ${
                form.doctorId === doctor._id
                  ? 'border-gold/40 bg-gold/10'
                  : 'border-white/10 bg-[#111827]'
              }`}
            >
              <p className="text-white font-medium">{doctor.fullName}</p>
              <p className="text-xs text-support-300 mt-2">{doctor.specialty}</p>
            </button>
          ))}
        </div>
      )}

      {step === 4 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="date" value={form.date} onChange={(event) => setForm((value) => ({ ...value, date: event.target.value }))} className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold outline-none [color-scheme:dark]" />
          <input type="time" value={form.time} onChange={(event) => setForm((value) => ({ ...value, time: event.target.value }))} className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold outline-none [color-scheme:dark]" />
        </div>
      )}

      {step === 5 && (
        <textarea
          value={form.notes}
          onChange={(event) => setForm((value) => ({ ...value, notes: event.target.value }))}
          placeholder="Consultation notes, preferences, medical flags, concierge observations..."
          className="w-full bg-[#111827] border border-white/10 rounded-2xl px-4 py-4 text-white focus:border-gold outline-none h-40 resize-none"
        ></textarea>
      )}

      {step === 6 && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              ['cash', Wallet],
              ['upi', DollarSign],
              ['card', CreditCard],
              ['emi', Calendar],
              ['insurance', Shield],
            ].map(([method, Icon]) => (
              <button
                key={method}
                type="button"
                onClick={() => setForm((value) => ({ ...value, paymentMethod: method }))}
                className={`rounded-2xl border py-4 flex flex-col items-center justify-center gap-2 transition-colors ${
                  form.paymentMethod === method
                    ? 'border-gold/40 bg-gold/10 text-gold'
                    : 'border-white/10 bg-[#111827] text-white'
                }`}
              >
                <Icon size={20} />
                <span className="text-xs uppercase tracking-widest">{method}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Advance Amount" value={form.advanceAmount} onChange={(event) => setForm((value) => ({ ...value, advanceAmount: event.target.value }))} className="bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold outline-none" />
            <input placeholder="Transaction/Payment Details" value={form.transactionDetails} onChange={(event) => setForm((value) => ({ ...value, transactionDetails: event.target.value }))} className="bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold outline-none" />
            {form.paymentMethod === 'emi' ? (
              <input placeholder="EMI Installments" value={form.emiInstallments} onChange={(event) => setForm((value) => ({ ...value, emiInstallments: event.target.value }))} className="md:col-span-2 bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold outline-none" />
            ) : (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-emerald-300 text-sm">
                Payment will be attached directly to the invoice on confirmation.
              </div>
            )}
          </div>
        </div>
      )}

      {step === 7 && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/10 bg-[#111827] p-5">
              <p className="text-xs uppercase tracking-widest text-support-300">Patient</p>
              <p className="text-white mt-2">{selectedPatient?.fullName || form.newPatientName || 'New patient pending'}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#111827] p-5">
              <p className="text-xs uppercase tracking-widest text-support-300">Treatment Value</p>
              <p className="text-gold mt-2">₹{estimatedAmount.toLocaleString('en-IN')}</p>
            </div>
          </div>
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 flex items-center gap-3 text-emerald-300">
            <CheckCircle2 size={20} />
            <p className="text-sm">This will create the appointment, invoice, payment entry, and EMI plan if applicable.</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 text-sm text-rose-400 bg-rose-500/10 px-4 py-3 rounded-xl border border-rose-500/30 text-center">
          {error}
        </div>
      )}

      <div className="sticky bottom-0 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-5 sm:p-6 bg-[#0F172A] border-t border-white/5 mt-8 flex gap-3 z-10 shadow-[0_-10px_30px_rgba(15,23,42,0.9)]">
        <button
          type="button"
          onClick={() => (step === 1 ? onClose() : setStep((value) => { setError(''); return value - 1 }))}
          className="flex-1 rounded-xl border border-white/10 py-3 text-support-200 hover:bg-white/5 transition-colors"
        >
          {step === 1 ? 'Cancel' : 'Back'}
        </button>
        {step < 7 ? (
          <button
            type="button"
            onClick={() => setStep((value) => { setError(''); return value + 1 })}
            className="flex-1 rounded-xl bg-gold text-navy font-semibold py-3 hover:bg-gold-light transition-colors"
          >
            Continue
          </button>
        ) : (
          <button
            type="button"
            disabled={submitting}
            onClick={handleComplete}
            className="flex-1 rounded-xl bg-emerald-500 text-white font-semibold py-3 hover:bg-emerald-400 transition-colors disabled:opacity-70"
          >
            {submitting ? 'Confirming...' : 'Confirm Booking'}
          </button>
        )}
      </div>
    </ModalWrapper>
  )
}

export function AddPatientModal({ isOpen, onClose, showToast, onCreated }) {
  const [form, setForm] = useState(patientInitialState)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isOpen) {
      setForm(patientInitialState)
      setSubmitting(false)
      setError('')
    }
  }, [isOpen])

  async function handleSave(event) {
    event.preventDefault()

    if (!form.fullName || form.fullName.trim() === '') {
      setError('Full Name is required')
      return
    }
    if (!form.phone || form.phone.trim() === '') {
      setError('Phone Number is required')
      return
    }
    if (!/^\d{10}$/.test(form.phone.trim())) {
      setError('Phone Number must be exactly 10 digits')
      return
    }
    if (form.email && !form.email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    setError('')
    setSubmitting(true)

    try {
      const response = await api.createPatient({
        ...form,
        age: form.age ? Number(form.age) : undefined,
      })
      onCreated?.(response.patient)
      showToast('New patient profile created successfully.')
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to create patient')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Register New Patient" maxWidth="max-w-4xl">
      <form onSubmit={handleSave} className="space-y-8">
        <div>
          <h4 className="text-sm font-medium text-white mb-4 border-b border-white/5 pb-2">Personal Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3 flex items-center gap-4 mb-4">
              <div className="w-20 h-20 rounded-full bg-[#111827] border border-white/10 flex items-center justify-center text-support-300">
                <User size={32} />
              </div>
              <input
                placeholder="Profile Image URL"
                value={form.avatarUrl}
                onChange={(event) => setForm((value) => ({ ...value, avatarUrl: event.target.value }))}
                className="flex-1 bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold outline-none"
              />
            </div>
            {[
              ['fullName', 'Full Name'],
              ['phone', 'Phone Number'],
              ['email', 'Email Address'],
              ['age', 'Age'],
              ['bloodGroup', 'Blood Group'],
            ].map(([key, label]) => (
              <input
                key={key}
                required={key === 'fullName' || key === 'phone'}
                type={key === 'phone' ? 'tel' : 'text'}
                maxLength={key === 'phone' ? 10 : undefined}
                placeholder={label}
                value={form[key]}
                onChange={(event) => {
                  const val = key === 'phone' ? event.target.value.replace(/\D/g, '').slice(0, 10) : event.target.value
                  setForm((value) => ({ ...value, [key]: val }))
                }}
                className="bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold outline-none"
              />
            ))}
            <select
              value={form.gender}
              onChange={(event) => setForm((value) => ({ ...value, gender: event.target.value }))}
              className="bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold outline-none"
            >
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
              <option>Prefer not to say</option>
            </select>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-white mb-4 border-b border-white/5 pb-2">Medical History</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              ['allergies', 'Allergies'],
              ['medicalHistory', 'Medical History'],
              ['dentalHistory', 'Past Dental History'],
              ['notes', 'Internal Notes'],
            ].map(([key, label]) => (
              <textarea
                key={key}
                placeholder={label}
                value={form[key]}
                onChange={(event) => setForm((value) => ({ ...value, [key]: event.target.value }))}
                className="bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold outline-none h-24 resize-none"
              ></textarea>
            ))}
          </div>
        </div>

        {error && (
          <div className="text-sm text-rose-400 bg-rose-500/10 px-4 py-3 rounded-xl border border-rose-500/30 text-center mb-4">
            {error}
          </div>
        )}

        <div className="sticky bottom-0 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-5 sm:p-6 bg-[#0F172A] border-t border-white/5 mt-8 z-10 shadow-[0_-10px_30px_rgba(15,23,42,0.9)]">
          <button type="submit" disabled={submitting} className="w-full bg-gold text-navy font-semibold rounded-xl py-4 hover:bg-gold-light transition-colors shadow-gold disabled:opacity-70">
            {submitting ? 'Creating Patient...' : 'Create Patient Profile'}
          </button>
        </div>
      </form>
    </ModalWrapper>
  )
}

export function ReportModal({ isOpen, onClose, showToast }) {
  const [selectedType, setSelectedType] = useState('revenue')
  const [loading, setLoading] = useState(false)

  const options = [
    ['revenue', 'Revenue Report'],
    ['treatments', 'Treatment Report'],
    ['patients', 'Patient Report'],
    ['doctors', 'Doctor Performance'],
    ['emi', 'EMI Portfolio'],
  ]

  async function handleExport(format) {
    setLoading(true)

    try {
      const { report } = await api.generateReport(selectedType)

      if (format === 'csv') {
        downloadFile(`${selectedType}-report.csv`, report.csv, 'text/csv;charset=utf-8')
      } else {
        const preview = window.open('', '_blank', 'noopener,noreferrer')
        if (preview) {
          preview.document.write(report.printable)
          preview.document.close()
          preview.focus()
          preview.print()
        }
      }

      showToast(`${report.title} generated successfully.`)
      onClose()
    } catch (error) {
      showToast(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Generate Enterprise Report">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {options.map(([type, label]) => (
          <button
            key={type}
            type="button"
            onClick={() => setSelectedType(type)}
            className={`rounded-2xl p-4 text-left transition-colors border ${
              selectedType === type
                ? 'border-gold/40 bg-gold/10'
                : 'border-white/5 bg-[#111827] hover:border-gold/20'
            }`}
          >
            <FileText className="text-gold mb-2" size={24} />
            <p className="text-white font-medium">{label}</p>
            <p className="text-xs text-support-300 mt-1">Live clinic data export</p>
          </button>
        ))}
      </div>
      <div className="flex gap-4">
        <button disabled={loading} onClick={() => handleExport('pdf')} className="flex-1 flex items-center justify-center gap-2 bg-rose-500/20 text-rose-400 font-semibold rounded-xl py-3 border border-rose-500/30 hover:bg-rose-500/30 transition-colors disabled:opacity-70"><Download size={18} /> Export PDF</button>
        <button disabled={loading} onClick={() => handleExport('csv')} className="flex-1 flex items-center justify-center gap-2 bg-emerald-500/20 text-emerald-400 font-semibold rounded-xl py-3 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors disabled:opacity-70"><Download size={18} /> Export CSV</button>
      </div>
    </ModalWrapper>
  )
}

export function InvoiceModal({ isOpen, onClose, invoice, showToast, onUpdated }) {
  const [amount, setAmount] = useState('')
  const [transactionDetails, setTransactionDetails] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('upi')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setAmount(invoice?.balanceDue ? `${invoice.balanceDue}` : '')
    setPaymentMethod(invoice?.paymentMethod || 'upi')
    setTransactionDetails(invoice?.transactionDetails || '')
  }, [invoice])

  if (!invoice) return null

  async function handlePayment() {
    setLoading(true)

    try {
      const response = await api.updateInvoice(invoice._id, {
        amount: Number(amount || invoice.balanceDue || 0),
        method: paymentMethod,
        transactionDetails,
      })
      onUpdated?.(response.invoice)
      showToast('Invoice payment recorded successfully.')
      onClose()
    } catch (error) {
      showToast(error.message)
    } finally {
      setLoading(false)
    }
  }

  function handleWhatsappShare() {
    const shareText = encodeURIComponent(
      `Invoice ${invoice.invoiceNumber} for ${invoice.patient?.fullName || invoice.patient} is now ${invoice.status}. Balance due: ₹${Number(
        invoice.balanceDue || 0,
      ).toLocaleString('en-IN')}.`,
    )
    window.open(`https://wa.me/?text=${shareText}`, '_blank', 'noopener,noreferrer')
    showToast('Invoice opened in WhatsApp share flow.')
  }

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title={`Invoice: ${invoice.invoiceNumber || invoice.id}`} maxWidth="max-w-3xl">
      <div className="bg-white p-8 rounded-2xl text-slate-900 mb-6 font-sans">
        <div className="flex justify-between items-start mb-12 border-b pb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">AZURE CLINIC</h2>
            <p className="text-sm text-slate-500 mt-1">Premium Healthcare</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-light text-slate-900">₹{Number(invoice.totalAmount || 0).toLocaleString('en-IN')}</p>
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600 mt-2">{invoice.status}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8 mb-12">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-2">Billed To</p>
            <p className="font-medium text-slate-900 text-lg">{invoice.patient?.fullName || invoice.patient}</p>
            <p className="text-sm text-slate-500">Patient ID: PAT-{`${invoice.patient?._id || '0000'}`.slice(-4)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-2">Details</p>
            <p className="text-sm text-slate-700">Doctor: {invoice.doctor?.fullName || 'Unassigned'}</p>
            <p className="text-sm text-slate-700">Payment Method: {(invoice.paymentMethod || '').toUpperCase()}</p>
            {invoice.transactionDetails && <p className="text-sm text-slate-700">Details: {invoice.transactionDetails}</p>}
            <p className="text-sm text-slate-700">Balance Due: ₹{Number(invoice.balanceDue || 0).toLocaleString('en-IN')}</p>
          </div>
        </div>
        <div className="space-y-3">
          {(invoice.lineItems || []).map((item) => (
            <div key={item.label} className="flex items-center justify-between text-sm">
              <span>{item.label}</span>
              <span>₹{Number(item.amount || 0).toLocaleString('en-IN')}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="Payment amount" className="bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold outline-none" />
          <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)} className="bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold outline-none">
            <option value="cash">Cash</option>
            <option value="upi">UPI</option>
            <option value="card">Card</option>
            <option value="emi">EMI</option>
            <option value="insurance">Insurance</option>
          </select>
          <input value={transactionDetails} onChange={(event) => setTransactionDetails(event.target.value)} placeholder="Transaction/Payment Details" className="md:col-span-2 bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold outline-none" />
        </div>
        <div className="flex gap-4">
          <button disabled={loading} onClick={handlePayment} className="flex-1 bg-emerald-500/20 text-emerald-400 font-semibold rounded-xl py-3 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors disabled:opacity-70">Record Payment</button>
          <button onClick={handleWhatsappShare} className="flex-1 bg-gold/20 text-gold font-semibold rounded-xl py-3 border border-gold/30 hover:bg-gold/30 transition-colors">Send via WhatsApp</button>
        </div>
      </div>
    </ModalWrapper>
  )
}

export function NewInvoiceModal({
  isOpen,
  onClose,
  showToast,
  patients = [],
  doctors = [],
  treatments = [],
  onCreated,
}) {
  const [form, setForm] = useState(billingInitialState)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setForm(billingInitialState)
      setSubmitting(false)
    }
  }, [isOpen])

  const selectedTreatment = useMemo(
    () => treatments.find((item) => item._id === form.treatmentId),
    [form.treatmentId, treatments],
  )

  useEffect(() => {
    if (selectedTreatment) {
      setForm((value) => ({
        ...value,
        lineItemLabel: value.lineItemLabel || selectedTreatment.name,
        totalAmount: value.totalAmount || `${selectedTreatment.basePrice || 0}`,
      }))
    }
  }, [selectedTreatment])

  async function handleCreateInvoice(event) {
    event.preventDefault()
    setSubmitting(true)

    try {
      const response = await api.createInvoice({
        patientId: form.patientId,
        treatmentId: form.treatmentId,
        doctorId: form.doctorId || undefined,
        lineItemLabel: form.lineItemLabel,
        totalAmount: Number(form.totalAmount || 0),
        amountPaid: Number(form.amountPaid || 0),
        paymentMethod: form.paymentMethod,
        transactionDetails: form.transactionDetails,
        dueDate: form.dueDate || undefined,
        emiInstallments: Number(form.emiInstallments || 6),
      })

      onCreated?.(response)
      showToast('Invoice and billing workflow created successfully.')
      onClose()
    } catch (error) {
      showToast(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Create Billing Record" maxWidth="max-w-4xl">
      <form onSubmit={handleCreateInvoice} className="space-y-8">
        <div>
          <h4 className="text-sm font-medium text-white mb-4 border-b border-white/5 pb-2">Invoice Setup</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={form.patientId}
              onChange={(event) => setForm((value) => ({ ...value, patientId: event.target.value }))}
              className="bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold outline-none"
            >
              <option value="">Select patient...</option>
              {patients.map((patient) => (
                <option key={patient._id} value={patient._id}>
                  {patient.fullName} • {patient.phone}
                </option>
              ))}
            </select>

            <select
              value={form.treatmentId}
              onChange={(event) => setForm((value) => ({ ...value, treatmentId: event.target.value }))}
              className="bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold outline-none"
            >
              <option value="">Select treatment...</option>
              {treatments.map((treatment) => (
                <option key={treatment._id} value={treatment._id}>
                  {treatment.name}
                </option>
              ))}
            </select>

            <select
              value={form.doctorId}
              onChange={(event) => setForm((value) => ({ ...value, doctorId: event.target.value }))}
              className="bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold outline-none"
            >
              <option value="">Assign doctor (optional)...</option>
              {doctors.map((doctor) => (
                <option key={doctor._id} value={doctor._id}>
                  {doctor.fullName}
                </option>
              ))}
            </select>

            <input
              value={form.lineItemLabel}
              onChange={(event) => setForm((value) => ({ ...value, lineItemLabel: event.target.value }))}
              placeholder="Invoice line item"
              className="bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold outline-none"
            />

            <input
              value={form.totalAmount}
              onChange={(event) => setForm((value) => ({ ...value, totalAmount: event.target.value }))}
              placeholder="Total amount"
              className="bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold outline-none"
            />

            <input
              value={form.amountPaid}
              onChange={(event) => setForm((value) => ({ ...value, amountPaid: event.target.value }))}
              placeholder="Amount paid now"
              className="bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold outline-none"
            />

            <input
              type="date"
              value={form.dueDate}
              onChange={(event) => setForm((value) => ({ ...value, dueDate: event.target.value }))}
              className="bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold outline-none [color-scheme:dark]"
            />

            <select
              value={form.paymentMethod}
              onChange={(event) => setForm((value) => ({ ...value, paymentMethod: event.target.value }))}
              className="bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold outline-none"
            >
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="card">Card</option>
              <option value="emi">EMI</option>
              <option value="insurance">Insurance</option>
            </select>
            <input
              value={form.transactionDetails}
              onChange={(event) => setForm((value) => ({ ...value, transactionDetails: event.target.value }))}
              placeholder="Transaction/Payment Details"
              className="bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold outline-none"
            />
          </div>
        </div>

        {form.paymentMethod === 'emi' ? (
          <div>
            <h4 className="text-sm font-medium text-white mb-4 border-b border-white/5 pb-2">EMI Plan</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                value={form.emiInstallments}
                onChange={(event) => setForm((value) => ({ ...value, emiInstallments: event.target.value }))}
                placeholder="Number of installments"
                className="bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold outline-none"
              />
              <div className="rounded-xl border border-gold/20 bg-gold/5 px-4 py-3 text-sm text-support-200">
                A live EMI schedule will be created automatically and linked to this invoice.
              </div>
            </div>
          </div>
        ) : null}

        <div className="sticky bottom-0 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-5 sm:p-6 bg-[#0F172A] border-t border-white/5 mt-8 z-10 shadow-[0_-10px_30px_rgba(15,23,42,0.9)]">
          <button type="submit" disabled={submitting} className="w-full bg-gold text-navy font-semibold rounded-xl py-4 hover:bg-gold-light transition-colors shadow-gold disabled:opacity-70">
            {submitting ? 'Creating Billing Record...' : 'Create Invoice'}
          </button>
        </div>
      </form>
    </ModalWrapper>
  )
}

export function ReplyReviewModal({ isOpen, onClose, review, showToast, onUpdated }) {
  const [reply, setReply] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setReply(review?.adminReply || '')
  }, [review])

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)

    try {
      const response = await api.replyToReview(review._id, reply)
      onUpdated?.(response.review)
      showToast('Reply saved successfully.')
      onClose()
    } catch (error) {
      showToast(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (!review) return null

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Reply to Patient Review">
      <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 mb-6">
        <p className="text-white font-medium mb-2">{review.patient?.fullName || 'Patient'} <span className="text-support-300 text-sm font-normal ml-2">left a {review.rating}-star review</span></p>
        <p className="text-support-200 text-sm italic">"{review.comment}"</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="text-xs uppercase tracking-widest text-support-300 font-semibold block mb-2">Your Reply (Public)</label>
        <textarea
          required
          value={reply}
          onChange={(event) => setReply(event.target.value)}
          placeholder="Thank you for your trust. We are honored to support your smile journey..."
          className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold outline-none h-32 resize-none"
        ></textarea>
        <button type="submit" disabled={submitting} className="w-full bg-gold text-navy font-semibold rounded-xl py-4 hover:bg-gold-light transition-colors shadow-gold disabled:opacity-70">
          {submitting ? 'Posting Reply...' : 'Post Reply'}
        </button>
      </form>
    </ModalWrapper>
  )
}

export function LogoutModal({ isOpen, onClose, onConfirm }) {
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Secure Logout" maxWidth="max-w-md">
      <div className="space-y-6">
        <p className="text-support-200">
          Are you sure you want to end your current session? You will need to re-authenticate to access the Azure OS dashboard again.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/5">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 py-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400 font-medium hover:bg-rose-500/30 hover:text-white transition-colors">
            Logout
          </button>
        </div>
      </div>
    </ModalWrapper>
  )
}
