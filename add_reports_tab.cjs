const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Add import
const importActivityLog = "import ActivityLogTab from './components/ActivityLogTab';";
const importReports = "import ReportsTab from './components/ReportsTab';";
if (!content.includes('ReportsTab')) {
  content = content.replace(importActivityLog, importActivityLog + "\n" + importReports);
}

// Add state type
content = content.replace(
  /type TabType = 'dashboard' \| 'customers' \| 'purchases' \| 'sales' \| 'expenses' \| 'capital' \| 'processing' \| 'profile' \| 'activity';/,
  "type TabType = 'dashboard' | 'customers' | 'purchases' | 'sales' | 'expenses' | 'capital' | 'processing' | 'profile' | 'activity' | 'reports';"
);

// Add the component rendering
const oldProfileTabRender = `          {activeTab === 'profile' && (
            <ProfileTab`;

const newReportsTabRender = `          {activeTab === 'reports' && (
            <ReportsTab
              purchases={state.purchases}
              sales={state.sales}
              expenses={state.expenses}
            />
          )}
          {activeTab === 'profile' && (
            <ProfileTab`;

content = content.replace(oldProfileTabRender, newReportsTabRender);

// Add the button in the sidebar
const oldSidebarNav = `              {currentUser.role === 'admin' && (
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

const newSidebarNav = `              {currentUser.role === 'admin' && (
                <button
                  onClick={() => setActiveTab('activity')}
                  className={\`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all \${activeTab === 'activity' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}\`}
                >
                  <Activity className="w-5 h-5" />
                  لاگ فعالیت‌ها
                </button>
              )}
              {currentUser.role === 'admin' && (
                <button
                  onClick={() => setActiveTab('reports')}
                  className={\`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all \${activeTab === 'reports' ? 'bg-purple-50 text-purple-700' : 'text-slate-600 hover:bg-slate-50'}\`}
                >
                  <BarChart4 className="w-5 h-5" />
                  گزارش‌های جامع
                </button>
              )}
            </nav>
          </aside>
        </div>`;

content = content.replace(oldSidebarNav, newSidebarNav);

// Add BarChart4 icon to App.tsx if missing
if (!content.includes('BarChart4')) {
  content = content.replace("import { formatWeight, formatRials } from './utils';", "import { formatWeight, formatRials } from './utils';\nimport { BarChart4 } from 'lucide-react';");
}

fs.writeFileSync('src/App.tsx', content);
