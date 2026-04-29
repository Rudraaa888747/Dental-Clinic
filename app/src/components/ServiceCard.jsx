import { motion } from 'framer-motion'
import {
  AlignCenterVertical,
  ArrowUpRight,
  ShieldPlus,
  Sparkles,
  SunMedium,
} from 'lucide-react'

const iconMap = {
  AlignCenterVertical,
  ShieldPlus,
  Sparkles,
  SunMedium,
}

function ServiceCard({ service }) {
  const Icon = iconMap[service.icon] || Sparkles

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group glass-panel rounded-[28px] p-6 shadow-card transition-shadow duration-300 hover:shadow-glow"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-skybrand-100 text-skybrand-700 shadow-sm">
          <Icon size={26} />
        </div>
        <ArrowUpRight className="text-slate-300 transition group-hover:text-skybrand-500" />
      </div>
      <h3 className="mt-6 font-display text-2xl font-semibold text-ink">
        {service.name}
      </h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">
        {service.description}
      </p>
      <div className="mt-5 inline-flex rounded-full bg-skybrand-50 px-4 py-2 text-sm font-semibold text-skybrand-700">
        {service.price}
      </div>
    </motion.div>
  )
}

export default ServiceCard
