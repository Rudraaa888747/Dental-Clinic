import { assert } from './sharedValidators.js'

export function validateReviewReply(payload = {}) {
  assert(payload.reply?.trim(), 'Reply text is required.')
}
