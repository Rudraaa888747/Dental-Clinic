import mongoose from 'mongoose'

const permissionSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    description: String,
  },
  { timestamps: true },
)

export const Permission = mongoose.model('Permission', permissionSchema)
