const STORAGE_KEYS = {
  appointments: 'clinic_demo_appointments',
  inquiries: 'clinic_demo_inquiries',
  content: 'clinic_demo_content',
}

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function write(key, value) {
  /* Fix: localStorage.setItem can throw in private browsing or when quota is exceeded */
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Silently fail — demo data won't persist but app continues
  }
}

export const demoStore = {
  getAppointments: () => read(STORAGE_KEYS.appointments, []),
  saveAppointment: (payload) => {
    const next = [
      {
        ...payload,
        _id: `${Date.now()}`,
        status: 'pending',
        createdAt: new Date().toISOString(),
      },
      ...read(STORAGE_KEYS.appointments, []),
    ]
    write(STORAGE_KEYS.appointments, next)
    return next[0]
  },
  updateAppointmentStatus: (id, status) => {
    const next = read(STORAGE_KEYS.appointments, []).map((item) =>
      item._id === id ? { ...item, status } : item,
    )
    write(STORAGE_KEYS.appointments, next)
    return next.find((item) => item._id === id)
  },
  getInquiries: () => read(STORAGE_KEYS.inquiries, []),
  saveInquiry: (payload) => {
    const next = [
      {
        ...payload,
        _id: `${Date.now()}`,
        createdAt: new Date().toISOString(),
      },
      ...read(STORAGE_KEYS.inquiries, []),
    ]
    write(STORAGE_KEYS.inquiries, next)
    return next[0]
  },
  getContent: (fallbackContent) => read(STORAGE_KEYS.content, fallbackContent),
  saveContent: (content) => {
    write(STORAGE_KEYS.content, content)
    return content
  },
}
