import { motion } from 'framer-motion'
import { Menu, Phone, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const MotionNavLink = motion(NavLink)

const links = [
  ['Home', '/'],
  ['About', '/about'],
  ['Services', '/services'],
  ['Gallery', '/gallery'],
  ['Reviews', '/testimonials'],
  ['Blog', '/blog'],
  ['Contact', '/contact'],
]

function Navbar({ clinic }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-white/70 bg-white/85 backdrop-blur-xl">
      <div className="page-shell flex h-20 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-skybrand-500 text-lg font-bold text-white shadow-md">
            AS
          </div>
          <div>
            <p className="font-display text-lg font-semibold text-ink">
              {clinic.name}
            </p>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Premium Dentistry
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map(([label, href]) => (
            <MotionNavLink
              key={href}
              to={href}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
              className={({ isActive }) =>
                `text-sm font-medium transition ${
                  isActive ? 'text-skybrand-700' : 'text-slate-600 hover:text-skybrand-600'
                }`
              }
            >
              {label}
            </MotionNavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={`tel:${clinic.phone.replace(/\s+/g, '')}`}
            className="inline-flex items-center gap-2 rounded-full border border-skybrand-200 px-4 py-2 text-sm font-semibold text-skybrand-700"
          >
            <Phone size={16} />
            {clinic.phone}
          </a>
          <Link
            to="/appointment"
            className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-skybrand-700"
          >
            Book Appointment
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-slate-700 lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-slate-100 bg-white lg:hidden">
          <div className="page-shell flex flex-col gap-4 py-5">
            {links.map(([label, href]) => (
              <NavLink
                key={href}
                to={href}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `text-sm font-semibold ${
                    isActive ? 'text-skybrand-700' : 'text-slate-700'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <Link
              to="/appointment"
              onClick={() => setOpen(false)}
              className="rounded-full bg-ink px-5 py-3 text-center text-sm font-semibold text-white"
            >
              Book Appointment
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  )
}

export default Navbar
