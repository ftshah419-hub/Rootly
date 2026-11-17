import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required']
    },
    phone: {
      type: String,
      trim: true,
      default: ''
    },
    role: {
      type: String,
      enum: ['USER', 'ADMIN'],
      default: 'USER'
    },
    accountStatus: {
      type: String,
      enum: ['ACTIVE', 'SUSPENDED', 'BLOCKED', 'DEACTIVATED'],
      default: 'ACTIVE'
    },
    preferredLanguage: {
      type: String,
      enum: ['en', 'ml'],
      default: 'en'
    },
    profile: {
      bio: { type: String, default: '', maxlength: 500 },
      avatar: { type: String, default: '' },
      gardenName: { type: String, default: '' },
      gardenBio: { type: String, default: '' },
      interests: [{ type: String }]
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [76.2711, 10.8505] // Reference coordinates
      },
      address: { type: String, default: '' },
      neighborhood: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: 'Kerala' },
      postalCode: { type: String, default: '' },
      isExactLocationHidden: { type: Boolean, default: true }
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    collection: 'users'
  }
);

// Indexes
UserSchema.index({ location: '2dsphere' });
UserSchema.index({ role: 1, accountStatus: 1 });

// Password comparison method
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

// Safe representation: strip password hash
UserSchema.methods.toSafeObject = function () {
  const userObj = this.toObject();
  delete userObj.passwordHash;
  // If exact location is hidden, obscure exact coordinates for public consumption
  if (userObj.location && userObj.location.isExactLocationHidden) {
    userObj.location.approximateCoords = [
      Math.round(userObj.location.coordinates[0] * 100) / 100,
      Math.round(userObj.location.coordinates[1] * 100) / 100
    ];
  }
  return userObj;
};

export const User = mongoose.model('User', UserSchema);
export default User;
