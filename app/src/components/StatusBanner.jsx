function StatusBanner({ mode }) {
  if (mode !== 'demo') {
    return null
  }

  return (
    <div className="border-b border-gold/20 bg-navy">
      <div className="page-shell py-2.5 text-center text-[10px] font-semibold uppercase tracking-[0.25em] text-gold sm:text-xs">
        Demo Mode Active: Live server unavailable, local fallback is being used.
      </div>
    </div>
  )
}

export default StatusBanner
