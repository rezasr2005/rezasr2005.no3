const fs = require('fs');
let code = fs.readFileSync('src/components/SalesTab.tsx', 'utf8');

code = code.replace(/<\/svg>\n\s*<\/button>\n\s*\)}/g, `</svg>\n                          </button>\n                        )}`);

fs.writeFileSync('src/components/SalesTab.tsx', code);
