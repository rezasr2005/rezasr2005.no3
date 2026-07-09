import React, { useState, useMemo, useEffect } from 'react';
import { LogOut, FileText, Download, AlertCircle, CheckCircle2, Search, ArrowDownCircle, ArrowUpCircle, CheckCircle, Clock } from 'lucide-react';
import { CustomerRecord, PurchaseRecord, CustomerPayment, ScrapGrade } from '../types';
import { toPersianDigits } from '../utils';
import { printElement } from '../utils/pdfExport';

import JalaliDate from './JalaliDate';
interface CustomerPanelProps {
  currentUser: CustomerRecord;
  purchases: PurchaseRecord[];
  payments: CustomerPayment[];
  grades: ScrapGrade[];
  onLogout: () => void;
  onDisputeToggle: (purchaseId: string) => void;
}

export default function CustomerPanel({ currentUser, purchases, payments, grades, onLogout, onDisputeToggle }: CustomerPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter purchases for this customer
  const myPurchases = useMemo(() => {
    return purchases
      .filter(p => p.customerId === currentUser.id || p.supplierName === currentUser.name)
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [purchases, currentUser]);

  // Filter payments for this customer
  const myPayments = useMemo(() => {
    return payments
      .filter(p => p.customerId === currentUser.id)
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [payments, currentUser]);

  // Calculations
  const totalValue = myPurchases.reduce((sum, p) => sum + p.totalPrice, 0);
  const totalPaid = myPayments.filter(p => p.status === 'cleared').reduce((sum, p) => sum + p.amount, 0);
  const pendingPayments = myPayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  
  // Assuming 'اول دوره' is 0 for simplicity, or we can add it to CustomerRecord later.
  const previousBalance = 0; 
  const currentBalance = previousBalance + totalValue - totalPaid;

  const handleExportCSV = () => {
    const headers = ['کد فیش باسکول', 'نوع و گرید ضایعات', 'وزن مفید (کیلوگرم)', 'درجه/کیفیت', 'نرخ هر کیلوگرم (ریال)', 'مبلغ کل فاکتور (ریال)', 'تاریخ تخلیه بار', 'تاریخ تسویه مالی', 'وضعیت', 'توضیحات'];
    
    const rows = myPurchases.map(p => {
      const grade = grades.find(g => g.id === p.scrapGradeId);
      const wastePct = p.netWeight && p.netWeight > 0 
        ? Math.round(((p.netWeight - p.finalWeight) / p.netWeight) * 100) 
        : 0;
      return [
        p.weighbridgeCode || p.id,
        grade?.name || 'نامشخص',
        p.finalWeight.toString(),
        wastePct + '% افت',
        p.unitPrice.toString(),
        p.totalPrice.toString(),
        p.date,
        p.settlementDate || '-',
        p.disputeStatus === 'pending' ? 'در حال بررسی اعتراض' : 'تایید شده',
        p.description || ''
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + [headers.join(','), ...rows.map(e => e.map(item => `"${item}"`).join(","))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `گزارش_بارهای_ورودی_${currentUser.name}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = (mode: 'payments' | 'purchases', action: 'print' | 'pdf' = 'pdf') => {
    if (mode === 'payments') {
      printElement('payments-table', `ریز تراکنش‌های مالی - ${currentUser.name}`, `تراکنش_${currentUser.name}`, action);
    } else {
      printElement('purchases-table', `بارهای ورودی - ${currentUser.name}`, `بار_${currentUser.name}`, action);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 print:bg-white" dir="rtl">
      {/* Navbar */}
      <nav className="bg-slate-900 text-white p-4 sticky top-0 z-50 print:hidden shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700">
              <span className="text-amber-500 font-black text-xl">FKS</span>
            </div>
            <div>
              <h1 className="font-bold text-sm md:text-base">سلام {currentUser.name}</h1>
              <p className="text-xs text-slate-400">پرتال اختصاصی مشتریان</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-300 rounded-lg transition-colors text-sm font-bold"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">خروج از حساب</span>
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        
        {/* Section 2: Financial Ledger & Report (امور مالی) */}
        <section className="space-y-4">
          <h2 className="text-lg font-black text-slate-800 flex items-center gap-2 border-b-2 border-slate-200 pb-2">
            <FileText className="w-5 h-5 text-amber-500" />
            داشبورد مالی و حسابداری
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 print:border-slate-300">
              <p className="text-xs font-bold text-slate-500 mb-1">مانده حساب اول دوره</p>
              <p className="text-2xl font-black text-slate-800">{previousBalance.toLocaleString('fa-IR')} <span className="text-xs font-sans text-slate-400">ریال</span></p>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 print:border-slate-300">
              <p className="text-xs font-bold text-slate-500 mb-1">جمع کل بارهای تحویلی</p>
              <p className="text-2xl font-black text-emerald-600">+{totalValue.toLocaleString('fa-IR')} <span className="text-xs font-sans text-slate-400">ریال</span></p>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 print:border-slate-300">
              <p className="text-xs font-bold text-slate-500 mb-1">جمع کل مبالغ واریزی توسط حسابدار</p>
              <p className="text-2xl font-black text-red-500">-{totalPaid.toLocaleString('fa-IR')} <span className="text-xs font-sans text-slate-400">ریال</span></p>
              {pendingPayments > 0 && (
                <p className="text-[10px] text-amber-500 mt-1 font-bold">+ {pendingPayments.toLocaleString('fa-IR')} ریال اسناد در جریان</p>
              )}
            </div>
            <div className={`p-5 rounded-2xl shadow-sm border print:border-slate-300 ${currentBalance > 0 ? 'bg-emerald-50 border-emerald-100' : currentBalance < 0 ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-200'}`}>
              <p className="text-xs font-bold text-slate-600 mb-1">مانده حساب فعلی در لحظه</p>
              <p className={`text-2xl font-black ${currentBalance > 0 ? 'text-emerald-700' : currentBalance < 0 ? 'text-red-700' : 'text-slate-700'}`}>
                {Math.abs(currentBalance).toLocaleString('fa-IR')} <span className="text-xs font-sans opacity-70">ریال</span>
              </p>
              <p className={`text-[10px] font-bold mt-1 ${currentBalance > 0 ? 'text-emerald-600' : currentBalance < 0 ? 'text-red-600' : 'text-slate-500'}`}>
                {currentBalance > 0 ? '(بستانکار - طلب شما)' : currentBalance < 0 ? '(بدهکار)' : 'تسویه کامل'}
              </p>
            </div>
          </div>

          {/* Transactions Ledger */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-6 print:break-inside-avoid">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-bold text-sm text-slate-700">ریز تراکنش‌های مالی و واریزی‌ها</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleExportPDF('payments', 'pdf')}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors print:hidden"
                >
                  <FileText className="w-4 h-4" />
                  خروجی PDF
                </button>
                <button 
                  onClick={() => handleExportPDF('payments', 'print')}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors print:hidden"
                >
                  <FileText className="w-4 h-4" />
                  چاپ
                </button>
              </div>
            </div>
            {myPayments.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">هیچ سند مالی برای شما ثبت نشده است.</div>
            ) : (
              <div className="overflow-x-auto">
                <table id="payments-table" className="w-full text-sm text-right">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 font-bold">تاریخ</th>
                      <th className="px-4 py-3 font-bold">نوع سند</th>
                      <th className="px-4 py-3 font-bold">مبلغ (ریال)</th>
                      <th className="px-4 py-3 font-bold">وضعیت پاس شدن</th>
                      <th className="px-4 py-3 font-bold">توضیحات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {myPayments.map(payment => (
                      <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap "><JalaliDate date={payment.date} /></td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold ${
                            payment.type === 'cash' ? 'bg-emerald-100 text-emerald-700' :
                            payment.type === 'check' ? 'bg-purple-100 text-purple-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {payment.type === 'cash' ? 'نقد' : payment.type === 'check' ? 'چک صیادی' : 'حواله بانکی'}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-bold text-slate-700">{payment.amount.toLocaleString('fa-IR')}</td>
                        <td className="px-4 py-3">
                          {payment.status === 'cleared' ? (
                            <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                              <CheckCircle className="w-3.5 h-3.5" /> وصول شده
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                              <Clock className="w-3.5 h-3.5" /> سررسید نشده / در جریان
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500">{payment.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* Section 1: Inbound Cargo Table (جدول هوشمند بارهای ورودی) */}
        <section className="space-y-4 pt-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-2 border-slate-200 pb-2">
            <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
              <Download className="w-5 h-5 text-blue-500" />
              جدول هوشمند بارهای ورودی
            </h2>
            <div className="flex gap-2 print:hidden">
              <button 
                onClick={() => handleExportPDF('purchases', 'pdf')}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
              >
                <FileText className="w-4 h-4" />
                خروجی PDF
              </button>
              <button 
                onClick={() => handleExportPDF('purchases', 'print')}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
              >
                <FileText className="w-4 h-4" />
                چاپ
              </button>
              <button 
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold transition-colors"
              >
                <Download className="w-4 h-4" />
                خروجی Excel
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table id="purchases-table" className="w-full text-sm text-right">
                <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-3 font-bold">کد فیش باسکول</th>
                    <th className="px-3 py-3 font-bold">گرید ضایعات</th>
                    <th className="px-3 py-3 font-bold">وزن مفید (Kg)</th>
                    <th className="px-3 py-3 font-bold">درجه بار</th>
                    <th className="px-3 py-3 font-bold">نرخ (ریال)</th>
                    <th className="px-3 py-3 font-bold">مبلغ کل (ریال)</th>
                    <th className="px-3 py-3 font-bold">تاریخ تخلیه</th>
                    <th className="px-3 py-3 font-bold">تاریخ تسویه</th>
                    <th className="px-3 py-3 font-bold">ستون توضیحات</th>
                    <th className="px-3 py-3 font-bold text-center print:hidden">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myPurchases.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-8 text-center text-slate-500">
                        تا کنون باری از شما در سیستم ثبت نشده است.
                      </td>
                    </tr>
                  ) : myPurchases.map(purchase => {
                    const grade = grades.find(g => g.id === purchase.scrapGradeId);
                    const isDisputed = purchase.disputeStatus === 'pending';
                    const wastePct = purchase.netWeight && purchase.netWeight > 0 
                      ? Math.round(((purchase.netWeight - purchase.finalWeight) / purchase.netWeight) * 100) 
                      : 0;
                    
                    return (
                      <tr key={purchase.id} className={`hover:bg-slate-50 transition-colors ${isDisputed ? 'bg-amber-50/30' : ''}`}>
                        <td className="px-3 py-3 whitespace-nowrap text-xs font-bold text-slate-600">
                          {toPersianDigits(purchase.weighbridgeCode || purchase.id.replace('pur-', 'W-'))}
                        </td>
                        <td className="px-3 py-3 font-bold text-slate-700">{grade?.name || 'نامشخص'}</td>
                        <td className="px-3 py-3 font-bold text-emerald-600">{purchase.finalWeight.toLocaleString('fa-IR')}</td>
                        <td className="px-3 py-3">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-100 text-slate-700 text-xs">
                            {toPersianDigits(wastePct.toString())}% افت بار
                          </span>
                        </td>
                        <td className="px-3 py-3 text-xs text-slate-500">{purchase.unitPrice.toLocaleString('fa-IR')}</td>
                        <td className="px-3 py-3 font-bold text-slate-800">{purchase.totalPrice.toLocaleString('fa-IR')}</td>
                        <td className="px-3 py-3 text-xs"><JalaliDate date={purchase.date} /></td>
                        <td className="px-3 py-3 text-xs">{purchase.settlementDate ? toPersianDigits(purchase.settlementDate) : "-"}</td>
                        <td className="px-3 py-3 text-[10px] text-slate-500 max-w-[150px] truncate" title={purchase.description}>
                          {purchase.description || '-'}
                        </td>
                        <td className="px-3 py-3 text-center print:hidden">
                          <button
                            onClick={() => onDisputeToggle(purchase.id)}
                            className={`inline-flex items-center gap-1 px-2 py-1.5 rounded-md text-[10px] font-bold transition-all ${
                              isDisputed 
                                ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' 
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {isDisputed ? (
                              <><AlertCircle className="w-3 h-3" /> در حال بررسی اعتراض</>
                            ) : (
                              <><AlertCircle className="w-3 h-3" /> اعتراض به درجه بار</>
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
