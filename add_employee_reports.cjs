const fs = require('fs');
let content = fs.readFileSync('src/components/DashboardTab.tsx', 'utf8');

if (!content.includes('گزارش عملکرد و ساعات پرسنل')) {
  const insertIndex = content.indexOf('{/* سود انبار و تصفیه کارهای شریک */}');
  
  const hrSection = `
        {/* کنترل ساعت و گزارش پرسنل */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 lg:col-span-1">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              گزارش عملکرد و ساعات پرسنل
            </h3>
          </div>
          <div className="space-y-3">
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800">شیفت امروز (پنجشنبه)</span>
                <p className="text-[10px] text-slate-500 mt-0.5">ثبت شده توسط: مدیر سیستم</p>
              </div>
              <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold">۸:۰۰ تا ۱۴:۰۰</span>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800">گزارش روزانه وظایف</span>
                <p className="text-[10px] text-slate-500 mt-0.5">نظافت محوطه، روغن‌کاری پرس</p>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-bold">تایید شده</span>
            </div>
          </div>
        </div>
        
        `;
        
  if (insertIndex !== -1) {
    content = content.slice(0, insertIndex) + hrSection + content.slice(insertIndex);
    fs.writeFileSync('src/components/DashboardTab.tsx', content);
  }
}
