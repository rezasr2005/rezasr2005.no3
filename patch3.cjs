const fs = require('fs');
let content = fs.readFileSync('src/components/CustomerPanel.tsx', 'utf8');

content = content.replace(
  '<h1 className="font-bold text-sm md:text-base">پرتال اختصاصی مشتریان</h1>\n              <p className="text-xs text-slate-400">{currentUser.name}</p>',
  '<h1 className="font-bold text-sm md:text-base">سلام {currentUser.name}</h1>\n              <p className="text-xs text-slate-400">پرتال اختصاصی مشتریان</p>'
);

fs.writeFileSync('src/components/CustomerPanel.tsx', content);
