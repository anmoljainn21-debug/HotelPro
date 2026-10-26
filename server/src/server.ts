import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { INITIAL_USERS, INITIAL_ROOMS, INITIAL_BOOKINGS } from './data/initialData.ts';
import type { User, Room, Booking } from './types.ts';
import { connectDB, isDBConnected, resetDatabase } from './db.ts';
import { UserModel } from './models/User.ts';
import { RoomModel } from './models/Room.ts';
import { BookingModel } from './models/Booking.ts';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

// In-memory fallback caches
let users: User[] = [...INITIAL_USERS];
let rooms: Room[] = [...INITIAL_ROOMS];
let bookings: Booking[] = [...INITIAL_BOOKINGS];

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logger for easy debugging
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// --- API ROUTES ---

// Health check
app.get('/api/health', async (_req: Request, res: Response) => {
  const dbConnected = isDBConnected();
  let userCount = users.length;
  let roomCount = rooms.length;
  let bookingCount = bookings.length;

  if (dbConnected) {
    try {
      userCount = await UserModel.countDocuments();
      roomCount = await RoomModel.countDocuments();
      bookingCount = await BookingModel.countDocuments();
    } catch {
      // fallback to memory counts
    }
  }

  res.json({
    status: 'online',
    system: 'HotelPro Luxury Management System Backend',
    port: PORT,
    database: dbConnected ? 'MongoDB Atlas (Connected)' : 'In-Memory (Fallback)',
    atlasCluster: 'hotelpro-db.wmyqjsw.mongodb.net',
    totalUsers: userCount,
    totalRooms: roomCount,
    totalBookings: bookingCount,
  });
});

// Auth: Login
app.post('/api/auth/login', async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }
  const normalizedEmail = String(email).trim().toLowerCase();

  let user: User | null = null;

  if (isDBConnected()) {
    try {
      user = (await UserModel.findOne({ email: normalizedEmail } as any).lean()) as User | null;
    } catch (err: any) {
      console.warn('[Auth] Database read failed, using memory:', err.message);
    }
  }

  if (!user) {
    user = users.find((u) => u.email.toLowerCase() === normalizedEmail) || null;
  }

  if (!user) {
    return res.status(404).json({ message: 'User not found. Please register.' });
  }

  return res.json({
    user,
    token: `jwt_${user._id}_${Date.now()}`,
  });
});

// Auth: Register
app.post('/api/auth/register', async (req: Request, res: Response) => {
  const { name, email, password, phone, userType } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ message: 'Name, email, and phone are required' });
  }
  const normalizedEmail = String(email).trim().toLowerCase();

  if (isDBConnected()) {
    try {
      const existing = await UserModel.findOne({ email: normalizedEmail } as any);
      if (existing) {
        return res.status(409).json({ message: 'Email is already registered' });
      }
    } catch (err: any) {
      console.warn('[Register] DB check failed:', err.message);
    }
  } else {
    const existing = users.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      return res.status(409).json({ message: 'Email is already registered' });
    }
  }

  const newUser: User = {
    _id: '68d' + Math.random().toString(16).substring(2, 10) + '5686a24fada09' + Math.floor(Math.random() * 900 + 100),
    name: String(name).trim(),
    email: normalizedEmail,
    password: password || 'defaultpass',
    phone: String(phone).trim(),
    userType: userType === 'admin' ? 'admin' : 'customer',
    createdAt: new Date().toISOString(),
  };

  if (isDBConnected()) {
    try {
      await UserModel.create(newUser as any);
    } catch (err: any) {
      console.warn('[Register] DB write failed, storing in memory:', err.message);
    }
  }
  users.push(newUser);

  return res.status(201).json({
    user: newUser,
    token: `jwt_${newUser._id}_${Date.now()}`,
  });
});

// Users: List All (Admin)
app.get('/api/users', async (_req: Request, res: Response) => {
  if (isDBConnected()) {
    try {
      const dbUsers = await UserModel.find().lean();
      return res.json(dbUsers);
    } catch (err: any) {
      console.warn('[Users] DB read failed, falling back to memory:', err.message);
    }
  }
  return res.json(users);
});

// Rooms: List All
app.get('/api/rooms', async (_req: Request, res: Response) => {
  if (isDBConnected()) {
    try {
      const dbRooms = await RoomModel.find().sort({ roomNumber: 1 }).lean();
      if (dbRooms && dbRooms.length > 0) {
        return res.json(dbRooms);
      }
    } catch (err: any) {
      console.warn('[Rooms] DB read failed, falling back to memory:', err.message);
    }
  }
  return res.json(rooms);
});

// Rooms: Add Room (Admin)
app.post('/api/rooms', async (req: Request, res: Response) => {
  const { roomNumber, name, capacity, rent, type, photos, description, bedType, sizeSqFt, view, floor, amenities } = req.body;
  if (!roomNumber || !rent || !type) {
    return res.status(400).json({ message: 'Room number, rent, and type are required' });
  }

  const rNum = Number(roomNumber);
  const newRoom: Room = {
    _id: '68d' + Math.random().toString(16).substring(2, 10) + 'e24b51e6c5a22' + Math.floor(Math.random() * 900 + 100),
    roomNumber: rNum,
    name: name || `Room ${rNum}`,
    capacity: Number(capacity) || 2,
    bedType: bedType || '1 King Bed',
    sizeSqFt: Number(sizeSqFt) || 350,
    view: view || 'City View',
    floor: Number(floor) || Math.floor(rNum / 100) || 1,
    rent: Number(rent),
    type: type === 'Non-Delux' ? 'Non-Delux' : 'Delux',
    photos: Array.isArray(photos) && photos.length > 0 ? photos : [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=85',
    ],
    description: description || 'Comfortable hotel accommodations in India with contemporary amenities and attached bathroom.',
    amenities: Array.isArray(amenities) && amenities.length > 0 ? amenities : [
      'Air Conditioning',
      'Attached Geyser Bath',
      'Free High-Speed Wi-Fi',
      'Smart LED TV',
      'Daily Housekeeping',
    ],
    rating: 5.0,
    reviewCount: 1,
    currentBookings: [],
    createdAt: new Date().toISOString(),
  };

  if (isDBConnected()) {
    try {
      await RoomModel.create(newRoom as any);
    } catch (err: any) {
      console.warn('[Rooms] DB write failed, saving to memory:', err.message);
    }
  }
  rooms.push(newRoom);

  return res.status(201).json(newRoom);
});

