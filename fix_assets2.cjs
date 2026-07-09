const fs = require('fs');
let code = fs.readFileSync('src/components/AssetsTab.tsx', 'utf8');

code = code.replace(/currentUser\?: any;\n\s*assets: AssetRecord\[\];\n\s*currentUser: any;/, "assets: AssetRecord[];\n  currentUser?: any;");
code = code.replace(/currentUser,\n\s*assets,\n\s*currentUser,/, "assets,\n  currentUser,");

fs.writeFileSync('src/components/AssetsTab.tsx', code);
