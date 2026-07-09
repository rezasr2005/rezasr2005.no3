const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace("import DashboardTab from './components/DashboardTab';\\nimport ActivityLogTab from './components/ActivityLogTab';", "import DashboardTab from './components/DashboardTab';\nimport ActivityLogTab from './components/ActivityLogTab';");

fs.writeFileSync('src/App.tsx', content);
