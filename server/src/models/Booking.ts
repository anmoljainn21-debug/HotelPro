import mongoose, { Schema } from 'mongoose';
import type { Booking } from '../types.ts';

const BookingSchema = new Schema<Booking>(
  {
    _id: { type: String, required: true },
    roomNumber: { type: Number, required: true },
    roomType: { type: String, required: true },
    roomId: { type: String, default: '' },
    userId: { type: String, required: true },
    username: { type: String, required: true },
    customerPhone: { type: String, required: true },
    fromdate: { type: String, required: true },
    todate: { type: String, required: true },
    totalDays: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['BOOKED', 'CANCELLED'], default: 'BOOKED' },
    specialRequests: { type: String, default: '' },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  {
    _id: false,
    versionKey: false,
  }
);

export const BookingModel = (mongoose.models.Booking as mongoose.Model<Booking>) || mongoose.model<Booking>('Booking', BookingSchema);
