const fs = require('fs');

let content = fs.readFileSync('src/components/DashboardTab.tsx', 'utf8');

// Add state
const oldState = `  const [reportPeriod, setReportPeriod] = useState<'all' | '02' | '03'>('all');`;
const newState = `  const [reportPeriod, setReportPeriod] = useState<'all' | '02' | '03'>('all');
  const [isAddingGrade, setIsAddingGrade] = useState(false);
  const [newGradeName, setNewGradeName] = useState('');`;

content = content.replace(oldState, newState);

// Update section
const oldList = `{/* لیست قیمت خرید روز جاری */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 lg:col-span-1">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              لیست قیمت خرید روز جاری (تومان)
            </h3>
            {currentUser.role === 'admin' && onAddGrade && (
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
            )}
          </div>
          <div className="space-y-2 max-h-[300px] overflow-y-auto pl-2">
            {grades.map(g => (
              <div key={g.id} className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">{g.name}</span>
                <div className="flex items-center gap-2">
                  {currentUser.role === 'admin' && onUpdateGrade ? (
                    <input
                      type="number"
                      value={g.typicalBuyPrice || ''}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        onUpdateGrade({ ...g, typicalBuyPrice: val });
                      }}
                      className="w-24 text-left text-xs font-mono font-bold bg-white border border-slate-200 rounded px-2 py-1 outline-none focus:border-emerald-500"
                    />
                  ) : (
                    <span className="text-xs font-bold text-emerald-600 font-mono">{formatRials(g.typicalBuyPrice)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>`;

const newList = `{/* لیست قیمت خرید روز جاری */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 lg:col-span-1">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              لیست قیمت خرید روز جاری (تومان)
            </h3>
            {currentUser.role === 'admin' && onAddGrade && !isAddingGrade && (
              <button 
                onClick={() => setIsAddingGrade(true)}
                className="text-xs bg-emerald-50 text-emerald-600 px-2 py-1 rounded font-bold hover:bg-emerald-100"
              >
                + آیتم جدید
              </button>
            )}
          </div>
          <div className="space-y-2 max-h-[300px] overflow-y-auto pl-2">
            {isAddingGrade && (
              <div className="bg-emerald-50 border border-emerald-100 p-2.5 rounded-lg flex items-center gap-2">
                <input
                  type="text"
                  autoFocus
                  placeholder="نام آیتم..."
                  value={newGradeName}
                  onChange={e => setNewGradeName(e.target.value)}
                  className="flex-1 text-xs font-bold bg-white border border-emerald-200 rounded px-2 py-1 outline-none focus:border-emerald-500"
                />
                <button 
                  onClick={() => {
                    if (newGradeName.trim() && onAddGrade) {
                      onAddGrade({
                        name: newGradeName.trim(),
                        code: 'NEW',
                        description: '',
                        typicalBuyPrice: 0,
                        typicalSellPrice: 0,
                        stockKg: 0
                      });
                      setNewGradeName('');
                      setIsAddingGrade(false);
                    }
                  }}
                  className="text-xs bg-emerald-600 text-white px-3 py-1 rounded font-bold hover:bg-emerald-700"
                >
                  ثبت
                </button>
                <button onClick={() => { setIsAddingGrade(false); setNewGradeName(''); }} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            {grades.map(g => (
              <div key={g.id} className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">{g.name}</span>
                <div className="flex items-center gap-2">
                  {currentUser.role === 'admin' && onUpdateGrade ? (
                    <input
                      type="number"
                      value={g.typicalBuyPrice || ''}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        onUpdateGrade({ ...g, typicalBuyPrice: val });
                      }}
                      className="w-28 text-left text-xs font-mono font-bold bg-white border border-slate-200 rounded px-2 py-1 outline-none focus:border-emerald-500"
                    />
                  ) : (
                    <span className="text-xs font-bold text-emerald-600 font-mono">{formatRials(g.typicalBuyPrice)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>`;

content = content.replace(oldList, newList);

fs.writeFileSync('src/components/DashboardTab.tsx', content);
