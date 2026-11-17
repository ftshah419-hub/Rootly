import { executeGeminiPrompt } from './aiService.js';

export const suggestBarterCombinations = async (userId, { haveItem, wantItem, quantityHave }) => {
  const prompt = `You are Rootly's barter economy coordinator.
Suggest 3 equitable, fair, friendly barter proposals for a home gardener who has:
- Offering: ${quantityHave || '1 basket'} of ${haveItem}
- Seeking: ${wantItem || 'Vegetables or Fruits'}

Return JSON:
{
  "compatibilityScore": number (1-100),
  "proposals": [
    {
      "offerRatio": "e.g., 2 kg Tapioca for 1 kg Tomatoes",
      "rationale": "Nutritional and effort parity explanation"
    }
  ],
  "exchangeEtiquetteTip": "Safety and courtesy reminder for local barter"
}`;

  const result = await executeGeminiPrompt({
    userId,
    feature: 'BARTER_MATCHING',
    prompt
  });

  if (result.isSimulated || result.data) {
    return result.data || result;
  }

  try {
    const cleaned = result.text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    return {
      compatibilityScore: 85,
      proposals: [
        {
          offerRatio: `Fair 1:1 or 2:1 ratio for ${haveItem} against ${wantItem}`,
          rationale: 'Balanced homegrown value parity.'
        }
      ],
      exchangeEtiquetteTip: 'Agree on pickup time and inspect items together with friendly neighborly respect.'
    };
  }
};
