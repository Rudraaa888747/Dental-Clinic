import { Suspense, lazy, useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Layout from './components/Layout'
import PageWrapper from './components/PageWrapper'
import { fallbackContent } from './data/fallbackContent'
import { api } from './lib/api'

const HomePage = lazy(() => import('./pages/HomePage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const ServicesPage = lazy(() => import('./pages/ServicesPage'))
const BookingPage = lazy(() => import('./pages/BookingPage'))
const GalleryPage = lazy(() => import('./pages/GalleryPage'))
const TestimonialsPage = lazy(() => import('./pages/TestimonialsPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const BlogPage = lazy(() => import('./pages/BlogPage'))
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'))
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage'))
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'))

function App() {
  const [content, setContent] = useState(fallbackContent)
  const [mode, setMode] = useState('live')
  const [loadError, setLoadError] = useState('')
  const location = useLocation()

  useEffect(() => {
    api
      .getContent()
      .then((response) => {
        if (response.content) setContent(response.content)
        setMode(response.mode || 'live')
      })
      .catch((error) => {
        setLoadError(error?.message || 'Unable to load content. Please try again later.')
      })
  }, [])

  if (loadError) {
    return (
      <Layout
        clinic={content.clinic}
        title={content.clinic.name}
        description={content.clinic.tagline}
        mode={mode}
      >
        <div className="page-shell py-24 text-center text-sm text-rose-600">
          {loadError}
        </div>
      </Layout>
    )
  }

  return (
    <Layout
      clinic={content.clinic}
      title={`${content.clinic.name} | Premium Dental Clinic`}
      description={content.clinic.tagline}
      mode={mode}
    >
      <Suspense
        fallback={
          <div className="page-shell py-24 text-center text-sm text-slate-500">
            Loading experience...
          </div>
        }
      >
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageWrapper><HomePage content={content} /></PageWrapper>} />
            <Route path="/about" element={<PageWrapper><AboutPage content={content} /></PageWrapper>} />
            <Route path="/services" element={<PageWrapper><ServicesPage content={content} /></PageWrapper>} />
            <Route path="/appointment" element={<PageWrapper><BookingPage content={content} /></PageWrapper>} />
            <Route path="/gallery" element={<PageWrapper><GalleryPage content={content} /></PageWrapper>} />
            <Route path="/testimonials" element={<PageWrapper><TestimonialsPage content={content} /></PageWrapper>} />
            <Route path="/contact" element={<PageWrapper><ContactPage content={content} /></PageWrapper>} />
            <Route path="/blog" element={<PageWrapper><BlogPage content={content} /></PageWrapper>} />
            <Route path="/blog/:slug" element={<PageWrapper><BlogPostPage content={content} /></PageWrapper>} />
            <Route path="/admin" element={<PageWrapper><AdminLoginPage /></PageWrapper>} />
            <Route path="/admin/dashboard" element={<PageWrapper><AdminDashboardPage /></PageWrapper>} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </Layout>
  )
}

export default App
