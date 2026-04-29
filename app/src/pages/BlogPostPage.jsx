import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import AnimatedSection from '../components/AnimatedSection'

function BlogPostPage({ content }) {
  const { slug } = useParams()
  const post = content.blogs.find((item) => item.slug === slug)

  useEffect(() => {
    if (!post) return

    document.title = `${post.title} | ${content.clinic.name}`
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', post.excerpt)
    }
  }, [content.clinic.name, post])

  if (!post) {
    return (
      <AnimatedSection className="section-space">
        <div className="page-shell rounded-[30px] bg-white p-10 text-center shadow-card">
          <h1 className="font-display text-4xl font-bold text-ink">Post not found</h1>
          <Link to="/blog" className="mt-6 inline-flex text-sm font-semibold text-skybrand-700">
            Back to blog
          </Link>
        </div>
      </AnimatedSection>
    )
  }

  return (
    <AnimatedSection className="section-space">
      <article className="page-shell mx-auto max-w-4xl">
        <img
          src={post.image}
          alt={post.title}
          className="h-[380px] w-full rounded-[32px] object-cover shadow-soft sm:h-[480px]"
        />
        <div className="mt-8 rounded-[30px] bg-white p-8 shadow-card sm:p-10">
          <span className="rounded-full bg-skybrand-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-skybrand-700">
            {post.category}
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-ink">
            {post.title}
          </h1>
          <p className="mt-4 text-base leading-8 text-slate-600">{post.excerpt}</p>
          <div className="mt-8 space-y-5 text-base leading-8 text-slate-700">
            {post.content.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </article>
    </AnimatedSection>
  )
}

export default BlogPostPage
