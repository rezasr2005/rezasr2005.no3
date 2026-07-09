const fs = require('fs');
let text = fs.readFileSync('src/App.tsx', 'utf8');

const missingTabs = `
          {activeTab === 'sales' && hasPermission('sales') && (
            <SalesTab
              grades={calculatedGrades}
              sales={state.sales}
              onAddSale={handleAddSale}
              onDeleteSale={handleDeleteSale}
            />
          )}
          {activeTab === 'expenses' && hasPermission('expenses') && (
            <ExpensesTab
              expenses={state.expenses}
              onAddExpense={handleAddExpense}
              onDeleteExpense={handleDeleteExpense}
            />
          )}
          {activeTab === 'capital' && hasPermission('capital') && (
            <CapitalTab
              transactions={state.transactions}
              onAddTransaction={handleAddTransaction}
              onDeleteTransaction={handleDeleteTransaction}
            />
          )}
          {activeTab === 'reports' && hasPermission('reports') && (
            <ReportsTab
              purchases={state.purchases}
              sales={state.sales}
              expenses={state.expenses}
              transactions={state.transactions}
            />
          )}
          {activeTab === 'activity' && hasPermission('activity') && (
            <ActivityLogTab
              purchases={state.purchases}
              sales={state.sales}
              expenses={state.expenses}
              transactions={state.transactions}
              payments={state.customerPayments || []}
              grades={state.grades}
            />
          )}
          {activeTab === 'profile' && (
            <ProfileTab
              currentUser={currentUser}
              customers={state.customers}
              purchases={state.purchases}
              payments={state.customerPayments || []}
              grades={state.grades}
              onChangePassword={handleChangePassword}
              onCustomerPayment={handleCustomerPayment}
            />
          )}
`;

text = text.replace(/(\n\s*\}\}\n\s*\/>\n\s*)\}\}\n\s*\{currentUser\?\.type === 'staff' \? \(/, (match, p1) => {
    return p1 + "          )}\n" + missingTabs + "\n          {currentUser?.type === 'staff' ? (";
});

// Since the previous regex failed, let's just find exactly after `<PurchasesTab ... />\n          )}`
const searchTarget = "onDeletePurchase={handleDeletePurchase}\n            />\n                )}";
text = text.replace(searchTarget, searchTarget + "\n" + missingTabs);

fs.writeFileSync('src/App.tsx', text);
