const fs = require('fs');
let content = fs.readFileSync('src/data.ts', 'utf8');

content = content.replace(
  "password: '1234'\n  },",
  `password: '1234',
    vehicles: [{ id: 'v1', plate: '۱۲ ب ۳۴۵ ایران ۶۷' }, { id: 'v2', plate: '۹۸ ج ۷۶۵ ایران ۴۳' }],
    bankAccounts: [
      { id: 'b1', accountNumber: '010123456789', iban: 'IR120170000000101234567890', bankName: 'ملی', accountHolder: 'علی علیپور', ownershipType: 'own' },
      { id: 'b2', accountNumber: '5892101112223333', iban: 'IR980580000000001112223333', bankName: 'سپه', accountHolder: 'شرکت ضایعاتی اصفهان', ownershipType: 'other' }
    ]
  },`
);

fs.writeFileSync('src/data.ts', content);
