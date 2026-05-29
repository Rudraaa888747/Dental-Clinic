import AnimatedSection from '../components/AnimatedSection'
import SectionHeading from '../components/SectionHeading'
import TestimonialSlider from '../components/TestimonialSlider'

function TestimonialsPage({ content }) {
  return (
    <AnimatedSection className="section-space min-h-screen bg-navy pt-32 pb-24 relative overflow-hidden">
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-gold/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="page-shell relative z-10">
        <SectionHeading
          eyebrow="Patient Stories"
          title="Told by those who experienced the difference."
          description="Read the genuine experiences of patients who transformed their smiles in our care."
          align="center"
        />
        <div className="mt-20">
          <TestimonialSlider testimonials={content.testimonials} />
        </div>
      </div>
    </AnimatedSection>
  )
}

export default TestimonialsPage
