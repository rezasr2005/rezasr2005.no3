import React, { useState } from 'react';
import { Users, Plus, Key, Shield, CheckCircle, Save, AlertCircle } from 'lucide-react';
import { StaffRecord } from '../types';

interface StaffManagementTabProps {
  staff: StaffRecord[];
  onAddStaff: (staff: StaffRecord) => void;
  onUpdateStaff: (staff: StaffRecord) => void;
  onDeleteStaff: (id: string) => void;
}

const PERMISSION_GROUPS = [
  {
    id: 'dashboard_group',
    label: 'پیشخوان و داشبورد اصلی',
    permissions: [
      { id: 'dashboard', label: 'مشاهده پیشخوان و تراز سود' }
    ]
  },
  {
    id: 'customers_group',
    label: 'مشتریان و حساب‌ها',
    permissions: [
      { id: 'customers', label: 'مشاهده لیست مشتریان' },
      { id: 'customers-add', label: 'ثبت مشتری جدید' },
      { id: 'customers-edit', label: 'ویرایش اطلاعات مشتری' },
      { id: 'customers-delete', label: 'حذف مشتری' }
    ]
  },
  {
    id: 'purchases_group',
    label: 'خرید ضایعات',
    permissions: [
      { id: 'purchases', label: 'مشاهده فاکتورهای خرید' },
      { id: 'purchases-add', label: 'ثبت خرید جدید' },
      { id: 'purchases-edit', label: 'ویرایش فاکتور خرید' },
      { id: 'purchases-delete', label: 'حذف فاکتور خرید' }
    ]
  },
  {
    id: 'sales_group',
    label: 'فروش محصولات',
    permissions: [
      { id: 'sales', label: 'مشاهده فاکتورهای فروش' },
      { id: 'sales-add', label: 'ثبت حواله فروش' },
      { id: 'sales-edit', label: 'ویرایش حواله فروش' },
      { id: 'sales-delete', label: 'حذف فاکتور فروش' }
    ]
  },
  {
    id: 'processing_group',
    label: 'فرآوری و تولید',
    permissions: [
      { id: 'processing', label: 'مشاهده فرآوری' },
      { id: 'processing-add', label: 'ثبت فرآوری جدید' },
      { id: 'processing-delete', label: 'حذف رکورد فرآوری' }
    ]
  },
  {
    id: 'expenses_group',
    label: 'هزینه‌ها',
    permissions: [
      { id: 'expenses', label: 'مشاهده هزینه‌ها' },
      { id: 'expenses-add', label: 'ثبت هزینه جدید' },
      { id: 'expenses-delete', label: 'حذف هزینه' }
    ]
  },
  {
    id: 'capital_group',
    label: 'سرمایه و صندوق',
    permissions: [
      { id: 'capital', label: 'مشاهده سرمایه‌گذاران و تراکنش‌ها' },
      { id: 'capital-add', label: 'ثبت تراکنش صندوق' },
      { id: 'capital-edit', label: 'ویرایش سرمایه‌گذاران' }
    ]
  },
  {
    id: 'assets_group',
    label: 'اموال و اثاثیه',
    permissions: [
      { id: 'assets', label: 'مشاهده اموال' },
      { id: 'assets-add', label: 'ثبت دارایی جدید' },
      { id: 'assets-edit', label: 'ویرایش دارایی' },
      { id: 'assets-delete', label: 'حذف دارایی' }
    ]
  },
  {
    id: 'system_group',
    label: 'امکانات سیستمی',
    permissions: [
      { id: 'reports', label: 'گزارشات' },
      { id: 'activity', label: 'لاگ فعالیت‌ها' },
      { id: 'staff-management', label: 'مدیریت پرسنل' }
    ]
  }
];

