import React, { useMemo } from 'react';
import { PurchaseRecord, SaleRecord, ExpenseRecord } from '../types';
import { formatRials } from '../utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { BarChart4, TrendingUp } from 'lucide-react';

interface ReportsTabProps {
  purchases: PurchaseRecord[];
  sales: SaleRecord[];
  expenses: ExpenseRecord[];
}

export default function ReportsTab({ purchases, sales, expenses }: ReportsTabProps) {
  const chartData = useMemo(() => {
    // Group by month
    const monthlyData: Record<string, { month: string, cost: number, revenue: number, expense: number, profit: number }> = {};

    const getMonth = (dateStr: string) => {
      // Assuming format YYYY/MM/DD
      const parts = dateStr.split('/');
      if (parts.length >= 2) return `${parts[0]}/${parts[1]}`;
      return dateStr;
    };

    purchases.forEach(p => {
      const month = getMonth(p.date);
      if (!monthlyData[month]) monthlyData[month] = { month, cost: 0, revenue: 0, expense: 0, profit: 0 };
      monthlyData[month].cost += p.totalPrice;
    });

    sales.forEach(s => {
      const month = getMonth(s.date);
      if (!monthlyData[month]) monthlyData[month] = { month, cost: 0, revenue: 0, expense: 0, profit: 0 };
      monthlyData[month].revenue += s.totalPrice;
    });

    expenses.forEach(e => {
      const month = getMonth(e.date);
      if (!monthlyData[month]) monthlyData[month] = { month, cost: 0, revenue: 0, expense: 0, profit: 0 };
      monthlyData[month].expense += e.amount;
    });

    return Object.values(monthlyData).map(data => ({
      ...data,
      grossProfit: data.revenue - data.cost,
      profit: data.revenue - data.cost - data.expense
    })).sort((a, b) => a.month.localeCompare(b.month));
  }, [purchases, sales, expenses]);

  const last12MonthsData = useMemo(() => {
    return chartData.slice(-12);
  }, [chartData]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 shadow-md rounded-lg text-xs">
          <p className="font-bold text-slate-800 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
              <span className="text-slate-600">{entry.name}:</span>
              <span className="font-mono font-bold" style={{ color: entry.color }}>{formatRials(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
        <h2 className="text-xl font-black flex items-center gap-2 mb-2 relative z-10">
          <BarChart4 className="w-6 h-6 text-purple-400" />
          گزارش‌های جامع و نمودارها
        </h2>
        <p className="text-slate-300 text-sm relative z-10">
          تحلیل آماری و نمودارهای سود، زیان، خرید و فروش
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            نمودار سود خالص ماهانه
          </h3>
          <div className="h-72 w-full" style={{ direction: 'ltr' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} width={80} tickFormatter={(val) => (val / 10000000).toFixed(0) + 'M'} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" name="سود خالص" dataKey="profit" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <BarChart4 className="w-5 h-5 text-blue-500" />
            نمودار مقایسه‌ای درآمد و هزینه‌ها
          </h3>
          <div className="h-72 w-full" style={{ direction: 'ltr' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} width={80} tickFormatter={(val) => (val / 10000000).toFixed(0) + 'M'} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="revenue" name="درآمد (فروش)" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="cost" name="بهای تمام شده (خرید)" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="expense" name="هزینه‌های جاری" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* نمودار سود ناخالص ماهانه ۱۲ ماه گذشته درخواستی مدیریت */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mt-6 animate-in fade-in slide-in-from-bottom duration-500">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <BarChart4 className="w-5 h-5 text-indigo-500" />
          روند سود ناخالص ماهانه ۱۲ ماه گذشته (فروش منهای خرید)
        </h3>
        <p className="text-xs text-slate-500 mb-6 leading-relaxed text-justify">
          نمودار زیر مجموع سود ناخالص به دست آمده از تفاضل مستقیم مبالغ کل فروش از خرید انبار آهن خاورشهر را در بازه دوازده ماهه گذشته نشان می‌دهد. این نمودار به مدیریت دید بهتری از حاشیه سودآوری واقعی و بازدهی دوره‌ای معاملات بدون احتساب هزینه‌های جاری اداری می‌دهد.
        </p>
        <div className="h-80 w-full" style={{ direction: 'ltr' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last12MonthsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} width={80} tickFormatter={(val) => (val / 10000000).toFixed(0) + 'M'} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="grossProfit" name="سود ناخالص ماهانه" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
