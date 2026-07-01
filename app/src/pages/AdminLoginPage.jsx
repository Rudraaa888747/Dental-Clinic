import { useState, useEffect } from 'react'
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

  /* Fix [Round 5]: Prevent indexing of admin routes */
  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = "robots";
      document.head.appendChild(meta);
    }
    meta.content = "noindex, nofollow";
  }, []);

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
    <div className="min-h-screen flex items-center justify-center bg-[#F4F6F8] p-4">
      <div className="w-[400px] max-w-[90vw] relative z-10">

        <div className="text-center mb-8">
          <img src="/logo.jpg" alt="Azure Smile Logo" className="h-[48px] w-auto mx-auto mb-6 rounded-lg shadow-sm" />
          <h1 className="font-display text-[1.5rem] font-bold text-[#111827]">Welcome Back</h1>
          <p className="text-[#6B7280] text-[0.9rem] mt-2">Authenticate to access the clinic management system.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[16px] p-[40px] shadow-[0_4px_24px_rgba(0,0,0,0.08)] relative"
        >
          <div className="grid gap-6">

            {/* EMAIL */}
            <div>
              <label className="mb-[6px] block text-[0.8rem] font-medium text-[#374151]">
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
                className="w-full h-[40px] rounded-[8px] border border-[#E5E7EB] bg-white px-[12px] text-[0.9rem] text-[#111827] focus:border-[#0D5C4E] focus:ring-[3px] focus:ring-[#0D5C4E]/15 focus:outline-none transition-all placeholder:text-[#6B7280]"
              />
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <label className="mb-[6px] block text-[0.8rem] font-medium text-[#374151]">
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
                className="w-full h-[40px] rounded-[8px] border border-[#E5E7EB] bg-white px-[12px] pr-10 text-[0.9rem] text-[#111827] focus:border-[#0D5C4E] focus:ring-[3px] focus:ring-[#0D5C4E]/15 focus:outline-none transition-all placeholder:text-[#6B7280]"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[32px] text-[#6B7280] hover:text-[#111827] transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* REMEMBER + FORGOT */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-[#374151] hover:text-[#111827] transition-colors group">
                <div className={`w-[18px] h-[18px] rounded-[4px] border flex items-center justify-center transition-colors ${form.remember ? 'bg-[#0D5C4E] border-[#0D5C4E]' : 'border-[#E5E7EB] bg-white group-hover:border-[#0D5C4E]'}`}>
                  {form.remember && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
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
                <span className="text-[0.85rem]">Remember me</span>
              </label>
            </div>

            {/* ERROR */}
            {error && (
              <div className="text-[0.85rem] font-medium text-[#991B1B] bg-[#FEE2E2] px-[12px] py-[12px] rounded-[8px] border border-[#FCA5A5] text-center">
                {error}
              </div>
            )}

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full h-[44px] rounded-[8px] bg-[#0D5C4E] text-white font-semibold text-[0.9rem] flex items-center justify-center gap-2 hover:bg-[#1A7A68] transition-colors disabled:opacity-70"
            >
              {loading && <Loader2 className="animate-spin" size={16} />}
              {loading ? 'Authenticating...' : 'Access Portal'}
            </button>

          </div>
        </form>

        {/* 🔙 BACK TO WEBSITE */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-[0.85rem] font-medium text-[#6B7280] hover:text-[#111827] transition-colors group"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Return to Public Site
          </button>
        </div>

      </div>
    </div>
  )
}

export default AdminLoginPage
