/**
 * @file app.js
 * @description [اتوماسیون تخصصی انبار فلزات]
 * @author [Reza.Vazifeh]
 * @copyright Copyright (c) 2026 [Reza.Vazifeh]. All rights reserved.
 */

import ForceChangePassword from './components/ForceChangePassword';
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ScrapGrade,
  PurchaseRecord,
  ProcessingRecord,
  SaleRecord,
  ExpenseRecord,
  CashTransaction,
  CustomerRecord,
  StaffRecord
} from './types';
import {
  loadAllState,
  saveAllState,
  INITIAL_SCRAP_GRADES,
  INITIAL_CUSTOMERS,
  INITIAL_STAFF,
  INITIAL_PURCHASES,
  INITIAL_PROCESSING,
  INITIAL_SALES,
  INITIAL_EXPENSES,
  INITIAL_TRANSACTIONS,
  INITIAL_CUSTOMER_PAYMENTS
} from './data';
import { formatWeight, formatRials } from './utils';
import {  BarChart4, Shield, ClipboardList , Box } from 'lucide-react';

// زبانه بندی کامپوننت ها
import DashboardTab from './components/DashboardTab';
import ActivityLogTab from './components/ActivityLogTab';
import ReportsTab from './components/ReportsTab';
import PurchasesTab from './components/PurchasesTab';
import ProcessingTab from './components/ProcessingTab';
import SalesTab from './components/SalesTab';
import ExpensesTab from './components/ExpensesTab';
import CapitalTab from './components/CapitalTab';
import CustomersTab from './components/CustomersTab';
import ProfileTab from './components/ProfileTab';
import StaffManagementTab from './components/StaffManagementTab';
import AssetsTab from './components/AssetsTab';
import AboutUsTab from './components/AboutUsTab';
import Login from './components/Login';
import Logo from './components/Logo';
import CustomerPanel from './components/CustomerPanel';
import LiveClock from './components/LiveClock';
import OnlineUsers from './components/OnlineUsers';

// آیکون ها
import {
  LayoutDashboard,
  Scale,
  RotateCcw,
  Upload,
  Download,
  Trash2,
  Menu,
  X,
  CreditCard,
  Layers,
  Wrench,
  DollarSign,
  Users,
  LogOut,
  Building2
} from 'lucide-react';

