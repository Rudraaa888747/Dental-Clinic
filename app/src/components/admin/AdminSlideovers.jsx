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
    <div className="fixed inset-0 z-50 flex justify-end bg-[#020817]/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-2xl bg-[#0F172A] border-l border-white/10 shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-300 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 blur-[100px] pointer-events-none"></div>
        <div className="flex justify-between items-center p-6 border-b border-white/5 bg-[#111827] relative z-10">
          <div className="flex items-center gap-3">
             {Icon && <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold"><Icon size={20} /></div>}
             <h3 className="text-2xl font-display font-medium text-white">{title}</h3>
          </div>
          <button onClick={onClose} className="p-2 bg-white/5 rounded-full text-support-300 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 relative z-10">
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
          <div key={insight.id} className="bg-[#111827] border border-white/5 rounded-2xl p-6">
            <h4 className="text-white font-medium mb-4 flex items-center gap-2">
              <AlertCircle size={18} className="text-gold" />
              {insight.title}
            </h4>
            <p className="text-support-200 text-sm mb-4 leading-relaxed">{insight.body}</p>
            <button
              onClick={() => showToast(`${insight.actionLabel} queued for staff follow-up.`)}
              className="bg-gold/20 text-gold text-sm font-semibold px-4 py-2 rounded-xl hover:bg-gold hover:text-navy transition-colors"
            >
              {insight.actionLabel}
            </button>
          </div>
        ))}

        <div className="bg-[#111827] border border-white/5 rounded-2xl p-6">
          <h4 className="text-white font-medium mb-4 flex items-center gap-2"><Activity size={18} className="text-sky-400" /> Live Telemetry</h4>
          <ul className="space-y-3 text-sm text-support-300">
            <li className="flex justify-between items-center"><span>Total Consultations</span> <span className="text-white font-medium">{metrics.totalConsultations || 0}</span></li>
            <li className="flex justify-between items-center"><span>Pending Triage</span> <span className="text-amber-400 font-medium">{metrics.pendingTriage || 0}</span></li>
            <li className="flex justify-between items-center"><span>Treatments Completed</span> <span className="text-emerald-400 font-medium">{metrics.treatmentsCompleted || 0}</span></li>
          </ul>
        </div>
      </div>
    </SlideoverWrapper>
  )
}

function InfoCard({ label, value }) {
  return (
    <div className="bg-[#111827] border border-white/5 p-4 rounded-2xl">
      <p className="text-[10px] uppercase tracking-widest text-support-300 font-semibold mb-1">{label}</p>
      <p className="text-sm text-white font-medium">{value}</p>
    </div>
  )
}

