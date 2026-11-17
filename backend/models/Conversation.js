import mongoose from 'mongoose';

const { Schema } = mongoose;

const ConversationSchema = new Schema(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      }
    ],
    lastMessage: {
      text: { type: String, default: '' },
      senderId: { type: Schema.Types.ObjectId, ref: 'User' },
      createdAt: { type: Date, default: Date.now }
    },
    exchangeRequestId: {
      type: Schema.Types.ObjectId,
      ref: 'ExchangeRequest'
    },
    unreadCounts: {
      type: Map,
      of: Number,
      default: {}
    }
  },
  {
    timestamps: true,
    collection: 'conversations'
  }
);

ConversationSchema.index({ participants: 1 });
ConversationSchema.index({ updatedAt: -1 });

export const Conversation = mongoose.model('Conversation', ConversationSchema);
export default Conversation;
