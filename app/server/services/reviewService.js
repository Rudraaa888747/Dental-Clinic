import { findReviews, updateReview } from '../repositories/reviewRepository.js'
import { validateReviewReply } from '../validators/reviewValidators.js'
import { createOperationalNotification } from './notificationService.js'
import { logActivity } from './activityLogService.js'
import { emitClinicEvent } from './socketService.js'

export async function listReviews() {
  const reviews = await findReviews()
  const averageRating =
    reviews.reduce((sum, review) => sum + review.rating, 0) / Math.max(reviews.length, 1)

  return {
    reviews,
    analytics: {
      averageRating: Number(averageRating.toFixed(1)),
      totalReviews: reviews.length,
      featuredReviews: reviews.filter((review) => review.featured).length,
      pendingReplies: reviews.filter((review) => !review.adminReply).length,
    },
  }
}

export async function replyToReview(reviewId, payload, actor) {
  validateReviewReply(payload)
  const review = await updateReview(reviewId, {
    adminReply: payload.reply.trim(),
    repliedAt: new Date(),
  })

  await Promise.all([
    createOperationalNotification({
      title: 'Review reply posted',
      body: `A review response was posted for ${review.patient?.fullName || 'a patient review'}.`,
      type: 'review_replied',
      entityType: 'Review',
      entityId: review._id,
    }),
    logActivity({
      actorEmail: actor?.email,
      actorRole: actor?.role || 'assistant',
      action: 'review.replied',
      entityType: 'Review',
      entityId: review._id,
      metadata: { rating: review.rating },
    }),
  ])

  emitClinicEvent('review:updated', { review })
  return review
}
