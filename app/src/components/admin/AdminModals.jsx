import React, { useEffect, useMemo, useState } from 'react'
import { X, Calendar, User, FileText, Download, CheckCircle2, DollarSign, CreditCard, Clock, Wallet, Shield } from 'lucide-react'
import { api } from '../../lib/api'

function ModalWrapper({ isOpen, onClose, title, children, maxWidth = 'max-w-[480px]' }) {
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-[rgba(0,0,0,0.4)] backdrop-blur-[4px] animate-in fade-in duration-200">
      <div className={`bg-[#FFFFFF] rounded-t-[16px] sm:rounded-[12px] w-[100vw] sm:w-[90vw] ${maxWidth} shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh]`}>
        <div className="w-10 h-1 bg-[#E5E7EB] rounded-full mx-auto mt-3 mb-1 sm:hidden" />
        <div className="flex justify-between items-center px-[24px] py-[16px] sm:py-[20px] border-b border-[#E5E7EB]">
          <h3 className="text-[1rem] font-semibold text-[#111827]">{title}</h3>
          <button onClick={onClose} className="text-[#6B7280] hover:text-[#111827] transition-colors active:scale-95">
            <X size={20} />
          </button>
        </div>
        <div className="p-[24px] overflow-y-auto custom-scrollbar flex-1 text-[#374151]">
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

  function handleNextStep() {
    setError('')
    if (step === 1) {
      if (form.patientMode === 'new') {
        if (!form.newPatientName?.trim()) return setError('New Patient Full Name is required')
        if (!form.newPatientPhone?.trim()) return setError('New Patient Phone is required')
        if (!/^\d{10}$/.test(form.newPatientPhone.trim())) return setError('New Patient Phone must be exactly 10 digits')
      } else if (!form.patientId) {
        return setError('Please select a patient')
      }
    } else if (step === 2 && !form.treatmentId) {
      return setError('Please select a treatment')
    } else if (step === 3 && !form.doctorId) {
      return setError('Please select a doctor')
    } else if (step === 4) {
      if (!form.date) return setError('Please select a date')
      if (!form.time) return setError('Please select a time')
      const selectedDate = new Date(form.date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (selectedDate < today) {
        return setError('Please select a valid future date')
      }
    }
    setStep((s) => s + 1)
  }

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
        <div className="hidden sm:flex items-center justify-between">
          {steps.map((label, index) => {
            const stepNum = index + 1
            const isCompleted = step > stepNum
            const isCurrent = step === stepNum
            return (
              <React.Fragment key={label}>
                <div className="flex flex-col items-center gap-1.5">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${isCompleted ? 'bg-[#0D5C4E] text-white' : isCurrent ? 'bg-[#0D5C4E] text-white ring-4 ring-[#0D5C4E]/20' : 'bg-[#F3F4F6] text-[#9CA3AF]'}`}>
                    {isCompleted ? <CheckCircle2 size={16} /> : stepNum}
                  </div>
                  <span className={`text-[9px] uppercase tracking-[0.2em] font-medium ${isCurrent ? 'text-[#0D5C4E]' : isCompleted ? 'text-[#0D5C4E]/60' : 'text-[#9CA3AF]'}`}>
                    {label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-[2px] mx-2 rounded-full transition-all duration-300 ${step > stepNum ? 'bg-[#0D5C4E]' : 'bg-[#E5E7EB]'}`} />
                )}
              </React.Fragment>
            )
          })}
        </div>
        <div className="sm:hidden mt-3">
          <p className="text-[0.8rem] font-semibold text-[#0D5C4E] text-center mb-2">
            Step {step} of {steps.length} — {steps[step - 1]}
          </p>
          <div className="h-1.5 rounded-full bg-[#F3F4F6] overflow-hidden">
            <div className="h-full bg-[#0D5C4E] transition-all duration-300" style={{ width: `${(step / steps.length) * 100}%` }}></div>
          </div>
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
                    ? 'border-[#0D5C4E] bg-[#E6F2F0] text-[#0D5C4E]'
                    : 'border-[#E5E7EB] bg-white text-[#374151]'
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
              className="w-full bg-white border border-[#E5E7EB] rounded-[8px] px-[12px] h-[40px] text-[0.9rem] text-[#111827] focus:border-[#0D5C4E] focus:ring-[3px] focus:ring-[#0D5C4E]/15 outline-none"
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
              <input placeholder="Full Name" value={form.newPatientName} onChange={(event) => setForm((value) => ({ ...value, newPatientName: event.target.value }))} className="bg-white border border-[#E5E7EB] rounded-[8px] px-[12px] h-[40px] text-[0.9rem] text-[#111827] focus:border-[#0D5C4E] focus:ring-[3px] focus:ring-[#0D5C4E]/15 outline-none" />
              <input placeholder="Phone Number (10 digits)" type="tel" maxLength="10" value={form.newPatientPhone} onChange={(event) => { const val = event.target.value.replace(/\D/g, '').slice(0, 10); setForm((value) => ({ ...value, newPatientPhone: val })) }} className="bg-white border border-[#E5E7EB] rounded-[8px] px-[12px] h-[40px] text-[0.9rem] text-[#111827] focus:border-[#0D5C4E] focus:ring-[3px] focus:ring-[#0D5C4E]/15 outline-none" />
              <input placeholder="Email" value={form.newPatientEmail} onChange={(event) => setForm((value) => ({ ...value, newPatientEmail: event.target.value }))} className="bg-white border border-[#E5E7EB] rounded-[8px] px-[12px] h-[40px] text-[0.9rem] text-[#111827] focus:border-[#0D5C4E] focus:ring-[3px] focus:ring-[#0D5C4E]/15 outline-none" />
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {treatments.map((treatment) => {
            const isSelected = form.treatmentId === treatment._id;
            return (
              <button
                key={treatment._id}
                type="button"
                onClick={() => setForm((value) => ({ ...value, treatmentId: treatment._id }))}
                className={`relative rounded-[12px] border p-4 text-left transition-colors overflow-hidden ${isSelected ? 'border-[#0D5C4E] bg-[#E6F2F0]' : 'border-[#E5E7EB] bg-white hover:bg-[#F9FAFB]'}`}
              >
                <div className="pr-8">
                  <p className="text-[#111827] font-semibold text-[0.95rem]">{treatment.name}</p>
                  <span className="inline-block bg-[#F3F4F6] text-[#6B7280] text-[0.7rem] px-2 py-0.5 rounded-full mt-1.5">{treatment.category}</span>
                  {treatment.durationMinutes && (
                    <div className="flex items-center gap-1 mt-2 text-[#9CA3AF] text-[0.75rem]">
                      <Clock size={12} /> {treatment.durationMinutes} mins
                    </div>
                  )}
                  <p className="text-[#0D5C4E] font-bold text-[1rem] mt-2">₹{Number(treatment.basePrice || 0).toLocaleString('en-IN')}</p>
                </div>
                {isSelected && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-[#0D5C4E] rounded-full flex items-center justify-center animate-in zoom-in duration-200">
                    <CheckCircle2 size={14} className="text-white" />
                  </div>
                )}
              </button>
            )
          })}
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
                  ? 'border-[#0D5C4E] bg-[#E6F2F0]'
                  : 'border-[#E5E7EB] bg-white'
              }`}
            >
              <p className="text-[#111827] font-medium">{doctor.fullName}</p>
              <p className="text-xs text-[#6B7280] mt-2">{doctor.specialty}</p>
            </button>
          ))}
        </div>
      )}

      {step === 4 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="date" value={form.date} onChange={(event) => setForm((value) => ({ ...value, date: event.target.value }))} className="w-full bg-white border border-[#E5E7EB] rounded-[8px] px-[12px] h-[40px] text-[0.9rem] text-[#111827] focus:border-[#0D5C4E] focus:ring-[3px] focus:ring-[#0D5C4E]/15 outline-none [color-scheme:light]" />
          <input type="time" value={form.time} onChange={(event) => setForm((value) => ({ ...value, time: event.target.value }))} className="w-full bg-white border border-[#E5E7EB] rounded-[8px] px-[12px] h-[40px] text-[0.9rem] text-[#111827] focus:border-[#0D5C4E] focus:ring-[3px] focus:ring-[#0D5C4E]/15 outline-none [color-scheme:light]" />
        </div>
      )}

      {step === 5 && (
        <textarea
          value={form.notes}
          onChange={(event) => setForm((value) => ({ ...value, notes: event.target.value }))}
          placeholder="Consultation notes, preferences, medical flags, concierge observations..."
          className="w-full bg-white border border-[#E5E7EB] rounded-[8px] p-[12px] text-[0.9rem] text-[#111827] focus:border-[#0D5C4E] focus:ring-[3px] focus:ring-[#0D5C4E]/15 outline-none h-40 resize-none"
        ></textarea>
      )}

      {step === 6 && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {[
              ['cash', Wallet, 'bg-[#F0FDF4]', 'border-[#86EFAC]', 'text-[#166534]'],
              ['upi', DollarSign, 'bg-[#EFF6FF]', 'border-[#93C5FD]', 'text-[#1D4ED8]'],
              ['card', CreditCard, 'bg-[#F5F3FF]', 'border-[#C4B5FD]', 'text-[#6D28D9]'],
              ['emi', Calendar, 'bg-[#FEF9EC]', 'border-[#FCD34D]', 'text-[#92400E]'],
              ['insurance', Shield, 'bg-[#F0F9FF]', 'border-[#7DD3FC]', 'text-[#0369A1]'],
            ].map(([method, Icon, bg, border, text]) => {
              const isSelected = form.paymentMethod === method;
              return (
                <button
                  key={method}
                  type="button"
                  onClick={() => setForm((value) => ({ ...value, paymentMethod: method }))}
                  className={`relative rounded-2xl border-2 py-4 flex flex-col items-center justify-center gap-2 transition-all ${
                    isSelected ? `${bg} ${border} ${text} brightness-95` : `border-[#E5E7EB] bg-white text-[#6B7280] hover:${bg} hover:border-transparent hover:${text}`
                  }`}
                >
                  <Icon size={20} className={isSelected ? text : 'currentColor'} />
                  <span className={`text-xs uppercase tracking-widest font-semibold ${isSelected ? text : ''}`}>{method}</span>
                  {isSelected && (
                    <div className={`absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center bg-white ${text} shadow-sm animate-in zoom-in duration-200`}>
                      <CheckCircle2 size={10} />
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Advance Amount" value={form.advanceAmount} onChange={(event) => setForm((value) => ({ ...value, advanceAmount: event.target.value }))} className="bg-white border border-[#E5E7EB] rounded-[8px] px-[12px] h-[40px] text-[0.9rem] text-[#111827] focus:border-[#0D5C4E] focus:ring-[3px] focus:ring-[#0D5C4E]/15 outline-none" />
            <input placeholder="Transaction/Payment Details" value={form.transactionDetails} onChange={(event) => setForm((value) => ({ ...value, transactionDetails: event.target.value }))} className="bg-white border border-[#E5E7EB] rounded-[8px] px-[12px] h-[40px] text-[0.9rem] text-[#111827] focus:border-[#0D5C4E] focus:ring-[3px] focus:ring-[#0D5C4E]/15 outline-none" />
            {form.paymentMethod === 'emi' ? (
              <input placeholder="EMI Installments" value={form.emiInstallments} onChange={(event) => setForm((value) => ({ ...value, emiInstallments: event.target.value }))} className="md:col-span-2 bg-white border border-[#E5E7EB] rounded-[8px] px-[12px] h-[40px] text-[0.9rem] text-[#111827] focus:border-[#0D5C4E] focus:ring-[3px] focus:ring-[#0D5C4E]/15 outline-none" />
            ) : (
              <div className="md:col-span-2 rounded-xl border border-[#86EFAC] bg-[#F0FDF4] px-4 py-3 text-[#166534] text-[0.85rem] flex items-start gap-2">
                <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                <span>Payment will be attached directly to the invoice on confirmation.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {step === 7 && (
        <div className="space-y-4">
          <div className="bg-[#E6F2F0] rounded-2xl p-5 border border-[#0D5C4E]/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#0D5C4E] flex items-center justify-center">
                <CheckCircle2 size={20} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-[#0D5C4E]">Ready to Confirm</p>
                <p className="text-xs text-[#0D5C4E]/70">Review all details below</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {[
                ['Patient', selectedPatient?.fullName || form.newPatientName || 'New patient'],
                ['Treatment', selectedTreatment?.name || '—'],
                ['Doctor', doctors.find(d => d._id === form.doctorId)?.fullName || 'Not assigned'],
                ['Date & Time', form.date && form.time ? `${form.date} at ${form.time}` : '—'],
                ['Payment', form.paymentMethod?.toUpperCase()],
                ['Amount', `₹${estimatedAmount.toLocaleString('en-IN')}`],
                ...(Number(form.advanceAmount) > 0 ? [
                  ['Received Amount', `₹${Number(form.advanceAmount).toLocaleString('en-IN')}`],
                  ['Remaining Payment', `₹${(estimatedAmount - Number(form.advanceAmount)).toLocaleString('en-IN')}`]
                ] : []),
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between items-center py-2 border-b border-[#0D5C4E]/10 last:border-0">
                  <span className="text-xs uppercase tracking-wider text-[#0D5C4E]/60 font-medium">{label}</span>
                  <span className="text-sm font-semibold text-[#0D5C4E] text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-4 flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-[#E6F2F0] flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 size={12} className="text-[#0D5C4E]" />
            </div>
            <p className="text-sm text-[#374151] leading-relaxed">
              This will create the appointment, invoice, payment entry, and EMI plan if applicable.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 text-[0.85rem] text-[#991B1B] bg-[#FEE2E2] px-[14px] py-[10px] rounded-[8px] border border-[#FCA5A5] flex items-center gap-2 animate-shake"><span className="font-bold text-[1rem]">⚠</span> {error}</div>
      )}

      <div className="sticky bottom-0 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-5 sm:p-6 bg-[#FFFFFF] border-t border-[#E5E7EB] mt-8 flex flex-col-reverse sm:flex-row gap-[10px] sm:gap-3 z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] rounded-b-0 sm:rounded-b-[12px] pb-[calc(1.25rem+env(safe-area-inset-bottom,16px))] sm:pb-6">
        <button
          type="button"
          onClick={() => (step === 1 ? onClose() : setStep((value) => { setError(''); return value - 1 }))}
          className="w-full sm:flex-1 bg-white border border-[#E5E7EB] text-[#374151] font-semibold h-[44px] rounded-[10px] hover:bg-[#F9FAFB] transition-all duration-200"
        >
          {step === 1 ? 'Cancel' : 'Back'}
        </button>
        {step < 7 ? (
          <button
            type="button"
            onClick={handleNextStep}
            className="w-full sm:flex-1 bg-[#0D5C4E] text-[#FFFFFF] font-semibold h-[44px] rounded-[10px] hover:bg-[#1A7A68] active:scale-[0.98] transition-all duration-200"
          >
            Continue
          </button>
        ) : (
          <button
            type="button"
            disabled={submitting}
            onClick={handleComplete}
            className="w-full sm:flex-1 bg-[#0D5C4E] text-[#FFFFFF] font-semibold h-[44px] rounded-[10px] hover:bg-[#1A7A68] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Confirming...
              </span>
            ) : 'Confirm Booking'}
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

    /* Fix: Validate age range if provided */
    if (form.age && (Number(form.age) < 1 || Number(form.age) > 120 || isNaN(Number(form.age)))) {
      setError('Age must be between 1 and 120')
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
          <h4 className="text-sm font-medium text-[#111827] mb-4 border-b border-[#E5E7EB] pb-2">Personal Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3 flex items-center gap-4 mb-4">
              <div className="w-20 h-20 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center text-[#6B7280]">
                <User size={32} />
              </div>
              <input
                placeholder="Profile Image URL"
                value={form.avatarUrl}
                onChange={(event) => setForm((value) => ({ ...value, avatarUrl: event.target.value }))}
                className="flex-1 bg-white border border-[#E5E7EB] rounded-[8px] px-[12px] h-[40px] text-[0.9rem] text-[#111827] focus:border-[#0D5C4E] focus:ring-[3px] focus:ring-[#0D5C4E]/15 outline-none"
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
                className="bg-white border border-[#E5E7EB] rounded-[8px] px-[12px] h-[40px] text-[0.9rem] text-[#111827] focus:border-[#0D5C4E] focus:ring-[3px] focus:ring-[#0D5C4E]/15 outline-none"
              />
            ))}
            <select
              value={form.gender}
              onChange={(event) => setForm((value) => ({ ...value, gender: event.target.value }))}
              className="bg-white border border-[#E5E7EB] rounded-[8px] px-[12px] h-[40px] text-[0.9rem] text-[#111827] focus:border-[#0D5C4E] focus:ring-[3px] focus:ring-[#0D5C4E]/15 outline-none"
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
          <h4 className="text-sm font-medium text-[#111827] mb-4 border-b border-[#E5E7EB] pb-2">Medical History</h4>
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
                className="bg-white border border-[#E5E7EB] rounded-[8px] px-[12px] h-[40px] text-[0.9rem] text-[#111827] focus:border-[#0D5C4E] focus:ring-[3px] focus:ring-[#0D5C4E]/15 outline-none h-24 resize-none"
              ></textarea>
            ))}
          </div>
        </div>

        {error && (
          <div className="text-sm text-rose-400 bg-rose-500/10 px-4 py-3 rounded-xl border border-rose-500/30 text-center mb-4">
            {error}
          </div>
        )}

        <div className="sticky bottom-0 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-5 sm:p-6 bg-[#FFFFFF] border-t border-[#E5E7EB] mt-8 z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] rounded-b-0 sm:rounded-b-[12px] pb-[calc(1.25rem+env(safe-area-inset-bottom,16px))] sm:pb-6">
          <button type="submit" disabled={submitting} className="w-full bg-[#0D5C4E] text-[#FFFFFF] font-semibold h-[44px] rounded-[10px] hover:bg-[#1A7A68] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Creating Patient...
              </span>
            ) : 'Create Patient Profile'}
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
                ? 'border-[#0D5C4E] bg-[#E6F2F0]'
                : 'border-[#E5E7EB] bg-white hover:border-teal-600/20'
            }`}
          >
            <FileText className="text-[#0D5C4E] mb-2" size={24} />
            <p className="text-[#111827] font-medium">{label}</p>
            <p className="text-xs text-[#6B7280] mt-1">Live clinic data export</p>
          </button>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row gap-[10px] sm:gap-4">
        <button disabled={loading} onClick={() => handleExport('pdf')} className="w-full sm:flex-1 flex items-center justify-center gap-2 bg-white border border-[#E5E7EB] text-[#374151] font-semibold h-[44px] rounded-[10px] hover:bg-[#F9FAFB] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"><Download size={18} /> Export PDF</button>
        <button disabled={loading} onClick={() => handleExport('csv')} className="w-full sm:flex-1 flex items-center justify-center gap-2 bg-[#0D5C4E] text-[#FFFFFF] font-semibold h-[44px] rounded-[10px] hover:bg-[#1A7A68] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"><Download size={18} /> Export CSV</button>
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
      <div className="bg-white p-8 rounded-2xl text-[#111827] mb-6 font-sans">
        <div className="flex justify-between items-start mb-12 border-b pb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#111827]">AZURE CLINIC</h2>
            <p className="text-sm text-[#6B7280] mt-1">Premium Healthcare</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-light text-[#111827]">₹{Number(invoice.totalAmount || 0).toLocaleString('en-IN')}</p>
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600 mt-2">{invoice.status}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8 mb-12">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#9CA3AF] font-semibold mb-2">Billed To</p>
            <p className="font-medium text-[#111827] text-lg">{invoice.patient?.fullName || invoice.patient}</p>
            <p className="text-sm text-[#6B7280]">Patient ID: PAT-{`${invoice.patient?._id || '0000'}`.slice(-4)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-widest text-[#9CA3AF] font-semibold mb-2">Details</p>
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
          <input value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="Payment amount" className="bg-white border border-[#E5E7EB] rounded-[8px] px-[12px] h-[40px] text-[0.9rem] text-[#111827] focus:border-[#0D5C4E] focus:ring-[3px] focus:ring-[#0D5C4E]/15 outline-none" />
          <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)} className="bg-white border border-[#E5E7EB] rounded-[8px] px-[12px] h-[40px] text-[0.9rem] text-[#111827] focus:border-[#0D5C4E] focus:ring-[3px] focus:ring-[#0D5C4E]/15 outline-none">
            <option value="cash">Cash</option>
            <option value="upi">UPI</option>
            <option value="card">Card</option>
            <option value="emi">EMI</option>
            <option value="insurance">Insurance</option>
          </select>
          <input value={transactionDetails} onChange={(event) => setTransactionDetails(event.target.value)} placeholder="Transaction/Payment Details" className="md:col-span-2 bg-white border border-[#E5E7EB] rounded-[8px] px-[12px] h-[40px] text-[0.9rem] text-[#111827] focus:border-[#0D5C4E] focus:ring-[3px] focus:ring-[#0D5C4E]/15 outline-none" />
        </div>
        <div className="flex flex-col-reverse sm:flex-row gap-[10px] sm:gap-4 mt-2">
          <button disabled={loading} onClick={handlePayment} className="w-full sm:flex-1 bg-[#0D5C4E] text-[#FFFFFF] font-semibold h-[44px] rounded-[10px] hover:bg-[#1A7A68] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">Record Payment</button>
          <button onClick={handleWhatsappShare} className="w-full sm:flex-1 bg-white border border-[#0D5C4E]/30 text-[#0D5C4E] font-semibold h-[44px] rounded-[10px] hover:bg-[#F9FAFB] active:scale-[0.98] transition-all duration-200">Send via WhatsApp</button>
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
      /* Fix: Validate amount fields */
      const total = Number(form.totalAmount)
      const paid = Number(form.amountPaid)
      if (!total || total <= 0) { showToast('Total amount must be a positive number'); setSubmitting(false); return }
      if (paid < 0) { showToast('Amount paid cannot be negative'); setSubmitting(false); return }
      if (paid > total) { showToast('Amount paid cannot exceed total amount'); setSubmitting(false); return }

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
          <h4 className="text-sm font-medium text-[#111827] mb-4 border-b border-[#E5E7EB] pb-2">Invoice Setup</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={form.patientId}
              onChange={(event) => setForm((value) => ({ ...value, patientId: event.target.value }))}
              className="bg-white border border-[#E5E7EB] rounded-[8px] px-[12px] h-[40px] text-[0.9rem] text-[#111827] focus:border-[#0D5C4E] focus:ring-[3px] focus:ring-[#0D5C4E]/15 outline-none"
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
              className="bg-white border border-[#E5E7EB] rounded-[8px] px-[12px] h-[40px] text-[0.9rem] text-[#111827] focus:border-[#0D5C4E] focus:ring-[3px] focus:ring-[#0D5C4E]/15 outline-none"
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
              className="bg-white border border-[#E5E7EB] rounded-[8px] px-[12px] h-[40px] text-[0.9rem] text-[#111827] focus:border-[#0D5C4E] focus:ring-[3px] focus:ring-[#0D5C4E]/15 outline-none"
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
              className="bg-white border border-[#E5E7EB] rounded-[8px] px-[12px] h-[40px] text-[0.9rem] text-[#111827] focus:border-[#0D5C4E] focus:ring-[3px] focus:ring-[#0D5C4E]/15 outline-none"
            />

            <input
              value={form.totalAmount}
              onChange={(event) => setForm((value) => ({ ...value, totalAmount: event.target.value }))}
              placeholder="Total amount"
              className="bg-white border border-[#E5E7EB] rounded-[8px] px-[12px] h-[40px] text-[0.9rem] text-[#111827] focus:border-[#0D5C4E] focus:ring-[3px] focus:ring-[#0D5C4E]/15 outline-none"
            />

            <input
              value={form.amountPaid}
              onChange={(event) => setForm((value) => ({ ...value, amountPaid: event.target.value }))}
              placeholder="Amount paid now"
              className="bg-white border border-[#E5E7EB] rounded-[8px] px-[12px] h-[40px] text-[0.9rem] text-[#111827] focus:border-[#0D5C4E] focus:ring-[3px] focus:ring-[#0D5C4E]/15 outline-none"
            />

            <input
              type="date"
              value={form.dueDate}
              onChange={(event) => setForm((value) => ({ ...value, dueDate: event.target.value }))}
              className="bg-white border border-[#E5E7EB] rounded-[8px] px-[12px] h-[40px] text-[0.9rem] text-[#111827] focus:border-[#0D5C4E] focus:ring-[3px] focus:ring-[#0D5C4E]/15 outline-none [color-scheme:light]"
            />

            <select
              value={form.paymentMethod}
              onChange={(event) => setForm((value) => ({ ...value, paymentMethod: event.target.value }))}
              className="bg-white border border-[#E5E7EB] rounded-[8px] px-[12px] h-[40px] text-[0.9rem] text-[#111827] focus:border-[#0D5C4E] focus:ring-[3px] focus:ring-[#0D5C4E]/15 outline-none"
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
              className="bg-white border border-[#E5E7EB] rounded-[8px] px-[12px] h-[40px] text-[0.9rem] text-[#111827] focus:border-[#0D5C4E] focus:ring-[3px] focus:ring-[#0D5C4E]/15 outline-none"
            />
          </div>
        </div>

        {form.paymentMethod === 'emi' ? (
          <div>
            <h4 className="text-sm font-medium text-[#111827] mb-4 border-b border-[#E5E7EB] pb-2">EMI Plan</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                value={form.emiInstallments}
                onChange={(event) => setForm((value) => ({ ...value, emiInstallments: event.target.value }))}
                placeholder="Number of installments"
                className="bg-white border border-[#E5E7EB] rounded-[8px] px-[12px] h-[40px] text-[0.9rem] text-[#111827] focus:border-[#0D5C4E] focus:ring-[3px] focus:ring-[#0D5C4E]/15 outline-none"
              />
              <div className="rounded-xl border border-teal-600/20 bg-[#0D5C4E]/5 px-4 py-3 text-sm text-[#374151]">
                A live EMI schedule will be created automatically and linked to this invoice.
              </div>
            </div>
          </div>
        ) : null}

        <div className="sticky bottom-0 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-5 sm:p-6 bg-[#FFFFFF] border-t border-[#E5E7EB] mt-8 z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] rounded-b-0 sm:rounded-b-[12px] pb-[calc(1.25rem+env(safe-area-inset-bottom,16px))] sm:pb-6">
          <button type="submit" disabled={submitting} className="w-full bg-[#0D5C4E] text-[#FFFFFF] font-semibold h-[44px] rounded-[10px] hover:bg-[#1A7A68] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Creating Billing Record...
              </span>
            ) : 'Create Invoice'}
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
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 mb-6">
        <p className="text-[#111827] font-medium mb-2">{review.patient?.fullName || 'Patient'} <span className="text-[#6B7280] text-sm font-normal ml-2">left a {review.rating}-star review</span></p>
        <p className="text-[#374151] text-sm italic">"{review.comment}"</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="text-xs uppercase tracking-widest text-[#6B7280] font-semibold block mb-2">Your Reply (Public)</label>
        <textarea
          required
          value={reply}
          onChange={(event) => setReply(event.target.value)}
          placeholder="Thank you for your trust. We are honored to support your smile journey..."
          className="w-full bg-white border border-[#E5E7EB] rounded-[8px] px-[12px] h-[40px] text-[0.9rem] text-[#111827] focus:border-[#0D5C4E] focus:ring-[3px] focus:ring-[#0D5C4E]/15 outline-none h-32 resize-none"
        ></textarea>
        <button type="submit" disabled={submitting} className="w-full bg-[#0D5C4E] text-[#FFFFFF] font-semibold h-[44px] rounded-[10px] hover:bg-[#1A7A68] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Posting Reply...
            </span>
          ) : 'Post Reply'}
        </button>
      </form>
    </ModalWrapper>
  )
}

export function LogoutModal({ isOpen, onClose, onConfirm }) {
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Secure Logout" maxWidth="max-w-md">
      <div className="space-y-6">
        <p className="text-[#374151]">
          Are you sure you want to end your current session? You will need to re-authenticate to access the Azure OS dashboard again.
        </p>
        <div className="flex flex-col-reverse sm:flex-row gap-[10px] sm:gap-3 pt-6 border-t border-[#E5E7EB]">
          <button onClick={onClose} className="w-full sm:flex-1 bg-white border border-[#E5E7EB] text-[#374151] font-semibold h-[44px] rounded-[10px] hover:bg-[#F9FAFB] transition-all duration-200">
            Cancel
          </button>
          <button onClick={onConfirm} className="w-full sm:flex-1 bg-[#C0392B] text-[#FFFFFF] font-semibold h-[44px] rounded-[10px] hover:bg-[#991B1B] active:scale-[0.98] transition-all duration-200">
            Logout
          </button>
        </div>
      </div>
    </ModalWrapper>
  )
}
