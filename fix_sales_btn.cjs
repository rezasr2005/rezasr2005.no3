const fs = require('fs');
let code = fs.readFileSync('src/components/SalesTab.tsx', 'utf8');

code = code.replace(
  /className=\{\`p-1\.5 rounded transition-colors \$\{\(sale\.editCount && sale\.editCount >= 1\) \? 'text-slate-300 cursor-not-allowed' : 'text-blue-500 hover:bg-blue-50'\}\`\}/g,
  "className={`p-1.5 rounded transition-colors ${(currentUser?.role !== 'admin' && sale.editCount && sale.editCount >= 1) ? 'text-slate-300 cursor-not-allowed' : 'text-blue-500 hover:bg-blue-50'}`}"
);

fs.writeFileSync('src/components/SalesTab.tsx', code);
