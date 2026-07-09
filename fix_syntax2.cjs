const fs = require('fs');
let code = fs.readFileSync('src/components/SalesTab.tsx', 'utf8');

// The closing tag was added but opening wasn't.
code = code.replace(/onClick=\{\(\) => \{\n\s*if \(currentUser\?\.role !== 'admin' && sale\.editCount && sale\.editCount >= 1 && !hasPermission\('sales-edit'\)\) \{/g, `{hasPermission('sales-edit') && (\n                          <button\n                            onClick={() => {\n                                if (currentUser?.role !== 'admin' && sale.editCount && sale.editCount >= 1 && !hasPermission('sales-edit')) {`);

// BUT wait, it's already a button.
