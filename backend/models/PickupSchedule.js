import mongoose from 'mongoose';

const { Schema } = mongoose;

const PickupScheduleSchema = new Schema(
  {
    exchangeRequestId: {
      type: Schema.Types.ObjectId,
      ref: 'ExchangeRequest',
      required: true,
      index: true
    },
    buyerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    pickupDate: {
      type: Date,
      required: true
    },
    timeSlot: {
      type: String,
      default: 'Morning (9:00 AM - 12:00 PM)'
    },
    exactPickupAddress: {
      type: String,
      required: true
    },
    pickupLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [76.2711, 10.8505]
      }
    },
    status: {
      type: String,
      enum: ['PROPOSED', 'CONFIRMED', 'RESCHEDULED', 'COMPLETED', 'CANCELLED'],
      default: 'PROPOSED',
      index: true
    },
    specialInstructions: {
      type: String,
      default: ''
    },
    confirmedByBuyer: {
      type: Boolean,
      default: false
    },
    confirmedBySeller: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    collection: 'pickup_schedules'
  }
);

PickupScheduleSchema.index({ pickupDate: 1, status: 1 });

export const PickupSchedule = mongoose.model('PickupSchedule', PickupScheduleSchema);
export default PickupSchedule;
