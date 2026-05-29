import mongoose from 'mongoose'

const activityLogSchema = new mongoose.Schema(
  {
    actorEmail: String,
    actorRole: String,
    action: { type: String, required: true },
    entityType: String,
    entityId: mongoose.Schema.Types.ObjectId,
    metadata: Object,
  },
  { timestamps: true },
)

export const ActivityLog = mongoose.model('ActivityLog', activityLogSchema)
