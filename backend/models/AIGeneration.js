import mongoose from 'mongoose';

const { Schema } = mongoose;

const AIGenerationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    feature: {
      type: String,
      enum: [
        'PRODUCE_RECOGNITION',
        'LISTING_GENERATION',
        'PRICE_SUGGESTION',
        'BARTER_MATCHING',
        'HARVEST_ESTIMATE',
        'CHATBOT',
        'VOICE_LISTING'
      ],
      required: true,
      index: true
    },
    promptSummary: {
      type: String,
      default: ''
    },
    responseSummary: {
      type: String,
      default: ''
    },
    modelUsed: {
      type: String,
      default: 'gemini-1.5-flash'
    },
    tokensUsed: {
      type: Number,
      default: 0
    },
    isAdvisoryConfirmedByUser: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    collection: 'ai_generations'
  }
);

AIGenerationSchema.index({ userId: 1, createdAt: -1 });

export const AIGeneration = mongoose.model('AIGeneration', AIGenerationSchema);
export default AIGeneration;
