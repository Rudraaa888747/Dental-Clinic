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
      <AnimatedSection className="section-space min-h-screen bg-navy pt-32 pb-24 flex items-center justify-center">
        <div className="page-shell glass-panel-dark rounded-[32px] p-10 text-center shadow-2xl max-w-lg border-white/5">
          <h1 className="font-display text-4xl font-medium text-white">Journal Entry Not Found</h1>
          <Link to="/blog" className="mt-8 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-gold hover:text-white transition-colors">
            <span className="transition-transform group-hover:-translate-x-2">←</span>
            Return to Journal
          </Link>
        </div>
      </AnimatedSection>
    )
  }

  return (
    <AnimatedSection className="section-space min-h-screen bg-navy pt-32 pb-24 relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gold/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <article className="page-shell mx-auto max-w-4xl relative z-10">
        <div className="relative overflow-hidden rounded-[40px] shadow-2xl">
          <img
            src={post.image}
            alt={post.title}
            loading="lazy"
            width="800"
            height="520"
            className="h-[400px] w-full object-cover sm:h-[520px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent"></div>
        </div>
        
        <div className="relative -mt-32 mx-4 sm:mx-10 glass-panel-dark rounded-[32px] p-8 shadow-2xl sm:p-12 border-white/5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-[40px] rounded-full pointer-events-none"></div>
          
          <div className="relative z-10">
            <span className="inline-flex rounded-full bg-gold/10 border border-gold/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gold">
              {post.category}
            </span>
            <h1 className="mt-6 font-display text-4xl font-medium tracking-tight text-white sm:text-5xl leading-tight">
              {post.title}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-support-200 font-light border-b border-white/10 pb-8">{post.excerpt}</p>
            <div className="mt-10 space-y-6 text-base leading-relaxed text-support-200 font-light">
              {post.content.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-16 text-center">
           <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-gold hover:text-white transition-colors group">
            <span className="transition-transform group-hover:-translate-x-2">←</span>
            Back to Journal
          </Link>
        </div>
      </article>
    </AnimatedSection>
  )
}

export default BlogPostPage
