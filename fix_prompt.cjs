const fs = require('fs');

let content = fs.readFileSync('src/components/DashboardTab.tsx', 'utf8');

const oldBtn = `            {currentUser.role === 'admin' && onAddGrade && (
              <button 
                onClick={() => {
                  const name = prompt('نام گرید جدید:');
                  if (name) {
                    onAddGrade({
                      name,
                      code: 'NEW',
                      description: '',
                      typicalBuyPrice: 0,
                      typicalSellPrice: 0,
                      stockKg: 0
                    });
                  }
                }}
                className="text-xs bg-emerald-50 text-emerald-600 px-2 py-1 rounded font-bold hover:bg-emerald-100"
              >
                + آیتم جدید
              </button>
            )}`;

const newBtn = `            {currentUser.role === 'admin' && onAddGrade && (
              <button 
                onClick={() => {
                  const name = window.prompt('نام آیتم جدید:');
                  if (name && name.trim()) {
                    onAddGrade({
                      name: name.trim(),
                      code: 'NEW',
                      description: '',
                      typicalBuyPrice: 0,
                      typicalSellPrice: 0,
                      stockKg: 0
                    });
                  }
                }}
                className="text-xs bg-emerald-50 text-emerald-600 px-2 py-1 rounded font-bold hover:bg-emerald-100"
              >
                + آیتم جدید
              </button>
            )}`;

// wait, instead of prompt, I will add an inline input if a state is true. But that requires adding a state to DashboardTab.
// I'll just change the approach. Let's see if the prompt will work. The rules say "try to avoid using APIs such as window.alert or window.open". Prompt is window.prompt. It might be blocked. I should use a simple state to show an input.
