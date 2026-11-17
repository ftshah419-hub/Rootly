import mongoose from 'mongoose';

const { Schema } = mongoose;

const ProductImageSchema = new Schema(
  {
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      default: ''
    },
    position: {
      type: Number,
      default: 0
    }
  },
  { _id: false }
);

const ProductSchema = new Schema(
  {
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Seller ID is required'],
      index: true
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category ID is required'],
      index: true
    },
    name: {
      type: String,
      required: [true, 'Produce name is required'],
      trim: true,
      maxlength: [120, 'Name cannot exceed 120 characters']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    exchangeType: {
      type: String,
      enum: ['SELL', 'BARTER', 'FREE'],
      required: true,
      index: true
    },
    pricing: {
      price: {
        type: Number,
        default: 0,
        min: [0, 'Price cannot be negative']
      },
      unit: {
        type: String,
        enum: ['kg', 'gram', 'piece', 'bunch', 'box', 'liter'],
        default: 'kg'
      },
      isNegotiable: {
        type: Boolean,
        default: false
      }
    },
    quantity: {
      available: {
        type: Number,
        required: [true, 'Available quantity is required'],
        min: [0, 'Quantity cannot be negative']
      },
      unit: {
        type: String,
        enum: ['kg', 'gram', 'piece', 'bunch', 'box', 'liter'],
        default: 'kg'
      }
    },
    images: {
      type: [ProductImageSchema],
      default: []
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude] - strict GeoJSON order
        required: [true, 'Location coordinates are required']
      },
      neighborhood: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: 'Kerala' },
      approximateDisplay: { type: String, default: '' },
      isExactLocationHidden: { type: Boolean, default: true }
    },
    availabilityStatus: {
      type: String,
      enum: ['AVAILABLE', 'RESERVED', 'EXCHANGED', 'OUT_OF_STOCK'],
      default: 'AVAILABLE',
      index: true
    },
    harvestStatus: {
      type: String,
      enum: ['READY_NOW', 'HARVESTING_SOON', 'JUST_HARVESTED'],
      default: 'READY_NOW'
    },
    organicDeclaration: {
      type: Boolean,
      default: false
    },
    viewsCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    collection: 'products'
  }
);

// Indexes
ProductSchema.index({ location: '2dsphere' });
ProductSchema.index({ sellerId: 1, availabilityStatus: 1 });
ProductSchema.index({ categoryId: 1, availabilityStatus: 1 });
ProductSchema.index({ exchangeType: 1, availabilityStatus: 1 });
ProductSchema.index({ availabilityStatus: 1, createdAt: -1 });

export const Product = mongoose.model('Product', ProductSchema);
export default Product;
