const fs = require('fs');

// 1. Fix App.tsx
let app = fs.readFileSync('src/App.tsx', 'utf8');

app = app.replace(
    /transactions=\{state\.transactions\}\n\s*onAddTransaction=\{handleAddTransaction\}/,
    "transactions={state.transactions}\n              warehouseBalance={warehouseBalance}\n              onAddTransaction={handleAddTransaction}"
);

app = app.replace(
    /<ReportsTab[\s\S]*?\/>/,
    "<ReportsTab\n              purchases={state.purchases}\n              sales={state.sales}\n              expenses={state.expenses}\n            />"
);

app = app.replace(
    /<ActivityLogTab[\s\S]*?\/>/,
    "<ActivityLogTab\n              purchases={state.purchases}\n              sales={state.sales}\n              expenses={state.expenses}\n              authLogs={state.authLogs}\n            />"
);

app = app.replace(
    /<ProfileTab[\s\S]*?\/>/,
    "<ProfileTab\n              currentUser={currentUser}\n              customers={state.customers}\n              staff={state.staff}\n              onUpdateCustomer={handleUpdateCustomer}\n              onUpdateStaff={handleUpdateStaff}\n              onUpdateCurrentUser={setCurrentUser}\n            />"
);

fs.writeFileSync('src/App.tsx', app);

// 2. Fix data.ts
let data = fs.readFileSync('src/data.ts', 'utf8');
data = data.replace(/wastePercentage:/g, "wasteKg: 0, // wastePercentage was:");
fs.writeFileSync('src/data.ts', data);

