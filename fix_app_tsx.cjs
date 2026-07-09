const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Undo the bad replace
code = code.replace(
  /\className=\{\`w-full py-2\.5 px-3 rounded-lg flex items-center gap-3 transition-all \$\n\s*\{activeTab === 'assets' && hasPermission\('assets'\) && \(\n\s*<AssetsTab\n\s*assets=\{state\.assets \|\| \[\]\}\n\s*currentUser=\{currentUser\}\n\s*onAddAsset=\{handleAddAsset\}\n\s*onUpdateAsset=\{handleUpdateAsset\}\n\s*onDeleteAsset=\{handleDeleteAsset\}\n\s*\/>\n\s*\)\}\n\s*\{activeTab === 'staff-management'/g,
  'className={`w-full py-2.5 px-3 rounded-lg flex items-center gap-3 transition-all ${activeTab === \'staff-management\''
);

// Do the right replace
code = code.replace(
  /\{activeTab === 'staff-management' && hasPermission\('staff-management'\) && \(/g,
  `{activeTab === 'assets' && hasPermission('assets') && (
            <AssetsTab
              assets={state.assets || []}
              currentUser={currentUser}
              onAddAsset={handleAddAsset}
              onUpdateAsset={handleUpdateAsset}
              onDeleteAsset={handleDeleteAsset}
            />
          )}
          {activeTab === 'staff-management' && hasPermission('staff-management') && (`
);

fs.writeFileSync('src/App.tsx', code);
