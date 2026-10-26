import { User, Room, Booking } from '../types.ts';
import {
  getStoredUsers,
  saveStoredUsers,
  getStoredRooms,
  saveStoredRooms,
  getStoredBookings,
  saveStoredBookings,
  getStoredCurrentUser,
  saveStoredCurrentUser,
  resetToSeedData,
} from '../data/initialData.ts';

// Helper to simulate network latency for realistic feel
const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  // --- AUTH SERVICES ---
  async login(email: string, password?: string): Promise<{ user: User; token: string }> {
    await delay();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const data = await res.json();
        saveStoredCurrentUser(data.user);
        return data;
      }
    } catch {
      // Fallback to local storage store
    }

    const users = getStoredUsers();
    const normalizedEmail = email.trim().toLowerCase();
    const found = users.find((u) => u.email.toLowerCase() === normalizedEmail);

    if (!found) {
      throw new Error('User with this email not found. Please register.');
    }

    saveStoredCurrentUser(found);
    return {
      user: found,
      token: `jwt_token_${found._id}_${Date.now()}`,
    };
  },

  async register(userData: Omit<User, '_id'>): Promise<{ user: User; token: string }> {
    await delay();
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (res.ok) {
        const data = await res.json();
        const users = getStoredUsers();
        users.push(data.user);
        saveStoredUsers(users);
        saveStoredCurrentUser(data.user);
        return data;
      }
    } catch {
      // Fallback to local
    }

    const users = getStoredUsers();
    const existing = users.find((u) => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existing) {
      throw new Error('Email is already registered. Please login.');
    }

    const newUser: User = {
      ...userData,
      _id: '68d' + Math.random().toString(16).substring(2, 10) + '5686a24fada09' + Math.floor(Math.random() * 900 + 100),
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveStoredUsers(users);
    saveStoredCurrentUser(newUser);

    return {
      user: newUser,
      token: `jwt_token_${newUser._id}_${Date.now()}`,
    };
  },

  getCurrentUser(): User | null {
    return getStoredCurrentUser();
  },

  logout(): void {
    saveStoredCurrentUser(null);
  },

  // --- USER SERVICES ---
  async getAllUsers(): Promise<User[]> {
    await delay();
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        saveStoredUsers(data);
        return data;
      }
    } catch {
      // fallback
    }
    return getStoredUsers();
  },

  // --- ROOM SERVICES ---
  async getAllRooms(): Promise<Room[]> {
    await delay();
    try {
      const res = await fetch('/api/rooms');
      if (res.ok) {
        const data = await res.json();
        saveStoredRooms(data);
        return data;
      }
    } catch {
      // fallback
    }
    return getStoredRooms();
  },

  async addRoom(roomData: Omit<Room, '_id'>): Promise<Room> {
    await delay();
    try {
      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roomData),
      });
      if (res.ok) {
        const created = await res.json();
        const rooms = getStoredRooms();
        rooms.push(created);
        saveStoredRooms(rooms);
        return created;
      }
    } catch {
      // fallback
    }

    const rooms = getStoredRooms();
    const newRoom: Room = {
      ...roomData,
      _id: '68d' + Math.random().toString(16).substring(2, 10) + 'e24b51e6c5a22' + Math.floor(Math.random() * 900 + 100),
      currentBookings: [],
      createdAt: new Date().toISOString(),
    };

    rooms.push(newRoom);
    saveStoredRooms(rooms);
    return newRoom;
  },

  // --- BOOKING SERVICES ---
  async getAllBookings(): Promise<Booking[]> {
    await delay();
    try {
      const res = await fetch('/api/bookings');
      if (res.ok) {
        const data = await res.json();
        saveStoredBookings(data);
        return data;
      }
    } catch {
      // fallback
    }
    return getStoredBookings();
  },

  async createBooking(bookingInput: {
    roomNumber: number;
    roomType: string;
    roomId?: string;
    userId: string;
    username: string;
    customerPhone: string;
    fromdate: string;
    todate: string;
    totalDays: number;
    totalAmount: number;
    specialRequests?: string;
  }): Promise<Booking> {
    await delay();
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingInput),
      });
      if (res.ok) {
        const created = await res.json();
        const bookings = getStoredBookings();
        bookings.unshift(created);
        saveStoredBookings(bookings);
        return created;
      }
    } catch {
      // fallback
    }

    const bookings = getStoredBookings();
    const newBooking: Booking = {
      ...bookingInput,
      _id: '68d' + Math.random().toString(16).substring(2, 10) + '3cb3cc7831c89' + Math.floor(Math.random() * 900 + 100),
      status: 'BOOKED',
      createdAt: new Date().toISOString(),
    };

    bookings.unshift(newBooking);
    saveStoredBookings(bookings);

    // Also update room's currentBookings
    const rooms = getStoredRooms();
    const targetRoom = rooms.find((r) => r.roomNumber === bookingInput.roomNumber);
    if (targetRoom) {
      if (!targetRoom.currentBookings) targetRoom.currentBookings = [];
      targetRoom.currentBookings.push({
        bookingId: newBooking._id,
        fromdate: newBooking.fromdate,
        todate: newBooking.todate,
        status: 'BOOKED',
      });
      saveStoredRooms(rooms);
    }

    return newBooking;
  },

  async cancelBooking(bookingId: string): Promise<Booking> {
    await delay();
    try {
      const res = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: 'POST',
      });
      if (res.ok) {
        const updated = await res.json();
        const bookings = getStoredBookings().map((b) => (b._id === bookingId ? updated : b));
        saveStoredBookings(bookings);
        return updated;
      }
    } catch {
      // fallback
    }

    const bookings = getStoredBookings();
    const booking = bookings.find((b) => b._id === bookingId);
    if (!booking) throw new Error('Booking not found');

    booking.status = 'CANCELLED';
    saveStoredBookings(bookings);

    // Update in room
    const rooms = getStoredRooms();
    const targetRoom = rooms.find((r) => r.roomNumber === booking.roomNumber);
    if (targetRoom && targetRoom.currentBookings) {
      const cb = targetRoom.currentBookings.find((c) => c.bookingId === bookingId);
      if (cb) cb.status = 'CANCELLED';
      saveStoredRooms(rooms);
    }

    return booking;
  },

  resetData(): { users: User[]; rooms: Room[]; bookings: Booking[] } {
    return resetToSeedData();
  },
};
