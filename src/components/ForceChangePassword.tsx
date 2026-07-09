import React, { useState } from 'react';
import { Key, ShieldCheck } from 'lucide-react';

interface ForceChangePasswordProps {
  user: any;
  onChangePassword: (newPassword: string) => void;
}

export default function ForceChangePassword({ user, onChangePassword }: ForceChangePasswordProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 4) {
      setError('رمز عبور باید حداقل ۴ کاراکتر باشد.');
      return;
    }

    if (newPassword === '1234') {
      setError('شما نمی‌توانید از رمز عبور پیش‌فرض استفاده کنید.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('رمز عبور و تکرار آن مطابقت ندارند.');
      return;
    }

    onChangePassword(newPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-500 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900 mb-2">تغییر رمز عبور اجباری</h2>
          <p className="text-sm text-slate-500 font-medium">
            شما با رمز عبور پیش‌فرض وارد شده‌اید. برای ادامه فعالیت در سیستم باید رمز عبور خود را تغییر دهید.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">رمز عبور جدید</label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                <Key className="h-5 w-5" />
              </div>
              <input
                type="password"
                dir="ltr"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="block w-full pl-3 pr-10 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-left transition-colors bg-slate-50"
                placeholder="••••"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">تکرار رمز عبور جدید</label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                <Key className="h-5 w-5" />
              </div>
              <input
                type="password"
                dir="ltr"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
            ثبت رمز عبور و ورود
          </button>
        </form>
      </div>
    </div>
  );
}
