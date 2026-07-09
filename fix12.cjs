const fs = require('fs');
let text = fs.readFileSync('src/App.tsx', 'utf8');

const oldStr = `                              )}
<button
                onClick={() => setSidebarOpen(true)}
                className="flex flex-col items-center justify-center w-full py-2 text-slate-500"
              >
                <Menu className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-bold">بیشتر</span>
              </button>
            />
              )}`;

const newStr = `                )}
              <button
                onClick={() => setSidebarOpen(true)}
                className="flex flex-col items-center justify-center w-full py-2 text-slate-500"
              >
                <Menu className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-bold">بیشتر</span>
              </button>
            </>`;

text = text.replace(oldStr, newStr);

fs.writeFileSync('src/App.tsx', text);
