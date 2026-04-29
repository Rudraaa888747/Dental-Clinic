import { motion } from 'framer-motion'
import { ArrowRight, BadgeCheck, CalendarRange, PhoneCall } from 'lucide-react'
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
      <section className="premium-grid overflow-hidden">
        <div className="page-shell grid gap-12 pt-10 pb-16 sm:pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pt-20 lg:pb-24">
          <div>
            <div className="inline-flex rounded-full border border-skybrand-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-skybrand-700 shadow-sm">
              Boutique Smile Care
            </div>
            <h1 className="mt-6 max-w-2xl font-display text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Your Smile, Our Priority
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              A premium dental destination with advanced technology, thoughtful
              comfort, and beautifully delivered treatment plans for families,
              professionals, and smile makeover patients.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/appointment"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-4 text-sm font-semibold text-white shadow-card transition hover:bg-skybrand-700"
              >
                <CalendarRange size={18} />
                Book Appointment
              </Link>
              <a
                href={`tel:${content.clinic.phone.replace(/\s+/g, '')}`}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-skybrand-200 bg-white/85 px-6 py-4 text-sm font-semibold text-skybrand-700 shadow-sm"
              >
                <PhoneCall size={18} />
                Call Now
              </a>
            </div>
            <div className="mt-10">
              <TrustBar clinic={content.clinic} />
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative"
          >
            <div className="absolute -top-10 right-0 h-56 w-56 rounded-full bg-skybrand-200/60 blur-3xl" />
            <div className="glass-panel relative overflow-hidden rounded-[36px] p-3 shadow-glow">
              <img
                src="https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=1400&q=80"
                alt="Dentist consultation"
                className="h-[460px] w-full rounded-[28px] object-cover sm:h-[560px]"
              />
              <div className="absolute left-8 bottom-8 max-w-xs rounded-[24px] bg-white/88 p-5 shadow-card backdrop-blur">
                <div className="flex items-center gap-2 text-skybrand-600">
                  <BadgeCheck size={18} />
                  <span className="text-xs font-semibold uppercase tracking-[0.24em]">
                    Trusted Care
                  </span>
                </div>
                <p className="mt-3 font-display text-xl font-semibold text-ink">
                  Digital scans, gentle dentistry, premium comfort.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <AnimatedSection className="section-space">
        <div className="page-shell">
          <SectionHeading
            eyebrow="Signature Services"
            title="Designed for preventive, restorative, and aesthetic confidence."
            description="Every service is presented with clear pricing, elegant visuals, and reassuring language to support conversion."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {content.services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="section-space bg-white/80">
        <div className="page-shell grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Meet The Doctor"
              title={content.doctor.name}
              description={content.doctor.bio}
            />
            <div className="mt-8 space-y-4">
              {content.doctor.qualifications.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-skybrand-100 bg-mist px-4 py-4 text-sm text-slate-600"
                >
                  <BadgeCheck className="text-skybrand-600" size={18} />
                  {item}
                </div>
              ))}
            </div>
            <Link
              to="/about"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-skybrand-700"
            >
              Explore clinic story
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="overflow-hidden rounded-[32px] bg-white p-4 shadow-soft">
            <img
              src={content.doctor.image}
              alt={content.doctor.name}
              className="h-[520px] w-full rounded-[24px] object-cover"
            />
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="section-space">
        <div className="page-shell grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Smile Results"
              title="Before and after transformations that feel natural."
              description="A luxury clinic site should make outcomes tangible. This interactive compare module gives patients instant visual reassurance."
            />
          </div>
          <div className="w-full">
            <BeforeAfterCard item={content.gallery[0]} />
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="section-space overflow-hidden bg-slate-50/50">
        <div className="page-shell">
          <div className="mx-auto max-w-3xl">
            <SectionHeading
              eyebrow="Patient Love"
              title="Warm reviews that build trust quickly."
              description="Modern, card-driven reviews paired with strong spacing and soft motion to elevate perceived quality."
              align="center"
            />
          </div>
        </div>
        <div className="mt-12 w-full">
          <TestimonialSlider testimonials={content.testimonials} />
        </div>
      </AnimatedSection>

      <AnimatedSection className="section-space bg-white/80">
        <div className="page-shell grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Ready To Visit?"
              title="Book your appointment in under a minute."
              description="Choose your treatment, preferred date, and time. We’ll take it from there with a WhatsApp-friendly confirmation flow."
            />
          </div>
          <Link
            to="/appointment"
            className="inline-flex items-center justify-center rounded-full bg-skybrand-500 px-7 py-4 text-sm font-semibold text-white shadow-glow transition hover:bg-skybrand-600"
          >
            Start Booking
          </Link>
        </div>
      </AnimatedSection>
    </>
  )
}

export default HomePage
