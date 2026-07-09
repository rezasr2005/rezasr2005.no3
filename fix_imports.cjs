const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(path.join(__dirname, 'src', 'components')).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
  const filePath = path.join(__dirname, 'src', 'components', file);
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('import { import JalaliDate from \'./JalaliDate\';')) {
    content = content.replace("import { import JalaliDate from './JalaliDate';", "import JalaliDate from './JalaliDate';\nimport {");
    fs.writeFileSync(filePath, content, 'utf8');
  }
});
