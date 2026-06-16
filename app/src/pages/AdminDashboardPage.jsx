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
  Menu,
  X,
  ChevronRight,
  Zap,
  BarChart3,
  IndianRupee,
  CalendarCheck,
  UserPlus,
  Stethoscope,
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

/* ─── helpers ─── */
function formatMoney(value = 0) {
  return `₹${Number(value).toLocaleString('en-IN')}`
}
function formatDateLabel(value) {
  if (!value) return 'N/A'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('en-IN')
}
function hasAnyPermission(user, permissions) {
  return permissions.some((p) => user?.permissions?.includes(p))
}

/* ─── status badge ─── */
function StatusBadge({ status }) {
  const map = {
    pending: { bg: 'bg-amber-500/10', text: 'text-amber-400', ring: 'ring-amber-500/20', dot: 'bg-amber-400' },
    confirmed: { bg: 'bg-sky-500/10', text: 'text-sky-400', ring: 'ring-sky-500/20', dot: 'bg-sky-400' },
    completed: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', ring: 'ring-emerald-500/20', dot: 'bg-emerald-400' },
    Paid: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', ring: 'ring-emerald-500/20', dot: 'bg-emerald-400' },
    Partial: { bg: 'bg-amber-500/10', text: 'text-amber-400', ring: 'ring-amber-500/20', dot: 'bg-amber-400' },
    Overdue: { bg: 'bg-rose-500/10', text: 'text-rose-400', ring: 'ring-rose-500/20', dot: 'bg-rose-400' },
    overdue: { bg: 'bg-rose-500/10', text: 'text-rose-400', ring: 'ring-rose-500/20', dot: 'bg-rose-400' },
    active: { bg: 'bg-violet-500/10', text: 'text-violet-400', ring: 'ring-violet-500/20', dot: 'bg-violet-400' },
  }
  const s = map[status] || map['pending']
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ring-1 ${s.bg} ${s.text} ${s.ring}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  )
}

/* ─── avatar initials ─── */
function Avatar({ name = '', src, size = 'md' }) {
  const sz = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base' }[size]
  const colors = ['from-violet-500 to-indigo-600', 'from-sky-500 to-cyan-600', 'from-emerald-500 to-teal-600', 'from-amber-500 to-orange-600', 'from-rose-500 to-pink-600']
  const color = colors[(name.charCodeAt(0) || 0) % colors.length]
  return src
    ? <img src={src} alt={name} loading="lazy" className={`${sz} rounded-full object-cover ring-1 ring-white/10 shrink-0`} />
    : <div className={`${sz} rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold shrink-0 ring-1 ring-white/10`}>{name.charAt(0)}</div>
}

