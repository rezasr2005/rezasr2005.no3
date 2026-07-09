const fs = require('fs');

let content = fs.readFileSync('src/components/DashboardTab.tsx', 'utf8');

const oldPeriodFilter = `        {/* فیلتر زمانی */}
        <div className="flex gap-2 mb-6 bg-white p-2 rounded-xl shadow-sm border border-slate-200 inline-flex">
          <button 
            onClick={() => setReportPeriod('all')}
            className={\`px-4 py-2 rounded-lg text-sm font-bold transition-colors \${reportPeriod === 'all' ? 'bg-amber-100 text-amber-700' : 'text-slate-500 hover:bg-slate-50'}\`}
          >
            کل دوره
          </button>
          <button 
            onClick={() => setReportPeriod('02')}
            className={\`px-4 py-2 rounded-lg text-sm font-bold transition-colors \${reportPeriod === '02' ? 'bg-amber-100 text-amber-700' : 'text-slate-500 hover:bg-slate-50'}\`}
          >
            اردیبهشت
          </button>
          <button 
            onClick={() => setReportPeriod('03')}
            className={\`px-4 py-2 rounded-lg text-sm font-bold transition-colors \${reportPeriod === '03' ? 'bg-amber-100 text-amber-700' : 'text-slate-500 hover:bg-slate-50'}\`}
          >
            خرداد
          </button>
        </div>`;

const newPeriodFilter = `        {/* فیلتر زمانی و تفویض اختیار */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex gap-2 bg-white p-2 rounded-xl shadow-sm border border-slate-200 inline-flex">
            <button 
              onClick={() => setReportPeriod('all')}
              className={\`px-4 py-2 rounded-lg text-sm font-bold transition-colors \${reportPeriod === 'all' ? 'bg-amber-100 text-amber-700' : 'text-slate-500 hover:bg-slate-50'}\`}
            >
              کل دوره
            </button>
            <button 
              onClick={() => setReportPeriod('02')}
              className={\`px-4 py-2 rounded-lg text-sm font-bold transition-colors \${reportPeriod === '02' ? 'bg-amber-100 text-amber-700' : 'text-slate-500 hover:bg-slate-50'}\`}
            >
              اردیبهشت
            </button>
            <button 
              onClick={() => setReportPeriod('03')}
              className={\`px-4 py-2 rounded-lg text-sm font-bold transition-colors \${reportPeriod === '03' ? 'bg-amber-100 text-amber-700' : 'text-slate-500 hover:bg-slate-50'}\`}
            >
              خرداد
            </button>
          </div>
          {currentUser.role === 'admin' && (
            <label className="flex items-center gap-3 bg-indigo-50 border border-indigo-100 px-4 py-2.5 rounded-xl cursor-pointer hover:bg-indigo-100 transition-colors">
              <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded border-indigo-300 focus:ring-indigo-500" />
              <span className="text-sm font-bold text-indigo-800">تفویض تمامی اختیارات به آقای امین رحیمی</span>
            </label>
          )}
        </div>`;

content = content.replace(oldPeriodFilter, newPeriodFilter);

// For the activity log, let's insert it before {/* سود انبار و تصفیه کارهای شریک */}
const oldSection = `{/* سود انبار و تصفیه کارهای شریک */}`;

const activityLogSection = `{/* لاگ فعالیت‌های کاربران (فقط مدیر) */}
        {currentUser.role === 'admin' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-6">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <Activity className="w-5 h-5 text-blue-500" />
              <h3 className="font-bold text-slate-800">فعالیت‌های اخیر پرسنل و کاربران</h3>
            </div>
            <div className="space-y-3">
              {[...purchases.map(p => ({ ...p, _type: 'خرید', _icon: Truck, _color: 'text-amber-500', _bg: 'bg-amber-50', _desc: \`خرید \${p.grossWeight} کیلو از \${p.supplierName}\` })), 
                ...sales.map(s => ({ ...s, _type: 'فروش', _icon: ArrowUpRight, _color: 'text-emerald-500', _bg: 'bg-emerald-50', _desc: \`فروش \${s.netWeight} کیلو به \${s.buyerName}\` })),
                ...expenses.map(e => ({ ...e, _type: 'هزینه', _icon: FileText, _color: 'text-rose-500', _bg: 'bg-rose-50', _desc: \`ثبت هزینه \${e.title}\` }))]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || -1) // Simplified sort
                .slice(0, 5)
                .map((act, i) => {
                  const Icon = act._icon;
                  return (
                    <div key={i} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className={\`p-2 rounded-lg \${act._bg} \${act._color}\`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-700">{act._type}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">{act._desc}</div>
                        </div>
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 font-bold">{act.date}</div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* سود انبار و تصفیه کارهای شریک */}`;

content = content.replace(oldSection, activityLogSection);

fs.writeFileSync('src/components/DashboardTab.tsx', content);
