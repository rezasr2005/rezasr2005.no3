const fs = require('fs');
let code = fs.readFileSync('src/components/PurchasesTab.tsx', 'utf8');

const regexStates = /\s*const \[invoiceNumber, setInvoiceNumber\] = useState\(''\);\n\s*const \[invoiceCompany, setInvoiceCompany\] = useState\(''\);\n\s*const \[invoiceDate, setInvoiceDate\] = useState\(''\);\n\s*const \[scaleDifference, setScaleDifference\] = useState<number>\(0\);/g;
code = code.replace(regexStates, '');

const regexRecord = /\s*invoiceNumber,\n\s*invoiceCompany,\n\s*invoiceDate,\n\s*scaleDifference,\n\s*editCount: 0,/g;
code = code.replace(regexRecord, '');

const regexEditSubmit = /\s*invoiceNumber,\n\s*invoiceCompany,\n\s*invoiceDate,\n\s*scaleDifference,\n\s*editCount: \(editingRecord\.editCount \|\| 0\) \+ 1,/g;
code = code.replace(regexEditSubmit, '');

const regexEditSetters = /\s*setInvoiceNumber\(record\.invoiceNumber \|\| ''\);\n\s*setInvoiceCompany\(record\.invoiceCompany \|\| ''\);\n\s*setInvoiceDate\(record\.invoiceDate \|\| ''\);\n\s*setScaleDifference\(record\.scaleDifference \|\| 0\);/g;
code = code.replace(regexEditSetters, '');

const regexInputs = /\s*\{\/\* اطلاعات فاکتور \*\/\}\n\s*<div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2 border-t border-slate-100">[\s\S]*?<\/div>\n\s*<\/div>\n/g;
code = code.replace(regexInputs, '');

const regexDisabledEdit = /<button\n\s*disabled=\{record\.editCount && record\.editCount >= 1\}\n\s*title=\{record\.editCount && record\.editCount >= 1 \? "فقط یک بار قابلیت ویرایش دارد" : "ویرایش"\}\n\s*onClick=\{\(\) => handleEdit\(record\)\}/g;
code = code.replace(regexDisabledEdit, '<button\n                          onClick={() => handleEdit(record)}');

const regexFinalWeight = /const finalWeight = Math\.max\(0, netWeight - \(wasteKg \|\| 0\) \+ \(scaleDifference \|\| 0\)\);/g;
code = code.replace(regexFinalWeight, 'const finalWeight = Math.max(0, netWeight - (wasteKg || 0));');

fs.writeFileSync('src/components/PurchasesTab.tsx', code);
