import React, { useEffect } from 'react'
import { X, BrainCircuit, AlertCircle, FileText, Activity, Camera, Clock, User, Phone, CheckCircle2, CreditCard, ClipboardPlus } from 'lucide-react'

function SlideoverWrapper({ isOpen, onClose, title, icon: Icon, children }) {
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
    <div className="fixed inset-0 z-50 flex justify-end max-md:items-end bg-[rgba(0,0,0,0.3)] backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-[100vw] md:max-w-[480px] bg-white border-l border-[#E5E7EB] shadow-[-8px_0_40px_rgba(0,0,0,0.1)] h-[90vh] md:h-full flex flex-col animate-in max-md:slide-in-from-bottom md:slide-in-from-right duration-300 relative rounded-t-[16px] md:rounded-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0D5C4E]/5 blur-[100px] pointer-events-none"></div>
        <div className="flex justify-between items-center p-6 border-b border-[#E5E7EB] bg-white relative z-10 rounded-t-[16px] md:rounded-none">
          <div className="flex items-center gap-3">
             {Icon && <div className="w-10 h-10 rounded-xl bg-[#0D5C4E]/10 flex items-center justify-center text-[#0D5C4E]"><Icon size={20} /></div>}
             <h3 className="text-[1rem] font-semibold text-[#111827]">{title}</h3>
          </div>
          <button onClick={onClose} className="p-2 bg-[#F9FAFB] rounded-full text-[#6B7280] hover:text-[#111827] transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-[24px] overflow-y-auto custom-scrollbar flex-1 relative z-10 text-[#374151]">
          {children}
        </div>
      </div>
    </div>
  )
}

export function AIAssistantSlideover({ isOpen, onClose, insights = [], metrics = {}, showToast }) {
  return (
    <SlideoverWrapper isOpen={isOpen} onClose={onClose} title="AI Clinical Assistant" icon={BrainCircuit}>
      <div className="space-y-6">
        {insights.map((insight) => (
          <div key={insight.id} className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
            <h4 className="text-[#111827] font-medium mb-4 flex items-center gap-2">
              <AlertCircle size={18} className="text-[#0D5C4E]" />
              {insight.title}
            </h4>
            <p className="text-[#374151] text-sm mb-4 leading-relaxed">{insight.body}</p>
            <button
              onClick={() => showToast(`${insight.actionLabel} queued for staff follow-up.`)}
              className="bg-[#0D5C4E]/20 text-[#0D5C4E] text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#0D5C4E] hover:text-navy transition-colors"
            >
              {insight.actionLabel}
            </button>
          </div>
        ))}

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
          <h4 className="text-[#111827] font-medium mb-4 flex items-center gap-2"><Activity size={18} className="text-[#0D5C4E]" /> Live Telemetry</h4>
          <ul className="space-y-3 text-sm text-[#6B7280]">
            <li className="flex justify-between items-center"><span>Total Consultations</span> <span className="text-[#111827] font-medium">{metrics.totalConsultations || 0}</span></li>
            <li className="flex justify-between items-center"><span>Pending Triage</span> <span className="text-[#0D5C4E] font-medium">{metrics.pendingTriage || 0}</span></li>
            <li className="flex justify-between items-center"><span>Treatments Completed</span> <span className="text-[#065F46] font-medium">{metrics.treatmentsCompleted || 0}</span></li>
          </ul>
        </div>
      </div>
    </SlideoverWrapper>
  )
}

function InfoCard({ label, value }) {
  return (
    <div className="bg-white border border-[#E5E7EB] p-4 rounded-2xl">
      <p className="text-[10px] uppercase tracking-widest text-[#6B7280] font-semibold mb-1">{label}</p>
      <p className="text-sm text-[#111827] font-medium">{value}</p>
    </div>
  )
}

