const fs = require('fs');
let text = fs.readFileSync('src/App.tsx', 'utf8');

// The closing `)}` were removed after `</button>`. We should add them back for the specific `hasPermission` blocks.
// Wait, is it better to just restore App.tsx from my initial knowledge, or fix it? I will fix it by looking for `hasPermission(...) && (` and ensuring it is closed properly.

text = text.replace(/(\{hasPermission\('[^']+'\) && \(\s*<button[\s\S]*?<\/button>\s*)/g, (match) => {
    if (!match.endsWith(")}\n")) {
        return match + "                )}\n";
    }
    return match;
});

// Also fix the first one `(currentUser?.type === 'customer' || hasPermission('dashboard')) && (`
text = text.replace(/({\(currentUser\?\.type === 'customer' \|\| hasPermission\('dashboard'\)\) && \(\s*<button[\s\S]*?<\/button>\s*)/g, (match) => {
    if (!match.endsWith(")}\n")) {
        return match + "          )}\n";
    }
    return match;
});

fs.writeFileSync('src/App.tsx', text);
