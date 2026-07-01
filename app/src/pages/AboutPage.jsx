import AnimatedSection from '../components/AnimatedSection'
import SectionHeading from '../components/SectionHeading'
import { ShieldCheck } from 'lucide-react'

function AboutPage({ content }) {
  const doctor = content?.doctor || {}
  const qualifications = doctor.qualifications || []

  return (
    <AnimatedSection className="section-space min-h-screen bg-ivory pt-32 pb-24 relative overflow-hidden">
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="page-shell relative z-10 grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="relative">
          <div className="absolute -inset-4 bg-accent/10 blur-[40px] rounded-full pointer-events-none"></div>
          <div className="bg-white border border-border overflow-hidden rounded-[24px] lg:rounded-[40px] p-3 lg:p-4 shadow-lifted relative">
            <img
              src={doctor.image}
              alt={doctor.name}
              loading="lazy"
              width="800"
              height="1200"
              className="h-[320px] lg:h-[600px] w-full rounded-[16px] lg:rounded-[32px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent opacity-60 rounded-[16px] lg:rounded-[32px]"></div>
          </div>
        </div>
        <div>
          <SectionHeading
            eyebrow="The Architect"
            title={`${doctor.name}, ${doctor.title}`}
            description={doctor.story}
          />
          <div className="mt-10 space-y-6 text-lg leading-relaxed text-charcoal-200 font-light">
            <p>{doctor.bio}</p>
            <p className="italic border-l-2 border-accent pl-6 text-charcoal text-xl">
              "Our consultations focus on transparency, modern diagnostics, and
              treatment plans that respect time, comfort, and budget."
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {qualifications.map((item) => (
              <div
                key={item}
                className="flex items-center gap-4 rounded-2xl border border-border bg-white px-6 py-5 text-sm font-medium text-charcoal shadow-soft transition-colors hover:border-accent/30"
              >
                <ShieldCheck size={20} className="text-accent flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}

export default AboutPage
