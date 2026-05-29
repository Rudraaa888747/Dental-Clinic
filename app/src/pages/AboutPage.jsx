import AnimatedSection from '../components/AnimatedSection'
import SectionHeading from '../components/SectionHeading'
import { Sparkles, ShieldCheck } from 'lucide-react'

function AboutPage({ content }) {
  return (
    <AnimatedSection className="section-space min-h-screen bg-navy pt-32 pb-24 relative overflow-hidden">
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-gold/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="page-shell relative z-10 grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="relative">
          <div className="absolute -inset-4 bg-gold/10 blur-[40px] rounded-full pointer-events-none"></div>
          <div className="glass-panel-dark overflow-hidden rounded-[40px] p-4 shadow-2xl relative">
            <img
              src={content.doctor.image}
              alt={content.doctor.name}
              loading="lazy"
              width="800"
              height="1200"
              className="h-[450px] lg:h-[600px] w-full rounded-[32px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-transparent opacity-60 rounded-[32px]"></div>
          </div>
        </div>
        <div>
          <SectionHeading
            eyebrow="The Architect"
            title={`${content.doctor.name}, ${content.doctor.title}`}
            description={content.doctor.story}
          />
          <div className="mt-10 space-y-6 text-lg leading-relaxed text-support-200 font-light">
            <p>{content.doctor.bio}</p>
            <p className="italic border-l-2 border-gold pl-6 text-white text-xl">
              "Our consultations focus on transparency, modern diagnostics, and
              treatment plans that respect time, comfort, and budget."
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {content.doctor.qualifications.map((item) => (
              <div
                key={item}
                className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-md px-6 py-5 text-sm font-medium text-white shadow-lg transition-colors hover:bg-white/10"
              >
                <ShieldCheck size={20} className="text-gold flex-shrink-0" />
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
