function StatusBanner({ mode }) {
  if (mode !== 'demo') {
    return null
  }

  return (
    <div className="border-b border-amber-200 bg-amber-50">
      <div className="page-shell py-3 text-center text-xs font-medium uppercase tracking-[0.2em] text-amber-700 sm:text-sm">
        Demo Mode Active: live server unavailable, local fallback is being used
      </div>
    </div>
  )
}

export default StatusBanner
