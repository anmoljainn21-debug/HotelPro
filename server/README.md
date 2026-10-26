# HotelPro — Backend API Server

Fast Node.js & Express REST API server with TypeScript, CORS, and in-memory persistence.

## API Endpoints
- `GET  /api/health` — System status and total counts
- `POST /api/auth/login` — User authentication
- `POST /api/auth/register` — New user registration
- `GET  /api/users` — List registered users
- `GET  /api/rooms` — List hotel rooms & live bookings
- `POST /api/rooms` — Create room (Admin)
- `GET  /api/bookings` — List all reservations
- `POST /api/bookings` — Create reservation
- `POST /api/bookings/:id/cancel` — Cancel reservation
- `POST /api/reset` — Reset database to seed dataset

## Scripts
```bash
# Install dependencies
npm install

# Start backend dev server on http://localhost:5000 (with auto-reload)
npm run dev

# Start production server
npm start

# Typecheck build
npm run build
```
