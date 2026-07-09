const fs = require('fs');

// Patch CapitalTab.tsx
let capContent = fs.readFileSync('src/components/CapitalTab.tsx', 'utf8');
capContent = capContent.replace(/رضا ۸۰٪ و مصطفی ندایی ۲۰٪/g, 'هلدینگ کاویان ۸۰٪ و آقای مصطفی ندایی ۲۰٪');
capContent = capContent.replace(/سهم مصطفی ندایی \(۲۰٪\)/g, 'سهم آقای مصطفی ندایی (۲۰٪)');
capContent = capContent.replace(/سهم رضا \(۸۰٪\)/g, 'سهم هلدینگ کاویان (۸۰٪)');
fs.writeFileSync('src/components/CapitalTab.tsx', capContent);

// Patch data.ts
let dataContent = fs.readFileSync('src/data.ts', 'utf8');
dataContent = dataContent.replace(/رضا و مصطفی ندایی/g, 'هلدینگ کاویان و آقای مصطفی ندایی');
fs.writeFileSync('src/data.ts', dataContent);

// Patch App.tsx
let appContent = fs.readFileSync('src/App.tsx', 'utf8');
appContent = appContent.replace(/۸۰٪ رضا \/ ۲۰٪ مصطفی ندایی/g, '۸۰٪ هلدینگ کاویان / ۲۰٪ آقای مصطفی ندایی');
fs.writeFileSync('src/App.tsx', appContent);

