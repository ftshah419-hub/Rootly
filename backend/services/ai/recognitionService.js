import { executeGeminiPrompt } from './aiService.js';

export const recognizeProduceImage = async (userId, imageBuffer, mimeType = 'image/jpeg') => {
  const prompt = `You are Rootly's Harvest AI botanist. Analyze this image of homegrown agricultural produce.
Return your evaluation strictly in JSON format with these exact keys:
{
  "identifiedProduce": "Common name of produce",
  "variety": "Estimated variety or cultivar",
  "ripenessStage": "Unripe, Approaching Ripe, Peak Ripe, or Overripe",
  "estimatedFreshnessScore": integer from 1 to 100,
  "visualAttributes": "Observations on skin, leaves, shape, color",
  "suggestedTags": ["tag1", "tag2", "tag3"],
  "organicNotice": "Note stating that organic/pesticide-free status cannot be verified from photos alone."
}
IMPORTANT: Do NOT claim the item is organic or pesticide-free solely from visual cues.`;

  const result = await executeGeminiPrompt({
    userId,
    feature: 'PRODUCE_RECOGNITION',
    prompt,
    inlineData: { buffer: imageBuffer, mimeType }
  });

  if (result.isSimulated || result.data) {
    return result.data || result;
  }

  try {
    const cleanedText = result.text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (err) {
    return {
      identifiedProduce: 'Homegrown Garden Produce',
      rawAnalysis: result.text,
      organicNotice: 'Organic verification requires grower confirmation.'
    };
  }
};
