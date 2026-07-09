const fs = require('fs');
let text = fs.readFileSync('src/App.tsx', 'utf8');
text = text.replace(/onLogout=\{\(\) => handleLogout\(/g, "onLogout={() => handleLogout()}");
text = text.replace(/onClick=\{\(\) => setActiveTab\(/g, "onClick={() => setActiveTab(");
fs.writeFileSync('src/App.tsx', text);
