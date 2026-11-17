import mongoose from 'mongoose';

const { Schema } = mongoose;

const HarvestSchema = new Schema(
  {
    growerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Grower ID is required'],
      index: true
    },
    produceName: {
      type: String,
      required: [true, 'Produce name is required'],
      trim: true
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category ID is required'],
      index: true
    },
    variety: {
      type: String,
      default: ''
    },
    plantingDate: {
      type: Date,
      default: null
    },
    expectedHarvestDate: {
      type: Date,
      required: [true, 'Expected harvest date is required'],
      index: true
    },
    estimatedQuantity: {
      amount: {
        type: Number,
        required: [true, 'Estimated quantity is required'],
        min: 0.1
      },
      unit: {
        type: String,
        enum: ['kg', 'gram', 'piece', 'bunch', 'box', 'liter'],
        default: 'kg'
      },
      isAIEstimated: {
        type: Boolean,
        default: false
      }
    },
    status: {
      type: String,
      enum: ['GROWING', 'NEAR_HARVEST', 'HARVESTED', 'CANCELLED'],
      default: 'GROWING',
      index: true
    },
    allowsPrebooking: {
      type: Boolean,
      default: true
    },
    prebookingPricePerUnit: {
      type: Number,
      default: 0
    },
    prebookedQuantity: {
      type: Number,
      default: 0
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [76.2711, 10.8505]
      },
      neighborhood: { type: String, default: '' },
      city: { type: String, default: '' }
    },
    notes: {
      type: String,
      default: ''
    },
    imageUrl: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true,
    collection: 'harvests'
  }
);

HarvestSchema.index({ growerId: 1, status: 1 });
HarvestSchema.index({ expectedHarvestDate: 1, status: 1 });
HarvestSchema.index({ location: '2dsphere' });

export const Harvest = mongoose.model('Harvest', HarvestSchema);
export default Harvest;
