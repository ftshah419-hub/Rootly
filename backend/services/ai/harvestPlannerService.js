import { executeGeminiPrompt } from './aiService.js';

export const planHarvest = async (userId, { cropName, plantingDate, gardenAreaSqFt = 100 }) => {
  const prompt = `You are Rootly's Kerala Agro-Horticulture expert.
Estimate harvest timeline, potential yield, and milestone calendar for:
- Crop: ${cropName}
- Planting Date: ${plantingDate || 'Current Month'}
- Approximate Garden Bed Size: ${gardenAreaSqFt} sq ft

Return JSON:
{
  "crop": "${cropName}",
  "estimatedDaysToHarvest": number (integer days),
  "projectedHarvestDate": "Approximate date string",
  "estimatedYieldKg": number,
  "milestones": [
    { "phase": "Flowering / Tuber Swell", "approxDays": number, "careAction": "string" },
    { "phase": "Fruit Set", "approxDays": number, "careAction": "string" },
    { "phase": "Harvest Readiness", "approxDays": number, "careAction": "string" }
  ],
  "monsoonCareTips": "Practical Kerala seasonal garden advice",
  "isAIEstimated": true
}`;

  const result = await executeGeminiPrompt({
    userId,
    feature: 'HARVEST_ESTIMATE',
    prompt
  });

  if (result.isSimulated || result.data) {
    return {
      ...(result.data || result),
      isAIEstimated: true
    };
  }

  try {
    const cleaned = result.text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    parsed.isAIEstimated = true;
    return parsed;
  } catch (err) {
    return {
      crop: cropName,
      estimatedDaysToHarvest: 60,
      estimatedYieldKg: 10,
      milestones: [{ phase: 'Maturation', approxDays: 45, careAction: 'Provide organic mulch' }],
      isAIEstimated: true
    };
  }
};