export function PatientProfileSlideover({ isOpen, onClose, patientProfile, loading, showToast }) {
  if (!isOpen) return null

  return (
    <SlideoverWrapper isOpen={isOpen} onClose={onClose} title="Patient Dashboard" icon={User}>
      {loading || !patientProfile ? (
        <div className="h-full flex items-center justify-center text-support-300">
          Loading patient intelligence...
        </div>
      ) : (
        <div className="space-y-8 pb-10">
          <div className="flex gap-6 items-start">
            <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center text-4xl text-gold font-display shadow-inner">
              {patientProfile.patient.avatarUrl ? (
                <img src={patientProfile.patient.avatarUrl} alt={patientProfile.patient.fullName} loading="lazy" width="96" height="96" className="w-full h-full object-cover" />
              ) : (
                patientProfile.patient.fullName.charAt(0)
              )}
            </div>
            <div>
              <h2 className="text-3xl font-display font-medium text-white">{patientProfile.patient.fullName}</h2>
              <p className="text-sm text-support-300 mt-1 flex items-center gap-3">
                PAT-{`${patientProfile.patient._id}`.slice(-4)} <span className="opacity-30">•</span> <Phone size={12} /> {patientProfile.patient.phone}
              </p>
              <div className="mt-4 flex gap-2 flex-wrap">
                <span className="bg-emerald-500/10 text-emerald-400 text-xs px-3 py-1 rounded-full font-semibold border border-emerald-500/20">{patientProfile.patient.status}</span>
                <span className="bg-white/5 text-support-300 text-xs px-3 py-1 rounded-full font-semibold border border-white/10">LTV: ₹{Number(patientProfile.lifetimeValue || 0).toLocaleString('en-IN')}</span>
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
            <h4 className="text-sm uppercase tracking-widest text-support-300 font-semibold mb-4 border-b border-white/5 pb-2">Treatment History</h4>
            <div className="space-y-4 border-l-2 border-white/5 pl-4 ml-2">
              {patientProfile.appointments.map((appointment) => (
                <div key={appointment._id} className="relative">
                  <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-gold shadow-[0_0_10px_rgba(212,175,55,0.5)]"></div>
                  <div className="bg-[#111827] border border-white/5 p-4 rounded-2xl">
                    <div className="flex justify-between mb-2 gap-4">
                      <p className="text-white font-medium">{appointment.treatment?.name || appointment.service}</p>
                      <p className="text-emerald-400 text-sm">{appointment.invoice?.totalAmount ? `₹${Number(appointment.invoice.totalAmount).toLocaleString('en-IN')}` : appointment.status}</p>
                    </div>
                    <p className="text-xs text-support-300">{appointment.doctor?.fullName || 'Unassigned'} • {appointment.date} • {appointment.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm uppercase tracking-widest text-support-300 font-semibold mb-4 border-b border-white/5 pb-2">Financials & EMI</h4>
            <div className="space-y-4">
              {patientProfile.emiPlans.map((plan) => (
                <div key={plan._id} className="bg-gradient-to-br from-[#111827] to-[#0F172A] border border-white/10 p-5 rounded-2xl flex justify-between items-center">
                  <div>
                    <p className="text-white font-medium mb-1">EMI Plan</p>
                    <p className="text-xs text-support-300">{plan.paidInstallments}/{plan.totalInstallments} installments paid • Next due: {plan.nextDueDate ? new Date(plan.nextDueDate).toLocaleDateString('en-IN') : 'Completed'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-display text-white">₹{Number(plan.installmentAmount || 0).toLocaleString('en-IN')} <span className="text-xs text-support-300">/mo</span></p>
                    <button onClick={() => showToast('EMI reminder opened in finance follow-up queue.')} className="text-[10px] text-gold uppercase tracking-widest font-semibold hover:underline">Send Reminder</button>
                  </div>
                </div>
              ))}
              {!patientProfile.emiPlans.length && (
                <div className="bg-[#111827] border border-white/5 p-5 rounded-2xl text-support-300 text-sm">No active EMI plan for this patient.</div>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-sm uppercase tracking-widest text-support-300 font-semibold mb-4 border-b border-white/5 pb-2">Invoices & Payments</h4>
            <div className="space-y-3">
              {patientProfile.invoices.map((invoice) => (
                <div key={invoice._id} className="bg-[#111827] border border-white/5 p-4 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard size={18} className="text-gold" />
                    <div>
                      <p className="text-white text-sm">{invoice.invoiceNumber}</p>
                      <p className="text-xs text-support-300">{invoice.status} • Paid ₹{Number(invoice.amountPaid || 0).toLocaleString('en-IN')} / ₹{Number(invoice.totalAmount || 0).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                  <span className="text-support-200 text-sm">₹{Number(invoice.balanceDue || 0).toLocaleString('en-IN')} due</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm uppercase tracking-widest text-support-300 font-semibold mb-4 border-b border-white/5 pb-2">Prescriptions & Notes</h4>
            <div className="space-y-3">
              {patientProfile.prescriptions.map((prescription) => (
                <div key={prescription._id} className="bg-[#111827] border border-white/5 p-4 rounded-2xl">
                  <p className="text-white font-medium flex items-center gap-2"><ClipboardPlus size={16} className="text-gold" /> {prescription.doctor?.fullName || 'Doctor Note'}</p>
                  <p className="text-xs text-support-300 mt-2">{prescription.notes || 'No notes provided.'}</p>
                </div>
              ))}
              {patientProfile.medicalRecords.map((record) => (
                <div key={record._id} className="bg-[#111827] border border-white/5 p-4 rounded-2xl">
                  <p className="text-white font-medium">{record.diagnosis || 'Clinical update'}</p>
                  <p className="text-xs text-support-300 mt-2">{record.notes || 'No further doctor notes.'}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm uppercase tracking-widest text-support-300 font-semibold mb-4 border-b border-white/5 pb-2">Files & Scans</h4>
            <div className="grid grid-cols-2 gap-4">
              {patientProfile.files.map((file) => (
                <div key={file._id} onClick={() => window.open(file.url, '_blank', 'noopener,noreferrer')} className="bg-[#111827] border border-white/5 p-4 rounded-2xl flex items-center gap-3 cursor-pointer hover:border-gold/30 transition-colors">
                  <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-support-300">
                    {file.type === 'xray' ? <Camera size={18} /> : <FileText size={18} />}
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium">{file.label}</p>
                    <p className="text-xs text-support-300">{new Date(file.createdAt).toLocaleDateString('en-IN')}</p>
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