export function PatientProfileSlideover({ isOpen, onClose, patientProfile, loading, showToast }) {
  if (!isOpen) return null

  return (
    <SlideoverWrapper isOpen={isOpen} onClose={onClose} title="Patient Dashboard" icon={User}>
      {loading || !patientProfile ? (
        <div className="h-full flex items-center justify-center text-[#6B7280]">
          Loading patient intelligence...
        </div>
      ) : (
        <div className="space-y-8 pb-10">
          <div className="flex gap-6 items-start">
            <div className="w-24 h-24 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] overflow-hidden flex items-center justify-center text-4xl text-[#0D5C4E] font-display shadow-inner">
              {patientProfile.patient.avatarUrl ? (
                <img src={patientProfile.patient.avatarUrl} alt={patientProfile.patient.fullName} loading="lazy" width="96" height="96" className="w-full h-full object-cover" />
              ) : (
                patientProfile.patient.fullName.charAt(0)
              )}
            </div>
            <div>
              <h2 className="text-3xl font-display font-medium text-[#111827]">{patientProfile.patient.fullName}</h2>
              <p className="text-sm text-[#6B7280] mt-1 flex items-center gap-3">
                PAT-{`${patientProfile.patient._id}`.slice(-4)} <span className="opacity-30">•</span> <Phone size={12} /> {patientProfile.patient.phone}
              </p>
              <div className="mt-4 flex gap-2 flex-wrap">
                <span className="bg-emerald-500/10 text-[#065F46] text-xs px-3 py-1 rounded-full font-semibold border border-emerald-500/20">{patientProfile.patient.status}</span>
                <span className="bg-[#F9FAFB] text-[#6B7280] text-xs px-3 py-1 rounded-full font-semibold border border-[#E5E7EB]">LTV: ₹{Number(patientProfile.lifetimeValue || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InfoCard label="Active Treatment" value={patientProfile.appointments[0]?.treatment?.name || patientProfile.appointments[0]?.service || 'Awaiting assignment'} />
            <InfoCard label="Next Appointment" value={patientProfile.appointments[0] ? `${patientProfile.appointments[0].date} • ${patientProfile.appointments[0].time}` : 'No upcoming appointment'} />
            <InfoCard label="Medical History" value={patientProfile.patient.medicalHistory || 'Not captured yet'} />
            <InfoCard label="Allergies" value={patientProfile.patient.allergies || 'No known allergies noted'} />
          </div>

          <div>
            <h4 className="text-sm uppercase tracking-widest text-[#6B7280] font-semibold mb-4 border-b border-[#E5E7EB] pb-2">Treatment History</h4>
            <div className="space-y-4 border-l-2 border-[#E5E7EB] pl-4 ml-2">
              {patientProfile.appointments.map((appointment) => (
                <div key={appointment._id} className="relative">
                  <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-[#0D5C4E] shadow-[0_0_10px_rgba(212,175,55,0.5)]"></div>
                  <div className="bg-white border border-[#E5E7EB] p-4 rounded-2xl">
                    <div className="flex justify-between mb-2 gap-4">
                      <p className="text-[#111827] font-medium">{appointment.treatment?.name || appointment.service}</p>
                      <p className="text-[#065F46] text-sm">{appointment.invoice?.totalAmount ? `₹${Number(appointment.invoice.totalAmount).toLocaleString('en-IN')}` : appointment.status}</p>
                    </div>
                    <p className="text-xs text-[#6B7280]">{appointment.doctor?.fullName || 'Unassigned'} • {appointment.date} • {appointment.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm uppercase tracking-widest text-[#6B7280] font-semibold mb-4 border-b border-[#E5E7EB] pb-2">Financials & EMI</h4>
            <div className="space-y-4">
              {patientProfile.emiPlans.map((plan) => (
                <div key={plan._id} className="bg-gradient-to-br from-[#111827] to-[#0F172A] border border-[#E5E7EB] p-5 rounded-2xl flex justify-between items-center">
                  <div>
                    <p className="text-[#111827] font-medium mb-1">EMI Plan</p>
                    <p className="text-xs text-[#6B7280]">{plan.paidInstallments}/{plan.totalInstallments} installments paid • Next due: {plan.nextDueDate ? new Date(plan.nextDueDate).toLocaleDateString('en-IN') : 'Completed'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-display text-[#111827]">₹{Number(plan.installmentAmount || 0).toLocaleString('en-IN')} <span className="text-xs text-[#6B7280]">/mo</span></p>
                    <button onClick={() => showToast('EMI reminder opened in finance follow-up queue.')} className="text-[10px] text-[#0D5C4E] uppercase tracking-widest font-semibold hover:underline">Send Reminder</button>
                  </div>
                </div>
              ))}
              {!patientProfile.emiPlans.length && (
                <div className="bg-white border border-[#E5E7EB] p-5 rounded-2xl text-[#6B7280] text-sm">No active EMI plan for this patient.</div>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-sm uppercase tracking-widest text-[#6B7280] font-semibold mb-4 border-b border-[#E5E7EB] pb-2">Invoices & Payments</h4>
            <div className="space-y-3">
              {patientProfile.invoices.map((invoice) => (
                <div key={invoice._id} className="bg-white border border-[#E5E7EB] p-4 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard size={18} className="text-[#0D5C4E]" />
                    <div>
                      <p className="text-[#111827] text-sm">{invoice.invoiceNumber}</p>
                      <p className="text-xs text-[#6B7280]">{invoice.status} • Paid ₹{Number(invoice.amountPaid || 0).toLocaleString('en-IN')} / ₹{Number(invoice.totalAmount || 0).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                  <span className="text-[#374151] text-sm">₹{Number(invoice.balanceDue || 0).toLocaleString('en-IN')} due</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm uppercase tracking-widest text-[#6B7280] font-semibold mb-4 border-b border-[#E5E7EB] pb-2">Prescriptions & Notes</h4>
            <div className="space-y-3">
              {patientProfile.prescriptions.map((prescription) => (
                <div key={prescription._id} className="bg-white border border-[#E5E7EB] p-4 rounded-2xl">
                  <p className="text-[#111827] font-medium flex items-center gap-2"><ClipboardPlus size={16} className="text-[#0D5C4E]" /> {prescription.doctor?.fullName || 'Doctor Note'}</p>
                  <p className="text-xs text-[#6B7280] mt-2">{prescription.notes || 'No notes provided.'}</p>
                </div>
              ))}
              {patientProfile.medicalRecords.map((record) => (
                <div key={record._id} className="bg-white border border-[#E5E7EB] p-4 rounded-2xl">
                  <p className="text-[#111827] font-medium">{record.diagnosis || 'Clinical update'}</p>
                  <p className="text-xs text-[#6B7280] mt-2">{record.notes || 'No further doctor notes.'}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm uppercase tracking-widest text-[#6B7280] font-semibold mb-4 border-b border-[#E5E7EB] pb-2">Files & Scans</h4>
            <div className="grid grid-cols-2 gap-4">
              {patientProfile.files.map((file) => (
                <div key={file._id} onClick={() => window.open(file.url, '_blank', 'noopener,noreferrer')} className="bg-white border border-[#E5E7EB] p-4 rounded-2xl flex items-center gap-3 cursor-pointer hover:border-teal-600/30 transition-colors">
                  <div className="w-10 h-10 bg-[#F9FAFB] rounded-lg flex items-center justify-center text-[#6B7280]">
                    {file.type === 'xray' ? <Camera size={18} /> : <FileText size={18} />}
                  </div>
                  <div>
                    <p className="text-sm text-[#111827] font-medium">{file.label}</p>
                    <p className="text-xs text-[#6B7280]">{new Date(file.createdAt).toLocaleDateString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 flex items-center gap-3 text-emerald-300">
            <CheckCircle2 size={20} />
            <p className="text-sm">Patient profile is now powered by live treatment, billing, and clinical records.</p>
          </div>
        </div>
      )}
    </SlideoverWrapper>
  )
}
