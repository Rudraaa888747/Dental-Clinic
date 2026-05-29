import { ActivityLog } from '../models/ActivityLog.js'
import { emitClinicEvent } from './socketService.js'

export async function logActivity(payload) {
  const activity = await ActivityLog.create(payload)
  const record = await ActivityLog.findById(activity._id).lean()
  emitClinicEvent('activity:new', { activity: record })
  return record
}

export async function listActivityLogs(search = '') {
  const filter = search
    ? {
        $or: [
          { action: { $regex: search, $options: 'i' } },
          { actorEmail: { $regex: search, $options: 'i' } },
          { entityType: { $regex: search, $options: 'i' } },
        ],
      }
    : {}

  return await ActivityLog.find(filter).sort({ createdAt: -1 }).limit(60).lean()
}
