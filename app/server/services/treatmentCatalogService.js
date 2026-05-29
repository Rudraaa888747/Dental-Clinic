import { defaultContent } from '../data/defaultContent.js'
import { findClinicContentByKey, findTreatments, updateClinicContent, upsertTreatment } from '../repositories/clinicRepository.js'
import { emitClinicEvent } from './socketService.js'
import { logActivity } from './activityLogService.js'

function parseBasePrice(priceLabel = '') {
  const matches = `${priceLabel}`.match(/\d[\d,]*/g) || []
  if (!matches.length) return 0
  return Number(matches[0].replaceAll(',', ''))
}

function parseDurationMinutes(durationLabel = '') {
  const normalized = `${durationLabel}`.toLowerCase()
  const hourMatch = normalized.match(/(\d+)\s*hour/)
  const minuteMatch = normalized.match(/(\d+)\s*min/)

  if (hourMatch) return Number(hourMatch[1]) * 60
  if (minuteMatch) return Number(minuteMatch[1])
  return 60
}

export async function syncTreatmentCatalogFromContent(actor) {
  const contentRecord = await findClinicContentByKey('website-content')
  const content = contentRecord?.content || defaultContent
  const services = content.services || []

  const syncedTreatments = []
  for (const service of services) {
    const treatment = await upsertTreatment(
      service.id ? { sourceId: service.id } : { name: service.name },
      {
        sourceId: service.id,
        name: service.name,
        category: service.category,
        description: service.description,
        basePrice: parseBasePrice(service.price),
        priceLabel: service.price,
        durationLabel: service.duration,
        durationMinutes: parseDurationMinutes(service.duration),
        painLevel: service.painLevel,
        recovery: service.recovery,
        technology: service.technology,
        icon: service.icon,
        active: true,
      },
    )
    syncedTreatments.push(treatment)
  }

  if (actor) {
    await logActivity({
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'treatments.synced',
      entityType: 'Treatment',
      metadata: { count: syncedTreatments.length },
    })
  }

  emitClinicEvent('treatments:synced', {
    treatments: await findTreatments(),
  })

  return await findTreatments()
}

export async function getSettingsBundle() {
  const contentRecord = await findClinicContentByKey('website-content')
  const content = contentRecord?.content || defaultContent
  return {
    clinic: content.clinic,
    doctor: content.doctor,
    treatments: await findTreatments(),
  }
}

export async function updateClinicSettings(payload, actor) {
  const existingRecord = await findClinicContentByKey('website-content')
  const content = existingRecord?.content || defaultContent

  const nextContent = {
    ...content,
    clinic: {
      ...content.clinic,
      ...(payload.clinic || {}),
    },
  }

  await updateClinicContent('website-content', nextContent)

  if (actor) {
    await logActivity({
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'settings.updated',
      entityType: 'ClinicContent',
      metadata: { fields: Object.keys(payload.clinic || {}) },
    })
  }

  emitClinicEvent('settings:updated', { clinic: nextContent.clinic })
  return nextContent
}
