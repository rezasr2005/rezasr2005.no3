import React, { useState } from 'react';
import { CustomerRecord, PurchaseRecord, SaleRecord, BankAccount, Vehicle } from '../types';
import { Users, Plus, Trash2, Search, Building2, User, Phone, MapPin, ArrowDownLeft, ArrowUpRight, History, CreditCard, Car, PlusCircle } from 'lucide-react';
import { formatRials, formatWeight } from '../utils';

import JalaliDate from './JalaliDate';
interface CustomersTabProps {
  currentUser?: any;
  customers: CustomerRecord[];
  purchases: PurchaseRecord[];
  sales: SaleRecord[];
  onAddCustomer: (customer: Omit<CustomerRecord, 'id'>) => void;
  onDeleteCustomer: (id: string) => void;
}

export default function CustomersTab({
  currentUser, customers, purchases, sales, onAddCustomer, onDeleteCustomer }: CustomersTabProps) {
  
  const isAdmin = currentUser?.role === 'admin';
  const hasPermission = (action: string) => {
    if (isAdmin) return true;
    return (currentUser?.permissions || []).includes(action);
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(customers.length > 0 ? customers[0].id : null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [newCustomer, setNewCustomer] = useState<Omit<CustomerRecord, 'id'>>({
    name: '',
    phone: '',
    address: '',
    type: 'both',
    description: '',
    bankAccounts: [],
    vehicles: []
  });

  const filteredCustomers = customers.filter(c => 
    c.name.includes(searchTerm) || c.phone.includes(searchTerm)
  );

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  // محاسبه تاریخچه برای مشتری انتخاب شده
  const customerPurchases = selectedCustomer ? purchases.filter(p => p.supplierName === selectedCustomer.name || p.customerId === selectedCustomer.id) : [];
  const customerSales = selectedCustomer ? sales.filter(s => s.buyerName === selectedCustomer.name) : [];
  
  const totalPurchasesAmount = customerPurchases.reduce((sum, p) => sum + p.totalPrice, 0);
  const totalSalesAmount = customerSales.reduce((sum, s) => sum + s.totalPrice, 0);
  
  const balance = totalSalesAmount - totalPurchasesAmount; // مثبت = بدهکار به ما، منفی = بستانکار از ما (بدون احتساب پرداختی ها)

  const handleAddBankAccount = () => {
    if ((newCustomer.bankAccounts || []).length >= 10) {
      alert('حداکثر ۱۰ حساب بانکی قابل ثبت است.');
      return;
    }
    setNewCustomer({
      ...newCustomer,
      bankAccounts: [...(newCustomer.bankAccounts || []), { id: Date.now().toString(), accountNumber: '', iban: 'IR', bankName: '', accountHolder: '', ownershipType: 'own' }]
    });
  };

  const handleUpdateBankAccount = (index: number, field: keyof BankAccount, value: string) => {
    const updated = [...(newCustomer.bankAccounts || [])];
    updated[index] = { ...updated[index], [field]: value };
    setNewCustomer({ ...newCustomer, bankAccounts: updated });
  };

  const handleRemoveBankAccount = (index: number) => {
    const updated = [...(newCustomer.bankAccounts || [])];
    updated.splice(index, 1);
    setNewCustomer({ ...newCustomer, bankAccounts: updated });
  };

  const handleAddVehicle = () => {
    if ((newCustomer.vehicles || []).length >= 5) {
      alert('حداکثر ۵ پلاک قابل ثبت است.');
      return;
    }
    setNewCustomer({
      ...newCustomer,
      vehicles: [...(newCustomer.vehicles || []), { id: Date.now().toString(), plate: '' }]
    });
  };

  const handleUpdateVehicle = (index: number, value: string) => {
    const updated = [...(newCustomer.vehicles || [])];
    updated[index].plate = value;
    setNewCustomer({ ...newCustomer, vehicles: updated });
  };

  const handleRemoveVehicle = (index: number) => {
    const updated = [...(newCustomer.vehicles || [])];
    updated.splice(index, 1);
    setNewCustomer({ ...newCustomer, vehicles: updated });
  };

  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.phone) {
      alert('لطفا نام و شماره تماس مشتری را وارد کنید.');
      return;
    }
    onAddCustomer({ ...newCustomer, password: '1234' });
    setNewCustomer({
      name: '',
      phone: '',
      address: '',
      type: 'both',
      description: '',
      bankAccounts: [],
      vehicles: []
    });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <Users className="w-6 h-6 text-amber-500" />
            مدیریت بستانکاران و بدهکاران
          </h2>
          <p className="text-sm text-slate-500 mt-1">مدیریت مشتری، راننده، و غیره</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-lg text-sm font-bold transition-colors shadow-sm"
        >
          {showAddForm ? <Users className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showAddForm ? 'لیست مشتریان' : 'تعریف مشتری جدید'}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building2 className="w-5 h-5 text-amber-500" />
            فرم ثبت اطلاعات هویتی و مالی
          </h3>
          <form onSubmit={handleSaveCustomer} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">نام شخص / شرکت</label>
                <input
                  type="text"
                  value={newCustomer.name}
                  onChange={e => setNewCustomer({...newCustomer, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  placeholder="مثال: شرکت فولاد، آقای محمدی..."
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">شماره تماس</label>
                <input
                  type="text"
                  value={newCustomer.phone}
                  onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-left font-mono"
                  placeholder="0912..."
                  dir="ltr"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">نوع ارتباط</label>
                <select
                  value={newCustomer.type}
                  onChange={e => setNewCustomer({...newCustomer, type: e.target.value as any})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                >
                  <option value="supplier">تامین‌کننده (فروشنده بار به ما)</option>
                  <option value="buyer">خریدار (مشتری بار ما)</option>
                  <option value="both">دو طرفه (هم خرید، هم فروش)</option>
                  <option value="driver">راننده ناوگان</option>
                  <option value="service">ارتباط خدماتی</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-600 mb-1">آدرس</label>
                <input
                  type="text"
                  value={newCustomer.address}
                  onChange={e => setNewCustomer({...newCustomer, address: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  placeholder="آدرس کارگاه، کارخانه یا دفتر..."
                />
              </div>
              <div className="md:col-span-3">
                <label className="block text-xs font-bold text-slate-600 mb-1">توضیحات تکمیلی</label>
                <input
                  type="text"
                  value={newCustomer.description}
                  onChange={e => setNewCustomer({...newCustomer, description: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  placeholder="سایر مشخصات..."
                />
              </div>
            </div>

            {/* بخش حساب های بانکی */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-slate-700 text-sm flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-blue-500" />
                  حساب‌های بانکی معرفی‌شده
                </h4>
                <button
                  type="button"
                  onClick={handleAddBankAccount}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-xs font-bold transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  افزودن حساب
                </button>
              </div>
              
              <div className="space-y-3">
                {(!newCustomer.bankAccounts || newCustomer.bankAccounts.length === 0) ? (
                  <p className="text-xs text-slate-500 text-center py-2">هیچ حساب بانکی ثبت نشده است.</p>
                ) : (
                  newCustomer.bankAccounts.map((account, index) => (
                    <div key={account.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-white p-3 rounded-lg border border-slate-200 relative">
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">نام بانک عامل</label>
                        <input
                          type="text"
                          value={account.bankName}
                          onChange={e => handleUpdateBankAccount(index, 'bankName', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded text-xs px-2 py-1.5 focus:outline-none focus:border-blue-400"
                          placeholder="مثال: ملی"
                          required
                        />
                      </div>
                      <div className="md:col-span-3">
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">شماره شبا</label>
                        <input
                          type="text"
                          value={account.iban}
                          onChange={e => handleUpdateBankAccount(index, 'iban', e.target.value.toUpperCase())}
                          className="w-full bg-slate-50 border border-slate-200 rounded text-xs px-2 py-1.5 font-mono text-left focus:outline-none focus:border-blue-400"
                          placeholder="IR..."
                          dir="ltr"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">شماره حساب</label>
                        <input
                          type="text"
                          value={account.accountNumber}
                          onChange={e => handleUpdateBankAccount(index, 'accountNumber', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded text-xs px-2 py-1.5 font-mono text-left focus:outline-none focus:border-blue-400"
                          dir="ltr"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">نام صاحب حساب</label>
                        <input
                          type="text"
                          value={account.accountHolder}
                          onChange={e => handleUpdateBankAccount(index, 'accountHolder', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded text-xs px-2 py-1.5 focus:outline-none focus:border-blue-400"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">نوع مالکیت</label>
                        <div className="flex gap-2">
                          <label className="flex items-center gap-1 text-[10px]">
                            <input
                              type="radio"
                              name={`ownership-${index}`}
                              checked={account.ownershipType === 'own'}
                              onChange={() => handleUpdateBankAccount(index, 'ownershipType', 'own')}
                              className="w-3 h-3 text-blue-600 focus:ring-blue-500"
                            />
                            شخص مشتری
                          </label>
                          <label className="flex items-center gap-1 text-[10px]">
                            <input
                              type="radio"
                              name={`ownership-${index}`}
                              checked={account.ownershipType === 'other'}
                              onChange={() => handleUpdateBankAccount(index, 'ownershipType', 'other')}
                              className="w-3 h-3 text-blue-600 focus:ring-blue-500"
                            />
                            متفرقه/اعلامی
                          </label>
                        </div>
                      </div>
                      <div className="md:col-span-1 flex items-end justify-end">
                        <button
                          type="button"
                          onClick={() => handleRemoveBankAccount(index)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* بخش ناوگان خودرویی */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-slate-700 text-sm flex items-center gap-2">
                  <Car className="w-4 h-4 text-emerald-500" />
                  ناوگان خودرویی و پلاک‌ها
                </h4>
                <button
                  type="button"
                  onClick={handleAddVehicle}
                  className="flex items-center gap-1 px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg text-xs font-bold transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  افزودن خودرو
                </button>
              </div>
              
              <div className="space-y-3">
                {(!newCustomer.vehicles || newCustomer.vehicles.length === 0) ? (
                  <p className="text-xs text-slate-500 text-center py-2">هیچ پلاکی ثبت نشده است.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {newCustomer.vehicles.map((vehicle, index) => (
                      <div key={vehicle.id} className="bg-white p-3 rounded-lg border border-slate-200 flex items-center gap-2">
                        <input
                          type="text"
                          value={vehicle.plate}
                          onChange={e => handleUpdateVehicle(index, e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded text-xs px-2 py-1.5 text-center focus:outline-none focus:border-emerald-400"
                          placeholder="مثال: ۱۲ ب ۳۴۵ ایران ۶۷"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveVehicle(index)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                انصراف
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-sm font-bold text-slate-900 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors shadow-sm"
              >
                ذخیره مشتری
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* لیست مشتریان */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-xl flex flex-col h-[700px] overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <div className="relative">
              <Search className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="جستجوی نام یا شماره..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg pr-9 pl-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredCustomers.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-sm">مشتری یافت نشد</div>
            ) : (
              filteredCustomers.map(customer => (
                <button
                  key={customer.id}
                  onClick={() => setSelectedCustomerId(customer.id)}
                  className={`w-full text-right p-3 rounded-lg flex items-start gap-3 transition-colors ${selectedCustomerId === customer.id ? 'bg-amber-50 border border-amber-200/50' : 'hover:bg-slate-50 border border-transparent'}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${customer.type === 'supplier' ? 'bg-blue-100 text-blue-600' : customer.type === 'buyer' ? 'bg-emerald-100 text-emerald-600' : 'bg-purple-100 text-purple-600'}`}>
                    <User className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-bold text-sm truncate ${selectedCustomerId === customer.id ? 'text-amber-900' : 'text-slate-800'}`}>
                      {customer.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 truncate font-mono">{customer.phone}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* جزئیات و تاریخچه مشتری */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl h-[700px] flex flex-col shadow-sm overflow-hidden">
          {selectedCustomer ? (
            <>
              {/* هدر جزئیات */}
              <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    {selectedCustomer.name}
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${selectedCustomer.type === 'supplier' ? 'bg-blue-100 text-blue-700' : selectedCustomer.type === 'buyer' ? 'bg-emerald-100 text-emerald-700' : 'bg-purple-100 text-purple-700'}`}>
                      {selectedCustomer.type === 'supplier' ? 'تامین‌کننده (فروشنده)' : selectedCustomer.type === 'buyer' ? 'خریدار (مشتری)' : 'دو طرفه'}
                    </span>
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-4">
                    <p className="text-sm text-slate-600 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span className="font-mono">{selectedCustomer.phone}</span>
                    </p>
                    {selectedCustomer.address && (
                      <p className="text-sm text-slate-600 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        {selectedCustomer.address}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (confirm('آیا از حذف این مشتری اطمینان دارید؟ تاریخچه فاکتورها حذف نخواهد شد اما پیوند آنها قطع می‌شود.')) {
                      onDeleteCustomer(selectedCustomer.id);
                      setSelectedCustomerId(null);
                    }
                  }}
                  className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                  title="حذف مشتری"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {/* خلاصه مالی */}
              <div className="grid grid-cols-3 divide-x divide-x-reverse border-b border-slate-100">
                <div className="p-4 text-center">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">کل خریدهای ما (بستانکار)</div>
                  <div className="text-lg font-black text-blue-600">{formatRials(totalPurchasesAmount)}</div>
                  <div className="text-xs text-slate-500 mt-1">{customerPurchases.length} فاکتور</div>
                </div>
                <div className="p-4 text-center">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">کل فروش ما و کل واریزی ها(بدهکار)</div>
                  <div className="text-lg font-black text-emerald-600">{formatRials(totalSalesAmount)}</div>
                  <div className="text-xs text-slate-500 mt-1">{customerSales.length} فاکتور</div>
                </div>
                <div className="p-4 text-center bg-slate-50/50">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">تراز مبادلات (فاکتوری)</div>
                  <div className={`text-lg font-black ${balance > 0 ? 'text-emerald-600' : balance < 0 ? 'text-rose-600' : 'text-slate-600'}`} dir="ltr">
                    {balance === 0 ? '۰ ریال' : (balance > 0 ? '+' : '') + formatRials(balance)}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {balance > 0 ? 'بدهکار به ما' : balance < 0 ? 'بستانکار از ما' : 'بی‌حساب'}
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {/* بخش اطلاعات هویتی و ناوگان در نمایش جزئیات */}
                <div className="p-4 space-y-4">
                  {/* ناوگان */}
                  {(selectedCustomer.vehicles && selectedCustomer.vehicles.length > 0) && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-600 mb-2 flex items-center gap-1"><Car className="w-4 h-4 text-emerald-500"/> پلاک‌های خودرو ثبت شده</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCustomer.vehicles.map(v => (
                          <span key={v.id} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md text-xs font-bold font-mono">
                            {v.plate}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* حساب های بانکی */}
                  {(selectedCustomer.bankAccounts && selectedCustomer.bankAccounts.length > 0) && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-600 mb-2 flex items-center gap-1"><CreditCard className="w-4 h-4 text-blue-500"/> حساب‌های بانکی</h4>
                      <div className="space-y-2">
                        {selectedCustomer.bankAccounts.map(b => (
                          <div key={b.id} className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                              <span className="text-xs font-bold text-slate-700">{b.bankName}</span>
                              <span className="text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                                {b.ownershipType === 'own' ? 'حساب خود شخص' : 'حساب اعلامی/متفرقه'}
                              </span>
                            </div>
                            <div className="flex flex-col text-left">
                              <span className="text-xs font-mono font-bold text-slate-800">{b.iban}</span>
                              <span className="text-[10px] text-slate-500">{b.accountHolder} ({b.accountNumber})</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-600 mb-3 flex items-center gap-1"><History className="w-4 h-4 text-amber-500"/> تاریخچه فاکتورها</h4>
                  {customerPurchases.length === 0 && customerSales.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 text-xs">
                      هیچ فاکتوری ثبت نشده است.
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                      {/* فاکتورهای فروش (به ایشان فروختیم) */}
                      {customerSales.map(sale => (
                        <div key={sale.id} className="p-3 bg-white hover:bg-slate-50 transition-colors flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                              <ArrowUpRight className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-bold text-xs text-slate-800">فاکتور فروش خروجی</div>
                              <div className="text-[10px] text-slate-500 mt-0.5"><JalaliDate date={sale.date} /> • وزن: <span className="font-mono font-semibold">{formatWeight(sale.netWeight)}</span></div>
                            </div>
                          </div>
                          <div className="text-left">
                            <div className="font-black text-sm text-emerald-600">+{formatRials(sale.totalPrice)}</div>
                            <div className="text-[9px] text-slate-400 mt-0.5">بدهی مشتری</div>
                          </div>
                        </div>
                      ))}
                      {/* فاکتورهای خرید (از ایشان خریدیم) */}
                      {customerPurchases.map(purchase => (
                        <div key={purchase.id} className="p-3 bg-white hover:bg-slate-50 transition-colors flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                              <ArrowDownLeft className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-bold text-xs text-slate-800">فاکتور خرید (باسکول)</div>
                              <div className="text-[10px] text-slate-500 mt-0.5"><JalaliDate date={purchase.date} /> • وزن خالص: <span className="font-mono font-semibold">{formatWeight(purchase.finalWeight)}</span></div>
                            </div>
                          </div>
                          <div className="text-left">
                            <div className="font-black text-sm text-blue-600">-{formatRials(purchase.totalPrice)}</div>
                            <div className="text-[9px] text-slate-400 mt-0.5">طلبکاری مشتری</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <Users className="w-16 h-16 opacity-20 mb-4" />
              <p>مشتری مورد نظر را از لیست انتخاب کنید</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
