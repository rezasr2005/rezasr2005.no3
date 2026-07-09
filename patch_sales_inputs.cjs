const fs = require('fs');
let code = fs.readFileSync('src/components/SalesTab.tsx', 'utf8');

const targetRegex = /<div>\n\s*<label className="block text-slate-700 font-semibold mb-1\.5 font-medium">ملاحظات و بند بارنامه<\/label>/;
const newInputs = `<div>
                <label className="block text-slate-700 font-semibold mb-1.5">شماره فاکتور</label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  placeholder="شماره فاکتور"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">شرکت صادرکننده</label>
                <input
                  type="text"
                  value={invoiceCompany}
                  onChange={(e) => setInvoiceCompany(e.target.value)}
                  placeholder="شرکت صادرکننده"
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
                <label className="block text-slate-700 font-semibold mb-1.5">افت بار (کیلوگرم)</label>
                <input
                  type="number"
                  min={0}
                  value={wasteKg || ''}
                  onChange={(e) => setWasteKg(Number(e.target.value))}
                  placeholder="مثال: ۵۰"
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

              <div>
                <label className="block text-slate-700 font-semibold mb-1.5 font-medium">ملاحظات و بند بارنامه</label>`;
code = code.replace(targetRegex, newInputs);

const buttonsRegex = /<td className="py-3 px-4 text-center">\n\s*<button\n\s*onClick=\{\(\) => \{/;
const buttonsReplacement = `<td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            title={(sale.editCount && sale.editCount >= 1) ? "فقط یک بار قابلیت ویرایش دارد" : "ویرایش"}
                            disabled={sale.editCount && sale.editCount >= 1}
                            onClick={() => {
                              setEditingSale(sale);
                              setDate(sale.date);
                              setScrapGradeId(sale.scrapGradeId);
                              setNetWeight(sale.netWeight);
                              setUnitPrice(sale.unitPrice);
                              setBuyerName(sale.buyerName);
                              setDriverName(sale.driverName);
                              setVehiclePlate(sale.vehiclePlate);
                              setDescription(sale.description || '');
                              setInvoiceNumber(sale.invoiceNumber || '');
                              setInvoiceCompany(sale.invoiceCompany || '');
                              setInvoiceDate(sale.invoiceDate || '');
                              setWasteKg(sale.wasteKg || 0);
                              setScaleDifference(sale.scaleDifference || 0);
                              setIsOpenForm(true);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className={\`p-1.5 rounded transition-colors \${(sale.editCount && sale.editCount >= 1) ? 'text-slate-300 cursor-not-allowed' : 'text-blue-500 hover:bg-blue-50'}\`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                          </button>
                          <button
                            onClick={() => {`;
code = code.replace(buttonsRegex, buttonsReplacement);

const closingRegex = /onDeleteSale\(sale\.id\);\n\s*\}\n\s*\}\}\n\s*className="text-rose-500 hover:bg-rose-50 p-1\.5 rounded transition-colors"\n\s*title="حذف"\n\s*>\n\s*<Trash2 className="w-4 h-4" \/>\n\s*<\/button>/;
const closingReplacement = `onDeleteSale(sale.id);
                            }
                          }}
                          className="text-rose-500 hover:bg-rose-50 p-1.5 rounded transition-colors"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>`;
code = code.replace(closingRegex, closingReplacement);

fs.writeFileSync('src/components/SalesTab.tsx', code);