export default function StaffManagementTab({ staff, onAddStaff, onUpdateStaff, onDeleteStaff }: StaffManagementTabProps) {
  const [newStaffName, setNewStaffName] = useState('');
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim()) return;
    
    const newId = Date.now().toString();
    const newStaff: StaffRecord = {
      id: newId,
      name: newStaffName,
      password: '1234',
      role: 'staff',
      permissions: [],
      phone: '',
    };
    
    onAddStaff(newStaff);
    setNewStaffName('');
    setSelectedStaffId(newId);
  };

  const handleResetPassword = (s: StaffRecord) => {
    if (window.confirm(`آیا از بازنشانی رمز عبور "${s.name}" به 1234 اطمینان دارید؟`)) {
      onUpdateStaff({ ...s, password: '1234' });
      alert('رمز عبور با موفقیت به 1234 تغییر یافت.');
    }
  };

  const togglePermission = (s: StaffRecord, permId: string) => {
    if (s.role === 'admin') return;
    const current = s.permissions || [];
    const updated = current.includes(permId)
      ? current.filter(p => p !== permId)
      : [...current, permId];
    onUpdateStaff({ ...s, permissions: updated });
  };

  const selectedStaff = staff.find(s => s.id === selectedStaffId);

  return (
    <div className="space-y-6">
      {/* Add New Staff Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-amber-100 p-2 rounded-lg text-amber-600">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800">افزودن پرسنل جدید</h2>
            <p className="text-xs text-slate-500 font-medium mt-1">پرسنل جدید بسازید و سپس دسترسی‌ها را تعیین کنید.</p>
          </div>
        </div>
        
        <form onSubmit={handleAddStaff} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            required
            value={newStaffName}
            onChange={(e) => setNewStaffName(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm font-medium"
            placeholder="نام و نام خانوادگی پرسنل (مثال: علی رضایی)"
          />
          <button type="submit" className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors whitespace-nowrap">
            ایجاد پرسنل
          </button>
        </form>
        <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-500 bg-slate-50 p-2 rounded-lg">
          <AlertCircle className="w-4 h-4 text-slate-400" />
          <span>پس از ایجاد، پرسنل به منوی پایین اضافه شده و رمز عبور اولیه فرد <strong>1234</strong> خواهد بود.</span>
        </div>
      </div>

      {/* Permissions Management Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800">تعیین سطح دسترسی</h2>
            <p className="text-xs text-slate-500 font-medium mt-1">پرسنل مورد نظر را انتخاب کرده و دسترسی‌ها را ویرایش کنید.</p>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold text-slate-700 mb-2">انتخاب پرسنل</label>
          <select
            value={selectedStaffId}
            onChange={(e) => setSelectedStaffId(e.target.value)}
            className="w-full md:w-1/2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium text-slate-800"
          >
            <option value="" disabled>-- یک نفر را انتخاب کنید --</option>
            {staff.map(s => (
              <option key={s.id} value={s.id}>{s.name} {s.role === 'admin' ? '(مدیر سیستم)' : ''}</option>
            ))}
          </select>
        </div>

        {selectedStaff && (
          <div className="animate-in fade-in space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedStaff.role === 'admin' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-600'}`}>
                  {selectedStaff.role === 'admin' ? <Shield className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{selectedStaff.name}</h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${selectedStaff.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-700'}`}>
                    {selectedStaff.role === 'admin' ? 'مدیر سیستم' : 'پرسنل انبار'}
                  </span>
                </div>
              </div>
              
              {selectedStaff.role !== 'admin' && (
                <button 
                  onClick={() => handleResetPassword(selectedStaff)}
                  className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors"
                >
                  <Key className="w-4 h-4" /> بازنشانی رمز به 1234
                </button>
              )}
            </div>

            <div>
              <h5 className="font-bold text-slate-700 mb-4 border-b border-slate-100 pb-2">تنظیمات مجوزها</h5>
              {selectedStaff.role === 'admin' ? (
                <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-xl text-center text-indigo-700 text-sm font-bold">
                  این کاربر مدیر سیستم است و به تمامی بخش‌ها دسترسی کامل دارد.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {PERMISSION_GROUPS.map(group => (
                    <div key={group.id} className="border border-slate-100 rounded-xl p-3 bg-white hover:border-slate-200 transition-colors">
                      <h6 className="font-bold text-slate-700 text-xs mb-3 pb-2 border-b border-slate-100">{group.label}</h6>
                      <div className="space-y-2">
                        {group.permissions.map(perm => {
                          const hasPerm = (selectedStaff.permissions || []).includes(perm.id);
                          return (
                            <label 
                              key={perm.id} 
                              className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition-colors ${hasPerm ? 'border-amber-500 bg-amber-50' : 'border-slate-100 hover:bg-slate-50'}`}
                            >
                              <input 
                                type="checkbox" 
                                className="hidden"
                                checked={hasPerm}
                                onChange={() => togglePermission(selectedStaff, perm.id)}
                              />
                              {hasPerm ? <CheckCircle className="w-4 h-4 shrink-0 text-amber-500" /> : <div className="w-4 h-4 shrink-0 rounded-full border-2 border-slate-300" />}
                              <span className={`text-[11px] font-bold leading-tight ${hasPerm ? 'text-amber-700' : 'text-slate-600'}`}>
                                {perm.label}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
