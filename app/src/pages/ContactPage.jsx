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
        message: 'Your inquiry has been sent successfully. Our team will contact you shortly.',
      })
      setForm({ name: '', phone: '', message: '' })
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatedSection className="section-space">
      <div className="page-shell grid gap-8 lg:grid-cols-[0.88fr_1.12fr]">
        <div>
          <SectionHeading
            eyebrow="Contact Us"
            title="Trustworthy contact details with high-clarity layout."
            description="This page keeps the path to visit, call, or message extremely obvious across devices."
          />
          <div className="mt-8 space-y-5 rounded-[28px] bg-white p-6 shadow-card">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Address
              </p>
              <p className="mt-2 text-base text-slate-700">{content.clinic.address}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Opening Hours
              </p>
              {content.clinic.hours.map((item) => (
                <p key={item} className="mt-2 text-base text-slate-700">
                  {item}
                </p>
              ))}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Call
              </p>
              <p className="mt-2 text-base text-slate-700">{content.clinic.phone}</p>
            </div>
          </div>
        </div>
        <div className="grid gap-6">
          <div className="overflow-hidden rounded-[30px] bg-white p-3 shadow-card">
            <iframe
              title="Clinic location"
              src={content.clinic.googleMapsEmbed}
              className="h-[380px] w-full rounded-[24px] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="rounded-[30px] bg-white p-6 shadow-card">
            <h3 className="font-display text-2xl font-semibold text-ink">
              Quick Contact
            </h3>
            <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
              <label htmlFor="contact-name">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
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
                  className="w-full rounded-2xl border-skybrand-100 px-4 py-3 focus:border-skybrand-400 focus:ring-skybrand-200"
                  placeholder="Your name"
                  autoComplete="name"
                />
              </label>
              <label htmlFor="contact-phone">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Phone Number
                </span>
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  required
                  inputMode="tel"
                  pattern="\+?[0-9\s-]{7,}"
                  value={form.phone}
                  onChange={(event) =>
                    setForm((value) => ({ ...value, phone: event.target.value }))
                  }
                  className="w-full rounded-2xl border-skybrand-100 px-4 py-3 focus:border-skybrand-400 focus:ring-skybrand-200"
                  placeholder="+91 98765 43210"
                  autoComplete="tel"
                />
              </label>
              <label htmlFor="contact-message" className="sm:col-span-2">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
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
                  className="h-full w-full rounded-2xl border-skybrand-100 px-4 py-3 focus:border-skybrand-400 focus:ring-skybrand-200"
                  placeholder="Tell us how we can help"
                  rows="5"
                />
              </label>
              <button
                type="submit"
                disabled={loading}
                className="sm:col-span-2 rounded-full bg-ink px-6 py-4 text-sm font-semibold text-white"
              >
                {loading ? 'Sending...' : 'Send Inquiry'}
              </button>
              {status.message ? (
                <p
                  role="status"
                  aria-live="polite"
                  className={`sm:col-span-2 text-sm ${
                    status.type === 'success'
                      ? 'text-emerald-600'
                      : 'text-rose-600'
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
