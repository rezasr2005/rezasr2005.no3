const fs = require('fs');

function patchTab(filename, name) {
  if (!fs.existsSync(filename)) return;
  let code = fs.readFileSync(filename, 'utf8');
  
  if (!code.includes('currentUser?: any')) {
    code = code.replace(/interface [a-zA-Z]+Props \{/, (match) => match + '\n  currentUser?: any;');
    code = code.replace(/export default function [a-zA-Z]+\(\{/, (match) => match + '\n  currentUser,');
  }

  // Add hasPermission function
  if (!code.includes('const hasPermission =')) {
    const permFn = `
  const isAdmin = currentUser?.role === 'admin';
  const hasPermission = (action: string) => {
    if (isAdmin) return true;
    return (currentUser?.permissions || []).includes(action);
  };
`;
    code = code.replace(/const \[isOpenForm, setIsOpenForm\] = useState\(false\);|const \[searchTerm, setSearchTerm\] = useState\(''\);/, (match) => permFn + '\n  ' + match);
  }

  fs.writeFileSync(filename, code);
}

patchTab('src/components/PurchasesTab.tsx', 'PurchasesTab');
patchTab('src/components/ExpensesTab.tsx', 'ExpensesTab');
patchTab('src/components/CapitalTab.tsx', 'CapitalTab');
patchTab('src/components/ProcessingTab.tsx', 'ProcessingTab');
patchTab('src/components/CustomersTab.tsx', 'CustomersTab');
patchTab('src/components/AssetsTab.tsx', 'AssetsTab');
patchTab('src/components/SalesTab.tsx', 'SalesTab');

