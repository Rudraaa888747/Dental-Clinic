import { motion } from 'framer-motion'
import { useMemo } from 'react'

/* Fix: Move static variants outside component to avoid re-creation */
const directionVariants = {
  up:    { hidden: { opacity: 0, y: 24 },  
           visible: { opacity: 1, y: 0 } },
  down:  { hidden: { opacity: 0, y: -24 }, 
           visible: { opacity: 1, y: 0 } },
  left:  { hidden: { opacity: 0, x: 32 },  
           visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: -32 }, 
           visible: { opacity: 1, x: 0 } },
  fade:  { hidden: { opacity: 0 },         
           visible: { opacity: 1 } },
}
function AnimatedSection({ 
  children, 
  className = '', 
  delay = 0,
  direction = 'up'
}) {
  // Determine if mobile for earlier trigger
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  /* Fix: Memoize viewport config to prevent unnecessary re-renders */
  const viewportConfig = useMemo(() => ({ 
    once: true, 
    amount: isMobile ? 0.03 : 0.05, 
    margin: isMobile ? "60px" : "80px" 
  }), [isMobile]);

  return (
    <motion.section
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
      variants={directionVariants[direction] || directionVariants.up}
      transition={{ 
        duration: 0.55, 
        ease: [0.16, 1, 0.3, 1],
        delay 
      }}
    >
      {children}
    </motion.section>
  )
}

export default AnimatedSection
