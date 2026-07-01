function SectionHeading({ eyebrow, title, description, align = 'left' }) {
  const alignment = align === 'center' ? 'text-center mx-auto' : 'text-left'

  return (
    <div className={`max-w-2xl ${alignment}`}>
      <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent-light px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-accent backdrop-blur-md mb-6">
        {eyebrow}
      </div>
      <h2 className="font-display text-[clamp(1.8rem,8vw,2.25rem)] font-light tracking-tight text-charcoal sm:text-5xl lg:text-6xl leading-tight">
        {title}
      </h2>
      {description ? (
        <p className="mt-6 text-base leading-relaxed text-charcoal-200 sm:text-lg font-light">
          {description}
        </p>
      ) : null}
    </div>
  )
}

export default SectionHeading
