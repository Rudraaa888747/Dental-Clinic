import { Link } from 'react-router-dom'
import { Sparkles, MapPin, Phone, Mail } from 'lucide-react'

function Footer({ clinic }) {
  return (
    <footer className="border-t border-white/5 bg-navy-900 pt-24 pb-32 lg:pb-12 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-gold/50 to-transparent"></div>
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gold/5 blur-[100px] rounded-full"></div>
      
      <div className="page-shell relative z-10 grid gap-16 lg:grid-cols-[1.5fr_1fr_1.5fr]">
        <div>
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 border border-gold/20 text-gold shadow-lg transition-transform duration-500 group-hover:rotate-12">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="font-display text-2xl font-light tracking-wide text-white group-hover:text-gold transition-colors">
                {clinic.name}
              </p>
            </div>
          </Link>
          <p className="mt-6 max-w-sm text-sm leading-7 text-support-200 font-light">
            Redefining cosmetic dentistry through artistry, advanced robotics, and unparalleled comfort. Beverly Hills standards, delivered locally.
          </p>
          <div className="mt-8 flex gap-4">
             <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-support-200 hover:text-gold hover:bg-white/10 transition-colors border border-white/5 text-xs font-semibold tracking-widest">IG</a>
             <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-support-200 hover:text-gold hover:bg-white/10 transition-colors border border-white/5 text-xs font-semibold tracking-widest">FB</a>
             <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-support-200 hover:text-gold hover:bg-white/10 transition-colors border border-white/5 text-xs font-semibold tracking-widest">TW</a>
          </div>
        </div>
        
        <div>
          <h4 className="font-display text-sm font-medium uppercase tracking-widest text-white">
            Navigation
          </h4>
          <div className="mt-6 flex flex-col gap-4 text-sm text-support-200 font-light">
            <Link to="/services" className="hover:text-gold transition-colors">Treatments</Link>
            <Link to="/gallery" className="hover:text-gold transition-colors">Smile Gallery</Link>
            <Link to="/about" className="hover:text-gold transition-colors">The Clinic</Link>
            <Link to="/testimonials" className="hover:text-gold transition-colors">Patient Stories</Link>
            <Link to="/blog" className="hover:text-gold transition-colors">Journal</Link>
          </div>
        </div>
        
        <div>
          <h4 className="font-display text-sm font-medium uppercase tracking-widest text-white">
            Connect
          </h4>
          <div className="mt-6 space-y-4 text-sm text-support-200 font-light">
            <p className="flex items-start gap-3 group">
              <MapPin size={18} className="text-gold/70 mt-1 flex-shrink-0" />
              <span className="group-hover:text-white transition-colors">{clinic.address}</span>
            </p>
            <p className="flex items-center gap-3 group">
              <Phone size={18} className="text-gold/70 flex-shrink-0" />
              <span className="group-hover:text-white transition-colors">{clinic.phone}</span>
            </p>
            <p className="flex items-center gap-3 group">
              <Mail size={18} className="text-gold/70 flex-shrink-0" />
              <span className="group-hover:text-white transition-colors">{clinic.email}</span>
            </p>
          </div>
        </div>
      </div>
      
      <div className="page-shell relative z-10 mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-light text-support-300">
         <p>© {new Date().getFullYear()} {clinic.name}. All rights reserved.</p>
         <div className="flex gap-6">
            <Link to="/admin" className="hover:text-white transition-colors">Admin Access</Link>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
         </div>
      </div>
    </footer>
  )
}

export default Footer