import React, { useState } from 'react';
import { Film, Lock, User, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import type { UserAccount } from '../../types';
import { USER_ACCOUNTS } from '../../data/mockData';

interface LoginPageProps {
  onLogin: (user: UserAccount) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('maltea');
  const [password, setPassword] = useState('12345');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedQuickUser, setSelectedQuickUser] = useState<string>('maltea');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const found = USER_ACCOUNTS.find(
      u => u.username.toLowerCase() === username.trim().toLowerCase()
    );

    if (!found) {
      setErrorMessage('User hming a dik lo! (maltea, valtea, emaw biaktea hman tur a ni)');
      return;
    }

    if (found.password !== password.trim()) {
      setErrorMessage('Password a dik lo! (Password chu 12345 a ni)');
      return;
    }

    onLogin(found);
  };

  const handleSelectQuickArtist = (user: UserAccount) => {
    setSelectedQuickUser(user.username);
    setUsername(user.username);
    setPassword('12345');
    setErrorMessage('');
  };

  const handleDirectQuickLogin = (user: UserAccount) => {
    onLogin(user);
  };

  return (
    <div className="min-h-screen w-full bg-[#fcfaf6] text-stone-800 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Decorative Warm Paper Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-amber-100/50 via-amber-50/20 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute -bottom-20 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-2xl pointer-events-none -z-10" />

      {/* Top Studio Brand Bar */}
      <header className="px-6 py-5 flex items-center justify-between border-b border-[#e9e3d8]/70 bg-white/60 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center text-white shadow-md shadow-amber-600/25">
            <Film className="w-5 h-5 text-amber-50" />
          </div>
          <div>
            <span className="font-serif italic font-bold text-lg text-stone-900 tracking-tight">
              Red Letters Studio
            </span>
            <span className="hidden sm:inline-block ml-2 text-[11px] font-sans font-medium text-amber-800 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full">
              Animation Workspace
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs text-stone-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="hidden sm:inline">Studio Portal Live</span>
        </div>
      </header>

      {/* Main Login Hero & Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-lg bg-white rounded-3xl border border-[#e9e3d8] shadow-xl p-6 sm:p-8 relative">
          
          {/* Header Typography */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-medium mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Artist Workspace Access</span>
            </div>
            
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              Red Letters Studio
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1.5 max-w-sm mx-auto">
              Mizo animation, screenplay & storyboard collaborative production suite-ah lo lut rawh le.
            </p>
          </div>

          {/* 3 Registered Artists Quick-Select Grid */}
          <div className="mb-6">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2.5">
              1. Thlang Rawh (Registered Artists - 3)
            </label>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {USER_ACCOUNTS.map((user) => {
                const isSelected = selectedQuickUser === user.username;
                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => handleSelectQuickArtist(user)}
                    className={`p-2.5 sm:p-3 rounded-2xl border text-center transition-all cursor-pointer relative flex flex-col items-center ${
                      isSelected
                        ? 'border-amber-600 bg-[#fdf8f0] shadow-sm ring-1 ring-amber-600'
                        : 'border-[#e9e3d8] bg-[#fcfaf6] hover:bg-white hover:border-stone-300'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                      </div>
                    )}
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover mb-2 ring-2 ring-white shadow-xs"
                    />
                    <div className="text-xs font-semibold text-stone-800 truncate w-full">
                      {user.name}
                    </div>
                    <div className="text-[10px] text-stone-400 truncate w-full">
                      {user.username}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. maltea, valtea, biaktea"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#fcfaf6] border border-[#e9e3d8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password chhu lut rawh (12345)"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#fcfaf6] border border-[#e9e3d8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-mono"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center space-x-2">
                <span>⚠️</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-2 py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-medium text-sm flex items-center justify-center space-x-2 shadow-sm shadow-amber-600/30 transition-all cursor-pointer"
            >
              <span>Lut Rawh (Log In)</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>

          {/* Quick 1-Click Access for current selected artist */}
          <div className="mt-5 pt-4 border-t border-[#e9e3d8]/80 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="text-[11px] text-stone-400 flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
              <span>Default password: <code className="font-mono text-stone-600">12345</code></span>
            </div>

            {selectedQuickUser && (
              <button
                type="button"
                onClick={() => {
                  const target = USER_ACCOUNTS.find(u => u.username === selectedQuickUser);
                  if (target) handleDirectQuickLogin(target);
                }}
                className="text-xs font-semibold text-amber-700 hover:text-amber-800 hover:underline cursor-pointer"
              >
                Direct sign-in as {selectedQuickUser} →
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 px-6 text-center text-xs text-stone-400 border-t border-[#e9e3d8]/70 bg-white/40">
        <p>Red Letters Studio &bull; All 3 Artist Accounts Integrated &bull; Cloudflare Edge Ready</p>
      </footer>
    </div>
  );
};
