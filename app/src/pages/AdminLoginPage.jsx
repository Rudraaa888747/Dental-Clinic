import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import AnimatedSection from '../components/AnimatedSection'
import SectionHeading from '../components/SectionHeading'
import { Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react'

function AdminLoginPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    email: '',
    password: '',
    remember: false,
  })

  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function validateForm() {
    if (!form.email.includes('@')) {
      return 'Enter a valid email address'
    }
    if (form.password.length < 6) {
      return 'Password must be at least 6 characters'
    }
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setError('')
    setLoading(true)

    try {
      const res = await api.adminLogin(form)

      if (res?.token) {
        const storage = form.remember ? localStorage : sessionStorage
        localStorage.removeItem('adminToken')
        sessionStorage.removeItem('adminToken')
        storage.setItem('adminToken', res.token)
      }

      navigate('/admin/dashboard')
    } catch (err) {
      setError(err?.message || 'Login failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatedSection className="section-space min-h-screen flex items-center justify-center bg-[#020817] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="page-shell w-full max-w-md relative z-10">

        <SectionHeading
          eyebrow="Concierge Portal"
          title="Welcome Back"
          description="Authenticate to access the clinic management system."
          align="center"
        />

        <form
          onSubmit={handleSubmit}
          className="mt-10 glass-panel-dark rounded-[32px] p-8 shadow-2xl border-white/5 relative"
        >
          <div className="grid gap-6">

            {/* EMAIL */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-support-300">
                Email
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) =>
                  setForm((v) => ({ ...v, email: e.target.value }))
                }
                placeholder="admin@example.com"
                className="w-full rounded-2xl border border-white/10 bg-navy-900/50 px-5 py-4 text-white shadow-inner focus:border-gold focus:ring-1 focus:ring-gold transition-colors placeholder:text-support-300/50 outline-none"
              />
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-support-300">
                Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={form.password}
                onChange={(e) =>
                  setForm((v) => ({ ...v, password: e.target.value }))
                }
                placeholder="Enter password"
                className="w-full rounded-2xl border border-white/10 bg-navy-900/50 px-5 py-4 pr-12 text-white shadow-inner focus:border-gold focus:ring-1 focus:ring-gold transition-colors placeholder:text-support-300/50 outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-11 text-support-300 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* REMEMBER + FORGOT */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-3 cursor-pointer text-support-200 hover:text-white transition-colors group">
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${form.remember ? 'bg-gold border-gold' : 'border-white/20 group-hover:border-white/40'}`}>
                  {form.remember && <svg className="w-3 h-3 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </div>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={form.remember}
                  onChange={(e) =>
                    setForm((v) => ({
                      ...v,
                      remember: e.target.checked,
                    }))
                  }
                />
                Remember me
              </label>
            </div>

            {/* ERROR */}
            {error && (
              <div className="text-sm text-rose-400 bg-rose-500/10 px-4 py-3 rounded-xl border border-rose-500/30 text-center">
                {error}
              </div>
            )}

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-4 text-sm font-semibold uppercase tracking-widest text-navy shadow-gold hover:bg-gold-light hover:scale-[1.02] transition-all disabled:opacity-70 disabled:hover:scale-100"
            >
              {loading && <Loader2 className="animate-spin" size={18} />}
              {loading ? 'Authenticating...' : 'Access Portal'}
            </button>

          </div>
        </form>

        {/* 🔙 BACK TO WEBSITE */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-support-300 hover:text-white transition-colors group"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Return to Public Site
          </button>
        </div>

        {/* FOOTER */}
      </div>
    </AnimatedSection>
  )
}

export default AdminLoginPage
