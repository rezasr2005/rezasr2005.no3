const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const badCode = `className={\`w-full py-2.5 px-3 rounded-lg flex items-center gap-3 transition-all $
          {activeTab === 'assets' && hasPermission('assets') && (
            <AssetsTab
              assets={state.assets || []}
              currentUser={currentUser}
              onAddAsset={handleAddAsset}
              onUpdateAsset={handleUpdateAsset}
              onDeleteAsset={handleDeleteAsset}
            />
          )}
          {activeTab === 'staff-management' ? 'bg-amber-500 text-slate-900 font-bold' : 'hover:bg-slate-800 text-slate-300'}\`}`;

const goodCode = `className={\`w-full py-2.5 px-3 rounded-lg flex items-center gap-3 transition-all \${activeTab === 'staff-management' ? 'bg-amber-500 text-slate-900 font-bold' : 'hover:bg-slate-800 text-slate-300'}\`}`;

code = code.replace(badCode, goodCode);

fs.writeFileSync('src/App.tsx', code);
