import { useState } from 'react'
import { api } from '../lib/api'
import AnimatedSection from '../components/AnimatedSection'
import SectionHeading from '../components/SectionHeading'

function ContactPage({ content }) {
  const [form, setForm] = useState({ name: '', phone: '', message: '' })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [loading, setLoading] = useState(false)
  /* Fix: Add field-level validation state for real-time feedback */
  const [touched, setTouched] = useState({})
  const errors = {
    name: touched.name && (!form.name.trim() || form.name.trim().length < 2) ? 'Name must be at least 2 characters' : '',
    phone: touched.phone && !/^\d{10}$/.test(form.phone) ? 'Phone must be exactly 10 digits' : '',
    message: touched.message && (!form.message.trim() || form.message.trim().length < 10) ? 'Message must be at least 10 characters' : '',
  }
  const isFormValid = form.name.trim().length >= 2 && /^\d{10}$/.test(form.phone) && form.message.trim().length >= 10


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
      setTouched({})
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatedSection className="section-space min-h-screen bg-ivory pt-32 pb-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="page-shell relative z-10 flex flex-col-reverse lg:grid gap-10 lg:gap-16 lg:grid-cols-[0.88fr_1.12fr]">
        <div>
          <SectionHeading
            eyebrow="Contact Us"
            title="Let us arrange your visit."
            description="Our concierge team is available to assist you with scheduling, treatment inquiries, and comprehensive care planning."
          />
          <div className="mt-12 space-y-8 bg-white rounded-[32px] p-8 shadow-soft border border-border relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-[40px] rounded-full"></div>
            
            <div className="relative z-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted">
                Clinic Location
              </p>
              <p className="mt-3 text-lg text-charcoal font-light">{content.clinic.address}</p>
            </div>
            <div className="relative z-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted">
                Operating Hours
              </p>
              {content.clinic.hours.map((item) => (
                <p key={item} className="mt-3 text-lg text-charcoal font-light">
                  {item}
                </p>
              ))}
            </div>
            <div className="relative z-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted">
                Direct Line
              </p>
              <p className="mt-3 text-lg text-accent font-light">{content.clinic.phone}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col-reverse lg:flex-col gap-8">
          <div className="overflow-hidden rounded-[24px] lg:rounded-[32px] bg-white p-2 shadow-soft border border-border relative group">
             <div className="absolute inset-0 bg-black/5 z-10 pointer-events-none transition-opacity duration-500 group-hover:opacity-0"></div>
            <iframe
              title="Clinic location"
              src={content.clinic.googleMapsEmbed}
              className="h-[300px] lg:h-[380px] w-full rounded-[16px] lg:rounded-[28px] border-0 grayscale-[30%] hue-rotate-[180deg]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="rounded-[24px] lg:rounded-[40px] bg-white border border-border p-6 sm:p-10 shadow-lifted relative">
            <h3 className="font-display text-2xl font-medium text-charcoal">
              Send an Inquiry
            </h3>
            <form onSubmit={handleSubmit} className="mt-8 grid gap-6 sm:grid-cols-2">
              <label htmlFor="contact-name">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted">
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
                  onBlur={() => setTouched(t => ({...t, name: true}))}
                  className={`w-full rounded-2xl border bg-surface-2 px-5 py-4 text-charcoal shadow-inner transition-colors placeholder:text-muted/50 ${errors.name ? 'border-rose-500/50 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-border focus:border-accent focus:ring-1 focus:ring-accent'}`}
                  placeholder="Your name"
                  autoComplete="name"
                />
                {errors.name && <span className="text-[#991B1B] text-[0.8rem] mt-1 block">{errors.name}</span>}
              </label>
              <label htmlFor="contact-phone">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted">
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
                  onBlur={() => setTouched(t => ({...t, phone: true}))}
                  className={`w-full rounded-2xl border bg-surface-2 px-5 py-4 text-charcoal shadow-inner transition-colors placeholder:text-muted/50 ${errors.phone ? 'border-rose-500/50 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-border focus:border-accent focus:ring-1 focus:ring-accent'}`}
                  placeholder="10-digit phone number"
                  autoComplete="tel"
                />
                {errors.phone && <span className="text-[#991B1B] text-[0.8rem] mt-1 block">{errors.phone}</span>}
              </label>
              <label htmlFor="contact-message" className="sm:col-span-2">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted">
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
                  onBlur={() => setTouched(t => ({...t, message: true}))}
                  className={`h-full w-full rounded-2xl border bg-surface-2 px-5 py-4 text-charcoal shadow-inner transition-colors placeholder:text-muted/50 ${errors.message ? 'border-rose-500/50 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-border focus:border-accent focus:ring-1 focus:ring-accent'}`}
                  placeholder="Tell us how we can assist you..."
                  rows="5"
                />
                {errors.message && <span className="text-[#991B1B] text-[0.8rem] mt-1 block">{errors.message}</span>}
              </label>
              <button
                type="submit"
                disabled={loading || !isFormValid}
                className="btn-primary sm:col-span-2 mt-4 w-full min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Submit Inquiry'}
              </button>
              {status.message ? (
                <p
                  role="status"
                  aria-live="polite"
                  className={`sm:col-span-2 mt-4 text-sm text-center p-4 rounded-xl border ${
                    status.type === 'success'
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-[#065F46]'
                      : 'border-rose-500/30 bg-rose-500/10 text-[#991B1B]'
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
