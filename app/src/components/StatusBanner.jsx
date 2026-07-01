import { useState } from 'react'
import { AlertTriangle, ChevronUp } from 'lucide-react'

function StatusBanner({ mode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  if (mode !== 'demo') {
    return null
  }

  if (isCollapsed) {
    return (
      <div 
        className="h-1 bg-[#C9A84C] w-full cursor-pointer hover:opacity-80 transition-opacity z-[100] relative" 
        onClick={() => setIsCollapsed(false)}
        title="Expand Demo Banner"
      />
    )
  }

  return (
    <div className="bg-[#FEF9EC] border-b-2 border-[#C9A84C] relative px-4 py-2.5 flex items-center justify-between z-[100]">
      <div className="flex items-center gap-2 overflow-hidden page-shell flex-1">
        <AlertTriangle size={16} className="text-[#C9A84C] flex-shrink-0" />
        <span className="text-[#0D5C4E] text-[0.8rem] font-medium truncate">
          Demo Mode Active: Live server unavailable, local fallback is being used.
        </span>
      </div>
      <button 
        onClick={() => setIsCollapsed(true)} 
        className="ml-4 p-1 text-[#0D5C4E] hover:text-[#C9A84C] transition-colors flex-shrink-0"
        title="Collapse Banner"
      >
        <ChevronUp size={16} />
      </button>
    </div>
  )
}

export default StatusBanner
