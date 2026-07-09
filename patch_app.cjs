const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const customerPanelCheck = `
  if (currentUser.type === 'customer') {
    return (
      <CustomerPanel
        currentUser={currentUser}
        purchases={state.purchases}
        payments={state.customerPayments || []}
        grades={state.grades}
        onLogout={() => setCurrentUser(null)}
        onDisputeToggle={(purchaseId) => {
          setState(prev => ({
            ...prev,
            purchases: prev.purchases.map(p => 
              p.id === purchaseId 
                ? { ...p, disputeStatus: p.disputeStatus === 'pending' ? 'none' : 'pending' } 
                : p
            )
          }));
        }}
      />
    );
  }
`;

content = content.replace('  if (!currentUser) {\n    return <Login customers={state.customers} staff={state.staff} onLogin={setCurrentUser} />;\n  }', '  if (!currentUser) {\n    return <Login customers={state.customers} staff={state.staff} onLogin={setCurrentUser} />;\n  }\n' + customerPanelCheck);

fs.writeFileSync('src/App.tsx', content);
