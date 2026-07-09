const fs = require('fs');
const { jsPDF } = require('jspdf');
require('jspdf-autotable');

let vazirBase64 = fs.readFileSync('src/utils/vazirBase64.ts', 'utf-8');
vazirBase64 = vazirBase64.replace("export const vazirFont = '", "").replace("';", "").trim();

const doc = new jsPDF();
doc.addFileToVFS('Vazirmatn.ttf', vazirBase64);
doc.addFont('Vazirmatn.ttf', 'Vazirmatn', 'normal');
doc.setFont('Vazirmatn');

const shapeAndReverse = (text) => {
  const shaped = doc.processArabic(text);
  const tokens = shaped.split(/([0-9\.\/\-\,:]+)/);
  return tokens.map(token => {
    if (/[0-9]/.test(token)) {
      return token;
    }
    return token.split('').reverse().join('');
  }).reverse().join('');
};

doc.autoTable({
  body: [
    ['سلام 123', 'تاریخ: 1403/05/12']
  ],
  styles: { font: 'Vazirmatn' },
  didParseCell: (data) => {
    if (data.cell.text && Array.isArray(data.cell.text)) {
      data.cell.text = data.cell.text.map(text => shapeAndReverse(text.trim()));
    } else if (typeof data.cell.text === 'string') {
      data.cell.text = [shapeAndReverse(data.cell.text.trim())];
    }
  }
});

doc.save('test-html.pdf');
