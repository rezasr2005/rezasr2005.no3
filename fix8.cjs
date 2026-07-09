const fs = require('fs');
let text = fs.readFileSync('src/App.tsx', 'utf8');
text = text.replace(/saveAllState\(newState\);\n\s*\}\}\n\s*\/>\n\s*\{activeTab === 'customers'/g, "saveAllState(newState);\n              }}\n            />\n          )}\n          {activeTab === 'customers'");
fs.writeFileSync('src/App.tsx', text);
