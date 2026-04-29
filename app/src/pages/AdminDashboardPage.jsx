import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import AnimatedSection from '../components/AnimatedSection'
import SectionHeading from '../components/SectionHeading'
import { Calendar, MessageCircle } from 'lucide-react'

function AdminDashboardPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const token = location.state?.token || ''
  const [dashboard, setDashboard] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    api.getAdminDashboard()
      .then(setDashboard)
      .catch((error) => {
        setMessage(error.message)
        if (error.message.includes('Auth') || error.message.includes('token')) {
          navigate('/admin')
        }
      })
  }, [navigate])

  async function handleLogout() {
    try {
      await api.adminLogout()
      navigate('/admin')
    } catch (error) {
      setMessage(error.message)
    }
  }

  async function handleStatusUpdate(id, status) {
    try {
      await api.updateAppointmentStatus(id, status)
      setDashboard((value) => ({
        ...value,
        appointments: value.appointments.map((item) =>
          item._id === id ? { ...item, status } : item,
        ),
      }))
    } catch (error) {
      setMessage(error.message)
    }
  }

  if (!dashboard) {
    return (
      <AnimatedSection className="section-space">
        <div className="page-shell text-center text-slate-600">Loading dashboard...</div>
      </AnimatedSection>
    )
  }

  // 🔥 Stats Calculation
  const total = dashboard.appointments.length
  const pending = dashboard.appointments.filter(a => a.status === 'pending').length
  const confirmed = dashboard.appointments.filter(a => a.status === 'confirmed').length
  const completed = dashboard.appointments.filter(a => a.status === 'completed').length

  return (
    <AnimatedSection className="section-space">
      <div className="page-shell">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <SectionHeading
            eyebrow="Dashboard"
            title="Manage clinic operations."
            description="Premium admin panel for overseeing appointments and inquiries."
          />
          <button
            onClick={handleLogout}
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-slate-800 hover:shadow-lg"
          >
            Logout
          </button>
        </div>

        {/* 🔥 TOP STATS */}
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-6">
          {[ 
            { label: 'Total Appointments', value: total },
            { label: 'Pending Review', value: pending },
            { label: 'Confirmed', value: confirmed },
            { label: 'Completed', value: completed },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center justify-center rounded-3xl bg-white/80 p-6 text-center shadow-card backdrop-blur-xl border border-white">
              <p className="text-sm font-medium text-slate-500 mb-1">{item.label}</p>
              <p className="font-display text-4xl font-bold text-ink">{item.value}</p>
            </div>
          ))}
        </div>

        {/* 🔥 MAIN GRID */}
        <div className="mt-10 grid gap-8 xl:grid-cols-3">
          
          {/* 🦷 APPOINTMENTS */}
          <div className="xl:col-span-2 rounded-[32px] bg-white/80 p-8 shadow-card backdrop-blur-xl border border-white">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-skybrand-100 text-skybrand-600">
                <Calendar size={24} />
              </div>
              <h3 className="font-display text-2xl font-semibold text-ink">Appointments</h3>
            </div>

            <div className="space-y-4">
              {dashboard.appointments.length ? (
                dashboard.appointments.map((item) => (
                  <div
                    key={item._id}
                    className="group rounded-2xl border border-slate-100 bg-white p-5 transition hover:border-skybrand-200 hover:shadow-lg"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-display text-lg font-semibold text-ink">{item.name}</p>
                        <p className="mt-1 text-sm font-medium text-slate-500">
                          <span className="text-skybrand-700">{item.service}</span> • {item.date} • {item.time}
                        </p>
                      </div>

                      {/* STATUS */}
                      <div className="flex flex-wrap gap-2">
                        {['pending', 'confirmed', 'completed'].map((status) => (
                          <button
                            key={status}
                            onClick={() => handleStatusUpdate(item._id, status)}
                            className={`rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition ${
                              item.status === status
                                ? status === 'pending'
                                  ? 'bg-amber-400 text-amber-950 shadow-md'
                                  : status === 'confirmed'
                                  ? 'bg-skybrand-500 text-white shadow-md'
                                  : 'bg-emerald-500 text-white shadow-md'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No appointments yet.</p>
              )}
            </div>
            {message && <p className="mt-6 text-sm font-medium text-rose-500">{message}</p>}
          </div>

          {/* 📩 CONTACT */}
          <div className="rounded-[32px] bg-white/80 p-8 shadow-card backdrop-blur-xl border border-white flex flex-col">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-skybrand-100 text-skybrand-600">
                <MessageCircle size={24} />
              </div>
              <h3 className="font-display text-2xl font-semibold text-ink">Inquiries</h3>
            </div>

            <div className="flex-grow space-y-4">
              {dashboard.inquiries?.length ? (
                dashboard.inquiries.map((item) => (
                  <div key={item._id} className="rounded-2xl border border-slate-100 bg-white p-5 transition hover:shadow-md">
                    <p className="font-display text-base font-semibold text-ink">{item.name}</p>
                    <p className="mt-1 text-sm font-medium text-skybrand-600">{item.phone}</p>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.message}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No inquiries yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}

export default AdminDashboardPage