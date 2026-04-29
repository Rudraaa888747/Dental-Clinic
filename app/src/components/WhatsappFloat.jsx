import { MessageCircleMore } from 'lucide-react'

function WhatsappFloat({ clinic }) {
  const message = encodeURIComponent(
    `Hello ${clinic.name}, I would like to book an appointment.`,
  )

  return (
    <a
      href={`https://wa.me/${clinic.whatsapp}?text=${message}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-3 rounded-full bg-[#25D366] px-5 py-4 text-sm font-semibold text-white shadow-glow transition hover:scale-105"
    >
      <MessageCircleMore size={18} />
      WhatsApp
    </a>
  )
}

export default WhatsappFloat
