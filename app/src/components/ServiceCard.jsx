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
      className="group bg-white rounded-xl border border-[#E8E0D5] p-[20px] sm:p-6 shadow-[0_2px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgba(13,92,78,0.12)] transition-all duration-300 border-l-[3px] border-l-transparent group-hover:border-l-[#0D5C4E] relative overflow-hidden flex flex-col h-full"
    >
      <div className="absolute top-0 right-0 w-48 h-48 bg-[rgba(13,92,78,0.04)] blur-[50px] rounded-full group-hover:bg-[rgba(13,92,78,0.08)] transition-colors"></div>
      
      <div className="flex items-start justify-between gap-4 relative z-10">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#E6F2F0] text-[#0D5C4E] group-hover:scale-110 transition-transform duration-500">
          <Icon size={26} strokeWidth={1.5} />
        </div>
        <div className="inline-flex text-[0.9rem] font-bold text-[#0D5C4E] bg-[#E6F2F0] px-[10px] py-[4px] rounded-[999px] border border-[rgba(13,92,78,0.2)]">
          {service.price}
        </div>
      </div>
      
      <div className="relative z-10 mt-6 flex-grow">
        <h3 className="font-display text-[clamp(1.2rem,3vw,1.5rem)] font-medium text-[#1A1A18] group-hover:text-[#0D5C4E] transition-colors">
          {service.name}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-[#4A4A45] font-light">
          {service.description}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-[12px] sm:gap-y-4 sm:gap-x-3 border-t border-[#E8E0D5] pt-6">
          <div className="flex items-start gap-2 overflow-hidden">
            <Clock className="text-[#0D5C4E] w-[18px] h-[18px] mt-0.5 shrink-0" />
            <div className="min-w-0 overflow-hidden">
              <p className="text-[10px] uppercase tracking-widest text-[#8A8A82] font-semibold truncate">Duration</p>
              <p className="text-xs text-[#1A1A18] mt-1 truncate" title={service.duration}>{service.duration}</p>
            </div>
          </div>
          <div className="flex items-start gap-2 overflow-hidden">
            <Activity className="text-[#0D5C4E] w-[18px] h-[18px] mt-0.5 shrink-0" />
            <div className="min-w-0 overflow-hidden">
              <p className="text-[10px] uppercase tracking-widest text-[#8A8A82] font-semibold truncate">Pain Level</p>
              <p className="text-xs text-[#1A1A18] mt-1 truncate" title={service.painLevel}>{service.painLevel}</p>
            </div>
          </div>
          <div className="flex items-start gap-2 overflow-hidden">
            <Calendar className="text-[#0D5C4E] w-[18px] h-[18px] mt-0.5 shrink-0" />
            <div className="min-w-0 overflow-hidden">
              <p className="text-[10px] uppercase tracking-widest text-[#8A8A82] font-semibold truncate">Recovery</p>
              <p className="text-xs text-[#1A1A18] mt-1 truncate" title={service.recovery}>{service.recovery}</p>
            </div>
          </div>
          <div className="flex items-start gap-2 overflow-hidden">
            <Cpu className="text-[#0D5C4E] w-[18px] h-[18px] mt-0.5 shrink-0" />
            <div className="min-w-0 overflow-hidden">
              <p className="text-[10px] uppercase tracking-widest text-[#8A8A82] font-semibold truncate">Tech</p>
              <p className="text-xs text-[#1A1A18] mt-1 truncate" title={service.technology}>{service.technology}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="relative z-10 mt-8">
        <Link
          to="/appointment"
          className="w-full flex items-center justify-center gap-2 bg-[#0D5C4E] text-white font-semibold h-[44px] rounded-[10px] hover:bg-[#1A7A68] transition-all duration-200"
        >
          Book Consultation
          <ArrowUpRight size={16} />
        </Link>
      </div>
    </motion.div>
  )
}

export default ServiceCard
