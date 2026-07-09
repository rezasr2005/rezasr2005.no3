const fs = require('fs');
let code = fs.readFileSync('src/components/SalesTab.tsx', 'utf8');

// Update Props
code = code.replace(
  /onAddSale: \(record: Omit<SaleRecord, 'id'>\) => void;/,
  "onAddSale: (record: Omit<SaleRecord, 'id'>) => void;\n  onUpdateSale?: (record: SaleRecord) => void;"
);

// Update destructured props
code = code.replace(
  /onAddSale,\n\s*onDeleteSale/,
  "onAddSale,\n  onDeleteSale,\n  onUpdateSale"
);

// Add editing states and fields
const statesRegex = /const \[date, setDate\] = useState\(getTodayDate\(\)\);/;
const newStates = `const [editingSale, setEditingSale] = useState<SaleRecord | null>(null);

  // فیلدهای فرم
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceCompany, setInvoiceCompany] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [wasteKg, setWasteKg] = useState<number>(0);
  const [scaleDifference, setScaleDifference] = useState<number>(0);

  const [date, setDate] = useState(getTodayDate());`;
code = code.replace(statesRegex, newStates);

// Update net weight input? No, netWeight is manually entered in SalesTab, wait.
// Let's check how netWeight is currently used.
// It is just netWeight.
// But they want to add `wasteKg` and `scaleDifference`.
// So finalWeight should be `netWeight - wasteKg + scaleDifference`?
// Let's modify `totalPrice` calculation.
const totalPriceRegex = /const totalPrice = netWeight \* unitPrice;/;
const totalPriceReplacement = `const finalWeight = Math.max(0, netWeight - (wasteKg || 0) + (scaleDifference || 0));
  const totalPrice = finalWeight * unitPrice;`;
code = code.replace(totalPriceRegex, totalPriceReplacement);

// Update `handleSubmit`
const handleSubmitRegex = /onAddSale\(\{\n\s*date,\n\s*scrapGradeId,\n\s*netWeight,\n\s*unitPrice,\n\s*totalPrice,\n\s*buyerType: 'smelter_direct',\n\s*buyerName,\n\s*driverName,\n\s*vehiclePlate,\n\s*description\n\s*\}\);/;
const handleSubmitReplacement = `if (editingSale) {
      if (onUpdateSale) {
        onUpdateSale({
          ...editingSale,
          date,
          scrapGradeId,
          netWeight,
          unitPrice,
          totalPrice,
          buyerName,
          driverName,
          vehiclePlate,
          description,
          invoiceNumber,
          invoiceCompany,
          invoiceDate,
          wasteKg,
          scaleDifference,
          editCount: (editingSale.editCount || 0) + 1
        });
      }
    } else {
      onAddSale({
        date,
        scrapGradeId,
        netWeight,
        unitPrice,
        totalPrice,
        buyerType: 'smelter_direct',
        buyerName,
        driverName,
        vehiclePlate,
        description,
        invoiceNumber,
        invoiceCompany,
        invoiceDate,
        wasteKg,
        scaleDifference,
        editCount: 0
      });
    }`;
code = code.replace(handleSubmitRegex, handleSubmitReplacement);

// Reset form
const resetFormRegex = /\/\/ Reset Form\n\s*setBuyerName\(''\);\n\s*setNetWeight\(0\);\n\s*setDriverName\(''\);\n\s*setVehiclePlate\(''\);\n\s*setDescription\(''\);\n\s*setIsOpenForm\(false\);/;
const resetFormReplacement = `// Reset Form
    setBuyerName('');
    setNetWeight(0);
    setDriverName('');
    setVehiclePlate('');
    setDescription('');
    setInvoiceNumber('');
    setInvoiceCompany('');
    setInvoiceDate('');
    setWasteKg(0);
    setScaleDifference(0);
    setEditingSale(null);
    setIsOpenForm(false);`;
code = code.replace(resetFormRegex, resetFormReplacement);

// Form title toggle
const titleToggleRegex = /\{isOpenForm \? 'پنهان کردن فرم حواله' : 'ثبت حواله فروش جدید \(انبار\)'\}/;
code = code.replace(titleToggleRegex, `{isOpenForm ? 'پنهان کردن فرم حواله' : (editingSale ? 'ویرایش حواله فروش' : 'ثبت حواله فروش جدید (انبار)')}`);

const toggleFormFnRegex = /onClick=\{\(\) => setIsOpenForm\(!isOpenForm\)\}/;
code = code.replace(toggleFormFnRegex, `onClick={() => {
          if (isOpenForm) {
            setIsOpenForm(false);
            setEditingSale(null);
            // Reset fields
            setBuyerName('');
            setNetWeight(0);
            setDriverName('');
            setVehiclePlate('');
            setDescription('');
            setInvoiceNumber('');
            setInvoiceCompany('');
            setInvoiceDate('');
            setWasteKg(0);
            setScaleDifference(0);
          } else {
            setIsOpenForm(true);
          }
        }}`);

const submitBtnRegex = /<button type="submit"[\s\S]*?>\n\s*<Check className="w-4 h-4" \/>\n\s*ثبت حواله فروش خروج\n\s*<\/button>/;
const submitBtnReplacement = `<button type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-6 py-2.5 rounded-lg flex items-center gap-2">
                <Check className="w-4 h-4" />
                {editingSale ? 'ذخیره تغییرات' : 'ثبت حواله فروش خروج'}
              </button>`;
code = code.replace(/<button type="submit"[^>]*>[\s\S]*?<\/button>/, submitBtnReplacement);

// Inputs insertion
// Let's find "شرح فرآیند خروج و اطلاعات بارنامه" and insert before it
const insertionTarget = /<div className="col-span-1 md:col-span-4">/g;

fs.writeFileSync('src/components/SalesTab.tsx', code);
