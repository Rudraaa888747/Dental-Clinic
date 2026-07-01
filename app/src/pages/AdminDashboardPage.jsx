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
function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <span className="text-[#111827] text-[0.85rem] font-bold tabular-nums border border-[#E8E0D5] bg-white px-2 py-0.5 rounded-md shadow-[0_2px_10px_rgba(0,0,0,0.05)] ml-2">
      {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </span>
  );
}
function useCountUp(endVal, duration = 1200) {
  const [current, setCurrent] = useState(0);
  
  useEffect(() => {
    let start = null;
    let rafId = null;
    const isNum = typeof endVal === 'number';
    // For "4.8/5", we just want 4.8
    const cleanStr = String(endVal).split('/')[0].replace(/[^0-9.]/g, '');
    const num = isNum ? endVal : Number(cleanStr);
    if (isNaN(num)) return;

    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const easeOut = 1 - Math.pow(1 - p, 3);
      setCurrent(p === 1 ? num : num * easeOut);
      if (p < 1) rafId = window.requestAnimationFrame(step);
    };
    rafId = window.requestAnimationFrame(step);
    return () => { if (rafId) window.cancelAnimationFrame(rafId) };
  }, [endVal, duration]);

  if (typeof endVal === 'number') return Math.floor(current);
  const sVal = String(endVal);
  if (sVal.startsWith('₹')) return `₹${Math.floor(current).toLocaleString('en-IN')}`;
  if (sVal.includes('/5')) return `${current.toFixed(1)}/5`;
  return Math.floor(current);
}

function formatRelativeTime(dateStr, timeStr) {
  if (!dateStr || !timeStr) return '';
  const now = new Date();
  const dateObj = new Date(`${dateStr} ${timeStr}`);
  if (isNaN(dateObj.getTime())) return `${dateStr} at ${timeStr}`;
  const diffMs = dateObj - now;
  const diffHours = diffMs / (1000 * 60 * 60);
  
  if (diffHours < -24) return 'Yesterday';
  if (diffHours < 0) return 'Earlier today';
  if (diffHours < 1) return `in ${Math.max(1, Math.floor(diffMs / 60000))} mins`;
  if (diffHours < 24) return `in ${Math.floor(diffHours)} hours`;
  return 'Tomorrow';
}
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
    pending: { bg: 'bg-[rgba(245,158,11,0.15)]', text: 'text-[#F59E0B]', dot: 'bg-[#F59E0B]' },
    confirmed: { bg: 'bg-[rgba(16,185,129,0.15)]', text: 'text-[#10B981]', dot: 'bg-[#10B981]' },
    cancelled: { bg: 'bg-[rgba(239,68,68,0.15)]', text: 'text-[#EF4444]', dot: 'bg-[#EF4444]' },
    'in progress': { bg: 'bg-[rgba(139,92,246,0.15)]', text: 'text-[#8B5CF6]', dot: 'bg-[#8B5CF6] animate-pulse' },
    completed: { bg: 'bg-[rgba(16,185,129,0.15)]', text: 'text-[#10B981]', dot: 'bg-[#10B981]' },
    Paid: { bg: 'bg-[rgba(16,185,129,0.15)]', text: 'text-[#10B981]', dot: 'bg-[#10B981]' },
    Partial: { bg: 'bg-[rgba(245,158,11,0.15)]', text: 'text-[#F59E0B]', dot: 'bg-[#F59E0B]' },
    Overdue: { bg: 'bg-[rgba(239,68,68,0.15)]', text: 'text-[#EF4444]', dot: 'bg-[#EF4444]' },
    overdue: { bg: 'bg-[rgba(239,68,68,0.15)]', text: 'text-[#EF4444]', dot: 'bg-[#EF4444]' },
    active: { bg: 'bg-[rgba(139,92,246,0.15)]', text: 'text-[#8B5CF6]', dot: 'bg-[#8B5CF6]' },
  }
  const normalized = (status || 'pending').toLowerCase()
  const s = map[normalized] || map[status] || map['pending']
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.7rem] font-bold uppercase tracking-wider ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  )
}

