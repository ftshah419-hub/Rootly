import { User } from '../models/User.js';
import { Product } from '../models/Product.js';
import { ExchangeRequest } from '../models/ExchangeRequest.js';
import { Report } from '../models/Report.js';
import { VerificationRecord } from '../models/VerificationRecord.js';
import { AdminAction } from '../models/AdminAction.js';
import { AuditLog } from '../models/AuditLog.js';
import { ApiError } from '../utils/ApiError.js';

export const getDashboardMetrics = async () => {
  const [
    totalUsers,
    activeUsers,
    totalProducts,
    availableProducts,
    totalExchanges,
    pendingReports,
    pendingVerifications
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ accountStatus: 'ACTIVE' }),
    Product.countDocuments(),
    Product.countDocuments({ availabilityStatus: 'AVAILABLE' }),
    ExchangeRequest.countDocuments({ status: 'COMPLETED' }),
    Report.countDocuments({ status: 'PENDING' }),
    VerificationRecord.countDocuments({ status: 'SUBMITTED' })
  ]);

  return {
    users: { total: totalUsers, active: activeUsers },
    products: { total: totalProducts, available: availableProducts },
    completedExchanges: totalExchanges,
    moderationQueue: {
      pendingReports,
      pendingVerifications
    }
  };
};

export const updateUserAccountStatus = async (adminId, userId, newStatus, reason) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found.');

  // Prevent modifying fellow ADMIN accounts
  if (user.role === 'ADMIN' && adminId.toString() !== userId.toString()) {
    throw new ApiError(403, 'Cannot modify another administrator account.');
  }

  const oldStatus = user.accountStatus;
  user.accountStatus = newStatus;
  await user.save();

  // Record Admin Action
  await AdminAction.create({
    adminId,
    actionType:
      newStatus === 'BLOCKED'
        ? 'BLOCK_USER'
        : newStatus === 'SUSPENDED'
        ? 'SUSPEND_USER'
        : 'ACTIVATE_USER',
    targetType: 'USER',
    targetId: user._id,
    reason: reason || `Changed account status from ${oldStatus} to ${newStatus}`
  });

  // Record Audit Log
  await AuditLog.create({
    actorId: adminId,
    actorRole: 'ADMIN',
    action: `USER_STATUS_CHANGE_${newStatus}`,
    resource: `User/${user._id}`,
    details: { oldStatus, newStatus, reason }
  });

  return user.toSafeObject();
};

export const getReportsList = async () => {
  return await Report.find({ status: 'PENDING' })
    .populate('reporterId', 'name email')
    .populate('reportedUserId', 'name email accountStatus')
    .populate('reportedProductId', 'name pricing availabilityStatus');
};
