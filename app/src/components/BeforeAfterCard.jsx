import { useState, useRef, useCallback } from 'react'
import { MoveHorizontal } from 'lucide-react'

function BeforeAfterCard({ item }) {
  const [position, setPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef(null)
  const rafRef = useRef(null)

  const handleMove = useCallback((clientX) => {
    if (rafRef.current) return
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = clientX - rect.left
      setPosition(Math.max(0, Math.min(100, (x / rect.width) * 100)))
    })
  }, [])

  const handleMouseMove = useCallback((e) => {
    if (isDragging) handleMove(e.clientX)
  }, [isDragging, handleMove])

  const handleTouchMove = useCallback((e) => {
    if (isDragging) handleMove(e.touches[0].clientX)
  }, [isDragging, handleMove])

  return (
    <div className="relative overflow-hidden rounded-[32px] bg-white border border-border shadow-2xl p-2 group">
      <div 
        ref={containerRef}
        className="relative h-[400px] sm:h-[500px] rounded-[24px] overflow-hidden cursor-ew-resize"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        onTouchMove={handleTouchMove}
      >
        <img
          src={item.after}
          alt={`${item.title} after treatment`}
          loading="lazy"
          width="800"
          height="600"
          className="h-full w-full object-cover select-none"
          draggable="false"
        />
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <img
            src={item.before}
            alt={`${item.title} before treatment`}
            loading="lazy"
            width="800"
            height="600"
            className="h-full w-full object-cover select-none"
            draggable="false"
          />
        </div>
        
        {/* Slider Handle */}
        <div
          className="absolute inset-y-0 flex items-center justify-center w-0.5 bg-white shadow-soft pointer-events-none"
          style={{ left: `${position}%` }}
        >
          <div className="absolute w-12 h-12 rounded-full bg-white border border-border shadow-lifted flex items-center justify-center text-accent pointer-events-auto transition-transform group-hover:scale-110">
            <MoveHorizontal size={20} />
          </div>
        </div>
        
        <div className="absolute top-6 left-6 rounded-full bg-charcoal/60 backdrop-blur-md border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white pointer-events-none">
          Before
        </div>
        <div className="absolute top-6 right-6 rounded-full bg-accent/90 backdrop-blur-md border border-accent/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white pointer-events-none shadow-teal">
          After
        </div>
      </div>
    </div>
  )
}

export default BeforeAfterCard
