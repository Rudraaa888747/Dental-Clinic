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
    <div className="border-b border-border py-5">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left focus:outline-none group"
      >
        <span className="font-display text-lg text-charcoal group-hover:text-accent transition-colors">{faq.q}</span>
        <ChevronDown 
          className={`text-muted transition-transform duration-300 ${isOpen ? 'rotate-180 text-accent' : ''}`} 
          size={20} 
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        className="overflow-hidden"
      >
        <p className="pt-4 text-charcoal-200 font-light leading-relaxed">{faq.a}</p>
      </motion.div>
    </div>
  )
}

function HowToUsePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32 bg-ivory">
        <div className="absolute inset-0 bg-hero-glow opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-ivory/40 via-transparent to-ivory" />
        
        <div className="page-shell relative z-10 max-w-4xl text-center mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent-light px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent mb-8"
          >
            <Info size={14} />
            User Guide
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl lg:text-7xl leading-tight text-charcoal mb-6"
          >
            Welcome to <span className="text-accent italic pr-2">Azure OS</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg lg:text-xl text-charcoal-200 font-light max-w-2xl mx-auto mb-10 leading-relaxed"
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
              className="btn-primary"
            >
              Book Appointment
            </Link>
            <Link
              to="/admin"
              className="btn-secondary"
            >
              Explore Admin
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Interactive Workflow Timeline */}
      <AnimatedSection className="section-space bg-surface-2 border-t border-border">
        <div className="page-shell">
          <SectionHeading
            eyebrow="The Patient Journey"
            title="A seamless workflow from start to finish."
            description="Experience a frictionless booking and treatment lifecycle engineered for luxury."
            align="center"
          />
          
          <div className="mt-20 max-w-3xl mx-auto relative">
            <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-accent/50 via-accent/10 to-transparent md:left-1/2 md:-ml-[1px]"></div>
            
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
                    
                    <div className="absolute left-0 md:left-1/2 w-14 h-14 -ml-[0px] md:-ml-7 rounded-full bg-white border-4 border-surface-2 flex items-center justify-center shadow-soft z-20">
                      <div className="w-10 h-10 rounded-full bg-accent-light flex items-center justify-center">
                        <Icon size={18} className="text-accent" />
                      </div>
                    </div>
                    
                    <div className={`pl-20 md:pl-0 md:w-1/2 ${isEven ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'}`}>
                      <div className="bg-white p-6 rounded-2xl hover:bg-surface-2 transition-colors border border-border shadow-soft">
                        <h3 className="font-display text-xl text-charcoal font-medium mb-2">{step.title}</h3>
                        <p className="text-charcoal-200 text-sm leading-relaxed">{step.desc}</p>
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
      <AnimatedSection className="py-24 relative overflow-hidden bg-ivory">
        <div className="absolute right-0 top-0 w-[600px] h-[600px] bg-accent/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="page-shell relative z-10">
          <div className="bg-white rounded-[40px] p-8 md:p-12 border border-border shadow-soft overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent pointer-events-none" />
            
            <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-accent mb-6">
                  <ShieldCheck size={14} />
                  Safe Environment
                </div>
                <h2 className="font-display text-3xl sm:text-4xl text-charcoal mb-4">🚀 Live Demo Available</h2>
                <p className="text-charcoal-200 leading-relaxed mb-8 font-light">
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
                      <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                        <ArrowRight size={12} className="text-accent" />
                      </div>
                      <span className="text-charcoal text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-center md:justify-end">
                <div className="relative w-full max-w-sm">
                  <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-teal-500/20 blur-2xl rounded-full" />
                  <div className="bg-white rounded-2xl p-6 border border-border relative z-10 shadow-lifted">
                    <div className="flex items-center justify-between mb-6 pb-6 border-b border-border">
                      <div>
                        <p className="text-xs text-muted uppercase tracking-widest mb-1">Status</p>
                        <p className="text-charcoal font-medium flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          Demo Active
                        </p>
                      </div>
                      <Settings className="text-muted" />
                    </div>
                    <Link
                      to="/admin"
                      className="btn-primary w-full flex items-center justify-center gap-2"
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
      <AnimatedSection className="section-space bg-ivory">
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
                className="bg-white p-8 rounded-[24px] border border-border hover:bg-surface-2 shadow-soft transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-accent-light border border-accent/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Icon size={22} className="text-accent" />
                </div>
                <h3 className="font-display text-xl text-charcoal mb-3 font-medium">{feature.title}</h3>
                <p className="text-sm text-charcoal-200 leading-relaxed font-light">{feature.desc}</p>
              </motion.div>
            )})}
          </div>
        </div>
      </AnimatedSection>

      {/* FAQ Section */}
      <AnimatedSection className="section-space bg-ivory border-t border-border">
        <div className="page-shell max-w-3xl mx-auto">
          <SectionHeading
            eyebrow="Common Questions"
            title="Frequently Asked Questions"
            description="Find answers to common queries about using the Azure Smiles platform."
            align="center"
          />
          
          <div className="mt-16 border-t border-border">
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
