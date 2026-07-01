import { motion } from 'framer-motion'
import { Sparkles, Award, ShieldCheck } from 'lucide-react'

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
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
}

function TrustBar({ clinic }) {
  const items = [
    { text: `${clinic.yearsExperience}+ years of excellence`, icon: Award },
    { text: `${clinic.happyPatients} transformative smiles`, icon: Sparkles },
    { text: 'Premium sterile environment', icon: ShieldCheck },
  ]

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="grid gap-4 sm:grid-cols-3"
    >
      {items.map((item, index) => {
        const Icon = item.icon
        return (
          <motion.div
            key={index}
            variants={itemVariant}
            className="rounded-2xl border border-border bg-white shadow-soft px-5 py-4 flex flex-col gap-3 group transition-colors hover:border-accent/30"
          >
            <Icon size={20} className="text-accent" />
            <span className="text-sm font-light text-charcoal-200 transition-colors">{item.text}</span>
          </motion.div>
        )
      })}
    </motion.div>
  )
}

export default TrustBar
