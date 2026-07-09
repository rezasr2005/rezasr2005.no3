const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Add import
const importDashboard = "import DashboardTab from './components/DashboardTab';";
const importActivityLog = "import ActivityLogTab from './components/ActivityLogTab';";
if (!content.includes('ActivityLogTab')) {
  content = content.replace(importDashboard, importDashboard + "\\n" + importActivityLog);
}

// Add state type
content = content.replace(
  /type TabType = 'dashboard' \| 'customers' \| 'purchases' \| 'sales' \| 'expenses' \| 'capital' \| 'processing' \| 'profile';/,
  "type TabType = 'dashboard' | 'customers' | 'purchases' | 'sales' | 'expenses' | 'capital' | 'processing' | 'profile' | 'activity';"
);

// Add the component rendering
const oldProfileTabRender = `          {activeTab === 'profile' && (
            <ProfileTab
              currentUser={currentUser}
              customers={state.customers}
              staff={state.staff}
              onUpdateCustomer={handleUpdateCustomer}
              onUpdateStaff={handleUpdateStaff}
              onUpdateCurrentUser={setCurrentUser}
            />
          )}`;

const newActivityTabRender = `          {activeTab === 'activity' && currentUser?.role === 'admin' && (
            <ActivityLogTab
              purchases={state.purchases}
              sales={state.sales}
              expenses={state.expenses}
            />
          )}
          {activeTab === 'profile' && (
            <ProfileTab
              currentUser={currentUser}
              customers={state.customers}
              staff={state.staff}
              onUpdateCustomer={handleUpdateCustomer}
              onUpdateStaff={handleUpdateStaff}
              onUpdateCurrentUser={setCurrentUser}
            />
          )}`;

content = content.replace(oldProfileTabRender, newActivityTabRender);

// Add the button in the sidebar (for desktop)
const oldSidebarNav = `              <button
                onClick={() => setActiveTab('capital')}
                className={\`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all \${activeTab === 'capital' ? 'bg-amber-50 text-amber-700' : 'text-slate-600 hover:bg-slate-50'}\`}
              >
                <Coins className="w-5 h-5" />
                سرمایه و صندوق
              </button>
            </nav>
          </aside>
        </div>`;

const newSidebarNav = `              <button
                onClick={() => setActiveTab('capital')}
                className={\`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all \${activeTab === 'capital' ? 'bg-amber-50 text-amber-700' : 'text-slate-600 hover:bg-slate-50'}\`}
              >
                <Coins className="w-5 h-5" />
                سرمایه و صندوق
              </button>
              {currentUser.role === 'admin' && (
                <button
                  onClick={() => setActiveTab('activity')}
                  className={\`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all \${activeTab === 'activity' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}\`}
                >
                  <Activity className="w-5 h-5" />
                  لاگ فعالیت‌ها
                </button>
              )}
            </nav>
          </aside>
        </div>`;

content = content.replace(oldSidebarNav, newSidebarNav);

fs.writeFileSync('src/App.tsx', content);
