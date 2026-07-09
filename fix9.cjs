const fs = require('fs');
let text = fs.readFileSync('src/App.tsx', 'utf8');
text = text.replace(/onAddGrade=\{handleAddGrade\}\n\s*\/>\n\s*\{activeTab === 'staff/g, "onAddGrade={handleAddGrade}\n            />\n          )}\n          {activeTab === 'staff");
fs.writeFileSync('src/App.tsx', text);
