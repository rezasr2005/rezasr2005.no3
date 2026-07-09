const fs = require('fs');
const { jsPDF } = require('jspdf');
let vazirBase64 = fs.readFileSync('src/utils/vazirBase64.ts', 'utf-8');
vazirBase64 = vazirBase64.replace("export const vazirFont = '", "").replace("';", "").trim();

const doc = new jsPDF();
doc.addFileToVFS('Vazirmatn.ttf', vazirBase64);
doc.addFont('Vazirmatn.ttf', 'Vazirmatn', 'normal');
doc.setFont('Vazirmatn');

const text = "سلام چاپ گزارش";

// 1. Raw text
doc.text(text, 100, 50);

// 2. Process Arabic
doc.text(doc.processArabic(text), 100, 70);

// 3. Process Arabic + reversed
doc.text(doc.processArabic(text).split('').reverse().join(''), 100, 90);

// 4. Process Arabic with isRTL
doc.text(doc.processArabic(text), 100, 110, { isRTL: true });

doc.save('test-rtl.pdf');
