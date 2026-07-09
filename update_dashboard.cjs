const fs = require('fs');
let content = fs.readFileSync('src/components/DashboardTab.tsx', 'utf8');

// If there's no mention of dispute, let's add a small section or verify it exists.
if (!content.includes('اعتراضات')) {
  const insertIndex = content.indexOf('{/* سود انبار و تصفیه کارهای شریک */}');
  
  const disputeSection = `
        {/* گزارش اعتراضات */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 lg:col-span-1">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500" />
              اعتراضات مشتریان به درجه‌بندی بار
            </h3>
          </div>
          <div className="space-y-3">
            {purchases.filter(p => p.disputeStatus === 'pending').length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">موردی برای بررسی وجود ندارد.</p>
            ) : (
              purchases.filter(p => p.disputeStatus === 'pending').map(p => (
                <div key={p.id} className="bg-rose-50 border border-rose-100 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-rose-800">مشتری: {p.supplierName}</span>
                    <span className="text-[10px] text-rose-600 font-mono">{p.date}</span>
                  </div>
                  <p className="text-[10px] text-rose-700 font-mono">فیش: {p.weighbridgeCode || p.id} | افت: {p.wastePercentage}%</p>
                </div>
              ))
            )}
          </div>
        </div>
        
        `;
        
  if (insertIndex !== -1) {
    content = content.slice(0, insertIndex) + disputeSection + content.slice(insertIndex);
    fs.writeFileSync('src/components/DashboardTab.tsx', content);
    console.log("Added dispute section.");
  }
}
