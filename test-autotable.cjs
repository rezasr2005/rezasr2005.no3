const fs = require('fs');
const { jsPDF } = require('jspdf');
require('jspdf-autotable');

let vazirBase64 = fs.readFileSync('src/utils/vazirBase64.ts', 'utf-8');
vazirBase64 = vazirBase64.replace("export const vazirFont = '", "").replace("';", "").trim();

const doc = new jsPDF();
doc.addFileToVFS('Vazirmatn.ttf', vazirBase64);
doc.addFont('Vazirmatn.ttf', 'Vazirmatn', 'normal');
doc.setFont('Vazirmatn');

const text = "سلام گزارش چاپ";

doc.autoTable({
  head: [[doc.processArabic("سلام گزارش چاپ")]],
  body: [
    [doc.processArabic("متن فارسی تست").split('').reverse().join('')]
  ],
  styles: { font: 'Vazirmatn' }
});

doc.save('test-autotable.pdf');
