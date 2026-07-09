const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Import
if (!code.includes('import AssetsTab')) {
  code = code.replace(
    /import StaffManagementTab from '\.\/components\/StaffManagementTab';/,
    "import StaffManagementTab from './components/StaffManagementTab';\nimport AssetsTab from './components/AssetsTab';"
  );
}

// 2. Add to initialData type & state
if (!code.includes('assets: AssetRecord[]')) {
  code = code.replace(
    /grades: ScrapGrade\[\];/,
    "grades: ScrapGrade[];\n  assets: any[];" // Using any[] to bypass import AssetRecord if it's missing in App.tsx imports, wait, I can just use any[] or AssetRecord[]. App.tsx already imports types. I'll just use any[] for simplicity or AssetRecord[].
  );
}

if (!code.includes('assets: []')) {
  code = code.replace(
    /grades: \[\],/,
    "grades: [],\n  assets: [],"
  );
}

// 3. Add handle add/update/delete asset
if (!code.includes('handleAddAsset')) {
  const assetHandlers = `
  const handleAddAsset = (record: any) => {
    const newRecord = { ...record, id: \`asset-\${Date.now()}\`, lastUpdatedDate: record.lastUpdatedDate || new Date().toISOString().slice(0,10) };
    setState(prev => {
      const newState = { ...prev, assets: [...(prev.assets || []), newRecord] };
      saveAllState(newState);
      return newState;
    });
  };

  const handleUpdateAsset = (record: any) => {
    setState(prev => {
      const newState = { ...prev, assets: (prev.assets || []).map(a => a.id === record.id ? record : a) };
      saveAllState(newState);
      return newState;
    });
  };

  const handleDeleteAsset = (id: string) => {
    setState(prev => {
      const newState = { ...prev, assets: (prev.assets || []).filter(a => a.id !== id) };
      saveAllState(newState);
      return newState;
    });
  };
`;
  code = code.replace(/const handleAddPurchase =/, assetHandlers + '\n  const handleAddPurchase =');
}

// 4. Render tab
if (!code.includes('activeTab === \'assets\'')) {
  const assetRender = `
          {activeTab === 'assets' && hasPermission('assets') && (
            <AssetsTab
              assets={state.assets || []}
              currentUser={currentUser}
              onAddAsset={handleAddAsset}
              onUpdateAsset={handleUpdateAsset}
              onDeleteAsset={handleDeleteAsset}
            />
          )}
`;
  code = code.replace(/\{activeTab === 'staff-management'/, assetRender + '          {activeTab === \'staff-management\'');
}

// 5. Sidebar Navigation (desktop and mobile)
const navItem = `
              {hasPermission('assets') && (
                <button
                  onClick={() => setActiveTab('assets')}
                  className={\`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all \${activeTab === 'assets' ? 'bg-amber-500 text-slate-900 shadow-md font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}\`}
                >
                  <Box className="w-5 h-5 shrink-0" />
                  <span>اموال و اثاثیه</span>
                </button>
              )}
`;
if (!code.includes('اموال و اثاثیه')) {
  code = code.replace(
    /\{hasPermission\('staff-management'\) && \(/,
    navItem + '              {hasPermission(\'staff-management\') && ('
  );
}

fs.writeFileSync('src/App.tsx', code);
