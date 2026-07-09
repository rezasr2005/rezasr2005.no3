const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  'transactions: INITIAL_TRANSACTIONS,',
  'transactions: INITIAL_TRANSACTIONS,\n        customerPayments: []'
);

content = content.replace(
  'transactions: [],',
  'transactions: [],\n        customerPayments: []'
);

fs.writeFileSync('src/App.tsx', content);
