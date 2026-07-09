const fs = require('fs');
let code = fs.readFileSync('src/components/PurchasesTab.tsx', 'utf8');

// The new button
code = code.replace(/<button\n\s*onClick=\{\(\) => \{\n\s*if \(isOpenForm\) resetForm\(\);\n\s*else setIsOpenForm\(true\);\n\s*\}\}\n\s*className="bg-amber-500/, `{hasPermission('purchases-add') && (\n          <button\n            onClick={() => {\n              if (isOpenForm) resetForm();\n              else setIsOpenForm(true);\n            }}\n            className="bg-amber-500`);
code = code.replace(/\{isOpenForm \? 'انصراف' : 'ثبت فاکتور جدید'\}\n\s*<\/button>/, `{isOpenForm ? 'انصراف' : 'ثبت فاکتور جدید'}\n          </button>\n        )}`);

// The th column
code = code.replace(/<th className="py-3 px-4 text-center rounded-l-lg">عملیات<\/th>/, `{(hasPermission('purchases-edit') || hasPermission('purchases-delete')) && (\n                <th className="py-3 px-4 text-center rounded-l-lg">عملیات</th>\n              )}`);

// The td column
code = code.replace(/<td className="py-3 px-4 text-center">\n\s*<div className="flex items-center justify-center gap-2">/, `{(hasPermission('purchases-edit') || hasPermission('purchases-delete')) && (\n                      <td className="py-3 px-4 text-center">\n                        <div className="flex items-center justify-center gap-2">`);
code = code.replace(/<Trash2 className="w-4 h-4" \/>\n\s*<\/button>\n\s*<\/div>\n\s*<\/td>/g, `<Trash2 className="w-4 h-4" />\n                            </button>\n                          )}
                        </div>\n                      </td>\n                    )}`);

// Edit button
code = code.replace(/<button\n\s*onClick=\{\(\) => handleEdit\(record\)\}/, `{hasPermission('purchases-edit') && (\n                          <button\n                            onClick={() => handleEdit(record)}`);
code = code.replace(/<Edit2 className="w-4 h-4" \/>\n\s*<\/button>/, `<Edit2 className="w-4 h-4" />\n                          </button>\n                        )}`);

// Delete button
code = code.replace(/<button\n\s*onClick=\{\(\) => \{\n\s*if \(confirm\('آیا از حذف این فاکتور اطمینان دارید\؟'\)\) \{\n\s*onDeletePurchase\(record\.id\);\n\s*\}\n\s*\}\}\n\s*className="p-1\.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"\n\s*title="حذف"/, `{hasPermission('purchases-delete') && (\n                          <button\n                            onClick={() => {\n                              if (confirm('آیا از حذف این فاکتور اطمینان دارید؟')) {\n                                onDeletePurchase(record.id);\n                              }\n                            }}\n                            className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"\n                            title="حذف"`);

fs.writeFileSync('src/components/PurchasesTab.tsx', code);
