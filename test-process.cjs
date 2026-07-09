const { jsPDF } = require('jspdf');
const doc = new jsPDF();
const text = "سلام 123";
console.log(doc.processArabic(text));
