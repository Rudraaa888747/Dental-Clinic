function scoreText(query, text) {
  if (!query || !text) return 0
  const normalizedQuery = query.toLowerCase()
  const normalizedText = text.toLowerCase()

  if (normalizedText === normalizedQuery) return 120
  if (normalizedText.startsWith(normalizedQuery)) return 90
  if (normalizedText.includes(normalizedQuery)) return 70

  let pointer = 0
  let score = 0
  for (const char of normalizedText) {
    if (char === normalizedQuery[pointer]) {
      score += 5
      pointer += 1
      if (pointer === normalizedQuery.length) return score
    }
  }

  return 0
}

function rankCollection(items, query, config) {
  return items
    .map((item) => {
      const fields = config.fields.map((field) => `${field(item) || ''}`)
      const score = Math.max(...fields.map((field) => scoreText(query, field)))
      return score > 0 ? { ...config.map(item), score } : null
    })
    .filter(Boolean)
    .sort((left, right) => right.score - left.score)
}

export function buildCommandPaletteResults(query, source) {
  const collections = [
    rankCollection(source.patients, query, {
      fields: [(item) => item.fullName, (item) => item.phone, (item) => item.email],
      map: (item) => ({
        id: item._id,
        category: 'Patients',
        title: item.fullName,
        subtitle: `${item.phone} • ${item.status}`,
        action: 'open-patient',
      }),
    }),
    rankCollection(source.appointments, query, {
      fields: [(item) => item.patient?.fullName || item.name, (item) => item.treatment?.name || item.service, (item) => item.date],
      map: (item) => ({
        id: item._id,
        category: 'Appointments',
        title: item.patient?.fullName || item.name,
        subtitle: `${item.treatment?.name || item.service} • ${item.date} ${item.time}`,
        action: 'open-appointment',
        patientId: item.patient?._id,
      }),
    }),
    rankCollection(source.invoices, query, {
      fields: [(item) => item.invoiceNumber, (item) => item.patient?.fullName, (item) => item.status],
      map: (item) => ({
        id: item._id,
        category: 'Invoices',
        title: item.invoiceNumber,
        subtitle: `${item.patient?.fullName || 'Patient'} • ${item.status} • INR ${item.totalAmount || 0}`,
        action: 'open-invoice',
      }),
    }),
    rankCollection(source.reviews, query, {
      fields: [(item) => item.patient?.fullName, (item) => item.comment],
      map: (item) => ({
        id: item._id,
        category: 'Reviews',
        title: item.patient?.fullName || 'Patient Review',
        subtitle: item.comment,
        action: 'open-review',
      }),
    }),
    rankCollection(source.doctors, query, {
      fields: [(item) => item.fullName, (item) => item.specialty],
      map: (item) => ({
        id: item._id,
        category: 'Doctors',
        title: item.fullName,
        subtitle: item.specialty,
        action: 'none',
      }),
    }),
    rankCollection(source.treatments, query, {
      fields: [(item) => item.name, (item) => item.category],
      map: (item) => ({
        id: item._id,
        category: 'Treatments',
        title: item.name,
        subtitle: item.category,
        action: 'none',
      }),
    }),
  ]

  return collections.flat().sort((left, right) => right.score - left.score).slice(0, 18)
}
