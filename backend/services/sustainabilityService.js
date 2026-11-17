import { SustainabilityRecord } from '../models/SustainabilityRecord.js';

export const recordExchangeSustainability = async (exchangeRequest) => {
  try {
    const existing = await SustainabilityRecord.findOne({
      exchangeRequestId: exchangeRequest._id
    });
    if (existing) return existing;

    const quantityKg = exchangeRequest.quantityRequested || 1;

    // Environmental calculation model (Hyperlocal Produce Exchange estimates):
    // 1. Food Waste Prevented: Homegrown surplus exchanged rather than discarded
    const foodWastePreventedKg = Math.round(quantityKg * 10) / 10;

    // 2. Food Miles Saved: Supermarket industrial supply chain avg ~150km vs. neighborhood walk/cycle ~1km
    const foodMilesSavedKm = Math.round(149 * 10) / 10;

    // 3. CO2e Saved: Approx 1.9 kg CO2e saved per kg food diverted from landfill methane + transport savings
    const co2SavedKg = Math.round((quantityKg * 1.9 + (149 * 0.12)) * 10) / 10;

    return await SustainabilityRecord.create({
      exchangeRequestId: exchangeRequest._id,
      userId: exchangeRequest.sellerId,
      foodWastePreventedKg,
      foodMilesSavedKm,
      co2SavedKg,
      calculationMethodology:
        'Advisory estimate based on 1.9kg CO2e factor per kg diverted organic produce plus avoided 149km average regional logistics transport emissions. This is an informative estimate and not a certified carbon offset.'
    });
  } catch (error) {
    console.error('[Sustainability Service Error]', error.message);
    return null;
  }
};

export const getCommunitySustainabilityStats = async () => {
  const records = await SustainabilityRecord.find();
  const totalWaste = records.reduce((sum, r) => sum + (r.foodWastePreventedKg || 0), 0);
  const totalMiles = records.reduce((sum, r) => sum + (r.foodMilesSavedKm || 0), 0);
  const totalCo2 = records.reduce((sum, r) => sum + (r.co2SavedKg || 0), 0);

  return {
    foodWastePreventedKg: Math.round(totalWaste * 10) / 10,
    foodMilesSavedKm: Math.round(totalMiles * 10) / 10,
    co2SavedKg: Math.round(totalCo2 * 10) / 10,
    totalExchangesCount: records.length,
    disclaimer:
      'All metrics are advisory sustainability estimates modeled for neighborhood food networks.'
  };
};
