import React, { useState } from 'react';
import { AlertCircle, Mail, Lock, Eye, EyeOff, Crown, Bed } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string, password?: string) => Promise<void>;
  onNavigateRegister: () => void;
  onQuickSelect: (email: string) => void;
}

export const Login: React.FC<LoginProps> = ({
  onLogin,
  onNavigateRegister,
  onQuickSelect,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError('Please enter your registered email address');
      return;
    }
    try {
      setLoading(true);
      await onLogin(email.trim(), password);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F5F3EE] flex items-stretch font-sans">
      {/* ── LEFT PANEL: Hotel Photo + Branding ── */}
      <div className="hidden md:flex md:w-[48%] relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=85"
          alt="HotelPro Premium Room"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B0F17]/80 via-[#0B0F17]/60 to-[#0B0F17]/30" />

        {/* Branding Content */}
        <div className="relative z-10 flex flex-col justify-between p-10 text-white w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#C5A880] flex items-center justify-center shadow-lg">
              <Crown className="w-5 h-5 text-stone-950" />
            </div>
            <div>
              <span className="text-xl font-serif font-bold tracking-tight">
                Hotel<span className="text-[#D4AF37]">Pro</span>
              </span>
              <p className="text-[10px] text-stone-300 tracking-[0.15em] uppercase font-medium">
                Hotel & Room Reservation
              </p>
            </div>
          </div>

          {/* Quote */}
          <div className="space-y-4">
            <div className="w-10 h-0.5 bg-[#D4AF37]" />
            <blockquote className="text-2xl font-serif font-light leading-snug text-white/90 max-w-xs">
              "Your perfect room awaits, crafted for comfort and care."
            </blockquote>
            <div className="flex items-center gap-2 text-xs text-stone-300">
              <Bed className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Delux & Non-Delux Rooms · Indian Hospitality</span>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 pt-2 border-t border-white/20">
            {[['6+', 'Room Types'], ['24/7', 'Front Desk'], ['100%', 'Clean Assured']].map(([num, label]) => (
              <div key={label} className="text-center">
                <p className="text-lg font-bold text-[#D4AF37] font-mono">{num}</p>
                <p className="text-[10px] text-stone-400 uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL: Login Form ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md space-y-7">
          {/* Header */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-[#C5A880] uppercase tracking-[0.22em]">
              Welcome Back
            </span>
            <h1 className="text-3xl font-serif font-bold text-stone-950 tracking-tight">
              Sign In to HotelPro
            </h1>
            <p className="text-sm text-stone-500 font-light leading-relaxed">
              Access your reservations or the hotel administration console.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2.5 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="yourname@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A880] focus:border-transparent bg-stone-50 text-stone-800 placeholder-stone-400 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A880] focus:border-transparent bg-stone-50 text-stone-800 placeholder-stone-400 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 bg-[#0B0F17] hover:bg-stone-800 text-[#D4AF37] font-bold text-sm tracking-widest uppercase rounded-xl shadow-lg transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin inline-block" />
                  Signing In...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Register link */}
          <p className="text-sm text-stone-500 text-center">
            New to HotelPro?{' '}
            <button
              onClick={onNavigateRegister}
              className="text-[#8C7355] hover:text-[#C5A880] font-semibold cursor-pointer transition-colors"
            >
              Create an Account
            </button>
          </p>

          {/* Quick Demo */}
          <div className="pt-4 border-t border-stone-100 space-y-3">
            <p className="text-[11px] font-bold text-stone-400 uppercase tracking-widest text-center">
              Quick Demo Access
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setEmail('s@gmai.com');
                  setPassword('password123');
                  onQuickSelect('s@gmai.com');
                }}
                className="flex flex-col items-center gap-0.5 p-3 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl border border-amber-200 transition-colors cursor-pointer group"
              >
                <span className="text-[11px] font-bold uppercase tracking-wider">Admin</span>
                <span className="text-[10px] text-amber-700 font-medium">sun · s@gmai.com</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('sid@gmail.com');
                  setPassword('password123');
                  onQuickSelect('sid@gmail.com');
                }}
                className="flex flex-col items-center gap-0.5 p-3 bg-sky-50 hover:bg-sky-100 text-sky-900 rounded-xl border border-sky-200 transition-colors cursor-pointer"
              >
                <span className="text-[11px] font-bold uppercase tracking-wider">Guest</span>
                <span className="text-[10px] text-sky-700 font-medium">sid · sid@gmail.com</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
