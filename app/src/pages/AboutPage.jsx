import AnimatedSection from '../components/AnimatedSection'
import SectionHeading from '../components/SectionHeading'

function AboutPage({ content }) {
  return (
    <AnimatedSection className="section-space">
      <div className="page-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="overflow-hidden rounded-[32px] bg-white p-4 shadow-soft">
          <img
            src={content.doctor.image}
            alt={content.doctor.name}
            className="h-[520px] w-full rounded-[26px] object-cover"
          />
        </div>
        <div>
          <SectionHeading
            eyebrow="About The Clinic"
            title={`${content.doctor.name}, ${content.doctor.title}`}
            description={content.doctor.story}
          />
          <div className="mt-8 space-y-4 text-base leading-8 text-slate-600">
            <p>{content.doctor.bio}</p>
            <p>
              Our consultations focus on transparency, modern diagnostics, and
              treatment plans that respect time, comfort, and budget.
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {content.doctor.qualifications.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-skybrand-100 bg-mist px-5 py-4 text-sm font-medium text-slate-700"
              >
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
