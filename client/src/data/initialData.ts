import type { User, Room, Booking } from '../types.ts';

export const INITIAL_USERS: User[] = [
  {
    _id: '68d224f1506b7d3f0b866aed',
    name: 'tousif',
    email: 'tousif@gmail.com',
    password: 'password123',
    phone: '9704927891',
    userType: 'admin',
    createdAt: '2025-09-20T10:00:00Z',
  },
  {
    _id: '68d2345d5686a24fada0994e',
    name: 'rohan',
    email: 'rohan3@gmail.com',
    password: 'password123',
    phone: '9704927800',
    userType: 'customer',
    createdAt: '2025-09-21T11:15:00Z',
  },
  {
    _id: '68d2356a5686a24fada09960',
    name: 'sid',
    email: 'sid@gmail.com',
    password: 'password123',
    phone: '9704927807',
    userType: 'customer',
    createdAt: '2025-09-22T09:30:00Z',
  },
  {
    _id: '68d235b05686a24fada09969',
    name: 'saisunny',
    email: 'sai@gmail.com',
    password: 'password123',
    phone: '9704927807',
    userType: 'customer',
    createdAt: '2025-09-22T14:45:00Z',
  },
  {
    _id: '68d3818579255d604fe9724c',
    name: 'sun',
    email: 's@gmai.com',
    password: 'password123',
    phone: '9704927807',
    userType: 'admin',
    createdAt: '2025-09-23T08:00:00Z',
  },
];

