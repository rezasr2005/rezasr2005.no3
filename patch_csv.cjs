const fs = require('fs');
let content = fs.readFileSync('src/components/CustomerPanel.tsx', 'utf8');

content = content.replace(
  "'تاریخ تخلیه بار', 'وضعیت', 'توضیحات']",
  "'تاریخ تخلیه بار', 'تاریخ تسویه مالی', 'وضعیت', 'توضیحات']"
);

content = content.replace(
  "p.date,\n        p.disputeStatus",
  "p.date,\n        p.settlementDate || '-',\n        p.disputeStatus"
);

fs.writeFileSync('src/components/CustomerPanel.tsx', content);
