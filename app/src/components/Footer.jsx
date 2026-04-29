import { Link } from 'react-router-dom'

function Footer({ clinic }) {
  return (
    <footer className="border-t border-skybrand-100 bg-white/90">
      <div className="page-shell grid gap-10 py-12 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <h3 className="font-display text-2xl font-semibold text-ink">
            {clinic.name}
          </h3>
          <p className="mt-4 max-w-md text-sm leading-7 text-slate-600">
            Conversion-focused dental care website with premium hospitality,
            modern treatment planning, and seamless appointment booking.
          </p>
        </div>
        <div>
          <h4 className="font-display text-lg font-semibold text-ink">
            Quick Links
          </h4>
          <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
            <Link to="/services">Services</Link>
            <Link to="/gallery">Gallery</Link>
            <Link to="/blog">Blog</Link>
            <Link to="/appointment">Book Appointment</Link>
            <Link to="/admin">Admin</Link>
          </div>
        </div>
        <div>
          <h4 className="font-display text-lg font-semibold text-ink">
            Contact
          </h4>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <p>{clinic.address}</p>
            <p>{clinic.phone}</p>
            <p>{clinic.email}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
