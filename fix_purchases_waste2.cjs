const fs = require('fs');
let code = fs.readFileSync('src/components/PurchasesTab.tsx', 'utf8');

const regexWasteInput = /<div>\s*<label className="block text-slate-700 font-semibold mb-1\.5">میزان افت بار \(کیلوگرم\)<\/label>\s*<input\s*type="number"\s*min=\{0\}\s*value=\{wasteKg \|\| ''\}\s*onChange=\{\(e\) => setWasteKg\(Number\(e\.target\.value\)\)\}\s*placeholder="مثال: ۵۰"\s*className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-amber-500"\s*\/>\s*<\/div>/;

code = code.replace(regexWasteInput, '');

fs.writeFileSync('src/components/PurchasesTab.tsx', code);
