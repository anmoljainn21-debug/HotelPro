import React, { useState } from 'react';
import { Room, User } from '../types.ts';
import { BookingModal } from './BookingModal.tsx';
import {
  Users,
  Search,
  Bed,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Star,
  Sparkles,
} from 'lucide-react';

interface RoomCatalogProps {
  rooms: Room[];
  currentUser: User | null;
  onConfirmBooking: (bookingData: {
    roomNumber: number;
    roomType: string;
    roomId: string;
    userId: string;
    username: string;
    customerPhone: string;
    fromdate: string;
    todate: string;
    totalDays: number;
    totalAmount: number;
  }) => Promise<void>;
  onRequireLogin: () => void;
}

export const RoomCatalog: React.FC<RoomCatalogProps> = ({
  rooms,
  currentUser,
  onConfirmBooking,
  onRequireLogin,
}) => {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'Delux' | 'Non-Delux'>('ALL');
  const [activePhotoMap, setActivePhotoMap] = useState<Record<string, number>>({});

  const handlePhotoNav = (roomId: string, totalPhotos: number, direction: 'prev' | 'next', e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePhotoMap((prev) => {
      const current = prev[roomId] || 0;
      let next = direction === 'next' ? current + 1 : current - 1;
      if (next < 0) next = totalPhotos - 1;
      if (next >= totalPhotos) next = 0;
      return { ...prev, [roomId]: next };
    });
  };

  const categories: ('ALL' | 'Delux' | 'Non-Delux')[] = ['ALL', 'Delux', 'Non-Delux'];

  const filteredRooms = rooms.filter((r) => {
    const matchesCategory =
      categoryFilter === 'ALL' || r.type.toLowerCase() === categoryFilter.toLowerCase();

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      r.roomNumber.toString().includes(q) ||
      (r.name && r.name.toLowerCase().includes(q)) ||
      r.type.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      (r.view && r.view.toLowerCase().includes(q)) ||
      (r.amenities && r.amenities.some((a) => a.toLowerCase().includes(q)));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FBFBF9] py-12 px-4 sm:px-6 lg:px-8 text-stone-900 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header & Introduction */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200 pb-8">
          <div>
            <div className="flex items-center gap-2 text-[#C5A880] text-xs font-bold uppercase tracking-[0.2em] mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Available Hotel Inventory</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-950 tracking-tight">
              Hotel Rooms & Accommodations
            </h1>
            <p className="text-sm text-stone-500 mt-1.5 max-w-2xl font-light">
              Select your preferred Delux or Non-Delux room, check live dates, and reserve instantly with zero booking fees.
            </p>
          </div>

          {/* Search Control */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by room number, name, or amenity..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A880] w-72 sm:w-80 shadow-xs font-medium"
            />
          </div>
        </div>

        {/* Indian Hotel System Category Filter: ALL, Delux, Non-Delux */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-stone-200/70 rounded-xl border border-stone-300/80">
            {categories.map((cat) => {
              const isSelected = categoryFilter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#0B0F17] text-[#D4AF37] shadow-sm'
                      : 'text-stone-600 hover:text-stone-950 hover:bg-stone-200'
                  }`}
                >
                  {cat === 'ALL'
                    ? 'All Rooms'
                    : cat === 'Delux'
                    ? 'Delux Rooms (AC)'
                    : 'Non-Delux Rooms (Non-AC)'}
                </button>
              );
            })}
          </div>

          <span className="text-xs text-stone-500 font-mono font-medium">
            Showing {filteredRooms.length} of {rooms.length} Rooms
          </span>
        </div>

        {/* Room Cards Grid */}
        {filteredRooms.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-stone-200 shadow-sm max-w-md mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
              <Bed className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-serif font-bold text-stone-800">No rooms match your filter</h3>
            <p className="text-xs text-stone-500 font-light leading-relaxed">
              No rooms found for "{searchQuery}". Try selecting All Rooms to view our complete inventory.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('ALL');
              }}
              className="px-5 py-2 bg-stone-900 text-[#D4AF37] font-semibold text-xs rounded-xl uppercase tracking-wider cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRooms.map((room) => {
              const currentPhotoIndex = activePhotoMap[room._id] || 0;
              const currentPhoto = room.photos[currentPhotoIndex] || room.photos[0];

              return (
                <div
                  key={room._id}
                  className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  {/* Photo Carousel Container with real natural hotel room photos */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-100 select-none">
                    <img
                      src={currentPhoto}
                      alt={room.name}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-102"
                    />

                    {/* Category Tag (Delux vs Non-Delux) */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
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

                    <div className="absolute top-3 left-3 bg-[#0B0F17]/85 backdrop-blur-md text-white text-[11px] px-2.5 py-1 rounded-lg font-mono font-medium shadow-sm">
                      Room {room.roomNumber}
                    </div>

                    {/* Carousel Navigation Arrows */}
                    {room.photos.length > 1 && (
                      <>
                        <button
                          onClick={(e) => handlePhotoNav(room._id, room.photos.length, 'prev', e)}
                          className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-stone-900/70 hover:bg-stone-900 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-xs"
                          title="Previous angle"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handlePhotoNav(room._id, room.photos.length, 'next', e)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-stone-900/70 hover:bg-stone-900 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-xs"
                          title="Next angle"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>

                        {/* Carousel Dots */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#0B0F17]/60 backdrop-blur-xs">
                          {room.photos.map((_, idx) => (
                            <span
                              key={idx}
                              className={`w-1.5 h-1.5 rounded-full transition-all ${
                                currentPhotoIndex === idx ? 'bg-[#D4AF37] w-3' : 'bg-white/60'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Room Details - Clean, elegant, no truncated titles */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
                        <span className="flex items-center gap-1">
                          <Maximize2 className="w-3.5 h-3.5 text-[#C5A880]" />
                          <span>{room.sizeSqFt || 350} sq ft</span>
                        </span>
                        <span>{room.bedType || 'King Bed'}</span>
                        <span className="flex items-center gap-1 text-[#D4AF37] font-bold font-mono">
                          <Star className="w-3.5 h-3.5 fill-[#D4AF37]" />
                          <span>{room.rating || 4.8}</span>
                        </span>
                      </div>

                      {/* Clean Room Title - No ellipsis truncation */}
                      <div>
                        <h3 className="text-lg font-serif font-bold text-stone-900 group-hover:text-[#8C7355] transition-colors leading-snug">
                          {room.name || `Room ${room.roomNumber}`}
                        </h3>
                        {room.view && (
                          <span className="text-[11px] text-stone-500 font-medium block mt-0.5">
                            {room.view} · Floor {room.floor || 2}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed font-light">
                        {room.description}
                      </p>

                      {/* Amenities Pills */}
                      {room.amenities && room.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {room.amenities.slice(0, 3).map((amenity, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[10.5px] font-medium"
                            >
                              {amenity}
                            </span>
                          ))}
                          {room.amenities.length > 3 && (
                            <span className="text-[10px] text-stone-400 self-center font-mono">
                              +{room.amenities.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Bottom Pricing in INR (₹) */}
                    <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-stone-400 block font-medium uppercase tracking-wider">Tariff</span>
                        <span className="text-xl font-bold text-stone-950 font-mono">
                          ₹{room.rent.toLocaleString()}{' '}
                          <span className="text-xs font-sans text-stone-500 font-normal">/ day</span>
                        </span>
                      </div>

                      <button
                        onClick={() => setSelectedRoom(room)}
                        className="px-5 py-2.5 bg-gradient-to-r from-[#0B0F17] to-stone-900 hover:from-[#8C7355] hover:to-[#6b583f] text-[#D4AF37] hover:text-white font-bold text-xs tracking-wider uppercase rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Reserve</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Interactive Booking Modal */}
        {selectedRoom && (
          <BookingModal
            room={selectedRoom}
            currentUser={currentUser}
            onClose={() => setSelectedRoom(null)}
            onConfirmBooking={onConfirmBooking}
            onRequireLogin={onRequireLogin}
          />
        )}
      </div>
    </div>
  );
};
