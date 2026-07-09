const fs = require('fs');
let text = fs.readFileSync('src/App.tsx', 'utf8');

text = text.replace(
    /<main className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0 overflow-y-auto" id="main-content">/,
    '<main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative" id="main-content">'
);

text = text.replace(
    /<header className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center z-30 shadow-none">/,
    '<header className="shrink-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center z-30 shadow-sm">'
);

text = text.replace(
    /\{\/\* بدنه تب‌های اصلی \*\/\}\n\s*<div className="p-6 md:p-8 max-w-7xl w-full mx-auto flex-1">/,
    '<div className="flex-1 overflow-y-auto pb-16 md:pb-0">\n          {/* بدنه تب‌های اصلی */}\n          <div className="p-6 md:p-8 max-w-7xl w-full mx-auto">'
);

// find the closing tag of <main>
// Since we wrapped it, we need to add a closing div before </main>
text = text.replace(
    /<\/main>/,
    '  </div>\n      </main>'
);

fs.writeFileSync('src/App.tsx', text);
