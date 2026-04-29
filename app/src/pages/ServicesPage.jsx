import AnimatedSection from '../components/AnimatedSection'
import SectionHeading from '../components/SectionHeading'
import ServiceCard from '../components/ServiceCard'

function ServicesPage({ content }) {
  return (
    <AnimatedSection className="section-space">
      <div className="page-shell">
        <SectionHeading
          eyebrow="Treatment Menu"
          title="Specialized dentistry services presented with premium clarity."
          description="Each card is optimized for readability, trust, and conversion so visitors quickly understand the outcome and value."
          align="center"
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {content.services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
}

export default ServicesPage