export const INITIAL_ROOMS: Room[] = [
  {
    _id: '68d230b8e24b51e6c5a22ad5',
    roomNumber: 101,
    name: 'Deluxe King Room',
    tagline: 'Spacious air-conditioned room with premium king-size bed and city view.',
    capacity: 2,
    bedType: '1 King Size Bed',
    sizeSqFt: 380,
    view: 'City View',
    floor: 3,
    rent: 2400,
    type: 'Delux',
    photos: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
    ],
    description:
      'Our Deluxe King Room is designed for comfortable business and leisure stays in India. Features plush king bedding with crisp white linen, split air conditioning, warm wooden headboard accents, 43-inch smart LED TV, work desk with ergonomic chair, and an en-suite modern bathroom with hot water geyser and complimentary bath essentials.',
    amenities: [
      'Split Air Conditioning',
      'Attached Bathroom with Geyser',
      'Complimentary High-speed Wi-Fi',
      'Electric Tea & Coffee Kettle',
      'Daily Housekeeping',
      '43-inch Smart LED TV',
      'Room Service Menu',
      'Mineral Water Bottles',
    ],
    rating: 4.9,
    reviewCount: 52,
    currentBookings: [
      {
        bookingId: '68d259fb3cb3cc7831c89406',
        fromdate: '23-09-2025',
        todate: '24-09-2025',
        status: 'CANCELLED',
      },
    ],
  },
  {
    _id: '68d23257e24b51e6c5a22ad7',
    roomNumber: 102,
    name: 'Executive Deluxe Room',
    tagline: 'Comfortable air-conditioned deluxe room with warm wooden styling and ambient lighting.',
    capacity: 2,
    bedType: '1 Queen Bed',
    sizeSqFt: 340,
    view: 'Garden View',
    floor: 2,
    rent: 1800,
    type: 'Delux',
    photos: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
    ],
    description:
      'The Executive Deluxe Room provides a serene stay with elegant wooden furnishings, comfortable queen-size bed, private attached bathroom with instant hot water, intercom phone, tea maker, and 24-hour room service. Perfect for corporate travelers and couples.',
    amenities: [
      'Air Conditioning',
      'Private Geyser Bathroom',
      'Free High-Speed Wi-Fi',
      'Intercom Telephone',
      'Tea & Coffee Maker',
      'Wardrobe with Luggage Rack',
      'Complimentary Toiletries',
      '24-Hour Front Desk Support',
    ],
    rating: 4.8,
    reviewCount: 46,
    currentBookings: [
      {
        bookingId: '68d2609d3cb3cc7831c8943f',
        fromdate: '23-09-2025',
        todate: '24-09-2025',
        status: 'BOOKED',
      },
    ],
  },
  {
    _id: '68d248bce5da9b6fb84ba237',
    roomNumber: 103,
    name: 'Grand Deluxe Double Room',
    tagline: 'Warm interior styling with plush double bedding, boutique armchairs and peaceful ambience.',
    capacity: 2,
    bedType: '1 Double Bed',
    sizeSqFt: 310,
    view: 'Courtyard View',
    floor: 1,
    rent: 1500,
    type: 'Delux',
    photos: [
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80',
    ],
    description:
      'Warm and inviting deluxe room featuring clean tiled flooring, soft lighting, spring mattress double bed, attached ceramic bathroom with shower, bedside charging ports, and flat-screen cable television. A reliable favorite for travellers seeking dependable comfort.',
    amenities: [
      'Air Conditioning',
      'Hot & Cold Water Shower',
      'Free Wi-Fi Internet',
      'Flat-Screen Cable TV',
      'Bedside Power Sockets',
      'Daily Newspaper on Request',
      'Full-Length Dressing Mirror',
    ],
    rating: 4.7,
    reviewCount: 38,
    currentBookings: [],
  },
  {
    _id: '68d381b179255d604fe97255',
    roomNumber: 104,
    name: 'Super Deluxe Family Room',
    tagline: 'Extra spacious deluxe room with dual bedding setup for comfortable family stays.',
    capacity: 4,
    bedType: '2 Double Beds',
    sizeSqFt: 460,
    view: 'City & Pool View',
    floor: 4,
    rent: 2800,
    type: 'Delux',
    photos: [
      'https://images.unsplash.com/photo-1568495248636-6432b97bd949?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1592229505726-ca121723b8ef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
    ],
    description:
      'Generously proportioned family room accommodating up to 4 adults. Offers spacious bedding with individual reading lamps, large wardrobe, private balcony seating, spacious bathroom with hot shower, mini refrigerator, and in-room amenities for family stays.',
    amenities: [
      'Dual Air Conditioners',
      'Spacious Attached Bath',
      'Mini Refrigerator',
      'High-Speed Wi-Fi',
      'Luggage Storage Almirah',
      'Complimentary Breakfast Option',
      'Private Balcony',
    ],
    rating: 4.9,
    reviewCount: 60,
    currentBookings: [
      {
        bookingId: '68d381e679255d604fe97265',
        fromdate: '25-09-2025',
        todate: '27-09-2025',
        status: 'CANCELLED',
      },
    ],
  },
  {
    _id: '68d4a9918c5e219fb093e11a',
    roomNumber: 105,
    name: 'Standard Non-Delux Room',
    tagline: 'Neat, budget-friendly non-AC room with high-speed ceiling fan and comfortable bed.',
    capacity: 1,
    bedType: '1 Single / Twin Bed',
    sizeSqFt: 220,
    view: 'Street View',
    floor: 1,
    rent: 900,
    type: 'Non-Delux',
    photos: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
    ],
    description:
      'A practical and clean non-deluxe accommodation for solo travelers and budget guests. Features a comfortable single bed with clean bedsheets, high-speed ceiling fan, attached private bathroom with running water and geyser, study chair, and high-speed Wi-Fi.',
    amenities: [
      'High-Speed Ceiling Fan',
      'Attached Clean Bathroom',
      'Free High-Speed Wi-Fi',
      'Hot Water Geyser on Request',
      'Desk & Chair',
      'Clean Linens & Towels',
      'Drinking Water Supply',
    ],
    rating: 4.6,
    reviewCount: 29,
    currentBookings: [],
  },
  {
    _id: '68d4b1248c5e219fb093e11b',
    roomNumber: 106,
    name: 'Classic Non-Delux Room',
    tagline: 'Affordable non-AC double room with cross ventilation and comfortable bedding.',
    capacity: 2,
    bedType: '1 Double Bed',
    sizeSqFt: 260,
    view: 'Quiet Lane View',
    floor: 2,
    rent: 1100,
    type: 'Non-Delux',
    photos: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1568495248636-6432b97bd949?auto=format&fit=crop&w=1200&q=80',
    ],
    description:
      'Ideal for couples and friends looking for comfortable non-deluxe lodging at an economical price. Equipped with double bed, large screened windows for natural air ventilation, ceiling fan, attached bathroom, charging points, and luggage space.',
    amenities: [
      'High-Speed Ceiling Fan',
      'Large Ventilated Windows',
      'Attached Private Bathroom',
      'Free Wi-Fi Access',
      'Wardrobe Unit',
      'Intercom Phone',
      'Daily Cleaning',
    ],
    rating: 4.6,
    reviewCount: 34,
    currentBookings: [],
  },
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    _id: '68d259fb3cb3cc7831c89406',
    roomNumber: 101,
    roomType: 'Deluxe King Room',
    roomId: '68d230b8e24b51e6c5a22ad5',
    userId: '68d2356a5686a24fada09960',
    username: 'sid',
    customerPhone: '9704927807',
    fromdate: '23-09-2025',
    todate: '24-09-2025',
    totalDays: 2,
    totalAmount: 4800,
    status: 'CANCELLED',
    createdAt: '2025-09-23T10:00:00Z',
    specialRequests: 'Upper floor room with city view.',
  },
  {
    _id: '68d2609d3cb3cc7831c8943f',
    roomNumber: 102,
    roomType: 'Executive Deluxe Room',
    roomId: '68d23257e24b51e6c5a22ad7',
    userId: '68d2356a5686a24fada09960',
    username: 'sid',
    customerPhone: '9704927807',
    fromdate: '23-09-2025',
    todate: '24-09-2025',
    totalDays: 2,
    totalAmount: 3600,
    status: 'BOOKED',
    createdAt: '2025-09-23T11:20:00Z',
    specialRequests: 'Quiet room away from lift.',
  },
  {
    _id: '68d381e679255d604fe97265',
    roomNumber: 104,
    roomType: 'Super Deluxe Family Room',
    roomId: '68d381b179255d604fe97255',
    userId: '68d2345d5686a24fada0994e',
    username: 'rohan',
    customerPhone: '9704927800',
    fromdate: '25-09-2025',
    todate: '27-09-2025',
    totalDays: 3,
    totalAmount: 8400,
    status: 'CANCELLED',
    createdAt: '2025-09-25T14:10:00Z',
    specialRequests: 'Extra mattress and early morning hot water requirement.',
  },
];

