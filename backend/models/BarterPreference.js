import mongoose from 'mongoose';

const { Schema } = mongoose;

const BarterPreferenceSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    haveCategories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Category'
      }
    ],
    haveProduceDescription: {
      type: String,
      default: ''
    },
    wantCategories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Category'
      }
    ],
    wantProduceDescription: {
      type: String,
      default: ''
    },
    maxDistanceKm: {
      type: Number,
      default: 5,
      min: 1,
      max: 50
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      }
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  {
    timestamps: true,
    collection: 'barter_preferences'
  }
);

BarterPreferenceSchema.index({ location: '2dsphere' });
BarterPreferenceSchema.index({ userId: 1, isActive: 1 });

export const BarterPreference = mongoose.model('BarterPreference', BarterPreferenceSchema);
export default BarterPreference;