// Bookings: List All
app.get('/api/bookings', async (_req: Request, res: Response) => {
  if (isDBConnected()) {
    try {
      const dbBookings = await BookingModel.find().sort({ createdAt: -1 }).lean();
      return res.json(dbBookings);
    } catch (err: any) {
      console.warn('[Bookings] DB read failed, falling back to memory:', err.message);
    }
  }
  return res.json(bookings);
});

// Bookings: Create Booking
app.post('/api/bookings', async (req: Request, res: Response) => {
  const { roomNumber, roomType, roomId, userId, username, customerPhone, fromdate, todate, totalDays, totalAmount, specialRequests } = req.body;
  if (!roomNumber || !fromdate || !todate || !customerPhone) {
    return res.status(400).json({ message: 'Required booking details missing' });
  }

  const newBooking: Booking = {
    _id: '68d' + Math.random().toString(16).substring(2, 10) + '3cb3cc7831c89' + Math.floor(Math.random() * 900 + 100),
    roomNumber: Number(roomNumber),
    roomType: roomType || 'Delux Room',
    roomId: roomId || '',
    userId: userId || 'anonymous',
    username: username || 'Guest',
    customerPhone: String(customerPhone),
    fromdate: String(fromdate),
    todate: String(todate),
    totalDays: Number(totalDays) || 1,
    totalAmount: Number(totalAmount) || 1000,
    status: 'BOOKED',
    specialRequests: specialRequests || '',
    createdAt: new Date().toISOString(),
  };

  if (isDBConnected()) {
    try {
      await BookingModel.create(newBooking as any);
      await (RoomModel as any).updateOne(
        { roomNumber: newBooking.roomNumber },
        {
          $push: {
            currentBookings: {
              bookingId: newBooking._id,
              fromdate: newBooking.fromdate,
              todate: newBooking.todate,
              status: 'BOOKED',
            },
          },
        }
      );
    } catch (err: any) {
      console.warn('[Bookings] DB write failed, saving to memory:', err.message);
    }
  }

  bookings.unshift(newBooking);

  // Update in in-memory room
  const targetRoom = rooms.find((r) => r.roomNumber === newBooking.roomNumber);
  if (targetRoom) {
    if (!targetRoom.currentBookings) targetRoom.currentBookings = [];
    targetRoom.currentBookings.push({
      bookingId: newBooking._id,
      fromdate: newBooking.fromdate,
      todate: newBooking.todate,
      status: 'BOOKED',
    });
  }

  return res.status(201).json(newBooking);
});

// Bookings: Cancel
app.post('/api/bookings/:id/cancel', async (req: Request, res: Response) => {
  const { id } = req.params;

  let booking: Booking | null = null;

  if (isDBConnected()) {
    try {
      const updated = (await (BookingModel as any).findOneAndUpdate(
        { _id: id },
        { $set: { status: 'CANCELLED' } },
        { new: true }
      ).lean()) as Booking | null;

      if (updated) {
        booking = updated;
        await (RoomModel as any).updateOne(
          { roomNumber: updated.roomNumber, 'currentBookings.bookingId': id },
          { $set: { 'currentBookings.$.status': 'CANCELLED' } }
        );
      }
    } catch (err: any) {
      console.warn('[Bookings] DB cancel failed, updating in memory:', err.message);
    }
  }

  if (!booking) {
    const memoryBooking = bookings.find((b) => b._id === id);
    if (!memoryBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    memoryBooking.status = 'CANCELLED';
    booking = memoryBooking;
  }

  // Update in memory room
  const targetRoom = rooms.find((r) => r.roomNumber === booking!.roomNumber);
  if (targetRoom && targetRoom.currentBookings) {
    const cb = targetRoom.currentBookings.find((c) => c.bookingId === id);
    if (cb) cb.status = 'CANCELLED';
  }

  return res.json(booking);
});

// Reset database / seed state
app.post('/api/reset', async (_req: Request, res: Response) => {
  if (isDBConnected()) {
    try {
      const stats = await resetDatabase();
      users = [...INITIAL_USERS];
      rooms = [...INITIAL_ROOMS];
      bookings = [...INITIAL_BOOKINGS];
      return res.json({
        message: 'MongoDB Atlas and local state reset to screenshot dataset',
        stats,
      });
    } catch (err: any) {
      console.warn('[Reset] DB reset failed, falling back to memory reset:', err.message);
    }
  }

  users = [...INITIAL_USERS];
  rooms = [...INITIAL_ROOMS];
  bookings = [...INITIAL_BOOKINGS];
  return res.json({ message: 'Database reset to screenshot dataset (in-memory)', users, rooms, bookings });
});

// Start Server and connect to MongoDB Atlas
async function startServer() {
  await connectDB();

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HotelPro Backend Server running at http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
}

startServer();
