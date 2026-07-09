/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ScrapGrade, PurchaseRecord } from '../types';
import { formatRials, formatWeight, getTodayDate } from '../utils';
import { Plus, Trash2, Search, Truck, Filter, Scale, FileText, Calendar, Printer } from 'lucide-react';
import { printElement } from '../utils/pdfExport';
import { vazirFont } from '../utils/vazirBase64';

import JalaliDate from './JalaliDate';
interface PurchasesTabProps {
  currentUser?: any;
  grades: ScrapGrade[];
  purchases: PurchaseRecord[];
  onAddPurchase: (record: Omit<PurchaseRecord, 'id'>) => void;
  onDeletePurchase: (id: string) => void;
}

export default function PurchasesTab({
  currentUser,
  grades,
  purchases,
  onAddPurchase,
  onDeletePurchase
}: PurchasesTabProps) {
  // فیلترها
  
  const isAdmin = currentUser?.role === 'admin';
  const hasPermission = (action: string) => {
    if (isAdmin) return true;
    return (currentUser?.permissions || []).includes(action);
  };

  const [previewRecord, setPreviewRecord] = useState<PurchaseRecord | null>(null);

  const handlePrintReceipt = (record: PurchaseRecord) => {
    setPreviewRecord(record);
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGradeId, setSelectedGradeId] = useState('');

  // حالت ساخت فاکتور جدید
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [supplierName, setSupplierName] = useState('');
  const [driverName, setDriverName] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [scrapGradeId, setScrapGradeId] = useState(grades[0]?.id || '');
  const [grossWeight, setGrossWeight] = useState<number>(0);
  const [tareWeight, setTareWeight] = useState<number>(0);
    const [cuttingCost, setCuttingCost] = useState<number>(0);
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [date, setDate] = useState(getTodayDate());
  const [description, setDescription] = useState('');

  // محاسبات آنی فیلدهای وزنی و مالی
  const netWeight = Math.max(0, grossWeight - tareWeight);
  const finalWeight = netWeight;
  const totalPrice = Math.max(0, Math.round(finalWeight * unitPrice) - (cuttingCost || 0));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierName || !driverName || !vehiclePlate || !scrapGradeId || grossWeight <= 0 || tareWeight <= 0 || unitPrice <= 0) {
      alert('لطفاً تمامی فیلدهای الزامی ستاره‌دار را تکمیل بفرمایید.');
      return;
    }

    onAddPurchase({
      date,
      supplierName,
      driverName,
      vehiclePlate,
      scrapGradeId,
      grossWeight,
      tareWeight,
      netWeight,
            cuttingCost,
      finalWeight,
      unitPrice,
      totalPrice,
      description
    });

    // Reset Form
    setSupplierName('');
    setDriverName('');
    setVehiclePlate('');
    setGrossWeight(0);
    setTareWeight(0);
        setCuttingCost(0);
    setUnitPrice(0);
    setDescription('');
    setIsOpenForm(false);
  };

  // فیلتر کردن خریدها
  const filteredPurchases = purchases.filter(p => {
    const matchesSearch = p.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGradeId === '' || p.scrapGradeId === selectedGradeId;
    return matchesSearch && matchesGrade;
  });

  return (
    <div className="space-y-6" id="purchases-tab">
      {/* هدر و دکمه افزودن بار جدید */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">ورود بار و مدیریت باسکول (خرید فرآورده خام)</h2>
          <p className="text-slate-500 text-xs mt-1">امکان ثبت دقیق کامیون‌های ورودی، تعیین وزن پر، تهی، کسر میزان افت بار و بهای خرید.</p>
        </div>
        <button
          onClick={() => setIsOpenForm(!isOpenForm)}
          id="toggle-purchase-form"
          className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-900 font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-all text-xs"
        >
          <Plus className="w-4 h-4 text-slate-900" />
          {isOpenForm ? 'پنهان کردن فرم ثبت' : 'ثبت بار جدید (باسکول ورودی)'}
        </button>
      </div>

      {/* فرم متحرک افزودن خرید بار جدید */}
      {isOpenForm && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md transition-all">
          <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-100">
            <Scale className="w-5 h-5 text-amber-500" />
            <span className="font-bold text-slate-800 text-sm">قبض باسکول الکترونیکی و فاکتور خرید خام</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            {/* اطلاعات اولیه حمل و نقل */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">تاریخ ثبت بار *</label>
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
                <label className="block text-slate-700 font-semibold mb-1.5">نام فروشنده/پیمانکار *</label>
                <input
                  type="text"
                  required
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  placeholder="مثال: ذوب کاران قم"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">نام راننده کامیون *</label>
                <input
                  type="text"
                  required
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  placeholder="مثال: عباس محمودی"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">شماره پلاک خودرو *</label>
                <input
                  type="text"
                  required
                  value={vehiclePlate}
                  onChange={(e) => setVehiclePlate(e.target.value)}
                  placeholder="مثال: ۶۸ ب ۵۴۹ ایران ۴۴"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-amber-500 text-center dir-ltr"
                />
              </div>
            </div>

            {/* انتخاب گرید و محاسبات باسکول */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2 border-t border-slate-50">
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">گرید ضایعات ورودی *</label>
                <select
                  value={scrapGradeId}
                  onChange={(e) => setScrapGradeId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-amber-500"
                >
                  {grades.map(g => (
                    <option key={g.id} value={g.id}>{g.name} ({g.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">وزن پر / باسکول اول (کیلوگرم) *</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={grossWeight || ''}
                  onChange={(e) => setGrossWeight(Number(e.target.value))}
                  placeholder="مثال: ۱۴۵۰۰"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">وزن خالی / کامیون خالی (کیلوگرم) *</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={tareWeight || ''}
                  onChange={(e) => setTareWeight(Number(e.target.value))}
                  placeholder="مثال: ۵۸۰۰"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              
            </div>{/* محاسبات قیمت‌گذاری */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">قیمت واحد خرید (هر کیلو - ریال) *</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={unitPrice || ''}
                  onChange={(e) => setUnitPrice(Number(e.target.value))}
                  placeholder="مثال: ۲۶۵۰۰"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">هزینه برشکاری (ریال)</label>
                <input
                  type="number"
                  min={0}
                  value={cuttingCost || ""}
                  onChange={(e) => setCuttingCost(Number(e.target.value))}
                  placeholder="مثال: ۵۰۰۰۰۰۰"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="col-span-3">
                <label className="block text-slate-700 font-semibold mb-1.5">توضیحات و شرح بارگیری</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="مثلا: تخلیه زیر پل غربی، شامل مقداری سیم فاقد کروم"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* پنل فاکتور زنده باسکول (اتوماسیون آنی محاسباتی) */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-right">
                <span className="text-slate-500 block text-[10px]">وزن ناخالص بار:</span>
                <span className="text-sm font-bold text-slate-700">{formatWeight(netWeight)}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block text-[10px]">وزن مفید پس از کسر افت:</span>
                <span className="text-sm font-bold text-amber-600">{formatWeight(finalWeight)}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block text-[10px]">قیمت یک کیلوگرم:</span>
                <span className="text-sm font-bold text-slate-700">{unitPrice.toLocaleString('fa-IR')} ریال</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block text-[10px]">بهای کل خرید انبار:</span>
                <span className="text-sm font-bold text-emerald-600">{formatRials(totalPrice)}</span>
              </div>
            </div>

            {/* دکمه‌های تایید فرم */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsOpenForm(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
              >
                انصراف
              </button>
              <button
                type="submit"
                id="submit-purchase"
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg"
              >
                تایید نهایی قبض باسکول و ثبت انبار
              </button>
            </div>
          </form>
        </div>
      )}

      {/* بخش فیلترینگ و نمایش جدول */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        
        {/* فیلد جستجوی پیشرفته و آنی درخواستی مدیریت */}
        <div className="bg-slate-50 border border-slate-150 rounded-xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center print:hidden">
          <div className="space-y-1 text-right w-full md:w-auto">
            <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
              <span className="w-1 h-3.5 bg-amber-500 rounded-full"></span>
              جستجوی آنی و فیلتر هوشمند بارهای ورودی
            </h4>
            <p className="text-[10px] text-slate-500">امکان فیلتر سریع و لحظه‌ای بر اساس نام مشتری (فروشنده/پیمانکار) یا شماره پلاک خودروی حامل</p>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="نام مشتری یا شماره پلاک خودرو را جستجو کنید..."
              className="w-full pl-3 pr-10 py-2 border border-slate-200 bg-white rounded-xl text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-sm font-medium"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-slate-400" />
            <span className="font-bold text-slate-800 text-sm">لیست کلی بارهای ورودی باسکول</span>
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {/* فیلتر گرید */}
            <select
              value={selectedGradeId}
              onChange={(e) => setSelectedGradeId(e.target.value)}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="">کلیه گریدها</option>
              {grades.map(g => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
            <button 
              onClick={() => printElement('admin-purchases-table', 'گزارش بارهای ورودی - مدیریت', 'بارهای_ورودی_مدیریت', 'pdf')}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
            >
              <FileText className="w-4 h-4" />
              خروجی PDF
            </button>
            <button 
              onClick={() => printElement('admin-purchases-table', 'گزارش بارهای ورودی - مدیریت', 'بارهای_ورودی_مدیریت', 'print')}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
            >
              <FileText className="w-4 h-4" />
              چاپ
            </button>
          </div>
        </div>

        {/* جدول بزرگ قبض‌ها */}
        <div className="overflow-x-auto">
          <table id="admin-purchases-table" className="w-full text-right border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                <th className="py-3 px-4 rounded-r-lg">تاریخ</th>
                <th className="py-3 px-4">پیمانکار / فروشنده</th>
                <th className="py-3 px-4">راننده و پلاک</th>
                <th className="py-3 px-4 text-center">نوع گرید ضایعات</th>
                <th className="py-3 px-4 text-center">ناخالص / خالص باسکول</th>
                                <th className="py-3 px-4 text-center">وزن نهایی</th>
                <th className="py-3 px-4 text-center">قیمت واحد (کیلو)</th>
                <th className="py-3 px-4 text-center">مبلغ کل خرید</th>
                <th className="py-3 px-4 text-center rounded-l-lg">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPurchases.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400 font-medium">
                    هیچ فاکتور باری مطابق با جستجوی شما پیدا نشد.
                  </td>
                </tr>
              ) : (
                filteredPurchases.map(record => {
                  const grade = grades.find(g => g.id === record.scrapGradeId);
                  return (
                    <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-600 whitespace-nowrap"><JalaliDate date={record.date} /></td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">{record.supplierName}</div>
                        {record.description && (
                          <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{record.description}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-slate-700">{record.driverName}</div>
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5 dir-ltr text-right">{record.vehiclePlate}</div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex px-2 py-1 rounded bg-amber-50 text-amber-800 font-semibold">
                          {grade ? grade.name.split(' (')[0] : 'نامشخص'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-medium text-slate-700">
                        <div>{formatWeight(record.grossWeight)} (ناخالص)</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">خالص: {formatWeight(record.netWeight)}</div>
                      </td>
                                            <td className="py-3.5 px-4 text-center font-bold text-slate-900">{formatWeight(record.finalWeight)}</td>
                      <td className="py-3.5 px-4 text-center font-semibold text-slate-800">
                        {record.unitPrice.toLocaleString('fa-IR')} ریال
                      </td>
                      <td className="py-3.5 px-4 text-center font-black text-emerald-700">{formatRials(record.totalPrice)}</td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handlePrintReceipt(record)}
                            className="p-1.5 hover:bg-amber-50 text-amber-600 hover:text-amber-700 rounded-lg transition-all flex items-center gap-1 font-bold text-[10px]"
                            title="چاپ رسید رسمی"
                          >
                            <Printer className="w-3.5 h-3.5 text-amber-500" />
                            <span>چاپ رسید</span>
                          </button>
                          {hasPermission('purchases-delete') && (
                            <button
                              onClick={() => {
                                if (confirm('آیا مایلید این قبض باسکول خرید را حذف کنید؟ این عمل موجودی انبار را نیز تعدیل خواهد کرد.')) {
                                  onDeletePurchase(record.id);
                                }
                              }}
                              className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                              title="حذف قبض بار"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {previewRecord && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 overflow-y-auto p-4 md:p-8 flex items-center justify-center print:p-0 print:bg-transparent print:static">
          <style dangerouslySetInnerHTML={{ __html: `
            @media print {
              body * {
                visibility: hidden !important;
              }
              .printable-receipt-area,
              .printable-receipt-area * {
                visibility: visible !important;
              }
              .printable-receipt-area {
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                max-width: 100% !important;
                padding: 0 !important;
                margin: 0 !important;
                border: none !important;
                box-shadow: none !important;
                background-color: #ffffff !important;
                color: #000000 !important;
              }
              @font-face {
                font-family: 'VazirmatnPDF';
                src: url('data:font/truetype;charset=utf-8;base64,${vazirFont}') format('truetype');
                font-weight: normal;
                font-style: normal;
              }
              * {
                font-family: 'VazirmatnPDF', sans-serif !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
            }
          `}} />
          
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-3xl w-full p-6 space-y-6 animate-in fade-in zoom-in-95 duration-250 print:shadow-none print:border-none print:p-0 print:rounded-none">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pb-4 border-b border-slate-100 print:hidden">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-amber-500 animate-pulse" />
                <span className="font-extrabold text-slate-800 text-sm">پیش‌نمایش قبض رسمی باسکول (خرید)</span>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => window.print()}
                  className="flex-1 sm:flex-none px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 animate-bounce"
                >
                  <Printer className="w-4 h-4" />
                  <span>ارسال به چاپگر (تایید نهایی)</span>
                </button>
                <button
                  onClick={() => setPreviewRecord(null)}
                  className="flex-1 sm:flex-none px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <span>انصراف و بستن</span>
                </button>
              </div>
            </div>

            {/* Printable Content */}
            <div className="printable-receipt-area bg-slate-50 p-6 border-2 border-dashed border-slate-300 rounded-2xl space-y-6 print:bg-white print:border-solid print:border-2 print:border-black print:p-4 print:rounded-none text-right" dir="rtl">
              
              {/* Header Table */}
              <table className="w-full border-collapse" style={{ border: '2px solid #000000' }}>
                <tbody>
                  <tr>
                    <td className="p-4 text-center font-bold text-sm text-black" style={{ borderLeft: '1px solid #000000', width: '25%' }}>
                      هلدینگ فولاد کاویان سپنتا
                    </td>
                    <td className="p-4 text-center text-black" style={{ borderLeft: '1px solid #000000', width: '50%' }}>
                      <h2 className="text-base font-extrabold tracking-tight">قبض رسمی باسکول و رسید خرید فرآورده خام</h2>
                      <p className="text-[10px] text-slate-500 mt-1 print:text-black">سیستم اتوماسیون یکپارچه انبار خاورشهر</p>
                    </td>
                    <td className="p-4 text-right text-[10px] text-black leading-relaxed" style={{ width: '25%' }}>
                      <div>شماره قبض: <strong className="font-mono text-xs">{previewRecord.weighbridgeCode || previewRecord.id.slice(0, 8)}</strong></div>
                      <div>تاریخ ثبت: <strong><JalaliDate date={previewRecord.date} /></strong></div>
                      <div>وضعیت سند: <strong className="text-emerald-600 print:text-black">ثبت نهایی سیستم</strong></div>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Supplier and Vehicle details */}
              <table className="w-full border-collapse" style={{ border: '1px solid #000000' }}>
                <tbody>
                  <tr>
                    <td className="p-3 font-bold text-black" style={{ backgroundColor: '#f1f5f9', borderLeft: '1px solid #000000', borderBottom: '1px solid #000000', width: '20%' }}>
                      پیمانکار / فروشنده:
                    </td>
                    <td className="p-3 text-black text-xs font-bold" style={{ borderBottom: '1px solid #000000', width: '80%' }} colSpan={3}>
                      {previewRecord.supplierName}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-black" style={{ backgroundColor: '#f1f5f9', borderLeft: '1px solid #000000', width: '20%' }}>
                      راننده حامل:
                    </td>
                    <td className="p-3 text-black" style={{ borderLeft: '1px solid #000000', width: '30%' }}>
                      {previewRecord.driverName}
                    </td>
                    <td className="p-3 font-bold text-black" style={{ backgroundColor: '#f1f5f9', borderLeft: '1px solid #000000', width: '20%' }}>
                      شماره پلاک خودرو:
                    </td>
                    <td className="p-3 text-black font-mono text-center font-bold text-sm" style={{ width: '30%' }}>
                      {previewRecord.vehiclePlate}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Weights Table */}
              <table className="w-full border-collapse text-center" style={{ border: '1px solid #000000' }}>
                <thead>
                  <tr style={{ backgroundColor: '#e2e8f0' }}>
                    <th className="p-2.5 font-bold text-black text-xs" style={{ borderLeft: '1px solid #000000', borderBottom: '1px solid #000000' }}>نوع گرید ضایعات</th>
                    <th className="p-2.5 font-bold text-black text-xs" style={{ borderLeft: '1px solid #000000', borderBottom: '1px solid #000000' }}>وزن ناخالص (کیلو)</th>
                    <th className="p-2.5 font-bold text-black text-xs" style={{ borderLeft: '1px solid #000000', borderBottom: '1px solid #000000' }}>وزن خالی خودرو</th>
                    <th className="p-2.5 font-bold text-black text-xs" style={{ borderLeft: '1px solid #000000', borderBottom: '1px solid #000000' }}>وزن خالص بار (کیلو)</th>
                    <th className="p-2.5 font-bold text-black text-xs" style={{ borderLeft: '1px solid #000000', borderBottom: '1px solid #000000' }}>افت / کسورات</th>
                    <th className="p-2.5 font-bold text-black text-xs" style={{ borderBottom: '1px solid #000000' }}>وزن نهایی تحویلی</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 text-black font-bold" style={{ borderLeft: '1px solid #000000' }}>
                      {grades.find(g => g.id === previewRecord.scrapGradeId)?.name || 'نامشخص'}
                    </td>
                    <td className="p-3 text-black" style={{ borderLeft: '1px solid #000000' }}>{previewRecord.grossWeight.toLocaleString('fa-IR')}</td>
                    <td className="p-3 text-black" style={{ borderLeft: '1px solid #000000' }}>{previewRecord.tareWeight.toLocaleString('fa-IR')}</td>
                    <td className="p-3 text-black" style={{ borderLeft: '1px solid #000000' }}>{previewRecord.netWeight.toLocaleString('fa-IR')}</td>
                    <td className="p-3 text-black text-[10px]" style={{ borderLeft: '1px solid #000000' }}>
                      {previewRecord.cuttingCost ? 'دارای هزینه برشکاری' : 'فاقد کسر یا افت'}
                    </td>
                    <td className="p-3 text-black font-extrabold text-sm bg-slate-100 print:bg-transparent">{previewRecord.finalWeight.toLocaleString('fa-IR')}</td>
                  </tr>
                </tbody>
              </table>

              {/* Price Details */}
              <table className="w-full border-collapse" style={{ border: '1px solid #000000' }}>
                <tbody>
                  <tr>
                    <td className="p-3 font-bold text-black" style={{ backgroundColor: '#f1f5f9', borderLeft: '1px solid #000000', borderBottom: '1px solid #000000', width: '25%' }}>
                      بهای واحد (هر کیلو):
                    </td>
                    <td className="p-3 text-black" style={{ borderLeft: '1px solid #000000', borderBottom: '1px solid #000000', width: '25%' }}>
                      <strong>{previewRecord.unitPrice.toLocaleString('fa-IR')}</strong> ریال
                    </td>
                    <td className="p-3 font-bold text-black" style={{ backgroundColor: '#f1f5f9', borderLeft: '1px solid #000000', borderBottom: '1px solid #000000', width: '25%' }}>
                      هزینه برشکاری / افت:
                    </td>
                    <td className="p-3 text-black" style={{ borderBottom: '1px solid #000000', width: '25%' }}>
                      <strong>{previewRecord.cuttingCost ? previewRecord.cuttingCost.toLocaleString('fa-IR') : '۰'}</strong> ریال
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-black" style={{ backgroundColor: '#cbd5e1', borderLeft: '1px solid #000000', width: '25%' }}>
                      مبلغ کل نهایی خرید:
                    </td>
                    <td className="p-3.5 text-emerald-800 font-extrabold text-sm" style={{ backgroundColor: '#f8fafc', width: '75%' }} colSpan={3}>
                      {previewRecord.totalPrice.toLocaleString('fa-IR')} ریال
                    </td>
                  </tr>
                  {previewRecord.description && (
                    <tr>
                      <td className="p-3 font-bold text-black" style={{ backgroundColor: '#f1f5f9', borderLeft: '1px solid #000000', borderTop: '1px solid #000000', width: '25%' }}>
                        توضیحات و ملاحظات:
                      </td>
                      <td className="p-3 text-black text-xs" style={{ borderTop: '1px solid #000000', width: '75%' }} colSpan={3}>
                        {previewRecord.description}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Informative footer */}
              <div className="text-[9px] text-slate-500 border-b border-dashed border-slate-300 pb-2 text-center leading-relaxed print:text-black">
                💡 این قبض به صورت الکترونیکی صادر شده و هرگونه قلم‌خوردگی یا دستکاری فاقد اعتبار است. سیستم توزیع و باسکول خاورشهر (فولاد کاویان سپنتا).
              </div>

              {/* Signature Blocks */}
              <div className="flex justify-between items-center pt-8 px-4">
                <div className="text-center font-bold text-black text-xs w-48">
                  <div className="pb-8">امضا و اثر انگشت راننده</div>
                  <div className="w-full border-t border-dashed border-black"></div>
                </div>
                <div className="text-center font-bold text-black text-xs w-48">
                  <div className="pb-8">مهر و امضای متصدی باسکول</div>
                  <div className="w-full border-t border-dashed border-black"></div>
                </div>
                <div className="text-center font-bold text-black text-xs w-48">
                  <div className="pb-8">تاییدیه نهایی امور مالی</div>
                  <div className="w-full border-t border-dashed border-black"></div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
