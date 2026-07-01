import { MessageCircleMore } from 'lucide-react'

function WhatsappFloat({ clinic }) {
  const message = encodeURIComponent(
    `Hello ${clinic?.name || 'Azure Smiles'}, I would like to arrange a private consultation.`
  )

  return (
    <div className="fixed bottom-[80px] md:bottom-6 right-4 md:right-6 z-50 group">
      
      {/* Pulse ring animation */}
      <div className="absolute inset-0 rounded-full bg-[#0D5C4E]/20 animate-ping group-hover:animate-none" />
      
      {/* Tooltip — desktop only */}
      <div className="absolute bottom-full right-0 mb-3 hidden md:group-hover:flex items-center bg-white text-[#374151] border border-[#E8E0D5] text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap shadow-sm pointer-events-none before:content-[''] before:absolute before:top-full before:right-4 before:border-4 before:border-transparent before:border-t-white">
        Chat on WhatsApp
      </div>

      <a
        href={`https://wa.me/${clinic?.whatsapp || ''}?text=${message}`}
        target="_blank"
        rel="noreferrer"
        aria-label="VIP Support via WhatsApp"
        className="
          relative flex items-center justify-center 
          gap-2.5 rounded-full 
          bg-white 
          border border-[#E8E0D5]
          w-[52px] h-[52px] 
          md:w-auto md:h-auto 
          md:px-5 md:py-3
          text-sm font-semibold 
          text-[#0D5C4E]
          shadow-[0_4px_20px_rgba(13,92,78,0.15)]
          transition-all duration-300
          hover:bg-[#0D5C4E] 
          hover:text-white 
          hover:border-[#0D5C4E]
          hover:shadow-[0_8px_32px_rgba(13,92,78,0.3)]
          hover:scale-105
          active:scale-95
        "
      >
        <MessageCircleMore size={22} className="shrink-0 transition-colors duration-200" />
        <span className="hidden md:inline tracking-wide">
          VIP Support
        </span>
      </a>
    </div>
  )
}

export default WhatsappFloat
