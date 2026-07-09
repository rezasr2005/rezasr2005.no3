const fs = require('fs');
let code = fs.readFileSync('src/components/StaffManagementTab.tsx', 'utf8');

const regexNewUser = /<div className="grid grid-cols-2 md:grid-cols-4 gap-3">\s*\{AVAILABLE_PERMISSIONS\.map\(perm => \{[\s\S]*?\}\)\}\s*<\/div>/;
const replacementNewUser = `<div className="space-y-4">
              {PERMISSION_GROUPS.map(group => (
                <div key={group.id} className="border border-slate-100 rounded-xl p-3 bg-slate-50/50">
                  <h6 className="font-bold text-slate-700 text-xs mb-3 pb-1 border-b border-slate-200">{group.label}</h6>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {group.permissions.map(perm => {
                      const hasPerm = (newStaff.permissions || []).includes(perm.id);
                      return (
                        <label key={perm.id} className={\`flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition-colors \${hasPerm ? 'border-amber-500 bg-amber-50' : 'border-slate-200 bg-white'}\`}>
                          <input 
                            type="checkbox" 
                            className="hidden"
                            checked={hasPerm}
                            onChange={() => toggleNewStaffPermission(perm.id)}
                          />
                          {hasPerm ? <CheckCircle className="w-4 h-4 shrink-0 text-amber-500" /> : <div className="w-4 h-4 shrink-0 rounded-full border-2 border-slate-300" />}
                          <span className={\`text-[10px] sm:text-xs font-bold leading-tight \${hasPerm ? 'text-amber-700' : 'text-slate-600'}\`}>{perm.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>`;

code = code.replace(regexNewUser, replacementNewUser);

const regexExistingUser = /<div className="grid grid-cols-2 md:grid-cols-4 gap-3">\s*\{AVAILABLE_PERMISSIONS\.map\(perm => \{[\s\S]*?\}\)\}\s*<\/div>/;
const replacementExistingUser = `<div className="space-y-4">
                {PERMISSION_GROUPS.map(group => (
                  <div key={group.id} className="border border-slate-100 rounded-xl p-3 bg-slate-50/30">
                    <h6 className="font-bold text-slate-700 text-xs mb-3 pb-1 border-b border-slate-200">{group.label}</h6>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {group.permissions.map(perm => {
                        const hasPerm = s.role === 'admin' || (s.permissions || []).includes(perm.id);
                        return (
                          <label 
                            key={perm.id} 
                            className={\`flex items-center gap-2 p-2 border rounded-lg transition-colors \${s.role === 'admin' ? 'opacity-70 cursor-not-allowed bg-indigo-50 border-indigo-100' : 'cursor-pointer hover:bg-slate-50'} \${hasPerm && s.role !== 'admin' ? 'border-amber-500 bg-amber-50' : 'border-slate-200 bg-white'}\`}
                          >
                            <input 
                              type="checkbox" 
                              className="hidden"
                              checked={hasPerm}
                              disabled={s.role === 'admin'}
                              onChange={() => togglePermission(s, perm.id)}
                            />
                            {hasPerm ? <CheckCircle className={\`w-4 h-4 shrink-0 \${s.role === 'admin' ? 'text-indigo-500' : 'text-amber-500'}\`} /> : <div className="w-4 h-4 shrink-0 rounded-full border-2 border-slate-300" />}
                            <span className={\`text-[10px] sm:text-xs font-bold leading-tight \${hasPerm ? (s.role === 'admin' ? 'text-indigo-700' : 'text-amber-700') : 'text-slate-500'}\`}>{perm.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>`;

code = code.replace(regexExistingUser, replacementExistingUser);

fs.writeFileSync('src/components/StaffManagementTab.tsx', code);
