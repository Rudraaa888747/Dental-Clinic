import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Bell, CheckCircle2, Clock3, Command, FileSearch, Save, Search, Settings2, RefreshCcw } from 'lucide-react'
import { api } from '../../lib/api'

function NotificationPill({ type }) {
  const styles = {
    appointment: 'bg-sky-500/10 text-sky-300 border-sky-500/20',
    payment_pending: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    payment_confirmed: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    review_replied: 'bg-gold/10 text-gold border-gold/20',
    patient_created: 'bg-violet-500/10 text-violet-300 border-violet-500/20',
  }

  return (
    <span className={`px-2 py-1 rounded-full border text-[10px] uppercase tracking-widest ${styles[type] || 'bg-white/5 text-support-300 border-white/10'}`}>
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
          className="fixed left-4 right-4 top-20 sm:absolute sm:left-auto sm:-right-2 sm:top-14 z-50 w-[calc(100vw-32px)] sm:w-[420px] max-w-[420px] rounded-[28px] border border-white/10 bg-[#0F172A]/95 backdrop-blur-2xl shadow-[0_30px_80px_rgba(2,8,23,0.65)] overflow-hidden"
        >
          <div className="p-5 border-b border-white/5 flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Notification Center</p>
              <p className="text-xs text-support-300 mt-1">{unreadCount} unread operational alert(s)</p>
            </div>
            <Bell className="text-gold" size={18} />
          </div>
          <div className="max-h-[420px] overflow-y-auto p-3 space-y-3">
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
                className={`w-full rounded-2xl border p-4 text-left transition-colors ${
                  notification.read
                    ? 'border-white/5 bg-white/[0.03]'
                    : 'border-gold/15 bg-gold/[0.04]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-white font-medium">{notification.title}</p>
                    <p className="text-xs text-support-300 mt-2 leading-relaxed">{notification.body}</p>
                  </div>
                  {!notification.read ? <span className="mt-1 w-2.5 h-2.5 rounded-full bg-gold shadow-[0_0_10px_rgba(212,175,55,0.6)]"></span> : null}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <NotificationPill type={notification.type} />
                  <span className="text-[11px] text-support-300">{new Date(notification.createdAt).toLocaleString('en-IN')}</span>
                </div>
              </button>
            )) : (
              <div className="p-8 text-center text-support-300 text-sm">Your operations queue is calm right now.</div>
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
        active ? 'bg-gold/10 border border-gold/20' : 'border border-transparent hover:bg-white/5'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-white text-sm font-medium">{item.title}</p>
          <p className="text-xs text-support-300 mt-1">{item.subtitle}</p>
        </div>
        <span className="text-[10px] uppercase tracking-[0.25em] text-support-300">{item.category}</span>
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
          className="fixed inset-0 z-[70] bg-[#020817]/75 backdrop-blur-md flex items-start justify-center p-4 pt-24"
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.99 }}
            transition={{ duration: 0.18 }}
            className="w-full max-w-3xl rounded-[32px] border border-white/10 bg-[#0F172A]/95 backdrop-blur-2xl shadow-[0_40px_120px_rgba(2,8,23,0.7)] overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-white/5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
                <Command size={18} />
              </div>
              <div className="flex-1 relative">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-support-300" size={16} />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search patients, appointments, invoices, reviews, doctors, treatments..."
                  className="w-full bg-transparent pl-7 pr-4 py-2 text-white placeholder:text-support-300/50 outline-none"
                />
              </div>
              <div className="hidden md:flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-support-300">
                <span className="px-2 py-1 rounded-lg border border-white/10">Ctrl K</span>
              </div>
            </div>

            <div className="max-h-[480px] overflow-y-auto p-4 space-y-3">
              {!displayResults.length ? (
                <div className="p-10 text-center text-support-300">
                  <FileSearch className="mx-auto mb-4 text-gold/70" size={28} />
                  <p className="text-sm">Start typing to jump across Azure OS instantly.</p>
                </div>
              ) : (
                <>
                  {!query.trim() ? (
                    <div className="px-2 pb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-support-300">
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

            <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between text-xs text-support-300">
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
    <div className="bg-[#111827]/60 backdrop-blur-md border border-white/5 rounded-[32px] p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-white/5 pb-6">
        <div>
          <h3 className="text-xl font-display font-medium text-white">Activity Timeline</h3>
          <p className="text-xs text-support-300 mt-2 uppercase tracking-[0.25em]">Searchable audit trail</p>
        </div>
        <div className="relative md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-support-300" size={14} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter logs..."
            className="w-full rounded-full bg-[#0F172A]/50 border border-white/10 py-2.5 pl-9 pr-4 text-sm text-white placeholder:text-support-300/50 focus:outline-none focus:border-gold/50"
          />
        </div>
      </div>
      <div className="space-y-3 max-h-[360px] overflow-y-auto">
        {activityLogs.map((item) => (
          <div key={item._id} className="rounded-2xl border border-white/5 bg-[#0F172A]/50 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-white text-sm font-medium">{item.action.replaceAll('.', ' ')}</p>
                <p className="text-xs text-support-300 mt-1">{item.actorEmail || 'System'} • {item.entityType || 'Entity'}</p>
              </div>
              <span className="text-[11px] text-support-300 whitespace-nowrap">{new Date(item.createdAt).toLocaleString('en-IN')}</span>
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
          className="fixed inset-0 z-[60] bg-[#020817]/75 backdrop-blur-sm flex justify-end"
        >
          <motion.div
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 40, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-2xl h-full bg-[#0F172A] border-l border-white/10 shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-white/5 bg-[#111827] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 text-gold flex items-center justify-center">
                  <Settings2 size={18} />
                </div>
                <div>
                  <h3 className="text-2xl font-display text-white">Settings</h3>
                  <p className="text-xs uppercase tracking-[0.25em] text-support-300 mt-1">Clinic operations control</p>
                </div>
              </div>
              <button onClick={onClose} className="px-4 py-2 rounded-xl border border-white/10 text-support-300 hover:text-white hover:bg-white/5 transition-colors">
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <form onSubmit={handleSave} className="space-y-8">
                <div>
                  <h4 className="text-sm font-medium text-white mb-4 border-b border-white/5 pb-2">Clinic Profile</h4>
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
                        className="bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold outline-none"
                      />
                    ))}
                    <input
                      value={form.address}
                      onChange={(event) => setForm((value) => ({ ...value, address: event.target.value }))}
                      placeholder="Address"
                      className="md:col-span-2 bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold outline-none"
                    />
                    <input
                      value={form.googleMapsEmbed}
                      onChange={(event) => setForm((value) => ({ ...value, googleMapsEmbed: event.target.value }))}
                      placeholder="Google Maps Embed URL"
                      className="md:col-span-2 bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold outline-none"
                    />
                    <textarea
                      value={form.hoursText}
                      onChange={(event) => setForm((value) => ({ ...value, hoursText: event.target.value }))}
                      placeholder="Business hours, one line per entry"
                      className="md:col-span-2 bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold outline-none h-28 resize-none"
                    ></textarea>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-white mb-4 border-b border-white/5 pb-2">Team Access</h4>
                  <div className="space-y-3">
                    {adminUsers.map((user) => (
                      <div key={user._id} className="rounded-2xl border border-white/5 bg-[#111827] px-4 py-4 flex items-center justify-between">
                        <div>
                          <p className="text-white text-sm">{user.fullName}</p>
                          <p className="text-xs text-support-300 mt-1">{user.email}</p>
                        </div>
                        <span className="text-[10px] uppercase tracking-[0.25em] text-gold">{user.role.replaceAll('_', ' ')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button type="submit" disabled={saving} className="flex-1 rounded-xl bg-gold text-navy font-semibold py-3 hover:bg-gold-light transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
                    <Save size={16} />
                    {saving ? 'Saving...' : 'Save Settings'}
                  </button>
                  <button type="button" disabled={syncing} onClick={handleSyncTreatments} className="flex-1 rounded-xl border border-gold/30 text-gold font-semibold py-3 hover:bg-gold/10 transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
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
