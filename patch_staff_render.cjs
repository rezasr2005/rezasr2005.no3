const fs = require('fs');
let code = fs.readFileSync('src/components/StaffManagementTab.tsx', 'utf8');

const regexMap = /<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">/;
const newRender = `<div className="space-y-4">
                  {PERMISSION_GROUPS.map(group => (
                    <div key={group.id} className="border border-slate-100 rounded-xl p-4 bg-slate-50/50">
                      <h4 className="font-bold text-slate-700 mb-3 text-sm pb-2 border-b border-slate-200">{group.label}</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {group.permissions.map(perm => (
                          <label key={perm.id} className="flex items-center gap-2 cursor-pointer group">
                            <div className={\`w-4 h-4 rounded border flex items-center justify-center transition-colors \${newStaff.permissions?.includes(perm.id) ? 'bg-amber-500 border-amber-500' : 'border-slate-300 group-hover:border-amber-500'}\`}>
                              {newStaff.permissions?.includes(perm.id) && <CheckCircle className="w-3 h-3 text-slate-900" />}
                            </div>
                            <input
                              type="checkbox"
                              className="hidden"
                              checked={newStaff.permissions?.includes(perm.id)}
                              onChange={(e) => {
                                const current = newStaff.permissions || [];
                                const updated = e.target.checked
                                  ? [...current, perm.id]
                                  : current.filter(id => id !== perm.id);
                                setNewStaff({ ...newStaff, permissions: updated });
                              }}
                            />
                            <span className="text-xs text-slate-600 group-hover:text-slate-900 transition-colors">{perm.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">`;

code = code.replace(regexMap, newRender);

fs.writeFileSync('src/components/StaffManagementTab.tsx', code);
