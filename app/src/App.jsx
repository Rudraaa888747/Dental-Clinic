import { Suspense, lazy, useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Lenis from 'lenis'
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

  // 1. Determine if current route is an Admin route
  const isAdminRoute = location.pathname.startsWith('/admin')

  useEffect(() => {
    // 2. Initialize Lenis ONLY for public routes so it doesn't break admin dashboard scroll
    let lenis = null
    
    if (!isAdminRoute) {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
      })
  
      function raf(time) {
        lenis.raf(time)
        requestAnimationFrame(raf)
      }
  
      requestAnimationFrame(raf)
    }

    api
      .getContent()
      .then((response) => {
        if (response.content) setContent(response.content)
        setMode(response.mode || 'live')
      })
      .catch((error) => {
        setLoadError(error?.message || 'Unable to load content. Please try again later.')
      })

    return () => {
      if (lenis) lenis.destroy()
    }
  }, [isAdminRoute])

  if (loadError) {
    if (isAdminRoute) return <div className="p-8 text-rose-500">{loadError}</div>
    return (
      <Layout clinic={content.clinic} title={content.clinic.name} description={content.clinic.tagline} mode={mode}>
        <div className="page-shell py-24 text-center text-sm text-rose-600">{loadError}</div>
      </Layout>
    )
  }

  // 3. Isolated Admin Router
  if (isAdminRoute) {
    return (
      <Suspense fallback={<div className="h-screen w-full bg-[#020817] flex items-center justify-center text-support-300">Loading OS...</div>}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/admin" element={<PageWrapper><AdminDashboardPage /></PageWrapper>} />
            <Route path="/admin/dashboard" element={<PageWrapper><AdminDashboardPage /></PageWrapper>} />
            {/* Add more admin routes here later */}
          </Routes>
        </AnimatePresence>
      </Suspense>
    )
  }

  // 4. Public Router (wrapped in public Layout with Navbar/Footer)
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
          </Routes>
        </AnimatePresence>
      </Suspense>
    </Layout>
  )
}

export default App
