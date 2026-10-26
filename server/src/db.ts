import mongoose from 'mongoose';
import { UserModel } from './models/User.ts';
import { RoomModel } from './models/Room.ts';
import { BookingModel } from './models/Booking.ts';
import { INITIAL_USERS, INITIAL_ROOMS, INITIAL_BOOKINGS } from './data/initialData.ts';

let isConnected = false;

// Bad photo IDs to sanitize from legacy database records
const BAD_PHOTOS = [
  'photo-1590490360182',
  'photo-1598928506311',
  'photo-1616486338812',
  'photo-1596394516093',
  'photo-1578683010236',
];

const DEFAULT_ATLAS_URI = 'mongodb+srv://admin:admin%40123@hotelpro-db.wmyqjsw.mongodb.net/hotelpro?retryWrites=true&w=majority';

function formatMongoUri(rawUri: string): string {
  // Handles passwords containing '@' or special chars that must be percent-encoded
  try {
    const srvMatch = rawUri.match(/^(mongodb(?:\+srv)?:\/\/)([^:]+):(.*)@([^/?#]+)(.*)$/i);
    if (srvMatch) {
      const [, protocol, user, pass, host, rest] = srvMatch;
      const safeUser = encodeURIComponent(decodeURIComponent(user));
      const safePass = encodeURIComponent(decodeURIComponent(pass));
      const databasePath = rest && rest.startsWith('/') && rest.length > 1 ? rest : '/hotelpro?retryWrites=true&w=majority';
      return `${protocol}${safeUser}:${safePass}@${host}${databasePath}`;
    }
  } catch {}
  return rawUri;
}

export async function connectDB(uri?: string): Promise<boolean> {
  const raw = uri || process.env.MONGODB_URI || DEFAULT_ATLAS_URI;
  const mongoUri = formatMongoUri(raw);
  if (!mongoUri) {
    console.warn('[MongoDB Atlas] No MONGODB_URI provided in environment. Running in in-memory mode.');
    return false;
  }

  try {
    console.log('[MongoDB Atlas] Connecting to MongoDB Atlas cluster...');
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    isConnected = true;
    console.log('✅ [MongoDB Atlas] Successfully connected to MongoDB Atlas!');
    console.log(`[MongoDB Atlas] Database Name: ${mongoose.connection.name}`);

    // Auto-seed or sanitize data on connection
    await syncInitialData();
    return true;
  } catch (err: any) {
    console.error('❌ [MongoDB Atlas] Connection failed:', err.message);
    isConnected = false;
    return false;
  }
}

export function isDBConnected(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}

export async function syncInitialData(): Promise<void> {
  if (!isDBConnected()) return;

  try {
    // 1. Sync Users
    const userCount = await UserModel.countDocuments();
    if (userCount === 0) {
      console.log('[MongoDB Atlas] Seeding initial users...');
      await UserModel.insertMany(INITIAL_USERS as any);
      console.log(`[MongoDB Atlas] Seeded ${INITIAL_USERS.length} users.`);
    }

    // 2. Sync Rooms
    const roomCount = await RoomModel.countDocuments();
    if (roomCount === 0) {
      console.log('[MongoDB Atlas] Seeding initial clean hotel rooms...');
      await RoomModel.insertMany(INITIAL_ROOMS as any);
      console.log(`[MongoDB Atlas] Seeded ${INITIAL_ROOMS.length} rooms.`);
    } else {
      // Sanitize any existing room with old bad photos
      for (const freshRoom of INITIAL_ROOMS) {
        const existing = (await RoomModel.findOne({ roomNumber: freshRoom.roomNumber } as any).lean()) as any;
        if (existing) {
          const hasBadPhoto = existing.photos?.some((p: string) =>
            BAD_PHOTOS.some((bad) => p.includes(bad))
          );
          if (hasBadPhoto) {
            console.log(`[MongoDB Atlas] Updating Room ${freshRoom.roomNumber} with clean photos.`);
            await RoomModel.updateOne(
              { roomNumber: freshRoom.roomNumber } as any,
              { $set: { photos: freshRoom.photos, tagline: freshRoom.tagline, description: freshRoom.description } } as any
            );
          }
        }
      }
    }

    // 3. Sync Bookings
    const bookingCount = await BookingModel.countDocuments();
    if (bookingCount === 0) {
      console.log('[MongoDB Atlas] Seeding initial bookings...');
      await BookingModel.insertMany(INITIAL_BOOKINGS as any);
      console.log(`[MongoDB Atlas] Seeded ${INITIAL_BOOKINGS.length} bookings.`);
    }
  } catch (err: any) {
    console.error('[MongoDB Atlas] Error syncing initial data:', err.message);
  }
}

export async function resetDatabase(): Promise<{ users: number; rooms: number; bookings: number }> {
  if (!isDBConnected()) throw new Error('MongoDB Atlas is not connected');

  await UserModel.deleteMany({});
  await RoomModel.deleteMany({});
  await BookingModel.deleteMany({});

  await UserModel.insertMany(INITIAL_USERS as any);
  await RoomModel.insertMany(INITIAL_ROOMS as any);
  await BookingModel.insertMany(INITIAL_BOOKINGS as any);

  return {
    users: INITIAL_USERS.length,
    rooms: INITIAL_ROOMS.length,
    bookings: INITIAL_BOOKINGS.length,
  };
}
