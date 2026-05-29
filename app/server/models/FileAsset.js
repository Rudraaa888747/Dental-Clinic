import mongoose from 'mongoose'

const fileAssetSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
    label: { type: String, required: true },
    type: {
      type: String,
      enum: ['xray', 'prescription', 'treatment-photo', 'report', 'other'],
      default: 'other',
    },
    url: { type: String, required: true },
    mimeType: String,
    uploadedBy: String,
  },
  { timestamps: true },
)

export const FileAsset = mongoose.model('FileAsset', fileAssetSchema)
