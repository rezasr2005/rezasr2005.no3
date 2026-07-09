const fs = require('fs');
let code = fs.readFileSync('src/components/SalesTab.tsx', 'utf8');

code = code.replace(/<button\n\s*title=\{\(currentUser\?\.role !== 'admin' && sale\.editCount && sale\.editCount >= 1\) \? "فقط یک بار قابلیت ویرایش دارد" : "ویرایش"\}/, `{hasPermission('sales-edit') && (\n                          <button\n                            title={(currentUser?.role !== 'admin' && sale.editCount && sale.editCount >= 1) ? "فقط یک بار قابلیت ویرایش دارد" : "ویرایش"}`);

fs.writeFileSync('src/components/SalesTab.tsx', code);
