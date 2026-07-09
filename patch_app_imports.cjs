const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/import \{([^}]+)\} from 'lucide-react';/, (match, group) => {
  if (!group.includes('Box')) {
    return `import { ${group}, Box } from 'lucide-react';`;
  }
  return match;
});

fs.writeFileSync('src/App.tsx', code);
