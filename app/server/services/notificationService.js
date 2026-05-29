import { Notification } from '../models/Notification.js'
import { emitClinicEvent } from './socketService.js'

export async function createOperationalNotification(payload) {
  const notification = await Notification.create(payload)
  const record = await Notification.findById(notification._id).lean()
  emitClinicEvent('notification:new', { notification: record })
  return record
}

export async function listNotifications() {
  const notifications = await Notification.find().sort({ createdAt: -1 }).limit(20).lean()
  const unreadCount = notifications.filter((item) => !item.read).length
  return { notifications, unreadCount }
}

export async function markNotificationRead(id) {
  const notification = await Notification.findByIdAndUpdate(
    id,
    { read: true },
    { new: true },
  ).lean()

  emitClinicEvent('notification:updated', { notification })
  return notification
}
