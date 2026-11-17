import { VerificationRecord } from '../models/VerificationRecord.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';

export const submitGardenVerification = async (userId, evidenceData) => {
  const existing = await VerificationRecord.findOne({
    userId,
    status: { $in: ['SUBMITTED', 'UNDER_REVIEW', 'APPROVED'] }
  });

  if (existing) {
    if (existing.status === 'APPROVED') {
      throw new ApiError(400, 'Your garden has already been verified.');
    }
    throw new ApiError(400, 'You already have a pending verification request under review.');
  }

  return await VerificationRecord.create({
    userId,
    verificationType: evidenceData.verificationType || 'HOME_GARDEN',
    evidence: evidenceData.evidence,
    status: 'SUBMITTED'
  });
};

export const reviewVerification = async (recordId, adminId, { status, reviewNotes }) => {
  const record = await VerificationRecord.findById(recordId);
  if (!record) throw new ApiError(404, 'Verification record not found.');

  record.status = status;
  record.reviewNotes = reviewNotes;
  record.reviewedBy = adminId;
  if (status === 'APPROVED') {
    record.approvedAt = new Date();
  }
  await record.save();

  return record;
};
