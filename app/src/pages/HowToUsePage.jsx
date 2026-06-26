import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  ArrowRight, 
  ShieldCheck, 
  Calendar, 
  CreditCard, 
  Users, 
  Star, 
  Settings,
  Activity,
  HeartPulse,
  MonitorSmartphone,
  ChevronDown,
  Info
} from 'lucide-react'
import { useState } from 'react'
import AnimatedSection from '../components/AnimatedSection'
import SectionHeading from '../components/SectionHeading'

const timelineSteps = [
  { title: 'Visit Website', desc: 'Explore treatments and doctors.', icon: MonitorSmartphone },
  { title: 'Book Appointment', desc: 'Select your preferred date & time.', icon: Calendar },
  { title: 'Request Submitted', desc: 'Your details securely reach the clinic.', icon: ShieldCheck },
  { title: 'Admin Review', desc: 'Clinic reviews and confirms your slot.', icon: Activity },
  { title: 'Status Update', desc: 'You receive confirmation of your booking.', icon: Info },
  { title: 'Visit Clinic', desc: 'Experience premium dental care.', icon: HeartPulse },
  { title: 'Treatment Completed', desc: 'Follow-ups and EMI billing managed automatically.', icon: CreditCard }
]

const adminFeatures = [
  { title: 'Dashboard Telemetry', desc: 'Real-time metrics on appointments, revenue, and active patients.', icon: Activity },
  { title: 'Appointment Pipeline', desc: 'Manage pending, confirmed, and completed appointments seamlessly.', icon: Calendar },
  { title: 'Patient Records', desc: 'Detailed medical histories, allergies, and consultation notes.', icon: Users },
  { title: 'Billing & EMI', desc: 'Generate invoices, track partial payments, and manage EMI plans.', icon: CreditCard },
  { title: 'Review Moderation', desc: 'Monitor and publish patient testimonials directly to the website.', icon: Star },
  { title: 'Demo Mode Protection', desc: 'Experience the UI without modifying core production data.', icon: ShieldCheck }
]

const faqs = [
  { q: 'How do I book an appointment?', a: 'Navigate to the Consultation page, fill in your details, select a treatment, and choose a preferred payment method (Cash, UPI, Card, EMI). The clinic will confirm your slot.' },
  { q: 'Can I track my appointment status?', a: 'Yes, your appointment will move through Pending, Confirmed, and Completed statuses, which are managed by the clinic admin.' },
  { q: 'How does the EMI billing work?', a: 'The clinic offers flexible EMI plans for premium treatments. The Admin creates an installment plan, and you can track your remaining balance.' },
  { q: 'What is the Admin Demo Mode?', a: 'The Admin Dashboard is accessible for demonstration. You can view the telemetry and layouts without affecting the live database.' }
]

function FAQItem({ faq }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="border-b border-white/10 py-5">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left focus:outline-none group"
      >
        <span className="font-display text-lg text-white group-hover:text-gold transition-colors">{faq.q}</span>
        <ChevronDown 
          className={`text-support-300 transition-transform duration-300 ${isOpen ? 'rotate-180 text-gold' : ''}`} 
          size={20} 
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        className="overflow-hidden"
      >
        <p className="pt-4 text-support-200 font-light leading-relaxed">{faq.a}</p>
      </motion.div>
    </div>
  )
}

function HowToUsePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32 bg-[#020817]">
        <div className="absolute inset-0 bg-hero-glow opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020817]/40 via-transparent to-[#020817]" />
        
        <div className="page-shell relative z-10 max-w-4xl text-center mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gold mb-8"
          >
            <Info size={14} />
            User Guide
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl lg:text-7xl leading-tight text-white mb-6"
          >
            Welcome to <span className="text-gold italic pr-2">Azure OS</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg lg:text-xl text-support-200 font-light max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Everything you need to know before booking your appointment. Explore how our premium clinic management system works from both the patient and administrator perspectives.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link
              to="/appointment"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-8 py-4 text-sm font-bold uppercase tracking-widest text-navy transition-all hover:bg-gold-light hover:scale-105 shadow-[0_0_30px_rgba(212,175,55,0.3)]"
            >
              Book Appointment
            </Link>
            <Link
              to="/admin"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-white/10 backdrop-blur-md hover:scale-105"
            >
              Explore Admin
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Interactive Workflow Timeline */}
      <AnimatedSection className="section-space bg-navy-900 border-t border-white/5">
        <div className="page-shell">
          <SectionHeading
            eyebrow="The Patient Journey"
            title="A seamless workflow from start to finish."
            description="Experience a frictionless booking and treatment lifecycle engineered for luxury."
            align="center"
          />
          
          <div className="mt-20 max-w-3xl mx-auto relative">
            <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-gold/50 via-gold/10 to-transparent md:left-1/2 md:-ml-[1px]"></div>
            
            <div className="space-y-12 relative z-10">
              {timelineSteps.map((step, index) => {
                const isEven = index % 2 === 0
                const Icon = step.icon
                return (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`flex flex-col md:flex-row gap-6 md:gap-0 items-start md:items-center ${isEven ? 'md:flex-row-reverse' : ''}`}
                  >
                    <div className="hidden md:block w-1/2"></div>
                    
                    <div className="absolute left-0 md:left-1/2 w-14 h-14 -ml-[0px] md:-ml-7 rounded-full bg-navy border-4 border-[#0F172A] flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.2)] z-20">
                      <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                        <Icon size={18} className="text-gold" />
                      </div>
                    </div>
                    
                    <div className={`pl-20 md:pl-0 md:w-1/2 ${isEven ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'}`}>
                      <div className="glass-panel-dark p-6 rounded-2xl hover:bg-white/5 transition-colors border border-white/5">
                        <h3 className="font-display text-xl text-white font-medium mb-2">{step.title}</h3>
                        <p className="text-support-200 text-sm leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Demo Mode Information */}
      <AnimatedSection className="py-24 relative overflow-hidden bg-navy">
        <div className="absolute right-0 top-0 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="page-shell relative z-10">
          <div className="glass-panel-dark rounded-[40px] p-8 md:p-12 border border-blue-500/20 shadow-2xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
            
            <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-6">
                  <ShieldCheck size={14} />
                  Safe Environment
                </div>
                <h2 className="font-display text-3xl sm:text-4xl text-white mb-4">🚀 Live Demo Available</h2>
                <p className="text-support-200 leading-relaxed mb-8 font-light">
                  The Azure OS Admin Dashboard is currently available in Demo Mode. Feel free to explore the complete clinic management system safely.
                </p>
                <ul className="space-y-4">
                  {[
                    'Book a real appointment from the website.',
                    'Open the Admin Dashboard to see telemetry.',
                    'Instantly see how the appointment appears.',
                    'Test the entire clinic management workflow.',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                        <ArrowRight size={12} className="text-blue-400" />
                      </div>
                      <span className="text-support-100 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-center md:justify-end">
                <div className="relative w-full max-w-sm">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 blur-2xl rounded-full" />
                  <div className="glass-panel-dark rounded-2xl p-6 border border-white/10 relative z-10 shadow-2xl">
                    <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/10">
                      <div>
                        <p className="text-xs text-support-300 uppercase tracking-widest mb-1">Status</p>
                        <p className="text-white font-medium flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                          Demo Active
                        </p>
                      </div>
                      <Settings className="text-support-400" />
                    </div>
                    <Link
                      to="/admin"
                      className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white rounded-xl py-3 text-sm font-semibold transition hover:bg-blue-600 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                    >
                      Launch OS Dashboard
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Admin Features Showcase */}
      <AnimatedSection className="section-space bg-[#020817]">
        <div className="page-shell">
          <SectionHeading
            eyebrow="Azure OS Features"
            title="Enterprise-grade clinic management."
            description="A comprehensive suite of tools built for modern dental practices."
            align="center"
          />
          
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {adminFeatures.map((feature, i) => {
              const Icon = feature.icon
              return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="glass-panel-dark p-8 rounded-[24px] border border-white/5 hover:bg-white/5 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Icon size={22} className="text-gold" />
                </div>
                <h3 className="font-display text-xl text-white mb-3 font-medium">{feature.title}</h3>
                <p className="text-sm text-support-300 leading-relaxed font-light">{feature.desc}</p>
              </motion.div>
            )})}
          </div>
        </div>
      </AnimatedSection>

      {/* FAQ Section */}
      <AnimatedSection className="section-space bg-navy-900 border-t border-white/5">
        <div className="page-shell max-w-3xl mx-auto">
          <SectionHeading
            eyebrow="Common Questions"
            title="Frequently Asked Questions"
            description="Find answers to common queries about using the Azure Smiles platform."
            align="center"
          />
          
          <div className="mt-16 border-t border-white/10">
            {faqs.map((faq, i) => (
              <FAQItem key={i} faq={faq} />
            ))}
          </div>
        </div>
      </AnimatedSection>
    </>
  )
}

export default HowToUsePage
