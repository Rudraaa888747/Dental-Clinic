import AnimatedSection from '../components/AnimatedSection'
import SectionHeading from '../components/SectionHeading'
import TestimonialSlider from '../components/TestimonialSlider'

function TestimonialsPage({ content }) {
  return (
    <AnimatedSection className="section-space">
      <div className="page-shell">
        <SectionHeading
          eyebrow="Reviews"
          title="Elegant reviews that reinforce trust and quality."
          description="Star ratings, warm tone, and optional video support make this section feel rich without becoming cluttered."
          align="center"
        />
        <div className="mt-12">
          <TestimonialSlider testimonials={content.testimonials} />
        </div>
      </div>
    </AnimatedSection>
  )
}

export default TestimonialsPage
