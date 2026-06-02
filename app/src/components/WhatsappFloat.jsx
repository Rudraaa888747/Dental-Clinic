import { MessageCircleMore } from 'lucide-react'

function WhatsappFloat({ clinic }) {
  const message = encodeURIComponent(
    `Hello ${clinic.name}, I would like to arrange a private consultation.`,
  )

  return (
    <>
      {/* Desktop Floating WhatsApp */}
      <div className="hidden sm:block fixed bottom-6 right-6 z-50 group">
        <a
          href={`https://wa.me/${clinic.whatsapp}?text=${message}`}
          target="_blank"
          rel="noreferrer"
          className="relative inline-flex items-center gap-3 rounded-full bg-navy-900 border border-gold/30 px-6 py-4 text-sm font-medium text-gold shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-gold hover:text-navy hover:border-gold"
        >
          <MessageCircleMore size={20} />
          <span>VIP Support</span>
        </a>
      </div>

    </>
  )
}

export default WhatsappFloat
