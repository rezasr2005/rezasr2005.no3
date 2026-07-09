const fs = require('fs');
let content = fs.readFileSync('src/components/DashboardTab.tsx', 'utf8');

const disputesSection = `
        {currentUser?.role === 'admin' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mt-6 print:hidden">
            <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              اعتراضات ثبت شده مشتریان (درجه‌بندی باسکول)
            </h3>
            <div className="space-y-3">
              {purchases.filter(p => p.disputeStatus === 'pending').length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">هیچ اعتراضی برای بررسی وجود ندارد.</p>
              ) : (
                purchases.filter(p => p.disputeStatus === 'pending').map(p => (
                  <div key={p.id} className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800">مشتری: {p.supplierName}</p>
                      <p className="text-[10px] text-slate-500 mt-1">شماره قبض: {p.weighbridgeCode || p.id} | تاریخ: {p.date}</p>
                    </div>
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded">نیازمند بررسی</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
`;

content = content.replace('      </div>\n\n      {/* مودال چاپی و PDF حرفه‌ای خاوران */}\n', disputesSection + '\n      </div>\n\n      {/* مودال چاپی و PDF حرفه‌ای خاوران */}\n');

// Import AlertCircle
if (!content.includes('AlertCircle')) {
  content = content.replace('Activity,', 'Activity, AlertCircle,');
}

fs.writeFileSync('src/components/DashboardTab.tsx', content);
