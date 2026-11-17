import { Harvest } from '../models/Harvest.js';
import { ApiError } from '../utils/ApiError.js';

export const createHarvestAnnouncement = async (growerId, harvestData) => {
  const harvest = await Harvest.create({
    ...harvestData,
    growerId
  });
  return harvest;
};

export const getUpcomingHarvests = async ({ categoryId, maxDays = 30, limit = 20 }) => {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + maxDays);

  const query = {
    expectedHarvestDate: { $gte: new Date(), $lte: futureDate },
    status: { $in: ['GROWING', 'NEAR_HARVEST'] }
  };

  if (categoryId) query.categoryId = categoryId;

  return await Harvest.find(query)
    .populate('growerId', 'name profile.gardenName profile.avatar')
    .populate('categoryId', 'name slug icon')
    .sort({ expectedHarvestDate: 1 })
    .limit(limit);
};

export const getHarvestById = async (harvestId) => {
  const harvest = await Harvest.findById(harvestId)
    .populate('growerId', 'name profile.gardenName profile.avatar profile.bio location')
    .populate('categoryId', 'name slug icon');
  if (!harvest) throw new ApiError(404, 'Harvest listing not found.');
  return harvest;
};

export const getMyHarvests = async (growerId) => {
  return await Harvest.find({ growerId })
    .populate('categoryId', 'name slug icon')
    .sort({ createdAt: -1 });
};
