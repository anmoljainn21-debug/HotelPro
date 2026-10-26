# HotelPro - Luxury Hotel Booking & Management Suite

A full-stack, enterprise-grade hotel booking and management platform designed with premium aesthetics, authentic imagery, Indian GST pricing compliance, and MongoDB Atlas database integration.

---

## 🌟 Key Features

- **Guest Portal**:
  - Real-time room availability and categorization (Deluxe & Non-Deluxe: Single, Double, Suite, Penthouse, Presidential).
  - Authentic, verified hotel interior photography (clean bedroom views, no stock living rooms).
  - 2026 Indian GST calculation (12% for <= ₹7,500/night; 18% for > ₹7,500/night) with itemized breakdown.
  - Multi-room booking, check-in/check-out date picker, and instant confirmation.

- **Admin Dashboard**:
  - Live occupancy and revenue metrics.
  - Compact, high-density booking cards with prominent room number badges.
  - Room management (add, edit, toggle availability, update price).
  - Booking status management (Confirmed, Checked In, Checked Out, Cancelled).

- **Cloud Database & Security**:
  - MongoDB Atlas cloud integration with Mongoose ODM schemas (`User`, `Room`, `Booking`).
  - Automatic connection resilience and fallback mechanisms.
  - Initial data auto-seeding on fresh database setup.

---

## 🏗️ Architecture

```
HotelPro/
├── client/                 # React frontend with Vite & Tailwind CSS
│   ├── src/
│   │   ├── components/     # UI Components (AdminDashboard, RoomCard, BookingModal, etc.)
│   │   ├── data/           # Types and initial datasets
│   │   └── App.tsx         # Main application coordinator
│   └── package.json
└── server/                 # Express backend with TypeScript & Mongoose
    ├── src/
    │   ├── models/         # Mongoose schemas (User, Room, Booking)
    │   ├── db.ts           # MongoDB Atlas connection manager & seeder
    │   └── server.ts       # REST API endpoints (/api/rooms, /api/bookings, /api/auth)
    └── package.json
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js (v18+)
- npm or yarn
- MongoDB Atlas cluster connection string

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory (based on `.env.example`):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/hotelpro?retryWrites=true&w=majority
```

Start the backend development server:
```bash
npm run dev
```
Backend will run at `http://localhost:5000`.

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```
Frontend will run at `http://localhost:5173`.

---

## 🔐 Environment & Security Note

Sensitive files such as `.env` and secret credentials are intentionally excluded from git tracking via `.gitignore`. Always use `.env.example` as a template for production or local deployment.
