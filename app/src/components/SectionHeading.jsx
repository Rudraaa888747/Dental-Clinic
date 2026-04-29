function SectionHeading({ eyebrow, title, description, align = 'left' }) {
  const alignment = align === 'center' ? 'text-center mx-auto' : 'text-left'

  return (
    <div className={`max-w-2xl ${alignment}`}>
      <span className="mb-4 inline-flex rounded-full border border-skybrand-200 bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-skybrand-700 shadow-sm">
        {eyebrow}
      </span>
      <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  )
}

export default SectionHeading
