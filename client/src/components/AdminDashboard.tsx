import React, { useState } from 'react';
import { User, Room, Booking } from '../types.ts';
import {
  PlusCircle,
  Bed,
  Phone,
  Calendar,
  CheckCircle2,
  XCircle,
  Search,
  TrendingUp,
  Percent,
  Users,
  Eye,
} from 'lucide-react';

interface AdminDashboardProps {
  currentTab: string;
  setTab: (tab: string) => void;
  users: User[];
  rooms: Room[];
  bookings: Booking[];
  onAddRoom: (roomData: Omit<Room, '_id'>) => Promise<void>;
  onCancelBooking: (bookingId: string) => Promise<void>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentTab,
  setTab,
  users,
  rooms,
  bookings,
  onAddRoom,
  onCancelBooking,
}) => {
  // Form state for Add Room (Delux / Non-Delux)
  const [roomNumber, setRoomNumber] = useState('');
  const [suiteName, setSuiteName] = useState('');
  const [capacity, setCapacity] = useState('2');
  const [bedType, setBedType] = useState('1 King Size Bed');
  const [sizeSqFt, setSizeSqFt] = useState('350');
  const [view, setView] = useState('City View');
  const [rent, setRent] = useState('');
  const [roomType, setRoomType] = useState<'Delux' | 'Non-Delux'>('Delux');
  const [image1, setImage1] = useState('');
  const [image2, setImage2] = useState('');
  const [image3, setImage3] = useState('');
  const [amenitiesInput, setAmenitiesInput] = useState('Split AC, Attached Bathroom with Geyser, Free Wi-Fi, LED TV, Room Service');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Search/Filter state
  const [bookingFilter, setBookingFilter] = useState<'ALL' | 'BOOKED' | 'CANCELLED'>('ALL');
  const [userSearch, setUserSearch] = useState('');
  const [roomSearch, setRoomSearch] = useState('');

  // Executive KPI Calculations
  const totalRevenue = bookings
    .filter((b) => b.status === 'BOOKED')
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  const bookedRoomsCount = rooms.filter((r) =>
    r.currentBookings?.some((cb) => cb.status === 'BOOKED')
  ).length;

  const occupancyRate = rooms.length > 0 ? Math.round((bookedRoomsCount / rooms.length) * 100) : 0;

  const handleAddRoomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSuccess(null);
    setFormError(null);

    const rNum = parseInt(roomNumber, 10);
    const rCap = parseInt(capacity, 10) || 2;
    const rRent = parseInt(rent, 10);
    const rSize = parseInt(sizeSqFt, 10) || 300;

    if (!rNum || isNaN(rNum)) {
      setFormError('Please enter a valid room number');
      return;
    }
    if (!rRent || isNaN(rRent) || rRent <= 0) {
      setFormError('Please enter a valid daily tariff (₹)');
      return;
    }

    const photos = [
      image1.trim() || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80',
      image2.trim() || 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
      image3.trim() || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
    ].filter(Boolean);

    const amenitiesList = amenitiesInput
      .split(',')
      .map((a) => a.trim())
      .filter(Boolean);

    try {
      setIsSubmitting(true);
      await onAddRoom({
        roomNumber: rNum,
        name: suiteName.trim() || `${roomType} Room ${rNum}`,
        tagline: 'Comfortable Indian hotel accommodation with all modern amenities.',
        capacity: rCap,
        bedType: bedType.trim() || '1 Double Bed',
        sizeSqFt: rSize,
        view: view.trim() || 'City View',
        floor: Math.floor(rNum / 100) || 1,
        rent: rRent,
        type: roomType,
        photos,
        description:
          description.trim() ||
          'Comfortable room with clean linens, attached private bathroom with hot water geyser, complimentary Wi-Fi, and 24-hour room service.',
        amenities:
          amenitiesList.length > 0
            ? amenitiesList
            : ['Attached Bathroom with Geyser', 'High-Speed Wi-Fi', 'Room Service', 'Daily Housekeeping'],
        rating: 4.8,
        reviewCount: 1,
        currentBookings: [],
      });

      setFormSuccess(`Room ${rNum} (${roomType}) added to inventory successfully!`);
      // Reset form
      setRoomNumber('');
      setSuiteName('');
      setRent('');
      setImage1('');
      setImage2('');
      setImage3('');
      setDescription('');
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Failed to add room');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (bookingFilter === 'ALL') return true;
    return b.status === bookingFilter;
  });

  const filteredRooms = rooms.filter((r) => {
    const q = roomSearch.toLowerCase();
    return (
      r.roomNumber.toString().includes(q) ||
      (r.name && r.name.toLowerCase().includes(q)) ||
      r.type.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q)
    );
  });

  const filteredUsers = users.filter((u) => {
    const q = userSearch.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.phone.includes(q) ||
      u.userType.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#FBFBF9] py-10 px-4 sm:px-6 lg:px-8 text-stone-900 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">
                Total Revenue
              </span>
              <span className="text-2xl font-bold text-stone-950 font-mono mt-0.5 block">
                ₹{totalRevenue.toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                <TrendingUp className="w-3 h-3" /> Active bookings revenue
              </span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-[#C5A880] flex items-center justify-center font-bold text-base shrink-0">
              ₹
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">
                Room Occupancy
              </span>
              <span className="text-2xl font-bold text-stone-950 font-mono mt-0.5 block">
                {occupancyRate}%
              </span>
              <span className="text-[10px] text-stone-500 font-medium mt-0.5 block">
                {bookedRoomsCount} of {rooms.length} rooms occupied
              </span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Percent className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">
                Total Rooms
              </span>
              <span className="text-2xl font-bold text-stone-950 font-mono mt-0.5 block">
                {rooms.length} Rooms
              </span>
              <span className="text-[10px] text-stone-500 font-medium mt-0.5 block">
                Delux &amp; Non-Delux Inventory
              </span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Bed className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">
                Registered Users
              </span>
              <span className="text-2xl font-bold text-stone-950 font-mono mt-0.5 block">
                {users.length} Users
              </span>
              <span className="text-[10px] text-stone-500 font-medium mt-0.5 block">
                Guests &amp; Administrators
              </span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* ==============================================================
            TAB 1: ALL BOOKINGS
           ============================================================== */}
        {currentTab === 'bookings' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
              <div>
                <h2 className="text-2xl font-bold text-stone-950">
                  All Room Bookings
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Monitor guest reservation statuses and execute cancellations.
                </p>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-stone-200/60 rounded-xl border border-stone-300/70">
                {(['ALL', 'BOOKED', 'CANCELLED'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setBookingFilter(status)}
                    className={`px-3.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      bookingFilter === status
                        ? 'bg-[#0B0F17] text-[#D4AF37] font-bold shadow-xs'
                        : 'text-stone-600 hover:text-stone-950'
                    }`}
                  >
                    {status === 'ALL' ? 'All Bookings' : status}
                  </button>
                ))}
              </div>
            </div>

            {filteredBookings.length === 0 ? (
              <div className="bg-white rounded-3xl p-14 text-center border border-stone-200 shadow-sm max-w-md mx-auto">
                <Bed className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-stone-800">No Bookings Found</h3>
                <p className="text-xs text-stone-500 mt-1">No room bookings match this status.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {filteredBookings.map((b) => {
                  const isBooked = b.status === 'BOOKED';
                  return (
                    <div key={b._id}
                      className="bg-white rounded-xl border border-stone-200 hover:border-stone-300 hover:shadow-sm transition-all duration-150"
                    >
                      {/* Main row */}
                      <div className="flex items-center gap-3 px-4 py-2.5">
                        {/* Room number */}
                        <div className="shrink-0 w-16 text-center">
                          <span className="text-[11px] text-stone-400 block leading-none">Room</span>
                          <span className="text-lg font-bold text-stone-900 font-mono leading-tight">#{b.roomNumber}</span>
                        </div>

                        {/* Divider */}
                        <div className="w-px h-8 bg-stone-200 shrink-0" />

                        {/* Room name + dates */}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-stone-800 truncate">{b.roomType || `Room ${b.roomNumber}`}</p>
                          <p className="text-[11px] text-stone-400 mt-0.5">{b.fromdate} → {b.todate} · {b.totalDays} {b.totalDays === 1 ? 'day' : 'days'}</p>
                        </div>

                        {/* Guest */}
                        <div className="hidden sm:block shrink-0 text-right">
                          <p className="text-xs font-semibold text-stone-800">{b.username}</p>
                          <p className="text-[11px] text-stone-400 font-mono">{b.customerPhone}</p>
                        </div>

                        {/* Divider */}
                        <div className="w-px h-8 bg-stone-200 shrink-0" />

                        {/* Tariff */}
                        <div className="shrink-0 text-right w-20">
                          <p className="text-sm font-bold text-stone-950 font-mono">₹{b.totalAmount.toLocaleString()}</p>
                          <p className="text-[10px] text-stone-400">incl. GST</p>
                        </div>

                        {/* Status + Action */}
                        <div className="shrink-0 flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase ${
                            isBooked ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-stone-100 text-stone-500 border border-stone-200'
                          }`}>
                            {isBooked ? 'BOOKED' : 'CANCELLED'}
                          </span>
                          {isBooked && (
                            <button
                              onClick={() => {
                                if (window.confirm('Cancel this room reservation?')) {
                                  onCancelBooking(b._id);
                                }
                              }}
                              className="px-2.5 py-1 rounded-md border border-rose-200 text-rose-600 hover:bg-rose-50 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Booking ID sub-row */}
                      <div className="px-4 py-1.5 border-t border-stone-100 bg-stone-50/60 rounded-b-xl">
                        <span className="text-[10px] text-stone-400">ID: </span>
                        <span className="text-[10px] font-mono text-stone-600 select-all">{b._id}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ==============================================================
            TAB 2: ALL ROOMS
           ============================================================== */}
        {currentTab === 'rooms' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
              <div>
                <h2 className="text-2xl font-bold text-stone-950">
                  Hotel Room Inventory
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  View room capacity, tariffs in INR (₹), and classifications.
                </p>
              </div>

              <div className="relative w-72">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter rooms..."
                  value={roomSearch}
                  onChange={(e) => setRoomSearch(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A880] font-medium"
                />
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
              <div className="bg-[#0B0F17] text-white py-5 px-7 flex items-center justify-between border-b border-[#C5A880]/30">
                <div>
                  <h3 className="text-lg font-bold">All Rooms Master List</h3>
                  <p className="text-xs text-stone-400">Total rooms: {rooms.length}</p>
                </div>
                <button
                  onClick={() => setTab('add-room')}
                  className="px-4 py-2 bg-[#C5A880] hover:bg-[#D4AF37] text-stone-950 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                >
                  + Add Room
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-stone-200 bg-stone-50 text-xs font-semibold text-stone-600 tracking-wider uppercase">
                      <th className="py-4 px-6">Room Name & No.</th>
                      <th className="py-4 px-4">Category</th>
                      <th className="py-4 px-4">Capacity</th>
                      <th className="py-4 px-4">Tariff / Day</th>
                      <th className="py-4 px-6">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
                    {filteredRooms.map((r, idx) => (
                      <tr
                        key={r._id}
                        className={`hover:bg-stone-50/80 transition-colors ${
                          idx % 2 === 1 ? 'bg-stone-50/30' : 'bg-white'
                        }`}
                      >
                        <td className="py-4 px-6">
                          <div className="font-bold text-stone-900 text-sm font-serif">{r.name || `Room ${r.roomNumber}`}</div>
                          <span className="font-mono text-[11px] text-stone-400">Room #{r.roomNumber} · Floor {r.floor || 1}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                              r.type === 'Delux'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-stone-100 text-stone-800 border border-stone-200'
                            }`}
                          >
                            {r.type}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-medium">
                          {r.capacity} {r.capacity === 1 ? 'Person' : 'People'}
                        </td>
                        <td className="py-4 px-4 font-mono font-bold text-stone-950 text-sm">
                          ₹{r.rent.toLocaleString()}
                        </td>
                        <td className="py-4 px-6 text-stone-500 max-w-xs truncate font-light">
                          {r.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==============================================================
            TAB 3: ADD NEW ROOM (Delux / Non-Delux)
           ============================================================== */}
        {currentTab === 'add-room' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-1">
              <span className="text-xs font-bold text-[#C5A880] uppercase tracking-widest">
                Add Room to System
              </span>
              <h2 className="text-3xl font-bold text-stone-950">Add a New Room</h2>
              <p className="text-xs text-stone-500 font-light">
                Add a new Delux or Non-Delux room with photo URLs, daily rent, and specifications.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
              <form onSubmit={handleAddRoomSubmit} className="p-8 space-y-6">
                {formSuccess && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>{formSuccess}</span>
                  </div>
                )}
                {formError && (
                  <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs flex items-center gap-2 font-medium">
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wider">
                      Room Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Deluxe King Room"
                      value={suiteName}
                      onChange={(e) => setSuiteName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A880] font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wider">
                      Room Number
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 107"
                      value={roomNumber}
                      onChange={(e) => setRoomNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A880] font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wider">
                      Max. Capacity
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A880] font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wider">
                      Room Type
                    </label>
                    <select
                      value={roomType}
                      onChange={(e) => setRoomType(e.target.value as 'Delux' | 'Non-Delux')}
                      className="w-full px-3.5 py-2.5 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A880] font-bold bg-white"
                    >
                      <option value="Delux">Delux (Air-Conditioned)</option>
                      <option value="Non-Delux">Non-Delux (Non-AC)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wider">
                      Rent / Day (₹ INR)
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      placeholder="e.g. 1800"
                      value={rent}
                      onChange={(e) => setRent(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A880] font-medium font-mono"
                    />
                  </div>
                </div>

                {/* Photos */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Room Photos (URLs)
                  </label>
                  <input
                    type="url"
                    placeholder="Bedroom Photo URL"
                    value={image1}
                    onChange={(e) => setImage1(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                  />
                  <input
                    type="url"
                    placeholder="Attached Bathroom Photo URL"
                    value={image2}
                    onChange={(e) => setImage2(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                  />
                  <input
                    type="url"
                    placeholder="Room View / Desk Angle Photo URL"
                    value={image3}
                    onChange={(e) => setImage3(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                  />
                  <p className="text-[10.5px] text-stone-400 font-light">
                    Leave blank to use pre-curated authentic hotel room photography.
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wider">
                    Room Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter room details, bed specifications, attached bathroom features..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="py-3 px-8 bg-[#0B0F17] hover:bg-stone-900 text-[#D4AF37] font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-2"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>{isSubmitting ? 'Adding Room...' : 'ADD ROOM'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ==============================================================
            TAB 4: ALL REGISTERED USERS
           ============================================================== */}
        {currentTab === 'users' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
              <div>
                <h2 className="text-2xl font-bold text-stone-950">
                  Registered Users
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Overview of all registered customers and administrators.
                </p>
              </div>

              <div className="relative w-72">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A880] font-medium"
                />
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
              <div className="bg-[#0B0F17] text-white py-5 px-7 flex items-center justify-between border-b border-[#C5A880]/30">
                <div>
                  <h3 className="text-lg font-bold">All Registered Users</h3>
                  <p className="text-xs text-stone-400">Total users: {users.length}</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-stone-200 bg-stone-50 text-xs font-semibold text-stone-600 tracking-wider uppercase">
                      <th className="py-4 px-6">User ID</th>
                      <th className="py-4 px-4">Name</th>
                      <th className="py-4 px-6">Email</th>
                      <th className="py-4 px-4">Mobile No.</th>
                      <th className="py-4 px-4">Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
                    {filteredUsers.map((u, idx) => (
                      <tr
                        key={u._id}
                        className={`hover:bg-stone-50/80 transition-colors ${
                          idx % 2 === 1 ? 'bg-stone-50/30' : 'bg-white'
                        }`}
                      >
                        <td className="py-4 px-6 font-mono text-stone-900 font-bold select-all">
                          {u._id}
                        </td>
                        <td className="py-4 px-4 font-bold text-stone-900 text-sm">{u.name}</td>
                        <td className="py-4 px-6 text-stone-600">{u.email}</td>
                        <td className="py-4 px-4 font-mono text-stone-700">{u.phone}</td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                              u.userType === 'admin'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-stone-100 text-stone-800 border border-stone-200'
                            }`}
                          >
                            {u.userType === 'admin' ? 'Admin' : 'Customer'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
