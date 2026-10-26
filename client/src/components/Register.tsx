import React, { useState } from 'react';
import { AlertCircle, User, Mail, Lock, Phone, Eye, EyeOff, Crown, Star } from 'lucide-react';
import { UserType } from '../types.ts';

interface RegisterProps {
  onRegister: (userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    userType: UserType;
  }) => Promise<void>;
  onNavigateLogin: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onRegister, onNavigateLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [userType, setUserType] = useState<UserType>('customer');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) { setError('Full Name is required'); return; }
    if (!email.trim()) { setError('Email Address is required'); return; }
    if (!phone.trim()) { setError('Mobile Number is required'); return; }

    try {
      setLoading(true);
      await onRegister({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password || 'password123',
        phone: phone.trim(),
        userType,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F5F3EE] flex items-stretch font-sans">
      {/* ── LEFT PANEL: Hotel Photo + Branding ── */}
      <div className="hidden md:flex md:w-[48%] relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=85"
          alt="HotelPro Lobby"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B0F17]/85 via-[#0B0F17]/65 to-[#0B0F17]/30" />

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

          {/* Benefits */}
          <div className="space-y-5">
            <div className="w-10 h-0.5 bg-[#D4AF37]" />
            <h2 className="text-2xl font-serif font-light text-white/90 leading-snug max-w-xs">
              Join HotelPro for a seamless stay experience.
            </h2>
            <div className="space-y-3">
              {[
                'Instant room booking & confirmation',
                'Delux (AC) & Non-Delux room options',
                'Easy cancellation & rebooking',
                'Indian hotel pricing in ₹ (INR)',
              ].map((benefit) => (
                <div key={benefit} className="flex items-center gap-2.5 text-sm text-stone-300">
                  <Star className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 fill-[#D4AF37]" />
                  <span className="font-light">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-stone-500 italic">
            © 2026 HotelPro · Indian Hospitality System
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL: Register Form ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 bg-white overflow-y-auto">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-[#C5A880] uppercase tracking-[0.22em]">
              New Account
            </span>
            <h1 className="text-3xl font-serif font-bold text-stone-950 tracking-tight">
              Create Your Account
            </h1>
            <p className="text-sm text-stone-500 font-light leading-relaxed">
              Register as a Guest Member or Hotel Administrator.
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
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A880] focus:border-transparent bg-stone-50 text-stone-800 placeholder-stone-400 transition-all"
                />
              </div>
            </div>

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
                  placeholder="rahul@example.com"
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
                  placeholder="Create a secure password"
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

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                <input
                  type="tel"
                  required
                  placeholder="+91 98765-43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A880] focus:border-transparent bg-stone-50 text-stone-800 placeholder-stone-400 transition-all"
                />
              </div>
            </div>

            {/* Account Type Toggle */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setUserType('customer')}
                  className={`py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all cursor-pointer ${
                    userType === 'customer'
                      ? 'border-[#C5A880] bg-amber-50 text-amber-900'
                      : 'border-stone-200 bg-stone-50 text-stone-600 hover:border-stone-300'
                  }`}
                >
                  Guest Member
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('admin')}
                  className={`py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all cursor-pointer ${
                    userType === 'admin'
                      ? 'border-[#C5A880] bg-amber-50 text-amber-900'
                      : 'border-stone-200 bg-stone-50 text-stone-600 hover:border-stone-300'
                  }`}
                >
                  Hotel Admin
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 bg-[#0B0F17] hover:bg-stone-800 text-[#D4AF37] font-bold text-sm tracking-widest uppercase rounded-xl shadow-lg transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin inline-block" />
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Login link */}
          <p className="text-sm text-stone-500 text-center pt-1">
            Already have an account?{' '}
            <button
              onClick={onNavigateLogin}
              className="text-[#8C7355] hover:text-[#C5A880] font-semibold cursor-pointer transition-colors"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
