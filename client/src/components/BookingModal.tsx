import React, { useState, useMemo } from 'react';
import { Room, User } from '../types.ts';
import {
  X,
  Calendar,
  Users,
  Check,
  Maximize2,
  Sparkles,
  Printer,
  CheckCircle2,
  Phone,
  Bed,
} from 'lucide-react';

interface BookingModalProps {
  room: Room;
  currentUser: User | null;
  onClose: () => void;
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
    specialRequests?: string;
  }) => Promise<void>;
  onRequireLogin: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  room,
  currentUser,
  onClose,
  onConfirmBooking,
  onRequireLogin,
}) => {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(tomorrow);
  const [guestPhone, setGuestPhone] = useState(currentUser?.phone || '');
  const [specialRequests, setSpecialRequests] = useState('');
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);

  const photoLabels = ['Bedroom Interior', 'Attached Bathroom', 'Room View & Amenities'];

  // Indian hotel GST (2026 rules):
  // ≤ ₹7,500/night → 5% GST | > ₹7,500/night → 18% GST
  const gstRate = room.rent <= 7500 ? 0.05 : 0.18;
  const gstLabel = room.rent <= 7500 ? 'GST (5%)' : 'GST (18%)';

  const { totalDays, baseAmount, taxAmount, totalAmount } = useMemo(() => {
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const diffTime = end.getTime() - start.getTime();
    const days = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const base = days * room.rent;
    const tax = Math.round(base * gstRate);
    return {
      totalDays: days,
      baseAmount: base,
      taxAmount: tax,
      totalAmount: base + tax,
    };
  }, [fromDate, toDate, room.rent, gstRate]);

  const formatDateToScreenshotFormat = (isoDate: string) => {
    const [y, m, d] = isoDate.split('-');
    return `${d}-${m}-${y}`;
  };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!currentUser) {
      onRequireLogin();
      return;
    }

    if (new Date(toDate) <= new Date(fromDate)) {
      setError('Check-out date must be after check-in date');
      return;
    }

    if (!guestPhone.trim()) {
      setError('Please provide a mobile contact number');
      return;
    }

    try {
      setIsSubmitting(true);
      await onConfirmBooking({
        roomNumber: room.roomNumber,
        roomType: room.name || `${room.type} Room`,
        roomId: room._id,
        userId: currentUser._id,
        username: currentUser.name,
        customerPhone: guestPhone.trim(),
        fromdate: formatDateToScreenshotFormat(fromDate),
        todate: formatDateToScreenshotFormat(toDate),
        totalDays,
        totalAmount,
        specialRequests: specialRequests.trim(),
      });
      setConfirmedBookingId('HP-' + Math.random().toString(36).substring(2, 8).toUpperCase());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to confirm reservation');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="relative bg-[#FBFBF9] rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-300 my-8">
        {/* Header */}
        <div className="bg-[#0B0F17] text-white px-6 sm:px-8 py-5 flex items-center justify-between border-b border-[#C5A880]/30">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full ${
                  room.type === 'Delux'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-800 text-stone-300'
                }`}
              >
                {room.type} Room
              </span>
              <span className="text-xs text-stone-400 font-mono">Room #{room.roomNumber}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mt-1">
              {room.name || `Room ${room.roomNumber}`}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[82vh] overflow-y-auto">
          {confirmedBookingId ? (
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#C5A880] uppercase tracking-widest">
                  Room Booking Confirmed
                </span>
                <h3 className="text-2xl font-serif font-bold text-stone-900 mt-1">
                  We look forward to welcoming you
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Booking Reference: <strong className="font-mono text-stone-800">{confirmedBookingId}</strong>
                </p>
              </div>

              {/* Receipt Summary Card */}
              <div className="bg-white rounded-2xl p-6 border border-stone-200 text-left space-y-4 max-w-lg mx-auto shadow-sm">
                <div className="flex justify-between items-center pb-3 border-b border-stone-100">
                  <span className="text-xs text-stone-500">Room</span>
                  <span className="text-xs font-bold text-stone-900">{room.name}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-stone-100">
                  <span className="text-xs text-stone-500">Dates of Stay</span>
                  <span className="text-xs font-bold text-stone-900">
                    {formatDateToScreenshotFormat(fromDate)} to {formatDateToScreenshotFormat(toDate)} ({totalDays} {totalDays === 1 ? 'Day' : 'Days'})
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-stone-100">
                  <span className="text-xs text-stone-500">Guest Name</span>
                  <span className="text-xs font-bold text-stone-900">{currentUser?.name}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-stone-100">
                  <span className="text-xs text-stone-500">Total Amount (incl. {gstLabel})</span>
                  <span className="text-sm font-bold text-stone-950 font-mono">
                    ₹{totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#0B0F17] hover:bg-stone-900 text-[#D4AF37] text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Natural Hotel Room Photos */}
              <div className="space-y-3">
                <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-stone-100 shadow-inner relative">
                  <img
                    src={room.photos[selectedPhotoIdx] || room.photos[0]}
                    alt={room.name}
                    className="w-full h-full object-cover transition-all duration-300"
                  />
                  <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-xs text-white text-[11px] px-3 py-1 rounded-full font-medium">
                    {photoLabels[selectedPhotoIdx] || `Photo ${selectedPhotoIdx + 1}`}
                  </div>
                </div>

                {room.photos.length > 1 && (
                  <div className="flex gap-2.5 overflow-x-auto pb-1">
                    {room.photos.map((photo, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedPhotoIdx(i)}
                        className={`flex items-center gap-2 p-1.5 rounded-xl border-2 shrink-0 transition-all cursor-pointer bg-white ${
                          selectedPhotoIdx === i
                            ? 'border-[#C5A880] ring-2 ring-[#C5A880]/30 shadow-xs'
                            : 'border-stone-200 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <img src={photo} alt="" className="w-12 h-9 rounded-lg object-cover" />
                        <span className="text-[11px] font-semibold text-stone-700 pr-2">
                          {photoLabels[i] || `Angle ${i + 1}`}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Room Specifications */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-white rounded-2xl border border-stone-200 text-xs text-stone-600 shadow-2xs">
                <div>
                  <span className="text-[10px] text-stone-400 uppercase tracking-widest block font-medium">Category</span>
                  <span className="font-bold text-stone-900">{room.type}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 uppercase tracking-widest block font-medium">Room Size</span>
                  <span className="font-bold text-stone-900">{room.sizeSqFt || 350} sq ft</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 uppercase tracking-widest block font-medium">Bedding</span>
                  <span className="font-bold text-stone-900">{room.bedType || 'Double Bed'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 uppercase tracking-widest block font-medium">Floor</span>
                  <span className="font-bold text-stone-900">{room.floor || 2}nd Floor</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <h4 className="text-[11px] font-bold text-stone-500 uppercase tracking-widest">
                  Room Description
                </h4>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-light">
                  {room.description}
                </p>
              </div>

              {/* Amenities */}
              {room.amenities && room.amenities.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold text-stone-500 uppercase tracking-widest">
                    Included Hotel Amenities
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {room.amenities.map((amenity, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-stone-700 bg-white p-2.5 rounded-xl border border-stone-200/70">
                        <Check className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Booking Form with INR calculation */}
              <form onSubmit={handleBook} className="pt-6 border-t border-stone-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-widest">
                    Reservation Form
                  </h4>
                  <span className="text-xs font-bold text-stone-900 font-mono">
                    ₹{room.rent.toLocaleString()} / day
                  </span>
                </div>

                {error && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 mb-1.5 uppercase tracking-wider">
                      Check-In Date
                    </label>
                    <input
                      type="date"
                      required
                      min={today}
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A880] bg-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 mb-1.5 uppercase tracking-wider">
                      Check-Out Date
                    </label>
                    <input
                      type="date"
                      required
                      min={fromDate || today}
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A880] bg-white font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 mb-1.5 uppercase tracking-wider">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9704927807"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A880] bg-white font-medium font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 mb-1.5 uppercase tracking-wider">
                      Special Requests
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Extra blanket, early check-in"
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A880] bg-white font-medium"
                    />
                  </div>
                </div>

                {/* Price Breakdown in INR (₹) */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 space-y-2 shadow-2xs">
                  <div className="flex justify-between items-center text-xs text-stone-600">
                    <span>
                      ₹{room.rent.toLocaleString()} × {totalDays} {totalDays === 1 ? 'Day' : 'Days'}
                    </span>
                    <span className="font-mono font-medium">₹{baseAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-stone-600">
                    <span>{gstLabel}</span>
                    <span className="font-mono font-medium">₹{taxAmount.toLocaleString()}</span>
                  </div>
                  <div className="pt-2 border-t border-stone-100 flex justify-between items-center">
                    <div>
                      <span className="text-xs font-bold text-stone-900 block">Total Payable</span>
                      <span className="text-[10px] text-stone-400">All inclusive</span>
                    </div>
                    <span className="text-xl font-bold text-stone-950 font-mono">
                      ₹{totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-2">
                  {!currentUser ? (
                    <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 text-center space-y-2">
                      <p className="text-xs text-amber-900 font-medium">
                        Please sign in to complete your room booking.
                      </p>
                      <button
                        type="button"
                        onClick={onRequireLogin}
                        className="px-6 py-2 bg-stone-900 hover:bg-stone-800 text-[#D4AF37] font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                      >
                        Sign In to Book
                      </button>
                    </div>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-6 bg-gradient-to-r from-[#0B0F17] via-stone-900 to-[#1c1917] hover:from-[#8C7355] hover:to-[#6b583f] text-[#D4AF37] hover:text-white font-bold text-xs uppercase tracking-[0.15em] rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <span>Confirming Booking...</span>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Confirm Booking</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
