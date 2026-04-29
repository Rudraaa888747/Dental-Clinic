import { motion } from 'framer-motion'

const variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
}

function AnimatedSection({ children, className = '', delay = 0 }) {
  return (
    <motion.section
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={variants}
      transition={{ duration: 0.7, ease: 'easeOut', delay }}
    >
      {children}
    </motion.section>
  )
}

export default AnimatedSection
