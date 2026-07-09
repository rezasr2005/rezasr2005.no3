const fs = require('fs');
let content = fs.readFileSync('src/components/CustomerPanel.tsx', 'utf8');

const oldCsvHeaders = `const headers = [
      'کد فیش باسکول',
      'نوع و گرید ضایعات',
      'وزن مفید (Kg)',
      'درجه اختصاص یافته',
      'نرخ واحد (ریال)',
      'مبلغ کل فاکتور (ریال)',
      'تاریخ تخلیه',
      'تاریخ تسویه مالی',
      'وضعیت اعتراض',
      'توضیحات'
    ];`;

const newCsvHeaders = `const headers = [
      'کد فیش باسکول',
      'گرید ضایعات',
      'وزن مفید (Kg)',
      'درجه بار',
      'نرخ (ریال)',
      'مبلغ کل (ریال)',
      'تاریخ تخلیه',
      'تاریخ تسویه',
      'وضعیت اعتراض',
      'ستون توضیحات'
    ];`;

content = content.replace(oldCsvHeaders, newCsvHeaders);

fs.writeFileSync('src/components/CustomerPanel.tsx', content);
