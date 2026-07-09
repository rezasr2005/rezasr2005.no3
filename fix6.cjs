const fs = require('fs');
let text = fs.readFileSync('src/App.tsx', 'utf8');

text = text.replace(/formatRials\(warehouseBalance\n/g, "formatRials(warehouseBalance)}\n");
text = text.replace(/formatRials\(warehouseBalance\s*<\/span>/g, "formatRials(warehouseBalance)}</span>");

fs.writeFileSync('src/App.tsx', text);
