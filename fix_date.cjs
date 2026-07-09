const fs = require('fs');
let utils = fs.readFileSync('src/utils.ts', 'utf8');

utils = utils.replace(/export function getTodayJalali\(\)[\s\S]*?return.*\n\}/, `export function getTodayDate(): string {\n  return new Date().toISOString().slice(0, 10);\n}`);

fs.writeFileSync('src/utils.ts', utils);

const files = [
    'src/components/CapitalTab.tsx',
    'src/components/DashboardTab.tsx',
    'src/components/ExpensesTab.tsx',
    'src/components/LiveClock.tsx',
    'src/components/ProcessingTab.tsx',
    'src/components/PurchasesTab.tsx',
    'src/components/SalesTab.tsx'
];

for (const file of files) {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        content = content.replace(/getTodayJalali/g, 'getTodayDate');
        fs.writeFileSync(file, content);
    }
}
