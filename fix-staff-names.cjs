const fs = require('fs');
let code = fs.readFileSync('src/data.ts', 'utf-8');

code = code.replace(
  "if (!mergedStaff.find(existing => existing.id === s.id)) {",
  `const existing = mergedStaff.find(e => e.id === s.id);
        if (!existing) {`
);

code = code.replace(
  /mergedStaff\.push\(s\);\s*changed = true;\s*\}/,
  `mergedStaff.push(s);
          changed = true;
        } else if (existing.name !== s.name || existing.phone !== s.phone || existing.role !== s.role) {
          existing.name = s.name;
          existing.phone = s.phone;
          existing.role = s.role;
          existing.permissions = s.permissions;
          changed = true;
        }`
);

fs.writeFileSync('src/data.ts', code);
