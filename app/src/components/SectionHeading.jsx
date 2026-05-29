function SectionHeading({ eyebrow, title, description, align = 'left' }) {
  const alignment = align === 'center' ? 'text-center mx-auto' : 'text-left'

  return (
    <div className={`max-w-2xl ${alignment}`}>
      <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-gold-light backdrop-blur-md mb-6">
        {eyebrow}
      </div>
      <h2 className="font-display text-4xl font-light tracking-tight text-white sm:text-5xl lg:text-6xl leading-tight">
        {title}
      </h2>
      {description ? (
        <p className="mt-6 text-base leading-relaxed text-support-200 sm:text-lg font-light">
          {description}
        </p>
      ) : null}
    </div>
  )
}

export default SectionHeading
