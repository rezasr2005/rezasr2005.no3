const { jsPDF } = require('jspdf');
const doc = new jsPDF();
const res = doc.processArabic("سلام");
const reversed = res.split('').reverse().join('');
console.log("Original processArabic:", res);
console.log("Reversed:", reversed);
