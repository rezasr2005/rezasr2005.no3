/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CashTransaction } from '../types';
import { formatRials, getTodayDate } from '../utils';
import { Landmark, ArrowLeftRight, PiggyBank, Plus, Search, Trash2, ShieldCheck, HeartHandshake, Check, Users } from 'lucide-react';

import JalaliDate from './JalaliDate';
interface CapitalTabProps {
  currentUser?: any;
  transactions: CashTransaction[];
  warehouseBalance: number;
  onAddTransaction: (tx: Omit<CashTransaction, 'id'>) => void;
  onDeleteTransaction: (id: string) => void;
}

export default function CapitalTab({
  currentUser,
  transactions,
  warehouseBalance,
  onAddTransaction,
  onDeleteTransaction
}: CapitalTabProps) {
  
  const isAdmin = currentUser?.role === 'admin';
  const hasPermission = (action: string) => {
    if (isAdmin) return true;
    return (currentUser?.permissions || []).includes(action);
  };

  const [isOpenForm, setIsOpenForm] = useState(false);
  const [date, setDate] = useState(getTodayDate());
  const [type, setType] = useState<'deposit' | 'withdraw'>('deposit');
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || !description) {
      alert('لطفاً مبلغ معتبر و بابت شرح عملیات را تکمیل بفرمایید.');
      return;
    }

    if (type === 'withdraw' && amount > warehouseBalance) {
      if (!confirm('توجه: این برداشت نقدی سبب منفی شدن صندوق نقدینگی انبار می‌شود. ادامه می‌دهید؟')) {
        return;
      }
    }

    // اضافه کردن تراکنش سرمایه انبار
    onAddTransaction({
      date,
      type,
      origin: 'warehouse',
      amount,
      description
    });

    setAmount(0);
    setDescription('');
    setIsOpenForm(false);
  };

  return (
    <div className="space-y-6" id="capital-tab">
      {/* هدر */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">جریان نقدینگی و روزشمار سرمایه فیزیکی انبار</h2>
          <p className="text-slate-500 text-xs mt-1">تزریق آورده نقدی شرکا (هلدینگ کاویان سپنتا ۸۰٪ و آقای مصطفی ندایی ۲۰٪)، برداشت‌ها و پیگیری اسناد نقدینگی جاری صندوق انبار خاورشهر.</p>
        </div>
        <button
          onClick={() => setIsOpenForm(!isOpenForm)}
          id="toggle-capital-form"
          className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-900 font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-all text-xs"
        >
          <Plus className="w-4 h-4 text-slate-900" />
          {isOpenForm ? 'پنهان کردن فرم ثبت' : 'ثبت واریز آورده جدید / برداشت نقدی'}
        </button>
      </div>

      {/* وضعیت بالنس حساب ها و سهم شراکت */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ۱. وضعیت انبار ضایعات */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="font-bold text-slate-850 text-sm flex items-center gap-2">
                <Landmark className="w-4.5 h-4.5 text-amber-500" />
                کل نقدینگی جاری انبار (صندوق و بانک)
              </span>
              <span className="bg-amber-50 px-2.5 py-0.5 rounded text-[10px] text-amber-800 font-bold">
                حساب اصلی انبار خاورشهر
              </span>
            </div>
            <div className="py-2">
              <span className="text-3xl font-black text-slate-900 block">{formatRials(warehouseBalance)}</span>
              <p className="text-[10px] text-slate-405 mt-2">وجوه جاری در جریان جهت تسویه مستقیم با باسکول، فاکتورهای محلی خرید آهن، حقوق پرسنل و هزینه‌ها.</p>
            </div>
          </div>
          {warehouseBalance < 500000000 && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 text-[10px] p-3 rounded-lg flex gap-2 mt-4 animate-pulse">
              <span className="font-bold">⚠️ هشدار نقدینگی:</span>
              <span>موجودی جاری انبار کمتر از ۵۰۰ میلیون ریال (معادل ۵۰ میلیون تومان) است. افزایش نقدینگی از طریق تزریق آورده شرکاء توصیه می‌شود.</span>
            </div>
          )}
        </div>

        {/* ۲. وضعیت تسهیم سهام شرکاء */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-850">
              <span className="font-bold text-amber-400 text-sm flex items-center gap-2">
                <Users className="w-4.5 h-4.5 text-amber-400" />
                تسهیم و حق سهم نقدینگی شرکا (انبار خاورشهر)
              </span>
              <span className="bg-slate-800 px-2.5 py-0.5 rounded text-[10px] text-slate-300 font-bold">
                تراز زنده شراکت
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 py-1">
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-right">
                <span className="text-[10px] text-slate-400 block mb-1">سهم هلدینگ کاویان سپنتا (۸۰٪)</span>
                <span className="text-base sm:text-lg font-black text-white">{formatRials(warehouseBalance * 0.8)}</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-right">
                <span className="text-[10px] text-slate-400 block mb-1">سهم آقای مصطفی ندایی (۲۰٪)</span>
                <span className="text-base sm:text-lg font-black text-amber-400">{formatRials(warehouseBalance * 0.2)}</span>
              </div>
            </div>
          </div>
          <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-4 pt-3 border-t border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>محاسبه و توزیع بر مبنای اساسنامه معین (سهم مالکیت ۸۰ به ۲۰ درصد انبار خاورشهر) صورت می‌پذیرد.</span>
          </div>
        </div>
      </div>

      {/* فرم تراکنش نقدینگی جدید */}
      {isOpenForm && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md transition-all">
          <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-100">
            <ArrowLeftRight className="w-5 h-5 text-amber-500" />
            <span className="font-bold text-slate-800 text-sm">ثبت سند تراکنش نقدی و کنترل آورده‌های صندوق</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* تاریخ */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">تاریخ سند مالی *</label>
                <input
                  type="text"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="1405/03/27"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 dir-ltr text-left"
                />
              </div>

              {/* نوع عملیات */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">نوع عملیات صندوق *</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                >
                  <option value="deposit">سپرده‌گذاری / افزایش سرمایه نقدی (ورود به صندوق انبار)</option>
                  <option value="withdraw">برداشت نقدی سهم‌الشرکه شرکا از صندوق انبار</option>
                </select>
              </div>

              {/* مبلغ */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">مبلغ تراکنش (ریال) *</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={amount || ''}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder="مجموع مبالغ به بهای ریالی"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>
            </div>

            {/* بابت و جزئیات */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">شرح و بابت واگذاری (جزئیات سند مالی) *</label>
              <input
                type="text"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="مثال: واریز آورده نقدی هلدینگ کاویان سپنتا بابت تسویه بدهی به لودرکار یا تامین نقد فاکتور آهن سوپر ویژه"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>

            {/* دکمه‌ها */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsOpenForm(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 font-semibold text-slate-700 rounded-lg"
              >
                انصراف
              </button>
              <button
                type="submit"
                id="submit-capital-tx"
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg"
              >
                ثبت نهایی و واریز به دفاتر
              </button>
            </div>
          </form>
        </div>
      )}

      {/* لیست رویدادها */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2">
          <span className="font-bold text-slate-800 text-sm">سابقه زنده گردش اسناد، خزانه و عواید صندوق جاری انبار خاورشهر</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                <th className="py-3 px-4 rounded-r-lg">تاریخ تراکنش</th>
                <th className="py-3 px-4">شرح تراکنش و بابت</th>
                <th className="py-3 px-4 text-center">نوع رویداد</th>
                <th className="py-3 px-4 text-center">مبلغ جابجا شده</th>
                <th className="py-3 px-4 rounded-l-lg text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    هیچ رویداد مالی در گواهی تراکنش وجود ندارد.
                  </td>
                </tr>
              ) : (
                transactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-500 whitespace-nowrap"><JalaliDate date={tx.date} /></td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{tx.description}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${tx.type === 'deposit' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
                        {tx.type === 'deposit' ? 'ورود به صندوق (آورده)' : 'خروج از صندوق (برداشت)'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-900">{formatRials(tx.amount)}</td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => {
                          if (confirm('تایید می‌کنید رویداد واریز/برداشت حذف شود؟')) {
                            onDeleteTransaction(tx.id);
                          }
                        }}
                        className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
