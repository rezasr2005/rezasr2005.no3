const fs = require('fs');

let content = fs.readFileSync('src/components/DashboardTab.tsx', 'utf8');

const oldSort = `.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || -1) // Simplified sort`;
const newSort = `.sort((a, b) => b.date.localeCompare(a.date))`;

content = content.replace(oldSort, newSort);

fs.writeFileSync('src/components/DashboardTab.tsx', content);
