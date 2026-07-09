const fs = require('fs');

let content = fs.readFileSync('src/components/DashboardTab.tsx', 'utf8');

content = content.replace(/\.\.\.expenses\.map/g, '...initialExpenses.map');

fs.writeFileSync('src/components/DashboardTab.tsx', content);
