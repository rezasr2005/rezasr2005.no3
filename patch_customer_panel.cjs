const fs = require('fs');
let content = fs.readFileSync('src/components/CustomerPanel.tsx', 'utf8');

content = content.replace(
  '<th className="px-3 py-3 font-bold">مبلغ کل فاکتور (ریال)</th>',
  '<th className="px-3 py-3 font-bold">مبلغ کل فاکتور (ریال)</th>\n                    <th className="px-3 py-3 font-bold">تاریخ تسویه مالی</th>'
);

content = content.replace(
  '<td className="px-3 py-3 font-mono font-bold text-slate-800">{purchase.totalPrice.toLocaleString()}</td>',
  '<td className="px-3 py-3 font-mono font-bold text-slate-800">{purchase.totalPrice.toLocaleString()}</td>\n                        <td className="px-3 py-3 font-mono text-xs">{purchase.settlementDate || "-"}</td>'
);

fs.writeFileSync('src/components/CustomerPanel.tsx', content);
