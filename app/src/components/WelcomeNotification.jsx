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
          className="fixed top-4 left-4 right-4 z-[100] md:top-auto md:bottom-6 md:left-auto md:right-6 w-[calc(100vw-32px)] md:w-full md:max-w-[360px] mx-auto md:mx-0 max-h-[90vh] overflow-y-auto"
        >
          <div className="relative overflow-hidden rounded-[20px] border border-[#E8E0D5] bg-[#FFFFFF] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.08),0_20px_60px_rgba(13,92,78,0.06)] backdrop-blur-[16px]">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#0D5C4E] via-[#1A7A68] to-transparent"></div>

            <button
              onClick={dismiss}
              className="absolute right-4 top-4 rounded-full p-[6px] text-[#8A8A82] transition-colors hover:bg-[#F3EFE8] hover:text-[#1A1A18]"
              aria-label="Close"
            >
              <X size={16} />
            </button>

            <div className="relative z-10 flex items-start gap-4">
              <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full border border-[#0D5C4E]/20 bg-[#E6F2F0] text-[#0D5C4E]">
                <Sparkles size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-[1.1rem] font-semibold text-[#1A1A18]">
                  Welcome to Azure OS
                </h3>
                <p className="mt-2 text-[0.85rem] font-normal leading-[1.6] text-[#4A4A45]">
                  If you're visiting us for the first time, we recommend reading our guide before booking your appointment.
                </p>

                <div className="mt-5 flex flex-row items-center gap-3 w-full">
                  <Link
                    to="/how-to-use"
                    onClick={dismiss}
                    className="flex flex-1 items-center justify-center gap-2 rounded-[10px] bg-[#0D5C4E] px-4 py-2 min-h-[44px] text-[0.75rem] font-semibold uppercase tracking-[0.05em] text-[#FFFFFF] transition-all hover:bg-[#1A7A68] active:scale-[0.97]"
                  >
                    <BookOpen size={14} className="text-white" />
                    Read Guide
                  </Link>
                  <button
                    onClick={dismiss}
                    className="flex flex-1 items-center justify-center rounded-[10px] border border-[#E8E0D5] bg-transparent px-4 py-2 min-h-[44px] text-[0.75rem] font-semibold uppercase tracking-[0.05em] text-[#8A8A82] transition-all hover:bg-[#F3EFE8] hover:text-[#4A4A45] active:scale-[0.97]"
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
