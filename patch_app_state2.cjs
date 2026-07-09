const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  'transactions: INITIAL_TRANSACTIONS',
  'transactions: INITIAL_TRANSACTIONS,\n        customerPayments: INITIAL_CUSTOMER_PAYMENTS'
);

content = content.replace(
  'transactions: []',
  'transactions: [],\n        customerPayments: []'
);

// We need to make sure INITIAL_CUSTOMER_PAYMENTS is imported
if (!content.includes('INITIAL_CUSTOMER_PAYMENTS')) {
  content = content.replace(
    'INITIAL_TRANSACTIONS',
    'INITIAL_TRANSACTIONS, INITIAL_CUSTOMER_PAYMENTS'
  );
}

fs.writeFileSync('src/App.tsx', content);
