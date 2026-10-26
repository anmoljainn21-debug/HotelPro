import mongoose, { Schema } from 'mongoose';
import type { Room } from '../types.ts';

const RoomSchema = new Schema<Room>(
  {
    _id: { type: String, required: true },
    roomNumber: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    tagline: { type: String },
    capacity: { type: Number, required: true, default: 2 },
    bedType: { type: String, default: '1 King Bed' },
    sizeSqFt: { type: Number, default: 350 },
    view: { type: String, default: 'City View' },
    floor: { type: Number, default: 1 },
    rent: { type: Number, required: true },
    type: { type: String, enum: ['Delux', 'Non-Delux'], default: 'Delux' },
    photos: [{ type: String }],
    description: { type: String },
    amenities: [{ type: String }],
    rating: { type: Number, default: 4.8 },
    reviewCount: { type: Number, default: 20 },
    currentBookings: [
      {
        bookingId: { type: String },
        fromdate: { type: String },
        todate: { type: String },
        status: { type: String, enum: ['BOOKED', 'CANCELLED'], default: 'BOOKED' },
      },
    ],
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  {
    _id: false,
    versionKey: false,
  }
);

export const RoomModel = (mongoose.models.Room as mongoose.Model<Room>) || mongoose.model<Room>('Room', RoomSchema);
