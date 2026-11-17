import mongoose from 'mongoose';

const { Schema } = mongoose;

const AIMessageSchema = new Schema(
  {
    aiConversationId: {
      type: Schema.Types.ObjectId,
      ref: 'AIConversation',
      required: true,
      index: true
    },
    sender: {
      type: String,
      enum: ['USER', 'ASSISTANT'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    tokens: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    collection: 'ai_messages'
  }
);

AIMessageSchema.index({ aiConversationId: 1, createdAt: 1 });

export const AIMessage = mongoose.model('AIMessage', AIMessageSchema);
export default AIMessage;