/* ─── metric card ─── */
function MetricCard({ label, value, sub, icon: Icon, accent, trend }) {
  const accents = {
    gold: { icon: 'bg-amber-500/10 text-amber-400', glow: 'group-hover:shadow-amber-500/10' },
    sky: { icon: 'bg-sky-500/10 text-sky-400', glow: 'group-hover:shadow-sky-500/10' },
    emerald: { icon: 'bg-emerald-500/10 text-emerald-400', glow: 'group-hover:shadow-emerald-500/10' },
    rose: { icon: 'bg-rose-500/10 text-rose-400', glow: 'group-hover:shadow-rose-500/10' },
    violet: { icon: 'bg-violet-500/10 text-violet-400', glow: 'group-hover:shadow-violet-500/10' },
  }
  const a = accents[accent] || accents.gold
  return (
    <div className={`group relative bg-[#0D1424] border border-white/5 rounded-2xl p-5 overflow-hidden hover:border-white/10 transition-all duration-300 hover:shadow-xl ${a.glow}`}>
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br from-white/[0.03] to-transparent" />
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl ${a.icon}`}>
          <Icon size={18} strokeWidth={1.5} />
        </div>
        {trend && <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">{trend}</span>}
      </div>
      <p className="text-2xl font-semibold text-white tracking-tight">{value}</p>
      <p className="text-[11px] uppercase tracking-widest text-white/40 font-medium mt-1">{label}</p>
      {sub && <p className="text-xs text-white/30 mt-2">{sub}</p>}
    </div>
  )
}

/* ─── section header ─── */
function SectionHeader({ title, icon: Icon, action, actionLabel }) {
  return (
    <div className="flex items-center justify-between pb-5 mb-6 border-b border-white/5">
      <div className="flex items-center gap-3">
        {Icon && <Icon size={18} className="text-amber-400" strokeWidth={1.5} />}
        <h3 className="text-base font-semibold text-white">{title}</h3>
      </div>
      {action && actionLabel && (
        <button onClick={action} className="text-[11px] font-semibold text-amber-400 hover:text-white transition-colors uppercase tracking-wider flex items-center gap-1">
          {actionLabel} <ChevronRight size={12} />
        </button>
      )}
    </div>
  )
}

/* ─── card wrapper ─── */
function Card({ children, className = '' }) {
  return (
    <div className={`bg-[#0D1424] border border-white/5 rounded-2xl p-6 ${className}`}>
      {children}
    </div>
  )
}

/* ─── empty state ─── */
function EmptyState({ icon: Icon, message }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-white/20">
      <Icon size={36} strokeWidth={1} className="mb-3" />
      <p className="text-sm font-light">{message}</p>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────── */
/*  MAIN COMPONENT                                                      */
/* ──────────────────────────────────────────────────────────────────── */

function AdminDashboardPage() {
  const navigate = useNavigate()
  const [dashboard, setDashboard] = useState(null)
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  const [toast, setToast] = useState(null)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
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
    window.setTimeout(() => setToast(null), 3500)
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
      if (!allowedTabs.includes(activeTab)) setActiveTab('overview')
    } catch (error) {
      setMessage(error.message)
      if (error.message.includes('Auth') || error.message.includes('token') || error.message.includes('Unauthorized')) {
        navigate('/admin')
      }
    }
  }, [activeTab, navigate])

  useEffect(() => { refreshDashboard() }, [refreshDashboard])

  useEffect(() => {
    const token = window.localStorage.getItem('adminToken') || window.sessionStorage.getItem('adminToken')
    const socket = io(window.location.origin, { withCredentials: true, auth: token ? { token } : undefined })
    socket.on('connect_error', () => undefined)
    socket.on('notification:new', ({ notification }) => {
      setDashboard((v) => v ? ({ ...v, notifications: [notification, ...(v.notifications || [])].slice(0, 20), unreadNotifications: (v.unreadNotifications || 0) + (notification.read ? 0 : 1) }) : v)
    })
    socket.on('notification:updated', ({ notification }) => {
      setDashboard((v) => {
        if (!v) return v
        const notifications = v.notifications.map((i) => i._id === notification._id ? notification : i)
        return { ...v, notifications, unreadNotifications: notifications.filter((i) => !i.read).length }
      })
    })
    socket.on('activity:new', ({ activity }) => setActivityLogs((v) => [activity, ...v].slice(0, 60)))
    socket.on('patient:created', ({ patient }) => {
      setDashboard((v) => v ? ({ ...v, patients: [patient, ...v.patients], metrics: { ...v.metrics, totalPatients: (v.metrics?.totalPatients || 0) + 1 } }) : v)
    })
    socket.on('appointment:created', ({ appointment }) => {
      setDashboard((v) => v ? ({ ...v, appointments: [appointment, ...v.appointments], metrics: { ...v.metrics, totalConsultations: (v.metrics?.totalConsultations || 0) + 1, confirmedToday: (v.metrics?.confirmedToday || 0) + (appointment.status === 'confirmed' ? 1 : 0) } }) : v)
    })
    socket.on('appointment:updated', ({ appointment }) => {
      setDashboard((v) => v ? ({ ...v, appointments: v.appointments.map((i) => i._id === appointment._id ? appointment : i) }) : v)
    })
    socket.on('invoice:created', ({ invoice }) => {
      setDashboard((v) => v ? ({ ...v, invoices: [invoice, ...v.invoices] }) : v)
    })
    socket.on('invoice:updated', ({ invoice }) => {
      setDashboard((v) => v ? ({ ...v, invoices: v.invoices.map((i) => i._id === invoice._id ? invoice : i) }) : v)
    })
    socket.on('emi:created', ({ emiPlan }) => {
      setDashboard((v) => v ? ({ ...v, emiPlans: [emiPlan, ...(v.emiPlans || []).filter((i) => i._id !== emiPlan._id)] }) : v)
    })
    socket.on('review:updated', ({ review }) => {
      setDashboard((v) => {
        if (!v) return v
        const reviews = v.reviews.map((i) => i._id === review._id ? review : i)
        return { ...v, reviews, reviewAnalytics: { ...v.reviewAnalytics, pendingReplies: reviews.filter((i) => !i.adminReply).length } }
      })
    })
    socket.on('settings:updated', ({ clinic }) => {
      setDashboard((v) => v ? ({ ...v, content: { ...v.content, clinic } }) : v)
    })
    socket.on('treatments:synced', ({ treatments }) => {
      setDashboard((v) => v ? ({ ...v, treatments }) : v)
    })
    return () => socket.disconnect()
  }, [])

  useEffect(() => {
    if (!activePatientId) { setActivePatientProfile(null); return }
    let mounted = true
    setPatientProfileLoading(true)
    api.getPatientProfile(activePatientId)
      .then((r) => { if (mounted) setActivePatientProfile(r) })
      .catch((e) => { if (mounted) showToast(e.message) })
      .finally(() => { if (mounted) setPatientProfileLoading(false) })
    return () => { mounted = false }
  }, [activePatientId, showToast])

  async function handleLogout() {
    try { await api.adminLogout(); navigate('/') }
    catch (e) { setMessage(e.message) }
  }

  async function handleStatusUpdate(id, status) {
    try {
      const response = await api.updateAppointmentStatus(id, status)
      setDashboard((v) => {
        const next = v.appointments.map((i) => i._id === id ? response.appointment : i)
        return { ...v, appointments: next, metrics: { ...v.metrics, pendingTriage: next.filter((a) => a.status === 'pending').length, confirmedToday: next.filter((a) => a.status === 'confirmed').length } }
      })
      showToast(`Status updated to ${status}`)
    } catch (e) { showToast(e.message) }
  }

  async function handleNotificationRead(id) {
    try {
      const response = await api.markNotificationRead(id)
      setDashboard((v) => {
        const notifications = v.notifications.map((i) => i._id === id ? response.notification : i)
        return { ...v, notifications, unreadNotifications: notifications.filter((i) => !i.read).length }
      })
    } catch (e) { showToast(e.message) }
  }

  async function handleLogSearch(query) {
    try { const r = await api.getActivityLogs(query); setActivityLogs(r.activityLogs) }
    catch (e) { showToast(e.message) }
  }

  function mergeBookingIntoDashboard(response) {
    setDashboard((v) => ({ ...v, appointments: [response.appointment, ...(v?.appointments || [])], invoices: [response.invoice, ...(v?.invoices || [])] }))
  }
  function mergePatientIntoDashboard(patient) {
    setDashboard((v) => ({ ...v, patients: [patient, ...(v?.patients || [])], metrics: { ...(v?.metrics || {}), totalPatients: (v?.metrics?.totalPatients || 0) + 1 } }))
  }
  function mergeInvoice(invoice) {
    setDashboard((v) => ({ ...v, invoices: v.invoices.map((i) => i._id === invoice._id ? invoice : i) }))
  }
  function mergeReview(review) {
    setDashboard((v) => {
      const reviews = v.reviews.map((i) => i._id === review._id ? review : i)
      return { ...v, reviews, reviewAnalytics: { ...v.reviewAnalytics, pendingReplies: reviews.filter((i) => !i.adminReply).length } }
    })
  }

  /* ── loading screen ── */
  if (!dashboard) {
    return (
      <div className="min-h-screen bg-[#060C18] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative flex h-20 w-20 items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-amber-500/20 animate-ping" />
            <div className="absolute inset-2 rounded-full border-t border-amber-400 animate-spin" />
            <Sparkles className="text-amber-400" size={22} />
          </div>
          <div className="text-center">
            <p className="text-white/60 text-sm tracking-[0.3em] uppercase font-medium">Initializing</p>
            <p className="text-amber-400/70 text-xs mt-1 tracking-widest">Azure Clinic OS</p>
          </div>
          {message && <p className="text-rose-400 text-sm bg-rose-500/10 px-4 py-2 rounded-xl">{message}</p>}
        </div>
      </div>
    )
  }

  const topAppointments = dashboard.appointments.slice(0, 4)
  const topInquiries = dashboard.inquiries.slice(0, 4)
  const topPatients = dashboard.patients.slice(0, 6)
  const topInvoices = dashboard.invoices.slice(0, 6)
  const anyModalOpen = isBookingOpen || isPatientModalOpen || isNewInvoiceOpen || isReportModalOpen || isAIOpen || isNotificationsOpen || isSettingsOpen || isLogoutModalOpen || isProfileMenuOpen || activeInvoice !== null || activePatientId !== null || activeReview !== null

  return (
    <div className="min-h-screen bg-[#060C18] text-[#CBD5E1] font-sans flex overflow-hidden selection:bg-amber-500/20">

      {/* ── Toast ── */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 bg-[#0D1424] border border-amber-500/30 text-white px-5 py-3.5 rounded-2xl shadow-2xl shadow-black/50 animate-in slide-in-from-top-3 duration-300">
          <CheckCircle2 size={16} className="text-amber-400 shrink-0" />
          <p className="text-sm font-medium">{toast}</p>
        </div>
      )}

      {/* ── Demo Mode Banner ── */}
      <div className="fixed top-0 inset-x-0 z-[90] bg-gradient-to-r from-amber-600/90 via-amber-500/90 to-amber-600/90 backdrop-blur-sm py-1.5 px-4 text-center flex items-center justify-center gap-2">
        <Zap size={13} className="text-amber-900 shrink-0" />
        <p className="text-[11px] font-bold text-amber-900 uppercase tracking-widest">Demo Mode — Write operations are disabled</p>
      </div>

      {/* ── Modals & Panels ── */}
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        initialClinic={dashboard.content?.clinic}
        adminUsers={dashboard.adminUsers}
        showToast={showToast}
        onSaved={(content) => setDashboard((v) => ({ ...v, content }))}
        onTreatmentsSynced={(treatments) => setDashboard((v) => ({ ...v, treatments }))}
      />
      <NewBookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} showToast={showToast} patients={dashboard.patients} doctors={dashboard.doctors} treatments={dashboard.treatments} onCreated={mergeBookingIntoDashboard} />
      <AddPatientModal isOpen={isPatientModalOpen} onClose={() => setIsPatientModalOpen(false)} showToast={showToast} onCreated={mergePatientIntoDashboard} />
      <NewInvoiceModal isOpen={isNewInvoiceOpen} onClose={() => setIsNewInvoiceOpen(false)} showToast={showToast} patients={dashboard.patients} doctors={dashboard.doctors} treatments={dashboard.treatments}
        onCreated={({ invoice, emiPlan }) => setDashboard((v) => ({ ...v, invoices: [invoice, ...(v?.invoices || [])], emiPlans: emiPlan ? [emiPlan, ...(v?.emiPlans || [])] : v?.emiPlans || [] }))} />
      <ReportModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} showToast={showToast} />
      <InvoiceModal isOpen={!!activeInvoice} onClose={() => setActiveInvoice(null)} invoice={activeInvoice} showToast={showToast} onUpdated={mergeInvoice} />
      {activeReview && <ReplyReviewModal isOpen={true} onClose={() => setActiveReview(null)} review={activeReview} showToast={showToast} onUpdated={mergeReview} />}
      <AIAssistantSlideover isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} showToast={showToast} insights={dashboard.aiInsights} metrics={dashboard.metrics} />
      <PatientProfileSlideover isOpen={!!activePatientId} onClose={() => setActivePatientId(null)} patientProfile={activePatientProfile} loading={patientProfileLoading} showToast={showToast} />
      <LogoutModal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} onConfirm={handleLogout} />

      {/* ── Mobile overlay ── */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setIsMobileSidebarOpen(false)} />
      )}

      {/* ════════════════════ SIDEBAR ════════════════════ */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-[260px] shrink-0
        flex flex-col bg-[#080E1C] border-r border-white/5
        transition-transform duration-300 ease-out
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        pt-8 lg:pt-10
      `}>
        {/* Logo */}
        <div className="px-6 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <img src="/logo.jpg" alt="Azure Smile Logo" className="h-10 w-10 object-contain rounded-lg border border-white/10 shadow-sm" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#080E1C]" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white leading-none tracking-wide">Azure OS</h1>
              <p className="text-[9px] text-amber-400/70 font-bold tracking-[0.2em] mt-1 uppercase">Dental Clinic</p>
            </div>
          </div>
          <button className="lg:hidden text-white/40 hover:text-white" onClick={() => setIsMobileSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Nav label */}
        <p className="px-6 text-[10px] font-bold text-white/20 uppercase tracking-widest mb-3">Navigation</p>

        {/* Tabs */}
        <nav className="px-3 space-y-1 flex-1 overflow-y-auto">
          {visibleTabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setIsMobileSidebarOpen(false) }}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm transition-all duration-200 group ${isActive
                    ? 'bg-amber-500/10 text-amber-400 font-semibold'
                    : 'text-white/40 hover:text-white hover:bg-white/5 font-medium'
                  }`}
              >
                <Icon size={16} strokeWidth={isActive ? 2 : 1.5} className="shrink-0" />
                {tab.label}
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400" />}
              </button>
            )
          })}
        </nav>

        {/* User card */}
        <div className="px-3 pb-24 lg:pb-6 mt-4 space-y-1">
          <div className="mx-1 p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="flex items-center gap-3">
              <Avatar name={currentUser?.fullName || '?'} src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=100&q=80" size="sm" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">{currentUser?.fullName}</p>
                <p className="text-[10px] text-amber-400/70 font-medium uppercase tracking-wider truncate">{currentUser?.roleLabel}</p>
              </div>
            </div>
          </div>
          <button onClick={() => showToast('Settings are unavailable in Demo Mode.')} className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/20 text-sm cursor-not-allowed">
            <Settings size={15} strokeWidth={1.5} /><span>Settings</span>
          </button>
          <button onClick={handleLogout} className="w-full flex lg:hidden items-center gap-3 px-3.5 py-2.5 rounded-xl text-rose-400/60 hover:text-rose-400 hover:bg-rose-500/10 text-sm transition-colors">
            <LogOut size={15} strokeWidth={1.5} /><span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ════════════════════ MAIN ════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 pt-8">

        {/* ── Topbar ── */}
        <header className="shrink-0 h-14 sm:h-16 border-b border-white/5 bg-[#060C18]/80 backdrop-blur-xl flex items-center px-4 sm:px-6 lg:px-8 gap-3 sm:gap-4 relative z-30">
          <button className="lg:hidden text-white/40 hover:text-white transition-colors shrink-0" onClick={() => setIsMobileSidebarOpen(true)}>
            <Menu size={20} />
          </button>

          {/* Search */}
          <div className="relative flex-1 max-w-xs hidden sm:block">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
            <input
              type="text"
              placeholder="Search patients, invoices…"
              className="w-full bg-white/[0.04] border border-white/5 rounded-xl py-2 pl-9 pr-4 text-sm text-white placeholder-white/20 focus:border-amber-500/30 focus:bg-white/[0.06] focus:outline-none transition-all"
            />
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            {/* AI */}
            <button
              onClick={() => setIsAIOpen(true)}
              className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/15 transition-all rounded-xl px-3 py-2 group"
            >
              <BrainCircuit size={15} className="text-amber-400" />
              <span className="hidden sm:inline text-xs font-semibold text-amber-400 tracking-wider">AI Assistant</span>
            </button>

            {/* Notifications */}
            <div className="relative">
              <button id="notification-bell-btn" onClick={() => setIsNotificationsOpen((v) => !v)} className="relative p-2.5 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-colors">
                <Bell size={17} />
                {dashboard.unreadNotifications ? (
                  <span className="absolute top-1.5 right-1.5 min-w-4 h-4 px-1 rounded-full bg-amber-400 text-[#060C18] text-[9px] font-bold flex items-center justify-center">
                    {dashboard.unreadNotifications}
                  </span>
                ) : null}
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

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-xl hover:bg-white/5 transition-colors group"
              >
                <Avatar name={currentUser?.fullName || '?'} src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=100&q=80" size="sm" />
                <div className="hidden md:block text-left">
                  <p className="text-xs font-semibold text-white group-hover:text-amber-400 transition-colors leading-none">{currentUser?.fullName}</p>
                  <p className="text-[10px] text-white/30 uppercase tracking-wider mt-0.5">{currentUser?.roleLabel}</p>
                </div>
                <ChevronDown size={12} className="text-white/30 hidden md:block" />
              </button>

              {isProfileMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-52 bg-[#0D1424] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
                    <div className="p-4 border-b border-white/5">
                      <p className="text-sm font-semibold text-white">{currentUser?.fullName}</p>
                      <p className="text-[10px] text-white/30 uppercase tracking-widest mt-1">{currentUser?.roleLabel}</p>
                    </div>
                    <div className="p-2">
                      <button onClick={() => { setIsProfileMenuOpen(false); showToast('Settings are unavailable in Demo Mode.') }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/20 cursor-not-allowed text-sm">
                        <Settings size={14} /><span>Settings</span>
                      </button>
                      <button onClick={() => { setIsProfileMenuOpen(false); setIsLogoutModalOpen(true) }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors text-sm mt-1">
                        <LogOut size={14} /><span>Logout</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* ── Page Content ── */}
        <main className="flex-1 overflow-y-auto pb-24 lg:pb-8">
          <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-[1400px] mx-auto">

            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1 h-5 rounded-full bg-amber-400" />
                  <h2 className="text-xl font-bold text-white capitalize">{activeTab === 'billing' ? 'Billing & EMI' : activeTab}</h2>
                </div>
                <p className="text-sm text-white/30 pl-3">
                  {activeTab === 'overview' && 'Live clinic telemetry and synchronized workflows'}
                  {activeTab === 'appointments' && 'Manage scheduling, confirmations, and triage'}
                  {activeTab === 'patients' && 'Protected patient records with role-aware access'}
                  {activeTab === 'treatments' && 'Treatment catalog synced from the Azure OS frontend'}
                  {activeTab === 'reviews' && 'Reputation management, replies, and analytics'}
                  {activeTab === 'billing' && 'Invoices, payments, EMI workflows, and collections'}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {canGenerateReports && !['billing', 'treatments'].includes(activeTab) && (
                  <button onClick={() => showToast('Report generation is unavailable in Demo Mode.')} className="flex items-center gap-2 px-3.5 py-2 bg-white/[0.04] border border-white/5 rounded-xl text-xs font-semibold text-white/25 cursor-not-allowed">
                    <Download size={14} />Report
                  </button>
                )}
                {canManageAppointments && activeTab !== 'billing' && (
                  <button onClick={() => setIsBookingOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs font-semibold text-amber-400 transition-all hover:bg-amber-500/20">
                    <Plus size={14} />New Booking
                  </button>
                )}
                {activeTab === 'billing' && canManageBilling && (
                  <button onClick={() => showToast('Invoice creation is unavailable in Demo Mode.')} className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs font-semibold text-amber-400/50 cursor-not-allowed">
                    <Plus size={14} />New Invoice
                  </button>
                )}
              </div>
            </div>

            {/* ══════════ OVERVIEW ══════════ */}
            {activeTab === 'overview' && (
              <AnimatedSection className="space-y-6">
                {/* Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <MetricCard label="Total Consultations" value={dashboard.metrics.totalConsultations} sub={`${dashboard.metrics.totalPatients} total patients`} icon={CalendarCheck} accent="sky" />
                  <MetricCard label="Pending Triage" value={dashboard.metrics.pendingTriage} sub="Needs follow-up" icon={AlertCircle} accent="rose" />
                  <MetricCard label="Confirmed Today" value={dashboard.metrics.confirmedToday} sub="Live schedule" icon={CheckCircle2} accent="emerald" />
                  <MetricCard label="Monthly Revenue" value={formatMoney(dashboard.metrics.monthlyRevenue)} sub="Collections captured" icon={IndianRupee} accent="gold" />
                </div>

                {/* Appointments + Inquiries */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
                  {/* Appointments */}
                  <Card className="xl:col-span-2">
                    <SectionHeader
                      title="Live Appointments"
                      icon={Calendar}
                      action={canManageAppointments ? () => setActiveTab('appointments') : null}
                      actionLabel="View all"
                    />
                    <div className="space-y-3">
                      {topAppointments.length ? topAppointments.map((item) => (
                        <div
                          key={item._id}
                          className="group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-white/10 rounded-xl p-4 cursor-pointer transition-all"
                          onClick={() => item.patient?._id && setActivePatientId(item.patient._id)}
                        >
                          <Avatar name={item.patient?.fullName || item.name} size="md" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors truncate">{item.patient?.fullName || item.name}</p>
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                              <span className="text-xs text-amber-400/70 font-medium truncate">{item.treatment?.name || item.service}</span>
                              <span className="text-white/10">·</span>
                              <span className="text-xs text-white/30 flex items-center gap-1"><Clock size={10} />{item.date} {item.time}</span>
                            </div>
                          </div>
                          {canManageAppointments && (
                            <div className="flex gap-1.5 shrink-0 flex-wrap">
                              {['pending', 'confirmed'].map((s) => (
                                <button
                                  key={s}
                                  onClick={(e) => { e.stopPropagation(); handleStatusUpdate(item._id, s) }}
                                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${item.status === s
                                      ? s === 'pending' ? 'bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30' : 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30'
                                      : 'bg-white/5 text-white/20 hover:text-white/50 hover:bg-white/10'
                                    }`}
                                >{s}</button>
                              ))}
                            </div>
                          )}
                        </div>
                      )) : <EmptyState icon={Calendar} message="No appointments scheduled" />}
                    </div>
                  </Card>

                  {/* Inquiries */}
                  <Card>
                    <SectionHeader title="Recent Inquiries" icon={MessageCircle} />
                    <div className="space-y-3">
                      {topInquiries.length ? topInquiries.map((item) => (
                        <div key={item._id} className="bg-white/[0.02] border border-white/5 hover:border-rose-500/20 rounded-xl p-4 cursor-pointer transition-all group" onClick={() => showToast(`Inquiry opened for ${item.name}.`)}>
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-semibold text-white truncate">{item.name}</p>
                            <span className="text-[9px] bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 ml-2">Lead</span>
                          </div>
                          <p className="text-xs text-amber-400/60 font-medium mb-2">{item.phone}</p>
                          <p className="text-xs text-white/30 line-clamp-2 leading-relaxed">{item.message}</p>
                        </div>
                      )) : <EmptyState icon={MessageCircle} message="No recent inquiries" />}
                    </div>
                  </Card>
                </div>

                {/* Activity + AI */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                  <ActivityTimeline activityLogs={activityLogs} onSearch={handleLogSearch} />
                  <Card>
                    <SectionHeader
                      title="AI Revenue & Review Watchlist"
                      icon={BrainCircuit}
                      action={() => setIsAIOpen(true)}
                      actionLabel="Open assistant"
                    />
                    <div className="space-y-3">
                      {dashboard.aiInsights.map((insight) => (
                        <div key={insight.id} className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-4 hover:border-amber-500/20 transition-colors">
                          <div className="flex items-start gap-3">
                            <Sparkles size={14} className="text-amber-400 mt-0.5 shrink-0" />
                            <div>
                              <p className="text-sm font-semibold text-white">{insight.title}</p>
                              <p className="text-xs text-white/40 mt-1.5 leading-relaxed">{insight.body}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </AnimatedSection>
            )}

            {/* ══════════ APPOINTMENTS ══════════ */}
            {activeTab === 'appointments' && canManageAppointments && (
              <AnimatedSection>
                <Card>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-6 border-b border-white/5">
                    <h3 className="text-base font-semibold text-white flex items-center gap-2"><Calendar size={16} className="text-amber-400" strokeWidth={1.5} />Full Schedule</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Live sync
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {dashboard.appointments.map((item) => (
                      <div
                        key={item._id}
                        className="group flex flex-col md:flex-row md:items-center gap-3 md:gap-4 bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-amber-500/20 rounded-xl p-4 cursor-pointer transition-all"
                        onClick={() => item.patient?._id && setActivePatientId(item.patient._id)}
                      >
                        <Avatar name={item.patient?.fullName || item.name} size="md" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">{item.patient?.fullName || item.name}</p>
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                            <span className="text-xs text-amber-400/70 font-medium">{item.treatment?.name || item.service}</span>
                            <span className="text-white/10 hidden sm:inline">·</span>
                            <span className="text-xs text-white/30 flex items-center gap-1"><Clock size={10} />{item.date} at {item.time}</span>
                            <span className="text-white/10 hidden sm:inline">·</span>
                            <span className="text-xs text-white/30 flex items-center gap-1"><MessageCircle size={10} />{item.patient?.phone || item.phone}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap shrink-0">
                          {['pending', 'confirmed', 'completed'].map((s) => (
                            <button
                              key={s}
                              onClick={(e) => { e.stopPropagation(); handleStatusUpdate(item._id, s) }}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${item.status === s
                                  ? s === 'pending' ? 'bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30'
                                    : s === 'confirmed' ? 'bg-sky-500/15 text-sky-400 ring-1 ring-sky-500/30'
                                      : 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30'
                                  : 'bg-white/5 text-white/20 hover:text-white/50 hover:bg-white/10'
                                }`}
                            >{s}</button>
                          ))}
                          <button
                            onClick={(e) => { e.stopPropagation(); item.patient?._id && setActivePatientId(item.patient._id) }}
                            className="ml-1 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/20 hover:text-white hover:bg-white/10 transition-colors"
                          >
                            <ArrowUpRight size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {!dashboard.appointments.length && <EmptyState icon={Calendar} message="No appointments in schedule" />}
                  </div>
                </Card>
              </AnimatedSection>
            )}

            {/* ══════════ PATIENTS ══════════ */}
            {activeTab === 'patients' && canManagePatients && (
              <AnimatedSection>
                <Card>
                  <div className="flex items-center justify-between pb-5 mb-6 border-b border-white/5">
                    <h3 className="text-base font-semibold text-white flex items-center gap-2"><Users size={16} className="text-amber-400" strokeWidth={1.5} />Patient Records</h3>
                    <button onClick={() => setIsPatientModalOpen(true)} className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-white bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 px-3 py-2 rounded-xl transition-all">
                      <UserPlus size={13} />Add Patient
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {topPatients.map((patient) => (
                      <div key={patient._id} className="group flex items-start gap-4 bg-white/[0.02] border border-white/5 hover:border-amber-500/20 rounded-xl p-5 cursor-pointer transition-all" onClick={() => setActivePatientId(patient._id)}>
                        <Avatar name={patient.fullName} src={patient.avatarUrl} size="lg" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">{patient.fullName}</p>
                              <p className="text-xs text-white/30 mt-0.5">Joined {formatDateLabel(patient.createdAt)}</p>
                            </div>
                            <StatusBadge status={patient.status} />
                          </div>
                          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/5">
                            <div>
                              <p className="text-[10px] font-bold text-white/20 uppercase tracking-wider mb-1">Phone</p>
                              <p className="text-xs text-white/60 font-medium">{patient.phone}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-white/20 uppercase tracking-wider mb-1">Medical Flag</p>
                              <p className={`text-xs font-semibold ${patient.allergies ? 'text-rose-400' : 'text-emerald-400'}`}>{patient.allergies || 'Clear'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {!topPatients.length && <div className="col-span-2"><EmptyState icon={Users} message="No patients found" /></div>}
                  </div>
                </Card>
              </AnimatedSection>
            )}

            {/* ══════════ TREATMENTS ══════════ */}
            {activeTab === 'treatments' && (
              <AnimatedSection>
                <Card>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-6 border-b border-white/5">
                    <div>
                      <h3 className="text-base font-semibold text-white flex items-center gap-2"><Stethoscope size={16} className="text-amber-400" strokeWidth={1.5} />Treatment Catalog</h3>
                      <p className="text-xs text-white/20 mt-1 font-medium uppercase tracking-wider">Synced with frontend services</p>
                    </div>
                    <button onClick={() => setIsSettingsOpen(true)} className="flex items-center gap-2 px-4 py-2 border border-amber-500/20 text-amber-400 hover:bg-amber-500/10 rounded-xl text-xs font-semibold transition-all">
                      <Settings size={13} />Manage in Settings
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {dashboard.treatments.map((treatment) => (
                      <div key={treatment._id} className="bg-white/[0.02] border border-white/5 hover:border-amber-500/20 rounded-xl p-5 transition-all group">
                        <div className="flex items-start justify-between gap-2 mb-4">
                          <div>
                            <p className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">{treatment.name}</p>
                            <p className="text-[10px] font-bold text-amber-400/60 uppercase tracking-widest mt-1">{treatment.category}</p>
                          </div>
                          <span className="text-[10px] text-white/20 uppercase tracking-wider shrink-0">{treatment.durationLabel || `${treatment.durationMinutes} min`}</span>
                        </div>
                        <p className="text-xs text-white/30 leading-relaxed mb-5">{treatment.description}</p>
                        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
                          {[
                            { label: 'Price', value: treatment.priceLabel || formatMoney(treatment.basePrice), color: 'text-white' },
                            { label: 'Tech', value: treatment.technology || 'Premium', color: 'text-amber-400/80' },
                            { label: 'Pain Level', value: treatment.painLevel || 'Minimal', color: 'text-emerald-400' },
                            { label: 'Recovery', value: treatment.recovery || 'Immediate', color: 'text-sky-400' },
                          ].map((row) => (
                            <div key={row.label}>
                              <p className="text-[10px] font-bold text-white/15 uppercase tracking-widest mb-1">{row.label}</p>
                              <p className={`text-xs font-semibold ${row.color}`}>{row.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    {!dashboard.treatments.length && <div className="col-span-3"><EmptyState icon={ShieldCheck} message="No treatments in catalog" /></div>}
                  </div>
                </Card>
              </AnimatedSection>
            )}

            {/* ══════════ REVIEWS ══════════ */}
            {activeTab === 'reviews' && canManageReviews && (
              <AnimatedSection className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <MetricCard label="Google Rating" value={`${dashboard.reviewAnalytics.averageRating}/5`} sub={`${dashboard.reviewAnalytics.totalReviews} total reviews`} icon={Star} accent="gold" />
                  <MetricCard label="Featured Reviews" value={dashboard.reviewAnalytics.featuredReviews} sub="Highlighted on site" icon={TrendingUp} accent="emerald" />
                  <MetricCard label="Needs Reply" value={dashboard.reviewAnalytics.pendingReplies} sub="Pending response" icon={AlertCircle} accent="rose" />
                </div>
                <Card>
                  <SectionHeader title="Recent Reviews" icon={Star} />
                  <div className="space-y-4">
                    {dashboard.reviews.map((review) => (
                      <div key={review._id} className="bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-xl p-5 transition-all">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <p className="text-sm font-semibold text-white">{review.patient?.fullName || 'Patient'}</p>
                            <div className="flex gap-0.5 mt-1.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} size={12} className={star <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-white/10'} />
                              ))}
                            </div>
                          </div>
                          <StatusBadge status={review.adminReply ? 'completed' : 'pending'} />
                        </div>
                        <p className="text-sm text-white/40 leading-relaxed">{review.comment}</p>
                        {review.adminReply
                          ? <div className="mt-4 bg-amber-500/5 border border-amber-500/10 rounded-xl p-4 text-sm text-white/40"><span className="text-amber-400 font-semibold text-xs uppercase tracking-wider">Reply · </span>{review.adminReply}</div>
                          : <button onClick={() => setActiveReview(review)} className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-white transition-colors uppercase tracking-wider"><MessageCircle size={12} />Reply to review</button>
                        }
                      </div>
                    ))}
                    {!dashboard.reviews.length && <EmptyState icon={Star} message="No reviews yet" />}
                  </div>
                </Card>
              </AnimatedSection>
            )}

            {/* ══════════ BILLING ══════════ */}
            {activeTab === 'billing' && (canManageInvoices || canManageBilling || canGenerateReports) && (
              <AnimatedSection className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <MetricCard label="Monthly Revenue" value={formatMoney(dashboard.metrics.monthlyRevenue)} sub={`${dashboard.invoices.filter((i) => i.status === 'Paid').length} invoices paid`} icon={IndianRupee} accent="emerald" />
                  <MetricCard
                    label="Pending EMI"
                    value={formatMoney(dashboard.emiPlans.reduce((sum, p) => sum + ((p.totalInstallments - p.paidInstallments) * p.installmentAmount), 0))}
                    sub="Remaining collections"
                    icon={CreditCard}
                    accent="gold"
                  />
                  <MetricCard label="Overdue Invoices" value={dashboard.invoices.filter((i) => i.status === 'Overdue').length} sub="Actively tracked" icon={AlertCircle} accent="rose" />
                </div>

                {/* EMI Plans */}
                <Card>
                  <div className="flex items-center justify-between pb-5 mb-6 border-b border-white/5">
                    <h3 className="text-base font-semibold text-white flex items-center gap-2"><CreditCard size={16} className="text-amber-400" strokeWidth={1.5} />Active EMI Plans</h3>
                    <button onClick={() => showToast('EMI portfolio is live and linked to invoice records.')} className="text-[11px] font-semibold text-amber-400 hover:text-white transition-colors uppercase tracking-wider flex items-center gap-1">Portfolio <ChevronRight size={12} /></button>
                  </div>
                  <div className="space-y-3">
                    {dashboard.emiPlans.length ? dashboard.emiPlans.slice(0, 5).map((plan) => (
                      <div key={plan._id} className="group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 bg-white/[0.02] border border-white/5 hover:border-amber-500/20 rounded-xl p-4 transition-all">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white">{plan.patient?.fullName || 'Patient'}</p>
                          <div className="flex flex-wrap items-center gap-2 mt-1.5">
                            <div className="flex-1 min-w-[120px] bg-white/5 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="h-full bg-amber-400 rounded-full transition-all"
                                style={{ width: `${Math.round((plan.paidInstallments / plan.totalInstallments) * 100)}%` }}
                              />
                            </div>
                            <span className="text-xs text-white/30 shrink-0">{plan.paidInstallments}/{plan.totalInstallments} paid · Due {formatDateLabel(plan.nextDueDate)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <p className="text-base font-bold text-white">{formatMoney(plan.installmentAmount)}</p>
                          <StatusBadge status={plan.status} />
                        </div>
                      </div>
                    )) : (
                      <div className="rounded-xl border border-white/5 bg-white/[0.01] p-5 text-xs text-white/30">
                        No EMI plans yet. Create a New Invoice with EMI payment method to start one.
                      </div>
                    )}
                  </div>
                </Card>

                {/* Invoices */}
                <Card>
                  <SectionHeader title="Recent Invoices" icon={FileText} />
                  <div className="space-y-3">
                    {topInvoices.map((invoice) => (
                      <div
                        key={invoice._id}
                        className="group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 bg-white/[0.02] border border-white/5 hover:border-amber-500/20 rounded-xl p-4 cursor-pointer transition-all"
                        onClick={() => setActiveInvoice(invoice)}
                      >
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/20 shrink-0">
                          <FileText size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">{invoice.patient?.fullName || 'Patient'}</p>
                          <p className="text-xs text-white/30 mt-0.5 font-medium uppercase tracking-wide">{invoice.invoiceNumber} · {invoice.paymentMethod || 'CASH'} · Due {formatDateLabel(invoice.dueDate)}</p>
                          {invoice.transactionDetails && <p className="text-[10px] text-white/20 mt-0.5 uppercase tracking-wider">Ref: {invoice.transactionDetails}</p>}
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <p className="text-base font-bold text-white">{formatMoney(invoice.totalAmount)}</p>
                          <StatusBadge status={invoice.status} />
                        </div>
                      </div>
                    ))}
                    {!topInvoices.length && <EmptyState icon={FileText} message="No invoices yet" />}
                  </div>
                </Card>
              </AnimatedSection>
            )}
          </div>
        </main>
      </div>

      {/* ════════════════════ MOBILE BOTTOM NAV ════════════════════ */}
      <nav className={`
        lg:hidden fixed bottom-0 inset-x-0 z-50
        bg-[#080E1C]/95 backdrop-blur-2xl border-t border-white/5
        flex justify-around items-stretch px-2 pb-safe
        transition-all duration-300
        ${anyModalOpen ? 'translate-y-full pointer-events-none' : 'translate-y-0'}
      `}>
        {visibleTabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 py-3 gap-1 transition-all ${isActive ? 'text-amber-400' : 'text-white/20 hover:text-white/60'}`}
            >
              <Icon size={isActive ? 20 : 18} strokeWidth={isActive ? 2 : 1.5} className={isActive ? 'drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]' : ''} />
              <span className={`text-[9px] font-bold uppercase tracking-wider ${isActive ? 'text-amber-400' : ''}`}>{tab.label.split(' ')[0]}</span>
              {isActive && <div className="w-1 h-1 rounded-full bg-amber-400 mt-0.5" />}
            </button>
          )
        })}
      </nav>
    </div>
  )
}

export default AdminDashboardPage