import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import AnimatedSection from '../components/AnimatedSection'
import SectionHeading from '../components/SectionHeading'

function AdminLoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await api.adminLogin(form)
      navigate('/admin/dashboard')
    } catch (loginError) {
      setError(loginError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatedSection className="section-space">
      <div className="page-shell max-w-xl">
        <SectionHeading
          eyebrow="Admin Login"
          title="Secure access for appointment and content management."
          description="Use environment credentials from the backend to log in and manage the website content."
          align="center"
        />
        <form
          onSubmit={handleSubmit}
          className="mt-10 rounded-[32px] bg-white p-8 shadow-card"
        >
          <div className="grid gap-5">
            <input
              type="email"
              required
              placeholder="Admin email"
              value={form.email}
              onChange={(event) =>
                setForm((value) => ({ ...value, email: event.target.value }))
              }
              className="rounded-2xl border-skybrand-100 px-4 py-3 focus:border-skybrand-400 focus:ring-skybrand-200"
            />
            <input
              type="password"
              required
              placeholder="Password"
              value={form.password}
              onChange={(event) =>
                setForm((value) => ({ ...value, password: event.target.value }))
              }
              className="rounded-2xl border-skybrand-100 px-4 py-3 focus:border-skybrand-400 focus:ring-skybrand-200"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-ink px-6 py-4 text-sm font-semibold text-white"
            >
              {loading ? 'Signing in...' : 'Login'}
            </button>
            {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          </div>
        </form>
      </div>
    </AnimatedSection>
  )
}

export default AdminLoginPage
