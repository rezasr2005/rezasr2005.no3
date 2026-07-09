const fs = require('fs');
let content = fs.readFileSync('src/components/CustomerPanel.tsx', 'utf8');

const oldThead = `<thead className="bg-slate-50 text-slate-500 text-[11px] uppercase border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-3 font-bold">کد فیش باسکول</th>
                    <th className="px-3 py-3 font-bold">تاریخ تخلیه</th>
                    <th className="px-3 py-3 font-bold">نوع و گرید ضایعات</th>
                    <th className="px-3 py-3 font-bold">وزن مفید (Kg)</th>
                    <th className="px-3 py-3 font-bold">درجه/کیفیت اختصاص‌یافته</th>
                    <th className="px-3 py-3 font-bold">نرخ واحد (ریال)</th>
                    <th className="px-3 py-3 font-bold">مبلغ کل فاکتور (ریال)</th>
                    <th className="px-3 py-3 font-bold">تاریخ تسویه مالی</th>
                    <th className="px-3 py-3 font-bold">توضیحات</th>
                    <th className="px-3 py-3 font-bold text-center print:hidden">عملیات</th>
                  </tr>
                </thead>`;

const newThead = `<thead className="bg-slate-50 text-slate-500 text-[11px] uppercase border-b border-slate-200">
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
                </thead>`;

content = content.replace(oldThead, newThead);

fs.writeFileSync('src/components/CustomerPanel.tsx', content);
