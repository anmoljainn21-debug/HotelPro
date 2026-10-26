export type UserType = 'admin' | 'customer';

export interface User {
  _id: string;
  name: string;
  email: string;
  password?: string;
  phone: string;
  userType: UserType;
  createdAt?: string;
}

export type RoomCategory = 'Delux' | 'Non-Delux';

export interface Room {
  _id: string;
  roomNumber: number;
  name: string;
  tagline?: string;
  capacity: number;
  bedType: string;
  sizeSqFt: number;
  view: string;
  floor: number;
  rent: number; // in INR (₹)
  type: RoomCategory;
  photos: string[];
  description: string;
  amenities: string[];
  rating?: number;
  reviewCount?: number;
  currentBookings?: {
    bookingId: string;
    fromdate: string;
    todate: string;
    status: 'BOOKED' | 'CANCELLED';
  }[];
  createdAt?: string;
}

export type BookingStatus = 'BOOKED' | 'CANCELLED';

export interface Booking {
  _id: string;
  roomNumber: number;
  roomType: string;
  roomId?: string;
  userId: string;
  username: string;
  customerPhone: string;
  fromdate: string;
  todate: string;
  totalDays: number;
  totalAmount: number; // in INR (₹)
  status: BookingStatus;
  createdAt: string;
  specialRequests?: string;
}

export interface AuthSession {
  user: User | null;
  token: string | null;
}
