import mongoose from 'mongoose'

const roleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }],
  },
  { timestamps: true },
)

export const Role = mongoose.model('Role', roleSchema)
