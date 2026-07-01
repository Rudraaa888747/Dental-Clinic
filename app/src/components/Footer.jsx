import { Link } from 'react-router-dom'
import { Sparkles, MapPin, Phone, Mail } from 'lucide-react'

function Footer({ clinic }) {
  return (
    <footer className="border-t border-white/10 bg-[#083D35] pt-24 pb-32 lg:pb-12 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-teal-100/50 to-transparent"></div>
      
      <div className="page-shell relative z-10 grid gap-12 lg:gap-16 grid-cols-1 lg:grid-cols-[1.5fr_1fr_1.5fr]">
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left w-full">
          <Link to="/" className="flex items-center gap-3 group">
             <img src="/logo.jpg" alt="Azure Smile Logo" className="h-10 md:h-12 w-auto object-contain rounded-lg" />
             <div>
               <p className="font-display text-2xl font-light tracking-wide text-white group-hover:text-white transition-colors">
                 {clinic.name}
               </p>
             </div>
          </Link>
          <p className="mt-6 max-w-sm text-sm leading-7 text-white/70 font-light w-full">
            Redefining cosmetic dentistry through artistry, advanced robotics, and unparalleled comfort. Beverly Hills standards, delivered locally.
          </p>
          <div className="mt-8 flex gap-4 justify-center lg:justify-start w-full">
             <a href="#" className="w-11 h-11 lg:w-10 lg:h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors border border-white/15 text-xs font-semibold tracking-widest min-w-[44px] min-h-[44px]">IG</a>
             <a href="#" className="w-11 h-11 lg:w-10 lg:h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors border border-white/15 text-xs font-semibold tracking-widest min-w-[44px] min-h-[44px]">FB</a>
             <a href="#" className="w-11 h-11 lg:w-10 lg:h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors border border-white/15 text-xs font-semibold tracking-widest min-w-[44px] min-h-[44px]">TW</a>
          </div>
        </div>
        
        <div className="w-full text-left">
          <h4 className="font-display text-sm font-medium uppercase tracking-widest text-white">
            Navigation
          </h4>
          <div className="mt-6 flex flex-col gap-4 text-sm text-white/70 font-light">
            <Link to="/services" className="hover:text-white transition-colors py-1 min-h-[44px] flex items-center">Treatments</Link>
            <Link to="/gallery" className="hover:text-white transition-colors py-1 min-h-[44px] flex items-center">Smile Gallery</Link>
            <Link to="/about" className="hover:text-white transition-colors py-1 min-h-[44px] flex items-center">The Clinic</Link>
            <Link to="/testimonials" className="hover:text-white transition-colors py-1 min-h-[44px] flex items-center">Patient Stories</Link>
            <Link to="/blog" className="hover:text-white transition-colors py-1 min-h-[44px] flex items-center">Journal</Link>
            <Link to="/how-to-use" className="hover:text-white transition-colors py-1 min-h-[44px] flex items-center">Guide / How to Use</Link>
          </div>
        </div>
        
        <div className="w-full text-left">
          <h4 className="font-display text-sm font-medium uppercase tracking-widest text-white">
            Connect
          </h4>
          <div className="mt-6 space-y-4 text-sm text-white/70 font-light">
            <p className="flex items-start gap-3 group text-white/70 py-1">
              <MapPin size={18} className="text-white/50 mt-1 flex-shrink-0" />
              <span className="group-hover:text-white transition-colors">{clinic.address}</span>
            </p>
            <p className="flex items-center gap-3 group text-white/70 py-1">
              <Phone size={18} className="text-white/50 flex-shrink-0" />
              <span className="group-hover:text-white transition-colors">{clinic.phone}</span>
            </p>
            <p className="flex items-center gap-3 group text-white/70 py-1">
              <Mail size={18} className="text-white/50 flex-shrink-0" />
              <span className="group-hover:text-white transition-colors">{clinic.email}</span>
            </p>
          </div>
        </div>
      </div>
      
      <div className="page-shell relative z-10 mt-16 pt-8 border-t border-white/10 flex flex-col gap-8 text-xs font-light text-white/60">
         <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
           <p className="text-white/50">© {new Date().getFullYear()} {clinic.name}. All rights reserved.</p>
           <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center">
              <Link to="/admin" className="hover:text-white transition-colors py-1">Admin Access</Link>
              <a href="#" className="hover:text-white transition-colors py-1">Privacy Policy</a>
           </div>
         </div>
         <div className="flex justify-center items-center mb-8 lg:mb-0">
           <div className="px-4 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm shadow-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-default">
             <p className="flex items-center gap-2 uppercase tracking-[0.2em] text-[10px] text-white/70">
               <Sparkles size={12} className="text-white/60" />
               Made by <span className="text-white font-medium tracking-widest">Rudra Chokshi</span>
               <Sparkles size={12} className="text-white/60" />
             </p>
           </div>
         </div>
      </div>
    </footer>
  )
}

export default Footer