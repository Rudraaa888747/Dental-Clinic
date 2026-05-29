import AnimatedSection from '../components/AnimatedSection'
import BeforeAfterCard from '../components/BeforeAfterCard'
import SectionHeading from '../components/SectionHeading'

function GalleryPage({ content }) {
  return (
    <AnimatedSection className="section-space min-h-screen bg-navy pt-32 pb-24 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-gold/5 blur-[120px] rounded-full pointer-events-none"></div>
      
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
        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {content.gallery.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-[32px] glass-panel-dark border-white/5 shadow-2xl group"
            >
              <div className="relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  width="400"
                  height="320"
                  className="h-80 w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-navy/20 mix-blend-overlay"></div>
              </div>
              <div className="p-8 relative">
                <h3 className="font-display text-2xl font-medium text-white group-hover:text-gold transition-colors">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-support-200 font-light">
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
