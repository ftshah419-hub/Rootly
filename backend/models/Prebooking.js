import mongoose from 'mongoose';

const { Schema } = mongoose;

const PrebookingSchema = new Schema(
  {
    harvestId: {
      type: Schema.Types.ObjectId,
      ref: 'Harvest',
      required: [true, 'Harvest ID is required'],
      index: true
    },
    growerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Grower ID is required'],
      index: true
    },
    buyerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Buyer ID is required'],
      index: true
    },
    quantity: {
      type: Number,
      required: [true, 'Prebooking quantity is required'],
      min: [0.1, 'Quantity must be at least 0.1']
    },
    agreedPrice: {
      type: Number,
      default: 0,
      min: 0
    },
    status: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'FULFILLED', 'CANCELLED'],
      default: 'PENDING',
      index: true
    },
    notes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true,
    collection: 'prebookings'
  }
);

PrebookingSchema.index({ harvestId: 1, status: 1 });
PrebookingSchema.index({ buyerId: 1, status: 1 });
PrebookingSchema.index({ growerId: 1, status: 1 });

export const Prebooking = mongoose.model('Prebooking', PrebookingSchema);
export default Prebooking;
