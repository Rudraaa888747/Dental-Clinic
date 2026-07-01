import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Shield } from 'lucide-react'

const MotionNavLink = motion(NavLink)

const links = [
  ['Home', '/'],
  ['About', '/about'],
  ['Services', '/services'],
  ['Gallery', '/gallery'],
  ['Reviews', '/testimonials'],
  ['FAQ', '/faq'],
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
          setScrolled(window.scrollY > 20)
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
      className={`fixed top-0 inset-x-0 transition-all duration-500 z-[1000] h-[60px] md:h-[72px] flex items-center ${
        scrolled 
          ? 'bg-[rgba(249,246,240,0.92)] backdrop-blur-[20px] backdrop-saturate-[180%] border-b border-border shadow-soft' 
          : 'bg-transparent'
      }`}
    >
      <div className="page-shell w-full flex items-center justify-between gap-4">
        {/* Logo Left */}
        <Link to="/" className="flex items-center gap-3 group">
          <img src="/logo.jpg" alt="Azure Smile Logo" className="h-[40px] w-auto object-contain rounded-lg" />
          <div className="hidden md:block">
            <p className="font-display text-xl font-medium tracking-wide text-charcoal group-hover:text-accent transition-colors">
              {clinic?.name || 'Azure Smiles'}
            </p>
          </div>
        </Link>

        {/* Desktop Nav Center */}
        <nav className="hidden lg:flex items-center justify-center flex-1 gap-6 lg:gap-8">
          {links.map(([label, href]) => (
            <MotionNavLink
              key={href}
              to={href}
              className={({ isActive }) =>
                `text-[0.9rem] font-medium tracking-[0.02em] transition-all duration-300 relative py-2 group ${
                  isActive ? 'text-accent' : 'text-charcoal-200 hover:text-accent'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {label}
                  {/* Underline animation */}
                  <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-accent transition-all duration-300 ease-out ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                </>
              )}
            </MotionNavLink>
          ))}
        </nav>

        {/* Right Section (Buttons + Hamburger) */}
        <div className="flex items-center gap-3 md:gap-6 shrink-0">
          <Link to="/admin" className="hidden lg:flex btn-secondary items-center gap-2">
            <Shield size={16} /> Admin
          </Link>
          <Link
            to="/appointment"
            className="btn-primary flex items-center justify-center md:px-[20px] md:py-[10px] md:text-[0.85rem] md:rounded-[8px] px-[14px] py-[8px] text-[0.8rem] rounded-[20px] max-w-[140px] md:max-w-none"
          >
            Book<span className="hidden md:inline">&nbsp;Consultation</span>
          </Link>

          {/* Mobile Hamburger */}
          <button
            type="button"
            className="lg:hidden relative w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-white/50 backdrop-blur-md border border-border text-[#1A1A18] z-[1001]"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <div className="w-5 h-4 relative flex flex-col justify-between">
              <span className={`w-full h-[2px] bg-[#1A1A18] rounded-full transition-all duration-300 ${open ? 'rotate-45 translate-y-[7px]' : ''}`}></span>
              <span className={`w-full h-[2px] bg-[#1A1A18] rounded-full transition-all duration-300 ${open ? 'opacity-0' : ''}`}></span>
              <span className={`w-full h-[2px] bg-[#1A1A18] rounded-full transition-all duration-300 ${open ? '-rotate-45 -translate-y-[7px]' : ''}`}></span>
            </div>
          </button>
        </div>
      </div>

      {/* Premium Mobile Menu Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[1000] w-full h-[100dvh] bg-[#F9F6F0] flex flex-col lg:hidden"
          >
            {/* Header placeholder to align with absolute header */}
            <div className="h-[60px] md:h-[72px] shrink-0 border-b border-[#E8E0D5] flex items-center px-4 sm:px-6 justify-between">
              <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-3">
                <img src="/logo.jpg" alt="Azure Smile Logo" className="h-[40px] w-auto object-contain rounded-lg" />
                <span className="font-display text-xl font-medium tracking-wide text-[#1A1A18] hidden md:block">{clinic?.name || 'Azure Smiles'}</span>
              </Link>
              {/* Close button is handled by the hamburger which remains on top via z-[1001], but let's add one here for robustness if needed, or rely on hamburger. The hamburger is outside this div and has z-[1001] */}
            </div>

            {/* Navigation Links (Centered, Staggered Slide In) */}
            <div className="flex-1 flex flex-col overflow-y-auto pt-6 px-6 hide-scrollbar">
              {links.map(([label, href], i) => (
                <motion.div
                  key={href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.05 * i, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="border-b border-[#E8E0D5]"
                >
                  <NavLink
                    to={href}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `block font-display text-[1.8rem] font-medium tracking-wide transition-colors py-[20px] ${
                        isActive ? 'text-accent' : 'text-[#1A1A18] hover:text-accent'
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.05 * links.length, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="border-b border-[#E8E0D5]"
              >
                <NavLink
                  to="/admin"
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block font-display text-[1.8rem] font-medium tracking-wide transition-colors py-[20px] flex items-center gap-2 ${
                      isActive ? 'text-accent' : 'text-[#1A1A18] hover:text-accent'
                    }`
                  }
                >
                  <Shield size={24} className="shrink-0" /> Admin
                </NavLink>
              </motion.div>
            </div>

            {/* Pinned Bottom CTA */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="p-6 shrink-0 pb-safe flex flex-col m-[24px]"
            >
              <Link
                to="/appointment"
                onClick={() => setOpen(false)}
                className="w-full btn-primary flex items-center justify-center text-center bg-accent text-white py-[14px] rounded-[8px]"
              >
                Book Consultation
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar
