const fs = require('fs');
let content = fs.readFileSync('src/components/DashboardTab.tsx', 'utf8');
content = content.replace(/import\s*\{\s*import\s*JalaliDate\s*from\s*'[^']+';/, "import JalaliDate from './JalaliDate';\nimport {");
fs.writeFileSync('src/components/DashboardTab.tsx', content, 'utf8');
