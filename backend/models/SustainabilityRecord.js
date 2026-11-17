import mongoose from 'mongoose';

const { Schema } = mongoose;

const SustainabilityRecordSchema = new Schema(
  {
    exchangeRequestId: {
      type: Schema.Types.ObjectId,
      ref: 'ExchangeRequest',
      unique: true,
      sparse: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    foodWastePreventedKg: {
      type: Number,
      default: 0,
      min: 0
    },
    foodMilesSavedKm: {
      type: Number,
      default: 0,
      min: 0
    },
    co2SavedKg: {
      type: Number,
      default: 0,
      min: 0
    },
    calculationMethodology: {
      type: String,
      default:
        'Estimates based on average supermarket transport distance (approx. 150km supply chain) versus zero-mile homegrown pickup, with 1.9kg CO2e factor per kg organic waste prevented from landfill. Advisory estimate only, not certified commercial carbon offset.'
    }
  },
  {
    timestamps: true,
    collection: 'sustainability_records'
  }
);

SustainabilityRecordSchema.index({ userId: 1, createdAt: -1 });

export const SustainabilityRecord = mongoose.model('SustainabilityRecord', SustainabilityRecordSchema);
export default SustainabilityRecord;
