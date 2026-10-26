import React from 'react';
import { User } from '../types.ts';
import { Crown, User as UserIcon, Shield, LogOut } from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  activeView: string;
  setActiveView: (view: string) => void;
  adminTab: string;
  setAdminTab: (tab: string) => void;
  onLogout: () => void;
  onQuickLogin: (email: string) => void;
  onResetData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeView,
  setActiveView,
  adminTab,
  setAdminTab,
  onLogout,
}) => {
  const isAdmin = currentUser?.userType === 'admin';

  return (
    <header className="sticky top-0 z-50 shadow-md bg-[#0B0F17] border-b border-stone-800">
      {/* Primary Luxury Navigation Bar */}
      <div className="bg-[#0B0F17] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo / Brand Name: HotelPro */}
          <div
            onClick={() => {
              if (isAdmin) {
                setActiveView('admin');
              } else if (currentUser) {
                setActiveView('customer');
              } else {
                setActiveView('home');
              }
            }}
            className="flex items-center gap-3.5 cursor-pointer group select-none"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#D4AF37] via-[#C5A880] to-[#8C7355] text-stone-950 flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
              <Crown className="w-5 h-5 text-stone-950" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-serif tracking-tight font-bold text-white">
                  Hotel<span className="text-[#C5A880]">Pro</span>
                </span>
                <span className="text-[9px] font-semibold tracking-widest px-2 py-0.5 rounded-full bg-[#C5A880]/15 text-[#D4AF37] border border-[#C5A880]/30 uppercase">
                  Grand Luxury
                </span>
              </div>
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-stone-400">
                {isAdmin ? 'ADMINISTRATIVE CONTROL CENTER' : 'HOTEL & ROOM RESERVATION SYSTEM'}
              </span>
            </div>
          </div>

          {/* Right Navigation Controls */}
          <nav className="flex items-center gap-7">
            {!currentUser ? (
              // Public Visitor Navigation
              <div className="flex items-center gap-6 text-sm font-medium">
                <button
                  onClick={() => setActiveView('home')}
                  className={`transition-colors cursor-pointer ${
                    activeView === 'home'
                      ? 'text-[#C5A880] font-semibold border-b-2 border-[#C5A880] pb-1'
                      : 'text-stone-300 hover:text-white'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => setActiveView('rooms')}
                  className={`transition-colors cursor-pointer ${
                    activeView === 'rooms'
                      ? 'text-[#C5A880] font-semibold border-b-2 border-[#C5A880] pb-1'
                      : 'text-stone-300 hover:text-white'
                  }`}
                >
                  Rooms
                </button>
                <button
                  onClick={() => setActiveView('login')}
                  className={`transition-colors cursor-pointer ${
                    activeView === 'login'
                      ? 'text-[#C5A880] font-semibold border-b-2 border-[#C5A880] pb-1'
                      : 'text-stone-300 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setActiveView('register')}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#C5A880] hover:from-[#e3bd48] hover:to-[#d4b58c] text-stone-950 font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition-all cursor-pointer"
                >
                  Create Account
                </button>
              </div>
            ) : isAdmin ? (
              // Administrator Navigation
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-800">
                  <Shield className="w-4 h-4 text-[#C5A880]" />
                  <span className="text-stone-200 font-medium text-xs">
                    Admin: <strong className="text-[#C5A880]">{currentUser.name}</strong>
                  </span>
                </div>
                <button
                  onClick={() => setActiveView('rooms')}
                  className="text-stone-300 hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  View Rooms
                </button>
                <button
                  onClick={onLogout}
                  className="font-medium hover:text-rose-400 transition-colors cursor-pointer flex items-center gap-1.5 text-stone-400 text-xs uppercase tracking-wider"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              // Customer Navigation
              <div className="flex items-center gap-6 text-sm">
                <button
                  onClick={() => setActiveView('customer')}
                  className={`transition-colors cursor-pointer ${
                    activeView === 'customer'
                      ? 'text-[#C5A880] font-semibold border-b-2 border-[#C5A880] pb-1'
                      : 'text-stone-300 hover:text-white'
                  }`}
                >
                  Rooms
                </button>
                <button
                  onClick={() => setActiveView('my-bookings')}
                  className={`transition-colors cursor-pointer ${
                    activeView === 'my-bookings'
                      ? 'text-[#C5A880] font-semibold border-b-2 border-[#C5A880] pb-1'
                      : 'text-stone-300 hover:text-white'
                  }`}
                >
                  My Bookings
                </button>
                <div className="flex items-center gap-1.5 text-stone-200 text-xs font-medium px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-800">
                  <UserIcon className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>{currentUser.name}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="text-stone-400 hover:text-rose-400 transition-colors cursor-pointer flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            )}
          </nav>
        </div>
      </div>

      {/* Admin Tab Navigation Bar */}
      {isAdmin && activeView === 'admin' && (
        <div className="bg-[#0F141E] border-t border-stone-800/80 shadow-inner">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
              {[
                { id: 'bookings', label: 'ALL BOOKINGS' },
                { id: 'rooms', label: 'ALL ROOMS' },
                { id: 'add-room', label: 'ADD NEW ROOM' },
                { id: 'users', label: 'REGISTERED USERS' },
              ].map((tab) => {
                const isActive = adminTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setAdminTab(tab.id)}
                    className={`py-3 px-1 text-xs font-bold tracking-widest uppercase transition-all border-b-2 cursor-pointer ${
                      isActive
                        ? 'border-[#C5A880] text-[#D4AF37]'
                        : 'border-transparent text-stone-400 hover:text-stone-200 hover:border-stone-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
