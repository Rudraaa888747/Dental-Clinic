import express from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import {
  createPublicAppointment,
  createPublicInquiry,
  getContent,
  getHealth,
} from '../controllers/publicController.js'

const router = express.Router()

router.get('/health', getHealth)
router.get('/content', asyncHandler(getContent))
router.post('/appointments', asyncHandler(createPublicAppointment))
router.post('/inquiries', asyncHandler(createPublicInquiry))

export default router
