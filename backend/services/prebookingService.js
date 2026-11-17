import { Prebooking } from '../models/Prebooking.js';
import { Harvest } from '../models/Harvest.js';
import { ApiError } from '../utils/ApiError.js';
import { createNotification } from './notificationService.js';

export const createPrebooking = async ({ harvestId, buyerId, quantity, agreedPrice, notes }) => {
  const harvest = await Harvest.findById(harvestId);
  if (!harvest) throw new ApiError(404, 'Harvest listing not found.');

  if (!harvest.allowsPrebooking) {
    throw new ApiError(400, 'Prebooking is not enabled for this upcoming harvest.');
  }

  if (harvest.growerId.toString() === buyerId.toString()) {
    throw new ApiError(400, 'You cannot prebook your own harvest.');
  }

  const remainingQuantity = harvest.estimatedQuantity.amount - harvest.prebookedQuantity;
  if (quantity > remainingQuantity) {
    throw new ApiError(
      400,
      `Requested quantity (${quantity}) exceeds remaining harvest capacity (${remainingQuantity} ${harvest.estimatedQuantity.unit}).`
    );
  }

  const prebooking = await Prebooking.create({
    harvestId,
    growerId: harvest.growerId,
    buyerId,
    quantity,
    agreedPrice: agreedPrice || harvest.prebookingPricePerUnit * quantity,
    notes,
    status: 'PENDING'
  });

  // Update harvest booked quantity
  harvest.prebookedQuantity += quantity;
  await harvest.save();

  await createNotification({
    recipientId: harvest.growerId,
    senderId: buyerId,
    title: 'New Prebooking Request',
    message: `A neighbor requested to prebook ${quantity} ${harvest.estimatedQuantity.unit} of your upcoming ${harvest.produceName}.`,
    type: 'PREBOOKING_CONFIRMED',
    link: `/harvests/${harvest._id}`
  });

  return prebooking;
};

export const updatePrebookingStatus = async (prebookingId, growerId, status) => {
  const prebooking = await Prebooking.findById(prebookingId);
  if (!prebooking) throw new ApiError(404, 'Prebooking not found.');

  if (prebooking.growerId.toString() !== growerId.toString()) {
    throw new ApiError(403, 'Only the grower can update prebooking status.');
  }

  prebooking.status = status;
  await prebooking.save();
  return prebooking;
};
