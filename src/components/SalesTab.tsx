/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ScrapGrade, SaleRecord } from '../types';
import { formatWeight, formatRials, getTodayDate } from '../utils';
import { Plus, Trash2, Search, ArrowUpRight, Scale, ShoppingBag, Calendar, AlertCircle } from 'lucide-react';

import JalaliDate from './JalaliDate';
interface SalesTabProps {
  grades: ScrapGrade[];
  currentUser?: any;
  sales: SaleRecord[];
  onAddSale: (record: Omit<SaleRecord, 'id'>) => void;
  onUpdateSale?: (record: SaleRecord) => void;
  onDeleteSale: (id: string) => void;
}

export default function SalesTab({
  grades,
  sales,
  currentUser,
  onAddSale,
  onDeleteSale,
  onUpdateSale
}: SalesTabProps) {
  
  const isAdmin = currentUser?.role === 'admin';
  const hasPermission = (action: string) => {
    if (isAdmin) return true;
    return (currentUser?.permissions || []).includes(action);
  };

  const [isOpenForm, setIsOpenForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGradeId, setSelectedGradeId] = useState('');

  // فیلدهای فرم جدید
  const [editingSale, setEditingSale] = useState<SaleRecord | null>(null);

  // فیلدهای فرم
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceCompany, setInvoiceCompany] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [wasteKg, setWasteKg] = useState<number>(0);
  const [scaleDifference, setScaleDifference] = useState<number>(0);

  const [date, setDate] = useState(getTodayDate());
  const [scrapGradeId, setScrapGradeId] = useState(grades[0]?.id || '');
  const [netWeight, setNetWeight] = useState<number>(0);
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [buyerName, setBuyerName] = useState('');
  const [driverName, setDriverName] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [description, setDescription] = useState('');

  // تنظیم اتومات قیمت پیشنهادی فروش گرید وقتی گرید تغییر می‌کند
  useEffect(() => {
    const selected = grades.find(g => g.id === scrapGradeId);
    if (selected) {
      setUnitPrice(selected.typicalSellPrice);
    }
  }, [scrapGradeId, grades]);

  // پیدا کردن موجودی فعلی گرید انتخاب شده برای ارزیابی سقف مجاز فروش
  const selectedGradeStock = grades.find(g => g.id === scrapGradeId)?.stockKg || 0;

  const finalWeight = Math.max(0, netWeight - (wasteKg || 0) + (scaleDifference || 0));
  const totalPrice = finalWeight * unitPrice;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (netWeight <= 0 || unitPrice <= 0 || !buyerName || !driverName || !vehiclePlate) {
      alert('لطفاً همه پارامترهای ضروری را پر کنید.');
      return;
    }

    if (netWeight > selectedGradeStock) {
      if (!confirm(`موجودی فیزیکی این ضایعات در انبار (${formatWeight(selectedGradeStock)}) کمتر از میزان درخواستی شما جهت فروش (${formatWeight(netWeight)}) است. آیا مایلید با همین مقدار ظرفیت منفی فاکتور ثبت شود؟`)) {
        return;
      }
    }

    if (editingSale) {
      if (onUpdateSale) {
        onUpdateSale({
          ...editingSale,
          date,
          scrapGradeId,
          netWeight,
          unitPrice,
          totalPrice,
          buyerName,
          driverName,
          vehiclePlate,
          description,
          invoiceNumber,
          invoiceCompany,
          invoiceDate,
          wasteKg,
          scaleDifference,
          editCount: (editingSale.editCount || 0) + 1
        });
      }
    } else {
      onAddSale({
        date,
        scrapGradeId,
        netWeight,
        unitPrice,
        totalPrice,
        buyerType: 'smelter_direct',
        buyerName,
        driverName,
        vehiclePlate,
        description,
        invoiceNumber,
        invoiceCompany,
        invoiceDate,
        wasteKg,
        scaleDifference,
        editCount: 0
      });
    }

    // Reset Form
    setBuyerName('');
    setNetWeight(0);
    setDriverName('');
    setVehiclePlate('');
    setDescription('');
    setInvoiceNumber('');
    setInvoiceCompany('');
    setInvoiceDate('');
    setWasteKg(0);
    setScaleDifference(0);
    setEditingSale(null);
    setIsOpenForm(false);
  };

  const filteredSales = sales.filter(s => {
    const matchesSearch = s.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGradeId === '' || s.scrapGradeId === selectedGradeId;
    return matchesSearch && matchesGrade;
  });

  return (
    <div className="space-y-6" id="sales-tab">
      {/* هدر */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">حواله خروج و فروش بار انبار</h2>
          <p className="text-slate-500 text-xs mt-1">تسهیل فرآیند خروج بار فرآوری‌شده به مقصد کارخانه‌های ذوب و خریداران مختلف.</p>
        </div>
        <button
          onClick={() => {
          if (isOpenForm) {
            setIsOpenForm(false);
            setEditingSale(null);
            // Reset fields
            setBuyerName('');
            setNetWeight(0);
            setDriverName('');
            setVehiclePlate('');
            setDescription('');
            setInvoiceNumber('');
            setInvoiceCompany('');
            setInvoiceDate('');
            setWasteKg(0);
            setScaleDifference(0);
          } else {
            setIsOpenForm(true);
          }
        }}
          id="toggle-sale-form"
          className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-900 font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-all text-xs"
        >
          <Plus className="w-4 h-4 text-slate-900" />
          {isOpenForm ? 'پنهان کردن فرم حواله' : (editingSale ? 'ویرایش حواله فروش' : 'ثبت حواله فروش جدید (انبار)')}
        </button>
      </div>

      {/* فرم ثبت فاکتور/حواله فروش محصولات */}
      {isOpenForm && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md transition-all">
          <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-100">
            <ShoppingBag className="w-5 h-5 text-amber-500" />
            <span className="font-bold text-slate-800 text-sm">حواله خروج بار باسکول و بارنامه فروش انبار</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
             {/* اطلاعات پایه و وسیله نقلیه */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">تاریخ خروج فاکتور *</label>
                <div className="relative">
                  <Calendar className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="1405/03/27"
                    className="w-full pl-3 pr-10 py-2 border border-slate-200 rounded-lg text-slate-800 text-left dir-ltr focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">نام کارخانه / خریدار نهایی *</label>
                <input
                  type="text"
                  required
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="مثال: ذوب آهن اصفهان"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-amber-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">نام راننده بارگذار *</label>
                <input
                  type="text"
                  required
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  placeholder="مثال: کریم کرمی"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">پلاک تریلی خروجی *</label>
                <input
                  type="text"
                  required
                  value={vehiclePlate}
                  onChange={(e) => setVehiclePlate(e.target.value)}
                  placeholder="مثال: ۱۴ ع ۳۹۱ ایران ۹۹"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-amber-500 text-center dir-ltr"
                />
              </div>
            </div>

            {/* گرید و وزن فیزیکی باسکول خروجی */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2 border-t border-slate-50">
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">گرید فروخته شده *</label>
                <select
                  value={scrapGradeId}
                  onChange={(e) => setScrapGradeId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-amber-500"
                >
                  {grades.map(g => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">وزن خالص تصفیه شده (کیلوگرم) *</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={netWeight || ''}
                  onChange={(e) => setNetWeight(Number(e.target.value))}
                  placeholder="مثال: ۱۲۰۰۰"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-amber-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  موجود کلی فعلی این گرید: <strong className="text-slate-600">{formatWeight(selectedGradeStock)}</strong>
                </span>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">فروش به ازای هر کیلوگرم (ریال) *</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={unitPrice || ''}
                  onChange={(e) => setUnitPrice(Number(e.target.value))}
                  placeholder="مثال: ۳۱۰۰۰"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">شماره فاکتور</label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  placeholder="شماره فاکتور"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">شرکت صادرکننده</label>
                <input
                  type="text"
                  value={invoiceCompany}
                  onChange={(e) => setInvoiceCompany(e.target.value)}
                  placeholder="شرکت صادرکننده"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">تاریخ فاکتور</label>
                <input
                  type="text"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  placeholder="مثال: 1405/03/27"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-amber-500 text-left dir-ltr"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">افت بار (کیلوگرم)</label>
                <input
                  type="number"
                  min={0}
                  value={wasteKg || ''}
                  onChange={(e) => setWasteKg(Number(e.target.value))}
                  placeholder="مثال: ۵۰"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">اختلاف باسکول (کیلوگرم)</label>
                <input
                  type="number"
                  value={scaleDifference || ''}
                  onChange={(e) => setScaleDifference(Number(e.target.value))}
                  placeholder="مثبت یا منفی"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1.5 font-medium">ملاحظات و بند بارنامه</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="مثلا: تحویل حراست درب شمالی"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* هشدار حاشیه و خطای منفی شدن انبار */}
            {netWeight > selectedGradeStock && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex gap-2 text-rose-800">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <p className="text-[10px]">
                  توجه: این حواله بیشتر از موجودی فیزیکی است. این عمل مجاز است اما انباردار باید مطمئن باشد باسکول خام یا گریدبندی درستی در سوابق قبل دارد.
                </p>
              </div>
            )}

            {/* فیش زنده مالی فروش */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-wrap justify-between items-center gap-4">
              <div className="space-y-1">
                <span className="text-slate-500 block text-[10px]">مجموع تناژ خروجی:</span>
                <span className="text-sm font-bold text-slate-850">{formatWeight(netWeight)}</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-500 block text-[10px]">نرخ برآورد شده کیلوگرم:</span>
                <span className="text-sm font-semibold text-slate-800">{unitPrice.toLocaleString('fa-IR')} ریال</span>
              </div>
              <div className="space-y-1 text-left">
                <span className="text-slate-500 block text-[10px]">مبلغ ناخالص فاکتور فروش انبار:</span>
                <span className="text-base font-black text-emerald-600">{formatRials(totalPrice)}</span>
              </div>
            </div>

            {/* اقدامات */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsOpenForm(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-750 font-bold rounded-lg"
              >
                انصراف
              </button>
              <button
                type="submit"
                id="submit-sale"
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg"
              >
                تایید بارگیری و صدور حواله خروج
              </button>
            </div>
          </form>
        </div>
      )}

      {/* گزارش سابقه حواله‌ها */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        
        {/* فیلد جستجوی پیشرفته و آنی درخواستی مدیریت */}
        <div className="bg-slate-50 border border-slate-150 rounded-xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="space-y-1 text-right w-full md:w-auto">
            <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
              <span className="w-1 h-3.5 bg-amber-500 rounded-full"></span>
              جستجوی آنی و فیلتر هوشمند حواله‌های فروش
            </h4>
            <p className="text-[10px] text-slate-500">امکان فیلتر سریع و لحظه‌ای بر اساس نام مشتری (خریدار/کارخانه مقصد) یا شماره پلاک خودروی حامل</p>
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
            <ShoppingBag className="w-5 h-5 text-slate-400" />
            <span className="font-bold text-slate-800 text-sm">سابقه حواله خروج محصول گریدبندی شده</span>
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {/* گرید */}
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
          </div>
        </div>

        {/* لیست محصولات فروخته شده */}
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                <th className="py-3 px-4 rounded-r-lg">تاریخ فروش</th>
                <th className="py-3 px-4">نوع گرید</th>
                <th className="py-3 px-4">خریدار / کارخانه مقصد</th>
                <th className="py-3 px-4 text-center">تناژ خالص</th>
                <th className="py-3 px-4 text-center">قیمت فروش (کیلو)</th>
                <th className="py-3 px-4 text-center">کل مبلغ معامله</th>
                <th className="py-3 px-4 rounded-l-lg text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">
                    موردی یافت نشد.
                  </td>
                </tr>
              ) : (
                filteredSales.map(sale => {
                  const grade = grades.find(g => g.id === sale.scrapGradeId);
                  return (
                    <tr key={sale.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-500 whitespace-nowrap"><JalaliDate date={sale.date} /></td>
                      <td className="py-3 px-4 font-bold text-slate-700">{grade ? grade.name.split(' (')[0] : 'نامشخص'}</td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-800">{sale.buyerName}</div>
                        <div className="text-[10px] text-slate-400 mt-1">راننده: {sale.driverName} | پلاک: {sale.vehiclePlate}</div>
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-slate-800">{formatWeight(sale.netWeight)}</td>
                      <td className="py-3 px-4 text-center font-semibold text-slate-700">{sale.unitPrice.toLocaleString('fa-IR')} ریال</td>
                      <td className="py-3 px-4 text-center font-bold text-emerald-700">{formatRials(sale.totalPrice)}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {hasPermission('sales-edit') && (
                          <button
                            title={(currentUser?.role !== 'admin' && sale.editCount && sale.editCount >= 1) ? "فقط یک بار قابلیت ویرایش دارد" : "ویرایش"}
                            disabled={currentUser?.role !== 'admin' && sale.editCount && sale.editCount >= 1}
                            onClick={() => {
                              setEditingSale(sale);
                              setDate(sale.date);
                              setScrapGradeId(sale.scrapGradeId);
                              setNetWeight(sale.netWeight);
                              setUnitPrice(sale.unitPrice);
                              setBuyerName(sale.buyerName);
                              setDriverName(sale.driverName);
                              setVehiclePlate(sale.vehiclePlate);
                              setDescription(sale.description || '');
                              setInvoiceNumber(sale.invoiceNumber || '');
                              setInvoiceCompany(sale.invoiceCompany || '');
                              setInvoiceDate(sale.invoiceDate || '');
                              setWasteKg(sale.wasteKg || 0);
                              setScaleDifference(sale.scaleDifference || 0);
                              setIsOpenForm(true);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className={`p-1.5 rounded transition-colors ${(currentUser?.role !== 'admin' && sale.editCount && sale.editCount >= 1) ? 'text-slate-300 cursor-not-allowed' : 'text-blue-500 hover:bg-blue-50'}`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                          </button>
                        )}
                          {hasPermission('sales-delete') && (
                          <button
                            onClick={() => {
                            if (confirm('تایید می‌کنید این فاکتور خروج با موفقیت کسر یا حذف گردد؟ این کار موجودی را به انبار برگشت می‌زند.')) {
                              onDeleteSale(sale.id);
                            }
                          }}
                          className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
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
    </div>
  );
}
