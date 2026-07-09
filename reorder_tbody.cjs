const fs = require('fs');
let content = fs.readFileSync('src/components/CustomerPanel.tsx', 'utf8');

const oldTr = `                      <tr key={purchase.id} className={\`hover:bg-slate-50 transition-colors \${isDisputed ? 'bg-amber-50/30' : ''}\`}>
                        <td className="px-3 py-3 whitespace-nowrap font-mono text-xs font-bold text-slate-600">
                          {purchase.weighbridgeCode || purchase.id.replace('pur-', 'W-')}
                        </td>
                        <td className="px-3 py-3 font-mono text-xs">{purchase.date}</td>
                        <td className="px-3 py-3 font-bold text-slate-700">{grade?.name || 'نامشخص'}</td>
                        <td className="px-3 py-3 font-mono font-bold text-emerald-600">{purchase.finalWeight.toLocaleString()}</td>
                        <td className="px-3 py-3">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-100 text-slate-700 text-xs">
                            {purchase.wastePercentage}% افت بار
                          </span>
                        </td>
                        <td className="px-3 py-3 font-mono text-xs text-slate-500">{purchase.unitPrice.toLocaleString()}</td>
                        <td className="px-3 py-3 font-mono font-bold text-slate-800">{purchase.totalPrice.toLocaleString()}</td>
                        <td className="px-3 py-3 font-mono text-xs">{purchase.settlementDate || "-"}</td>
                        <td className="px-3 py-3 text-[10px] text-slate-500 max-w-[150px] truncate" title={purchase.description}>
                          {purchase.description || '-'}
                        </td>
                        <td className="px-3 py-3 text-center print:hidden">`;

const newTr = `                      <tr key={purchase.id} className={\`hover:bg-slate-50 transition-colors \${isDisputed ? 'bg-amber-50/30' : ''}\`}>
                        <td className="px-3 py-3 whitespace-nowrap font-mono text-xs font-bold text-slate-600">
                          {purchase.weighbridgeCode || purchase.id.replace('pur-', 'W-')}
                        </td>
                        <td className="px-3 py-3 font-bold text-slate-700">{grade?.name || 'نامشخص'}</td>
                        <td className="px-3 py-3 font-mono font-bold text-emerald-600">{purchase.finalWeight.toLocaleString()}</td>
                        <td className="px-3 py-3">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-100 text-slate-700 text-xs">
                            {purchase.wastePercentage}% افت بار
                          </span>
                        </td>
                        <td className="px-3 py-3 font-mono text-xs text-slate-500">{purchase.unitPrice.toLocaleString()}</td>
                        <td className="px-3 py-3 font-mono font-bold text-slate-800">{purchase.totalPrice.toLocaleString()}</td>
                        <td className="px-3 py-3 font-mono text-xs">{purchase.date}</td>
                        <td className="px-3 py-3 font-mono text-xs">{purchase.settlementDate || "-"}</td>
                        <td className="px-3 py-3 text-[10px] text-slate-500 max-w-[150px] truncate" title={purchase.description}>
                          {purchase.description || '-'}
                        </td>
                        <td className="px-3 py-3 text-center print:hidden">`;

content = content.replace(oldTr, newTr);

fs.writeFileSync('src/components/CustomerPanel.tsx', content);
