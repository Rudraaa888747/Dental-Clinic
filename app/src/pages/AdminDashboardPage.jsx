import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import { api } from '../lib/api'
import AnimatedSection from '../components/AnimatedSection'
import {
  Calendar,
  MessageCircle,
  LogOut,
  Star,
  Users,
  Activity,
  CreditCard,
  Settings,
  Bell,
  Search,
  Sparkles,
  ChevronDown,
  BrainCircuit,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Plus,
  ArrowUpRight,
  Download,
  TrendingUp,
  Command,
} from 'lucide-react'
import {
  NewBookingModal,
  AddPatientModal,
  NewInvoiceModal,
  ReportModal,
  InvoiceModal,
  ReplyReviewModal,
  LogoutModal,
} from '../components/admin/AdminModals'
import {
  AIAssistantSlideover,
  PatientProfileSlideover,
} from '../components/admin/AdminSlideovers'
import {
  ActivityTimeline,
  CommandPalette,
  NotificationCenter,
  SettingsPanel,
} from '../components/admin/AdminUtilityPanels'

function formatMoney(value = 0) {
  return `₹${Number(value).toLocaleString('en-IN')}`
}

function formatDateLabel(value) {
  if (!value) return 'N/A'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('en-IN')
}

function hasAnyPermission(user, permissions) {
  return permissions.some((permission) => user?.permissions?.includes(permission))
}

