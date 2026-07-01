import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import AnimatedSection from '../components/AnimatedSection'

function BlogPostPage({ content }) {
  const { slug } = useParams()
  const post = content.blogs.find((item) => item.slug === slug)

  useEffect(() => {
    if (!post) return
    document.title = `${post.title} | ${content.clinic.name}`
  }, [content.clinic.name, post])

  if (!post) {
    return (
      <AnimatedSection className="section-space min-h-screen bg-ivory pt-32 pb-24 flex items-center justify-center">
        <div className="page-shell bg-white rounded-[32px] p-10 text-center shadow-soft max-w-lg border border-border">
          <h1 className="font-display text-4xl font-medium text-charcoal">Journal Entry Not Found</h1>
          <Link to="/blog" className="mt-8 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-accent hover:text-accent-mid transition-colors">
            <span className="transition-transform group-hover:-translate-x-2">←</span>
            Return to Journal
          </Link>
        </div>
      </AnimatedSection>
    )
  }

  return (
    <AnimatedSection className="section-space min-h-screen bg-ivory pt-32 pb-24 relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-accent/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <article className="page-shell mx-auto max-w-4xl relative z-10 px-0 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-none sm:rounded-[40px] shadow-2xl">
          <img
            src={post.image}
            alt={post.title}
            loading="lazy"
            width="800"
            height="520"
            className="h-[400px] w-full object-cover sm:h-[520px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ivory via-ivory/40 to-transparent"></div>
        </div>
        
        <div className="relative -mt-16 sm:-mt-32 mx-4 sm:mx-10 bg-white rounded-[24px] sm:rounded-[32px] p-6 sm:p-12 shadow-lifted border border-border">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-[40px] rounded-full pointer-events-none"></div>
          
          <div className="relative z-10">
            <span className="inline-flex rounded-full bg-accent-light border border-accent/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent">
              {post.category}
            </span>
            <h1 className="mt-4 sm:mt-6 font-display text-3xl sm:text-5xl font-medium tracking-tight text-charcoal leading-tight">
              {post.title}
            </h1>
            <p className="mt-4 sm:mt-6 text-[1rem] sm:text-lg leading-relaxed text-charcoal-200 font-light border-b border-border pb-6 sm:pb-8">{post.excerpt}</p>
            <div className="mt-8 sm:mt-10 space-y-6 text-[0.95rem] sm:text-base leading-relaxed text-charcoal-200 font-light">
              {post.content.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-16 text-center">
           <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-accent hover:text-accent-mid transition-colors group">
            <span className="transition-transform group-hover:-translate-x-2">←</span>
            Back to Journal
          </Link>
        </div>
      </article>
    </AnimatedSection>
  )
}

export default BlogPostPage
