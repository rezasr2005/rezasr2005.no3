const fs = require('fs');
let text = fs.readFileSync('src/App.tsx', 'utf8');

// I will just use regex to clean up all the `)}` before `<button` and after `</button>`
text = text.replace(/\s*\)\}\s*\{/g, "\n                )}\n                {");
text = text.replace(/\s*\)\}\s*<\/></g, "\n              )}\n            </>\n");

fs.writeFileSync('src/App.tsx', text);
