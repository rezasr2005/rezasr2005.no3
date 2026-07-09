const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const oldDashboard = `          {activeTab === 'dashboard' && (
            <DashboardTab
              currentUser={currentUser}
              grades={calculatedGrades}
              purchases={state.purchases}
              sales={state.sales}
              expenses={state.expenses}
              transactions={state.transactions}
            />
          )}`;

const newDashboard = `          {activeTab === 'dashboard' && currentUser?.type === 'staff' && currentUser.role === 'staff' && (
            <StaffPanel currentUser={currentUser} />
          )}
          {activeTab === 'dashboard' && !(currentUser?.type === 'staff' && currentUser.role === 'staff') && (
            <DashboardTab
              currentUser={currentUser}
              grades={calculatedGrades}
              purchases={state.purchases}
              sales={state.sales}
              expenses={state.expenses}
              transactions={state.transactions}
            />
          )}`;

content = content.replace(oldDashboard, newDashboard);

fs.writeFileSync('src/App.tsx', content);
