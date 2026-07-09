const fs = require('fs');
let types = fs.readFileSync('src/types.ts', 'utf8');

types = types.replace(/cuttingCost\?: number;/, `cuttingCost?: number;\n  invoiceNumber?: string;\n  invoiceCompany?: string;\n  invoiceDate?: string;\n  scaleDifference?: number;\n  editCount?: number;`);

fs.writeFileSync('src/types.ts', types);
