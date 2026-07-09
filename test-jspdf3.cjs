const { jsPDF } = require('jspdf');
const doc = new jsPDF();
const res = doc.processArabic("سلام");
console.log(res);
for(let i=0; i<res.length; i++) console.log(res.charCodeAt(i).toString(16));
