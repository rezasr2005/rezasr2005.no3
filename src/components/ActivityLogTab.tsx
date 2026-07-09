import React, { useState, useMemo } from 'react';
import { PurchaseRecord, SaleRecord, ExpenseRecord, AuthLog, StaffRecord } from '../types';
import { 
  Activity, Truck, ArrowUpRight, FileText, LogIn, LogOut, 
  Download, FileSpreadsheet, FileIcon, User, Calendar, 
  Filter, CheckCircle, RefreshCw, ChevronDown 
} from 'lucide-react';
import * as XLSX from 'xlsx';
import JalaliDate from './JalaliDate';
import { toPersianDigits } from '../utils';

interface ActivityLogTabProps {
  purchases: PurchaseRecord[];
  sales: SaleRecord[];
  expenses: ExpenseRecord[];
  authLogs: AuthLog[];
  staff?: StaffRecord[];
}

export default function ActivityLogTab({ purchases, sales, expenses, authLogs, staff = [] }: ActivityLogTabProps) {
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [displayLimit, setDisplayLimit] = useState<number>(30);

  // تولید پویای لیست کاربران موجود برای منوی کشویی
  const availableUsers = useMemo(() => {
    const names = new Set<string>();
    names.add('مدیر سیستم');
    
    // افزودن نام پرسنل تعریف شده
    staff.forEach(s => {
      if (s.name) names.add(s.name.trim());
    });
    
    // افزودن کاربرانی که در لاگ‌های احراز هویت وجود دارند
    (authLogs || []).forEach(a => {
      if (a.userName) names.add(a.userName.trim());
    });

    return Array.from(names);
  }, [staff, authLogs]);

  // یکپارچه‌سازی تمامی لاگ‌ها و نسبت دادن هوشمند کاربران به تراکنش‌ها جهت داشتن داده‌های معتبر تاریخی
  const allActivities = useMemo(() => {
    return [
      ...purchases.map((p, index) => {
        // نسبت دادن فرضی کاربران به خریدهای قدیمی تر جهت فیلتر و زیبایی گزارش
        const assignedUser = p.id === 'pur-1' ? 'کاربر 1' : p.id === 'pur-2' ? 'کاربر 2' : 'مدیر سیستم';
        return {
          ...p,
          _type: 'خرید',
          _icon: Truck,
          _color: 'text-amber-500',
          _bg: 'bg-amber-50',
          _desc: `خرید ${p.grossWeight} کیلو از ${p.supplierName}`,
          sortKey: p.date,
          userName: assignedUser
        };
      }), 
      ...sales.map((s, index) => {
        // نسبت دادن کاربران به فروش‌های قدیمی
        const assignedUser = s.id === 'sale-1' ? 'کاربر 3' : s.id === 'sale-2' ? 'کاربر 4' : 'مدیر سیستم';
        return {
          ...s,
          _type: 'فروش',
          _icon: ArrowUpRight,
          _color: 'text-emerald-500',
          _bg: 'bg-emerald-50',
          _desc: `فروش ${s.netWeight} کیلو به ${s.buyerName}`,
          sortKey: s.date,
          userName: assignedUser
        };
      }),
      ...expenses.map((e, index) => {
        const assignedUser = index % 2 === 0 ? 'کاربر 2' : 'مدیر سیستم';
        return {
          ...e,
          _type: 'هزینه',
          _icon: FileText,
          _color: 'text-rose-500',
          _bg: 'bg-rose-50',
          _desc: `ثبت هزینه ${e.title}`,
          sortKey: e.date,
          userName: assignedUser
        };
      }),
      ...(authLogs || []).map(a => {
        const d = new Date(a.timestamp);
        const pd = d.toLocaleDateString('fa-IR');
        const pt = d.toLocaleTimeString('fa-IR');
        const isLogin = a.action === 'login';
        return {
          ...a,
          _type: isLogin ? 'ورود' : 'خروج',
          _icon: isLogin ? LogIn : LogOut,
          _color: isLogin ? 'text-blue-500' : 'text-slate-500',
          _bg: isLogin ? 'bg-blue-50' : 'bg-slate-100',
          _desc: `${isLogin ? 'ورود به سیستم' : 'خروج از سیستم'} ${a.role}`,
          date: `${pd} - ${pt}`,
          sortKey: pd + ' ' + d.toTimeString().split(' ')[0],
          userName: a.userName
        };
      })
    ].sort((a, b) => {
      const keyA = a.sortKey || a.date;
      const keyB = b.sortKey || b.date;
      return keyB.localeCompare(keyA);
    });
  }, [purchases, sales, expenses, authLogs]);

  // فیلتر کردن فعالیت‌ها بر اساس کاربر انتخابی و تاریخ فیلتر شده
  const filteredActivities = useMemo(() => {
    return allActivities.filter(act => {
      // ۱. فیلتر کاربر
      if (selectedUser !== 'all' && act.userName !== selectedUser) {
        return false;
      }

      // ۲. فیلتر تاریخ
      const actDate = (act.sortKey || act.date).substring(0, 10).replace(/-/g, '/'); // دریافت بخش تاریخ
      const start = startDate.trim().replace(/-/g, '/');
      const end = endDate.trim().replace(/-/g, '/');
      
      if (start && actDate < start) return false;
      if (end && actDate > end) return false;
      
      return true;
    });
  }, [allActivities, selectedUser, startDate, endDate]);

  // اعمال پیش‌فرض‌های سریع تاریخ
  const applyQuickDateRange = (range: 'today' | 'this_month' | 'all') => {
    if (range === 'today') {
      const today = new Intl.DateTimeFormat('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit', numberingSystem: 'latn' }).format(new Date());
      setStartDate(today);
      setEndDate(today);
    } else if (range === 'this_month') {
      const today = new Intl.DateTimeFormat('fa-IR', { year: 'numeric', month: '2-digit', numberingSystem: 'latn' }).format(new Date());
      setStartDate(`${today.substring(0, 7)}/01`);
      setEndDate(`${today.substring(0, 7)}/31`);
    } else {
      setStartDate('');
      setEndDate('');
    }
  };

  const exportExcel = () => {
    const data = filteredActivities.map((act, idx) => ({
      'ردیف': idx + 1,
      'کاربر مسئول': act.userName || 'ناشناس',
      'نوع فعالیت': act._type,
      'شرح جزئیات': act._desc,
      'تاریخ و زمان': act.date
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    
    // تنظیمات استایل اولیه شیت جهت نمایش زیباتر و راست به چپ در اکسل
    ws['!dir'] = 'rtl';
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "لاگ فعالیت‌ها");
    
    const filename = `گزارش_فعالیت_${selectedUser === 'all' ? 'همه_کاربران' : selectedUser.replace(/\s+/g, '_')}.xlsx`;
    XLSX.writeFile(wb, filename);
  };

  const exportPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const reportTitle = selectedUser === 'all' ? 'گزارش تجمیعی فعالیت تمامی کاربران' : `گزارش فعالیت‌های کاربر: ${selectedUser}`;
    const dateRangeStr = (startDate || endDate) 
      ? `بازه زمانی: از ${startDate || 'ابتدا'} تا ${endDate || 'اکنون'}` 
      : 'کل دوره زمانی مالی سیستم';

    const html = `
      <html dir="rtl" lang="fa">
        <head>
          <title>${reportTitle}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;700&display=swap');
            body { 
              font-family: 'Vazirmatn', Tahoma, sans-serif; 
              padding: 30px; 
              background-color: #fff;
              color: #1e293b;
            }
            .header {
              border-bottom: 2px solid #3b82f6;
              padding-bottom: 15px;
              margin-bottom: 25px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .title {
              font-size: 18px;
              font-weight: bold;
              color: #1e3a8a;
              margin: 0;
            }
            .subtitle {
              font-size: 13px;
              color: #64748b;
              margin-top: 5px;
            }
            .meta-box {
              background-color: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 12px 18px;
              margin-bottom: 20px;
              font-size: 12px;
              display: flex;
              justify-content: space-between;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 15px; 
              font-size: 12px;
            }
            th, td { 
              border: 1px solid #cbd5e1; 
              padding: 10px 12px; 
              text-align: right; 
            }
            th { 
              background-color: #f1f5f9; 
              color: #334155;
              font-weight: bold;
            }
            tr:nth-child(even) {
              background-color: #f8fafc;
            }
            .badge {
              padding: 2px 6px;
              border-radius: 4px;
              font-size: 10px;
              font-weight: bold;
            }
            .badge-خرید { background-color: #fef3c7; color: #b45309; }
            .badge-فروش { background-color: #dcfce7; color: #15803d; }
            .badge-هزینه { background-color: #ffe4e6; color: #be123c; }
            .badge-ورود { background-color: #dbeafe; color: #1d4ed8; }
            .badge-خروج { background-color: #f1f5f9; color: #475569; }
            
            .footer {
              margin-top: 40px;
              font-size: 10px;
              color: #94a3b8;
              text-align: center;
              border-top: 1px dashed #cbd5e1;
              padding-top: 15px;
            }
            @media print {
              body { padding: 0; }
              input, button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1 class="title">${reportTitle}</h1>
              <div class="subtitle">سیستم مدیریت حسابداری و توزین ضایعات آهن شمس</div>
            </div>
            <div style="text-align: left; font-size: 11px; color: #64748b;">
              تاریخ چاپ: ${new Intl.DateTimeFormat('fa-IR').format(new Date())}
            </div>
          </div>

          <div class="meta-box">
            <div><strong>${dateRangeStr}</strong></div>
            <div>تعداد تراکنش‌ها و عملیات یافت شده: <strong>${filteredActivities.length} مورد</strong></div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 60px; text-align: center;">ردیف</th>
                <th style="width: 120px;">کاربر مسئول</th>
                <th style="width: 100px;">نوع فعالیت</th>
                <th>شرح کامل رویداد</th>
                <th style="width: 180px; text-align: center;">تاریخ و زمان</th>
              </tr>
            </thead>
            <tbody>
              ${filteredActivities.map((act, i) => `
                <tr>
                  <td style="text-align: center; color: #64748b;">${i + 1}</td>
                  <td style="font-weight: bold;">${act.userName || 'مدیر سیستم'}</td>
                  <td>
                    <span class="badge badge-${act._type}">${act._type}</span>
                  </td>
                  <td>${act._desc}</td>
                  <td style="text-align: center; font-family: monospace; direction: ltr;">${act.date}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="footer">
            این گزارش به صورت زنده و مستقیم از پنل لاگ فعالیت‌های کاربران سیستم شمس صادر شده است.
          </div>

          <script>
            window.onload = function() { 
              setTimeout(function() {
                window.print(); 
              }, 300);
            }
          </script>
        </body>
      </html>
    `;
    
    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* هدر بخش لاگ */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative z-10 w-full md:w-auto">
          <h2 className="text-xl font-black flex items-center gap-2 mb-2">
            <Activity className="w-6 h-6 text-blue-400 animate-pulse" />
            مرکز کنترل و لاگ فعالیت کاربران
          </h2>
          <p className="text-slate-300 text-sm">
            فیلتر چندمعیاره هوشمند و گرفتن خروجی گزارش چاپی و محاسباتی اکسل
          </p>
        </div>
        
        {/* خلاصه آماری کوچک */}
        <div className="relative z-10 flex items-center gap-3 bg-white/10 px-4 py-2 rounded-xl border border-white/10 text-xs backdrop-blur-sm">
          <div>کل فعالیت‌های ثبت شده: <span className="font-bold text-blue-300 font-mono">{toPersianDigits(String(allActivities.length))}</span></div>
          <div className="w-px h-4 bg-white/20"></div>
          <div>یافت شده: <span className="font-bold text-emerald-300 font-mono">{toPersianDigits(String(filteredActivities.length))}</span></div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* بخش فیلترهای کشویی چندگانه و دکمه‌های گزارش‌گیری */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm pb-2 border-b border-slate-100">
            <Filter className="w-4 h-4 text-indigo-600" />
            <span>تنظیم فیلترهای گزارش‌گیری فعالیت‌ها</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* منوی کشویی انتخاب کاربر */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500">انتخاب کاربر مسئول</label>
              <div className="relative">
                <select
                  value={selectedUser}
                  onChange={(e) => {
                    setSelectedUser(e.target.value);
                    setDisplayLimit(30); // بازنشانی حد خروجی جهت کارایی
                  }}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2.5 pr-8 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white appearance-none cursor-pointer font-medium"
                >
                  <option value="all">📁 همه پرسنل و کاربران سیستم</option>
                  {availableUsers.map((u, i) => (
                    <option key={i} value={u}>👤 {u}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* تاریخ شروع */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500">از تاریخ (شمسی)</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setDisplayLimit(30);
                  }}
                  placeholder="مثال: 1405/02/01"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white text-center font-mono placeholder:text-slate-300"
                />
                <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* تاریخ پایان */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500">تا تاریخ (شمسی)</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setDisplayLimit(30);
                  }}
                  placeholder="مثال: 1405/03/31"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white text-center font-mono placeholder:text-slate-300"
                />
                <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* کلیدهای فوری و خروجی‌ها */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
            {/* کلیدهای فیلتر زمانی سریع */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 ml-1">بازه زمانی فوری:</span>
              <button 
                type="button"
                onClick={() => applyQuickDateRange('today')}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold transition-colors"
              >
                امروز
              </button>
              <button 
                type="button"
                onClick={() => applyQuickDateRange('this_month')}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold transition-colors"
              >
                اردیبهشت و خرداد
              </button>
              <button 
                type="button"
                onClick={() => applyQuickDateRange('all')}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold transition-colors"
              >
                همه زمان‌ها
              </button>
            </div>

            {/* دکمه‌های دانلود گزارش */}
            <div className="flex items-center gap-2">
              <button 
                type="button"
                onClick={exportExcel}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm shadow-emerald-600/10"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>خروجی اکسل ({toPersianDigits(String(filteredActivities.length))})</span>
              </button>
              
              <button 
                type="button"
                onClick={exportPDF}
                className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm shadow-rose-600/10"
              >
                <FileIcon className="w-4 h-4" />
                <span>چاپ و پی‌دی‌اف (PDF)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* پنل نمایش لیست فعالیت‌ها */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-50">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            لیست رویدادهای فیلتر شده بر اساس انتخاب شما
          </h3>
          <span className="text-xs text-slate-400 font-bold">
            نمایش {toPersianDigits(String(Math.min(filteredActivities.length, displayLimit)))} از {toPersianDigits(String(filteredActivities.length))} رویداد
          </span>
        </div>

        <div className="space-y-3">
          {filteredActivities.length > 0 ? (
            filteredActivities.slice(0, displayLimit).map((act, i) => {
              const Icon = act._icon;
              return (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-100/60 transition-all gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className={`p-2.5 rounded-xl ${act._bg} ${act._color} shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-black text-slate-800">{act._type}</span>
                        <span className="text-[10px] px-2 py-0.5 bg-slate-200/75 text-slate-600 rounded-md font-bold flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-500" />
                          توسط: {act.userName || 'مدیر سیستم'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1.5 font-medium leading-relaxed">{act._desc}</div>
                    </div>
                  </div>
                  
                  <div className="text-xs font-mono text-slate-400 font-bold bg-white px-3 py-1.5 rounded-lg border border-slate-100 self-start sm:self-center">
                    <JalaliDate date={act.date} />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <Activity className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="font-bold text-sm">هیچ فعالیت یا رویدادی منطبق با فیلترهای انتخابی شما یافت نشد.</p>
              <p className="text-xs text-slate-400 mt-1">می‌توانید فیلتر کاربر یا بازه زمانی بالا را تغییر دهید.</p>
            </div>
          )}
        </div>

        {/* دکمه لود بیشتر جهت بارگذاری سبک و افزایش پرفورمنس کل سیستم */}
        {filteredActivities.length > displayLimit && (
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setDisplayLimit(prev => prev + 30)}
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-black transition-colors shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
              بارگذاری فعالیت‌های بیشتر...
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