function AdminDashboardPage() {
  const navigate = useNavigate()
  const [dashboard, setDashboard] = useState(null)
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  const [toast, setToast] = useState(null)
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false)
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [isAIOpen, setIsAIOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [activeInvoice, setActiveInvoice] = useState(null)
  const [activePatientId, setActivePatientId] = useState(null)
  const [activePatientProfile, setActivePatientProfile] = useState(null)
  const [patientProfileLoading, setPatientProfileLoading] = useState(false)
  const [activeReview, setActiveReview] = useState(null)
  const [activityLogs, setActivityLogs] = useState([])

  const currentUser = dashboard?.currentUser
  const canManagePatients = hasAnyPermission(currentUser, ['manage_patients'])
  const canManageAppointments = hasAnyPermission(currentUser, ['manage_appointments'])
  const canManageInvoices = hasAnyPermission(currentUser, ['manage_invoices'])
  const canManageBilling = hasAnyPermission(currentUser, ['manage_billing'])
  const canManageReviews = hasAnyPermission(currentUser, ['manage_reviews'])
  const canGenerateReports = hasAnyPermission(currentUser, ['generate_reports'])

  const visibleTabs = useMemo(() => {
    const tabs = [{ id: 'overview', label: 'Overview', icon: Activity }]
    if (canManageAppointments) tabs.push({ id: 'appointments', label: 'Appointments', icon: Calendar })
    if (canManagePatients) tabs.push({ id: 'patients', label: 'Patients', icon: Users })
    if (dashboard?.treatments?.length) tabs.push({ id: 'treatments', label: 'Treatments', icon: ShieldCheck })
    if (canManageReviews) tabs.push({ id: 'reviews', label: 'Reviews', icon: Star })
    if (canManageInvoices || canManageBilling || canGenerateReports) {
      tabs.push({ id: 'billing', label: 'Billing & EMI', icon: CreditCard })
    }
    return tabs
  }, [canGenerateReports, canManageAppointments, canManageBilling, canManageInvoices, canManagePatients, canManageReviews, dashboard?.treatments?.length])

  const showToast = useCallback((msg) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 3000)
  }, [])

  const refreshDashboard = useCallback(async () => {
    try {
      const response = await api.getAdminDashboard()
      setDashboard(response)
      setActivityLogs(response.activityLogs || [])
      setMessage('')
      const allowedTabs = ['overview']
      if (hasAnyPermission(response.currentUser, ['manage_appointments'])) allowedTabs.push('appointments')
      if (hasAnyPermission(response.currentUser, ['manage_patients'])) allowedTabs.push('patients')
      if (response.treatments?.length) allowedTabs.push('treatments')
      if (hasAnyPermission(response.currentUser, ['manage_reviews'])) allowedTabs.push('reviews')
      if (hasAnyPermission(response.currentUser, ['manage_invoices', 'manage_billing', 'generate_reports'])) allowedTabs.push('billing')
      if (!allowedTabs.includes(activeTab)) {
        setActiveTab('overview')
      }
    } catch (error) {
      setMessage(error.message)
      if (error.message.includes('Auth') || error.message.includes('token') || error.message.includes('Unauthorized')) {
        navigate('/admin')
      }
    }
  }, [activeTab, navigate])

  useEffect(() => {
    refreshDashboard()
  }, [refreshDashboard])



  useEffect(() => {
    const token =
      window.localStorage.getItem('adminToken') || window.sessionStorage.getItem('adminToken')

    const socket = io(window.location.origin, {
      withCredentials: true,
      auth: token ? { token } : undefined,
    })

    socket.on('connect_error', () => undefined)
    socket.on('notification:new', ({ notification }) => {
      setDashboard((value) => value ? ({
        ...value,
        notifications: [notification, ...(value.notifications || [])].slice(0, 20),
        unreadNotifications: (value.unreadNotifications || 0) + (notification.read ? 0 : 1),
      }) : value)
    })
    socket.on('notification:updated', ({ notification }) => {
      setDashboard((value) => {
        if (!value) return value
        const notifications = value.notifications.map((item) =>
          item._id === notification._id ? notification : item,
        )
        return {
          ...value,
          notifications,
          unreadNotifications: notifications.filter((item) => !item.read).length,
        }
      })
    })
    socket.on('activity:new', ({ activity }) => {
      setActivityLogs((value) => [activity, ...value].slice(0, 60))
    })
    socket.on('patient:created', ({ patient }) => {
      setDashboard((value) => value ? ({
        ...value,
        patients: [patient, ...value.patients],
        metrics: {
          ...value.metrics,
          totalPatients: (value.metrics?.totalPatients || 0) + 1,
        },
      }) : value)
    })
    socket.on('appointment:created', ({ appointment }) => {
      setDashboard((value) => value ? ({
        ...value,
        appointments: [appointment, ...value.appointments],
        metrics: {
          ...value.metrics,
          totalConsultations: (value.metrics?.totalConsultations || 0) + 1,
          confirmedToday: (value.metrics?.confirmedToday || 0) + (appointment.status === 'confirmed' ? 1 : 0),
        },
      }) : value)
    })
    socket.on('appointment:updated', ({ appointment }) => {
      setDashboard((value) => value ? ({
        ...value,
        appointments: value.appointments.map((item) =>
          item._id === appointment._id ? appointment : item,
        ),
      }) : value)
    })
    socket.on('invoice:created', ({ invoice }) => {
      setDashboard((value) => value ? ({
        ...value,
        invoices: [invoice, ...value.invoices],
      }) : value)
    })
    socket.on('invoice:updated', ({ invoice }) => {
      setDashboard((value) => value ? ({
        ...value,
        invoices: value.invoices.map((item) => (item._id === invoice._id ? invoice : item)),
      }) : value)
    })
    socket.on('emi:created', ({ emiPlan }) => {
      setDashboard((value) => value ? ({
        ...value,
        emiPlans: [emiPlan, ...(value.emiPlans || []).filter((item) => item._id !== emiPlan._id)],
      }) : value)
    })
    socket.on('review:updated', ({ review }) => {
      setDashboard((value) => value ? ({
        ...value,
        reviews: value.reviews.map((item) => (item._id === review._id ? review : item)),
        reviewAnalytics: {
          ...value.reviewAnalytics,
          pendingReplies: value.reviews.map((item) => item._id === review._id ? review : item).filter((item) => !item.adminReply).length,
        },
      }) : value)
    })
    socket.on('settings:updated', ({ clinic }) => {
      setDashboard((value) => value ? ({
        ...value,
        content: {
          ...value.content,
          clinic,
        },
      }) : value)
    })
    socket.on('treatments:synced', ({ treatments }) => {
      setDashboard((value) => value ? ({
        ...value,
        treatments,
      }) : value)
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!activePatientId) {
      setActivePatientProfile(null)
      return
    }

    let mounted = true
    setPatientProfileLoading(true)

    api
      .getPatientProfile(activePatientId)
      .then((response) => {
        if (mounted) setActivePatientProfile(response)
      })
      .catch((error) => {
        if (mounted) showToast(error.message)
      })
      .finally(() => {
        if (mounted) setPatientProfileLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [activePatientId, showToast])

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
      const response = await api.updateAppointmentStatus(id, status)
      setDashboard((value) => {
        const nextAppointments = value.appointments.map((item) =>
          item._id === id ? response.appointment : item,
        )
        return {
          ...value,
          appointments: nextAppointments,
          metrics: {
            ...value.metrics,
            pendingTriage: nextAppointments.filter(a => a.status === 'pending').length,
            confirmedToday: nextAppointments.filter(a => a.status === 'confirmed').length,
          }
        }
      })
      showToast(`Appointment status updated to ${status}.`)
    } catch (error) {
      showToast(error.message)
    }
  }

  async function handleNotificationRead(id) {
    try {
      const response = await api.markNotificationRead(id)
      setDashboard((value) => {
        const notifications = value.notifications.map((item) =>
          item._id === id ? response.notification : item,
        )
        return {
          ...value,
          notifications,
          unreadNotifications: notifications.filter((item) => !item.read).length,
        }
      })
    } catch (error) {
      showToast(error.message)
    }
  }

  async function handleLogSearch(query) {
    try {
      const response = await api.getActivityLogs(query)
      setActivityLogs(response.activityLogs)
    } catch (error) {
      showToast(error.message)
    }
  }

  function mergeBookingIntoDashboard(response) {
    setDashboard((value) => ({
      ...value,
      appointments: [response.appointment, ...(value?.appointments || [])],
      invoices: [response.invoice, ...(value?.invoices || [])],
    }))
  }

  function mergePatientIntoDashboard(patient) {
    setDashboard((value) => ({
      ...value,
      patients: [patient, ...(value?.patients || [])],
      metrics: {
        ...(value?.metrics || {}),
        totalPatients: (value?.metrics?.totalPatients || 0) + 1,
      },
    }))
  }

  function mergeInvoice(invoice) {
    setDashboard((value) => ({
      ...value,
      invoices: value.invoices.map((item) => (item._id === invoice._id ? invoice : item)),
    }))
  }

  function mergeReview(review) {
    setDashboard((value) => {
      const reviews = value.reviews.map((item) => (item._id === review._id ? review : item))
      return {
        ...value,
        reviews,
        reviewAnalytics: {
          ...value.reviewAnalytics,
          pendingReplies: reviews.filter((item) => !item.adminReply).length,
        },
      }
    })
  }



  if (!dashboard) {
    return (
      <AnimatedSection className="section-space min-h-screen bg-[#020817] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative flex h-16 w-16 items-center justify-center">
            <div className="absolute inset-0 rounded-full border-t-2 border-gold animate-spin"></div>
            <Sparkles className="text-gold" size={24} />
          </div>
          <p className="text-support-300 animate-pulse tracking-[0.3em] uppercase text-xs font-semibold">
            Initializing Clinic OS...
          </p>
          {message ? <p className="text-rose-400 text-sm">{message}</p> : null}
        </div>
      </AnimatedSection>
    )
  }

  const topAppointments = dashboard.appointments.slice(0, 4)
  const topInquiries = dashboard.inquiries.slice(0, 4)
  const topPatients = dashboard.patients.slice(0, 6)
  const topInvoices = dashboard.invoices.slice(0, 6)

  return (
    <div className="min-h-screen bg-[#020817] text-[#E2E8F0] font-sans flex overflow-hidden selection:bg-gold/30">
      {toast && (
        <div className="fixed bottom-8 right-8 z-50 bg-[#0F172A] border border-gold/30 text-gold px-6 py-4 rounded-2xl shadow-[0_10px_40px_rgba(212,175,55,0.15)] flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <CheckCircle2 size={20} />
          <p className="text-sm font-medium">{toast}</p>
        </div>
      )}

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        initialClinic={dashboard.content?.clinic}
        adminUsers={dashboard.adminUsers}
        showToast={showToast}
        onSaved={(content) =>
          setDashboard((value) => ({
            ...value,
            content,
          }))
        }
        onTreatmentsSynced={(treatments) =>
          setDashboard((value) => ({
            ...value,
            treatments,
          }))
        }
      />
      <NewBookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        showToast={showToast}
        patients={dashboard.patients}
        doctors={dashboard.doctors}
        treatments={dashboard.treatments}
        onCreated={mergeBookingIntoDashboard}
      />
      <AddPatientModal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        showToast={showToast}
        onCreated={mergePatientIntoDashboard}
      />
      <NewInvoiceModal
        isOpen={isNewInvoiceOpen}
        onClose={() => setIsNewInvoiceOpen(false)}
        showToast={showToast}
        patients={dashboard.patients}
        doctors={dashboard.doctors}
        treatments={dashboard.treatments}
        onCreated={({ invoice, emiPlan }) =>
          setDashboard((value) => ({
            ...value,
            invoices: [invoice, ...(value?.invoices || [])],
            emiPlans: emiPlan ? [emiPlan, ...(value?.emiPlans || [])] : value?.emiPlans || [],
          }))
        }
      />
      <ReportModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} showToast={showToast} />
      <InvoiceModal isOpen={!!activeInvoice} onClose={() => setActiveInvoice(null)} invoice={activeInvoice} showToast={showToast} onUpdated={mergeInvoice} />
      {activeReview && (
        <ReplyReviewModal
          isOpen={true}
          onClose={() => setActiveReview(null)}
          review={activeReview}
          showToast={showToast}
          onUpdated={mergeReview}
        />
      )}
      <AIAssistantSlideover isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} showToast={showToast} insights={dashboard.aiInsights} metrics={dashboard.metrics} />
      <PatientProfileSlideover
        isOpen={!!activePatientId}
        onClose={() => setActivePatientId(null)}
        patientProfile={activePatientProfile}
        loading={patientProfileLoading}
        showToast={showToast}
      />

      <aside className="w-64 border-r border-white/5 bg-[#0F172A]/50 backdrop-blur-2xl flex flex-col hidden lg:flex relative z-20">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 border border-gold/20 text-gold shadow-[0_0_15px_rgba(212,175,55,0.15)]">
              <Sparkles size={18} />
            </div>
            <div>
              <h1 className="font-display font-medium text-white tracking-wide">Azure OS</h1>
              <p className="text-[10px] uppercase tracking-widest text-gold/70 font-semibold">Premium Clinic</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {visibleTabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-gold/10 text-gold border border-gold/20 shadow-[0_0_15px_rgba(212,175,55,0.05)]'
                    : 'text-support-300 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            )
          })}

          <div className="mt-8 pt-8 border-t border-white/5">
            <p className="px-4 text-[10px] font-semibold uppercase tracking-widest text-support-300/50 mb-4">Access</p>
            <div className="px-4 py-3 rounded-xl border border-white/5 bg-white/[0.03]">
              <p className="text-sm text-white">{currentUser?.fullName}</p>
              <p className="text-[10px] uppercase tracking-widest text-gold mt-2">{currentUser?.roleLabel}</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/5">
            <p className="px-4 text-[10px] font-semibold uppercase tracking-widest text-support-300/50 mb-4">System</p>
            <button onClick={() => setIsSettingsOpen(true)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-support-300 hover:text-white hover:bg-white/5 transition-colors border border-transparent">
              <Settings size={18} strokeWidth={1.5} />
              <span className="text-sm font-medium">Settings</span>
            </button>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-400/70 hover:text-rose-400 hover:bg-rose-500/10 transition-colors border border-transparent">
              <LogOut size={18} strokeWidth={1.5} />
              <span className="text-sm font-medium">Secure Logout</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative overflow-hidden pb-[80px] lg:pb-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gold/5 blur-[150px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#0F172A]/50 blur-[100px] rounded-full pointer-events-none"></div>

        <header className="h-16 lg:h-20 border-b border-white/5 bg-[#020817]/80 backdrop-blur-xl flex items-center justify-between px-4 lg:px-8 relative z-20">
          <div className="flex items-center gap-4 lg:gap-6 lg:w-auto justify-between lg:justify-start">
            <div className="lg:hidden flex shrink-0 items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/10 border border-gold/20 text-gold">
                <Sparkles size={14} />
              </div>
              <span className="font-display font-medium text-white tracking-wide">Azure OS</span>
            </div>
            
            <div className="relative w-full max-w-[200px] lg:w-[320px] hidden sm:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-support-300 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-[#0F172A]/50 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder-support-300 focus:border-gold/40 focus:outline-none transition-all shadow-inner"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            <button onClick={() => setIsAIOpen(true)} className="flex items-center gap-2 bg-gradient-to-r from-gold/20 to-gold/5 border border-gold/30 rounded-full px-3 py-1.5 lg:px-4 lg:py-2 hover:from-gold/30 hover:to-gold/10 transition-all shadow-[0_0_20px_rgba(212,175,55,0.1)] group">
              <BrainCircuit className="text-gold group-hover:animate-pulse" size={16} />
              <span className="hidden lg:inline text-xs font-semibold text-gold uppercase tracking-wider">AI Assistant</span>
            </button>

            <div className="relative">
              <button onClick={() => setIsNotificationsOpen((value) => !value)} className="relative p-2 text-support-300 hover:text-white transition-colors">
                <Bell size={20} />
                {dashboard.unreadNotifications ? <span className="absolute top-1.5 right-1.5 min-w-5 h-5 px-1 rounded-full bg-gold text-navy text-[10px] font-bold flex items-center justify-center">{dashboard.unreadNotifications}</span> : null}
              </button>
              <NotificationCenter
                isOpen={isNotificationsOpen}
                onClose={() => setIsNotificationsOpen(false)}
                notifications={dashboard.notifications}
                unreadCount={dashboard.unreadNotifications}
                onRead={handleNotificationRead}
                showToast={showToast}
              />
            </div>

            <div className="hidden lg:block w-px h-6 bg-white/10 mx-2"></div>
            <div className="relative shrink-0">
              <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}>
                <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=100&q=80" alt="Admin" loading="lazy" width="36" height="36" className="w-8 h-8 lg:w-9 lg:h-9 shrink-0 rounded-full object-cover border border-white/10 group-hover:border-gold/50 transition-colors" />
                <div className="hidden lg:block">
                  <p className="text-sm font-medium text-white group-hover:text-gold transition-colors">{currentUser?.fullName}</p>
                  <p className="text-[10px] text-support-300 uppercase tracking-widest">{currentUser?.roleLabel}</p>
                </div>
                <ChevronDown size={14} className="text-support-300 group-hover:text-white transition-colors hidden lg:block" />
              </div>
              
              {isProfileMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileMenuOpen(false)}></div>
                  <div className="absolute right-0 mt-3 w-56 bg-[#0F172A] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-white/5 bg-[#111827]">
                      <p className="text-sm font-medium text-white">{currentUser?.fullName}</p>
                      <p className="text-[10px] text-support-300 uppercase tracking-widest mt-1">{currentUser?.roleLabel}</p>
                    </div>
                    <div className="p-2">
                      <button onClick={() => { setIsProfileMenuOpen(false); setIsSettingsOpen(true) }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-support-300 hover:text-white hover:bg-white/5 transition-colors">
                        <Settings size={16} />
                        <span className="text-sm font-medium">Settings</span>
                      </button>
                      <button onClick={() => { setIsProfileMenuOpen(false); setIsLogoutModalOpen(true) }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-400 hover:text-white hover:bg-rose-500/10 transition-colors mt-1">
                        <LogOut size={16} />
                        <span className="text-sm font-medium">Secure Logout</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative z-10">
          <AnimatedSection>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8 lg:mb-10">
              <div>
                <h2 className="text-3xl font-display font-medium text-white capitalize">{activeTab}</h2>
                <p className="text-support-300 text-sm mt-2 font-light">
                  {activeTab === 'overview' && 'Live clinic telemetry, synchronized workflows, and audit visibility.'}
                  {activeTab === 'appointments' && 'Manage scheduling, confirmation, and multi-admin coordination.'}
                  {activeTab === 'patients' && 'Protected patient records with role-aware access.'}
                  {activeTab === 'treatments' && 'Unified treatment catalog synced from the public Azure OS experience.'}
                  {activeTab === 'reviews' && 'Reputation operations, replies, and premium service follow-through.'}
                  {activeTab === 'billing' && 'Invoices, payments, EMI workflows, and finance operations.'}
                </p>
              </div>
              <div className="flex gap-3">
                {canGenerateReports && !['billing', 'treatments'].includes(activeTab) && (
                  <button onClick={() => setIsReportModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white hover:bg-white/10 transition-colors">
                    <Download size={16} />
                    Report
                  </button>
                )}
                {canManageAppointments && activeTab !== 'billing' ? (
                  <button onClick={() => setIsBookingOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-gold text-navy font-semibold rounded-xl text-sm shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:bg-gold-light hover:scale-105 transition-all">
                    <Plus size={16} strokeWidth={2.5} />
                    New Booking
                  </button>
                ) : null}
                {activeTab === 'billing' && canManageBilling ? (
                  <button onClick={() => setIsNewInvoiceOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-gold text-navy font-semibold rounded-xl text-sm shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:bg-gold-light hover:scale-105 transition-all">
                    <Plus size={16} strokeWidth={2.5} />
                    New Invoice
                  </button>
                ) : null}
              </div>
            </div>

            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="flex overflow-x-auto lg:grid lg:grid-cols-4 gap-4 lg:gap-6 pb-4 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0 custom-scrollbar snap-x snap-mandatory">
                  {[
                    { label: 'Total Consultations', value: dashboard.metrics.totalConsultations, trend: `${dashboard.metrics.totalPatients} patients`, icon: Users },
                    { label: 'Pending Triage', value: dashboard.metrics.pendingTriage, trend: 'Needs follow-up', icon: AlertCircle, alert: true },
                    { label: 'Confirmed Today', value: dashboard.metrics.confirmedToday, trend: 'Live schedule', icon: CheckCircle2 },
                    { label: 'Collections Captured', value: formatMoney(dashboard.metrics.monthlyRevenue), trend: 'Cashflow live', icon: ShieldCheck },
                  ].map((item) => (
                    <div key={item.label} className="min-w-[280px] lg:min-w-0 snap-start bg-[#111827]/60 backdrop-blur-md border border-white/5 rounded-[24px] p-6 relative overflow-hidden group hover:border-white/10 transition-colors flex-shrink-0">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[30px] rounded-full group-hover:bg-gold/5 transition-colors"></div>
                      <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className={`p-2.5 rounded-xl ${item.alert ? 'bg-amber-500/10 text-amber-500' : 'bg-white/5 text-support-300'}`}>
                          <item.icon size={20} strokeWidth={1.5} />
                        </div>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${item.alert ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                          {item.trend}
                        </span>
                      </div>
                      <p className="text-3xl font-display font-light text-white relative z-10">{item.value}</p>
                      <p className="text-xs uppercase tracking-widest text-support-300 font-semibold mt-2 relative z-10">{item.label}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  <div className="xl:col-span-2 bg-[#111827]/60 backdrop-blur-md border border-white/5 rounded-[32px] p-8 flex flex-col">
                    <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
                      <h3 className="text-xl font-display font-medium text-white flex items-center gap-3">
                        <Calendar size={20} className="text-gold" />
                        Live Appointments
                      </h3>
                      {canManageAppointments ? <button onClick={() => setActiveTab('appointments')} className="text-xs text-gold uppercase tracking-widest hover:text-white transition-colors font-semibold">View All</button> : null}
                    </div>

                    <div className="space-y-4 flex-1">
                      {topAppointments.length ? topAppointments.map((item) => (
                        <div key={item._id} className="group bg-[#0F172A]/50 border border-white/5 rounded-2xl p-4 sm:p-5 hover:border-gold/30 hover:bg-[#0F172A] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer overflow-hidden" onClick={() => item.patient?._id && setActivePatientId(item.patient._id)}>
                          <div className="flex items-center gap-3 sm:gap-4 min-w-0 w-full sm:w-auto">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-support-100 to-support-300 flex shrink-0 items-center justify-center text-navy font-bold text-sm shadow-inner">
                              {(item.patient?.fullName || item.name).charAt(0)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-display text-white text-base sm:text-lg group-hover:text-gold transition-colors truncate">{item.patient?.fullName || item.name}</p>
                              <p className="text-[10px] sm:text-xs text-support-300 mt-1 flex flex-wrap items-center gap-1.5 sm:gap-2">
                                <span className="text-gold font-medium truncate max-w-[120px] sm:max-w-[150px]">{item.treatment?.name || item.service}</span>
                                <span className="opacity-30 hidden sm:inline">•</span>
                                <span className="flex items-center gap-1 shrink-0"><Clock size={10} className="sm:w-3 sm:h-3" /> {item.date} {item.time}</span>
                              </p>
                            </div>
                          </div>
                          {canManageAppointments ? (
                            <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 hide-scrollbar shrink-0">
                              {['pending', 'confirmed'].map((status) => (
                                <button
                                  key={status}
                                  onClick={(event) => {
                                    event.stopPropagation()
                                    handleStatusUpdate(item._id, status)
                                  }}
                                  className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all ${
                                    item.status === status
                                      ? status === 'pending'
                                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                      : 'bg-white/5 text-support-300 border border-transparent hover:bg-white/10'
                                  }`}
                                >
                                  {status}
                                </button>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      )) : (
                        <div className="h-full flex flex-col items-center justify-center text-support-300">
                          <Calendar size={40} className="mb-4 opacity-20" />
                          <p className="text-sm font-light">No appointments currently scheduled.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-[#111827]/60 backdrop-blur-md border border-white/5 rounded-[32px] p-4 sm:p-6 lg:p-8 flex-1 flex flex-col">
                    <h3 className="text-xl font-display font-medium text-white flex items-center gap-3 mb-6">
                      <MessageCircle size={20} className="text-gold" />
                      Recent Inquiries
                    </h3>
                    <div className="space-y-4">
                      {topInquiries.length ? topInquiries.map((item) => (
                        <div key={item._id} className="bg-[#0F172A]/50 border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-all cursor-pointer" onClick={() => showToast(`Inquiry queue opened for ${item.name}.`)}>
                          <div className="flex justify-between items-start mb-2">
                            <p className="font-display font-medium text-white">{item.name}</p>
                            <span className="text-[10px] bg-rose-500/10 text-rose-400 px-2 py-1 rounded-full uppercase tracking-widest font-semibold">Lead</span>
                          </div>
                          <p className="text-xs text-gold font-medium mb-2">{item.phone}</p>
                          <p className="text-xs text-support-200 line-clamp-2 leading-relaxed font-light">{item.message}</p>
                        </div>
                      )) : (
                        <p className="text-sm text-support-300 font-light text-center py-4">No recent inquiries.</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  <ActivityTimeline activityLogs={activityLogs} onSearch={handleLogSearch} />
                  <div className="bg-[#111827]/60 backdrop-blur-md border border-white/5 rounded-[32px] p-4 sm:p-6 lg:p-8">
                    <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
                      <h3 className="text-xl font-display font-medium text-white">AI Revenue & Review Watchlist</h3>
                      <button onClick={() => setIsAIOpen(true)} className="text-xs text-gold uppercase tracking-widest hover:text-white transition-colors font-semibold">Open Assistant</button>
                    </div>
                    <div className="space-y-4">
                      {dashboard.aiInsights.map((insight) => (
                        <div key={insight.id} className="bg-[#0F172A]/50 border border-white/5 rounded-2xl p-5">
                          <p className="text-white font-medium">{insight.title}</p>
                          <p className="text-sm text-support-300 mt-3">{insight.body}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appointments' && canManageAppointments && (
              <div className="bg-[#111827]/60 backdrop-blur-md border border-white/5 rounded-[32px] p-4 sm:p-6 lg:p-8">
                <div className="flex justify-between items-center mb-8 pb-6 border-b border-white/5">
                  <h3 className="text-xl font-display font-medium text-white">Full Schedule</h3>
                  <div className="text-xs uppercase tracking-[0.25em] text-support-300">Live sync active</div>
                </div>
                <div className="space-y-4">
                  {dashboard.appointments.map((item) => (
                    <div key={item._id} className="group bg-[#0F172A]/50 border border-white/5 rounded-2xl p-5 hover:border-gold/30 hover:bg-[#0F172A] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer" onClick={() => item.patient?._id && setActivePatientId(item.patient._id)}>
                      <div className="flex items-center gap-3 md:gap-4 min-w-0 w-full md:w-auto">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-support-100 to-support-300 flex shrink-0 items-center justify-center text-navy font-bold text-base md:text-lg shadow-inner">
                          {(item.patient?.fullName || item.name).charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-display text-white text-base md:text-lg group-hover:text-gold transition-colors truncate">{item.patient?.fullName || item.name}</p>
                          <p className="text-xs md:text-sm text-support-300 mt-1 flex items-center gap-1.5 md:gap-2 flex-wrap">
                            <span className="text-gold font-medium truncate max-w-[120px] md:max-w-none">{item.treatment?.name || item.service}</span>
                            <span className="opacity-30 hidden md:inline">•</span>
                            <span className="flex items-center gap-1 shrink-0"><Clock size={12} className="md:w-3.5 md:h-3.5" /> {item.date} at {item.time}</span>
                            <span className="opacity-30 hidden md:inline">•</span>
                            <span className="flex items-center gap-1 shrink-0"><MessageCircle size={12} className="md:w-3.5 md:h-3.5" /> {item.patient?.phone || item.phone}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {['pending', 'confirmed', 'completed'].map((status) => (
                          <button
                            key={status}
                            onClick={(event) => {
                              event.stopPropagation()
                              handleStatusUpdate(item._id, status)
                            }}
                            className={`rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${
                              item.status === status
                                ? status === 'pending'
                                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                                  : status === 'confirmed'
                                    ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30 shadow-[0_0_15px_rgba(14,165,233,0.15)]'
                                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                                : 'bg-white/5 text-support-300 border border-transparent hover:bg-white/10'
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                        <button onClick={(event) => { event.stopPropagation(); item.patient?._id && setActivePatientId(item.patient._id) }} className="ml-4 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-support-300 hover:text-white hover:bg-white/10 transition-colors">
                          <ArrowUpRight size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'patients' && canManagePatients && (
              <div className="bg-[#111827]/60 backdrop-blur-md border border-white/5 rounded-[32px] p-4 sm:p-6 lg:p-8">
                <div className="flex justify-between items-center mb-8 pb-6 border-b border-white/5">
                  <h3 className="text-xl font-display font-medium text-white">Patient Records</h3>
                  <button onClick={() => setIsPatientModalOpen(true)} className="flex items-center gap-2 text-sm text-gold hover:text-white transition-colors"><Plus size={16} /> Add Patient</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {topPatients.map((patient) => (
                    <div key={patient._id} className="bg-[#0F172A]/50 border border-white/5 rounded-2xl p-6 hover:border-gold/30 transition-colors group cursor-pointer" onClick={() => setActivePatientId(patient._id)}>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center text-gold text-xl font-display shadow-inner">
                            {patient.avatarUrl ? <img src={patient.avatarUrl} alt={patient.fullName} loading="lazy" width="40" height="40" className="w-full h-full object-cover" /> : patient.fullName.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-display text-lg text-white group-hover:text-gold transition-colors">{patient.fullName}</h4>
                            <p className="text-xs text-support-300 mt-1">Joined: {formatDateLabel(patient.createdAt)}</p>
                          </div>
                        </div>
                        <span className="bg-emerald-500/10 text-emerald-400 text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-semibold border border-emerald-500/20">{patient.status}</span>
                      </div>
                      <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-support-300 font-semibold mb-1">Phone</p>
                          <p className="text-sm text-white">{patient.phone}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-support-300 font-semibold mb-1">Medical Flag</p>
                          <p className="text-sm text-gold font-medium">{patient.allergies || 'Clear'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'treatments' && (
              <div className="space-y-8">
                <div className="bg-[#111827]/60 backdrop-blur-md border border-white/5 rounded-[32px] p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/5">
                    <div>
                      <h3 className="text-xl font-display font-medium text-white">Treatment Catalog</h3>
                      <p className="text-xs uppercase tracking-[0.25em] text-support-300 mt-2">Synced with frontend services</p>
                    </div>
                    <button onClick={() => setIsSettingsOpen(true)} className="flex items-center gap-2 px-4 py-2 border border-gold/30 rounded-xl text-sm text-gold hover:bg-gold/10 transition-colors">
                      <Settings size={16} />
                      Manage in Settings
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {dashboard.treatments.map((treatment) => (
                      <div key={treatment._id} className="bg-[#0F172A]/50 border border-white/5 rounded-[28px] p-6 hover:border-gold/30 transition-colors">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-white font-display text-xl">{treatment.name}</p>
                            <p className="text-xs uppercase tracking-[0.25em] text-gold mt-2">{treatment.category}</p>
                          </div>
                          <span className="text-[10px] uppercase tracking-[0.25em] text-support-300">{treatment.durationLabel || `${treatment.durationMinutes} mins`}</span>
                        </div>
                        <p className="text-sm text-support-300 mt-4 leading-relaxed">{treatment.description}</p>
                        <div className="mt-6 grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-support-300 font-semibold mb-1">Price</p>
                            <p className="text-white">{treatment.priceLabel || formatMoney(treatment.basePrice)}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-support-300 font-semibold mb-1">Technology</p>
                            <p className="text-gold text-sm">{treatment.technology || 'Premium Workflow'}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-support-300 font-semibold mb-1">Pain Level</p>
                            <p className="text-sm text-white">{treatment.painLevel || 'Minimal'}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-support-300 font-semibold mb-1">Recovery</p>
                            <p className="text-sm text-white">{treatment.recovery || 'Immediate'}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && canManageReviews && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-[#111827]/60 backdrop-blur-md border border-white/5 rounded-[24px] p-6 relative overflow-hidden group">
                    <p className="text-xs uppercase tracking-widest text-support-300 font-semibold mb-2">Google Rating</p>
                    <p className="text-4xl font-display font-light text-white mb-2">{dashboard.reviewAnalytics.averageRating}<span className="text-lg text-support-300">/5</span></p>
                    <p className="text-sm text-emerald-400 flex items-center gap-2"><TrendingUp size={16} /> Based on {dashboard.reviewAnalytics.totalReviews} reviews</p>
                  </div>
                  <div className="bg-[#111827]/60 backdrop-blur-md border border-white/5 rounded-[24px] p-6 relative overflow-hidden group">
                    <p className="text-xs uppercase tracking-widest text-support-300 font-semibold mb-2">Featured Reviews</p>
                    <p className="text-4xl font-display font-light text-white mb-2">{dashboard.reviewAnalytics.featuredReviews}</p>
                    <button onClick={() => showToast('WhatsApp review reminders are queued for the next phase.')} className="text-sm text-gold hover:underline mt-2">Review Request Queue</button>
                  </div>
                  <div className="bg-[#111827]/60 backdrop-blur-md border border-white/5 rounded-[24px] p-6 relative overflow-hidden group">
                    <p className="text-xs uppercase tracking-widest text-support-300 font-semibold mb-2">Unreplied Reviews</p>
                    <p className="text-4xl font-display font-light text-white mb-2">{dashboard.reviewAnalytics.pendingReplies}</p>
                    <p className="text-sm text-amber-400 flex items-center gap-2"><AlertCircle size={16} /> Requires attention</p>
                  </div>
                </div>
                <div className="bg-[#111827]/60 backdrop-blur-md border border-white/5 rounded-[32px] p-4 sm:p-6 lg:p-8">
                  <h3 className="text-xl font-display font-medium text-white mb-6 border-b border-white/5 pb-6">Recent Reviews</h3>
                  <div className="space-y-6">
                    {dashboard.reviews.map((review) => (
                      <div key={review._id} className="bg-[#0F172A]/50 border border-white/5 rounded-2xl p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="text-white font-medium">{review.patient?.fullName || 'Patient'}</p>
                            <div className="flex gap-1 mt-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} size={14} className={star <= review.rating ? 'fill-gold text-gold' : 'text-white/20'} />
                              ))}
                            </div>
                          </div>
                          <span className={`text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-semibold ${review.adminReply ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>{review.adminReply ? 'Replied' : 'Needs Reply'}</span>
                        </div>
                        <p className="text-support-200 text-sm">{review.comment}</p>
                        {review.adminReply ? (
                          <div className="mt-4 rounded-xl border border-gold/10 bg-gold/5 p-4 text-sm text-support-200">
                            <span className="text-gold font-medium">Reply:</span> {review.adminReply}
                          </div>
                        ) : (
                          <button onClick={() => setActiveReview(review)} className="mt-4 text-xs font-semibold uppercase tracking-widest text-gold hover:text-white transition-colors">Reply to review</button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (canManageInvoices || canManageBilling || canGenerateReports) && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-[#111827]/60 backdrop-blur-md border border-white/5 rounded-[24px] p-6 relative overflow-hidden group">
                    <p className="text-xs uppercase tracking-widest text-support-300 font-semibold mb-2">Total Monthly Revenue</p>
                    <p className="text-4xl font-display font-light text-white mb-2">{formatMoney(dashboard.metrics.monthlyRevenue)}</p>
                    <p className="text-sm text-emerald-400 flex items-center gap-2"><CheckCircle2 size={16} /> {dashboard.invoices.filter((invoice) => invoice.status === 'Paid').length} invoices paid</p>
                  </div>
                  <div className="bg-[#111827]/60 backdrop-blur-md border border-white/5 rounded-[24px] p-6 relative overflow-hidden group">
                    <p className="text-xs uppercase tracking-widest text-support-300 font-semibold mb-2">Pending EMI Collections</p>
                    <p className="text-4xl font-display font-light text-white mb-2">{formatMoney(dashboard.emiPlans.reduce((sum, plan) => sum + ((plan.totalInstallments - plan.paidInstallments) * plan.installmentAmount), 0))}</p>
                    <button onClick={() => showToast('Finance follow-up queue opened for EMI collections.')} className="text-sm text-amber-400 flex items-center gap-2 hover:underline"><AlertCircle size={16} /> Review Reminders</button>
                  </div>
                  <div className="bg-[#111827]/60 backdrop-blur-md border border-white/5 rounded-[24px] p-6 relative overflow-hidden group">
                    <p className="text-xs uppercase tracking-widest text-support-300 font-semibold mb-2">Overdue Invoices</p>
                    <p className="text-4xl font-display font-light text-white mb-2">{dashboard.invoices.filter((invoice) => invoice.status === 'Overdue').length}</p>
                    <p className="text-sm text-sky-400 flex items-center gap-2"><Clock size={16} /> Actively tracked</p>
                  </div>
                </div>

                <div className="bg-[#111827]/60 backdrop-blur-md border border-white/5 rounded-[32px] p-4 sm:p-6 lg:p-8">
                  <div className="flex justify-between items-center mb-8 pb-6 border-b border-white/5">
                    <h3 className="text-xl font-display font-medium text-white">Active EMI Plans</h3>
                    <button onClick={() => showToast('EMI portfolio is live and linked to invoice records.')} className="text-xs text-gold uppercase tracking-widest hover:text-white transition-colors font-semibold">Portfolio View</button>
                  </div>
                  <div className="space-y-4">
                    {dashboard.emiPlans.length ? dashboard.emiPlans.slice(0, 5).map((plan) => (
                      <div key={plan._id} className="group bg-[#0F172A]/50 border border-white/5 rounded-2xl p-5 hover:border-gold/30 hover:bg-[#0F172A] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <p className="font-display text-lg text-white">{plan.patient?.fullName || 'Patient'}</p>
                          <p className="text-xs text-support-300 mt-1 uppercase tracking-widest">
                            {plan.paidInstallments}/{plan.totalInstallments} installments paid
                            {' • '}
                            Next due {formatDateLabel(plan.nextDueDate)}
                          </p>
                        </div>
                        <div className="flex items-center gap-6">
                          <p className="font-display text-xl text-white">{formatMoney(plan.installmentAmount)}</p>
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                            plan.status === 'completed'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : plan.status === 'overdue'
                                ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}>
                            {plan.status}
                          </span>
                        </div>
                      </div>
                    )) : (
                      <div className="rounded-2xl border border-white/5 bg-[#0F172A]/50 p-6 text-support-300 text-sm">
                        No EMI plans created yet. Use <span className="text-gold font-medium">New Invoice</span> with EMI payment method to start one.
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-[#111827]/60 backdrop-blur-md border border-white/5 rounded-[32px] p-4 sm:p-6 lg:p-8">
                  <div className="flex justify-between items-center mb-8 pb-6 border-b border-white/5">
                    <h3 className="text-xl font-display font-medium text-white">Recent Invoices</h3>
                  </div>
                  <div className="space-y-4">
                    {topInvoices.map((invoice) => (
                      <div key={invoice._id} className="group bg-[#0F172A]/50 border border-white/5 rounded-2xl p-5 hover:border-gold/30 hover:bg-[#0F172A] transition-all flex justify-between items-center cursor-pointer" onClick={() => setActiveInvoice(invoice)}>
                        <div className="flex items-center gap-6">
                          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-support-300">
                            <FileText size={20} />
                          </div>
                          <div>
                            <p className="font-display text-lg text-white group-hover:text-gold transition-colors">{invoice.patient?.fullName || 'Patient'}</p>
                            <p className="text-xs text-support-300 mt-1 uppercase tracking-widest">{invoice.invoiceNumber} • {invoice.paymentMethod || 'CASH'} • Due {formatDateLabel(invoice.dueDate)}</p>
                            {invoice.transactionDetails && <p className="text-[10px] text-support-300/70 mt-0.5 tracking-wide uppercase">Ref: {invoice.transactionDetails}</p>}
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <p className="font-display text-xl text-white">{formatMoney(invoice.totalAmount)}</p>
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                            invoice.status === 'Paid'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : invoice.status === 'Partial'
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}>
                            {invoice.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </AnimatedSection>
        </div>

        {/* Mobile Bottom Navigation */}
        <nav className={`lg:hidden fixed bottom-0 inset-x-0 bg-[#0F172A]/95 backdrop-blur-3xl border-t border-white/5 flex justify-between items-center px-2 pb-safe pt-2 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] overflow-x-auto no-scrollbar transition-transform duration-300 ${
          isBookingOpen || isPatientModalOpen || isNewInvoiceOpen || isReportModalOpen || isAIOpen || isNotificationsOpen || isSettingsOpen || isLogoutModalOpen || isProfileMenuOpen || activeInvoice !== null || activePatientId !== null || activeReview !== null
            ? 'translate-y-full opacity-0 pointer-events-none'
            : 'translate-y-0 opacity-100'
        }`}>
          {visibleTabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center min-w-[72px] flex-shrink-0 h-[60px] rounded-xl transition-all ${
                  isActive ? 'text-gold' : 'text-support-400 hover:text-white'
                }`}
              >
                <Icon size={isActive ? 22 : 20} className={isActive ? 'drop-shadow-[0_0_8px_rgba(212,175,55,0.8)] mb-1' : 'mb-1'} />
                <span className="text-[10px] font-medium tracking-wide">{tab.label.split(' ')[0]}</span>
              </button>
            )
          })}
        </nav>

        <LogoutModal
          isOpen={isLogoutModalOpen}
          onClose={() => setIsLogoutModalOpen(false)}
          onConfirm={handleLogout}
        />
      </main>
    </div>
  )
}

export default AdminDashboardPage
