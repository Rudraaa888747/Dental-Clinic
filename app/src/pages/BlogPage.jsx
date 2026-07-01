import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import AnimatedSection from '../components/AnimatedSection'
import SectionHeading from '../components/SectionHeading'

function BlogPage({ content }) {
  useEffect(() => {
    document.title = `Journal | ${content.clinic.name}`
  }, [content.clinic.name])

  return (
    <AnimatedSection className="section-space min-h-screen bg-ivory pt-32 pb-24 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-charcoal-200/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="page-shell relative z-10">
        <SectionHeading
          eyebrow="The Journal"
          title="Insights into luxury dental care."
          description="A curated collection of knowledge, exploring advancements in cosmetic dentistry, oral wellness, and our unique approach to patient care."
          align="center"
        />
        <div className="mt-20 grid gap-8 lg:grid-cols-2">
          {content.blogs.map((post) => (
            <article
              key={post.slug}
              className="overflow-hidden rounded-[24px] lg:rounded-[32px] bg-white border border-border shadow-soft transition-all duration-500 hover:-translate-y-2 hover:shadow-teal group"
            >
              <div className="relative overflow-hidden h-64 lg:h-72">
                <img src={post.image} alt={post.title} loading="lazy" width="600" height="400" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/5 mix-blend-overlay"></div>
              </div>
              <div className="p-6 sm:p-10 relative">
                <span className="inline-flex rounded-full bg-accent-light border border-accent/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent">
                  {post.category}
                </span>
                <h3 className="mt-5 lg:mt-6 font-display text-2xl lg:text-3xl font-medium text-charcoal group-hover:text-accent transition-colors">
                  {post.title}
                </h3>
                <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-charcoal-200 font-light">
                  {post.excerpt}
                </p>
                <Link
                  to={`/blog/${post.slug}`}
                  className="mt-8 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-accent hover:text-accent-mid transition-colors"
                >
                  Read full article
                  <span className="transition-transform group-hover:translate-x-2">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
}

export default BlogPage
