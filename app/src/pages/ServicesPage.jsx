import { useMemo } from 'react'
import AnimatedSection from '../components/AnimatedSection'
import SectionHeading from '../components/SectionHeading'
import ServiceCard from '../components/ServiceCard'

function ServicesPage({ content }) {
  const categories = useMemo(() => {
    const grouped = content.services.reduce((acc, service) => {
      const category = service.category || 'General Dentistry'
      if (!acc[category]) acc[category] = []
      acc[category].push(service)
      return acc
    }, {})
    
    // Define a specific order
    const order = ['General Dentistry', 'Cosmetic Dentistry', 'Orthodontics', 'Restorative Dentistry', 'Advanced Care']
    
    return Object.keys(grouped)
      .sort((a, b) => order.indexOf(a) - order.indexOf(b))
      .map(key => ({
        name: key,
        services: grouped[key]
      }))
  }, [content.services])

  return (
    <AnimatedSection className="section-space min-h-screen bg-navy pt-32 pb-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gold/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-support-300/5 blur-[100px] rounded-full pointer-events-none"></div>
      
      <div className="page-shell relative z-10">
        <SectionHeading
          eyebrow="Curated Treatments"
          title="Masterpieces in modern dentistry."
          description="Every protocol is executed with precision, leveraging advanced robotics and premium materials to ensure outcomes that feel as natural as they look."
          align="center"
        />

        <div className="mt-20 space-y-24">
          {categories.map((category) => (
            <div key={category.name} className="space-y-12">
              <div className="flex items-center gap-6">
                <h2 className="font-display text-3xl font-medium text-white">{category.name}</h2>
                <div className="flex-1 h-[1px] bg-gradient-to-r from-white/10 to-transparent"></div>
              </div>
              <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                {category.services.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </AnimatedSection>
  )
}

export default ServicesPage
