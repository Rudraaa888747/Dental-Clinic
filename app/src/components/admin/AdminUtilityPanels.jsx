import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Bell, CheckCircle2, Clock3, Command, FileSearch, Save, Search, Settings2, RefreshCcw, X } from 'lucide-react'
import { api } from '../../lib/api'

function NotificationPill({ type }) {
  const styles = {
    appointment: 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]',
    payment_pending: 'bg-[#FEF9EC] text-[#92400E] border-[#FCD34D]',
    payment_confirmed: 'bg-[#D1FAE5] text-[#065F46] border-[#6EE7B7]',
    review_replied: 'bg-[#E6F2F0] text-[#0D5C4E] border-[#0D5C4E]/30',
    patient_created: 'bg-[#F5F3FF] text-[#5B21B6] border-[#C4B5FD]',
  }

  return (
    <span className={`px-2 py-1 rounded-full border text-[10px] uppercase tracking-widest ${styles[type] || 'bg-[#F9FAFB] text-[#9CA3AF] border-[#E5E7EB]'}`}>
      {type.replaceAll('_', ' ')}
    </span>
  )
}

export function NotificationCenter({ isOpen, onClose, notifications = [], unreadCount = 0, onRead, showToast }) {
  const panelRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return undefined

    function handleClick(event) {
      if (event.target.closest('#notification-bell-btn')) return
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, y: -12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          transition={{ duration: 0.18 }}
          className="fixed left-4 right-4 top-20 sm:absolute sm:left-auto sm:-right-2 sm:top-14 z-50 w-[calc(100vw-32px)] sm:w-[420px] max-w-[420px] rounded-[12px] border border-[#E5E7EB] bg-white shadow-lg overflow-hidden"
        >
          <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <p className="text-[#111827] font-semibold">Notifications</p>
              {unreadCount > 0 && <span className="bg-[#0D5C4E] text-white text-[10px] px-2 py-0.5 rounded-full font-medium">{unreadCount}</span>}
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => {}} className="text-[#0D5C4E] text-[0.8rem] hover:underline font-medium">Mark all read</button>
              <button onClick={onClose} className="text-[#6B7280] hover:text-[#111827]"><X size={18} /></button>
            </div>
          </div>
          <div className="max-h-[420px] overflow-y-auto">
            {notifications.length ? notifications.map((notification) => (
              <button
                key={notification._id}
                type="button"
                onClick={async () => {
                  if (!notification.read) {
                    await onRead(notification._id)
                  }
                  showToast(notification.body)
                  onClose()
                }}
                className={`w-full text-left transition-colors p-4 border-b border-[#E5E7EB] last:border-0 ${
                  notification.read
                    ? 'bg-white border-l-[3px] border-l-transparent hover:bg-[#F9FAFB]'
                    : 'bg-[#F0FDF9] border-l-[3px] border-l-[#0D5C4E] hover:bg-[#F9FAFB]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-[0.9rem] text-[#111827] font-medium truncate">{notification.title}</p>
                    <p className="text-[0.85rem] text-[#6B7280] mt-1 leading-relaxed line-clamp-2">{notification.body}</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <NotificationPill type={notification.type} />
                  <span className="text-[0.75rem] text-[#9CA3AF]">{new Date(notification.createdAt).toLocaleString('en-IN')}</span>
                </div>
              </button>
            )) : (
              <div className="p-12 flex flex-col items-center justify-center text-center">
                <Bell className="text-[#E5E7EB] mb-3" size={32} />
                <p className="text-[#9CA3AF] text-sm font-medium">No new notifications</p>
              </div>
            )}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

function ResultRow({ item, active, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      className={`w-full rounded-2xl px-4 py-3 text-left transition-colors ${
        active ? 'bg-[#0D5C4E]/10 border border-teal-600/20' : 'border border-transparent hover:bg-[#F9FAFB]'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[#111827] text-sm font-medium">{item.title}</p>
          <p className="text-xs text-[#6B7280] mt-1">{item.subtitle}</p>
        </div>
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#6B7280]">{item.category}</span>
      </div>
    </button>
  )
}

export function CommandPalette({ isOpen, onClose, onAction, showToast }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [recentSearches, setRecentSearches] = useState([])
  const inputRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return undefined
    const raw = window.localStorage.getItem('adminRecentSearches')
    setRecentSearches(raw ? JSON.parse(raw) : [])
    setTimeout(() => inputRef.current?.focus(), 10)
    return undefined
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return undefined

    function handleKey(event) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        onClose()
      }

      if (!results.length) return
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        setActiveIndex((value) => (value + 1) % results.length)
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        setActiveIndex((value) => (value - 1 + results.length) % results.length)
      }
      if (event.key === 'Enter') {
        event.preventDefault()
        handleSelect(results[activeIndex])
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose, results, activeIndex])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setActiveIndex(0)
      return undefined
    }

    const timeout = window.setTimeout(async () => {
      try {
        const response = await api.searchAdmin(query.trim())
        setResults(response.results)
        setActiveIndex(0)
      } catch (error) {
        showToast(error.message)
      }
    }, 120)

    return () => window.clearTimeout(timeout)
  }, [query, showToast])

  const displayResults = useMemo(() => {
    if (query.trim()) return results
    return recentSearches.map((item, index) => ({ ...item, id: `recent-${index}` }))
  }, [query, results, recentSearches])

  function persistRecent(item) {
    const next = [item, ...recentSearches.filter((entry) => `${entry.title}-${entry.subtitle}` !== `${item.title}-${item.subtitle}`)].slice(0, 6)
    setRecentSearches(next)
    window.localStorage.setItem('adminRecentSearches', JSON.stringify(next))
  }

  function handleSelect(item) {
    if (!item) return
    persistRecent(item)
    onAction(item)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] bg-[#F4F6F8]/75 backdrop-blur-md flex items-start justify-center p-4 pt-24"
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.99 }}
            transition={{ duration: 0.18 }}
            className="w-full max-w-3xl rounded-[32px] border border-[#E5E7EB] bg-white/95 backdrop-blur-2xl shadow-[0_40px_120px_rgba(2,8,23,0.7)] overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-[#E5E7EB] flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-[#0D5C4E]/10 border border-teal-600/20 flex items-center justify-center text-[#0D5C4E]">
                <Command size={18} />
              </div>
              <div className="flex-1 relative">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-[#6B7280]" size={16} />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search patients, appointments, invoices, reviews, doctors, treatments..."
                  className="w-full bg-transparent pl-7 pr-4 py-2 text-[#111827] placeholder:text-[#6B7280]/50 outline-none"
                />
              </div>
              <div className="hidden md:flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-[#6B7280]">
                <span className="px-2 py-1 rounded-lg border border-[#E5E7EB]">Ctrl K</span>
              </div>
            </div>

            <div className="max-h-[480px] overflow-y-auto p-4 space-y-3">
              {!displayResults.length ? (
                <div className="p-10 text-center text-[#6B7280]">
                  <FileSearch className="mx-auto mb-4 text-[#0D5C4E]/70" size={28} />
                  <p className="text-sm">Start typing to jump across Azure OS instantly.</p>
                </div>
              ) : (
                <>
                  {!query.trim() ? (
                    <div className="px-2 pb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-[#6B7280]">
                      <Clock3 size={12} />
                      Recent Searches
                    </div>
                  ) : null}
                  {displayResults.map((item, index) => (
                    <ResultRow key={`${item.id}-${index}`} item={item} active={index === activeIndex} onSelect={handleSelect} />
                  ))}
                </>
              )}
            </div>

            <div className="px-6 py-4 border-t border-[#E5E7EB] flex items-center justify-between text-xs text-[#6B7280]">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-2"><CheckCircle2 size={12} /> Enter to open</span>
                <span className="flex items-center gap-2"><Search size={12} /> Arrow keys to navigate</span>
              </div>
              <span>Global Search</span>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export function ActivityTimeline({ activityLogs = [], onSearch }) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      onSearch(query)
    }, 120)

    return () => window.clearTimeout(timeout)
  }, [query, onSearch])

  return (
    <div className="bg-white/60 backdrop-blur-md border border-[#E5E7EB] rounded-[32px] p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-[#E5E7EB] pb-6">
        <div>
          <h3 className="text-xl font-display font-medium text-[#111827]">Activity Timeline</h3>
          <p className="text-xs text-[#6B7280] mt-2 uppercase tracking-[0.25em]">Searchable audit trail</p>
        </div>
        <div className="relative md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" size={14} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter logs..."
            className="w-full rounded-full bg-white/50 border border-[#E5E7EB] py-2.5 pl-9 pr-4 text-sm text-[#111827] placeholder:text-[#6B7280]/50 focus:outline-none focus:border-teal-600/50"
          />
        </div>
      </div>
      <div className="space-y-3 max-h-[360px] overflow-y-auto">
        {activityLogs.map((item) => (
          <div key={item._id} className="rounded-2xl border border-[#E5E7EB] bg-white/50 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[#111827] font-medium text-sm">{item.action.replaceAll('.', ' ')}</p>
                <p className="text-xs text-[#6B7280] mt-1">{item.actorEmail || 'System'} • {item.entityType || 'Entity'}</p>
              </div>
              <span className="text-[11px] text-[#6B7280] whitespace-nowrap">{new Date(item.createdAt).toLocaleString('en-IN')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function SettingsPanel({ isOpen, onClose, initialClinic, adminUsers = [], onSaved, onTreatmentsSynced, showToast }) {
  const [form, setForm] = useState({
    name: '',
    tagline: '',
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    googleMapsEmbed: '',
    hoursText: '',
  })
  const [saving, setSaving] = useState(false)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    if (!isOpen || !initialClinic) return
    setForm({
      name: initialClinic.name || '',
      tagline: initialClinic.tagline || '',
      phone: initialClinic.phone || '',
      whatsapp: initialClinic.whatsapp || '',
      email: initialClinic.email || '',
      address: initialClinic.address || '',
      googleMapsEmbed: initialClinic.googleMapsEmbed || '',
      hoursText: (initialClinic.hours || []).join('\n'),
    })
  }, [isOpen, initialClinic])

  async function handleSave(event) {
    event.preventDefault()
    setSaving(true)
    try {
      const response = await api.updateSettings({
        clinic: {
          name: form.name,
          tagline: form.tagline,
          phone: form.phone,
          whatsapp: form.whatsapp,
          email: form.email,
          address: form.address,
          googleMapsEmbed: form.googleMapsEmbed,
          hours: form.hoursText
            .split('\n')
            .map((item) => item.trim())
            .filter(Boolean),
        },
      })
      onSaved?.(response.content)
      showToast('Clinic settings updated successfully.')
      onClose()
    } catch (error) {
      showToast(error.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleSyncTreatments() {
    setSyncing(true)
    try {
      const response = await api.syncTreatments()
      onTreatmentsSynced?.(response.treatments)
      showToast('Frontend treatments synced into admin catalog.')
    } catch (error) {
      showToast(error.message)
    } finally {
      setSyncing(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-[#1A1A18]/30 backdrop-blur-sm flex justify-end"
        >
          <motion.div
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 40, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-2xl h-full bg-white border-l border-[#E5E7EB] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-[#E5E7EB] bg-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0D5C4E]/10 border border-teal-600/20 text-[#0D5C4E] flex items-center justify-center">
                  <Settings2 size={18} />
                </div>
                <div>
                  <h3 className="text-2xl font-display text-[#111827]">Settings</h3>
                  <p className="text-xs uppercase tracking-[0.25em] text-[#6B7280] mt-1">Clinic operations control</p>
                </div>
              </div>
              <button onClick={onClose} className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-[#6B7280] hover:text-[#111827] hover:bg-[#F9FAFB] transition-colors">
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <form onSubmit={handleSave} className="space-y-8">
                <div>
                  <h4 className="text-sm font-medium text-[#111827] mb-4 border-b border-[#E5E7EB] pb-2">Clinic Profile</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      ['name', 'Clinic Name'],
                      ['tagline', 'Tagline'],
                      ['phone', 'Phone'],
                      ['whatsapp', 'WhatsApp'],
                      ['email', 'Email'],
                    ].map(([key, label]) => (
                      <input
                        key={key}
                        value={form[key]}
                        onChange={(event) => setForm((value) => ({ ...value, [key]: event.target.value }))}
                        placeholder={label}
                        className="bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 text-[#111827] focus:border-teal-600 outline-none"
                      />
                    ))}
                    <input
                      value={form.address}
                      onChange={(event) => setForm((value) => ({ ...value, address: event.target.value }))}
                      placeholder="Address"
                      className="md:col-span-2 bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 text-[#111827] focus:border-teal-600 outline-none"
                    />
                    <input
                      value={form.googleMapsEmbed}
                      onChange={(event) => setForm((value) => ({ ...value, googleMapsEmbed: event.target.value }))}
                      placeholder="Google Maps Embed URL"
                      className="md:col-span-2 bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 text-[#111827] focus:border-teal-600 outline-none"
                    />
                    <textarea
                      value={form.hoursText}
                      onChange={(event) => setForm((value) => ({ ...value, hoursText: event.target.value }))}
                      placeholder="Business hours, one line per entry"
                      className="md:col-span-2 bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 text-[#111827] focus:border-teal-600 outline-none h-28 resize-none"
                    ></textarea>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-[#111827] mb-4 border-b border-[#E5E7EB] pb-2">Team Access</h4>
                  <div className="space-y-3">
                    {adminUsers.map((user) => (
                      <div key={user._id} className="rounded-2xl border border-[#E5E7EB] bg-white px-4 py-4 flex items-center justify-between">
                        <div>
                          <p className="text-[#111827] text-sm">{user.fullName}</p>
                          <p className="text-xs text-[#6B7280] mt-1">{user.email}</p>
                        </div>
                        <span className="text-[10px] uppercase tracking-[0.25em] text-[#0D5C4E]">{user.role.replaceAll('_', ' ')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button type="submit" disabled={saving} className="flex-1 rounded-xl bg-[#0D5C4E] text-navy font-semibold py-3 hover:bg-[#0D5C4E]-light transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
                    <Save size={16} />
                    {saving ? 'Saving...' : 'Save Settings'}
                  </button>
                  <button type="button" disabled={syncing} onClick={handleSyncTreatments} className="flex-1 rounded-xl border border-teal-600/30 text-[#0D5C4E] font-semibold py-3 hover:bg-[#0D5C4E]/10 transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
                    <RefreshCcw size={16} className={syncing ? 'animate-spin' : ''} />
                    {syncing ? 'Syncing...' : 'Sync Treatments'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
