import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, ShieldCheck, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import AnimatedSection from '../components/AnimatedSection'
import BeforeAfterCard from '../components/BeforeAfterCard'
import SectionHeading from '../components/SectionHeading'
import ServiceCard from '../components/ServiceCard'
import TestimonialSlider from '../components/TestimonialSlider'
import TrustBar from '../components/TrustBar'

function HomePage({ content }) {
  return (
    <>
      <section className="relative overflow-hidden min-h-[92vh] flex items-center bg-[#020817] pt-24 lg:pt-32 pb-16 lg:pb-0">
        {/* Cinematic Background Elements */}
        <div className="absolute inset-0 bg-hero-glow opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020817]/40 via-transparent to-[#020817]" />
        
        {/* Layered Lighting */}
        <div className="absolute top-0 right-0 w-full h-[800px] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold/15 via-[#020817]/5 to-transparent blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-support-300/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Ambient Particles / Dust (Simulated via SVG texture) */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.03] mix-blend-screen pointer-events-none" />
        
        <div className="page-shell relative z-10 grid gap-12 lg:gap-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-center max-w-2xl"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="inline-flex items-center gap-3 rounded-full border border-gold/20 bg-[#0F172A]/80 px-4 py-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-gold shadow-[0_0_20px_rgba(212,175,55,0.1)] backdrop-blur-xl mb-8 w-fit"
            >
              <Sparkles size={14} className="text-gold animate-pulse" />
              Beverly Hills Standard
            </motion.div>
            
            <h1 className="font-display text-[3.25rem] sm:text-6xl lg:text-[5.5rem] leading-[1] tracking-tight text-white mb-8">
              World-Class <br />
              Dentistry, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-gold-dark font-medium italic pr-4">
                Redefined.
              </span>
            </h1>
            
            <p className="text-lg lg:text-xl leading-relaxed text-support-200 font-light max-w-[42ch] mb-12">
              Experience the pinnacle of aesthetic dentistry. We combine ultra-premium comfort, advanced robotics, and bespoke smile design for transformations that feel effortless.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Link
                to="/appointment"
                className="group relative inline-flex w-full sm:w-auto items-center justify-center gap-3 overflow-hidden rounded-full bg-gold px-10 py-5 text-sm font-semibold text-navy transition-all duration-500 hover:bg-gold-light hover:scale-[1.02] shadow-[0_0_40px_rgba(212,175,55,0.3)] hover:shadow-[0_0_60px_rgba(212,175,55,0.4)]"
              >
                <span className="relative z-10 tracking-widest uppercase">Book Consultation</span>
                <ArrowUpRight size={18} className="relative z-10 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
              </Link>
              
              <a
                href={`https://wa.me/${content.clinic.phone.replace(/\D/g, '')}`}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-3 rounded-full border border-white/20 bg-white/5 px-8 py-5 text-sm font-medium text-white transition-all duration-500 hover:bg-white/10 hover:border-white/40 backdrop-blur-md uppercase tracking-widest"
              >
                WhatsApp
              </a>
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="mt-16 pt-8 pb-8 border-t border-white/10 flex flex-col sm:flex-row sm:items-center gap-6"
            >
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <img key={i} className="w-12 h-12 rounded-full border-2 border-[#020817] object-cover shadow-lg" src={`https://randomuser.me/api/portraits/women/${30+i}.jpg`} alt="Patient" />
                ))}
              </div>
              <div>
                <div className="flex text-gold gap-1 mb-1">
                  {'★★★★★'.split('').map((star, i) => <span key={i} className="drop-shadow-[0_0_4px_rgba(212,175,55,0.5)]">{star}</span>)}
                </div>
                <p className="text-xs text-support-200 uppercase tracking-widest font-medium">Over 1,000+ Perfect Smiles</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="relative h-[550px] sm:h-[600px] lg:h-[700px] w-full mt-12 lg:mt-0"
          >
            <div className="relative w-full h-full rounded-[32px] lg:rounded-[40px] shadow-[0_30px_100px_rgba(0,0,0,0.6)]">
              {/* Image Container with elegant masking */}
              <div className="absolute inset-0 rounded-[32px] lg:rounded-[40px] overflow-hidden border border-white/10 bg-[#0F172A]">
                <div className="absolute inset-0 bg-[#020817]/20 mix-blend-overlay z-10 pointer-events-none"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#020817] via-transparent to-transparent z-10 pointer-events-none opacity-80"></div>
                <img
                  src="/hero.png"
                  alt="Luxury Dental Care"
                  className="w-full h-full object-cover scale-[1.02] hover:scale-105 transition-transform duration-[20s] ease-linear"
                />
              </div>
              
              {/* Floating Element 1 - Top Left */}
              <motion.div 
                className="absolute top-10 -left-4 sm:-left-8 lg:-left-12 rounded-[24px] bg-white/5 border border-white/10 backdrop-blur-2xl p-4 flex items-center gap-4 shadow-2xl z-20"
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center border border-gold/30 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                  <ShieldCheck size={22} className="text-gold" />
                </div>
                <div className="pr-4">
                  <p className="text-[10px] text-support-300 uppercase tracking-widest font-semibold mb-0.5">Technology</p>
                  <p className="text-sm font-medium text-white whitespace-nowrap">3D Digital Scanning</p>
                </div>
              </motion.div>


            </div>
          </motion.div>
        </div>
      </section>

      <AnimatedSection className="section-space bg-navy-900 border-t border-white/5">
        <div className="page-shell">
          <SectionHeading
            eyebrow="Signature Aesthetics"
            title="Masterpieces in modern dentistry."
            description="Our curated treatments are designed to elevate your confidence. No compromises, just exceptional precision."
          />
          <div className="mt-16 flex overflow-x-auto lg:grid lg:grid-cols-4 gap-6 pb-8 -mx-4 px-4 lg:mx-0 lg:px-0 lg:pb-0 custom-scrollbar snap-x snap-mandatory">
            {content.services.map((service) => (
              <div key={service.id} className="w-[85vw] max-w-[340px] sm:w-[320px] lg:w-auto lg:min-w-0 snap-start flex-shrink-0 flex">
                <ServiceCard service={service} />
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="section-space relative overflow-hidden">
        <div className="absolute inset-0 bg-navy" />
        <div className="absolute inset-0 bg-glass-gradient opacity-10" />
        <div className="page-shell relative z-10 grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="relative">
             <div className="absolute -left-12 -top-12 w-64 h-64 bg-gold/10 blur-[80px] rounded-full"></div>
             <motion.div className="glass-panel-dark rounded-[40px] p-3 shadow-2xl relative z-10 overflow-hidden group">
               <img
                 src={content.doctor.image}
                 alt={content.doctor.name}
                 className="h-[450px] lg:h-[600px] w-full rounded-[32px] object-cover transition-transform duration-700 group-hover:scale-105"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-transparent opacity-80 rounded-[32px]"></div>
               <div className="absolute bottom-8 left-8 right-8">
                 <p className="font-display text-2xl font-light text-white mb-2">{content.doctor.name}</p>
                 <p className="text-gold uppercase tracking-[0.2em] text-xs font-semibold">Lead Cosmetic Architect</p>
               </div>
             </motion.div>
          </div>
          <div>
            <SectionHeading
              eyebrow="The Architect"
              title="Where precision meets artistic vision."
              description={content.doctor.bio}
            />
            <div className="mt-10 space-y-4">
              {content.doctor.qualifications.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-4 glass-panel-dark px-6 py-4 rounded-2xl group transition-colors hover:bg-white/10"
                >
                  <Sparkles className="text-gold flex-shrink-0" size={18} />
                  <span className="text-sm font-light text-support-100 group-hover:text-white transition-colors">{item}</span>
                </div>
              ))}
            </div>
            <Link
              to="/about"
              className="mt-12 inline-flex items-center gap-3 text-sm font-medium text-gold hover:text-gold-light transition-colors group"
            >
              <span className="uppercase tracking-wider">Discover the philosophy</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-2" />
            </Link>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="section-space bg-navy-800">
        <div className="page-shell grid gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Smile Transformations"
              title="Results that speak in volumes of confidence."
              description="Slide to witness the dramatic, natural-looking results achieved through our premium cosmetic protocols."
            />
          </div>
          <div className="w-full relative">
            <div className="absolute -inset-4 bg-gold/5 blur-[40px] rounded-full"></div>
            <BeforeAfterCard item={content.gallery[0]} />
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="section-space overflow-hidden bg-navy">
        <div className="page-shell relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <SectionHeading
              eyebrow="Patient Stories"
              title="Told by those who experienced the difference."
              description="Read the genuine experiences of patients who transformed their smiles in our care."
              align="center"
            />
          </div>
        </div>
        <div className="mt-16 w-full relative z-10">
          <TestimonialSlider testimonials={content.testimonials} />
        </div>
      </AnimatedSection>

      <AnimatedSection className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gold"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-overlay"></div>
        <div className="page-shell relative z-10 text-center">
           <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light text-navy max-w-3xl mx-auto leading-tight">
             Ready to experience <br/><span className="font-medium">true dental luxury?</span>
           </h2>
           <p className="mt-6 text-navy/80 text-lg max-w-xl mx-auto font-medium">
             Begin your journey to a flawless smile. Book your private consultation today.
           </p>
           <div className="mt-12 flex justify-center">
            <Link
              to="/appointment"
              className="inline-flex items-center justify-center rounded-full bg-navy px-10 py-5 text-sm font-semibold text-white shadow-2xl transition hover:bg-navy-800 hover:scale-105 uppercase tracking-widest"
            >
              Schedule Consultation
            </Link>
           </div>
        </div>
      </AnimatedSection>
    </>
  )
}

export default HomePage
