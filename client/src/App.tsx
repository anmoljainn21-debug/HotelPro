import React, { useState, useEffect, useCallback } from 'react';
import { User, Room, Booking, UserType } from './types.ts';
import { api } from './services/api.ts';
import { Navbar } from './components/Navbar.tsx';
import { LandingPage } from './components/LandingPage.tsx';
import { RoomCatalog } from './components/RoomCatalog.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { MyBookings } from './components/MyBookings.tsx';
import { Login } from './components/Login.tsx';
import { Register } from './components/Register.tsx';
import { BookingModal } from './components/BookingModal.tsx';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => api.getCurrentUser());
  const [activeView, setActiveView] = useState<string>('home');
  const [adminTab, setAdminTab] = useState<string>('bookings');

  // Application Data States
  const [users, setUsers] = useState<User[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected room for quick booking from landing page
  const [modalRoom, setModalRoom] = useState<Room | null>(null);

  // Toast Notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Load all data on mount
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [u, r, b] = await Promise.all([
        api.getAllUsers(),
        api.getAllRooms(),
        api.getAllBookings(),
      ]);
      setUsers(u);
      setRooms(r);
      setBookings(b);
    } catch (err) {
      console.error('Error fetching data:', err);
      showToast('Error syncing with backend, loaded local dataset', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Adjust active view when user logs in or out
  useEffect(() => {
    if (currentUser?.userType === 'admin') {
      if (activeView !== 'admin') {
        setActiveView('admin');
      }
    } else if (currentUser?.userType === 'customer') {
      if (activeView === 'admin' || activeView === 'login' || activeView === 'register') {
        setActiveView('rooms');
      }
    }
  }, [currentUser]);

  // --- AUTH ACTIONS ---
  const handleLogin = async (email: string, password?: string) => {
    const { user } = await api.login(email, password);
    setCurrentUser(user);
    showToast(`Welcome back, ${user.name}!`);
    if (user.userType === 'admin') {
      setActiveView('admin');
    } else {
      setActiveView('rooms');
    }
  };

  const handleRegister = async (userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    userType: UserType;
  }) => {
    const { user } = await api.register(userData);
    setCurrentUser(user);
    // Refresh user list
    const updatedUsers = await api.getAllUsers();
    setUsers(updatedUsers);
    showToast(`Account registered successfully as ${user.userType}!`);
    if (user.userType === 'admin') {
      setActiveView('admin');
    } else {
      setActiveView('rooms');
    }
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    setActiveView('home');
    showToast('You have been logged out.');
  };

  const handleQuickLogin = async (email: string) => {
    try {
      await handleLogin(email, 'password123');
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Quick login failed', 'error');
    }
  };

  const handleResetData = () => {
    if (window.confirm('Reset all rooms, bookings, and users back to the original screenshot dataset?')) {
      const resetState = api.resetData();
      setUsers(resetState.users);
      setRooms(resetState.rooms);
      setBookings(resetState.bookings);
      showToast('Database reset to original screenshot records.');
    }
  };

  // --- ROOM & BOOKING ACTIONS ---
  const handleAddRoom = async (roomData: Omit<Room, '_id'>) => {
    const newRoom = await api.addRoom(roomData);
    setRooms((prev) => [...prev, newRoom]);
    showToast(`Room ${newRoom.roomNumber} created successfully!`);
  };

  const handleConfirmBooking = async (bookingData: {
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
  }) => {
    const newBooking = await api.createBooking(bookingData);
    setBookings((prev) => [newBooking, ...prev]);

    // Also update room in local state
    setRooms((prev) =>
      prev.map((r) => {
        if (r.roomNumber === newBooking.roomNumber) {
          const currentBookings = r.currentBookings ? [...r.currentBookings] : [];
          currentBookings.push({
            bookingId: newBooking._id,
            fromdate: newBooking.fromdate,
            todate: newBooking.todate,
            status: 'BOOKED',
          });
          return { ...r, currentBookings };
        }
        return r;
      })
    );

    showToast(`Room ${newBooking.roomNumber} booked successfully!`);
    setActiveView('my-bookings');
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const updated = await api.cancelBooking(bookingId);
      setBookings((prev) => prev.map((b) => (b._id === bookingId ? updated : b)));

      // Update room in local state
      setRooms((prev) =>
        prev.map((r) => {
          if (r.roomNumber === updated.roomNumber && r.currentBookings) {
            return {
              ...r,
              currentBookings: r.currentBookings.map((c) =>
                c.bookingId === bookingId ? { ...c, status: 'CANCELLED' } : c
              ),
            };
          }
          return r;
        })
      );

      showToast(`Booking ${bookingId.slice(-8)} has been cancelled.`);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Cancellation failed', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div
            className={`px-4 py-3 rounded-xl shadow-lg border flex items-center gap-2.5 text-xs font-semibold ${
              toast.type === 'success'
                ? 'bg-emerald-600 text-white border-emerald-500'
                : 'bg-rose-600 text-white border-rose-500'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-2 hover:opacity-75 cursor-pointer text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <Navbar
        currentUser={currentUser}
        activeView={activeView}
        setActiveView={setActiveView}
        adminTab={adminTab}
        setAdminTab={setAdminTab}
        onLogout={handleLogout}
        onQuickLogin={handleQuickLogin}
        onResetData={handleResetData}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {loading ? (
          <div className="min-h-[50vh] flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-slate-500 font-medium">Loading HotelPro system data...</p>
            </div>
          </div>
        ) : (
          <>
            {/* View: Home / Landing */}
            {activeView === 'home' && (
              <LandingPage
                rooms={rooms}
                onExploreRooms={() => setActiveView('rooms')}
                onNavigateLogin={() => setActiveView('login')}
                onNavigateRegister={() => setActiveView('register')}
                onSelectRoom={(room) => setModalRoom(room)}
              />
            )}

            {/* View: Rooms (Customer & Public Room Catalog) */}
            {(activeView === 'rooms' || activeView === 'customer') && (
              <RoomCatalog
                rooms={rooms}
                currentUser={currentUser}
                onConfirmBooking={handleConfirmBooking}
                onRequireLogin={() => setActiveView('login')}
              />
            )}

            {/* View: My Bookings (Customer) */}
            {activeView === 'my-bookings' && (
              <MyBookings
                currentUser={currentUser}
                bookings={bookings}
                onCancelBooking={handleCancelBooking}
                onExploreRooms={() => setActiveView('rooms')}
              />
            )}

            {/* View: Admin Dashboard */}
            {activeView === 'admin' && (
              <AdminDashboard
                currentTab={adminTab}
                setTab={setAdminTab}
                users={users}
                rooms={rooms}
                bookings={bookings}
                onAddRoom={handleAddRoom}
                onCancelBooking={handleCancelBooking}
              />
            )}

            {/* View: Login */}
            {activeView === 'login' && (
              <Login
                onLogin={handleLogin}
                onNavigateRegister={() => setActiveView('register')}
                onQuickSelect={handleQuickLogin}
              />
            )}

            {/* View: Register */}
            {activeView === 'register' && (
              <Register
                onRegister={handleRegister}
                onNavigateLogin={() => setActiveView('login')}
              />
            )}
          </>
        )}
      </main>

      {/* Modal Room for Landing Page */}
      {modalRoom && (
        <BookingModal
          room={modalRoom}
          currentUser={currentUser}
          onClose={() => setModalRoom(null)}
          onConfirmBooking={handleConfirmBooking}
          onRequireLogin={() => {
            setModalRoom(null);
            setActiveView('login');
          }}
        />
      )}
    </div>
  );
}
