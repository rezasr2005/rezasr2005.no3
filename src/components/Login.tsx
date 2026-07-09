import React, { useState } from 'react';
import { User, Key, ArrowRight, Shield, LogIn } from 'lucide-react';
import { CustomerRecord, StaffRecord } from '../types';

interface LoginProps {
  customers: CustomerRecord[];
  staff: StaffRecord[];
  onLogin: (user: any) => void;
}

export default function Login({ customers, staff, onLogin }: LoginProps) {
  const [loginType, setLoginType] = useState<'admin' | 'staff' | 'customer'>('admin');
  const [phone, setPhone] = useState('1234');
  const [password, setPassword] = useState('1234');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (loginType === 'admin') {
      let user = staff.find(s => s.role === 'admin' && s.phone === phone);
      if (!user && phone === '1234' && password === '1234') {
        user = staff.find(s => s.role === 'admin') || staff[0];
      }
      if (!user) {
        setError('مدیر سیستم یافت نشد.');
        return;
      }
      if (user.password !== password && !(phone === '1234' && password === '1234')) {
        setError('رمز عبور اشتباه است.');
        return;
      }
      onLogin({ ...user, type: 'staff' });
    } else if (loginType === 'staff') {
      let user = staff.find(s => s.id === phone);
      if (!user) {
        setError('پرسنل یافت نشد.');
        return;
      }
      if (user.password !== password) {
        setError('رمز عبور اشتباه است.');
        return;
      }
      onLogin({ ...user, type: 'staff' });
    } else {
      let customer = customers.find(c => c.phone === phone);
      if (!customer && phone === '1234' && password === '1234') {
        customer = customers[0];
      }
      if (!customer) {
        setError('شماره تماس مشتری یافت نشد.');
        return;
      }
      if (customer.password !== password && !(phone === '1234' && password === '1234')) {
        setError('رمز عبور اشتباه است.');
        return;
      }
      onLogin({ ...customer, type: 'customer' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        
        {/* Header */}
        <div className="bg-slate-900 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -ml-16 -mb-16"></div>
          
          <div className="relative z-10">
            <div className="w-28 h-28 mx-auto flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" className="w-full h-full drop-shadow-xl">
                <defs>
                  <rect id="diamond" x="60" y="60" width="380" height="380" rx="120" transform="translate(250 250) rotate(45) translate(-250 -250)" />
                  <clipPath id="diamondClip">
                    <use href="#diamond" />
                  </clipPath>
                  <mask id="cutMask">
                    <rect x="0" y="0" width="500" height="500" fill="white" />
                    <path d="M-50 250 H550" stroke="black" strokeWidth="16" />
                    <path d="M250 -50 V550" stroke="black" strokeWidth="16" />
                    <path d="M-50 -50 L550 550" stroke="black" strokeWidth="16" />
                    <path d="M550 -50 L-50 550" stroke="black" strokeWidth="16" />
                  </mask>
                </defs>
              
                <g clipPath="url(#diamondClip)" mask="url(#cutMask)">
                  <rect x="0" y="0" width="250" height="500" fill="#20bbed" />
                  <rect x="250" y="0" width="250" height="500" fill="#12223b" />
                  
                  <text x="140" y="345" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="280" fill="#12223b" textAnchor="middle" letterSpacing="-10">F</text>
                  <text x="360" y="345" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="280" fill="#20bbed" textAnchor="middle" letterSpacing="-10">S</text>
                </g>
              </svg>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white mb-2 leading-tight">
              اتوماسیون هوشمند انبار فلزات هلدینگ کاویان سپنتا
            </h1>
            <p className="text-amber-400 text-sm font-bold">(انبار خاورشهر)</p>
          </div>
        </div>

        {/* Form Area */}
        <div className="p-8">
          
          {/* Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl mb-8">
            <button
              type="button"
              onClick={() => { setLoginType('admin'); setError(''); setPhone('1234'); setPassword('1234'); }}
              className={`flex-1 py-2 text-xs md:text-sm font-bold rounded-lg transition-all ${loginType === 'admin' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              مدیر سیستم
            </button>
            <button
              type="button"
              onClick={() => { setLoginType('staff'); setError(''); setPhone(''); setPassword('1234'); }}
              className={`flex-1 py-2 text-xs md:text-sm font-bold rounded-lg transition-all ${loginType === 'staff' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              پرسنل
            </button>
            <button
              type="button"
              onClick={() => { setLoginType('customer'); setError(''); setPhone('1234'); setPassword('1234'); }}
              className={`flex-1 py-2 text-xs md:text-sm font-bold rounded-lg transition-all ${loginType === 'customer' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              مشتریان
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">{loginType === 'customer' || loginType === 'admin' ? 'شماره تماس (نام کاربری)' : 'نام پرسنل'}</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                  <User className="h-5 w-5" />
                </div>
                {loginType === 'staff' ? (
                  <select
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="block w-full pl-3 pr-10 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-slate-50 text-slate-900 font-bold"
                    required
                  >
                    <option value="" disabled>انتخاب کنید...</option>
                    {staff.filter(s => s.role === 'staff').map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={loginType === 'admin' ? 'text' : 'tel'}
                    dir="ltr"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="block w-full pl-3 pr-10 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-left transition-colors bg-slate-50"
                    placeholder={loginType === 'admin' ? 'نام کاربری' : '09123456789'}
                    required
                  />
                )}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-1.5">
                <label className="block text-xs font-bold text-slate-700">رمز عبور</label>
                <span className="text-[10px] text-slate-400">پیش‌فرض: 1234</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                  <Key className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  dir="ltr"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-3 pr-10 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-left transition-colors bg-slate-50"
                  placeholder="••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="text-sm text-rose-500 bg-rose-50 p-3 rounded-lg font-medium animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-slate-900 bg-amber-500 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
            >
              <LogIn className="w-5 h-5" />
              ورود به سیستم
            </button>
          </form>

        </div>
      </div>

      {/* کپی رایت صفحه ورود */}
      <footer className="mt-8 text-center text-xs text-slate-400 max-w-md w-full px-4 leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-700">
        <div className="font-bold text-slate-500 mb-1">
          اتوماسیون تخصصی انبار فلزات
        </div>
        <div className="mb-2">
          طراحی و توسعه توسط <strong className="font-semibold text-slate-600">Reza.Vazifeh</strong>
        </div>
        <div className="dir-ltr font-mono text-[10px] text-slate-400/80">
          Copyright (c) 2026 Reza.Vazifeh. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
