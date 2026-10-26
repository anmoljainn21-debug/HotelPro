import React, { useState } from 'react';
import { Booking, User } from '../types.ts';
import { Calendar, DollarSign, Phone, Bed, AlertCircle, Sparkles, Printer } from 'lucide-react';

interface MyBookingsProps {
  currentUser: User | null;
  bookings: Booking[];
  onCancelBooking: (bookingId: string) => Promise<void>;
  onExploreRooms: () => void;
}

export const MyBookings: React.FC<MyBookingsProps> = ({
  currentUser,
  bookings,
  onCancelBooking,
  onExploreRooms,
}) => {
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const userBookings = bookings.filter((b) => {
    if (!currentUser) return false;
    if (currentUser.userType === 'admin') return true;
    return b.userId === currentUser._id || b.username.toLowerCase() === currentUser.name.toLowerCase();
  });

  const confirmCancel = async () => {
    if (!cancellingId) return;
    try {
      await onCancelBooking(cancellingId);
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBF9] py-12 px-4 sm:px-6 lg:px-8 font-sans text-stone-900">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-[#C5A880] text-xs font-bold uppercase tracking-[0.2em]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Guest Reservations</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-950 tracking-tight">
            My Hotel Bookings
          </h1>
          <p className="text-sm text-stone-500 max-w-lg mx-auto font-light leading-relaxed">
            Review your room reservations, view booking receipts, or cancel your booking anytime.
          </p>
        </div>

        {userBookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-14 text-center border border-stone-200/90 shadow-sm max-w-lg mx-auto space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
              <Bed className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-serif font-bold text-stone-900">No Reservations Found</h3>
            <p className="text-xs text-stone-500 font-light max-w-sm mx-auto leading-relaxed">
              You haven&apos;t booked any rooms yet. Browse our Delux and Non-Delux rooms to plan your stay.
            </p>
            <button
              onClick={onExploreRooms}
              className="px-6 py-3 bg-[#0B0F17] hover:bg-stone-900 text-[#D4AF37] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
            >
              Browse Rooms
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
              {userBookings.map((b) => {
                const isBooked = b.status === 'BOOKED';
                return (
                  <div
                    key={b._id}
                    className="bg-white rounded-3xl p-7 shadow-sm border border-stone-200/90 hover:shadow-xl transition-all duration-300 relative flex flex-col justify-between space-y-5"
                  >
                    <div>
                      {/* Room Header + Status Badge */}
                      <div className="flex items-start justify-between gap-3 pb-4 border-b border-stone-100">
                        <div>
                          <span className="text-[10px] text-stone-400 uppercase tracking-widest block font-medium">
                            Room #{b.roomNumber}
                          </span>
                          <h3 className="text-lg font-serif font-bold text-stone-950">
                            {b.roomType || `Room ${b.roomNumber}`}
                          </h3>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-[10.5px] font-bold tracking-wider uppercase border shadow-xs ${
                            isBooked
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : 'bg-stone-100 text-stone-600 border-stone-200'
                          }`}
                        >
                          {isBooked ? 'CONFIRMED' : 'CANCELLED'}
                        </span>
                      </div>

                      {/* Content Lines with INR (₹) */}
                      <div className="mt-4 space-y-2.5 text-xs text-stone-600">
                        <div className="flex justify-between items-center py-1">
                          <span className="text-stone-400 font-medium">Booking ID:</span>
                          <span className="font-mono text-stone-800 font-medium select-all bg-stone-50 px-2 py-0.5 rounded border border-stone-200">
                            {b._id}
                          </span>
                        </div>

                        <div className="flex justify-between items-center py-1 border-t border-stone-100/70">
                          <span className="text-stone-400 font-medium flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[#C5A880]" /> Dates of Stay:
                          </span>
                          <span className="font-medium text-stone-900">
                            {b.fromdate} → {b.todate} ({b.totalDays} {b.totalDays === 1 ? 'Day' : 'Days'})
                          </span>
                        </div>

                        <div className="flex justify-between items-center py-1 border-t border-stone-100/70">
                          <span className="text-stone-400 font-medium flex items-center gap-1.5">
                            <span className="text-[#C5A880] font-bold text-xs">₹</span> Total Amount:
                          </span>
                          <span className="font-mono font-bold text-base text-stone-950">
                            ₹{b.totalAmount.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex justify-between items-center py-1 border-t border-stone-100/70">
                          <span className="text-stone-400 font-medium flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-[#C5A880]" /> Contact Phone:
                          </span>
                          <span className="font-medium text-stone-900">{b.customerPhone}</span>
                        </div>

                        {b.specialRequests && (
                          <div className="pt-2 border-t border-stone-100/70">
                            <span className="text-stone-400 block text-[10px] uppercase tracking-wider mb-0.5">
                              Special Request:
                            </span>
                            <span className="text-stone-700 italic font-light">{b.specialRequests}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-stone-100 flex items-center gap-3">
                      <button
                        onClick={() => window.print()}
                        className="py-2.5 px-4 rounded-xl border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 font-semibold text-xs tracking-wider uppercase transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Receipt</span>
                      </button>

                      {isBooked && (
                        <button
                          onClick={() => setCancellingId(b._id)}
                          className="flex-1 py-2.5 px-4 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 font-semibold text-xs tracking-wider uppercase transition-colors cursor-pointer text-center"
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center pt-6 text-xs text-stone-500 font-medium font-mono">
              Total Recorded Bookings: {userBookings.length}
            </div>
          </div>
        )}

        {/* Cancellation Confirmation Modal */}
        {cancellingId && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-stone-200 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-900">
                Cancel Room Booking?
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed font-light">
                Are you sure you want to cancel this booking? The room will immediately be released for other guests.
              </p>
              <div className="flex gap-3 pt-3">
                <button
                  onClick={() => setCancellingId(null)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-semibold uppercase tracking-wider cursor-pointer"
                >
                  Keep Booking
                </button>
                <button
                  onClick={confirmCancel}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider shadow-sm cursor-pointer"
                >
                  Confirm Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
