import React, { useState } from 'react';
import { CustomerRecord, StaffRecord } from '../types';
import { Key, ShieldCheck, UserCog, User } from 'lucide-react';

interface ProfileTabProps {
  currentUser: any;
  customers: CustomerRecord[];
  staff: StaffRecord[];
  onUpdateCustomer: (customer: CustomerRecord) => void;
  onUpdateStaff: (staff: StaffRecord) => void;
  onUpdateCurrentUser: (user: any) => void;
}

export default function ProfileTab({ currentUser, customers, staff, onUpdateCustomer, onUpdateStaff, onUpdateCurrentUser }: ProfileTabProps) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  // Admin states
  const [targetUserType, setTargetUserType] = useState<'staff' | 'customer'>('customer');
  const [targetUserId, setTargetUserId] = useState('');
  const [adminNewPassword, setAdminNewPassword] = useState('1234');
  const [adminMessage, setAdminMessage] = useState('');

  const handleChangeOwnPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (newPassword !== confirmPassword) {
      setMessage('رمز عبور جدید و تکرار آن یکسان نیستند.');
      return;
    }

    if (currentUser.password !== oldPassword) {
      setMessage('رمز عبور فعلی اشتباه است.');
      return;
    }

    const updatedUser = { ...currentUser, password: newPassword };
    onUpdateCurrentUser(updatedUser);

    if (currentUser.type === 'staff') {
      onUpdateStaff(updatedUser as StaffRecord);
    } else {
      onUpdateCustomer(updatedUser as CustomerRecord);
    }

    setMessage('رمز عبور با موفقیت تغییر یافت.');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleAdminResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminMessage('');

    if (!targetUserId) {
      setAdminMessage('لطفا یک کاربر انتخاب کنید.');
      return;
    }

    if (targetUserType === 'staff') {
      const target = staff.find(s => s.id === targetUserId);
      if (target) {
        onUpdateStaff({ ...target, password: adminNewPassword });
        setAdminMessage(`رمز عبور پرسنل ${target.name} به "${adminNewPassword}" تغییر یافت.`);
      }
    } else {
      const target = customers.find(c => c.id === targetUserId);
      if (target) {
        onUpdateCustomer({ ...target, password: adminNewPassword });
        setAdminMessage(`رمز عبور مشتری ${target.name} به "${adminNewPassword}" تغییر یافت.`);
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
          <UserCog className="w-6 h-6 text-amber-500" />
          تنظیمات حساب کاربری
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          مدیریت رمز عبور و تنظیمات امنیتی
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
          <Key className="w-5 h-5 text-slate-400" />
          تغییر رمز عبور شخصی
        </h3>
        
        <form onSubmit={handleChangeOwnPassword} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">رمز عبور فعلی</label>
            <input
              type="password"
              dir="ltr"
              value={oldPassword}
              onChange={e => setOldPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">رمز عبور جدید</label>
            <input
              type="password"
              dir="ltr"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">تکرار رمز عبور جدید</label>
            <input
              type="password"
              dir="ltr"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              required
            />
          </div>

          {message && (
            <div className={`text-sm p-3 rounded-lg font-medium ${message.includes('موفقیت') ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'}`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 text-sm font-bold text-slate-900 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors shadow-sm mt-2"
          >
            بروزرسانی رمز عبور
          </button>
        </form>
      </div>

      {currentUser.type === 'staff' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mt-8 border-l-4 border-l-rose-500">
          <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-rose-500" />
            پنل مدیریت سیستم: تغییر رمز کاربران
          </h3>
          <p className="text-sm text-slate-500 mb-4">
            شما به عنوان پرسنل می‌توانید در صورت فراموشی رمز عبور توسط مشتریان یا پرسنل، رمز آنها را بازیابی کنید.
          </p>

          <form onSubmit={handleAdminResetPassword} className="space-y-4 max-w-lg">
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <input
                  type="radio"
                  checked={targetUserType === 'customer'}
                  onChange={() => { setTargetUserType('customer'); setTargetUserId(''); }}
                  className="text-amber-500 focus:ring-amber-500"
                />
                مشتریان
              </label>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <input
                  type="radio"
                  checked={targetUserType === 'staff'}
                  onChange={() => { setTargetUserType('staff'); setTargetUserId(''); }}
                  className="text-amber-500 focus:ring-amber-500"
                />
                پرسنل
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">انتخاب کاربر</label>
              <select
                value={targetUserId}
                onChange={e => setTargetUserId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                required
              >
                <option value="">-- انتخاب کنید --</option>
                {targetUserType === 'customer'
                  ? customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>)
                  : staff.map(s => <option key={s.id} value={s.id}>{s.name} ({s.phone})</option>)
                }
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">رمز عبور جدید</label>
              <input
                type="text"
                dir="ltr"
                value={adminNewPassword}
                onChange={e => setAdminNewPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 font-mono"
                required
              />
            </div>

            {adminMessage && (
              <div className="text-sm text-emerald-700 bg-emerald-50 p-3 rounded-lg font-medium">
                {adminMessage}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2 text-sm font-bold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors shadow-sm mt-2"
            >
              ثبت رمز عبور جدید
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
