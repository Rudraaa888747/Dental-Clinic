import AnimatedSection from '../components/AnimatedSection'
import BeforeAfterCard from '../components/BeforeAfterCard'
import SectionHeading from '../components/SectionHeading'

function GalleryPage({ content }) {
  return (
    <AnimatedSection className="section-space min-h-screen bg-ivory pt-32 pb-24 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-accent/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="page-shell relative z-10">
        <SectionHeading
          eyebrow="Smile Gallery"
          title="Transformations that speak in volumes of confidence."
          description="Slide to witness the dramatic, natural-looking results achieved through our premium cosmetic protocols."
          align="center"
        />
        <div className="mt-16 max-w-4xl mx-auto">
          <BeforeAfterCard item={content.gallery[0]} />
        </div>
        <div className="mt-12 lg:mt-20 grid gap-4 lg:gap-8 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {content.gallery.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-[32px] bg-white border border-border shadow-soft group"
            >
              <div className="relative overflow-hidden aspect-square">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="p-4 lg:p-8 relative">
                <h3 className="font-display text-[1rem] lg:text-2xl font-medium text-charcoal group-hover:text-accent transition-colors">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-charcoal-200 font-light">
                  Real-care inspired imagery curated for a premium clinic presentation.
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
}

export default GalleryPage
