const API_BASE = import.meta.env.VITE_API_URL || '/api'
const DEFAULT_TIMEOUT = 10000

function withTimeout(timeoutMs = DEFAULT_TIMEOUT) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  return { controller, timeout }
}

function createNetworkError() {
  return new Error(
    'Unable to reach the clinic server right now. Please check your connection and try again.',
  )
}

async function request(path, options = {}) {
  const { controller, timeout } = withTimeout(options.timeoutMs)
  const storedToken =
    typeof window !== 'undefined'
      ? window.localStorage.getItem('adminToken') || window.sessionStorage.getItem('adminToken')
      : ''

  try {
    const response = await fetch(`${API_BASE}${path}`, {
      credentials: options.credentials || 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        ...(storedToken ? { Authorization: `Bearer ${storedToken}` } : {}),
        ...(options.headers || {}),
      },
      ...options,
      signal: controller.signal,
    })

    if (!response.ok) {
      let errorMessage = response.statusText || `Request failed with status ${response.status}`
      const contentType = response.headers.get('content-type') || ''

      if (contentType.includes('application/json')) {
        const errorData = await response.json().catch(() => null)
        if (errorData?.message) {
          errorMessage = errorData.message
        }
      }

      throw new Error(errorMessage)
    }

    return response.json()
  } catch (error) {
    if (error.name === 'AbortError' || error instanceof TypeError) {
      throw createNetworkError()
    }

    throw error
  } finally {
    clearTimeout(timeout)
  }
}

function enforceDemoMode() {
  throw new Error('Action unavailable in Demo Mode.')
}

export const api = {
  checkHealth: async () => {
    const response = await request('/health')
    return { ...response, mode: 'live' }
  },
  getContent: async () => {
    const response = await request('/content')
    return { ...response, mode: 'live' }
  },
  submitAppointment: async (payload) => {
    const response = await request('/appointments', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    return { ...response, mode: 'live' }
  },
  submitInquiry: async (payload) => {
    const response = await request('/inquiries', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    return { ...response, mode: 'live' }
  },
  adminLogin: async (payload) => {
    return await request('/admin/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
  getAdminSession: async () => {
    return await request('/admin/session')
  },
  adminLogout: async () => {
    await request('/admin/logout', {
      method: 'POST',
    })
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('adminToken')
      window.sessionStorage.removeItem('adminToken')
      window.localStorage.removeItem('adminRecentSearches')
    }
    return { success: true }
  },
  getAdminDashboard: async () => {
    const response = await request('/admin/dashboard')
    return { ...response, mode: 'live' }
  },
  getAdminCatalog: async () => {
    return await request('/admin/catalog')
  },
  createPatient: async (payload) => {
    return await request('/admin/patients', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
  getPatientProfile: async (id) => {
    return await request(`/admin/patients/${id}`)
  },
  createAdminBooking: async (payload) => {
    return await request('/admin/bookings', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
  listInvoices: async () => {
    return await request('/admin/invoices')
  },
  createInvoice: async (payload) => {
    return await request('/admin/invoices', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
  updateInvoice: async (id, payload) => {
    return await request(`/admin/invoices/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    })
  },
  replyToReview: async (id, reply) => enforceDemoMode(),
  generateReport: async (type) => enforceDemoMode(),
  getNotifications: async () => {
    return await request('/admin/notifications')
  },
  markNotificationRead: async (id) => {
    return await request(`/admin/notifications/${id}/read`, {
      method: 'PATCH',
    })
  },
  getActivityLogs: async (query = '') => {
    const search = query ? `?q=${encodeURIComponent(query)}` : ''
    return await request(`/admin/activity-logs${search}`)
  },
  searchAdmin: async (query) => {
    return await request(`/admin/search?q=${encodeURIComponent(query)}`)
  },
  getSettings: async () => {
    return await request('/admin/settings')
  },
  updateSettings: async (payload) => enforceDemoMode(),
  syncTreatments: async () => enforceDemoMode(),
  updateAppointmentStatus: async (id, status) => {
    return await request(`/admin/appointments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
  },
}
