# HotelPro - Grand Luxury Hotel Reservation System

An enterprise-grade, full-stack hotel reservation and property management system crafted with modern aesthetics, verified hotel bedroom photography, Indian GST (2026) billing compliance, and MongoDB Atlas database integration.

---

## 🌟 Key Features

- **Guest Reservation Portal**:
  - Live inventory categorized into **Delux** and **Non-Delux** rooms.
  - 100% verified authentic hotel bedroom photography (no living room stock images, no outdoor mountain terraces).
  - Indian GST 2026 pricing rules:
    - **5% GST** on room tariffs ≤ ₹7,500/night.
    - **18% GST** on room tariffs > ₹7,500/night.
  - Interactive room booking modal with real-time date selection, tax computation, and reservation confirmation.
  - Personal booking tracking under "My Bookings" with cancellation support.

- **Admin Management Dashboard**:
  - Compact, high-density live operations board with occupancy statistics and revenue calculations.
  - Direct room management (add new rooms, update tariffs, view amenities).
  - Real-time reservation status tracking (`BOOKED` vs `CANCELLED`).

- **Database & Architecture**:
  - Built with **Node.js, Express, TypeScript, Mongoose, React, and Vite**.
  - Direct integration with **MongoDB Atlas** cloud cluster.
  - Resilient auto-connection, schema validation, and database auto-seeding.

---

## 📁 Repository Structure

```
hotelpro/
├── client/                 # React + TypeScript + Vite frontend
│   ├── src/
│   │   ├── components/     # UI Components (AdminDashboard, RoomCatalog, BookingModal, etc.)
│   │   ├── data/           # Types and clean initial datasets
│   │   ├── services/       # API services and proxy handlers
│   │   └── App.tsx         # Main application coordinator
│   └── package.json
└── server/                 # Express + TypeScript + Mongoose backend
    ├── src/
    │   ├── models/         # Mongoose schemas (User, Room, Booking)
    │   ├── db.ts           # MongoDB Atlas connection manager & seeder
    │   └── server.ts       # REST API endpoints (/api/rooms, /api/bookings, /api/auth)
    ├── .env.example        # Environment variable template
    └── package.json
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas cluster account

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory based on `.env.example`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/hotelpro?retryWrites=true&w=majority
```

Start the backend:
```bash
npm run dev
```
The server will run on `http://localhost:5000`.

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```
The client will run on `http://localhost:5173`.

---

## 🔒 Security Note

All secret credentials and environment files (`.env`) are strictly excluded from version control via `.gitignore`. Always configure environment variables securely on your hosting provider or in local `.env` files.
