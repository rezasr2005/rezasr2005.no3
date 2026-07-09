const fs = require('fs');
let text = fs.readFileSync('src/App.tsx', 'utf8');

text = text.replace(/onDeleteStaff=\{handleDeleteStaff\}\n\s*\/>\n\s*\{activeTab === 'customers'/g, "onDeleteStaff={handleDeleteStaff}\n            />\n          )}\n          {activeTab === 'customers'");
text = text.replace(/onDeleteCustomer=\{handleDeleteCustomer\}\n\s*\/>\n\s*\{activeTab === 'purchases'/g, "onDeleteCustomer={handleDeleteCustomer}\n            />\n          )}\n          {activeTab === 'purchases'");
text = text.replace(/onDeletePurchase=\{handleDeletePurchase\}\n\s*\/>\n\s*\{currentUser\?\.type/g, "onDeletePurchase={handleDeletePurchase}\n            />\n          )}\n          {currentUser?.type");

fs.writeFileSync('src/App.tsx', text);
