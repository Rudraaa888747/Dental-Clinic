import AnimatedSection from '../components/AnimatedSection'
import BeforeAfterCard from '../components/BeforeAfterCard'
import SectionHeading from '../components/SectionHeading'

function GalleryPage({ content }) {
  return (
    <AnimatedSection className="section-space">
      <div className="page-shell">
        <SectionHeading
          eyebrow="Gallery"
          title="High-trust visual storytelling for cosmetic and general dentistry."
          description="Interactive comparisons and lifestyle imagery help patients imagine their own outcome with confidence."
          align="center"
        />
        <div className="mt-12">
          <BeforeAfterCard item={content.gallery[0]} />
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {content.gallery.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-[28px] bg-white shadow-card"
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-72 w-full object-cover"
              />
              <div className="p-6">
                <h3 className="font-display text-2xl font-semibold text-ink">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Real-care inspired imagery curated for a premium clinic
                  presentation.
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
