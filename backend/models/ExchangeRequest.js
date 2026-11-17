import mongoose from 'mongoose';

const { Schema } = mongoose;

const OfferedItemSchema = new Schema(
  {
    description: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    unit: { type: String, default: 'kg' },
    estimatedValue: { type: Number, default: 0 },
    offeredProductId: { type: Schema.Types.ObjectId, ref: 'Product' }
  },
  { _id: false }
);

const ExchangeRequestSchema = new Schema(
  {
    requesterId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Requester ID is required'],
      index: true
    },
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Seller ID is required'],
      index: true
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product ID is required'],
      index: true
    },
    requestType: {
      type: String,
      enum: ['BUY', 'BARTER', 'FREE'],
      required: true,
      index: true
    },
    quantityRequested: {
      type: Number,
      required: [true, 'Quantity requested is required'],
      min: [0.01, 'Quantity must be greater than zero']
    },
    offeredItems: {
      type: [OfferedItemSchema],
      default: []
    },
    offeredPrice: {
      type: Number,
      default: 0,
      min: 0
    },
    message: {
      type: String,
      trim: true,
      default: ''
    },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'SCHEDULED', 'COMPLETED'],
      default: 'PENDING',
      index: true
    },
    rejectionReason: {
      type: String,
      default: ''
    },
    completedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    collection: 'exchange_requests'
  }
);

ExchangeRequestSchema.index({ productId: 1, status: 1 });
ExchangeRequestSchema.index({ requesterId: 1, status: 1 });
ExchangeRequestSchema.index({ sellerId: 1, status: 1 });

export const ExchangeRequest = mongoose.model('ExchangeRequest', ExchangeRequestSchema);
export default ExchangeRequest;
