const fs = require('fs');
let code = fs.readFileSync('src/components/SalesTab.tsx', 'utf8');

code = code.replace(/<button\n\s*onClick=\{\(\) => \{\n\s*if \(currentUser\?\.role !== 'admin' && sale\.editCount/, `{hasPermission('sales-edit') && (\n                          <button\n                            onClick={() => {\n                                if (currentUser?.role !== 'admin' && sale.editCount`);

fs.writeFileSync('src/components/SalesTab.tsx', code);
