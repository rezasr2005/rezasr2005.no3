const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add currentUser to tabs
code = code.replace(/<PurchasesTab\n\s*grades=\{calculatedGrades\}/, "<PurchasesTab\n              currentUser={currentUser}\n              grades={calculatedGrades}");
code = code.replace(/<ExpensesTab\n\s*expenses=\{state.expenses\}/, "<ExpensesTab\n              currentUser={currentUser}\n              expenses={state.expenses}");
code = code.replace(/<CapitalTab\n\s*transactions=\{state.transactions\}/, "<CapitalTab\n              currentUser={currentUser}\n              transactions={state.transactions}");
code = code.replace(/<ProcessingTab\n\s*processingRecords=\{state.processingRecords\}/, "<ProcessingTab\n              currentUser={currentUser}\n              processingRecords={state.processingRecords}");
code = code.replace(/<CustomersTab\n\s*customers=\{state.customers\}/, "<CustomersTab\n              currentUser={currentUser}\n              customers={state.customers}");

fs.writeFileSync('src/App.tsx', code);
