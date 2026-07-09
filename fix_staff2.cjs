const fs = require('fs');
let code = fs.readFileSync('src/components/StaffManagementTab.tsx', 'utf8');
code = code.replace("createdAt: new Date().toISOString(),", "phone: '',");
fs.writeFileSync('src/components/StaffManagementTab.tsx', code);
