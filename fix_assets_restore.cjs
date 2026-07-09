const fs = require('fs');

let code = `import React, { useState } from 'react';
import { AssetRecord } from '../types';
import { formatRials, getTodayDate } from '../utils';
import { Plus, Edit2, Trash2, Search, Box, Calendar, Wrench, ShieldAlert } from 'lucide-react';

interface AssetsTabProps {
  assets: AssetRecord[];
  currentUser?: any;
  onAddAsset: (record: Omit<AssetRecord, 'id' | 'lastUpdatedDate'>) => void;
  onUpdateAsset: (record: AssetRecord) => void;
  onDeleteAsset: (id: string) => void;
}

export default function AssetsTab({
  assets,
  currentUser,
  onAddAsset,
  onUpdateAsset,
  onDeleteAsset
}: AssetsTabProps) {
  
  const isAdmin = currentUser?.role === 'admin';
  const hasPermission = (action: string) => {
    if (isAdmin) return true;
    return (currentUser?.permissions || []).includes(action);
  };

  const [isOpenForm, setIsOpenForm] = useState(false);
  const [editingAsset, setEditingAsset] = useState<AssetRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState<AssetRecord['category']>('machinery');
  const [brand, setBrand] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(getTodayDate());
  const [manufactureYear, setManufactureYear] = useState('');
  const [purchasePrice, setPurchasePrice] = useState<number>(0);
  const [currentValue, setCurrentValue] = useState<number>(0);
  const [condition, setCondition] = useState<AssetRecord['condition']>('working');
  const [location, setLocation] = useState('انبار مرکزی');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');

  const resetForm = () => {
    setEditingAsset(null);
    setName('');
    setCategory('machinery');
    setBrand('');
    setSerialNumber('');
    setPurchaseDate(getTodayDate());
    setManufactureYear('');
    setPurchasePrice(0);
    setCurrentValue(0);
    setCondition('working');
    setLocation('انبار مرکزی');
    setDescription('');
    setAssignedTo('');
    setIsOpenForm(false);
  };

  const handleEdit = (asset: AssetRecord) => {
    if (!hasPermission('assets-edit')) {
      alert('شما مجاز به ویرایش اموال نیستید.');
      return;
    }
    setEditingAsset(asset);
    setName(asset.name);
    setCategory(asset.category);
    setBrand(asset.brand || '');
    setSerialNumber(asset.serialNumber || '');
    setPurchaseDate(asset.purchaseDate);
    setManufactureYear(asset.manufactureYear || '');
    setPurchasePrice(asset.purchasePrice);
    setCurrentValue(asset.currentValue);
    setCondition(asset.condition);
    setLocation(asset.location);
    setDescription(asset.description || '');
    setAssignedTo(asset.assignedTo || '');
    setIsOpenForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || purchasePrice <= 0 || currentValue <= 0) {
      alert('لطفا فیلدهای الزامی را پر کنید.');
      return;
    }

    if (editingAsset) {
      onUpdateAsset({
        ...editingAsset,
        name,
        category,
        brand,
        serialNumber,
        purchaseDate,
        manufactureYear,
        purchasePrice,
        currentValue,
        condition,
        location,
        description,
        assignedTo,
        lastUpdatedDate: getTodayDate()
      });
    } else {
      onAddAsset({
        name,
        category,
        brand,
        serialNumber,
        purchaseDate,
        manufactureYear,
        purchasePrice,
        currentValue,
        condition,
        location,
        description,
        assignedTo
      });
    }
    resetForm();
  };

  const categoryLabels = {
    machinery: 'ماشین‌آلات',
    tools: 'ابزارآلات',
    office: 'تجهیزات اداری',
    vehicles: 'وسایل نقلیه',
    other: 'سایر'
  };

  const conditionLabels = {
    new: 'نو / آکبند',
    working: 'در حال کار',
    needs_repair: 'نیازمند تعمیر',
    scrapped: 'اسقاط'
  };

  const filteredAssets = assets.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (a.brand && a.brand.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalCurrentValue = assets.reduce((sum, a) => sum + a.currentValue, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">اموال و اثاثیه</h2>
          <p className="text-slate-500 text-xs mt-1">مدیریت، ثبت و بروزرسانی ارزش دارایی‌های فیزیکی انبار</p>
        </div>
        {hasPermission('assets-add') && (
          <button
            onClick={() => {
              if (isOpenForm) resetForm();
              else setIsOpenForm(true);
            }}
            className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-900 font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-all text-xs"
          >
            <Plus className="w-4 h-4 text-slate-900" />
            {isOpenForm ? 'انصراف' : (editingAsset ? 'ویرایش مال' : 'ثبت دارایی جدید')}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 mb-1">ارزش کل دارایی‌ها (بروز)</p>
            <p className="text-lg font-black text-emerald-700">{formatRials(totalCurrentValue)}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
            <Box className="w-5 h-5 text-emerald-600" />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 mb-1">تعداد کل اموال ثبتی</p>
            <p className="text-lg font-black text-slate-800">{assets.length} قلم</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
            <Wrench className="w-5 h-5 text-amber-600" />
          </div>
        </div>
      </div>

      {isOpenForm && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md transition-all">
          <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-100">
            <Box className="w-5 h-5 text-amber-500" />
            <span className="font-bold text-slate-800 text-sm">{editingAsset ? 'ویرایش دارایی' : 'ثبت دارایی جدید'}</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">نام دستگاه/کالا *</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500" placeholder="مثال: باسکول ۶۰ تنی" />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">دسته‌بندی</label>
                <select value={category} onChange={(e) => setCategory(e.target.value as any)} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500">
                  <option value="machinery">ماشین‌آلات</option>
                  <option value="tools">ابزارآلات</option>
                  <option value="office">تجهیزات اداری</option>
                  <option value="vehicles">وسایل نقلیه</option>
                  <option value="other">سایر</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">برند/مدل</label>
                <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500" />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">شماره سریال / پلاک</label>
                <input type="text" value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 text-left dir-ltr" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2 border-t border-slate-50">
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">تاریخ خرید</label>
                <input type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500" />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">سال ساخت</label>
                <input type="text" value={manufactureYear} onChange={(e) => setManufactureYear(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500" />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">قیمت خرید (ریال) *</label>
                <input type="number" required min={0} value={purchasePrice || ''} onChange={(e) => setPurchasePrice(Number(e.target.value))} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500" />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">ارزش روز (ریال) *</label>
                <input type="number" required min={0} value={currentValue || ''} onChange={(e) => setCurrentValue(Number(e.target.value))} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 font-bold text-emerald-700" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2 border-t border-slate-50">
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">وضعیت سلامت</label>
                <select value={condition} onChange={(e) => setCondition(e.target.value as any)} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500">
                  <option value="new">نو / آکبند</option>
                  <option value="working">در حال کار</option>
                  <option value="needs_repair">نیازمند تعمیر</option>
                  <option value="scrapped">اسقاط</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">محل استقرار</label>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500" />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">تحویل گیرنده</label>
                <input type="text" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500" />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">توضیحات</label>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500" />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
              <button type="button" onClick={resetForm} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors">
                انصراف
              </button>
              <button type="submit" className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold rounded-lg transition-all shadow-sm flex items-center gap-2">
                {editingAsset ? 'بروزرسانی اطلاعات' : 'ثبت دارایی'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="relative w-64">
            <Search className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="جستجو کالا یا برند..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-3 pr-10 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-amber-500 bg-white"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                <th className="py-3 px-4">نام کالا / دستگاه</th>
                <th className="py-3 px-4">دسته‌بندی</th>
                <th className="py-3 px-4 text-center">وضعیت</th>
                <th className="py-3 px-4 text-center">تاریخ خرید</th>
                <th className="py-3 px-4 text-center">قیمت خرید</th>
                <th className="py-3 px-4 text-center">ارزش روز</th>
                {(hasPermission('assets-edit') || hasPermission('assets-delete')) && <th className="py-3 px-4 text-center">عملیات</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={(hasPermission('assets-edit') || hasPermission('assets-delete')) ? 7 : 6} className="py-8 text-center text-slate-400 font-medium">
                    موردی یافت نشد.
                  </td>
                </tr>
              ) : (
                filteredAssets.map(asset => (
                  <tr key={asset.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-800">{asset.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {asset.brand && <span className="mr-2">برند: {asset.brand}</span>}
                        {asset.serialNumber && <span>سریال: <span className="dir-ltr inline-block">{asset.serialNumber}</span></span>}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-medium">
                      {categoryLabels[asset.category]}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={\`inline-block px-2 py-1 rounded-md text-[10px] font-bold \${
                        asset.condition === 'new' ? 'bg-emerald-100 text-emerald-700' :
                        asset.condition === 'working' ? 'bg-blue-100 text-blue-700' :
                        asset.condition === 'needs_repair' ? 'bg-amber-100 text-amber-700' :
                        'bg-rose-100 text-rose-700'
                      }\`}>
                        {conditionLabels[asset.condition]}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-slate-500">{asset.purchaseDate}</td>
                    <td className="py-3 px-4 text-center font-semibold text-slate-600">{formatRials(asset.purchasePrice)}</td>
                    <td className="py-3 px-4 text-center font-bold text-emerald-700">
                      {formatRials(asset.currentValue)}
                      <div className="text-[9px] text-slate-400 mt-1 font-normal">بروزرسانی: {asset.lastUpdatedDate}</div>
                    </td>
                    {(hasPermission('assets-edit') || hasPermission('assets-delete')) && (
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {hasPermission('assets-edit') && (
                            <button
                              onClick={() => handleEdit(asset)}
                              className="p-1.5 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-colors"
                              title="ویرایش"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}
                          {hasPermission('assets-delete') && (
                            <button
                              onClick={() => {
                                if (confirm('تایید می‌کنید این دارایی حذف شود؟')) {
                                  onDeleteAsset(asset.id);
                                }
                              }}
                              className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                              title="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
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
`;

fs.writeFileSync('src/components/AssetsTab.tsx', code);