const STORAGE_KEYS = {
  USERS: 'hotelpro_users_v5',
  ROOMS: 'hotelpro_rooms_v5',
  BOOKINGS: 'hotelpro_bookings_v5',
  ACTIVE_USER: 'hotelpro_current_user_v5',
};

// Known bad photo patterns to automatically purge from cache
const BAD_PHOTO_PATTERNS = [
  'photo-1590490360182', // bed + sofa in front
  'photo-1598928506311', // white living room
  'photo-1616486338812', // boho couch with round clock
  'photo-1596394516093', // outdoor cliff with bed
  'photo-1578683010236', // rock desert villa
];

export function getStoredUsers(): User[] {
  if (typeof window === 'undefined') return INITIAL_USERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_USERS;
  }
}

export function saveStoredUsers(users: User[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

export function getStoredRooms(): Room[] {
  if (typeof window === 'undefined') return INITIAL_ROOMS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ROOMS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(INITIAL_ROOMS));
      return INITIAL_ROOMS;
    }
    const parsed: Room[] = JSON.parse(raw);
    // Self-healing check: if any cached room has bad photos, immediately replace with clean INITIAL_ROOMS
    const hasBadPhoto = parsed.some((r) =>
      r.photos?.some((p) => BAD_PHOTO_PATTERNS.some((bad) => p.includes(bad)))
    );
    if (hasBadPhoto || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(INITIAL_ROOMS));
      return INITIAL_ROOMS;
    }
    return parsed;
  } catch {
    return INITIAL_ROOMS;
  }
}

export function saveStoredRooms(rooms: Room[]): void {
  if (typeof window === 'undefined') return;
  // Before saving, ensure no bad photos get stored
  const sanitized = rooms.map((room) => {
    const defaultRoom = INITIAL_ROOMS.find((r) => r.roomNumber === room.roomNumber);
    const cleanedPhotos = (room.photos || []).map((photo, idx) => {
      const isBad = BAD_PHOTO_PATTERNS.some((bad) => photo.includes(bad));
      if (isBad && defaultRoom && defaultRoom.photos[idx]) {
        return defaultRoom.photos[idx];
      }
      return photo;
    });
    return { ...room, photos: cleanedPhotos };
  });
  localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(sanitized));
}

export function getStoredBookings(): Booking[] {
  if (typeof window === 'undefined') return INITIAL_BOOKINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
      return INITIAL_BOOKINGS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_BOOKINGS;
  }
}

export function saveStoredBookings(bookings: Booking[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
}

export function getStoredCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveStoredCurrentUser(user: User | null): void {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER);
  }
}

export function resetToSeedData(): { users: User[]; rooms: Room[]; bookings: Booking[] } {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(INITIAL_ROOMS));
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
  }
  return {
    users: [...INITIAL_USERS],
    rooms: [...INITIAL_ROOMS],
    bookings: [...INITIAL_BOOKINGS],
  };
}