export default function App() {
  const [state, setState] = useState(() => loadAllState());
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const handleLogout = () => {
    if (currentUser) {
      const newLog = {
        id: `auth-${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        role: currentUser.type === 'customer' ? 'مشتری' : (currentUser.role === 'admin' ? 'مدیر سیستم' : 'پرسنل'),
        action: 'logout',
        timestamp: new Date().toISOString()
      };
      setState(prev => ({ ...prev, authLogs: [...(prev.authLogs || []), newLog] }));
    }
    setCurrentUser(null);
  };

  const hasPermission = (tabId: string) => {
    if (currentUser?.role === 'admin') return true;
    return (currentUser?.permissions || []).includes(tabId);
  };

  const [currentUser, setCurrentUser] = useState<any>(() => {
    const saved = localStorage.getItem('scrap_app_auth');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('scrap_app_auth', JSON.stringify(currentUser));
      if (currentUser.role !== 'admin' && currentUser.type === 'staff' && !currentUser.permissions?.includes('dashboard')) {
        if (activeTab === 'dashboard') {
          const tabs = ['customers', 'purchases', 'processing', 'sales', 'expenses', 'capital', 'reports', 'activity', 'staff-management'];
          const firstPerm = tabs.find(t => currentUser.permissions?.includes(t));
          if (firstPerm) {
            setActiveTab(firstPerm);
          }
        }
      }
    } else {
      localStorage.removeItem('scrap_app_auth');
    }
  }, [currentUser, activeTab]);

  // همگام سازی خودکار با LocalStorage در زمان تغییرات دولتی
  useEffect(() => {
    saveAllState(state);
  }, [state]);

  if (!currentUser) {
    return <Login customers={state.customers} staff={state.staff} onLogin={(user) => {
      setCurrentUser(user);
      
      const newLog = {
        id: `auth-${Date.now()}`,
        userId: user.id,
        userName: user.name,
        role: user.type === 'customer' ? 'مشتری' : (user.role === 'admin' ? 'مدیر سیستم' : 'پرسنل'),
        action: 'login',
        timestamp: new Date().toISOString()
      };
      setState(prev => ({ ...prev, authLogs: [...(prev.authLogs || []), newLog] }));
      
      if (user.role !== 'admin' && user.type === 'staff' && !user.permissions?.includes('dashboard')) {
        const tabs = ['customers', 'purchases', 'processing', 'sales', 'expenses', 'capital', 'reports', 'activity', 'staff-management'];
        const firstPerm = tabs.find(t => user.permissions?.includes(t));
        if (firstPerm) {
          setActiveTab(firstPerm);
        }
      }
    }} />;
  }

  if (currentUser.password === '1234') {
    return (
      <ForceChangePassword 
        user={currentUser} 
        onChangePassword={(newPassword) => {
          let updatedUser = { ...currentUser, password: newPassword };
          if (currentUser.type === 'staff') {
            const newStaff = state.staff.map(s => s.id === currentUser.id ? { ...s, password: newPassword } : s);
            const newState = { ...state, staff: newStaff };
            setState(newState);
            saveAllState(newState);
          } else {
            const newCustomers = state.customers.map(c => c.id === currentUser.id ? { ...c, password: newPassword } : c);
            const newState = { ...state, customers: newCustomers };
            setState(newState);
            saveAllState(newState);
          }
          setCurrentUser(updatedUser);
        }}
      />
    );
  }

  if (currentUser.type === 'customer') {
    return (
      <CustomerPanel
        currentUser={currentUser}
        purchases={state.purchases}
        payments={state.customerPayments || []}
        grades={state.grades}
        onLogout={() => handleLogout()}
        onDisputeToggle={(purchaseId) => {
          setState(prev => ({
            ...prev,
            purchases: prev.purchases.map(p => 
              p.id === purchaseId 
                ? { ...p, disputeStatus: p.disputeStatus === 'pending' ? 'none' : 'pending' } 
                : p
            )
          }));
        }}
      />
    );
  }


  // محاسبات پویای موجودی فیزیکی انبار بر اساس تراکنش های خرید، فروش و فرآوری
  const getCalculatedGrades = (): ScrapGrade[] => {
    return state.grades.map((grade) => {
      // خریدها (افزایش موجودی)
      const totalPurchased = state.purchases
        .filter((p) => p.scrapGradeId === grade.id)
        .reduce((sum, p) => sum + p.finalWeight, 0);

      // فروش ها (کاهش موجودی)
      const totalSold = state.sales
        .filter((s) => s.scrapGradeId === grade.id)
        .reduce((sum, s) => sum + s.netWeight, 0);

      // فرآوری به عنوان مواد خام مبدا (کاهش موجودی)
      const totalProcessedSource = state.processings
        .filter((pr) => pr.sourceGradeId === grade.id)
        .reduce((sum, pr) => sum + pr.sourceWeightKg, 0);

      // فرآوری به عنوان خروجی هدف (افزایش موجودی)
      const totalProcessedTarget = state.processings
        .filter((pr) => pr.targetGradeId === grade.id)
        .reduce((sum, pr) => sum + pr.targetWeightKg, 0);

      // محاسبه نهایی موجودی از ترکیب ها
      // برای بارهای ورودی تستی پیش فرض، یک حجم اولیه در نظر میگیریم
      const baseStock = grade.typicalBuyPrice ? 10000 : 0; // ۱۰ تن پایه برای همه گریدها جهت جلوگیری از منفی شدن شدید
      const currentStock = baseStock + totalPurchased - totalSold - totalProcessedSource + totalProcessedTarget;

      return {
        ...grade,
        stockKg: Math.max(0, currentStock),
      };
    });
  };

  const calculatedGrades = getCalculatedGrades();

  // محاسبه پویای دارایی نقدی انبار
  const totalPurchaseCost = state.purchases.reduce((sum, p) => sum + p.totalPrice, 0);
  const totalSalesRevenue = state.sales.reduce((sum, s) => sum + s.totalPrice, 0);
  const totalExpensesCost = state.expenses.reduce((sum, e) => sum + e.amount, 0);

  // نقدینگی انبار = سرمایه آورده ها + کل فروش های انبار - کل خریدهای انبار - کل هزینه های انبار
  const warehouseInitialDeposits = state.transactions
    .filter((t) => t.origin === 'warehouse' && t.type === 'deposit')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const warehouseWithdrawals = state.transactions
    .filter((t) => t.origin === 'warehouse' && t.type === 'withdraw')
    .reduce((sum, t) => sum + t.amount, 0);

  const warehouseBalance = warehouseInitialDeposits - warehouseWithdrawals + 
                             totalSalesRevenue - totalPurchaseCost - totalExpensesCost;

  
  const handleAddGrade = (gradeData: Omit<ScrapGrade, 'id'>) => {
    const newGrade: ScrapGrade = {
      ...gradeData,
      id: `grade-${Date.now()}`
    };
    setState(prev => ({
      ...prev,
      grades: [...prev.grades, newGrade]
    }));
  };

  const handleUpdateGrade = (updatedGrade: ScrapGrade) => {
    setState(prev => ({
      ...prev,
      grades: prev.grades.map(g => g.id === updatedGrade.id ? updatedGrade : g)
    }));
  };

  const handleAddCustomer = (record: Omit<CustomerRecord, 'id'>) => {
    const newRecord: CustomerRecord = {
      ...record,
      id: `cust-${Date.now()}`
    };
    setState((prev) => ({
      ...prev,
      customers: [newRecord, ...prev.customers]
    }));
  };

  const handleDeleteCustomer = (id: string) => {
    setState((prev) => ({
      ...prev,
      customers: prev.customers.filter((c) => c.id !== id)
    }));
  };

  const handleUpdateCustomer = (updatedCustomer: CustomerRecord) => {
    setState((prev) => ({
      ...prev,
      customers: prev.customers.map((c) => (c.id === updatedCustomer.id ? updatedCustomer : c))
    }));
  };

  const handleUpdateStaff = (updatedStaff: StaffRecord) => {
    setState((prev) => ({
      ...prev,
      staff: prev.staff.map((s) => (s.id === updatedStaff.id ? updatedStaff : s))
    }));
  };

  // اکشن‌های ثبت اطلاعات
  
  const handleAddAsset = (record: any) => {
    const newRecord = { ...record, id: `asset-${Date.now()}`, lastUpdatedDate: record.lastUpdatedDate || new Date().toISOString().slice(0,10) };
    setState(prev => {
      const newState = { ...prev, assets: [...(prev.assets || []), newRecord] };
      saveAllState(newState);
      return newState;
    });
  };

  const handleUpdateAsset = (record: any) => {
    setState(prev => {
      const newState = { ...prev, assets: (prev.assets || []).map(a => a.id === record.id ? record : a) };
      saveAllState(newState);
      return newState;
    });
  };

  const handleDeleteAsset = (id: string) => {
    setState(prev => {
      const newState = { ...prev, assets: (prev.assets || []).filter(a => a.id !== id) };
      saveAllState(newState);
      return newState;
    });
  };

  const handleAddPurchase = (record: Omit<PurchaseRecord, 'id'>) => {
    const newRecord: PurchaseRecord = {
      ...record,
      id: `pur-${Date.now()}`
    };
    setState((prev) => ({
      ...prev,
      purchases: [newRecord, ...prev.purchases]
    }));
  };

  const handleDeletePurchase = (id: string) => {
    setState((prev) => ({
      ...prev,
      purchases: prev.purchases.filter((p) => p.id !== id)
    }));
  };

  const handleAddProcessing = (record: Omit<ProcessingRecord, 'id'>) => {
    const newRecord: ProcessingRecord = {
      ...record,
      id: `proc-${Date.now()}`
    };

    // ثبت اتوماتیک هزینه عملیاتی فرآوری در لیست هزینه ها
    const newExpense: ExpenseRecord = {
      id: `exp-proc-${Date.now()}`,
      date: record.date,
      category: 'repair',
      title: `هزینه عملیاتی برشکار/پرس: ${record.laborName}`,
      amount: record.processingCost,
      description: `ثبت اتوماتیک هزینه از زبانه عملیات فرآوری (مبداء به مقصد) بابت ${record.description || ''}`
    };

    setState((prev) => ({
      ...prev,
      processings: [newRecord, ...prev.processings],
      expenses: record.processingCost > 0 ? [newExpense, ...prev.expenses] : prev.expenses
    }));
  };

  const handleDeleteProcessing = (id: string) => {
    setState((prev) => {
      return {
        ...prev,
        processings: prev.processings.filter((pr) => pr.id !== id),
        expenses: prev.expenses.filter((e) => !e.id.includes(id.substring(5)))
      };
    });
  };

  const handleUpdateSale = (updatedSale: SaleRecord) => {
    setState((prev) => ({
      ...prev,
      sales: prev.sales.map(s => s.id === updatedSale.id ? updatedSale : s)
    }));
  };

  const handleAddSale = (record: Omit<SaleRecord, 'id'>) => {
    const newRecord: SaleRecord = {
      ...record,
      id: `sale-${Date.now()}`
    };
    setState((prev) => ({
      ...prev,
      sales: [newRecord, ...prev.sales]
    }));
  };

  const handleDeleteSale = (id: string) => {
    setState((prev) => ({
      ...prev,
      sales: prev.sales.filter((s) => s.id !== id)
    }));
  };

  const handleAddExpense = (record: Omit<ExpenseRecord, 'id'>) => {
    const newRecord: ExpenseRecord = {
      ...record,
      id: `exp-${Date.now()}`
    };
    setState((prev) => ({
      ...prev,
      expenses: [newRecord, ...prev.expenses]
    }));
  };

  const handleDeleteExpense = (id: string) => {
    setState((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((e) => e.id !== id)
    }));
  };

  const handleAddTransaction = (tx: Omit<CashTransaction, 'id'>) => {
    const newTx: CashTransaction = {
      ...tx,
      id: `tx-${Date.now()}`
    };
    setState((prev) => ({
      ...prev,
      transactions: [newTx, ...prev.transactions]
    }));
  };

  const handleDeleteTransaction = (id: string) => {
    setState((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((t) => t.id !== id)
    }));
  };

  // ریست داده های تستی به همراه تأیید
  const handleResetData = () => {
    if (confirm('پیمانکار عزیز، آیا مایلید اطلاعات تستی و حسابدار نمونه مجدداً بارگذاری شود؟ فاکتورهای فعلی شما اوررایت می‌شوند.')) {
      const resetState = {
        grades: INITIAL_SCRAP_GRADES,
        customers: INITIAL_CUSTOMERS,
        staff: INITIAL_STAFF,
        purchases: INITIAL_PURCHASES,
        processings: INITIAL_PROCESSING,
        sales: INITIAL_SALES,
        commercialSales: [],
        expenses: INITIAL_EXPENSES,
        transactions: INITIAL_TRANSACTIONS,
        customerPayments: INITIAL_CUSTOMER_PAYMENTS,
        authLogs: []
      };
      setState(resetState);
      saveAllState(resetState);
      setActiveTab('dashboard');
    }
  };

  // حذف کلیه فاکتورها جهت شروع سال مالي جدید
  const handleClearAll = () => {
    if (confirm('تأیید میکنید کلیه فاکتورهای باسکول، هزینه‌ها، تراکنش‌ها و بارهای معلق حذف و انبار صفر شود؟ این عملیات غیرقابل برگشت است.')) {
      const cleanState = {
        grades: INITIAL_SCRAP_GRADES.map(g => ({ ...g, stockKg: 0 })),
        customers: [],
        staff: state.staff,
        purchases: [],
        processings: [],
        sales: [],
        commercialSales: [],
        expenses: [],
        transactions: [],
        customerPayments: [],
        authLogs: []
      };
      setState(cleanState);
      saveAllState(cleanState);
      setActiveTab('dashboard');
    }
  };

  // خروجی پشتیبان به صورت فایلی (JSON)
  const handleExportBackup = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `پشتیبان_انبار_ضایعات_آهن_${new Date().toISOString().slice(0,10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      alert('خطا در بارگیری فایل پشتیبان');
    }
  };

  // ورودی فایل پشتیبان
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const files = e.target.files;
    if (!files || files.length === 0) return;

    fileReader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.purchases && parsed.sales && parsed.expenses) {
          setState(parsed);
          saveAllState(parsed);
          alert('فایل پشتیبان با موفقیت بازیابی شد و دفاتر بازسازی شدند.');
        } else {
          alert('قالب فایل پشتیبان نامعتبر است.');
        }
      } catch {
        alert('خطا در خواندن فایل، لزوما قالب JSON نیست.');
      }
    };
    fileReader.readAsText(files[0]);
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-50 flex flex-col md:flex-row antialiased select-none" dir="rtl" id="app-root">
      {/* سایدبار متحرک و ریسپانسیو */}
      <aside 
        id="app-sidebar"
        className={`fixed md:sticky top-0 right-0 z-40 h-screen w-64 border-l border-slate-200 bg-slate-900 text-slate-300 flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}`}
      >
        {/* هدر سایدبار */}
        <div>
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Logo className="w-10 h-10 drop-shadow-md" />
              <div className="text-right">
                <span className="block text-[10px] text-amber-400 font-bold">اتوماسیون انبار فلزات</span>
                <span className="text-xs font-black text-white">کاویان سپنتا (خاورشهر)</span>
              </div>
            </div>
            {/* دکمه بستن در موبایل */}
            <button 
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* تب‌های راهبری */}
          <nav className="p-3 space-y-1.5 text-xs font-semibold" id="sidebar-navigation">
            {(currentUser?.type === 'customer' || hasPermission('dashboard')) && (
            <button
              onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }}
              id="tab-dashboard"
              className={`w-full py-2.5 px-3 rounded-lg flex items-center gap-3 transition-all ${activeTab === 'dashboard' ? 'bg-amber-500 text-slate-900 font-bold' : 'hover:bg-slate-800 text-slate-300'}`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>پیشخوان و تراز سود انبار</span>
            </button>
                )}
                {currentUser?.type === 'staff' && (
              <>
                {hasPermission('customers') && (
                  <button
                    onClick={() => { setActiveTab('customers'); setSidebarOpen(false); }}
                    id="tab-customers"
                    className={`w-full py-2.5 px-3 rounded-lg flex items-center gap-3 transition-all ${activeTab === 'customers' ? 'bg-amber-500 text-slate-900 font-bold' : 'hover:bg-slate-800 text-slate-300'}`}
                  >
                    <Users className="w-4 h-4 shrink-0" />
                    <span>مدیریت بستانکاران و بدهکاران</span>
                  </button>
                )}
                {hasPermission('purchases') && (
                  <button
                    onClick={() => { setActiveTab('purchases'); setSidebarOpen(false); }}
                    id="tab-purchases"
                    className={`w-full py-2.5 px-3 rounded-lg flex items-center gap-3 transition-all ${activeTab === 'purchases' ? 'bg-amber-500 text-slate-900 font-bold' : 'hover:bg-slate-800 text-slate-300'}`}
                  >
                    <Scale className="w-4 h-4 shrink-0" />
                    <span>ورود بار و باسکول (خرید)</span>
                  </button>
                )}
                {hasPermission('sales') && (
                  <button
                    onClick={() => { setActiveTab('sales'); setSidebarOpen(false); }}
                    id="tab-sales"
                    className={`w-full py-2.5 px-3 rounded-lg flex items-center gap-3 transition-all ${activeTab === 'sales' ? 'bg-amber-500 text-slate-900 font-bold' : 'hover:bg-slate-800 text-slate-300'}`}
                  >
                    <Layers className="w-4 h-4 shrink-0" />
                    <span>خروج و فاکتور فروش انبار</span>
                  </button>
                )}
                {hasPermission('expenses') && (
                  <button
                    onClick={() => { setActiveTab('expenses'); setSidebarOpen(false); }}
                    id="tab-expenses"
                    className={`w-full py-2.5 px-3 rounded-lg flex items-center gap-3 transition-all ${activeTab === 'expenses' ? 'bg-amber-500 text-slate-900 font-bold' : 'hover:bg-slate-800 text-slate-300'}`}
                  >
                    <CreditCard className="w-4 h-4 shrink-0" />
                    <span>هزینه‌های جاری (عملیاتی)</span>
                  </button>
                )}
                {hasPermission('capital') && (
                  <button
                    onClick={() => { setActiveTab('capital'); setSidebarOpen(false); }}
                    id="tab-capital"
                    className={`w-full py-2.5 px-3 rounded-lg flex items-center gap-3 transition-all ${activeTab === 'capital' ? 'bg-amber-500 text-slate-900 font-bold' : 'hover:bg-slate-800 text-slate-300'}`}
                  >
                    <DollarSign className="w-4 h-4 shrink-0" />
                    <span>جریان نقدینگی صندوق</span>
                  </button>
                )}
                {hasPermission('reports') && (
                  <button
                    onClick={() => { setActiveTab('reports'); setSidebarOpen(false); }}
                    id="tab-reports"
                    className={`w-full py-2.5 px-3 rounded-lg flex items-center gap-3 transition-all ${activeTab === 'reports' ? 'bg-amber-500 text-slate-900 font-bold' : 'hover:bg-slate-800 text-slate-300'}`}
                  >
                    <BarChart4 className="w-4 h-4 shrink-0" />
                    <span>گزارشات</span>
                  </button>
                )}
                {hasPermission('activity') && (
                  <button
                    onClick={() => { setActiveTab('activity'); setSidebarOpen(false); }}
                    id="tab-activity"
                    className={`w-full py-2.5 px-3 rounded-lg flex items-center gap-3 transition-all ${activeTab === 'activity' ? 'bg-amber-500 text-slate-900 font-bold' : 'hover:bg-slate-800 text-slate-300'}`}
                  >
                    <ClipboardList className="w-4 h-4 shrink-0" />
                    <span>لاگ فعالیت‌ها</span>
                  </button>
                )}
                
              {hasPermission('assets') && (
                <button
                  onClick={() => setActiveTab('assets')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'assets' ? 'bg-amber-500 text-slate-900 shadow-md font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
                >
                  <Box className="w-5 h-5 shrink-0" />
                  <span>اموال و اثاثیه</span>
                </button>
              )}
              {hasPermission('staff-management') && (
                  <button
                    onClick={() => { setActiveTab('staff-management'); setSidebarOpen(false); }}
                    id="tab-staff-management"
                    className={`w-full py-2.5 px-3 rounded-lg flex items-center gap-3 transition-all ${activeTab === 'staff-management' ? 'bg-amber-500 text-slate-900 font-bold' : 'hover:bg-slate-800 text-slate-300'}`}
                  >
                    <Shield className="w-4 h-4 shrink-0" />
                    <span>مدیریت پرسنل</span>
                  </button>
              )}
            </>
              )}

            <button
              onClick={() => { setActiveTab('about-us'); setSidebarOpen(false); }}
              id="tab-about-us"
              className={`w-full py-2.5 px-3 rounded-lg flex items-center gap-3 transition-all ${activeTab === 'about-us' ? 'bg-amber-500 text-slate-900 font-bold' : 'hover:bg-slate-800 text-slate-300'}`}
            >
              <Building2 className="w-4 h-4 shrink-0" />
              <span>درباره ما</span>
            </button>
          </nav>
        </div>

        {/* دکمه‌های ابزار دفتری */}
        <div className="p-4 border-t border-slate-800 space-y-2 text-[10px]" id="sidebar-footer">
          <div className="text-slate-400 font-medium pb-1.5 text-center text-[9px] uppercase tracking-wider border-b border-slate-800/60 mb-2">
            ابزارهای دفتری حسابداری
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={handleExportBackup}
              className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 hover:text-white rounded flex items-center justify-center gap-1.5 transition-all text-center font-semibold cursor-pointer"
              title="خروجی فایل پشتیبان"
            >
              <Download className="w-3.5 h-3.5" />
              <span>پشتیبان</span>
            </button>

            <label
              className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 hover:text-white rounded flex items-center justify-center gap-1.5 transition-all text-center font-semibold cursor-pointer"
              title="ورود فایل پشتیبان"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>بازیابی</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                className="hidden"
              />
            </label>
          </div>

          <button
            onClick={handleResetData}
            className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 hover:text-amber-400 rounded flex items-center justify-center gap-2 transition-all font-semibold cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>ریست داده‌های تستی</span>
          </button>

          <button
            onClick={handleClearAll}
            className="w-full py-1.5 px-3 bg-rose-950/40 hover:bg-rose-950/80 hover:text-rose-200 text-rose-300 border border-rose-900/40 rounded flex items-center justify-center gap-2 transition-all font-semibold cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>حذف کلیه اسناد مالی</span>
          </button>

          <p className="text-[9px] text-slate-500 text-center pt-2 mt-1 border-t border-slate-800/40">
            توسعه‌یافته بر اساس مدل کسب‌وکار خاورشهر
          </p>
        </div>
      </aside>

      {/* ناحیه اصلی محتوا */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative" id="main-content">
        <header className="shrink-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center z-30 shadow-sm sticky top-0">
          {/* دکمه منو موبایل */}
          <div className="flex items-center gap-2 md:hidden">
             <Logo className="w-8 h-8" />
          </div>

          <div className="hidden md:flex items-center gap-3">
            <LiveClock />
            <span className="hidden sm:inline-block w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
            <OnlineUsers />
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-bold block">{currentUser.type === 'staff' ? (currentUser.role === 'admin' ? 'مدیر' : 'کاربر سیستم') : 'مشتری'}</span>
              <span className="text-xs font-black text-slate-700">{currentUser.name}</span>
            </div>
            
            <div className="text-right border-r border-slate-200 pr-4 hidden lg:block">
              <span className="text-[10px] text-slate-400 font-bold block">مجموع نقدینگی فعال انبار (صندوق و بانک)</span>
              <span className="text-xs font-black text-emerald-600">{formatRials(warehouseBalance)}</span>
            </div>

            <div className="text-right border-r border-slate-200 pr-4 hidden xl:block">
              <span className="text-[10px] text-slate-400 font-bold block">سهم‌الشرکه ثابت انبار</span>
              <span className="text-xs font-bold text-slate-600">۸۰٪ هلدینگ کاویان سپنتا / ۲۰٪ آقای مصطفی ندایی</span>
            </div>

            <div className="flex items-center gap-2 border-r border-slate-200 pr-4">
              <button
                onClick={() => setActiveTab('profile')}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold transition-colors"
              >
                تغییر رمز
              </button>
  
              <button
                onClick={() => handleLogout()}
                className="p-1.5 bg-rose-50 text-rose-500 hover:bg-rose-100 rounded-lg transition-colors border border-rose-100"
                title="خروج از سیستم"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto pb-16 md:pb-0">
          {/* بدنه تب‌های اصلی */}
          <div className="p-6 md:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (currentUser?.type === 'customer' || hasPermission('dashboard')) && (
            <DashboardTab
              currentUser={currentUser}
              grades={calculatedGrades}
              purchases={state.purchases}
              sales={state.sales}
              expenses={state.expenses}
              transactions={state.transactions}
              onUpdateGrade={handleUpdateGrade}
              onAddGrade={handleAddGrade}
            />
                )}
          {activeTab === 'about-us' && (
            <AboutUsTab />
          )}
                {activeTab === 'assets' && hasPermission('assets') && (
            <AssetsTab
              assets={state.assets || []}
              currentUser={currentUser}
              onAddAsset={handleAddAsset}
              onUpdateAsset={handleUpdateAsset}
              onDeleteAsset={handleDeleteAsset}
            />
          )}
          {activeTab === 'staff-management' && hasPermission('staff-management') && (
            <StaffManagementTab
              staff={state.staff}
              onAddStaff={(newStaff) => {
                const newState = { ...state, staff: [...state.staff, newStaff] };
                setState(newState);
                saveAllState(newState);
              }}
              onUpdateStaff={(updatedStaff) => {
                const newState = { ...state, staff: state.staff.map(s => s.id === updatedStaff.id ? updatedStaff : s) };
                setState(newState);
                saveAllState(newState);
              }}
              onDeleteStaff={(id) => {
                const newState = { ...state, staff: state.staff.filter(s => s.id !== id) };
                setState(newState);
                saveAllState(newState);
              }}
            />
                )}
                {activeTab === 'customers' && hasPermission('customers') && (
            <CustomersTab
              currentUser={currentUser}
              customers={state.customers}
              purchases={state.purchases}
              sales={state.sales}
              onAddCustomer={handleAddCustomer}
              onDeleteCustomer={handleDeleteCustomer}
            />
                )}
                {activeTab === 'purchases' && hasPermission('purchases') && (
            <PurchasesTab
              currentUser={currentUser}
              grades={calculatedGrades}
              purchases={state.purchases}
              onAddPurchase={handleAddPurchase}
              onDeletePurchase={handleDeletePurchase}
            />
                )}

          {activeTab === 'sales' && hasPermission('sales') && (
            <SalesTab
              currentUser={currentUser}
              grades={calculatedGrades}
              sales={state.sales}
              onUpdateSale={handleUpdateSale}
              onAddSale={handleAddSale}
              onDeleteSale={handleDeleteSale}
            />
          )}
          {activeTab === 'expenses' && hasPermission('expenses') && (
            <ExpensesTab
              currentUser={currentUser}
              expenses={state.expenses}
              onAddExpense={handleAddExpense}
              onDeleteExpense={handleDeleteExpense}
            />
          )}
          {activeTab === 'capital' && hasPermission('capital') && (
            <CapitalTab
              currentUser={currentUser}
              transactions={state.transactions}
              warehouseBalance={warehouseBalance}
              onAddTransaction={handleAddTransaction}
              onDeleteTransaction={handleDeleteTransaction}
            />
          )}
          {activeTab === 'reports' && hasPermission('reports') && (
            <ReportsTab
              purchases={state.purchases}
              sales={state.sales}
              expenses={state.expenses}
            />
          )}
          {activeTab === 'activity' && hasPermission('activity') && (
            <ActivityLogTab
              purchases={state.purchases}
              sales={state.sales}
              expenses={state.expenses}
              authLogs={state.authLogs}
              staff={state.staff}
            />
          )}
          {activeTab === 'profile' && (
            <ProfileTab
              currentUser={currentUser}
              customers={state.customers}
              staff={state.staff}
              onUpdateCustomer={handleUpdateCustomer}
              onUpdateStaff={handleUpdateStaff}
              onUpdateCurrentUser={setCurrentUser}
            />
          )}
        </div>
        
        {/* کپی رایت و شناسنامه سیستم در فوتر پنل */}
        <footer className="border-t border-slate-200/60 bg-white py-5 px-6 text-center text-xs text-slate-400">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <span className="font-bold text-slate-600">اتوماسیون تخصصی انبار فلزات</span>
              <span className="text-slate-300">|</span>
              <span>طراح و توسعه‌دهنده: <strong className="font-semibold text-slate-500">Reza.Vazifeh</strong></span>
            </div>
            <div className="dir-ltr font-mono text-[11px] text-slate-400/90 tracking-wide">
              Copyright (c) 2026 Reza.Vazifeh. All rights reserved.
            </div>
          </div>
        </footer>
        </div>
      </main>

      {/* منوی پایین در موبایل */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex items-center justify-around z-40 pb-safe">
        {(currentUser?.type === 'customer' || hasPermission('dashboard')) && (
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center justify-center w-full py-2 ${activeTab === 'dashboard' ? 'text-amber-600' : 'text-slate-500'}`}
          >
            <LayoutDashboard className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-bold">پیشخوان</span>
          </button>
        )}
        
        {currentUser?.type === 'staff' ? (
          <>
            {hasPermission('purchases') && (
              <button
                onClick={() => setActiveTab('purchases')}
                className={`flex flex-col items-center justify-center w-full py-2 ${activeTab === 'purchases' ? 'text-amber-600' : 'text-slate-500'}`}
              >
                <Scale className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-bold">خرید</span>
              </button>
            )}
            {hasPermission('sales') && (
              <button
                onClick={() => setActiveTab('sales')}
                className={`flex flex-col items-center justify-center w-full py-2 ${activeTab === 'sales' ? 'text-amber-600' : 'text-slate-500'}`}
              >
                <Layers className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-bold">فروش</span>
              </button>
            )}
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex flex-col items-center justify-center w-full py-2 text-slate-500"
            >
              <Menu className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-bold">بیشتر</span>
            </button>
          </>
        ) : (
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center justify-center w-full py-2 ${activeTab === 'profile' ? 'text-amber-600' : 'text-slate-500'}`}
          >
            <Users className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-bold">پروفایل</span>
          </button>
        )}
      </nav>

      {/* پس‌زمینه تیره برای منوی موبایل */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-slate-900/50 z-30 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
