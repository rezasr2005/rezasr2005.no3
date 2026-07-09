const { jsPDF } = require('jspdf');
const doc = new jsPDF();

const shapeAndReverse = (text) => {
  const shaped = doc.processArabic(text);
  // Extract number groups and preserve them
  const tokens = shaped.split(/([0-9\.\/\-\,:]+)/);
  return tokens.map(token => {
    if (/[0-9]/.test(token)) {
      return token;
    }
    return token.split('').reverse().join('');
  }).reverse().join('');
};

console.log(shapeAndReverse("تاریخ: 1403/05/12"));
console.log(shapeAndReverse("سلام 123.45 خوبی"));
