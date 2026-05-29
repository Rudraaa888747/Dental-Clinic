import { useState } from 'react'
import { api } from '../lib/api'
import AnimatedSection from '../components/AnimatedSection'
import SectionHeading from '../components/SectionHeading'

function ContactPage({ content }) {
  const [form, setForm] = useState({ name: '', phone: '', message: '' })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setStatus({ type: '', message: '' })

    try {
      await api.submitInquiry(form)
      setStatus({
        type: 'success',
        message: 'Your inquiry has been sent successfully. Our concierge will contact you shortly.',
      })
      setForm({ name: '', phone: '', message: '' })
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatedSection className="section-space min-h-screen bg-navy pt-32 pb-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="page-shell relative z-10 grid gap-16 lg:grid-cols-[0.88fr_1.12fr]">
        <div>
          <SectionHeading
            eyebrow="Contact Us"
            title="Let us arrange your visit."
            description="Our concierge team is available to assist you with scheduling, treatment inquiries, and comprehensive care planning."
          />
          <div className="mt-12 space-y-8 glass-panel-dark rounded-[32px] p-8 shadow-2xl border-white/5 relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-[40px] rounded-full"></div>
            
            <div className="relative z-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-support-300">
                Clinic Location
              </p>
              <p className="mt-3 text-lg text-white font-light">{content.clinic.address}</p>
            </div>
            <div className="relative z-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-support-300">
                Operating Hours
              </p>
              {content.clinic.hours.map((item) => (
                <p key={item} className="mt-3 text-lg text-white font-light">
                  {item}
                </p>
              ))}
            </div>
            <div className="relative z-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-support-300">
                Direct Line
              </p>
              <p className="mt-3 text-lg text-gold font-light">{content.clinic.phone}</p>
            </div>
          </div>
        </div>
        <div className="grid gap-8">
          <div className="overflow-hidden rounded-[32px] glass-panel-dark p-2 shadow-2xl border-white/5 relative group">
             <div className="absolute inset-0 bg-navy/20 z-10 pointer-events-none transition-opacity duration-500 group-hover:opacity-0"></div>
            <iframe
              title="Clinic location"
              src={content.clinic.googleMapsEmbed}
              className="h-[380px] w-full rounded-[28px] border-0 grayscale-[50%] contrast-[1.2] invert-[90%] hue-rotate-[180deg]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="rounded-[40px] glass-panel-dark p-8 sm:p-10 shadow-2xl border-white/5 relative">
            <h3 className="font-display text-2xl font-medium text-white">
              Send an Inquiry
            </h3>
            <form onSubmit={handleSubmit} className="mt-8 grid gap-6 sm:grid-cols-2">
              <label htmlFor="contact-name">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-support-300">
                  Full Name
                </span>
                <input
                  id="contact-name"
                  name="name"
                  required
                  value={form.name}
                  onChange={(event) =>
                    setForm((value) => ({ ...value, name: event.target.value }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-navy-900/50 px-5 py-4 text-white shadow-inner focus:border-gold focus:ring-1 focus:ring-gold transition-colors placeholder:text-support-300/50"
                  placeholder="Your name"
                  autoComplete="name"
                />
              </label>
              <label htmlFor="contact-phone">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-support-300">
                  Contact Number
                </span>
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  required
                  inputMode="numeric"
                  pattern="[0-9]{10}"
                  maxLength="10"
                  value={form.phone}
                  onChange={(event) => {
                    const val = event.target.value.replace(/\D/g, '').slice(0, 10);
                    setForm((value) => ({ ...value, phone: val }))
                  }}
                  className="w-full rounded-2xl border border-white/10 bg-navy-900/50 px-5 py-4 text-white shadow-inner focus:border-gold focus:ring-1 focus:ring-gold transition-colors placeholder:text-support-300/50"
                  placeholder="10-digit phone number"
                  autoComplete="tel"
                />
              </label>
              <label htmlFor="contact-message" className="sm:col-span-2">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-support-300">
                  Message
                </span>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  value={form.message}
                  onChange={(event) =>
                    setForm((value) => ({ ...value, message: event.target.value }))
                  }
                  className="h-full w-full rounded-2xl border border-white/10 bg-navy-900/50 px-5 py-4 text-white shadow-inner focus:border-gold focus:ring-1 focus:ring-gold transition-colors placeholder:text-support-300/50"
                  placeholder="Tell us how we can assist you..."
                  rows="5"
                />
              </label>
              <button
                type="submit"
                disabled={loading}
                className="sm:col-span-2 mt-4 rounded-full bg-gold px-8 py-5 text-sm font-semibold text-navy uppercase tracking-widest shadow-gold transition hover:bg-gold-light hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
              >
                {loading ? 'Sending...' : 'Submit Inquiry'}
              </button>
              {status.message ? (
                <p
                  role="status"
                  aria-live="polite"
                  className={`sm:col-span-2 mt-4 text-sm text-center p-4 rounded-xl border ${
                    status.type === 'success'
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                      : 'border-rose-500/30 bg-rose-500/10 text-rose-400'
                  }`}
                >
                  {status.message}
                </p>
              ) : null}
            </form>
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}

export default ContactPage
