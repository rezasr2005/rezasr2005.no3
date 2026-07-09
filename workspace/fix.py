import sys
with open('src/App.tsx', 'r') as f:
    text = f.read()
text = text.replace("text-slate-300'}", "text-slate-300'}`}")
text = text.replace("text-slate-300'}`}`}", "text-slate-300'}`}")
with open('src/App.tsx', 'w') as f:
    f.write(text)
