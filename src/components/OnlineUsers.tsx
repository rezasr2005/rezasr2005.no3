import React, { useState, useEffect } from 'react';
import { Users, UserCheck } from 'lucide-react';
import { toPersianDigits } from '../utils';

const STAFF_NAMES = [
  { name: 'مهندس رضا وظیفه', role: 'مدیر عامل و طراح سیستم' },
  { name: 'مدیر سیستم', role: 'مدیر ارشد فناوری' },
  { name: 'مدیر باسکول', role: 'متصدی توزین و انبار' },
  { name: 'کارمند حسابداری', role: 'حسابداری و مالی' },
  { name: 'مدیر کنترل کیفی', role: 'کنترل کیفیت ورودی' },
  { name: 'مدیر فنی مهندسی', role: 'پشتیبانی فنی' },
  { name: 'کارمند اداری', role: 'ثبت اسناد و هماهنگی' }
];

export default function OnlineUsers() {
  const [onlineUsers, setOnlineUsers] = useState<typeof STAFF_NAMES>([]);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Initial random online users
    const count = Math.floor(Math.random() * 3) + 3; // between 3 and 5
    const shuffled = [...STAFF_NAMES].sort(() => 0.5 - Math.random());
    setOnlineUsers(shuffled.slice(0, count));

    const interval = setInterval(() => {
      const newCount = Math.floor(Math.random() * 3) + 3; // between 3 and 5
      const newShuffled = [...STAFF_NAMES].sort(() => 0.5 - Math.random());
      setOnlineUsers(newShuffled.slice(0, newCount));
    }, 25000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 cursor-pointer hover:bg-emerald-100/50 transition-all">
        <div className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </div>
        <Users className="w-4 h-4 text-emerald-500" />
        <span className="text-xs font-bold">{toPersianDigits(onlineUsers.length.toString())} کاربر آنلاین</span>
      </div>

      {isHovered && onlineUsers.length > 0 && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-1 duration-150 text-right" dir="rtl">
          <div className="border-b border-slate-100 pb-2 mb-2 flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-slate-400">فهرست همکاران فعال در سیستم</span>
            <span className="flex h-1.5 w-1.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
          </div>
          <div className="space-y-1.5">
            {onlineUsers.map((user, idx) => (
              <div key={idx} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <UserCheck className="w-3 h-3" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-800 truncate">{user.name}</div>
                  <div className="text-[9px] text-slate-400 font-medium truncate">{user.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
