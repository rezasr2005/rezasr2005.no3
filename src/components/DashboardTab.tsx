/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ScrapGrade,
  PurchaseRecord,
  SaleRecord,
  ExpenseRecord,
  CashTransaction
} from '../types';
import { formatRials, formatWeight, getTodayDate } from '../utils';
import JalaliDate from './JalaliDate';
import Logo from './Logo';
import {
  Building2, 
  TrendingUp, 
  Truck, 
  DollarSign, 
  Users, 
  Coins, 
  Wrench, 
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  BarChart4,
  FileText,
  Printer,
  X,
  Calculator,
  Percent,
  Activity,
  Award,
  User,
  AlertCircle,
} from 'lucide-react';

interface DashboardTabProps {
  onUpdateGrade?: (grade: ScrapGrade) => void;
  onAddGrade?: (grade: Omit<ScrapGrade, 'id'>) => void;
  currentUser?: any;
  grades: ScrapGrade[];
  purchases: PurchaseRecord[];
  sales: SaleRecord[];
  expenses: ExpenseRecord[];
  transactions: CashTransaction[];
}

export default function DashboardTab({
  currentUser,
  grades,
  purchases,
  sales,
  expenses: initialExpenses,
  transactions,
  onUpdateGrade,
  onAddGrade
}: DashboardTabProps) {
  // فیلتر زمانی گزارش (همه، اردیبهشت ۱۴۰۵، خرداد ۱۴۰۵)
  const [reportPeriod, setReportPeriod] = useState<'all' | '02' | '03'>('all');
  const [isAddingGrade, setIsAddingGrade] = useState(false);
  const [newGradeName, setNewGradeName] = useState('');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  if (currentUser?.type === 'customer') {
    const customerPurchases = purchases.filter(p => p.supplierName === currentUser?.name);
    const customerSales = sales.filter(s => s.buyerName === currentUser?.name);
    const totalPurchasesAmount = customerPurchases.reduce((sum, p) => sum + p.totalPrice, 0);
    const totalSalesAmount = customerSales.reduce((sum, s) => sum + s.totalPrice, 0);
    const balance = totalSalesAmount - totalPurchasesAmount;

    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <User className="w-6 h-6 text-amber-500" />
            داشبورد مشتری
          </h2>
          <p className="text-sm text-slate-500 mt-1">خلاصه‌ای از وضعیت حساب و فاکتورهای شما</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                <ArrowDownRight className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-slate-500 font-bold text-xs mb-1">فروش‌های شما به انبار</h3>
            <div className="text-2xl font-black text-slate-800">{formatRials(totalPurchasesAmount)}</div>
            <p className="text-xs text-slate-400 mt-2">{customerPurchases.length} فاکتور ثبت شده</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                <ArrowUpRight className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-slate-500 font-bold text-xs mb-1">خریدهای شما از انبار</h3>
            <div className="text-2xl font-black text-slate-800">{formatRials(totalSalesAmount)}</div>
            <p className="text-xs text-slate-400 mt-2">{customerSales.length} فاکتور ثبت شده</p>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-lg relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-500/20 rounded-full blur-2xl"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-500">
                <Activity className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-slate-400 font-bold text-xs mb-1">وضعیت تراز حساب</h3>
            <div className={`text-2xl font-black ${balance > 0 ? 'text-rose-400' : balance < 0 ? 'text-emerald-400' : 'text-white'}`} dir="ltr">
              {balance === 0 ? '۰ ریال' : (balance > 0 ? 'بدهکار ' : 'بستانکار ') + formatRials(Math.abs(balance))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ۱. کمکی برای بررسی تطابق تاریخ با فیلتر ماهانه
  const isInPeriod = (dateStr: string) => {
    if (reportPeriod === 'all') return true;
    if (reportPeriod === '02') return dateStr.includes('/02/');
    if (reportPeriod === '03') return dateStr.includes('/03/');
    return true;
  };

  // فیلتر کردن هوشمند رکوردها بر اساس زمان انتخابی
  const filteredPurchases = purchases.filter(p => isInPeriod(p.date));
  const filteredSales = sales.filter(s => isInPeriod(s.date));
  const filteredExpenses = initialExpenses.filter(e => isInPeriod(e.date));
  const filteredTransactions = transactions.filter(t => isInPeriod(t.date));

  // ۲. محاسبه میانگین خرید هر گرید ضایعات با در نظر گرفتن تراکنش‌های فیلتر شده
  const getAveragePurchasePrice = (gradeId: string) => {
    const gradePurchases = filteredPurchases.filter(p => p.scrapGradeId === gradeId);
    if (gradePurchases.length === 0) {
      return grades.find(g => g.id === gradeId)?.typicalBuyPrice || 0;
    }
    const totalWeight = gradePurchases.reduce((sum, p) => sum + p.finalWeight, 0);
    const totalCost = gradePurchases.reduce((sum, p) => sum + p.totalPrice, 0);
    return totalWeight > 0 ? Math.round(totalCost / totalWeight) : 0;
  };

  // ۳. محاسبه میانگین فروش هر گرید ضایعات از انبار
  const getAverageSalePrice = (gradeId: string) => {
    const gradeSales = filteredSales.filter(s => s.scrapGradeId === gradeId);
    if (gradeSales.length === 0) {
      return grades.find(g => g.id === gradeId)?.typicalSellPrice || 0;
    }
    const totalWeight = gradeSales.reduce((sum, s) => sum + s.netWeight, 0);
    const totalCost = gradeSales.reduce((sum, s) => sum + s.totalPrice, 0);
    return totalWeight > 0 ? Math.round(totalCost / totalWeight) : 0;
  };

  // ۴. محاسبات مالی کلان برای انبار
  const totalPurchaseValue = filteredPurchases.reduce((sum, p) => sum + p.totalPrice, 0);
  const totalSalesValue = filteredSales.reduce((sum, s) => sum + s.totalPrice, 0);
  const totalExpensesValue = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  // بهای تمام شده کالای فروش رفته انبار (COGS)
  const totalCOGS = filteredSales.reduce((sum, s) => {
    const avgBuyPrice = getAveragePurchasePrice(s.scrapGradeId);
    return sum + (s.netWeight * avgBuyPrice);
  }, 0);

  // سود ناخالص انبار = کل فروش انبار - بهای तमाम شده خرید کالاهای فروش رفته
  const warehouseGrossProfit = totalSalesValue - totalCOGS;
  // سود خالص انبار = سود ناخالص - کل هزینه‌های جاری عملیاتی
  const warehouseNetProfit = warehouseGrossProfit - totalExpensesValue;

  // سهم شریک انبار (۲۰٪) و سهم شما (۸۰٪) از سود خالص انبار
  const partnerShareProfit = Math.round(warehouseNetProfit * 0.20);
  const myShareProfit = Math.round(warehouseNetProfit * 0.80);

  // ۵. نقدینگی جاری فیزیکی در بانک و صندوق انبار خاورشهر
  const warehouseCapital = filteredTransactions
    .filter(t => t.origin === 'warehouse')
    .reduce((sum, t) => t.type === 'deposit' ? sum + t.amount : sum - t.amount, 0)
    + totalSalesValue - totalPurchaseValue - totalExpensesValue;

  // موجودی انبار بر اساس گریدها جهت محاسبه ارزش کالا در سرمایه در گردش
  const estimatedStockValue = grades.reduce((sum, g) => {
    const avgBuyPrice = getAveragePurchasePrice(g.id);
    return sum + (g.stockKg * avgBuyPrice);
  }, 0);

  // سرمایه در گردش روزانه (Working Capital) = سرمایه نقدی فعال انبار + ارزش فعلی کالای دپو شده در محوطه انبار
  const totalWorkingCapital = warehouseCapital + estimatedStockValue;

  // هزینه‌های عملیاتی تفکیک شده بر اساس دسته‌بندی
  const expenseByCategory = {
    salary: filteredExpenses.filter(e => e.category === 'salary').reduce((s, e) => s + e.amount, 0),
    repair: filteredExpenses.filter(e => e.category === 'repair').reduce((s, e) => s + e.amount, 0),
    rent: filteredExpenses.filter(e => e.category === 'rent').reduce((s, e) => s + e.amount, 0),
    utilities: filteredExpenses.filter(e => e.category === 'utilities').reduce((s, e) => s + e.amount, 0),
    other: filteredExpenses.filter(e => e.category === 'other').reduce((s, e) => s + e.amount, 0),
  };

  // تابع پرینت مستقیم گزارش تراز مالی
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6" id="dashboard-tab">
      
      {/* هدر بالایی با خوش‌آمدگویی و پنل بازه گزارش‌گیری */}
      <div className="bg-gradient-to-l from-slate-900 via-slate-850 to-slate-800 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500 rounded-full filter blur-3xl opacity-10 -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight mb-2">
              {currentUser?.type === 'customer' 
                ? `سلام ${currentUser?.name}`
                : currentUser?.type === 'staff'
                  ? 'سلام همکار محترم'
                  : `سلام ${currentUser?.name}`}
            </h2>
          </div>
          
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            {/* انتخاب بازه هلو */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-slate-400">فیلتر حسابداری معین:</span>
              <select
                value={reportPeriod}
                onChange={(e) => setReportPeriod(e.target.value as any)}
                className="bg-slate-800/80 text-white border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-right focus:outline-none focus:border-amber-400"
              >
                <option value="all">کلیه دوره‌های مالی (انباشته)</option>
                <option value="02">گزارش عملکرد اردیبهشت ۱۴۰۵ (تراز هلو)</option>
                <option value="03">گزارش عملکرد خرداد ۱۴۰۵ (تراز معاصر)</option>
              </select>
            </div>

            {/* دکمه صدور PDF */}
            <button
              onClick={() => setIsPrintModalOpen(true)}
              className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-900 font-bold px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all text-xs"
              title="مشاهده نسخه چاپی آماده صادرات PDF"
            >
              <FileText className="w-4 h-4 text-slate-900" />
              خروجی PDF / چاپ ترازنامه انبار
            </button>
          </div>
        </div>
      </div>

      {/* بخش نمایش سرمایه در گردش روزانه و آمارهای کلیدی */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* ۱. دارایی نقدی انبار */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-slate-300 transition-all flex items-start justify-between shadow-sm">
          <div className="space-y-3 w-full">
            <span className="text-slate-500 text-[10px] font-bold block">سرمایه نقدی جاری انبار (حساب بانکی)</span>
            <div className="text-base sm:text-lg font-black text-emerald-700">{formatRials(warehouseCapital)}</div>
            <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
              <span>تسهیم: </span>
              <span className="text-amber-600 font-bold">۸۰٪ هلدینگ کاویان سپنتا / ۲۰٪ آقای مصطفی ندایی</span>
            </div>
          </div>
          <div className="bg-emerald-50 p-2.5 rounded-xl text-emerald-600 shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        {/* ۲. ارزش کل موجودی دپوی انبار */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-slate-300 transition-all flex items-start justify-between shadow-sm">
          <div className="space-y-3 w-full">
            <span className="text-slate-500 text-[10px] font-bold block">ارزش بهای تمام شده آهن دپو شده</span>
            <div className="text-base sm:text-lg font-black text-slate-800">{formatRials(estimatedStockValue)}</div>
            <div className="text-[10px] text-slate-500 font-medium">
              مجموع تناژ موجود در محوطه: <span className="text-amber-600 font-bold">{grades.reduce((sum, g) => sum + g.stockKg, 0).toLocaleString('fa-IR')} کیلوگرم</span>
            </div>
          </div>
          <div className="bg-amber-50 p-2.5 rounded-xl text-amber-600 shrink-0">
            <Truck className="w-5 h-5" />
          </div>
        </div>

        {/* ۳. سود خالص انبار */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-slate-300 transition-all flex items-start justify-between shadow-sm">
          <div className="space-y-3 w-full">
            <span className="text-slate-500 text-[10px] font-bold block">تراز مکتوب (سود خالص انبار خاورشهر)</span>
            <div className={`text-base sm:text-lg font-black ${warehouseNetProfit >= 0 ? 'text-emerald-700' : 'text-rose-650'}`}>
              {formatRials(warehouseNetProfit)}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
              <span>سهم هلدینگ کاویان سپنتا (۸۰٪): </span>
              <span className="font-bold text-slate-600">{formatRials(myShareProfit)}</span>
            </div>
          </div>
          <div className="bg-cyan-50 p-2.5 rounded-xl text-cyan-600 shrink-0">
            <Coins className="w-5 h-5" />
          </div>
        </div>

        {/* ۴. میزان سرمایه در گردش روزانه */}
        <div className="bg-slate-900 rounded-2xl p-5 border-2 border-slate-900 flex items-start justify-between shadow-md relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 w-2 h-full bg-amber-500"></div>
          <div className="space-y-2 w-full">
            <span className="text-amber-400 text-[11px] font-extrabold block uppercase tracking-wider flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              کل سرمایه در گردش روزانه انبار
            </span>
            <div className="text-base sm:text-lg font-black text-white">{formatRials(totalWorkingCapital)}</div>
            <p className="text-[10px] text-slate-400 leading-normal font-medium">
              مجموع موجودی نقدی جاری صندوق انبار به‌علاوه ارزش فعلی کل آهن دپو شده در محوطه.
            </p>
          </div>
          <div className="bg-white/10 p-2.5 rounded-xl text-amber-400 shrink-0">
            <Calculator className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* سود ناخالص مدیر و سهم شراکت */}
      <div className="grid grid-cols-1 gap-6">
        
        
        {/* لیست قیمت خرید روز جاری */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 lg:col-span-1">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              لیست قیمت خرید روز جاری (تومان)
            </h3>
            {currentUser.type === 'staff' && onAddGrade && !isAddingGrade && (
              <button 
                onClick={() => setIsAddingGrade(true)}
                className="text-xs bg-emerald-50 text-emerald-600 px-2 py-1 rounded font-bold hover:bg-emerald-100"
              >
                + آیتم جدید
              </button>
            )}
          </div>
          <div className="space-y-2 max-h-[300px] overflow-y-auto pl-2">
            {isAddingGrade && (
              <div className="bg-emerald-50 border border-emerald-100 p-2.5 rounded-lg flex items-center gap-2">
                <input
                  type="text"
                  autoFocus
                  placeholder="نام آیتم..."
                  value={newGradeName}
                  onChange={e => setNewGradeName(e.target.value)}
                  className="flex-1 text-xs font-bold bg-white border border-emerald-200 rounded px-2 py-1 outline-none focus:border-emerald-500"
                />
                <button 
                  onClick={() => {
                    if (newGradeName.trim() && onAddGrade) {
                      onAddGrade({
                        name: newGradeName.trim(),
                        code: 'NEW',
                        description: '',
                        typicalBuyPrice: 0,
                        typicalSellPrice: 0,
                        stockKg: 0
                      });
                      setNewGradeName('');
                      setIsAddingGrade(false);
                    }
                  }}
                  className="text-xs bg-emerald-600 text-white px-3 py-1 rounded font-bold hover:bg-emerald-700"
                >
                  ثبت
                </button>
                <button onClick={() => { setIsAddingGrade(false); setNewGradeName(''); }} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            {grades.map(g => (
              <div key={g.id} className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">{g.name}</span>
                <div className="flex items-center gap-2">
                  {currentUser.type === 'staff' && onUpdateGrade ? (
                    <input
                      type="number"
                      value={g.typicalBuyPrice || ''}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        onUpdateGrade({ ...g, typicalBuyPrice: val });
                      }}
                      className="w-28 text-left text-xs font-mono font-bold bg-white border border-slate-200 rounded px-2 py-1 outline-none focus:border-emerald-500"
                    />
                  ) : (
                    <span className="text-xs font-bold text-emerald-600 font-mono">{formatRials(g.typicalBuyPrice)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* سود انبار و تصفیه کارهای شریک */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-800 text-base">آنالیز حسابداری انبار و تراز شراکت هلدینگ کاویان سپنتا (۸۰٪) و آقای مصطفی ندایی (۲۰٪)</h3>
              <p className="text-slate-500 text-xs mt-1">تسهیم با کسر مستقیم بهای تمام شده کالای فروش رفته (Average COGS) و هزینه‌های عملیاتی معاصر.</p>
            </div>
            <div className="bg-teal-50 px-3 py-1.5 rounded-lg text-teal-700 text-xs font-semibold flex items-center gap-1.5 self-start">
              <Users className="w-4 h-4 shrink-0" />
              ترازنامه شراکت انبار خاورشهر
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-1">
              <span className="text-xs text-slate-500 block">فروش ناخالص کل انبار</span>
              <span className="text-sm font-bold text-slate-850 block">{formatRials(totalSalesValue)}</span>
              <span className="text-[9px] text-slate-400 block">(مجموع حواله‌های صادر شده خروج بار از انبار)</span>
            </div>
            <div className="bg-rose-50/40 rounded-xl p-4 border border-rose-100 space-y-1">
              <span className="text-xs text-rose-600 block">بهای وزن کالاهای فروخته شده (Average COGS)</span>
              <span className="text-sm font-bold text-rose-800 block">{formatRials(totalCOGS)}</span>
              <span className="text-[9px] text-rose-500 block">(بر اساس متوسط قیمت فاکتورهای خرید ضایعات آهن)</span>
            </div>
            <div className="bg-rose-50/40 rounded-xl p-4 border border-rose-100 space-y-1">
              <span className="text-xs text-rose-600 block">هزینه‌های بالاسری عملیاتی انبار</span>
              <span className="text-sm font-bold text-rose-800 block">{formatRials(totalExpensesValue)}</span>
              <span className="text-[9px] text-rose-500 block">(حقوق پرسنل، تعمیرات، اجاره زمین و پمپ...)</span>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm font-bold text-slate-700">تراز مکتوب(سود خالص انبار خاورشهر):</span>
              <span className={`text-base font-extrabold ${warehouseNetProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {formatRials(warehouseNetProfit)}
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: '80%' }}></div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-white p-3 rounded-lg border border-slate-200 text-center space-y-1">
                <span className="text-xs text-slate-500 block">سهم سود آقای مصطفی ندایی (شریک ۲۰٪)</span>
                <span className="text-sm sm:text-base font-black text-cyan-600">{formatRials(partnerShareProfit)}</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200 text-center space-y-1">
                <span className="text-xs text-slate-500 block">سهم سود هلدینگ کاویان سپنتا (۸۰٪)</span>
                <span className="text-sm sm:text-base font-black text-slate-800">{formatRials(myShareProfit)}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* جدول میانگین قیمت خرید و فروش و مارجین سود هر گرید */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
              <BarChart4 className="w-5 h-5 text-amber-500 shrink-0" />
              متوسط هزینه خرید، فروش و مارجین هر قلم ضایعات آهن
            </h3>
            <p className="text-slate-500 text-xs mt-1">محاسبه میانگین بها در بازه انتخابی (تسهیم نرخ باسکول خالص ورودی و خروجی)</p>
          </div>
          <div className="bg-slate-105 rounded-lg p-1.5 flex gap-1.5 text-[10px] text-slate-600">
            <span>واحد بها: <strong className="text-slate-900">ریال ایران</strong></span>
            <span>•</span>
            <span>واحد وزن: <strong className="text-slate-900">کیلوگرم (کیلو)</strong></span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                <th className="py-3 px-4 rounded-r-lg">کد گرید</th>
                <th className="py-3 px-4">عنوان گرید ضایعات آهن</th>
                <th className="py-3 px-4 text-center">موجودی فعلی (کیلو)</th>
                <th className="py-3 px-4 text-center">میانگین بهای خرید (کیلو)</th>
                <th className="py-3 px-4 text-center">میانگین بهای فروش (کیلو)</th>
                <th className="py-3 px-4 text-center">مابه‌التفاوت (سود ناخالص)</th>
                <th className="py-3 px-4 text-center rounded-l-lg">سطح مارجین مالی</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {grades.map(grade => {
                const avgBuy = getAveragePurchasePrice(grade.id);
                const avgSell = getAverageSalePrice(grade.id);
                const spread = avgSell - avgBuy;
                const marginPercent = avgBuy > 0 ? Math.round((spread / avgBuy) * 100) : 0;
                
                return (
                  <tr key={grade.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-2.5 px-4 font-mono font-bold text-slate-500">{grade.code}</td>
                    <td className="py-2.5 px-4 font-bold text-slate-850">
                      <div>{grade.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal mt-0.5 line-clamp-1">{grade.description}</div>
                    </td>
                    <td className="py-2.5 px-4 text-center font-bold text-slate-700">
                      {formatWeight(grade.stockKg)}
                    </td>
                    <td className="py-2.5 px-4 text-center font-bold text-slate-800">
                      {avgBuy.toLocaleString('fa-IR')} ریال
                    </td>
                    <td className="py-2.5 px-4 text-center font-bold text-slate-700">
                      {avgSell.toLocaleString('fa-IR')} ریال
                    </td>
                    <td className={`py-2.5 px-4 text-center font-bold ${spread >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                      {spread >= 0 ? `+${spread.toLocaleString('fa-IR')}` : spread.toLocaleString('fa-IR')}
                      <span className="text-[10px] font-medium mr-1.5 text-slate-550">({marginPercent}٪)</span>
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-extrabold ${spread >= 15000 ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-slate-100 text-slate-600'}`}>
                        {spread >= 15000 ? 'حاشیه مطلوب عالی' : 'حاشیه محدود'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* خلاصه هزینه‌های انبار */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-slate-800 text-xs sm:text-sm mb-4 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-amber-500" />
            توزیع طبقه‌بندی هزینه‌های عملیاتی جاری انبار
          </h3>
          <div className="space-y-4">
            {/* حقوق */}
            <div>
              <div className="flex justify-between items-center text-xs text-slate-600 mb-1">
                <span>حقوق & دستمزد کارکنان ({Math.round(totalExpensesValue > 0 ? (expenseByCategory.salary / totalExpensesValue) * 100 : 0)}٪)</span>
                <span className="font-bold">{formatRials(expenseByCategory.salary)}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div 
                  className="bg-amber-500 h-1.5 rounded-full" 
                  style={{ width: `${totalExpensesValue > 0 ? (expenseByCategory.salary / totalExpensesValue) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            {/* اجاره */}
            <div>
              <div className="flex justify-between items-center text-xs text-slate-600 mb-1">
                <span>اجاره ماهانه زمین و محوطه انبار ({Math.round(totalExpensesValue > 0 ? (expenseByCategory.rent / totalExpensesValue) * 100 : 0)}٪)</span>
                <span className="font-bold">{formatRials(expenseByCategory.rent)}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div 
                  className="bg-sky-500 h-1.5 rounded-full" 
                  style={{ width: `${totalExpensesValue > 0 ? (expenseByCategory.rent / totalExpensesValue) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            {/* تعمیرات */}
            <div>
              <div className="flex justify-between items-center text-xs text-slate-600 mb-1">
                <span>تعمیرات و نگهداری (لودر، قیچی پرس و جک) ({Math.round(totalExpensesValue > 0 ? (expenseByCategory.repair / totalExpensesValue) * 100 : 0)}٪)</span>
                <span className="font-bold">{formatRials(expenseByCategory.repair)}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div 
                  className="bg-red-400 h-1.5 rounded-full" 
                  style={{ width: `${totalExpensesValue > 0 ? (expenseByCategory.repair / totalExpensesValue) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            {/* قبوض */}
            <div>
              <div className="flex justify-between items-center text-xs text-slate-600 mb-1">
                <span>قبوض صنعتی آب، کپسول هوا گاز و فرآوری ({Math.round(totalExpensesValue > 0 ? (expenseByCategory.utilities / totalExpensesValue) * 100 : 0)}٪)</span>
                <span className="font-bold">{formatRials(expenseByCategory.utilities)}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div 
                  className="bg-teal-500 h-1.5 rounded-full" 
                  style={{ width: `${totalExpensesValue > 0 ? (expenseByCategory.utilities / totalExpensesValue) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            {/* سایر */}
            <div>
              <div className="flex justify-between items-center text-xs text-slate-600 mb-1">
                <span>سایر هزینه‌ها (ملزومات، کارمزد و متفرقه) ({Math.round(totalExpensesValue > 0 ? (expenseByCategory.other / totalExpensesValue) * 100 : 0)}٪)</span>
                <span className="font-bold">{formatRials(expenseByCategory.other)}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div 
                  className="bg-slate-400 h-1.5 rounded-full" 
                  style={{ width: `${totalExpensesValue > 0 ? (expenseByCategory.other / totalExpensesValue) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-bold text-amber-400 text-xs sm:text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              توصیه هوشمند کنترل نقدینگی و بودجه انبار
            </h3>
            <div className="text-xs text-slate-300 leading-relaxed space-y-3 font-medium text-justify">
              <p>
                🔸 انباشت و دپوی طولانی‌مدت ضایعات فلزی بدون ایجاد ارزش افزوده مسبب راکد ماندن جریان نقد صندوق انبار می‌گردد. پس از تفکیک، تسریع در فرآوری چدن و آهن سوپر ویژه جهت فروش دوره‌ای توصیه می‌شود.
              </p>
              <p>
                🔹 درآمدهای دوره حاصل از فروش محصولات مستقیم انبار به کارخانجات ذوب با احتساب هزینه خرید و هزینه‌های ثابت جاری ارزیابی شده و تراز نهایی مکتوب آن همواره آماده تسویه است.
              </p>
              <p>
                💡 تقسیم دقیق ۸۰٪ هلدینگ کاویان سپنتا و ۲۰٪ سهم پای‌کار آقای مصطفی ندایی بر مبنای سود نهایی و خالص پس از کسر تمامی مخارج انبار طبق گزارش تراز محاسبه می‌گردد.
              </p>
            </div>
          </div>
          <div className="pt-4 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
            <span>سامانه حسابداری تخصصی انبار آهن خاورشهر</span>
            <span className="font-mono text-amber-500">VERSION 2.0.0</span>
          </div>
        </div>

      </div>

      {currentUser?.type === 'staff' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mt-6 print:hidden">
          <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            اعتراضات ثبت شده مشتریان (درجه‌بندی باسکول)
          </h3>
          <div className="space-y-3">
            {purchases.filter(p => p.disputeStatus === 'pending').length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">هیچ اعتراضی برای بررسی وجود ندارد.</p>
            ) : (
              purchases.filter(p => p.disputeStatus === 'pending').map(p => (
                <div key={p.id} className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-800">مشتری: {p.supplierName}</p>
                    <p className="text-[10px] text-slate-500 mt-1">شماره قبض: {p.weighbridgeCode || p.id} | تاریخ: <JalaliDate date={p.date} /></p>
                  </div>
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded">نیازمند بررسی</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* مودال چاپی و PDF حرفه‌ای خاورشهر */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 text-right">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-300">
            
            {/* هدر مودال برای پرینت */}
            <div className="bg-slate-100 border-b border-slate-200 px-6 py-4 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2 text-slate-800">
                <Printer className="w-5 h-5 text-amber-500" />
                <span className="font-extrabold text-sm sm:text-base">صورت حساب و تراز مالی عملکرد (آماده چاپ / فاکتور PDF)</span>
              </div>
              <button 
                onClick={() => setIsPrintModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* محوطه گزارش مکتوب استاندارد (که پرینت می‌شود) */}
            <div className="overflow-y-auto p-6 sm:p-10 space-y-8 flex-1" id="print-view">
              
              {/* استایل مخفی برای پنهان کردن هدر مودال موقع کلیک دکمه پرینت مرورگر */}
              <style>{`
                @media print {
                  body * {
                    visibility: hidden;
                  }
                  #print-view, #print-view * {
                    visibility: visible;
                  }
                  #print-view {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    padding: 0px !important;
                    margin: 0px !important;
                    background: white !important;
                    color: black !important;
                  }
                  .no-print {
                    display: none !important;
                  }
                }
              `}</style>

              {/* سربرگ رسمی فاکتور */}
              <div className="border-b-4 border-slate-900 pb-4 flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4 text-xs">
                <div className="space-y-1.5 text-center sm:text-right">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900">گزارش تراز و عملکرد مالی انبار ضایعات آهن خاورشهر</h1>
                  <p className="text-slate-500 font-bold">بنگاه غربی تفکیک، پرس و فرآوری انواع ضایعات فلزی</p>
                  <p className="text-slate-405 font-medium">سند تجمیعی و تراز مالی زنده مورد تایید شرکاء تجاری</p>
                </div>
                <div className="text-center sm:text-left space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div>تاریخ انتشار گزارش: <strong className="font-mono text-slate-850"><JalaliDate date={getTodayDate()} /></strong></div>
                  <div>دوره زمانی تراز: <strong className="font-mono text-slate-850">
                    {reportPeriod === 'all' ? 'کلیه دوره‌های مالی (انباشته)' : reportPeriod === '02' ? 'اردیبهشت ماه ۱۴۰۵' : 'خرداد ماه ۱۴۰۵'}
                  </strong></div>
                  <div>واحد ارز محاسباتی: <strong className="text-amber-600 font-extrabold">ریال ایران</strong></div>
                </div>
              </div>

              {/* جدول داده‌های خلاصه سود و زیان (صورت حساب عایدی) */}
              <div className="space-y-3">
                <h3 className="font-black text-slate-900 border-r-4 border-amber-500 pr-2 text-sm sm:text-base">۱. صورت حساب سود و زیان انبار (Profit and Loss)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border border-slate-300 text-xs text-right">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-300">
                        <th className="py-3 px-4 font-bold border-l border-slate-300 text-slate-850">شرح ردیف حسابداری</th>
                        <th className="py-3 px-4 font-bold text-center text-slate-850">مجموع بهای کل (ریال ایران)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr>
                        <td className="py-2.5 px-4 font-bold border-l border-slate-300">درآمدهای کلان از محل فروش آهن فرآوری شده (Revenues)</td>
                        <td className="py-2.5 px-4 text-center text-emerald-800 font-bold">{totalSalesValue.toLocaleString('fa-IR')} ریال</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-bold border-l border-slate-300">بهای تمام شده خرید مستقیم وزن کالاهای فرآورده (COGS)</td>
                        <td className="py-2.5 px-4 text-center text-rose-800 font-bold">({totalCOGS.toLocaleString('fa-IR')} ریال)</td>
                      </tr>
                      <tr className="bg-slate-50/50">
                        <td className="py-2.5 px-4 font-bold border-l border-slate-300 text-slate-700">سود ناخالص عملیاتی کالا (Gross Profit)</td>
                        <td className="py-2.5 px-4 text-center text-slate-800 font-black">{warehouseGrossProfit.toLocaleString('fa-IR')} ریال</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-bold border-l border-slate-300">کل هزینه‌های بالاسری و عملیاتی ثابت جاری (Operating Expenses)</td>
                        <td className="py-2.5 px-4 text-center text-rose-800 font-bold">({totalExpensesValue.toLocaleString('fa-IR')} ریال)</td>
                      </tr>
                      <tr className="bg-slate-100">
                        <td className="py-3 px-4 font-black border-l border-slate-300 text-slate-900">سود خالص و تراز مالی انبار خاورشهر (Net Profit)</td>
                        <td className="py-3 px-4 text-center font-black text-slate-900">{warehouseNetProfit.toLocaleString('fa-IR')} ریال</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* جدول تقسیم منافع شراکت بین شرکا */}
              <div className="space-y-3">
                <h3 className="font-black text-slate-900 border-r-4 border-amber-500 pr-2 text-sm sm:text-base">۲. توزیع و تسویه سود دوره شرکاء تجاری</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                  <div className="border border-slate-250 p-4 rounded-xl space-y-1.5 text-right bg-slate-50/50">
                    <span className="text-slate-500 block">سهم سود خالص هلدینگ کاویان سپنتا (۸۰٪):</span>
                    <strong className="text-base font-black text-slate-900">{myShareProfit.toLocaleString('fa-IR')} ریال</strong>
                  </div>
                  <div className="border border-slate-250 p-4 rounded-xl space-y-1.5 text-right bg-slate-55/35">
                    <span className="text-slate-500 block">سهم سود خالص آقای مصطفی ندایی (شریک ۲۰٪ کارهای پای کار):</span>
                    <strong className="text-base font-black text-cyan-700">{partnerShareProfit.toLocaleString('fa-IR')} ریال</strong>
                  </div>
                </div>
              </div>

              {/* خلاصه سرمایه در گردش و نقدینگی */}
              <div className="space-y-3">
                <h3 className="font-black text-slate-900 border-r-4 border-amber-500 pr-2 text-sm sm:text-base">۳. صورت سرمایه در گردش و موجودی های دفتری</h3>
                <div className="overflow-x-auto text-xs">
                  <table className="w-full border border-slate-300 text-right">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-300 text-slate-800">
                        <th className="py-2.5 px-4 font-bold border-l border-slate-300">سرمایه نقدی سپرده موجود در بانک انبار</th>
                        <th className="py-2.5 px-4 font-bold border-l border-slate-300">بهای کل تخمینی موجودی دپوی محوطه انبار</th>
                        <th className="py-2.5 px-4 font-bold text-amber-900">کل سرمایه در گردش امروز انبار خاورشهر</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-3 px-4 border-l border-slate-300 font-semibold">{warehouseCapital.toLocaleString('fa-IR')} ریال</td>
                        <td className="py-3 px-4 border-l border-slate-300 font-semibold">{estimatedStockValue.toLocaleString('fa-IR')} ریال</td>
                        <td className="py-3 px-4 font-black text-amber-700">{totalWorkingCapital.toLocaleString('fa-IR')} ریال</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* امضا و اصالت سند چاپی */}
              <div className="grid grid-cols-2 gap-6 pt-10 border-t border-slate-300 text-xs text-center">
                <div className="space-y-6">
                  <span className="text-slate-500 font-extrabold block">امضاء و مهر مدیریت (هلدینگ کاویان سپنتا) - ۸۰٪ سهام</span>
                  <div className="h-12"></div>
                  <span className="text-slate-400">...........................................................................</span>
                </div>
                <div className="space-y-6">
                  <span className="text-slate-500 font-extrabold block">امضاء و اثر انگشت شریک تجاری (آقای مصطفی ندایی) - ۲۰٪ سهام</span>
                  <div className="h-12"></div>
                  <span className="text-slate-400">...........................................................................</span>
                </div>
              </div>

            </div>

            {/* بخش فوتر دکمه‌های مودال */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end gap-3 shrink-0 no-print">
              <button
                onClick={() => setIsPrintModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs"
              >
                بستن پنجره گزارش
              </button>
              <button
                onClick={handlePrint}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-lg flex items-center gap-2 text-xs"
              >
                <Printer className="w-4 h-4" />
                چاپ فاکتور و خروجی PDF
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
