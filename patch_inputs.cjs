const fs = require('fs');
let code = fs.readFileSync('src/components/PurchasesTab.tsx', 'utf8');

const targetStr = `{/* محاسبات قیمت‌گذاری */}`;
const insertStr = `
            {/* اطلاعات فاکتور */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">شماره فاکتور</label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  placeholder="شماره فاکتور صادرکننده"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">شرکت صادرکننده فاکتور</label>
                <input
                  type="text"
                  value={invoiceCompany}
                  onChange={(e) => setInvoiceCompany(e.target.value)}
                  placeholder="نام شرکت"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">تاریخ فاکتور</label>
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">اختلاف باسکول (کیلوگرم)</label>
                <input
                  type="number"
                  value={scaleDifference || ''}
                  onChange={(e) => setScaleDifference(Number(e.target.value))}
                  placeholder="مثبت یا منفی"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
`;

code = code.replace(targetStr, insertStr + targetStr);

// Now apply edit limitation to the "Edit" button
const editBtnRegex = /<button\s*onClick=\{\(\) => handleEdit\(record\)\}/;
const editBtnReplacement = `<button
                          disabled={record.editCount && record.editCount >= 1}
                          title={record.editCount && record.editCount >= 1 ? "فقط یک بار قابلیت ویرایش دارد" : "ویرایش"}
                          onClick={() => handleEdit(record)}`;
code = code.replace(editBtnRegex, editBtnReplacement);

fs.writeFileSync('src/components/PurchasesTab.tsx', code);
