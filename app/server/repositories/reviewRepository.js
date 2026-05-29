import { Review } from '../models/Review.js'

export async function findReviews() {
  return await Review.find().populate('patient').sort({ createdAt: -1 }).lean()
}

export async function findReviewById(id) {
  return await Review.findById(id).populate('patient').lean()
}

export async function updateReview(id, payload) {
  return await Review.findByIdAndUpdate(id, payload, { new: true }).populate('patient').lean()
}
