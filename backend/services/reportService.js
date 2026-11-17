import { Report } from '../models/Report.js';
import { ApiError } from '../utils/ApiError.js';

export const createReport = async (reporterId, reportData) => {
  const report = await Report.create({
    ...reportData,
    reporterId,
    status: 'PENDING'
  });
  return report;
};

export const getReports = async ({ status = 'PENDING', page = 1, limit = 20 }) => {
  const query = status ? { status } : {};
  const skip = (page - 1) * limit;

  const reports = await Report.find(query)
    .populate('reporterId', 'name email')
    .populate('reportedUserId', 'name email role accountStatus')
    .populate('reportedProductId', 'name pricing availabilityStatus')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Report.countDocuments(query);
  return { reports, total, page, limit };
};

export const resolveReport = async (reportId, adminId, { status, resolutionNotes }) => {
  const report = await Report.findById(reportId);
  if (!report) throw new ApiError(404, 'Report record not found.');

  report.status = status;
  report.resolutionNotes = resolutionNotes;
  report.resolvedBy = adminId;
  report.resolvedAt = new Date();
  await report.save();

  return report;
};
