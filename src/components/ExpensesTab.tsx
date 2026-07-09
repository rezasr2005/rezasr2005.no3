/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ExpenseRecord, ExpenseCategory } from '../types';
import { formatRials, getTodayDate } from '../utils';
import { Plus, Trash2, Search, Filter, Wrench, Landmark, DollarSign, Wallet, Calendar, AlertCircle } from 'lucide-react';

import JalaliDate from './JalaliDate';
interface ExpensesTabProps {
  currentUser?: any;
  expenses: ExpenseRecord[];
  onAddExpense: (record: Omit<ExpenseRecord, 'id'>) => void;
  onDeleteExpense: (id: string) => void;
}

export const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  salary: 'حقوق و دستمزد پرسنل',
  repair: 'تعمیرات و نگهداری دستگاه‌ها',
  rent: 'اجاره‌بهای ماهانه انبار',
  utilities: 'قبوض آب وبازی و برق کارگاهی',
  other: 'سایر هزینه‌های متفرقه'
};

export default function ExpensesTab({
  currentUser,
  expenses,
  onAddExpense,
  onDeleteExpense
}: ExpensesTabProps) {
  
  const isAdmin = currentUser?.role === 'admin';
  const hasPermission = (action: string) => {
    if (isAdmin) return true;
    return (currentUser?.permissions || []).includes(action);
  };

  const [isOpenForm, setIsOpenForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | 'all'>('all');

  // فرم هزینه جدید
  const [date, setDate] = useState(getTodayDate());
  const [category, setCategory] = useState<ExpenseCategory>('salary');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || amount <= 0) {
      alert('لطفاً عنوان شرح هزینه و لزوماً مبلغ مثبت معتبری وارد کنید.');
      return;
    }

    onAddExpense({
      date,
      category,
      title,
      amount,
      description
    });

    // Reset
    setTitle('');
    setAmount(0);
    setDescription('');
    setIsOpenForm(false);
  };

  const filteredExpenses = expenses.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (e.description && e.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || e.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // محاسبات مجموع هزینه به تفکیک
  const getCategorySum = (cat: ExpenseCategory) => {
    return expenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0);
  };

  const totalSum = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6" id="expenses-tab">
      {/* هدر */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">هزینه‌های جاری و بالاسری انبار ضایعات</h2>
          <p className="text-slate-500 text-xs mt-1">مدیریت کامل اجاره‌بها، حقوق برشکاران و رانندگان، بیمه، تعمیر سنگ‌فرز و لودر کوماتسو انبار.</p>
        </div>
        <button
          onClick={() => setIsOpenForm(!isOpenForm)}
          id="toggle-expense-form"
          className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-900 font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-all text-xs"
        >
          <Plus className="w-4 h-4 text-slate-900" />
          {isOpenForm ? 'پنهان کردن فرم ثبت' : 'ثبت هزینه جدید انبار'}
        </button>
      </div>

      {/* خلاصه دسته‌بندی کارت‌های هزینه */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white p-3 rounded-xl border border-slate-200 text-right space-y-1">
          <span className="text-[10px] text-slate-400 block font-semibold">حقوق و پرسنلی</span>
          <span className="text-xs font-bold text-slate-850 block">{formatRials(getCategorySum('salary'))}</span>
        </div>
        <div className="bg-white p-3 rounded-xl border border-slate-200 text-right space-y-1">
          <span className="text-[10px] text-slate-400 block font-semibold">تعمیرات و بن‌های فنی</span>
          <span className="text-xs font-bold text-slate-850 block">{formatRials(getCategorySum('repair'))}</span>
        </div>
        <div className="bg-white p-3 rounded-xl border border-slate-200 text-right space-y-1">
          <span className="text-[10px] text-slate-400 block font-semibold">اجاره‌بهای ملک انبار</span>
          <span className="text-xs font-bold text-slate-850 block">{formatRials(getCategorySum('rent'))}</span>
        </div>
        <div className="bg-white p-3 rounded-xl border border-slate-200 text-right space-y-1">
          <span className="text-[10px] text-slate-400 block font-semibold">قبوض آب/برق سه فاز</span>
          <span className="text-xs font-bold text-slate-850 block">{formatRials(getCategorySum('utilities'))}</span>
        </div>
        <div className="bg-white p-3 rounded-xl border border-slate-200 text-right space-y-1 col-span-2 md:col-span-1">
          <span className="text-[10px] text-slate-400 block font-semibold">سایر (تدارکات و مینی‌مال)</span>
          <span className="text-xs font-bold text-slate-850 block">{formatRials(getCategorySum('other'))}</span>
        </div>
      </div>

      {/* فرم ثبت مجزای هزینه انبار */}
      {isOpenForm && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md transition-all">
          <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-100">
            <Wallet className="w-5 h-5 text-amber-500" />
            <span className="font-bold text-slate-800 text-sm">ثبت سند هزینه جدید در حسابداری انبار</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">تاریخ ثبت هزینه *</label>
                <div className="relative">
                  <Calendar className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="1405/03/27"
                    className="w-full pl-3 pr-10 py-2 border border-slate-200 rounded-lg text-slate-850 text-left dir-ltr focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">دسته‌بندی هزینه *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
                >
                  {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">شرح و عنوان هزینه *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: خرید روغن هيدرولیک ده لیتری لودر"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">مبلغ پرداختی (ریال) *</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={amount || ''}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder="مبلغ پرداختی به ریال"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">توضیحات بیشتر سند</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="توضیحات فاکتور، شخص فنی کار یا شماره شبا بانک مربوطه..."
                rows={2}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-850 focus:outline-none"
              ></textarea>
            </div>

            <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-3 flex gap-2 text-rose-800">
              <AlertCircle className="w-4.5 h-4.5 shrink-0 text-rose-600" />
              <p className="text-[10px] leading-relaxed">
                مهم: هزینه‌های ثبت شده در این بخش به عنوان هزینه‌های عملیاتی جاری انبار طبق فرمول حسابداری کسر می‌شوند. این هزینه‌ها سود نهایی انبار را مستقیماً کاهش داده و در تسهیم سود ۲۰ درصدی شریک انبار اعمال خواهند شد.
              </p>
            </div>

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
                id="submit-expense"
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg"
              >
                تایید و کسر از نقدینگی انبار
              </button>
            </div>
          </form>
        </div>
      )}

      {/* سابقه کلی هزینه‌ها */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-slate-400" />
            <span className="font-bold text-slate-850 text-sm">لیست ریز ریز هزینه‌های پرداخت شده انبار</span>
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {/* جستجو */}
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="جستجو در فاکتورها..."
              className="flex-1 md:flex-none px-3 py-1.5 border border-slate-200 rounded-lg text-slate-800 text-[11px] focus:outline-none"
            />

            {/* دسته‌بندی */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-800 text-[11px] focus:outline-none"
            >
              <option value="all">کلیه دسته‌بندی‌ها</option>
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* جدول فاکتور هزینه */}
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                <th className="py-3 px-4 rounded-r-lg">تاریخ فاکتور</th>
                <th className="py-3 px-4">شرح سند هزینه انبار</th>
                <th className="py-3 px-4 text-center">دسته‌بندی موضوعی</th>
                <th className="py-3 px-4 text-center">مبلغ هزینه (ریال)</th>
                <th className="py-3 px-4 text-center rounded-l-lg">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    هیچ هزینه ثبت شده‌ای یافت نشد.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map(exp => (
                  <tr key={exp.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-500 whitespace-nowrap"><JalaliDate date={exp.date} /></td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{exp.title}</div>
                      {exp.description && (
                        <div className="text-[10px] text-slate-400 mt-1">{exp.description}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-semibold text-slate-700">
                        {CATEGORY_LABELS[exp.category]}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-rose-655">{formatRials(exp.amount)}</td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => {
                          if (confirm('تایید می‌کنید فاکتور مایه هزینه انبار برای همیشه کسر یا حذف گردد؟')) {
                            onDeleteExpense(exp.id);
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

        {/* فوت بار به صورت تجمیعی */}
        <div className="bg-slate-50 rounded-xl p-4 flex justify-between items-center text-slate-700 text-xs font-semibold border border-slate-200">
          <span>مجموع کل هزینه‌های خروجی انبار ضایعات:</span>
          <span className="text-sm font-black text-rose-650">{formatRials(totalSum)}</span>
        </div>
      </div>
    </div>
  );
}
