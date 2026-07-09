const fs = require('fs');
let code = fs.readFileSync('src/components/SalesTab.tsx', 'utf8');

code = code.replace(/currentUser\?: any;\n\s*currentUser\?: any;/, "currentUser?: any;");
code = code.replace(/currentUser,\n\s*currentUser,/, "currentUser,");

fs.writeFileSync('src/components/SalesTab.tsx', code);
