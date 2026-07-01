import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Sparkles, ShieldCheck, ArrowUpRight, Plus, Minus, X, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import AnimatedSection from '../components/AnimatedSection'
import BeforeAfterCard from '../components/BeforeAfterCard'
import SectionHeading from '../components/SectionHeading'
import ServiceCard from '../components/ServiceCard'
import TestimonialSlider from '../components/TestimonialSlider'
import { api } from '../lib/api'

// Hook for simple scroll reveal
function useScrollReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )
    /* Fix: Capture ref.current in variable for stable cleanup */
    const node = ref.current
    if (node) observer.observe(node)
    return () => {
      if (node) observer.unobserve(node)
    }
  }, [])
  return ref
}

function Reveal({ children, className = '', delay = 0 }) {
  const ref = useScrollReveal()
  return (
    <div ref={ref} className={`reveal-up ${className}`} style={{ transitionDelay: `${delay}s` }}>
      {children}
    </div>
  )
}

const costData = {
  'Teeth Cleaning': { base: [800, 1500], perTooth: false },
  'Dental Filling': { base: [500, 3000], perTooth: true },
  'Root Canal': { base: [3000, 8000], perTooth: true },
  'Wisdom Tooth Removal': { base: [2000, 8000], perTooth: true },
  'Teeth Whitening': { base: [5000, 15000], perTooth: false },
  'Porcelain Veneers': { base: [8000, 20000], perTooth: true },
  'Smile Makeover': { base: [50000, 200000], perTooth: false },
  'Ceramic Braces': { base: [25000, 80000], perTooth: false },
  'Invisible Aligners': { base: [60000, 150000], perTooth: false },
  'Dental Implants': { base: [25000, 60000], perTooth: true },
}

const faqs = [
  { category: 'Treatments', q: 'Is root canal treatment painful?', a: 'Modern root canal treatment is virtually painless. We use advanced local anesthesia and gentle techniques — most patients report less discomfort than a routine filling.' },
  { category: 'Treatments', q: 'How long do dental implants last?', a: 'With proper care, dental implants can last a lifetime. The crown portion typically lasts 15-20 years before replacement may be needed.' },
  { category: 'Treatments', q: 'What is the difference between ceramic braces and invisible aligners?', a: 'Ceramic braces are fixed and slightly visible but work for complex cases. Invisible aligners (like Invisalign) are removable, virtually invisible, and ideal for mild to moderate corrections.' },
  { category: 'Pricing', q: 'Do you offer EMI or payment plans?', a: 'Yes, we offer zero-cost EMI starting from ₹999/month through major banks and NBFCs. No credit card required for select plans.' },
  { category: 'Pricing', q: 'Is the first consultation free?', a: 'Yes, your initial consultation with Dr. Aanya Mehra is completely free. This includes a basic oral examination and treatment recommendation.' },
  { category: 'Pricing', q: 'Are the prices shown on the website final?', a: 'The prices shown are indicative ranges. Final treatment cost is determined after a clinical examination as complexity varies per patient.' },
  { category: 'Process', q: 'How do I book an appointment?', a: 'You can book through our website, WhatsApp us directly, or call our clinic. Online bookings are confirmed within 30 minutes during clinic hours.' },
  { category: 'Process', q: 'What should I bring to my first appointment?', a: 'Any previous dental X-rays or records (if available), a valid ID, and your insurance card if applicable. No other preparation needed.' },
  { category: 'Process', q: 'How long does a typical appointment take?', a: 'A routine cleaning takes 45-60 minutes. Complex procedures like implants or braces fitting may take 90-120 minutes. We\'ll inform you in advance.' },
  { category: 'Aftercare', q: 'What should I avoid after teeth whitening?', a: 'Avoid colored foods and beverages (coffee, tea, red wine, curries) for 48 hours post-treatment. Use the sensitivity toothpaste provided.' },
  { category: 'Aftercare', q: 'How do I care for dental implants?', a: 'Treat them like natural teeth — brush twice daily, floss regularly, and attend 6-monthly checkups. Avoid very hard foods in the first 3 months.' },
  { category: 'Aftercare', q: 'When can I eat normally after a root canal?', a: 'Wait until the anesthesia wears off (usually 2-3 hours). Avoid very hard or chewy foods for 2-3 days. Normal eating can resume after the final crown is placed.' },
]

