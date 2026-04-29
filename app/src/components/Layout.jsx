import { useEffect } from 'react'
import Footer from './Footer'
import Navbar from './Navbar'
import StatusBanner from './StatusBanner'
import WhatsappFloat from './WhatsappFloat'

function updateMetaTag(selector, attribute, value) {
  let tag = document.querySelector(selector)
  if (!tag) {
    const [element, attr] = selector.split('[')
    tag = document.createElement(element)
    const attrName = attr.replace(/\]$/, '')
    const [name, val] = attrName.split('=').map((value) => value.replace(/['"]+/g, ''))
    tag.setAttribute(name, val)
    document.head.appendChild(tag)
  }

  if (tag) {
    tag.setAttribute(attribute, value)
  }
}

function ensureLinkTag(rel, href) {
  let link = document.querySelector(`link[rel="${rel}"]`)
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', rel)
    document.head.appendChild(link)
  }
  link.setAttribute('href', href)
}

function ensureJsonLd(id, data) {
  let script = document.getElementById(id)
  if (!script) {
    script = document.createElement('script')
    script.setAttribute('id', id)
    script.setAttribute('type', 'application/ld+json')
    document.head.appendChild(script)
  }
  script.textContent = JSON.stringify(data)
}

function Layout({ clinic, title, description, mode, children }) {
  useEffect(() => {
    const url = window.location.href
    document.title = title

    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', description)
    }

    updateMetaTag('meta[property="og:title"]', 'content', title)
    updateMetaTag('meta[property="og:description"]', 'content', description)
    updateMetaTag('meta[property="og:type"]', 'content', 'website')
    updateMetaTag('meta[property="og:url"]', 'content', url)
    updateMetaTag('meta[name="twitter:card"]', 'content', 'summary_large_image')
    updateMetaTag('meta[name="twitter:title"]', 'content', title)
    updateMetaTag('meta[name="twitter:description"]', 'content', description)
    ensureLinkTag('canonical', url)

    ensureJsonLd('clinic-local-business', {
      '@context': 'https://schema.org',
      '@type': 'MedicalBusiness',
      name: clinic.name,
      description,
      telephone: clinic.phone,
      email: clinic.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: clinic.address,
      },
      url,
      sameAs: [],
    })
  }, [clinic, description, title])

  return (
    <div className="min-h-screen bg-transparent">
      <StatusBanner mode={mode} />
      <Navbar clinic={clinic} />
      <main>{children}</main>
      <Footer clinic={clinic} />
      <WhatsappFloat clinic={clinic} />
    </div>
  )
}

export default Layout
