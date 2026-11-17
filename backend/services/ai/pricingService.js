import { Product } from '../../models/Product.js';
import { executeGeminiPrompt } from './aiService.js';

export const suggestPrice = async (userId, { produceName, categoryId, quantityUnit = 'kg' }) => {
  // Query actual existing listings in the database
  const query = {
    exchangeType: 'SELL',
    availabilityStatus: 'AVAILABLE',
    'pricing.unit': quantityUnit
  };

  if (categoryId) {
    query.categoryId = categoryId;
  }

  const existingProducts = await Product.find(query).select('pricing name').limit(30);

  let realPrices = [];
  if (existingProducts.length > 0) {
    // Check for matching name or category
    const nameRegex = new RegExp(produceName, 'i');
    const exactMatches = existingProducts.filter((p) => nameRegex.test(p.name));
    const targetSet = exactMatches.length > 0 ? exactMatches : existingProducts;
    realPrices = targetSet.map((p) => p.pricing.price).filter((p) => p > 0);
  }

  let realStats = null;
  if (realPrices.length >= 2) {
    realPrices.sort((a, b) => a - b);
    const median = realPrices[Math.floor(realPrices.length / 2)];
    const min = realPrices[0];
    const max = realPrices[realPrices.length - 1];
    realStats = {
      sampleCount: realPrices.length,
      min,
      max,
      median,
      average: Math.round(realPrices.reduce((a, b) => a + b, 0) / realPrices.length)
    };
  }

  const prompt = `You are Rootly's fair local agricultural exchange advisor.
Analyze fair community price guidance for:
Produce: ${produceName}
Unit: ${quantityUnit}
Actual platform active listings data: ${
    realStats
      ? `Based on ${realStats.sampleCount} active local listings: Min ₹${realStats.min}, Max ₹${realStats.max}, Median ₹${realStats.median}`
      : 'No active local listings currently recorded for this exact item in the database.'
  }

Return JSON with exact keys:
{
  "suggestedPrice": number (integer in INR),
  "priceRange": { "min": number, "max": number },
  "unit": "${quantityUnit}",
  "basis": "Explain if based on real neighborhood active listings or regional fair benchmark",
  "disclaimer": "Clear advisory statement that growers set their own fair price."
}
DO NOT claim this is a government mandated or official wholesale APMC rate.`;

  const result = await executeGeminiPrompt({
    userId,
    feature: 'PRICE_SUGGESTION',
    prompt
  });

  if (result.isSimulated || result.data) {
    const data = result.data || result;
    if (realStats) {
      data.suggestedPrice = realStats.median;
      data.priceRange = { min: realStats.min, max: realStats.max };
      data.basis = `Based on ${realStats.sampleCount} active listings in your community.`;
    }
    return data;
  }

  try {
    const cleaned = result.text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    if (realStats) {
      parsed.realPlatformData = realStats;
    }
    return parsed;
  } catch (err) {
    return {
      suggestedPrice: realStats ? realStats.median : 40,
      priceRange: realStats ? { min: realStats.min, max: realStats.max } : { min: 30, max: 50 },
      unit: quantityUnit,
      basis: realStats
        ? `Derived from ${realStats.sampleCount} local community listings.`
        : 'Estimated advisory suggestion based on regional backyard garden averages.',
      disclaimer: 'Advisory only. Home growers maintain full freedom to set their own exchange values.'
    };
  }
};
