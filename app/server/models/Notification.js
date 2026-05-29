import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    type: { type: String, default: 'info' },
    read: { type: Boolean, default: false },
    entityType: String,
    entityId: mongoose.Schema.Types.ObjectId,
  },
  { timestamps: true },
)

export const Notification = mongoose.model('Notification', notificationSchema)
