const fs = require('fs');

let content = fs.readFileSync('src/components/ActivityLogTab.tsx', 'utf8');
content = content.replace(/\\`/g, "`");
content = content.replace(/\\\$/g, "$");
fs.writeFileSync('src/components/ActivityLogTab.tsx', content);
