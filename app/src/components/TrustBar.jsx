import { motion } from 'framer-motion'

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
}

const itemVariant = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

function TrustBar({ clinic }) {
  const items = [
    `${clinic.yearsExperience}+ years of expertise`,
    `${clinic.happyPatients} happy patients`,
    'Premium sterilization & digital diagnostics',
  ]

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="grid gap-4 sm:grid-cols-3"
    >
      {items.map((item) => (
        <motion.div
          key={item}
          variants={itemVariant}
          className="rounded-2xl border border-skybrand-100 bg-white/80 px-5 py-4 text-sm font-medium text-slate-600 shadow-sm"
        >
          {item}
        </motion.div>
      ))}
    </motion.div>
  )
}

export default TrustBar
