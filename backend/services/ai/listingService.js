import { executeGeminiPrompt } from './aiService.js';

export const generateListingDescription = async (userId, { produceName, categoryName, quantity, notes }) => {
  const prompt = `You are Rootly's community copywriter for a neighborhood homegrown produce exchange.
Create an engaging, warm, rustic listing description for:
- Produce: ${produceName}
- Category: ${categoryName || 'Garden Produce'}
- Available Quantity: ${quantity || 'Fresh basket'}
- Grower's raw notes: ${notes || 'Freshly picked'}

Format your response strictly as JSON:
{
  "title": "A warm catchy listing title",
  "description": "Engaging 2-3 sentence English description celebrating local homegrown freshness",
  "malayalamDescription": "Natural Malayalam description conveying 'നാടൻ വീട്ടുതോട്ടത്തിലെ വിളവ്'",
  "suggestedTags": ["tag1", "tag2", "tag3", "tag4"]
}`;

  const result = await executeGeminiPrompt({
    userId,
    feature: 'LISTING_GENERATION',
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
      title: `${produceName} - Fresh Homegrown Harvest`,
      description: `Freshly harvested ${produceName} directly from our home garden. Grown with care and shared with our local neighborhood.`,
      malayalamDescription: `ഞങ്ങളുടെ വീട്ടുതോട്ടത്തിൽ നിന്നും സ്നേഹത്തോടെ വിളവെടുത്ത ${produceName}.`,
      suggestedTags: ['Homegrown', 'Fresh', 'LocalProduce']
    };
  }
};
