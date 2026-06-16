import { motion, AnimatePresence } from 'framer-motion'
import { Menu, Phone, X, Sparkles, Shield } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

const MotionNavLink = motion(NavLink)

const links = [
  ['Home', '/'],
  ['About', '/about'],
  ['Services', '/services'],
  ['Gallery', '/gallery'],
  ['Reviews', '/testimonials'],
  ['Blog', '/blog'],
  ['Contact', '/contact'],
]

function Navbar({ clinic }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const ticking = useRef(false)

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        ticking.current = true
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50)
          ticking.current = false
        })
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header 
      className={`fixed top-0 inset-x-0 transition-all duration-500 ${
        open ? 'z-[100]' : 'z-50'
      } ${
        scrolled ? 'bg-navy/80 backdrop-blur-xl border-b border-white/5 py-2 shadow-2xl' : 'bg-transparent py-4'
      }`}
    >
      <div className="page-shell flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 group">
          <img src="/logo.jpg" alt="Azure Smile Logo" className="h-10 md:h-12 w-auto object-contain rounded-lg" />
          <div>
            <p className="font-display text-xl font-medium tracking-wide text-white group-hover:text-gold transition-colors">
              {clinic.name}
            </p>
            <p className="text-[10px] uppercase tracking-[0.3em] text-support-300">
              Cosmetic Dentistry
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 xl:flex">
          {links.map(([label, href]) => (
            <MotionNavLink
              key={href}
              to={href}
              className={({ isActive }) =>
                `text-sm tracking-wide transition-all duration-300 font-light relative py-2 ${
                  isActive ? 'text-gold' : 'text-support-200 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {label}
                  {isActive && (
                    <motion.div 
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-0 right-0 h-[1px] bg-gold"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </>
              )}
            </MotionNavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <Link to="/admin" className="text-[10px] font-bold text-support-400 hover:text-white uppercase tracking-widest transition flex items-center gap-1.5">
            <Shield size={12} /> Admin
          </Link>
          <a
            href={`tel:${clinic.phone.replace(/\s+/g, '')}`}
            className="inline-flex items-center gap-2 text-sm font-light text-support-200 hover:text-white transition-colors"
          >
            <Phone size={14} className="text-gold" />
            {clinic.phone}
          </a>
          <div className="w-[1px] h-8 bg-white/10"></div>
          <Link
            to="/appointment"
            className="rounded-full bg-white text-navy px-6 py-2.5 text-sm font-medium transition hover:bg-gold hover:text-navy shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-gold uppercase tracking-wider"
          >
            Consultation
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 text-white lg:hidden bg-white/5 backdrop-blur-md"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Premium Mobile Menu Slide-over */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 250 }}
            className="fixed inset-0 z-[9999] w-full h-[100dvh] bg-[#020817] flex flex-col lg:hidden overflow-hidden"
            data-lenis-prevent="true"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-[#0F172A]">
              <div className="flex items-center gap-3">
                <img src="/logo.jpg" alt="Azure Smile Logo" className="h-8 md:h-10 w-auto object-contain rounded-lg" />
                <div>
                  <span className="font-display font-medium text-white tracking-wide">{clinic.name}</span>
                  <p className="text-[9px] uppercase tracking-widest text-gold/70 font-semibold">Menu</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-3 bg-white/5 rounded-full text-support-300 hover:text-white hover:bg-white/10 transition-colors active:scale-95"
              >
                <X size={20} />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-4 custom-scrollbar" data-lenis-prevent="true">
              {links.map(([label, href], i) => (
                <motion.div
                  key={href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + (i * 0.05), duration: 0.3 }}
                >
                  <NavLink
                    to={href}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-5 py-4 rounded-2xl transition-all ${
                        isActive
                          ? 'bg-gold/10 text-gold border border-gold/20 shadow-inner'
                          : 'bg-white/[0.02] text-support-200 hover:bg-white/5 hover:text-white border border-transparent'
                      }`
                    }
                  >
                    <span className="font-display font-medium text-xl tracking-wide">{label}</span>
                  </NavLink>
                </motion.div>
              ))}
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-white/5 bg-[#0F172A] space-y-4 pb-safe">
              <Link
                to="/appointment"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center w-full rounded-2xl bg-gold px-4 py-4 text-sm font-bold text-navy uppercase tracking-widest shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:bg-gold-light transition-all active:scale-[0.98]"
              >
                Book Consultation
              </Link>
              <div className="grid grid-cols-2 gap-4">
                <a href={`tel:${clinic.phone.replace(/\s+/g, '')}`} className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 transition-colors rounded-xl p-3.5 border border-white/10 text-white shadow-sm active:scale-95">
                  <Phone size={16} className="text-support-300" />
                  <span className="text-xs font-semibold tracking-wide uppercase">Call</span>
                </a>
                <a href={`https://wa.me/91${clinic.phone.replace(/\D/g, '').slice(-10)}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors rounded-xl p-3.5 border border-emerald-500/20 text-emerald-400 shadow-sm active:scale-95">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                  <span className="text-xs font-semibold tracking-wide uppercase">WhatsApp</span>
                </a>
              </div>
              <Link to="/admin" onClick={() => setOpen(false)} className="flex items-center justify-center gap-2 bg-[#111827] hover:bg-white/5 transition-colors rounded-xl p-3.5 border border-white/5 text-support-300 shadow-sm mt-4">
                <Shield size={16} />
                <span className="text-xs font-semibold tracking-wide uppercase">Admin Dashboard</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar
