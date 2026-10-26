import React, { useState } from 'react';
import { Room } from '../types.ts';
import {
  Bed,
  Calendar,
  Users,
  ShieldCheck,
  Clock,
  ArrowRight,
  Sparkles,
  Crown,
  MapPin,
  Phone,
  Mail,
  Star,
  CheckCircle2,
  Maximize2,
  Filter,
} from 'lucide-react';

interface LandingPageProps {
  rooms: Room[];
  onExploreRooms: () => void;
  onNavigateLogin: () => void;
  onNavigateRegister: () => void;
  onSelectRoom: (room: Room) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  rooms,
  onExploreRooms,
  onNavigateLogin,
  onNavigateRegister,
  onSelectRoom,
}) => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');
  const [selectedType, setSelectedType] = useState('ALL');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onExploreRooms();
  };

  // Preview rooms (first 4 rooms)
  const previewRooms = rooms.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#FBFBF9] flex flex-col font-sans text-stone-800">
      {/* ==============================================================
          CINEMATIC HERO SECTION
         ============================================================== */}
      <section className="relative min-h-[580px] flex items-center justify-center text-white pt-20 pb-28 px-4 sm:px-6 lg:px-8">
        {/* Real High-Resolution Luxury Hotel Background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=85"
            alt="HotelPro Grand Luxury"
            className="w-full h-full object-cover object-center scale-105"
          />
          {/* Multi-stop architectural gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-[#0B0F17]/80 to-[#0B0F17]/45"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          {/* Luxury Quality Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-900/85 backdrop-blur-md text-xs font-semibold text-[#D4AF37] border border-[#C5A880]/40 shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="tracking-[0.18em] uppercase">PREMIUM INDIAN HOSPITALITY & DELUXE ACCOMMODATIONS</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-serif font-bold tracking-tight text-white max-w-3xl mx-auto leading-[1.15]">
            Comfortable Stays & <span className="italic font-normal text-[#C5A880]">Timeless</span> Hospitality
          </h1>

          <p className="text-base sm:text-lg text-stone-300 max-w-2xl mx-auto font-light leading-relaxed">
            Welcome to <strong className="text-white font-medium">HotelPro</strong>. Discover our well-appointed Delux and Non-Delux rooms, check real-time availability across dates, and book with instant confirmation.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
            <button
              onClick={onExploreRooms}
              className="px-8 py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#C5A880] hover:from-[#e3bd48] hover:to-[#d4b58c] text-stone-950 font-bold text-xs uppercase tracking-[0.15em] rounded-xl shadow-xl transition-all cursor-pointer flex items-center gap-2"
            >
              <Bed className="w-4 h-4 text-stone-950" />
              <span>Explore Available Rooms</span>
            </button>
            <button
              onClick={onNavigateLogin}
              className="px-8 py-3.5 bg-stone-900/80 hover:bg-stone-900 text-stone-200 hover:text-white border border-stone-700/80 font-semibold text-xs uppercase tracking-[0.15em] rounded-xl backdrop-blur-md transition-all cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* ==============================================================
          FIXED PROMINENT SEARCH AVAILABILITY BAR (No clipping, fully visible)
         ============================================================== */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-14 relative z-30 w-full">
        <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-6 border border-stone-200">
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#C5A880]" /> Check-In Date
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A880] bg-white font-medium text-stone-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#C5A880]" /> Check-Out Date
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A880] bg-white font-medium text-stone-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-[#C5A880]" /> Room Category
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A880] bg-white font-medium text-stone-800 cursor-pointer"
              >
                <option value="ALL">All Categories</option>
                <option value="Delux">Delux (Air-Conditioned)</option>
                <option value="Non-Delux">Non-Delux (Standard)</option>
              </select>
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-2.5 px-5 bg-[#0B0F17] hover:bg-stone-900 text-[#D4AF37] font-bold text-xs tracking-wider uppercase rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md hover:shadow-lg h-[42px]"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Check Live Rates</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ==============================================================
          FEATURED ROOMS SHOWCASE (Clean cards, no text truncation)
         ============================================================== */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-stone-200 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-[#C5A880] text-xs font-bold uppercase tracking-[0.2em] mb-1">
              <Crown className="w-4 h-4" /> Recommended Rooms
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-950 tracking-tight">
              Featured Delux & Non-Delux Rooms
            </h2>
            <p className="text-sm text-stone-500 mt-1 max-w-xl">
              Authentic hotel rooms with comfortable spring mattresses, clean bathrooms, and 24-hour room service.
            </p>
          </div>
          <button
            onClick={onExploreRooms}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-900 hover:text-[#C5A880] transition-colors cursor-pointer group pb-1"
          >
            <span>View All Rooms</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {previewRooms.map((room) => (
            <div
              key={room._id}
              className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Natural Hotel Room Photo */}
              <div className="aspect-[4/3] w-full overflow-hidden bg-stone-100 relative">
                <img
                  src={room.photos[0]}
                  alt={room.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-md ${
                      room.type === 'Delux'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-stone-800 text-stone-200'
                    }`}
                  >
                    {room.type}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 bg-[#0B0F17]/85 backdrop-blur-xs text-white text-[11px] px-2.5 py-1 rounded-md font-mono font-medium">
                  Room {room.roomNumber}
                </div>
              </div>

              {/* Room Information - Clean spacing, NO truncated titles */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex justify-between items-center text-[11px] text-stone-500 mb-1.5 font-medium">
                    <span>{room.sizeSqFt} sq ft · {room.capacity} {room.capacity === 1 ? 'Guest' : 'Guests'}</span>
                    <span className="flex items-center gap-1 text-[#D4AF37]">
                      <Star className="w-3 h-3 fill-[#D4AF37]" />
                      <span className="font-bold text-stone-800 font-mono">{room.rating || '4.8'}</span>
                    </span>
                  </div>

                  <h3 className="text-base font-serif font-bold text-stone-900 group-hover:text-[#8C7355] transition-colors">
                    {room.name}
                  </h3>

                  <p className="text-xs text-stone-500 line-clamp-2 mt-1.5 leading-relaxed font-light">
                    {room.tagline || room.description}
                  </p>
                </div>

                {/* Pricing in INR (₹) */}
                <div className="pt-3.5 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-400 block font-medium uppercase tracking-wider">Tariff</span>
                    <span className="text-lg font-bold text-stone-950 font-mono">
                      ₹{room.rent.toLocaleString()}{' '}
                      <span className="text-xs text-stone-500 font-normal">/ day</span>
                    </span>
                  </div>
                  <button
                    onClick={() => onSelectRoom(room)}
                    className="px-4 py-2 bg-[#0B0F17] hover:bg-[#8C7355] text-[#D4AF37] hover:text-white text-xs font-bold rounded-xl uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Reserve
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==============================================================
          INDIAN HOTEL VALUE PILLARS
         ============================================================== */}
      <section className="bg-white py-14 border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#FBFBF9] border border-stone-200/90 flex items-start gap-4">
              <div className="p-3 bg-amber-50 text-[#C5A880] rounded-xl shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900 tracking-tight">
                  Guaranteed Room Confirmation
                </h4>
                <p className="text-xs text-stone-500 leading-relaxed mt-1">
                  Instant reservation confirmation with assigned room number, live inventory lock, and direct database sync.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#FBFBF9] border border-stone-200/90 flex items-start gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900 tracking-tight">
                  Easy Online Cancellation
                </h4>
                <p className="text-xs text-stone-500 leading-relaxed mt-1">
                  Self-service booking cancellation with automated room inventory release and transparent status tracking.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#FBFBF9] border border-stone-200/90 flex items-start gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                <Bed className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900 tracking-tight">
                  24/7 Room Service & Geyser
                </h4>
                <p className="text-xs text-stone-500 leading-relaxed mt-1">
                  Round-the-clock front desk assistance, hot water geyser in bathrooms, and hygienic housekeeping.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==============================================================
          HOTEL FOOTER
         ============================================================== */}
      <footer className="bg-[#0B0F17] text-stone-400 pt-14 pb-10 px-4 sm:px-6 lg:px-8 border-t border-stone-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-stone-800/80 text-xs">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#C5A880] flex items-center justify-center text-stone-950">
                <Crown className="w-4 h-4" />
              </div>
              <span className="text-xl font-serif font-bold text-white">
                Hotel<span className="text-[#C5A880]">Pro</span>
              </span>
            </div>
            <p className="text-stone-400 leading-relaxed font-light">
              Quality Indian hotel accommodations with modern Delux and comfortable Non-Delux rooms.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-3">Room Options</h4>
            <ul className="space-y-2">
              <li><button onClick={onExploreRooms} className="hover:text-white transition-colors cursor-pointer">Delux Rooms (AC)</button></li>
              <li><button onClick={onExploreRooms} className="hover:text-white transition-colors cursor-pointer">Non-Delux Rooms (Non-AC)</button></li>
              <li><button onClick={onExploreRooms} className="hover:text-white transition-colors cursor-pointer">Family Delux Rooms</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-3">Hotel Contact</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Station Road, Central Business District</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>+91 97049-27807</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>reception@hotelpro.in</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-2">
          <p>© 2026 HotelPro Hotel Management System. All rights reserved.</p>
          <p>Indian Hotel Booking System</p>
        </div>
      </footer>
    </div>
  );
};
