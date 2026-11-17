import { BarterPreference } from '../models/BarterPreference.js';
import { BarterMatch } from '../models/BarterMatch.js';
import { Product } from '../models/Product.js';
import { ApiError } from '../utils/ApiError.js';

export const upsertBarterPreference = async (userId, data) => {
  const preference = await BarterPreference.findOneAndUpdate(
    { userId },
    { ...data, userId, isActive: true },
    { new: true, upsert: true }
  );
  return preference;
};

// Calculate distance between two coordinates in km (Haversine formula)
const calculateDistanceKm = (coord1, coord2) => {
  const [lon1, lat1] = coord1;
  const [lon2, lat2] = coord2;
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
};

export const findDirectBarterMatches = async (userId) => {
  const myPref = await BarterPreference.findOne({ userId, isActive: true });
  if (!myPref) {
    return [];
  }

  // Find other active barter preferences
  const candidatePrefs = await BarterPreference.find({
    userId: { $ne: userId },
    isActive: true
  }).populate('userId', 'name profile.gardenName profile.avatar location');

  const matches = [];

  for (const otherPref of candidatePrefs) {
    // Check geospatial distance
    const dist = calculateDistanceKm(
      myPref.location.coordinates,
      otherPref.location.coordinates
    );

    if (dist <= myPref.maxDistanceKm && dist <= otherPref.maxDistanceKm) {
      // Check category reciprocity
      const myHaveIds = myPref.haveCategories.map((c) => c.toString());
      const myWantIds = myPref.wantCategories.map((c) => c.toString());
      const otherHaveIds = otherPref.haveCategories.map((c) => c.toString());
      const otherWantIds = otherPref.wantCategories.map((c) => c.toString());

      const userAWantsWhatBHas = myWantIds.some((id) => otherHaveIds.includes(id));
      const userBWantsWhatAHas = otherWantIds.some((id) => myHaveIds.includes(id));

      let score = 40;
      const reasons = [];

      if (userAWantsWhatBHas && userBWantsWhatAHas) {
        score += 45;
        reasons.push('Mutual category interest match');
      } else if (userAWantsWhatBHas || userBWantsWhatAHas) {
        score += 20;
        reasons.push('Complementary produce interest');
      }

      if (dist <= 2) {
        score += 15;
        reasons.push('Walking proximity (< 2km)');
      } else if (dist <= 5) {
        score += 10;
        reasons.push('Short bicycle distance (< 5km)');
      }

      const matchScore = Math.min(score, 100);

      // Check if match already recorded
      let existingMatch = await BarterMatch.findOne({
        $or: [
          { userA: userId, userB: otherPref.userId._id },
          { userA: otherPref.userId._id, userB: userId }
        ]
      });

      if (!existingMatch) {
        existingMatch = await BarterMatch.create({
          userA: userId,
          userB: otherPref.userId._id,
          preferenceA: myPref._id,
          preferenceB: otherPref._id,
          matchScore,
          matchReasons: reasons,
          distanceKm: dist,
          status: 'SUGGESTED'
        });
      }

      matches.push({
        matchId: existingMatch._id,
        user: otherPref.userId,
        matchScore,
        matchReasons: reasons,
        distanceKm: dist,
        otherHaveDescription: otherPref.haveProduceDescription,
        otherWantDescription: otherPref.wantProduceDescription,
        status: existingMatch.status
      });
    }
  }

  // Sort by highest match score
  return matches.sort((a, b) => b.matchScore - a.matchScore);
};
