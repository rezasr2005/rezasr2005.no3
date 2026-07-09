const fs = require('fs');
let code = fs.readFileSync('src/components/SalesTab.tsx', 'utf8');

code = code.replace(
  /grades: ScrapGrade\[\];/,
  "grades: ScrapGrade[];\n  currentUser?: any;"
);

code = code.replace(
  /grades,\n\s*sales,\n\s*onAddSale,/,
  "grades,\n  sales,\n  currentUser,\n  onAddSale,"
);

// We need to check permission: currentUser?.type === 'staff' && currentUser?.role === 'admin'
// Or if we check a specific permission. The prompt says "مدیر سیستم و پرسنلی که این توانایی را دارد"
// We can just use `hasPermission('sales-edit')` or check if admin.
// Actually `hasPermission('sales')` implies they can access sales.
// For admin: `currentUser?.role === 'admin'` or `currentUser?.type === 'customer'`? No, customer shouldn't edit this.
// Let's use `const canForceEdit = currentUser?.role === 'admin' || (currentUser?.permissions || []).includes('sales');`
// But wait, if they have 'sales', they can edit once anyway. The bypass should be for admin or a special permission. Let's just use `currentUser?.role === 'admin'`.

const canForceEdit = `const canForceEdit = currentUser?.role === 'admin';`;

// Find `disabled={sale.editCount && sale.editCount >= 1}`
// Replace with `disabled={!canForceEdit && sale.editCount && sale.editCount >= 1}`

code = code.replace(
  /disabled=\{sale\.editCount && sale\.editCount >= 1\}/g,
  "disabled={currentUser?.role !== 'admin' && sale.editCount && sale.editCount >= 1}"
);

code = code.replace(
  /title=\{\(sale\.editCount && sale\.editCount >= 1\) \? "فقط یک بار قابلیت ویرایش دارد" : "ویرایش"\}/g,
  `title={(currentUser?.role !== 'admin' && sale.editCount && sale.editCount >= 1) ? "فقط یک بار قابلیت ویرایش دارد" : "ویرایش"}`
);

code = code.replace(
  /className=\{\`p-1\.5 rounded transition-colors \\\$\{\(sale\.editCount && sale\.editCount >= 1\) \? 'text-slate-300 cursor-not-allowed' : 'text-blue-500 hover:bg-blue-50'\}\`\}/g,
  "className={`p-1.5 rounded transition-colors ${(currentUser?.role !== 'admin' && sale.editCount && sale.editCount >= 1) ? 'text-slate-300 cursor-not-allowed' : 'text-blue-500 hover:bg-blue-50'}`}"
);

fs.writeFileSync('src/components/SalesTab.tsx', code);

// Now patch App.tsx
let app = fs.readFileSync('src/App.tsx', 'utf8');

app = app.replace(
  /<SalesTab\n\s*grades=\{calculatedGrades\}\n\s*sales=\{state\.sales\}/,
  "<SalesTab\n              currentUser={currentUser}\n              grades={calculatedGrades}\n              sales={state.sales}\n              onUpdateSale={handleUpdateSale}"
);

fs.writeFileSync('src/App.tsx', app);
