const fs = require('fs');
let text = fs.readFileSync('src/App.tsx', 'utf8');

text = text.replace(/<\/>\s*<\/nav>/g, "</>\n            )}\n          </nav>");
fs.writeFileSync('src/App.tsx', text);
