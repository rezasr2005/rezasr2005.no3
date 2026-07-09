import re

with open('src/App.tsx', 'r') as f:
    text = f.read()

# Fix Date.now( missing )}
text = re.sub(r'Date\.now\(`', r'Date.now()}`', text)
text = re.sub(r'Date\.now\(,', r'Date.now()}`,', text)

# Fix slice(0,10.json
text = text.replace('slice(0,10.json`);', 'slice(0,10)}.json`);')

with open('src/App.tsx', 'w') as f:
    f.write(text)
