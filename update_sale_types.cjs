const fs = require('fs');
let types = fs.readFileSync('src/types.ts', 'utf8');

types = types.replace(/totalPrice: number;    \/\/ مبلغ کل فروش \(تومان\)/, "totalPrice: number;    // مبلغ کل فروش (تومان)\n  invoiceNumber?: string;\n  invoiceCompany?: string;\n  invoiceDate?: string;\n  scaleDifference?: number;\n  wasteKg?: number;\n  editCount?: number;");

fs.writeFileSync('src/types.ts', types);