function TreatmentIcon({ treatmentName }) {
  const props = { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" }
  switch(treatmentName) {
    case 'Teeth Cleaning': return <Sparkles {...props} />
    case 'Dental Filling': return <svg {...props}><path d="M7 4c-2 0-3 2-3 4 0 2 1.5 3 2.5 5.5.5 1.5.5 3.5 1 5.5.5 2 2.5 2 3.5 1 1-1 1-3 1-3s0 2 1 3c1 1 3 1 3.5-1 .5-2 .5-4 1-5.5C18.5 11 20 10 20 8c0-2-1-4-3-4-1 0-2 .5-2 1.5 0-1-1-1.5-2-1.5s-2 .5-2 1.5C9 4.5 8 4 7 4z"/><path d="M12 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" fill="currentColor"/></svg>
    case 'Root Canal': return <svg {...props}><path d="M7 4c-2 0-3 2-3 4 0 2 1.5 3 2.5 5.5.5 1.5.5 3.5 1 5.5.5 2 2.5 2 3.5 1 1-1 1-3 1-3s0 2 1 3c1 1 3 1 3.5-1 .5-2 .5-4 1-5.5C18.5 11 20 10 20 8c0-2-1-4-3-4-1 0-2 .5-2 1.5 0-1-1-1.5-2-1.5s-2 .5-2 1.5C9 4.5 8 4 7 4z"/><path d="M9 11l1 4M15 11l-1 4"/></svg>
    case 'Wisdom Tooth Removal': return <svg {...props}><path d="M7 4c-2 0-3 2-3 4 0 2 1.5 3 2.5 5.5.5 1.5.5 3.5 1 5.5.5 2 2.5 2 3.5 1 1-1 1-3 1-3s0 2 1 3c1 1 3 1 3.5-1 .5-2 .5-4 1-5.5C18.5 11 20 10 20 8c0-2-1-4-3-4-1 0-2 .5-2 1.5 0-1-1-1.5-2-1.5s-2 .5-2 1.5C9 4.5 8 4 7 4z"/><line x1="4" y1="4" x2="20" y2="20"/><line x1="20" y1="4" x2="4" y2="20"/></svg>
    case 'Teeth Whitening': return <svg {...props}><path d="M7 4c-2 0-3 2-3 4 0 2 1.5 3 2.5 5.5.5 1.5.5 3.5 1 5.5.5 2 2.5 2 3.5 1 1-1 1-3 1-3s0 2 1 3c1 1 3 1 3.5-1 .5-2 .5-4 1-5.5C18.5 11 20 10 20 8c0-2-1-4-3-4-1 0-2 .5-2 1.5 0-1-1-1.5-2-1.5s-2 .5-2 1.5C9 4.5 8 4 7 4z"/><path d="M14 6l1-2 1 2 2 1-2 1-1 2-1-2-2-1z" fill="currentColor"/></svg>
    case 'Porcelain Veneers': return <svg {...props}><path d="M7 4c-2 0-3 2-3 4 0 2 1.5 3 2.5 5.5.5 1.5.5 3.5 1 5.5.5 2 2.5 2 3.5 1 1-1 1-3 1-3s0 2 1 3c1 1 3 1 3.5-1 .5-2 .5-4 1-5.5C18.5 11 20 10 20 8c0-2-1-4-3-4-1 0-2 .5-2 1.5 0-1-1-1.5-2-1.5s-2 .5-2 1.5C9 4.5 8 4 7 4z"/><path d="M7 4c2 2 3 5 3 8" strokeDasharray="2 2"/></svg>
    case 'Smile Makeover': return <svg {...props}><path d="M4 10c2.5 4 8 6 16 0"/><path d="M6 14c2.5 3 7 4 12 0"/></svg>
    case 'Ceramic Braces': return <svg {...props}><path d="M4 12h16M7 9v6M12 9v6M17 9v6"/><rect x="6" y="10" width="2" height="4" fill="currentColor"/><rect x="11" y="10" width="2" height="4" fill="currentColor"/><rect x="16" y="10" width="2" height="4" fill="currentColor"/></svg>
    case 'Invisible Aligners': return <svg {...props}><path d="M3 14s2 3 9 3 9-3 9-3M4 10s2-2 8-2 8 2 8 2"/><path d="M4 10v4M12 8v9M20 10v4" strokeDasharray="2 2"/></svg>
    case 'Dental Implants': return <svg {...props}><path d="M7 4c-2 0-3 2-3 4 0 2 1.5 3 2.5 5.5M17 4c2 0 3 2 3 4 0 2-1.5 3-2.5 5.5M12 11v11M10 14h4M10 17h4M10 20h4M9 11h6"/></svg>
    default: return <Sparkles {...props} />
  }
}

function CostCalculator() {
  const [treatment, setTreatment] = useState('Teeth Cleaning')
  const [complexity, setComplexity] = useState('Simple')
  const [teeth, setTeeth] = useState(1)
  const [priceRange, setPriceRange] = useState([0, 0])
  const [pulse, setPulse] = useState(false)

  const mults = { Simple: 1, Moderate: 1.5, Complex: 2 }

  useEffect(() => {
    const data = costData[treatment]
    const m = mults[complexity]
    const count = data.perTooth ? teeth : 1
    setPriceRange([
      Math.round(data.base[0] * m * count),
      Math.round(data.base[1] * m * count)
    ])
    setPulse(true)
    const t = setTimeout(() => setPulse(false), 300)
    return () => clearTimeout(t)
  }, [treatment, complexity, teeth])

  return (
    <div className="bg-white border-l-[3px] border-l-accent rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[80px] rounded-full pointer-events-none" />
      <h3 className="font-display text-2xl font-semibold mb-8 text-charcoal">Estimate Your Treatment Cost</h3>
      
      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-10">
        <div className="space-y-8">
          <div>
            <p className="text-sm font-semibold text-muted mb-4 uppercase tracking-widest">1. Select Treatment</p>
            <div className="grid grid-cols-2 md:flex md:flex-wrap gap-2 w-full">
              {Object.keys(costData).map(t => (
                <button 
                  key={t}
                  onClick={() => { setTreatment(t); setTeeth(1) }}
                  className={`px-3 py-2 md:px-4 rounded-xl md:rounded-full text-[0.8rem] md:text-sm font-medium transition-all ${
                    treatment === t 
                      ? 'bg-accent text-white border border-transparent' 
                      : 'bg-accent-light text-accent border border-transparent hover:bg-accent-light/80'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-muted mb-4 uppercase tracking-widest">2. Case Complexity</p>
            <div className="grid grid-cols-3 md:flex gap-2 bg-accent-light p-1 rounded-xl w-full md:w-fit">
              {['Simple', 'Moderate', 'Complex'].map(c => (
                <button
                  key={c}
                  onClick={() => setComplexity(c)}
                  className={`px-2 md:px-6 py-2 rounded-lg text-[0.8rem] md:text-sm font-medium transition-all text-center ${
                    complexity === c ? 'bg-accent text-white shadow-sm' : 'text-accent hover:text-accent-mid'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {costData[treatment].perTooth && (
            <div>
              <p className="text-sm font-semibold text-muted mb-4 uppercase tracking-widest">3. Number of Teeth</p>
              <div className="flex items-center justify-between md:justify-start gap-4 bg-accent-light w-full md:w-fit rounded-xl p-1">
                <button onClick={() => setTeeth(Math.max(1, teeth - 1))} className="p-3 min-w-[44px] min-h-[44px] flex items-center justify-center text-accent hover:bg-white/40 rounded-lg transition-colors"><Minus size={18} /></button>
                <span className="w-8 text-center font-semibold text-accent">{teeth}</span>
                <button onClick={() => setTeeth(teeth + 1)} className="p-3 min-w-[44px] min-h-[44px] flex items-center justify-center text-accent hover:bg-white/40 rounded-lg transition-colors"><Plus size={18} /></button>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center">
          <div className={`bg-accent-light border border-border rounded-2xl p-6 md:p-8 text-center transition-transform duration-300 w-full ${pulse ? 'scale-[1.02]' : 'scale-100'}`}>
            <p className="text-sm text-muted uppercase tracking-widest font-semibold mb-2">Estimated Range</p>
            <div className="font-display text-[2rem] md:text-3xl lg:text-4xl font-bold text-accent mb-2">
              ₹{priceRange[0].toLocaleString('en-IN')} – ₹{priceRange[1].toLocaleString('en-IN')}
            </div>
            <p className="text-sm text-muted font-medium mb-8">
              EMI from ₹{Math.round(priceRange[1]/24).toLocaleString('en-IN')}/month
            </p>
            <Link to="/appointment" className="btn-primary w-full inline-block mb-4">Book Free Consultation</Link>
            <p className="text-[10px] text-muted leading-relaxed">*Actual cost may vary. Final pricing determined after clinical examination.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function FAQSection() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [openIndex, setOpenIndex] = useState(null)
  
  const categories = ['All', 'Treatments', 'Pricing', 'Process', 'Aftercare']
  const filteredFaqs = activeCategory === 'All' ? faqs : faqs.filter(f => f.category === activeCategory)

  return (
    <div className="grid lg:grid-cols-[1fr_2fr] gap-12 lg:gap-20">
      <div>
        <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4 text-charcoal">Frequently Asked Questions</h2>
        <p className="text-muted mb-8">Find answers to common questions about our treatments, pricing, and processes.</p>
        <div className="flex overflow-x-auto hide-scrollbar flex-nowrap pb-2 gap-2">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => { setActiveCategory(c); setOpenIndex(null) }}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
                activeCategory === c ? 'bg-accent text-white shadow-md' : 'bg-white border border-border text-muted hover:bg-surface-2'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredFaqs.map((faq, i) => {
          const isOpen = openIndex === i
          return (
            <div 
              key={i} 
              className={`bg-white rounded-2xl overflow-hidden transition-all duration-300 border ${isOpen ? 'bg-accent-light border-accent border-l-[3px]' : 'border-border'}`}
            >
              <button 
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full px-4 md:px-6 py-4 md:py-5 flex items-center justify-between text-left min-h-[56px]"
              >
                <span className={`font-semibold pr-4 text-[0.95rem] md:text-base ${isOpen ? 'text-charcoal' : 'text-charcoal'}`}>{faq.q}</span>
                <Plus size={20} className={`text-accent shrink-0 transition-transform duration-350 ${isOpen ? 'rotate-45' : ''}`} />
              </button>
              <div 
                className="overflow-hidden transition-all duration-350 ease-in-out"
                style={{ maxHeight: isOpen ? '1000px' : '0' }}
              >
                <p className="px-4 md:px-6 pb-4 md:pb-6 text-charcoal-200 leading-relaxed pt-2 text-[0.875rem] md:text-base">{faq.a}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function HomePage({ content }) {
  const [slot, setSlot] = useState(null)
  
  useEffect(() => {
    api.getNextSlot().then(setSlot).catch(() => {})
  }, [])

  return (
    <>
      <section className="relative overflow-hidden min-h-[92vh] flex items-center bg-ivory pt-24 lg:pt-32 pb-16 lg:pb-0">
        <div className="absolute inset-0 bg-ivory" />
        <div className="absolute top-0 right-0 w-1/2 h-[600px] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent blur-[80px] pointer-events-none" />
        
        <div className="page-shell relative z-10 flex flex-col lg:grid lg:gap-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center gap-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-center max-w-2xl mt-8 sm:mt-0 text-center lg:text-left mx-auto lg:mx-0 items-center lg:items-start"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="section-label mb-8"
            >
              <Sparkles size={14} className="text-accent animate-pulse mr-2" />
              Beverly Hills Standard
            </motion.div>
            
            <h1 className="text-charcoal mb-8 text-[clamp(2.2rem,8vw,3rem)] lg:text-[clamp(2.8rem,6vw,5rem)]">
              World-Class <br className="hidden sm:block" />
              Dentistry, <br className="hidden sm:block" />
              <span className="text-accent font-medium italic pr-4">
                Redefined.
              </span>
            </h1>
            
            <p className="text-lg lg:text-xl leading-relaxed text-charcoal-200 font-light max-w-[42ch] mb-12">
              Experience the pinnacle of aesthetic dentistry. We combine ultra-premium comfort, advanced robotics, and bespoke smile design for transformations that feel effortless.
            </p>
            
            <div className="flex flex-col lg:flex-row items-center gap-3 lg:gap-6 w-full lg:w-auto">
              <Link to="/appointment" className="btn-primary group relative overflow-hidden w-full lg:w-auto flex justify-center items-center gap-3">
                <span className="relative z-10">Book Consultation</span>
                <ArrowUpRight size={18} className="relative z-10 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
              </Link>
              
              {slot && (
                <Link to="/appointment" className="flex items-center justify-center gap-3 bg-white border border-border rounded-full px-4 py-2 shadow-card hover:border-accent transition-colors w-full lg:w-auto mt-2 lg:mt-0">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse shrink-0" />
                  <div className="text-left flex-1 lg:flex-none">
                    <p className="text-xs font-semibold text-charcoal whitespace-nowrap text-center lg:text-left">Next available: {slot.nextSlot}</p>
                    <p className="text-[10px] text-muted text-center lg:text-left">{slot.spotsLeft} spots left today</p>
                  </div>
                </Link>
              )}
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="mt-16 pt-8 pb-8 border-t border-border flex flex-col sm:flex-row sm:items-center gap-6"
            >
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <img key={i} className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-soft" src={`https://randomuser.me/api/portraits/women/${30+i}.jpg`} alt="Patient" loading="lazy" width="48" height="48" />
                ))}
              </div>
              <div>
                <div className="flex text-gold gap-1 mb-1">
                  {'★★★★★'.split('').map((star, i) => <span key={i} className="drop-shadow-[0_0_4px_rgba(201,168,76,0.3)]">{star}</span>)}
                </div>
                <p className="text-xs text-muted uppercase tracking-widest font-medium">Over 1,000+ Perfect Smiles</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="relative h-[300px] md:h-[450px] lg:h-[700px] w-full mt-0 lg:mt-0 flex-none"
          >
            <div className="relative w-full h-full rounded-[16px] lg:rounded-[40px] shadow-lifted">
              <div className="absolute inset-0 rounded-[16px] lg:rounded-[40px] overflow-hidden border border-border bg-ivory">
                <div className="absolute inset-0 bg-transparent z-10 pointer-events-none opacity-80 hidden lg:block"></div>
                <img
                  src="/hero.webp"
                  srcSet="/hero-small.webp 640w, /hero-medium.webp 1024w, /hero.webp 1920w"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
                  alt="Luxury Dental Care"
                  width="1920"
                  height="1080"
                  loading="eager"
                  fetchpriority="high"
                  className="w-full h-full object-cover lg:scale-[1.02] hover:scale-105 transition-transform duration-[12s] ease-out will-change-transform"
                />
              </div>
              
              <motion.div 
                className="absolute top-10 -left-4 sm:-left-8 lg:-left-12 rounded-[24px] bg-white border border-border p-4 hidden sm:flex items-center gap-4 shadow-lifted z-20"
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="w-12 h-12 rounded-full bg-accent-light flex items-center justify-center border border-accent/20">
                  <ShieldCheck size={22} className="text-accent" />
                </div>
                <div className="pr-4">
                  <p className="text-[10px] text-muted uppercase tracking-widest font-semibold mb-0.5">Technology</p>
                  <p className="text-sm font-medium text-charcoal whitespace-nowrap">3D Digital Scanning</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <AnimatedSection className="section-space bg-surface-2 border-t border-border">
        <div className="page-shell">
          <SectionHeading
            eyebrow="Signature Aesthetics"
            title="Masterpieces in modern dentistry."
            description="Our curated treatments are designed to elevate your confidence. No compromises, just exceptional precision."
          />
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.services.map((service, index) => (
              <Reveal key={service.id} delay={index * 0.1}>
                <div className="group h-auto bg-white border border-border rounded-3xl p-4 lg:p-6 transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.01] hover:border-accent hover:shadow-teal shadow-soft">
                   <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-accent-light flex items-center justify-center text-accent mb-4 lg:mb-6"><TreatmentIcon treatmentName={service.name} /></div>
                   <h3 className="text-[1rem] lg:text-lg font-semibold text-charcoal mb-2 lg:mb-3">{service.name}</h3>
                   <p className="text-[0.875rem] lg:text-sm text-charcoal-200 leading-relaxed mb-4 lg:mb-6">{service.description}</p>
                   <Link to="/services" className="text-sm font-semibold text-accent hover:text-accent-mid inline-flex items-center gap-2 uppercase tracking-wider mt-auto group-hover:gap-3 transition-all visible">Explore <ArrowRight size={16} /></Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="section-space bg-ivory">
        <div className="page-shell">
          <Reveal>
            <CostCalculator />
          </Reveal>
        </div>
      </AnimatedSection>

      <AnimatedSection className="section-space relative overflow-hidden bg-surface-2">
        <div className="absolute inset-0 bg-glass-gradient opacity-5" />
        <div className="page-shell relative z-10 flex flex-col lg:grid lg:gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center gap-10">
          <Reveal delay={0.1}>
            <div className="relative">
               <div className="absolute -left-12 -top-12 w-64 h-64 bg-accent/5 blur-[80px] rounded-full"></div>
               <motion.div className="bg-white border border-border rounded-[24px] lg:rounded-[40px] p-3 shadow-lifted relative z-10 overflow-hidden group">
                 <img
                   src={content.doctor.image}
                   alt={content.doctor.name}
                   width="800"
                   height="1200"
                   loading="lazy"
                   className="h-[320px] lg:h-[600px] w-full rounded-[16px] lg:rounded-[32px] object-cover transition-transform duration-700 group-hover:scale-105"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent opacity-80 rounded-[16px] lg:rounded-[32px]"></div>
                 <div className="absolute bottom-6 left-6 right-6 lg:bottom-8 lg:left-8 lg:right-8">
                   <p className="font-display text-xl lg:text-2xl font-light text-white mb-1 lg:mb-2 text-left">{content.doctor.name}</p>
                   <p className="text-accent-light uppercase tracking-[0.2em] text-[10px] lg:text-xs font-semibold text-left">Lead Cosmetic Architect</p>
                 </div>
               </motion.div>
            </div>
          </Reveal>
          <Reveal delay={0.2} className="text-left">
            <div>
              <SectionHeading
                eyebrow="The Architect"
                title="Where precision meets artistic vision."
                description={content.doctor.bio}
              />
              <div className="mt-8 lg:mt-10 flex flex-wrap gap-3">
                {content.doctor.qualifications.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 lg:gap-4 bg-accent-light border border-accent/10 px-4 lg:px-6 py-3 lg:py-4 rounded-xl lg:rounded-2xl group transition-colors hover:border-accent/30 flex-1 md:flex-none min-w-[200px]"
                  >
                    <Sparkles className="text-accent flex-shrink-0" size={16} />
                    <span className="text-[0.85rem] lg:text-sm font-medium text-accent">{item}</span>
                  </div>
                ))}
              </div>
              <Link
                to="/about"
                className="mt-8 lg:mt-12 inline-flex items-center gap-3 text-sm font-medium text-accent hover:text-accent-mid transition-colors group"
              >
                <span className="uppercase tracking-wider">Discover the philosophy</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-2" />
              </Link>
            </div>
          </Reveal>
        </div>
      </AnimatedSection>

      <AnimatedSection className="section-space bg-surface-2 border-t border-border">
        <div className="page-shell grid gap-16 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <SectionHeading
              eyebrow="Smile Transformations"
              title="Results that speak in volumes of confidence."
              description="Slide to witness the dramatic, natural-looking results achieved through our premium cosmetic protocols."
            />
          </Reveal>
          <Reveal delay={0.2} className="w-full relative">
            <div className="absolute -inset-4 bg-accent/5 blur-[40px] rounded-full"></div>
            <BeforeAfterCard item={content.gallery[0]} />
          </Reveal>
        </div>
      </AnimatedSection>

      <AnimatedSection className="section-space overflow-hidden bg-surface-2">
        <div className="page-shell relative z-10">
          <Reveal className="mx-auto max-w-3xl text-center">
            <SectionHeading
              eyebrow="Patient Stories"
              title="Told by those who experienced the difference."
              description="Read the genuine experiences of patients who transformed their smiles in our care."
              align="center"
            />
          </Reveal>
        </div>
        <Reveal delay={0.2} className="mt-16 w-full relative z-10">
          <TestimonialSlider testimonials={content.testimonials} />
        </Reveal>
      </AnimatedSection>
      
      <AnimatedSection className="section-space bg-ivory">
        <div className="page-shell">
          <Reveal>
            <FAQSection />
          </Reveal>
        </div>
      </AnimatedSection>

      <AnimatedSection className="py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-accent"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-transparent opacity-10 mix-blend-overlay"></div>
        <Reveal className="page-shell relative z-10 text-center">
           <h2 className="font-display text-[clamp(1.8rem,6vw,2.5rem)] md:text-5xl lg:text-6xl font-light text-white max-w-3xl mx-auto leading-tight text-center">
             Ready to experience <br className="hidden md:block" /><span className="font-medium">true dental luxury?</span>
           </h2>
           <p className="mt-6 text-white/80 text-[1rem] lg:text-lg max-w-xl mx-auto font-medium text-center">
             Begin your journey to a flawless smile. Book your private consultation today.
           </p>
           <div className="mt-10 lg:mt-12 flex justify-center w-full px-4 md:px-0">
            <Link
              to="/appointment"
              className="inline-flex items-center justify-center rounded-full bg-ivory px-6 lg:px-10 py-4 lg:py-5 text-[0.95rem] font-semibold text-accent shadow-2xl transition-all duration-200 hover:bg-white hover:scale-105 active:scale-97 uppercase tracking-widest w-full md:w-auto"
            >
              Schedule Consultation
            </Link>
           </div>
        </Reveal>
      </AnimatedSection>
    </>
  )
}

export default HomePage