/* ─── appointment status badge ─── */
function AppointmentStatusBadge({ appointment, handleStatusUpdate }) {
  const [isOpen, setIsOpen] = useState(false)
  const status = (appointment.status || 'pending').toLowerCase()
  
  const handleSelect = (newStatus) => {
    setIsOpen(false)
    if (newStatus === status) return
    handleStatusUpdate(appointment._id, newStatus)
  }

  let content = null
  if (status === 'cancelled') {
    content = <span className="text-[#EF4444] font-semibold px-3">✕ Cancelled</span>
  } else if (status === 'in progress') {
    content = (
      <span className="flex items-center gap-1.5 text-[#8B5CF6] font-semibold px-3">
        <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] animate-pulse" /> In Progress
      </span>
    )
  } else {
    const isConf = status === 'confirmed' || status === 'completed'
    content = (
      <div className="flex items-center">
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-l-full transition-colors ${isConf ? 'bg-[#D1FAE5] text-[#065F46]' : 'bg-[#FEF3C7] text-[#92400E]'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isConf ? 'bg-[#0D5C4E]' : 'bg-[#C9A84C]'}`} />
          Pending
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-r-full border-l border-[#E5E7EB] transition-colors ${isConf ? 'bg-[#D1FAE5] text-[#065F46]' : 'bg-[#F3F4F6] text-[#9CA3AF]'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isConf ? 'bg-[#10B981]' : 'bg-[#D1D5DB]'}`} />
          Confirmed
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <button 
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen) }}
        className="text-[0.7rem] uppercase tracking-wider flex items-center bg-white border border-[#E5E7EB] rounded-full overflow-hidden hover:border-slate-300 transition-all focus:outline-none focus:ring-2 focus:ring-[#0D5C4E]/30 min-h-[36px]"
      >
        {content}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setIsOpen(false) }} />
          <div className="absolute top-full right-0 mt-1 z-50 bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg p-2 min-w-[150px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] animate-in fade-in slide-in-from-top-1">
            <p className="text-[10px] text-[#9CA3AF] uppercase tracking-widest px-2 mb-1.5 font-bold">Update Status</p>
            {[
              { id: 'confirmed', label: 'Mark as Confirmed', color: 'text-[#065F46]' },
              { id: 'pending', label: 'Mark as Pending', color: 'text-[#92400E]' },
              { id: 'in progress', label: 'Mark as In Progress', color: 'text-[#5B21B6]' },
              { id: 'cancelled', label: 'Mark as Cancelled', color: 'text-[#991B1B]' }
            ].map(opt => (
              <button
                key={opt.id}
                onClick={(e) => { e.stopPropagation(); handleSelect(opt.id) }}
                className={`w-full text-left px-2 py-1.5 rounded-md text-xs font-medium hover:bg-[#F9FAFB] transition-colors ${opt.color}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

/* ─── avatar initials ─── */
function Avatar({ name = '', src, size = 'md' }) {
  const sz = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base' }[size]
  const colors = ['from-[#0D5C4E] to-[#1A7A68]', 'from-[#0F6B5A] to-[#0D5C4E]', 'from-[#1A7A68] to-[#0D5C4E]']
  const color = colors[(name.charCodeAt(0) || 0) % colors.length]
  return src
    ? <img src={src} alt={name} loading="lazy" className={`${sz} rounded-full object-cover ring-1 ring-white/10 shrink-0`} />
    : <div className={`${sz} rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-[#111827] font-bold shrink-0 ring-1 ring-white/10`}>{name.charAt(0)}</div>
}

/* ─── metric card ─── */
function MetricCard({ label, value, sub, icon: Icon, accent, trend }) {
  const accents = {
    gold: { glow: 'group-hover:shadow-[0_8px_24px_rgba(13,92,78,0.10)]' },
    sky: { glow: 'group-hover:shadow-[0_8px_24px_rgba(13,92,78,0.10)]' },
    emerald: { glow: 'group-hover:shadow-[0_8px_24px_rgba(13,92,78,0.10)]' },
    rose: { glow: 'group-hover:shadow-[0_8px_24px_rgba(13,92,78,0.10)]' },
    violet: { glow: 'group-hover:shadow-[0_8px_24px_rgba(13,92,78,0.10)]' },
  }
  const a = accents[accent] || accents.gold
  const isUp = label !== 'Pending Triage' && label !== 'Overdue Invoices'
  const trendText = isUp ? '↑ 12% vs last month' : '↓ 3% vs last month'
  const trendColor = isUp ? 'text-[#0D5C4E]' : 'text-[#991B1B]'
  const animatedValue = useCountUp(value, 1200)

  return (
    <div className={`group relative bg-white border border-[#E5E7EB] rounded-[16px] p-[24px] overflow-hidden transition-all duration-300 hover:-translate-y-[2px] hover:border-[#D1D5DB] ${a.glow}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-[#E6F2F0] text-[#0D5C4E]" style={{ borderRadius: '22%' }}>
          <Icon size={20} strokeWidth={2} />
        </div>
        <div className="opacity-80 transition-opacity">
          <svg viewBox="0 0 80 30" preserveAspectRatio="none" width="80" height="30" className={trendColor}>
            <polyline
              points={isUp ? "0,25 13,20 26,22 39,10 52,15 65,8 80,12" : "0,10 13,12 26,8 39,18 52,15 65,22 80,25"}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      <p className="text-[1.75rem] font-bold text-[#111827] tracking-tight">{animatedValue}</p>
      <p className="text-[0.75rem] font-semibold mt-1"><span className={trendColor}>{trendText}</span></p>
      <p className="text-[0.8rem] font-medium text-[#6B7280] mt-3">{label}</p>
      {sub && <p className="text-[0.75rem] text-[#9CA3AF] mt-1">{sub}</p>}
    </div>
  )
}

/* ─── section header ─── */
function SectionHeader({ title, icon: Icon, action, actionLabel }) {
  return (
    <div className="flex items-center justify-between pb-5 mb-6 border-b border-[#E5E7EB]">
      <div className="flex items-center gap-3">
        {Icon && <Icon size={18} className="text-[#0D5C4E]" strokeWidth={1.5} />}
        <h3 className="text-base font-semibold text-[#111827]">{title}</h3>
      </div>
      {action && actionLabel && (
        <button onClick={action} className="text-[11px] font-semibold text-[#0D5C4E] hover:text-[#111827] transition-colors uppercase tracking-wider flex items-center gap-1">
          {actionLabel} <ChevronRight size={12} />
        </button>
      )}
    </div>
  )
}

/* ─── card wrapper ─── */
function Card({ children, className = '' }) {
  return (
    <div className={`bg-white border border-[#E5E7EB] rounded-2xl p-6 ${className}`}>
      {children}
    </div>
  )
}

/* ─── empty state ─── */
function EmptyState({ icon: Icon, message, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 bg-[#E6F2F0] rounded-full flex items-center justify-center mb-5 relative">
        <Icon size={28} strokeWidth={1.5} className="text-[#0D5C4E] relative z-10" />
        <svg className="absolute inset-0 w-full h-full text-[#0D5C4E]/10 -rotate-45 scale-125" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="4 4" />
        </svg>
      </div>
      <p className="text-[#111827] font-semibold mb-1 text-sm">Nothing to show</p>
      <p className="text-[0.8rem] text-[#6B7280] mb-5 max-w-[240px] leading-relaxed">{message}</p>
      <button 
        onClick={onAction || (() => {})} 
        className="bg-[#0D5C4E] hover:bg-[#0F6B5A] text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-colors"
      >
        {actionLabel || 'Book First Appointment'}
      </button>
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
  
  /* Fix [Round 5]: Prevent indexing of admin routes */
  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = "robots";
      document.head.appendChild(meta);
    }
    meta.content = "noindex, nofollow";
  }, []);

  const [activePatientProfile, setActivePatientProfile] = useState(null)
  const [patientProfileLoading, setPatientProfileLoading] = useState(false)
  const [activeReview, setActiveReview] = useState(null)
  const [activityLogs, setActivityLogs] = useState([])
  const [isDemoOpen, setIsDemoOpen] = useState(true)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)
  /* Fix: localStorage can throw in private browsing mode */
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    try { return window.localStorage.getItem('adminSidebarCollapsed') === 'true' }
    catch { return false }
  })

  useEffect(() => {
    const timer = setTimeout(() => setIsDemoOpen(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  /* Fix: localStorage can throw in private browsing */
  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      try { window.localStorage.setItem('adminSidebarCollapsed', String(next)) } catch {}
      return next;
    });
  };

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
    let oldAppointment = null;
    setDashboard((v) => {
      oldAppointment = v.appointments.find((i) => i._id === id);
      const next = v.appointments.map((i) => i._id === id ? { ...i, status } : i)
      return { ...v, appointments: next }
    })
    
    showToast(isDemoOpen ? `Demo mode: changes not saved` : `Status updated to ${status} ✓`)

    try {
      if (!isDemoOpen) {
        const response = await api.updateAppointmentStatus(id, status)
        setDashboard((v) => {
          const next = v.appointments.map((i) => i._id === id ? response.appointment : i)
          return { ...v, appointments: next, metrics: { ...v.metrics, pendingTriage: next.filter((a) => a.status === 'pending').length, confirmedToday: next.filter((a) => a.status === 'confirmed').length } }
        })
      }
    } catch (e) { 
      showToast(e.message)
      if (oldAppointment) {
         setDashboard((v) => ({ ...v, appointments: v.appointments.map((i) => i._id === id ? oldAppointment : i) }))
      }
    }
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
      <div className="min-h-screen bg-[#F9F6F0] flex">
        {/* Skeleton Sidebar */}
        <div className="w-[240px] hidden lg:flex flex-col bg-white border-r border-[#E8E0D5] pt-10 px-4">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-8 h-8 rounded-lg bg-[#F3EFE8] animate-pulse" />
            <div className="space-y-2 py-1 flex-1">
              <div className="h-3 bg-[#F3EFE8] rounded w-16 animate-pulse" />
              <div className="h-2 bg-[#F3EFE8] rounded w-20 animate-pulse" />
            </div>
          </div>
          <div className="space-y-3 px-2">
            {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-10 bg-[#F3EFE8] rounded-xl animate-pulse" />)}
          </div>
        </div>
        {/* Skeleton Main Content */}
        <div className="flex-1 flex flex-col p-6 lg:p-8 gap-8 overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
            <div className="space-y-3">
              <div className="h-3 w-32 bg-[#F3EFE8] rounded animate-pulse" />
              <div className="h-7 w-48 bg-[#F3EFE8] rounded animate-pulse" />
            </div>
            <div className="flex gap-3">
              <div className="h-10 w-24 bg-[#F3EFE8] rounded-xl animate-pulse hidden sm:block" />
              <div className="h-10 w-32 bg-[#E6F2F0] rounded-xl animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-[140px] bg-white border border-[#E8E0D5] rounded-2xl animate-pulse" />)}
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 h-[400px] bg-white border border-[#E8E0D5] rounded-2xl animate-pulse" />
            <div className="xl:col-span-1 h-[400px] bg-white border border-[#E8E0D5] rounded-2xl animate-pulse" />
          </div>
          {message && <p className="text-[#991B1B] text-sm bg-[#FEE2E2] px-4 py-2 rounded-xl border border-[#FCA5A5] mt-4">{message}</p>}
        </div>
      </div>
    )
  }

  const topAppointments = dashboard.appointments.slice(0, 4)
  const topInquiries = dashboard.inquiries.slice(0, 4)
  const topPatients = dashboard.patients.slice(0, 6)
  const topInvoices = dashboard.invoices.slice(0, 6)
  const anyModalOpen = isBookingOpen || isPatientModalOpen || isNewInvoiceOpen || isReportModalOpen || isAIOpen || isNotificationsOpen || isSettingsOpen || isLogoutModalOpen || isProfileMenuOpen || isCommandPaletteOpen || activeInvoice !== null || activePatientId !== null || activeReview !== null

  return (
    <div className="min-h-screen bg-[#F4F6F8] text-[#374151] font-sans flex overflow-hidden selection:bg-[#0D5C4E]/20">

      {/* ── Toast ── */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 md:top-auto md:left-auto md:bottom-5 md:right-5 md:translate-x-0 z-[100] flex items-center gap-3 bg-white border border-[#E5E7EB] text-[#111827] px-5 py-3.5 rounded-[12px] shadow-[0_4px_20px_rgba(0,0,0,0.10)] animate-in slide-in-from-top-3 md:slide-in-from-bottom-5 md:slide-in-from-right-5 duration-300 max-w-[90vw] md:max-w-sm">
          <CheckCircle2 size={16} className="text-[#0D5C4E] shrink-0" />
          <p className="text-[0.9rem] font-medium text-[#111827]">{toast}</p>
        </div>
      )}

      {/* ── Demo Mode Banner ── */}
      <div className={`fixed top-0 inset-x-0 z-[90] transition-all duration-400 ease-in-out overflow-hidden ${isDemoOpen ? 'max-h-16 opacity-100 bg-[#FEF9EC] border-b-[2px] border-[#C9A84C]' : 'max-h-[3px] opacity-100 bg-[#C9A84C] cursor-pointer'}`} onClick={() => !isDemoOpen && setIsDemoOpen(true)} title={!isDemoOpen ? "Demo Mode Active — click to expand" : undefined}>
        {isDemoOpen && (
          <div className="py-2 px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[#C9A84C] font-bold text-sm">⚠</span>
              <p className="text-[#92400E] text-[0.8rem] font-medium tracking-wide">Demo Mode — Write operations are disabled</p>
            </div>
            <button onClick={(e) => { e.stopPropagation(); setIsDemoOpen(false) }} className="text-[#C9A84C]/70 hover:text-[#C9A84C] p-1"><ChevronDown size={14} className="rotate-180" /></button>
          </div>
        )}
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
      <CommandPalette 
        isOpen={isCommandPaletteOpen} 
        onClose={() => setIsCommandPaletteOpen(false)} 
        onAction={(item) => {
          if (item.action === 'open-patient') {
            setActivePatientId(item.id)
          } else if (item.action === 'open-appointment' && item.patientId) {
            setActivePatientId(item.patientId)
          } else if (item.action === 'open-invoice') {
            const invoice = dashboard?.invoices?.find(i => i._id === item.id)
            if (invoice) setActiveInvoice(invoice)
          } else if (item.action === 'open-review') {
            const review = dashboard?.reviews?.find(r => r._id === item.id)
            if (review) setActiveReview(review)
          } else {
            showToast('Selected: ' + item.title)
          }
        }} 
        showToast={showToast} 
      />

      {/* ── Mobile overlay ── */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setIsMobileSidebarOpen(false)} />
      )}

      {/* ════════════════════ SIDEBAR ════════════════════ */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 shrink-0
        flex flex-col bg-[#FFFFFF] border-r border-[#E5E7EB]
        transition-all duration-200 ease-out
        ${isMobileSidebarOpen ? 'translate-x-0 w-[240px]' : `-translate-x-full lg:translate-x-0 ${isSidebarCollapsed ? 'w-[60px]' : 'w-[240px]'}`}
        pt-8 lg:pt-10
      `}>
        {/* Logo */}
        <div className={`px-4 mb-8 flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <img src="/logo.jpg" alt="Azure Smile Logo" className="h-8 w-8 object-contain rounded-lg border border-[#E5E7EB] shadow-sm" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#080E1C]" />
            </div>
            {!isSidebarCollapsed && (
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm font-bold text-[#111827] leading-none tracking-wide">Azure OS</h1>
                  <div className="flex items-center gap-1.5 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-100">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-ping" />
                    <span className="text-[0.6rem] font-bold text-[#0D5C4E] uppercase tracking-wider">Live</span>
                  </div>
                </div>
                <p className="text-[9px] text-[#0D5C4E]/70 font-bold tracking-[0.2em] mt-1 uppercase">Dental Clinic</p>
              </div>
            )}
          </div>
          <button className="lg:hidden text-[#111827]/40 hover:text-[#111827]" onClick={() => setIsMobileSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Nav label */}
        {!isSidebarCollapsed && <p className="px-6 text-[10px] font-bold text-[#111827]/20 uppercase tracking-widest mb-3">Navigation</p>}

        {/* Tabs */}
        <nav className="px-3 space-y-1 flex-1 overflow-y-auto">
          {visibleTabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setIsMobileSidebarOpen(false) }}
                className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3 px-3.5'} py-3 text-[0.9rem] font-medium transition-all duration-200 group rounded-[10px] ${
                  isActive
                    ? 'bg-[#E6F2F0] text-[#0D5C4E] shadow-[0_2px_8px_rgba(13,92,78,0.12)] border border-transparent'
                    : 'text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#111827] border border-transparent'
                }`}
                title={isSidebarCollapsed ? tab.label : undefined}
              >
                <Icon size={18} strokeWidth={isActive ? 2 : 1.5} className="shrink-0" />
                {!isSidebarCollapsed && <span>{tab.label}</span>}
              </button>
            )
          })}
        </nav>

        {/* User card & Toggle */}
        <div className="px-3 pb-24 lg:pb-6 mt-4 space-y-1">
          {!isSidebarCollapsed && (
            <div className="mx-1 p-3.5 rounded-xl bg-white/[0.03] border border-[#E5E7EB] mb-2">
              <div className="flex items-center gap-3">
                <Avatar name={currentUser?.fullName || '?'} src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=100&q=80" size="sm" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#111827] truncate">{currentUser?.fullName}</p>
                  <p className="text-[10px] text-[#0D5C4E]/70 font-medium uppercase tracking-wider truncate">{currentUser?.roleLabel}</p>
                </div>
              </div>
            </div>
          )}
          <button onClick={() => showToast('Settings are unavailable in Demo Mode.')} className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3 px-3.5'} py-2.5 rounded-xl text-[#111827]/20 text-sm cursor-not-allowed`} title={isSidebarCollapsed ? 'Settings' : undefined}>
            <Settings size={15} strokeWidth={1.5} />{!isSidebarCollapsed && <span>Settings</span>}
          </button>
          
          <button onClick={toggleSidebar} className={`hidden lg:flex w-full items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3 px-3.5'} py-2.5 rounded-xl text-[#6B7280] hover:text-[#111827] text-sm transition-colors mt-2 border-t border-[#E5E7EB] pt-4`} title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}>
            <ChevronRight size={15} className={`transition-transform duration-200 ${!isSidebarCollapsed ? 'rotate-180' : ''}`} />
            {!isSidebarCollapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* ════════════════════ MAIN ════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 pt-8">

        {/* ── Topbar ── */}
        <header className="shrink-0 h-[56px] sm:h-[64px] border-b border-[#E5E7EB] bg-white flex items-center px-4 sm:px-6 lg:px-8 gap-3 sm:gap-4 relative z-30">
          <button className="lg:hidden text-[#6B7280] hover:text-[#111827] transition-colors shrink-0" onClick={() => setIsMobileSidebarOpen(true)}>
            <Menu size={20} />
          </button>

          {/* Search */}
          <div className="relative flex-1 max-w-sm hidden sm:block">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
            <input
              type="text"
              placeholder="Search patients, invoices…"
              className="w-full h-10 bg-[#F4F6F8] border border-[#E5E7EB] rounded-[10px] py-2 pl-10 pr-4 text-[0.875rem] text-[#111827] placeholder-[#9CA3AF] focus:border-[#0D5C4E] focus:bg-white focus:ring-2 focus:ring-[#0D5C4E]/15 focus:outline-none transition-all duration-200 font-[Inter]"
            />
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <button className="sm:hidden text-[#6B7280] hover:text-[#111827] p-2" onClick={() => setIsCommandPaletteOpen(true)}>
              <Search size={20} />
            </button>
            {/* AI */}
            <button
              onClick={() => setIsAIOpen(true)}
              className="flex items-center gap-2 bg-[#E6F2F0] hover:bg-[#0D5C4E]/10 transition-all rounded-[8px] px-3 py-2 group relative"
            >
              <div className="relative">
                <BrainCircuit size={16} className="text-[#0D5C4E]" />
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]"></span>
                </span>
              </div>
              <span className="hidden sm:inline text-[0.85rem] font-semibold text-[#0D5C4E] tracking-wider">AI Assistant</span>
            </button>

            {/* Notifications */}
            <div className="relative">
              <button id="notification-bell-btn" onClick={() => setIsNotificationsOpen((v) => !v)} className="relative p-2.5 rounded-xl text-[#111827]/40 hover:text-[#111827] hover:bg-[#F9FAFB] transition-colors">
                <Bell size={17} />
                {dashboard.unreadNotifications ? (
                  <span className="absolute top-1.5 right-1.5 min-w-4 h-4 px-1 rounded-full bg-[#C9A84C] text-[#060C18] text-[9px] font-bold flex items-center justify-center">
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
                className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-xl hover:bg-[#F9FAFB] transition-colors group"
              >
                <div className="ring-2 ring-[#0D5C4E] ring-offset-2 rounded-full flex shrink-0">
                  <Avatar name={currentUser?.fullName || '?'} src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=100&q=80" size="sm" />
                </div>
                <div className="hidden md:block text-left ml-1">
                  <p className="text-xs font-semibold text-[#111827] group-hover:text-[#0D5C4E] transition-colors leading-none">{currentUser?.fullName}</p>
                  <p className="text-[10px] text-[#111827]/30 uppercase tracking-wider mt-0.5">{currentUser?.roleLabel}</p>
                </div>
                <ChevronDown size={12} className="text-[#111827]/30 hidden md:block" />
              </button>

              {isProfileMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-[#E5E7EB] rounded-2xl shadow-2xl z-50 overflow-hidden">
                    <div className="p-4 border-b border-[#E5E7EB]">
                      <p className="text-sm font-semibold text-[#111827]">{currentUser?.fullName}</p>
                      <p className="text-[10px] text-[#111827]/30 uppercase tracking-widest mt-1">{currentUser?.roleLabel}</p>
                    </div>
                    <div className="p-2">
                      <button onClick={() => { setIsProfileMenuOpen(false); showToast('Settings are unavailable in Demo Mode.') }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#111827]/20 cursor-not-allowed text-sm">
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

        {/* Mobile Search Bar Slide-down */}
        <div className={`sm:hidden bg-white border-b border-[#E5E7EB] overflow-hidden transition-all duration-300 ${isMobileSearchOpen ? 'max-h-[56px]' : 'max-h-0'}`}>
          <div className="p-2 flex items-center gap-2">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
              <input type="text" placeholder="Search..." className="w-full h-10 bg-white border border-[#0D5C4E] rounded-[8px] pl-9 pr-4 text-[16px] text-[#111827] focus:ring-2 focus:ring-[#0D5C4E]/15 focus:outline-none" autoFocus={isMobileSearchOpen} />
            </div>
            <button onClick={() => setIsMobileSearchOpen(false)} className="p-2 text-[#6B7280]">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ── Page Content ── */}
        <main className="flex-1 overflow-y-auto pb-24 lg:pb-8">
          <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-[1400px] mx-auto">

            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#111827]/40 mb-2 font-semibold">
                  <span>Dashboard</span>
                  <span>›</span>
                  <span className="text-[#0D5C4E]">{activeTab}</span>
                  {activeTab === 'appointments' && (
                    <>
                      <span>›</span>
                      <span className="text-[#0D5C4E]">Today</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1 h-5 rounded-full bg-[#C9A84C]" />
                  <h2 className="text-xl font-bold text-[#111827] capitalize flex items-center">{activeTab === 'billing' ? 'Billing & EMI' : activeTab} <LiveClock /></h2>
                </div>
                <p className="text-sm text-[#111827]/30 pl-3">
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
                  <button onClick={() => showToast('Report generation is unavailable in Demo Mode.')} className="flex items-center gap-2 px-3.5 py-2 bg-white/[0.04] border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#111827]/25 cursor-not-allowed">
                    <Download size={14} />Report
                  </button>
                )}
                {canManageAppointments && activeTab !== 'billing' && (
                  <button onClick={() => setIsBookingOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-[#0D5C4E]/10 border border-[#0D5C4E]/20 rounded-xl text-xs font-semibold text-[#0D5C4E] transition-all hover:bg-[#0D5C4E]/20">
                    <Plus size={14} />New Booking
                  </button>
                )}
                {activeTab === 'billing' && canManageBilling && (
                  <button onClick={() => showToast('Invoice creation is unavailable in Demo Mode.')} className="flex items-center gap-2 px-4 py-2 bg-[#0D5C4E]/10 border border-[#0D5C4E]/20 rounded-xl text-xs font-semibold text-[#0D5C4E]/50 cursor-not-allowed">
                    <Plus size={14} />New Invoice
                  </button>
                )}
              </div>
            </div>

            <div key={activeTab} className="animate-in fade-in duration-150">

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
                          className={`group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 bg-white hover:bg-[#F9FAFB] border border-[#E5E7EB] hover:border-[#0D5C4E]/20 rounded-xl p-4 cursor-pointer transition-all ${item.status === 'confirmed' || item.status === 'completed' ? 'border-l-4 border-l-[#0D5C4E]' : item.status === 'cancelled' ? 'border-l-4 border-l-[#C0392B]' : item.status === 'in progress' ? 'border-l-4 border-l-[#8B5CF6]' : 'border-l-4 border-l-[#C9A84C]'}`}
                          onClick={() => item.patient?._id && setActivePatientId(item.patient._id)}
                        >
                          <Avatar name={item.patient?.fullName || item.name} size="md" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-[#111827] group-hover:text-[#0D5C4E] transition-colors truncate">{item.patient?.fullName || item.name}</p>
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                              <span className="text-xs text-[#0D5C4E]/70 font-medium truncate">{item.treatment?.name || item.service}</span>
                              <span className="text-[#111827]/10">·</span>
                              <span className="text-xs text-[#111827]/30 flex items-center gap-1" title={`${item.date} ${item.time}`}><Clock size={10} />{formatRelativeTime(item.date, item.time)}</span>
                            </div>
                          </div>
                          {canManageAppointments && (
                            <div className="flex gap-1.5 shrink-0 flex-wrap relative" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                              <AppointmentStatusBadge appointment={item} handleStatusUpdate={handleStatusUpdate} />
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
                        <div key={item._id} className="bg-[#F3EFE8] border border-[#E5E7EB] hover:border-rose-500/20 rounded-xl p-4 cursor-pointer transition-all group" onClick={() => showToast(`Inquiry opened for ${item.name}.`)}>
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-semibold text-[#111827] truncate">{item.name}</p>
                            <span className="text-[9px] bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 ml-2">Lead</span>
                          </div>
                          <p className="text-xs text-[#0D5C4E]/60 font-medium mb-2">{item.phone}</p>
                          <p className="text-xs text-[#111827]/30 line-clamp-2 leading-relaxed">{item.message}</p>
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
                        <div key={insight.id} className="bg-[#0D5C4E]/5 border border-[#0D5C4E]/10 rounded-xl p-4 hover:border-[#0D5C4E]/20 transition-colors">
                          <div className="flex items-start gap-3">
                            <Sparkles size={14} className="text-[#0D5C4E] mt-0.5 shrink-0" />
                            <div>
                              <p className="text-sm font-semibold text-[#111827]">{insight.title}</p>
                              <p className="text-xs text-[#111827]/40 mt-1.5 leading-relaxed">{insight.body}</p>
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
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-6 border-b border-[#E5E7EB]">
                    <h3 className="text-base font-semibold text-[#111827] flex items-center gap-2"><Calendar size={16} className="text-[#0D5C4E]" strokeWidth={1.5} />Full Schedule</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 text-xs text-[#065F46] bg-emerald-500/10 px-3 py-1.5 rounded-lg">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Live sync
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {dashboard.appointments.map((item) => (
                      <div
                        key={item._id}
                        className={`group flex flex-col md:flex-row md:items-center gap-3 md:gap-4 bg-white hover:bg-[#F9FAFB] border border-[#E5E7EB] hover:border-[#0D5C4E]/20 rounded-xl p-4 cursor-pointer transition-all ${item.status === 'confirmed' || item.status === 'completed' ? 'border-l-4 border-l-[#0D5C4E]' : item.status === 'cancelled' ? 'border-l-4 border-l-[#C0392B]' : item.status === 'in progress' ? 'border-l-4 border-l-[#8B5CF6]' : 'border-l-4 border-l-[#C9A84C]'}`}
                        onClick={() => item.patient?._id && setActivePatientId(item.patient._id)}
                      >
                        <Avatar name={item.patient?.fullName || item.name} size="md" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#111827] group-hover:text-[#0D5C4E] transition-colors">{item.patient?.fullName || item.name}</p>
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                            <span className="text-xs text-[#0D5C4E]/70 font-medium">{item.treatment?.name || item.service}</span>
                            <span className="text-[#111827]/10 hidden sm:inline">·</span>
                            <span className="text-xs text-[#111827]/30 flex items-center gap-1" title={`${item.date} at ${item.time}`}><Clock size={10} />{formatRelativeTime(item.date, item.time)}</span>
                            <span className="text-[#111827]/10 hidden sm:inline">·</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap shrink-0">
                          <div className="relative z-10" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}><AppointmentStatusBadge appointment={item} handleStatusUpdate={handleStatusUpdate} /></div>
                          <button
                            onClick={(e) => { e.stopPropagation(); item.patient?._id && setActivePatientId(item.patient._id) }}
                            className="ml-1 w-8 h-8 rounded-lg bg-[#F9FAFB] flex items-center justify-center text-[#111827]/20 hover:text-[#111827] hover:bg-slate-200 transition-colors"
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
                  <div className="flex items-center justify-between pb-5 mb-6 border-b border-[#E5E7EB]">
                    <h3 className="text-base font-semibold text-[#111827] flex items-center gap-2"><Users size={16} className="text-[#0D5C4E]" strokeWidth={1.5} />Patient Records</h3>
                    <button onClick={() => setIsPatientModalOpen(true)} className="flex items-center gap-1.5 text-xs font-semibold text-[#0D5C4E] hover:text-[#111827] bg-[#0D5C4E]/10 hover:bg-[#0D5C4E]/20 border border-[#0D5C4E]/20 px-3 py-2 rounded-xl transition-all">
                      <UserPlus size={13} />Add Patient
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {topPatients.map((patient) => (
                      <div key={patient._id} className="group flex items-start gap-4 bg-[#F3EFE8] border border-[#E5E7EB] hover:border-[#0D5C4E]/20 rounded-xl p-5 cursor-pointer transition-all" onClick={() => setActivePatientId(patient._id)}>
                        <Avatar name={patient.fullName} src={patient.avatarUrl} size="lg" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-sm font-semibold text-[#111827] group-hover:text-[#0D5C4E] transition-colors">{patient.fullName}</p>
                              <p className="text-xs text-[#111827]/30 mt-0.5">Joined {formatDateLabel(patient.createdAt)}</p>
                            </div>
                            <StatusBadge status={patient.status} />
                          </div>
                          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-[#E5E7EB]">
                            <div>
                              <p className="text-[10px] font-bold text-[#111827]/20 uppercase tracking-wider mb-1">Phone</p>
                              <p className="text-xs text-[#111827]/60 font-medium">{patient.phone}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-[#111827]/20 uppercase tracking-wider mb-1">Medical Flag</p>
                              <p className={`text-xs font-semibold ${patient.allergies ? 'text-rose-400' : 'text-[#065F46]'}`}>{patient.allergies || 'Clear'}</p>
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
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-6 border-b border-[#E5E7EB]">
                    <div>
                      <h3 className="text-base font-semibold text-[#111827] flex items-center gap-2"><Stethoscope size={16} className="text-[#0D5C4E]" strokeWidth={1.5} />Treatment Catalog</h3>
                      <p className="text-xs text-[#111827]/20 mt-1 font-medium uppercase tracking-wider">Synced with frontend services</p>
                    </div>
                    <button onClick={() => setIsSettingsOpen(true)} className="flex items-center gap-2 px-4 py-2 border border-[#0D5C4E]/20 text-[#0D5C4E] hover:bg-[#0D5C4E]/10 rounded-xl text-xs font-semibold transition-all">
                      <Settings size={13} />Manage in Settings
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {dashboard.treatments.map((treatment) => (
                      <div key={treatment._id} className="bg-[#F3EFE8] border border-[#E5E7EB] hover:border-[#0D5C4E]/20 rounded-xl p-5 transition-all group">
                        <div className="flex items-start justify-between gap-2 mb-4">
                          <div>
                            <p className="text-sm font-semibold text-[#111827] group-hover:text-[#0D5C4E] transition-colors">{treatment.name}</p>
                            <p className="text-[10px] font-bold text-[#0D5C4E]/60 uppercase tracking-widest mt-1">{treatment.category}</p>
                          </div>
                          <span className="text-[10px] text-[#111827]/20 uppercase tracking-wider shrink-0">{treatment.durationLabel || `${treatment.durationMinutes} min`}</span>
                        </div>
                        <p className="text-xs text-[#111827]/30 leading-relaxed mb-5">{treatment.description}</p>
                        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#E5E7EB]">
                          {[
                            { label: 'Price', value: treatment.priceLabel || formatMoney(treatment.basePrice), color: 'text-[#111827]' },
                            { label: 'Tech', value: treatment.technology || 'Premium', color: 'text-[#0D5C4E]/80' },
                            { label: 'Pain Level', value: treatment.painLevel || 'Minimal', color: 'text-[#065F46]' },
                            { label: 'Recovery', value: treatment.recovery || 'Immediate', color: 'text-[#0D5C4E]' },
                          ].map((row) => (
                            <div key={row.label}>
                              <p className="text-[10px] font-bold text-[#111827]/15 uppercase tracking-widest mb-1">{row.label}</p>
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
                      <div key={review._id} className="bg-[#F3EFE8] border border-[#E5E7EB] hover:border-[#E5E7EB] rounded-xl p-5 transition-all">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <p className="text-sm font-semibold text-[#111827]">{review.patient?.fullName || 'Patient'}</p>
                            <div className="flex gap-0.5 mt-1.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} size={12} className={star <= review.rating ? 'fill-amber-400 text-[#0D5C4E]' : 'text-[#111827]/10'} />
                              ))}
                            </div>
                          </div>
                          <StatusBadge status={review.adminReply ? 'completed' : 'pending'} />
                        </div>
                        <p className="text-sm text-[#111827]/40 leading-relaxed">{review.comment}</p>
                        {review.adminReply
                          ? <div className="mt-4 bg-[#0D5C4E]/5 border border-[#0D5C4E]/10 rounded-xl p-4 text-sm text-[#111827]/40"><span className="text-[#0D5C4E] font-semibold text-xs uppercase tracking-wider">Reply · </span>{review.adminReply}</div>
                          : <button onClick={() => setActiveReview(review)} className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-[#0D5C4E] hover:text-[#111827] transition-colors uppercase tracking-wider"><MessageCircle size={12} />Reply to review</button>
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
                  <div className="flex items-center justify-between pb-5 mb-6 border-b border-[#E5E7EB]">
                    <h3 className="text-base font-semibold text-[#111827] flex items-center gap-2"><CreditCard size={16} className="text-[#0D5C4E]" strokeWidth={1.5} />Active EMI Plans</h3>
                    <button onClick={() => showToast('EMI portfolio is live and linked to invoice records.')} className="text-[11px] font-semibold text-[#0D5C4E] hover:text-[#111827] transition-colors uppercase tracking-wider flex items-center gap-1">Portfolio <ChevronRight size={12} /></button>
                  </div>
                  <div className="space-y-3">
                    {dashboard.emiPlans.length ? dashboard.emiPlans.slice(0, 5).map((plan) => (
                      <div key={plan._id} className="group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 bg-[#F3EFE8] border border-[#E5E7EB] hover:border-[#0D5C4E]/20 rounded-xl p-4 transition-all">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#111827]">{plan.patient?.fullName || 'Patient'}</p>
                          <div className="flex flex-wrap items-center gap-2 mt-1.5">
                            <div className="flex-1 min-w-[120px] bg-[#F9FAFB] rounded-full h-1.5 overflow-hidden">
                              <div
                                className="h-full bg-[#C9A84C] rounded-full transition-all"
                                style={{ width: `${Math.round((plan.paidInstallments / plan.totalInstallments) * 100)}%` }}
                              />
                            </div>
                            <span className="text-xs text-[#111827]/30 shrink-0">{plan.paidInstallments}/{plan.totalInstallments} paid · Due {formatDateLabel(plan.nextDueDate)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <p className="text-base font-bold text-[#111827]">{formatMoney(plan.installmentAmount)}</p>
                          <StatusBadge status={plan.status} />
                        </div>
                      </div>
                    )) : (
                      <div className="rounded-xl border border-[#E5E7EB] bg-white/[0.01] p-5 text-xs text-[#111827]/30">
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
                        className="group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 bg-[#F3EFE8] border border-[#E5E7EB] hover:border-[#0D5C4E]/20 rounded-xl p-4 cursor-pointer transition-all"
                        onClick={() => setActiveInvoice(invoice)}
                      >
                        <div className="w-10 h-10 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-center text-[#111827]/20 shrink-0">
                          <FileText size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#111827] group-hover:text-[#0D5C4E] transition-colors">{invoice.patient?.fullName || 'Patient'}</p>
                          <p className="text-xs text-[#111827]/30 mt-0.5 font-medium uppercase tracking-wide">{invoice.invoiceNumber} · {invoice.paymentMethod || 'CASH'} · Due {formatDateLabel(invoice.dueDate)}</p>
                          {invoice.transactionDetails && <p className="text-[10px] text-[#111827]/20 mt-0.5 uppercase tracking-wider">Ref: {invoice.transactionDetails}</p>}
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <p className="text-base font-bold text-[#111827]">{formatMoney(invoice.totalAmount)}</p>
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
          </div>
        </main>
      </div>

      {/* ════════════════════ MOBILE BOTTOM NAV ════════════════════ */}
      <nav className={`
        md:hidden fixed bottom-0 inset-x-0 z-50
        bg-white border-t border-[#E5E7EB] h-[60px]
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
              className={`relative flex flex-col items-center justify-center flex-1 pt-3 pb-1 gap-1 transition-all active:scale-95 ${isActive ? 'text-[#0D5C4E]' : 'text-[#6B7280] hover:text-[#111827]'}`}
            >
              {isActive && (
                <div className="absolute top-0 w-8 h-1.5 bg-[#0D5C4E] rounded-b-full" />
              )}
              <div className="relative">
                <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                {tab.id === 'appointments' && (
                  <span className="absolute -top-1.5 -right-2 w-3.5 h-3.5 bg-rose-500 rounded-full border border-white flex items-center justify-center text-[0.45rem] font-bold text-white">
                    {dashboard?.metrics?.pendingTriage || 2}
                  </span>
                )}
              </div>
              <span className={`text-[0.65rem] font-medium ${isActive ? 'text-[#0D5C4E]' : ''}`}>{tab.label.split(' ')[0]}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}

export default AdminDashboardPage
