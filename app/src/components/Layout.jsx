import { useEffect, useRef } from 'react'
import Footer from './Footer'
import Navbar from './Navbar'
import StatusBanner from './StatusBanner'
import WhatsappFloat from './WhatsappFloat'
import WelcomeNotification from './WelcomeNotification'

function ensureMeta(property, content) {
  const selector = property.startsWith('og:') ? `meta[property="${property}"]` : `meta[name="${property}"]`
  let tag = document.querySelector(selector)
  if (!tag) {
    tag = document.createElement('meta')
    const attr = property.startsWith('og:') ? 'property' : 'name'
    tag.setAttribute(attr, property)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function Layout({ clinic, title, description, mode, children }) {
  const dataRef = useRef()

  useEffect(() => {
    const url = window.location.href
    document.title = title
    ensureMeta('description', description)
    ensureMeta('og:title', title)
    ensureMeta('og:description', description)
    ensureMeta('og:type', 'website')
    ensureMeta('og:url', url)
    ensureMeta('twitter:card', 'summary_large_image')
    ensureMeta('twitter:title', title)
    ensureMeta('twitter:description', description)
    let link = document.querySelector('link[rel="canonical"]')
    if (!link) {
      link = document.createElement('link')
      link.setAttribute('rel', 'canonical')
      document.head.appendChild(link)
    }
    link.setAttribute('href', url)

    const data = {
      '@context': 'https://schema.org',
      '@type': 'MedicalBusiness',
      name: clinic.name,
      description,
      telephone: clinic.phone,
      email: clinic.email,
      address: { '@type': 'PostalAddress', streetAddress: clinic.address },
      url,
      sameAs: [],
    }
    const json = JSON.stringify(data)
    if (dataRef.current !== json) {
      dataRef.current = json
      let script = document.getElementById('clinic-local-business')
      if (!script) {
        script = document.createElement('script')
        script.setAttribute('id', 'clinic-local-business')
        script.setAttribute('type', 'application/ld+json')
        document.head.appendChild(script)
      }
      script.textContent = json
    }
  }, [clinic, description, title])

  return (
    <div className="min-h-screen bg-transparent">
      <StatusBanner mode={mode} />
      <Navbar clinic={clinic} />
      <main>{children}</main>
      <Footer clinic={clinic} />
      <WhatsappFloat clinic={clinic} />
      <WelcomeNotification />
    </div>
  )
}

export default Layout
