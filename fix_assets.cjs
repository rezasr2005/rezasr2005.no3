const fs = require('fs');
let code = fs.readFileSync('src/components/AssetsTab.tsx', 'utf8');

// The original file already had `currentUser: any;` in AssetsTabProps, but patch_all_tabs_auth.cjs added `currentUser?: any;` as well.
code = code.replace(/currentUser\?: any;\n\s*currentUser: any;/, "currentUser: any;");
code = code.replace(/currentUser,\n\s*currentUser,/, "currentUser,");
code = code.replace(/const isAdmin = currentUser\?\.role === 'admin';\n\s*const hasPermission = \([\s\S]*?;\n\s*const isAdmin = currentUser\?\.role === 'admin';/, `const isAdmin = currentUser?.role === 'admin';
  const hasPermission = (action: string) => {
    if (isAdmin) return true;
    return (currentUser?.permissions || []).includes(action);
  };`);

fs.writeFileSync('src/components/AssetsTab.tsx', code);
