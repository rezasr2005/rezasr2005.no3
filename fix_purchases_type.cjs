const fs = require('fs');

// 1. types.ts
let types = fs.readFileSync('src/types.ts', 'utf8');
types = types.replace(/wasteKg: number; \/\/ افت بار به کیلوگرم\n/, 'wasteKg?: number; // افت بار به کیلوگرم (moved to sales)\n');
fs.writeFileSync('src/types.ts', types);

// 2. PurchasesTab.tsx
let purchases = fs.readFileSync('src/components/PurchasesTab.tsx', 'utf8');
purchases = purchases.replace(/wasteKg: record.wasteKg \|\| 0,\n/g, ''); // just in case
purchases = purchases.replace(/wasteKg,\n/g, '');
purchases = purchases.replace(/setWasteKg\(record\.wasteKg \|\| 0\);\n/g, '');

// Also check lines 228, 229 where wasteKg was used (maybe I didn't completely remove the HTML block for wasteKg if my regex didn't match perfectly).
// Let's just remove the block if it exists
purchases = purchases.replace(/<div>\s*<label className="block text-slate-700 font-semibold mb-1\.5">میزان افت \(کیلوگرم\)<\/label>\s*<input[\s\S]*?<\/div>/, '');

fs.writeFileSync('src/components/PurchasesTab.tsx', purchases);
