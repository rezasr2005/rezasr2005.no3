const { jsPDF } = require('jspdf');
require('jspdf-autotable');

const doc = new jsPDF();
doc.autoTable({
  head: [['تست']],
  body: [['سلام']]
});
doc.save('test.pdf');
