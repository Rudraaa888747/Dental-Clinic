import { useState } from 'react'

function BeforeAfterCard({ item }) {
  const [position, setPosition] = useState(52)

  return (
    <div className="overflow-hidden rounded-[30px] border border-white/70 bg-white shadow-soft">
      <div className="relative h-[360px] overflow-hidden sm:h-[460px]">
        <img
          src={item.before}
          alt={`${item.title} before treatment`}
          className="h-full w-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <img
            src={item.after}
            alt={`${item.title} after treatment`}
            className="h-full w-full object-cover"
          />
        </div>
        <div
          className="absolute inset-y-0 w-1 bg-white/90 shadow-lg pointer-events-none"
          style={{ left: `calc(${position}% - 2px)` }}
        />
        <div className="absolute top-5 left-5 rounded-full bg-white/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">
          Before
        </div>
        <div className="absolute top-5 right-5 rounded-full bg-skybrand-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white">
          After
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          className="absolute inset-x-5 bottom-6 h-2 cursor-pointer appearance-none rounded-full bg-white/90"
          aria-label={`Compare before and after for ${item.title}`}
        />
      </div>
    </div>
  )
}

export default BeforeAfterCard
