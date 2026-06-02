import { motion } from 'framer-motion'
import {
  AlignCenterVertical,
  Anchor,
  Camera,
  Layers,
  ShieldPlus,
  Smile,
  Sparkles,
  Stethoscope,
  SunMedium,
  Activity,
  ArrowUpRight,
  Clock,
  Calendar,
  Cpu
} from 'lucide-react'
import { Link } from 'react-router-dom'

const iconMap = {
  AlignCenterVertical,
  Anchor,
  Camera,
  Layers,
  ShieldPlus,
  Smile,
  Sparkles,
  Stethoscope,
  SunMedium,
  Activity
}

function ServiceCard({ service }) {
  const Icon = iconMap[service.icon] || Sparkles

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.01 }}
      className="group glass-panel-dark rounded-[32px] p-6 sm:p-8 shadow-card transition-all duration-300 hover:shadow-gold hover:border-gold/30 relative overflow-hidden flex flex-col h-full"
    >
      <div className="absolute top-0 right-0 w-48 h-48 bg-gold/5 blur-[50px] rounded-full group-hover:bg-gold/10 transition-colors"></div>
      
      <div className="flex items-start justify-between gap-4 relative z-10">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-gold shadow-lg backdrop-blur-md group-hover:scale-110 transition-transform duration-500">
          <Icon size={26} strokeWidth={1.5} />
        </div>
        <div className="inline-flex rounded-full bg-gold/10 border border-gold/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-gold">
          {service.price}
        </div>
      </div>
      
      <div className="relative z-10 mt-6 flex-grow">
        <h3 className="font-display text-2xl font-medium text-white group-hover:text-gold transition-colors">
          {service.name}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-support-200 font-light">
          {service.description}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-y-4 gap-x-2 border-t border-white/5 pt-6">
          <div className="flex items-start gap-2 overflow-hidden">
            <Clock className="text-support-300 w-4 h-4 mt-0.5 shrink-0" />
            <div className="min-w-0 overflow-hidden">
              <p className="text-[10px] uppercase tracking-widest text-support-300 font-semibold truncate">Duration</p>
              <p className="text-xs text-white mt-1 truncate" title={service.duration}>{service.duration}</p>
            </div>
          </div>
          <div className="flex items-start gap-2 overflow-hidden">
            <Activity className="text-support-300 w-4 h-4 mt-0.5 shrink-0" />
            <div className="min-w-0 overflow-hidden">
              <p className="text-[10px] uppercase tracking-widest text-support-300 font-semibold truncate">Pain Level</p>
              <p className="text-xs text-white mt-1 truncate" title={service.painLevel}>{service.painLevel}</p>
            </div>
          </div>
          <div className="flex items-start gap-2 overflow-hidden">
            <Calendar className="text-support-300 w-4 h-4 mt-0.5 shrink-0" />
            <div className="min-w-0 overflow-hidden">
              <p className="text-[10px] uppercase tracking-widest text-support-300 font-semibold truncate">Recovery</p>
              <p className="text-xs text-white mt-1 truncate" title={service.recovery}>{service.recovery}</p>
            </div>
          </div>
          <div className="flex items-start gap-2 overflow-hidden">
            <Cpu className="text-support-300 w-4 h-4 mt-0.5 shrink-0" />
            <div className="min-w-0 overflow-hidden">
              <p className="text-[10px] uppercase tracking-widest text-support-300 font-semibold truncate">Tech</p>
              <p className="text-xs text-white mt-1 truncate" title={service.technology}>{service.technology}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="relative z-10 mt-8">
        <Link
          to="/appointment"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm font-medium text-white transition hover:bg-gold hover:text-navy hover:border-gold group-hover:bg-gold group-hover:text-navy"
        >
          Book Consultation
          <ArrowUpRight size={16} />
        </Link>
      </div>
    </motion.div>
  )
}

export default ServiceCard
