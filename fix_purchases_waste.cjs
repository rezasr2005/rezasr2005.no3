const fs = require('fs');
let code = fs.readFileSync('src/components/PurchasesTab.tsx', 'utf8');

code = code.replace(/const \[wasteKg, setWasteKg\] = useState<number>\(0\);\n/, '');
code = code.replace(/const finalWeight = Math.max\(0, netWeight - \(wasteKg \|\| 0\)\);/, 'const finalWeight = netWeight;');
code = code.replace(/wasteKg,\n/, '');
code = code.replace(/setWasteKg\(0\);\n/, '');

const regexWasteInput = /<div>\s*<label className="block text-slate-700 font-semibold mb-1.5">میزان افت \(کیلوگرم\)<\/label>\s*<input\s*type="number"\s*min="0"\s*value=\{wasteKg \|\| ''\}\s*onChange=\{\(e\) => setWasteKg\(Number\(e\.target\.value\)\)\}\s*className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 bg-rose-50 text-rose-700"\s*\/>\s*<\/div>/;
code = code.replace(regexWasteInput, '');

code = code.replace(/<th className="py-3 px-4 text-center">میزان افت<\/th>\n/, '');
code = code.replace(/<td className="py-3\.5 px-4 text-center font-semibold text-rose-600">\{formatWeight\(record\.wasteKg \|\| 0\)\}<\/td>\n/, '');

fs.writeFileSync('src/components/PurchasesTab.tsx', code);
