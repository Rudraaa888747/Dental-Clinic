import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import AnimatedSection from '../components/AnimatedSection'
import SectionHeading from '../components/SectionHeading'

function BlogPage({ content }) {
  useEffect(() => {
    document.title = `Blog | ${content.clinic.name}`
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        'Explore dental health insights, preventive tips, and clinic updates from Azure Smiles Dental Clinic.',
      )
    }
  }, [content.clinic.name])

  return (
    <AnimatedSection className="section-space">
      <div className="page-shell">
        <SectionHeading
          eyebrow="Dental Insights"
          title="SEO-friendly blog content for long-term discovery."
          description="Each post is structured to support organic visibility while keeping the editorial look polished and premium."
          align="center"
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {content.blogs.map((post) => (
            <article
              key={post.slug}
              className="overflow-hidden rounded-[30px] bg-white shadow-card transition hover:-translate-y-1"
            >
              <img src={post.image} alt={post.title} className="h-72 w-full object-cover" />
              <div className="p-6 sm:p-8">
                <span className="rounded-full bg-skybrand-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-skybrand-700">
                  {post.category}
                </span>
                <h3 className="mt-4 font-display text-3xl font-semibold text-ink">
                  {post.title}
                </h3>
                <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">
                  {post.excerpt}
                </p>
                <Link
                  to={`/blog/${post.slug}`}
                  className="mt-6 inline-flex text-sm font-semibold text-skybrand-700"
                >
                  Read article
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
