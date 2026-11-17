import mongoose from 'mongoose';

const { Schema } = mongoose;

const AIConversationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    topic: {
      type: String,
      default: 'Harvest Buddy Assistant'
    },
    lastMessageAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    collection: 'ai_conversations'
  }
);

AIConversationSchema.index({ userId: 1, updatedAt: -1 });

export const AIConversation = mongoose.model('AIConversation', AIConversationSchema);
export default AIConversation;
