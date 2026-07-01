import { useMemo, useState } from 'react'
import { api } from '../lib/api'
import AnimatedSection from '../components/AnimatedSection'
import SectionHeading from '../components/SectionHeading'
import { CalendarClock, Phone, Star, ShieldCheck } from 'lucide-react'

const initialForm = {
  name: '',
  phone: '',
  service: '',
  date: '',
  time: '',
}

function BookingPage({ content }) {
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState({ type: '', message: '' })
  const [loading, setLoading] = useState(false)

  const whatsappLink = useMemo(() => {
    const text = encodeURIComponent(
      `Hello, I would like to request a consultation for ${form.name || 'a patient'} on ${
        form.date || 'selected date'
      } at ${form.time || 'selected time'} for ${form.service || 'dental treatment'}.`,
    )
    return `https://wa.me/${content.clinic.whatsapp}?text=${text}`
  }, [content.clinic.whatsapp, form.name, form.date, form.time, form.service])

  const minDate = new Date().toISOString().split('T')[0]

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setStatus({ type: '', message: '' })

    try {
      /* Fix: Validate time is within clinic hours (9 AM - 7 PM) */
      if (form.time) {
        const [hours] = form.time.split(':').map(Number)
        if (hours < 9 || hours >= 19) {
          setStatus({ type: 'error', message: 'Please select a time between 9:00 AM and 7:00 PM.' })
          setLoading(false)
          return
        }
      }

      await api.submitAppointment(form)
      setStatus({
        type: 'success',
        message: 'Consultation request received. A concierge will confirm shortly.',
      })
      setForm(initialForm)
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatedSection className="section-space min-h-screen bg-ivory pt-32 pb-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-charcoal-200/5 blur-[100px] rounded-full pointer-events-none"></div>
      
      <div className="page-shell relative z-10 grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="space-y-8">
          <SectionHeading
            eyebrow="Private Consultation"
            title="Reserve your transformation."
            description="Experience seamless booking. Select your preferred time and treatment, and our concierge team will ensure your visit is flawless."
          />
          
          <div className="bg-white rounded-[32px] p-8 shadow-soft border border-border relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-[40px] rounded-full"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-accent-light flex items-center justify-center border border-accent/20 text-accent">
                  <Phone size={20} />
                </div>
                <h3 className="text-xl font-display font-medium text-charcoal">Concierge Support</h3>
              </div>
              <p className="text-sm leading-relaxed text-charcoal-200 font-light mb-6">
                Require immediate assistance? Speak directly with our care coordinators for priority scheduling.
              </p>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-accent-light border border-accent/20 px-6 py-3 text-sm font-medium text-accent transition hover:bg-accent hover:text-white"
              >
                Connect on WhatsApp
              </a>
            </div>
          </div>


          
          {/* GOOGLE REVIEWS ECOSYSTEM */}
          <div className="mt-8 border-t border-border pt-8 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="text-gold fill-gold" size={16} />
                ))}
              </div>
              <p className="text-xs uppercase tracking-widest text-muted font-semibold mt-2">4.9/5 from 420+ Reviews</p>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-emerald-500" size={24} />
              <div className="text-left">
                 <p className="text-xs text-charcoal font-medium">Verified by</p>
                 <p className="text-[10px] text-muted">Google Trust</p>
              </div>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-[24px] lg:rounded-[40px] p-6 sm:p-10 shadow-lifted border border-border relative mb-24 md:mb-0"
        >
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-accent/10 blur-[30px] rounded-full"></div>
          
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-border">
            <CalendarClock className="text-accent" size={24} />
            <h3 className="text-2xl font-display font-medium text-charcoal">Appointment Details</h3>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <label htmlFor="booking-name" className="sm:col-span-2 block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted">
                Full Name
              </span>
              <input
                id="booking-name"
                name="name"
                required
                value={form.name}
                onChange={(event) =>
                  setForm((value) => ({ ...value, name: event.target.value }))
                }
                className="w-full h-[56px] rounded-2xl border border-border bg-surface-2 px-5 text-charcoal shadow-inner focus:border-accent focus:ring-1 focus:ring-accent transition-colors placeholder:text-muted/50 leading-normal"
                placeholder="Enter patient name"
                autoComplete="name"
              />
            </label>
            <label htmlFor="booking-phone" className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted">
                Contact Number
              </span>
              <input
                id="booking-phone"
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
                className="w-full h-[56px] rounded-2xl border border-border bg-surface-2 px-5 text-charcoal shadow-inner focus:border-accent focus:ring-1 focus:ring-accent transition-colors placeholder:text-muted/50 leading-normal"
                placeholder="10-digit phone number"
                autoComplete="tel"
              />
            </label>
            <label htmlFor="booking-service" className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted">
                Treatment
              </span>
              <select
                id="booking-service"
                name="service"
                required
                value={form.service}
                onChange={(event) =>
                  setForm((value) => ({ ...value, service: event.target.value }))
                }
                className="w-full h-[56px] rounded-2xl border border-border bg-surface-2 pl-5 pr-12 text-charcoal shadow-inner focus:border-accent focus:ring-1 focus:ring-accent transition-colors [&>option]:bg-white appearance-none leading-normal"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
              >
                <option value="">Select service</option>
                {content.services.map((service) => (
                  <option key={service.id} value={service.name}>
                    {service.name}
                  </option>
                ))}
              </select>
            </label>
            <label htmlFor="booking-date" className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted">
                Preferred Date
              </span>
              <input
                id="booking-date"
                name="date"
                required
                type="date"
                min={minDate}
                value={form.date}
                onChange={(event) =>
                  setForm((value) => ({ ...value, date: event.target.value }))
                }
                className="w-full h-[56px] rounded-2xl border border-border bg-surface-2 pl-5 pr-5 text-charcoal shadow-inner focus:border-accent focus:ring-1 focus:ring-accent transition-colors [color-scheme:light] leading-normal"
              />
            </label>
            <label htmlFor="booking-time" className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted">
                Preferred Time
              </span>
              <input
                required
                type="time"
                value={form.time}
                onChange={(event) =>
                  setForm((value) => ({ ...value, time: event.target.value }))
                }
                className="w-full h-[56px] rounded-2xl border border-border bg-surface-2 pl-5 pr-5 text-charcoal shadow-inner focus:border-accent focus:ring-1 focus:ring-accent transition-colors [color-scheme:light] leading-normal"
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary mt-10 w-[calc(100%-32px)] md:w-full fixed bottom-4 left-4 right-4 z-40 md:static md:min-h-[44px] shadow-2xl md:shadow-none"
          >
            {loading ? 'Processing...' : 'Request Consultation'}
          </button>
          {status.message ? (
            <p
              role="status"
              aria-live="polite"
              className={`mt-6 text-sm text-center p-4 rounded-xl border ${
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
    </AnimatedSection>
  )
}

export default BookingPage
