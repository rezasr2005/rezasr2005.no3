/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ScrapGrade, ProcessingRecord } from '../types';
import { formatWeight, formatRials, getTodayDate } from '../utils';
import { Plus, Trash2, Scissors, ArrowLeftRight, Activity, Calendar, HelpCircle } from 'lucide-react';

import JalaliDate from './JalaliDate';
interface ProcessingTabProps {
  currentUser?: any;
  grades: ScrapGrade[];
  processings: ProcessingRecord[];
  onAddProcessing: (record: Omit<ProcessingRecord, 'id'>) => void;
  onDeleteProcessing: (id: string) => void;
}

export default function ProcessingTab({
  currentUser,
  grades,
  processings,
  onAddProcessing,
  onDeleteProcessing
}: ProcessingTabProps) {
  
  const isAdmin = currentUser?.role === 'admin';
  const hasPermission = (action: string) => {
    if (isAdmin) return true;
    return (currentUser?.permissions || []).includes(action);
  };

  const [isOpenForm, setIsOpenForm] = useState(false);
  const [date, setDate] = useState(getTodayDate());
  const [sourceGradeId, setSourceGradeId] = useState(grades[0]?.id || '');
  const [sourceWeightKg, setSourceWeightKg] = useState<number>(0);
  const [targetGradeId, setTargetGradeId] = useState(grades[0]?.id || '');
  const [targetWeightKg, setTargetWeightKg] = useState<number>(0);
  const [processingCost, setProcessingCost] = useState<number>(0);
  const [laborName, setLaborName] = useState('');
  const [description, setDescription] = useState('');

  // محاسبه خودکار افت فرآیند (ضایعات، خاکسترهای تولیدی، سیم گریس تفکیکی)
  const wasteWeightKg = Math.max(0, sourceWeightKg - targetWeightKg);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sourceGradeId === targetGradeId) {
      alert('گرید خام مبدا و گرید فرآوری‌شده مقصد نباید پکسان باشند.');
      return;
    }
    if (sourceWeightKg <= 0 || targetWeightKg <= 0 || targetWeightKg > sourceWeightKg) {
      alert('وزن خروجی نهایی باید مابین صفر و وزن ناخالص ورودی باشد.');
      return;
    }
    if (!laborName) {
      alert('لطفاً نام سرپرست یا کارگر اجرایی فرآیند را درج کنید.');
      return;
    }

    onAddProcessing({
      date,
      sourceGradeId,
      sourceWeightKg,
      targetGradeId,
      targetWeightKg,
      wasteWeightKg,
      processingCost,
      laborName,
      description
    });

    // Reset Form
    setSourceWeightKg(0);
    setTargetWeightKg(0);
    setProcessingCost(0);
    setLaborName('');
    setDescription('');
    setIsOpenForm(false);
  };

  return (
    <div className="space-y-6" id="processing-tab">
      {/* هدر و دکمه راه‌اندازی فرآیند جدید */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">فرآوری، دسته‌بندی و برش‌کاری ضایعات</h2>
          <p className="text-slate-500 text-xs mt-1">
            عملیات برش شاسی‌ها با هواگاز و پرس هیدرولیکی ورقه خودروهای فرسوده جهت تبدیل گرید سبک به ویژه و سوپر کارگاهی.
          </p>
        </div>
        <button
          onClick={() => setIsOpenForm(!isOpenForm)}
          id="toggle-processing-form"
          className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-900 font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-all text-xs"
        >
          <Scissors className="w-4 h-4 text-slate-900" />
          {isOpenForm ? 'پنهان کردن فرم فرآوری' : 'ثبت عملیات جدید فرآوری (پک و برش)'}
        </button>
      </div>

      {/* راهنمای کارآمدی فرآوری */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-xs text-amber-800">
        <HelpCircle className="w-5 h-5 shrink-0 text-amber-600" />
        <div className="leading-relaxed">
          <p className="font-bold mb-1">💡 ارزش افزوده فرآوری چیست؟</p>
          <p>
            تفاوت اصلی کارخانه ذوب با انبارهای فرعی در پذیرش بار پاکسازی شده است. وقتی بار سبک (مثلا شاسی گالوانیزه نازک) را با لودر جمع‌آوری کرده و زیر دستگاه پرس یا تیغه گیوتین انبار کات و متراکم می‌کنید، گرید بار بالا رفته و با بهای بسیار عالی به کارخانه ذوب به فروش می‌رسد. این سیستم تناژ موجود مربوطه را کسر کرده و گرید با ارزش‌تر را افزایش می‌دهد.
          </p>
        </div>
      </div>

      {/* فرم ثبت عملیات جابجایی و فرآوری بار */}
      {isOpenForm && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md transition-all">
          <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-100">
            <ArrowLeftRight className="w-5 h-5 text-amber-500" />
            <span className="font-bold text-slate-800 text-sm">فرم ثبت گزارش فرآوری انبار (برش و قالب پرس)</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            {/* اطلاعات پایه فردی */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">تاریخ انجام فرآیند *</label>
                <div className="relative">
                  <Calendar className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="مثال: 1405/03/27"
                    className="w-full pl-3 pr-10 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-amber-500 text-left dir-ltr"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">اپراتور قالب‌زن / سرپرست برش‌کار *</label>
                <input
                  type="text"
                  required
                  value={laborName}
                  onChange={(e) => setLaborName(e.target.value)}
                  placeholder="مثال: دلاور کرمی (برشکار ارشد)"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">هزینه متفرقه اجرایی این نوبت (ریال)</label>
                <input
                  type="number"
                  min={0}
                  value={processingCost || ''}
                  onChange={(e) => setProcessingCost(Number(e.target.value))}
                  placeholder="هزینه اکسیژن، برقکار، گازوئیل لودر..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* ورودی و خروجی فیزیکی بارهای ضایع */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-50">
              {/* گرید خام اولیه مبدا */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                <span className="font-bold text-slate-700 block text-xs">گرید مواد اولیه ورودی (برداشت از انبار)</span>
                <div>
                  <label className="block text-slate-600 mb-1">انتخاب گرید خام مبدا *</label>
                  <select
                    value={sourceGradeId}
                    onChange={(e) => setSourceGradeId(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-amber-500"
                  >
                    {grades.map(g => (
                      <option key={g.id} value={g.id}>{g.name} (کد: {g.code})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">وزن برداشته شده برای پردازش (کیلوگرم) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={sourceWeightKg || ''}
                    onChange={(e) => setSourceWeightKg(Number(e.target.value))}
                    placeholder="مثال: ۵۰۰۰"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* گرید فرآوری شده نهایی */}
              <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200 space-y-4">
                <span className="font-bold text-amber-800 block text-xs">گرید خروجی نهایی فرآوری پر انرژی</span>
                <div>
                  <label className="block text-slate-600 mb-1">انتخاب گرید فرآوری‌شده نهایی *</label>
                  <select
                    value={targetGradeId}
                    onChange={(e) => setTargetGradeId(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-amber-500"
                  >
                    {grades.map(g => (
                      <option key={g.id} value={g.id}>{g.name} (کد: {g.code})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">وزن بار خالص تولیدشده (کیلوگرم) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={targetWeightKg || ''}
                    onChange={(e) => setTargetWeightKg(Number(e.target.value))}
                    placeholder="مثال: ۴۷۵۰"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* توضیحات تکمیلی */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1.5 font-medium">جزئیات و توضیحات فرآیند قالب‌زنی یا کاتر</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="تخلیه عدل‌ها با لیفتراک و جداسازی ورق گالوانیزه از رویه روغنی گرید یک"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* صفحه فیش لایو محاسبات افت */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <span className="text-slate-500 block text-[10px]">حجم کسر شده خام:</span>
                <span className="text-sm font-bold text-rose-600">{formatWeight(sourceWeightKg)}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">افت ریز فرآیند (ضایعات خاک/رنگ):</span>
                <span className="text-sm font-bold text-amber-700">{formatWeight(wasteWeightKg)}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">افزایش یافته به انبار خالص:</span>
                <span className="text-sm font-bold text-emerald-600">{formatWeight(targetWeightKg)}</span>
              </div>
            </div>

            {/* تاییدها */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsOpenForm(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg"
              >
                انصراف
              </button>
              <button
                type="submit"
                id="submit-processing"
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg"
              >
                ذخیره گزارش و تعدیل موجودی تناژ انبار
              </button>
            </div>
          </form>
        </div>
      )}

      {/* گزارش فیزیکی نهایی عملیات‌ها */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
          <Activity className="w-5 h-5 text-amber-500" />
          <span className="font-bold text-slate-800 text-sm">دفتر ثبت جابجایی و فرآوری‌های ارزش افزوده</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                <th className="py-3 px-4 rounded-r-lg">تاریخ</th>
                <th className="py-3 px-4">مباشر عملیات</th>
                <th className="py-3 px-4 text-center">ضایعات مبدا کسرشده</th>
                <th className="py-3 px-4 text-center">ضایعات مقصد تولیدشده</th>
                <th className="py-3 px-4 text-center">افت فرآوری کوره دِوار</th>
                <th className="py-3 px-4 text-center">بهای هزینه متفرقه</th>
                <th className="py-3 px-4 rounded-l-lg text-center">حذف سند</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {processings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">
                    هیچ رکورد ثبت شده‌ای برای پردازش ضایعات در سیستم یافت نشد.
                  </td>
                </tr>
              ) : (
                processings.map(proc => {
                  const srcGrade = grades.find(g => g.id === proc.sourceGradeId);
                  const tgtGrade = grades.find(g => g.id === proc.targetGradeId);
                  return (
                    <tr key={proc.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-600 whitespace-nowrap"><JalaliDate date={proc.date} /></td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-800">{proc.laborName}</div>
                        {proc.description && (
                          <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{proc.description}</div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center font-semibold text-rose-700">
                        <div>{formatWeight(proc.sourceWeightKg)}</div>
                        <div className="text-[10px] text-slate-400 font-medium mt-0.5">({srcGrade?.code || 'کد مبدا'})</div>
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-emerald-700">
                        <div>{formatWeight(proc.targetWeightKg)}</div>
                        <div className="text-[10px] text-slate-400 font-medium mt-0.5">({tgtGrade?.code || 'کد مقصد'})</div>
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-amber-700">
                        {formatWeight(proc.wasteWeightKg)}
                      </td>
                      <td className="py-3 px-4 text-center font-semibold text-slate-700">
                        {formatRials(proc.processingCost)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => {
                            if (confirm('تایید می‌کنید که این سند فرآوری به حالت عقب برگردد؟ حجم انبار نیز با این تغییر جابجا می‌شود.')) {
                              onDeleteProcessing(proc.id);
                            }
                          }}
                          className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
