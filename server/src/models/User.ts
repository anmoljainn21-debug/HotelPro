import mongoose, { Schema } from 'mongoose';
import type { User } from '../types.ts';

const UserSchema = new Schema<User>(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, default: 'password123' },
    phone: { type: String, required: true, trim: true },
    userType: { type: String, enum: ['admin', 'customer'], default: 'customer' },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  {
    _id: false,
    versionKey: false,
  }
);

export const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>('User', UserSchema);
