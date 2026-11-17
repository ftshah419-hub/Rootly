import { AIConversation } from '../../models/AIConversation.js';
import { AIMessage } from '../../models/AIMessage.js';
import { executeGeminiPrompt } from './aiService.js';

export const chatWithHarvestBuddy = async (userId, { message, conversationId = null }) => {
  let aiConv = null;

  if (conversationId) {
    aiConv = await AIConversation.findOne({ _id: conversationId, userId });
  }

  if (!aiConv) {
    aiConv = await AIConversation.create({
      userId,
      topic: 'Harvest Buddy Garden Chat'
    });
  }

  // Save user message
  await AIMessage.create({
    aiConversationId: aiConv._id,
    sender: 'USER',
    content: message
  });

  // Fetch recent conversation history
  const history = await AIMessage.find({ aiConversationId: aiConv._id })
    .sort({ createdAt: -1 })
    .limit(6);
  history.reverse();

  const formattedHistory = history
    .map((m) => `${m.sender === 'USER' ? 'Neighbor' : 'Harvest Buddy'}: ${m.content}`)
    .join('\n');

  const systemInstruction = `You are Harvest Buddy, the warm, knowledgeable, community-focused garden advisor for the Rootly Homegrown Produce Exchange in Kerala.
You specialize in home gardening, companion planting, natural pest deterrence (neem oil, ash, bio-ferments), barter advice, and reducing food waste.
Keep answers warm, concise, and helpful. You can understand and respond in English and Malayalam as appropriate.`;

  const prompt = `${systemInstruction}\n\nRecent Conversation:\n${formattedHistory}\n\nNeighbor: ${message}\nHarvest Buddy:`;

  const result = await executeGeminiPrompt({
    userId,
    feature: 'CHATBOT',
    prompt
  });

  const replyText =
    result.text ||
    result.data?.reply ||
    'Hello neighbor! Make sure your soil stays well-drained and mulched. Feel free to ask me anything about your garden crops or upcoming harvests!';

  // Save assistant message
  await AIMessage.create({
    aiConversationId: aiConv._id,
    sender: 'ASSISTANT',
    content: replyText
  });

  aiConv.lastMessageAt = new Date();
  await aiConv.save();

  return {
    conversationId: aiConv._id,
    reply: replyText,
    isSimulated: result.isSimulated || false,
    disclaimer: result.disclaimer
  };
};
