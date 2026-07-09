const fs = require('fs');

let content = fs.readFileSync('src/components/DashboardTab.tsx', 'utf8');

const activityLogSectionRegex = /\{\/\* لاگ فعالیت‌های کاربران \(فقط مدیر\) \*\/\}\s*\{currentUser\.role === 'admin' && \([\s\S]*?\}\s*\{\/\* سود انبار و تصفیه کارهای شریک \*\/\}/;

content = content.replace(activityLogSectionRegex, '{/* سود انبار و تصفیه کارهای شریک */}');

fs.writeFileSync('src/components/DashboardTab.tsx', content);
