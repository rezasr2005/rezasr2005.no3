const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const newDash = `          {activeTab === 'dashboard' && !(currentUser?.type === 'staff' && currentUser.role === 'staff') && (
            <DashboardTab
              currentUser={currentUser}
              grades={calculatedGrades}
              purchases={state.purchases}
              sales={state.sales}
              expenses={state.expenses}
              transactions={state.transactions}
              onUpdateGrade={handleUpdateGrade}
              onAddGrade={handleAddGrade}
            />
          )}`;

content = content.replace(/\{activeTab === 'dashboard' && !\(currentUser\?\.type === 'staff' && currentUser\.role === 'staff'\) && \([\s\S]*?<\/>\n\s*\)\}/, ''); // wait

const oldDashPattern = /\{activeTab === 'dashboard' && !\(currentUser\?\.type === 'staff' && currentUser\.role === 'staff'\) && \([\s\S]*?<DashboardTab[\s\S]*?\/>\n\s*\)\}/;
content = content.replace(oldDashPattern, newDash);

fs.writeFileSync('src/App.tsx', content);
