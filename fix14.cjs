const fs = require('fs');
let code = fs.readFileSync('src/components/PurchasesTab.tsx', 'utf8');

const brokenStr = `const [cuttingCost,
      invoiceNumber,
      invoiceCompany,
      invoiceDate,
      scaleDifference,
      editCount: 0, setCuttingCost] = useState<number>(0);`;

const fixedStr = `const [cuttingCost, setCuttingCost] = useState<number>(0);`;

code = code.replace(brokenStr, fixedStr);

const finalWeightRegex = /const finalWeight = Math\.max\(0, netWeight - \(wasteKg \|\| 0\)\);/;
const finalWeightReplacement = `const finalWeight = Math.max(0, netWeight - (wasteKg || 0) + (scaleDifference || 0));`;
code = code.replace(finalWeightRegex, finalWeightReplacement);

fs.writeFileSync('src/components/PurchasesTab.tsx', code);
