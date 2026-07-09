const fs = require('fs');
let text = fs.readFileSync('src/App.tsx', 'utf8');
text = text.replace(/className=\{`([^`]*?)`\}/g, (match, p1) => {
    // wait, if it's already complete, regex will match it fine.
    // If it's missing the backtick, the regex won't match it properly unless we match up to the next thing?
    return match;
});
