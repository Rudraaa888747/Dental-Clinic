import { useMemo, useState } from 'react'
import { api } from '../lib/api'
import AnimatedSection from '../components/AnimatedSection'
import SectionHeading from '../components/SectionHeading'

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
      `Hello, I have booked an appointment for ${form.name || 'a patient'} on ${
        form.date || 'selected date'
      } at ${form.time || 'selected time'} for ${form.service || 'dental consultation'}.`,
    )
    return `https://wa.me/${content.clinic.whatsapp}?text=${text}`
  }, [content.clinic.whatsapp, form])

  const minDate = new Date().toISOString().split('T')[0]

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setStatus({ type: '', message: '' })

    try {
      await api.submitAppointment(form)
      setStatus({
        type: 'success',
        message: 'Appointment request sent successfully. Continue on WhatsApp for instant confirmation.',
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
    <AnimatedSection className="section-space">
      <div className="page-shell grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
        <div>
          <SectionHeading
            eyebrow="Book Online"
            title="A frictionless appointment flow built for conversions."
            description="Fast form completion, clean spacing, mobile-friendly controls, and a WhatsApp continuation path for quick reconfirmation."
          />
          <div className="mt-8 rounded-[28px] bg-white p-6 shadow-card">
            <p className="text-sm leading-7 text-slate-600">
              Need urgent assistance? Call{' '}
              <span className="font-semibold text-ink">{content.clinic.phone}</span>{' '}
              or message the clinic directly on WhatsApp for same-day scheduling
              support.
            </p>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white"
            >
              Open WhatsApp Confirmation
            </a>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="glass-panel rounded-[32px] p-6 shadow-soft sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <label htmlFor="booking-name" className="sm:col-span-2">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
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
                className="w-full rounded-2xl border-skybrand-100 bg-white px-4 py-3 shadow-sm focus:border-skybrand-400 focus:ring-skybrand-200"
                placeholder="Enter patient name"
                autoComplete="name"
              />
            </label>
            <label htmlFor="booking-phone">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Phone Number
              </span>
              <input
                id="booking-phone"
                name="phone"
                type="tel"
                required
                inputMode="tel"
                pattern="\+?[0-9\s-]{7,}"
                value={form.phone}
                onChange={(event) =>
                  setForm((value) => ({ ...value, phone: event.target.value }))
                }
                className="w-full rounded-2xl border-skybrand-100 bg-white px-4 py-3 shadow-sm focus:border-skybrand-400 focus:ring-skybrand-200"
                placeholder="+91 98765 43210"
                autoComplete="tel"
              />
            </label>
            <label htmlFor="booking-service">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Service
              </span>
              <select
                id="booking-service"
                name="service"
                required
                value={form.service}
                onChange={(event) =>
                  setForm((value) => ({ ...value, service: event.target.value }))
                }
                className="w-full rounded-2xl border-skybrand-100 bg-white px-4 py-3 shadow-sm focus:border-skybrand-400 focus:ring-skybrand-200"
              >
                <option value="">Choose treatment</option>
                {content.services.map((service) => (
                  <option key={service.id} value={service.name}>
                    {service.name}
                  </option>
                ))}
              </select>
            </label>
            <label htmlFor="booking-date">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Date
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
                className="w-full rounded-2xl border-skybrand-100 bg-white px-4 py-3 shadow-sm focus:border-skybrand-400 focus:ring-skybrand-200"
              />
            </label>
            <label htmlFor="booking-time">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Time
              </span>
              <input
                required
                type="time"
                value={form.time}
                onChange={(event) =>
                  setForm((value) => ({ ...value, time: event.target.value }))
                }
                className="w-full rounded-2xl border-skybrand-100 bg-white px-4 py-3 shadow-sm focus:border-skybrand-400 focus:ring-skybrand-200"
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-full bg-ink px-6 py-4 text-sm font-semibold text-white transition hover:bg-skybrand-700 disabled:opacity-70"
          >
            {loading ? 'Submitting...' : 'Confirm Appointment Request'}
          </button>
          {status.message ? (
            <p
              role="status"
              aria-live="polite"
              className={`mt-4 text-sm ${
                status.type === 'success' ? 'text-emerald-600' : 'text-rose-600'
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
