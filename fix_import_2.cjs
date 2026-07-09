const fs = require('fs');
let content = fs.readFileSync('src/components/DashboardTab.tsx', 'utf8');
content = content.replace("import { import JalaliDate from './JalaliDate';", "import JalaliDate from './JalaliDate';\nimport { ");
fs.writeFileSync('src/components/DashboardTab.tsx', content, 'utf8');
