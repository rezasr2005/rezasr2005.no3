const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'src', 'components');
const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.tsx'));

const varNames = ['act', 'tx', 'p', 's', 'e', 'record', 'sale', 'proc', 'payment', 'purchase', 'exp'];

files.forEach(file => {
  const filePath = path.join(componentsDir, file);
  if (file === 'JalaliDate.tsx') return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Replace {toPersianDigits(var.date)}
  varNames.forEach(v => {
    const regex1 = new RegExp(`\\{toPersianDigits\\(${v}\\.date\\)\\}`, 'g');
    content = content.replace(regex1, `<JalaliDate date={${v}.date} />`);
    
    // Replace {var.date} inside JSX (but not as a prop or in a string literal/template literal)
    // Looking for >{var.date}< or > {var.date} < or similar
    // Actually, `{var.date}` without surrounding quotes in JSX text
    // A simple regex for `{var.date}` not preceded by `=`
    const regex2 = new RegExp(`(?<!=)\\{${v}\\.date\\}`, 'g');
    content = content.replace(regex2, `<JalaliDate date={${v}.date} />`);
  });

  // Specifically for DashboardTab.tsx
  // شماره قبض: {p.weighbridgeCode || p.id} | تاریخ: {p.date}
  // This is already covered by the (?<!=) regex above!

  // ActivityLogTab.tsx has `${act.date}` inside a style text or string literal maybe? Let's check ActivityLogTab.tsx
  // '<td style="direction: ltr; text-align: right;">${act.date}</td>' - wait, that's inside a template literal.
  
  if (content !== originalContent) {
    // Need to add import JalaliDate from './JalaliDate'; if not already there
    if (!content.includes("import JalaliDate")) {
      // Find the last import statement
      const importRegex = /^import\s+.*?;?\s*$/gm;
      let match;
      let lastIndex = 0;
      while ((match = importRegex.exec(content)) !== null) {
        lastIndex = importRegex.lastIndex;
      }
      
      const importStatement = "\nimport JalaliDate from './JalaliDate';";
      if (lastIndex > 0) {
        content = content.slice(0, lastIndex) + importStatement + content.slice(lastIndex);
      } else {
        content = importStatement + "\n" + content;
      }
    }
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
