import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, BookOpen, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function WelcomeNotification() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if the user has already seen the popup
    const hasSeen = localStorage.getItem('hasSeenWelcomePopup')
    if (!hasSeen) {
      // Small delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const dismiss = () => {
    setIsVisible(false)
    localStorage.setItem('hasSeenWelcomePopup', 'true')
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-4 left-4 right-4 z-[100] md:bottom-6 md:left-auto md:right-6 md:w-full md:max-w-[360px]"
        >
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-navy/90 p-6 shadow-2xl backdrop-blur-xl">
            {/* Ambient Background Glow */}
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gold/20 blur-[60px]"></div>
            <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-blue-500/10 blur-[60px]"></div>

            <button
              onClick={dismiss}
              className="absolute right-4 top-4 rounded-full p-1.5 text-support-300 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              <X size={16} />
            </button>

            <div className="relative z-10 flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/20 bg-gold/10 text-gold shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                <Sparkles size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-lg font-medium tracking-wide text-white">
                  Welcome to Azure OS
                </h3>
                <p className="mt-2 text-sm font-light leading-relaxed text-support-200">
                  If you're visiting us for the first time, we recommend reading our guide before booking your appointment.
                </p>

                <div className="mt-5 flex items-center gap-3">
                  <Link
                    to="/how-to-use"
                    onClick={dismiss}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gold px-4 py-2 text-xs font-bold uppercase tracking-widest text-navy shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all hover:bg-gold-light hover:shadow-gold active:scale-95"
                  >
                    <BookOpen size={14} />
                    Read Guide
                  </Link>
                  <button
                    onClick={dismiss}
                    className="flex flex-1 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-widest text-support-200 transition-all hover:bg-white/10 hover:text-white active:scale-95"
                  >
                    Skip
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
