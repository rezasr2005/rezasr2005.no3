const fs = require('fs');

let content = fs.readFileSync('src/components/DashboardTab.tsx', 'utf8');

const oldHrSection = `{/* کنترل ساعت و گزارش پرسنل */}
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
        </div>`;

const priceListSection = `{/* لیست قیمت خرید روز جاری */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 lg:col-span-1">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              لیست قیمت خرید روز جاری (تومان)
            </h3>
            {currentUser.role === 'admin' && onAddGrade && (
              <button 
                onClick={() => {
                  const name = prompt('نام گرید جدید:');
                  if (name) {
                    onAddGrade({
                      name,
                      code: 'NEW',
                      description: '',
                      typicalBuyPrice: 0,
                      typicalSellPrice: 0,
                      stockKg: 0
                    });
                  }
                }}
                className="text-xs bg-emerald-50 text-emerald-600 px-2 py-1 rounded font-bold hover:bg-emerald-100"
              >
                + آیتم جدید
              </button>
            )}
          </div>
          <div className="space-y-2 max-h-[300px] overflow-y-auto pl-2">
            {grades.map(g => (
              <div key={g.id} className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">{g.name}</span>
                <div className="flex items-center gap-2">
                  {currentUser.role === 'admin' && onUpdateGrade ? (
                    <input
                      type="number"
                      value={g.typicalBuyPrice || ''}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        onUpdateGrade({ ...g, typicalBuyPrice: val });
                      }}
                      className="w-24 text-left text-xs font-mono font-bold bg-white border border-slate-200 rounded px-2 py-1 outline-none focus:border-emerald-500"
                    />
                  ) : (
                    <span className="text-xs font-bold text-emerald-600 font-mono">{formatRials(g.typicalBuyPrice)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>`;

content = content.replace(oldHrSection, priceListSection);

fs.writeFileSync('src/components/DashboardTab.tsx', content);
