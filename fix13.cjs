const fs = require('fs');
let text = fs.readFileSync('src/App.tsx', 'utf8');

// Find the end of ProfileTab
const profileTabStr = `            <ProfileTab
              currentUser={currentUser}
              customers={state.customers}
              purchases={state.purchases}
              payments={state.customerPayments || []}
              grades={state.grades}
              onChangePassword={handleChangePassword}
              onCustomerPayment={handleCustomerPayment}
            />
          )}`;

const newEnding = profileTabStr + `
        </div>
      </main>

      {/* منوی پایین در موبایل */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex items-center justify-around z-40 pb-safe">
        {(currentUser?.type === 'customer' || hasPermission('dashboard')) && (
          <button
            onClick={() => setActiveTab('dashboard')}
            className={\`flex flex-col items-center justify-center w-full py-2 \${activeTab === 'dashboard' ? 'text-amber-600' : 'text-slate-500'}\`}
          >
            <LayoutDashboard className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-bold">پیشخوان</span>
          </button>
        )}
        
        {currentUser?.type === 'staff' ? (
          <>
            {hasPermission('purchases') && (
              <button
                onClick={() => setActiveTab('purchases')}
                className={\`flex flex-col items-center justify-center w-full py-2 \${activeTab === 'purchases' ? 'text-amber-600' : 'text-slate-500'}\`}
              >
                <Scale className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-bold">خرید</span>
              </button>
            )}
            {hasPermission('sales') && (
              <button
                onClick={() => setActiveTab('sales')}
                className={\`flex flex-col items-center justify-center w-full py-2 \${activeTab === 'sales' ? 'text-amber-600' : 'text-slate-500'}\`}
              >
                <Layers className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-bold">فروش</span>
              </button>
            )}
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex flex-col items-center justify-center w-full py-2 text-slate-500"
            >
              <Menu className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-bold">بیشتر</span>
            </button>
          </>
        ) : (
          <button
            onClick={() => setActiveTab('profile')}
            className={\`flex flex-col items-center justify-center w-full py-2 \${activeTab === 'profile' ? 'text-amber-600' : 'text-slate-500'}\`}
          >
            <Users className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-bold">پروفایل</span>
          </button>
        )}
      </nav>

      {/* پس‌زمینه تیره برای منوی موبایل */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-slate-900/50 z-30 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
`;

// Replace from profileTabStr to the end of the file
const idx = text.indexOf(profileTabStr);
if (idx !== -1) {
    text = text.slice(0, idx) + newEnding;
    fs.writeFileSync('src/App.tsx', text);
    console.log("Success");
} else {
    console.log("Could not find profile tab");
}
