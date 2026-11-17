import { GoogleGenerativeAI } from '@google/generative-ai';
import { ENV } from './env.js';

let genAI = null;

if (ENV.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);
}

export const getGeminiModel = (modelName = 'gemini-1.5-flash') => {
  if (!genAI) {
    if (!ENV.GEMINI_API_KEY) {
      console.warn('[Gemini AI] GEMINI_API_KEY is not set. AI services will operate in mock fallback mode.');
      return null;
    }
    genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);
  }
  return genAI.getGenerativeModel({ model: modelName });
};

export default genAI;
