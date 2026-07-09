const fs = require('fs');
let code = fs.readFileSync('src/components/PurchasesTab.tsx', 'utf8');

// Add states
const statesRegex = /const \[cuttingCost, setCuttingCost\] = useState<number>\(0\);/;
const newStates = `const [cuttingCost, setCuttingCost] = useState<number>(0);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceCompany, setInvoiceCompany] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [scaleDifference, setScaleDifference] = useState<number>(0);`;
code = code.replace(statesRegex, newStates);

// Add to newRecord
const newRecordRegex = /cuttingCost,/;
const newRecordFields = `cuttingCost,
      invoiceNumber,
      invoiceCompany,
      invoiceDate,
      scaleDifference,
      editCount: 0,`;
code = code.replace(newRecordRegex, newRecordFields);

// Add to handleEditSubmit
const editSubmitRegex = /cuttingCost:\s*cuttingCost,/;
const editSubmitFields = `cuttingCost,
          invoiceNumber,
          invoiceCompany,
          invoiceDate,
          scaleDifference,
          editCount: (editingRecord.editCount || 0) + 1,`;
code = code.replace(editSubmitRegex, editSubmitFields);

// Add to handleEdit
const editRegex = /setCuttingCost\(record\.cuttingCost \|\| 0\);/;
const editSetters = `setCuttingCost(record.cuttingCost || 0);
    setInvoiceNumber(record.invoiceNumber || '');
    setInvoiceCompany(record.invoiceCompany || '');
    setInvoiceDate(record.invoiceDate || '');
    setScaleDifference(record.scaleDifference || 0);`;
code = code.replace(editRegex, editSetters);

// Update finalWeight calculation
const finalWeightRegex = /const finalWeight = Math\.max\(0, netWeight - wasteKg\);/;
const finalWeightReplacement = `const finalWeight = Math.max(0, netWeight - wasteKg + (scaleDifference || 0));`;
code = code.replace(finalWeightRegex, finalWeightReplacement);

fs.writeFileSync('src/components/PurchasesTab.tsx', code);
