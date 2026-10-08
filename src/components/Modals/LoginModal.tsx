import React, { useState } from 'react';
import { X, Lock, User, LogIn } from 'lucide-react';
import type { UserAccount } from '../../types';
import { USER_ACCOUNTS } from '../../data/mockData';

interface LoginModalProps {
  isOpen: boolean;
  currentUser: UserAccount;
  onClose: () => void;
  onLogin: (user: UserAccount) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onLogin
}) => {
  if (!isOpen) return null;

  const [username, setUsername] = useState(currentUser.username || 'maltea');
  const [password, setPassword] = useState('12345');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const found = USER_ACCOUNTS.find(
      u => u.username.toLowerCase() === username.trim().toLowerCase()
    );

    if (!found) {
      setErrorMessage('User hming a dik lo! (maltea, valtea, biaktea chauh a awm)');
      return;
    }

    if (found.password !== password.trim()) {
      setErrorMessage('Password a dik lo! (Password chu 12345 a ni)');
      return;
    }

    onLogin(found);
    onClose();
  };

  const handleQuickSwitch = (user: UserAccount) => {
    setUsername(user.username);
    setPassword('12345');
    onLogin(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-[#e9e3d8] p-6 max-w-md w-full shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center text-white shadow-sm shadow-amber-600/30">
            <Lock className="w-5 h-5 text-amber-50" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold text-stone-900 leading-tight">
              Artist Account Login
            </h3>
            <p className="text-xs text-stone-500">Sign in to collaborate, comment & approve scripts</p>
          </div>
        </div>

        {/* Current User Pill */}
        <div className="p-3 mb-4 rounded-xl bg-[#fcfaf6] border border-[#e9e3d8] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-white"
            />
            <div>
              <div className="text-xs font-semibold text-stone-800 leading-tight">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-amber-800 font-medium">
                {currentUser.role}
              </div>
            </div>
          </div>
          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            Active Now
          </span>
        </div>

        {/* Quick Switch Buttons */}
        <div className="mb-5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-2">
            Quick Switch Artist (3 Authorized Users)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {USER_ACCOUNTS.map((acc) => {
              const isCurrent = currentUser.id === acc.id;
              return (
                <button
                  type="button"
                  key={acc.id}
                  onClick={() => handleQuickSwitch(acc)}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center space-y-1.5 ${
                    isCurrent
                      ? 'border-amber-400 bg-amber-50/70 ring-1 ring-amber-300 shadow-2xs'
                      : 'border-[#e9e3d8] hover:border-stone-300 hover:bg-stone-50/80 bg-white'
                  }`}
                >
                  <img
                    src={acc.avatar}
                    alt={acc.name}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <div className="text-[11px] font-semibold text-stone-800 truncate w-full">
                    {acc.name}
                  </div>
                  <div className="text-[9px] text-stone-400 truncate w-full">
                    {acc.username}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleFormSubmit} className="space-y-3.5 border-t border-[#e9e3d8] pt-4">
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="maltea, valtea, or biaktea"
                className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-[#e9e3d8] focus:outline-none focus:ring-1 focus:ring-amber-500 bg-[#fcfaf6] font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="12345"
                className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-[#e9e3d8] focus:outline-none focus:ring-1 focus:ring-amber-500 bg-[#fcfaf6] font-mono"
                required
              />
            </div>
            <p className="text-[10px] text-stone-400 mt-1">Default password for all 3 users is: <strong>12345</strong></p>
          </div>

          {errorMessage && (
            <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs">
              {errorMessage}
            </div>
          )}

          <div className="pt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-stone-600 hover:bg-stone-100 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center space-x-1.5 px-5 py-2 text-xs font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Log In</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
