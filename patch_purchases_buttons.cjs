const fs = require('fs');
let code = fs.readFileSync('src/components/PurchasesTab.tsx', 'utf8');

// Hide new button if not purchases-add
code = code.replace(/<button\n\s*onClick=\{\(\) => \{\n\s*if \(isOpenForm\) resetForm\(\);\n\s*else setIsOpenForm\(true\);\n\s*\}\}\n\s*className="bg-amber-500/, `{hasPermission('purchases-add') && (\n        <button\n          onClick={() => {\n            if (isOpenForm) resetForm();\n            else setIsOpenForm(true);\n          }}\n          className="bg-amber-500`);

code = code.replace(/\{isOpenForm \? 'انصراف' : 'ثبت فاکتور جدید'\}\n\s*<\/button>/, `{isOpenForm ? 'انصراف' : 'ثبت فاکتور جدید'}\n        </button>\n      )}`);

// Hide actions column if not purchases-edit or purchases-delete
code = code.replace(/<th className="py-3 px-4 rounded-l-lg text-center">عملیات<\/th>/, `{(hasPermission('purchases-edit') || hasPermission('purchases-delete')) && (\n                <th className="py-3 px-4 rounded-l-lg text-center">عملیات</th>\n              )}`);

code = code.replace(/<td className="py-3 px-4 text-center">\n\s*<div className="flex items-center justify-center gap-2">/g, `{(hasPermission('purchases-edit') || hasPermission('purchases-delete')) && (\n                      <td className="py-3 px-4 text-center">\n                        <div className="flex items-center justify-center gap-2">`);

code = code.replace(/<Trash2 className="w-4 h-4" \/>\n\s*<\/button>\n\s*<\/div>\n\s*<\/td>/g, `<Trash2 className="w-4 h-4" />\n                            </button>\n                          )}
                        </div>\n                      </td>\n                    )}`);

// Add disabled / check inside edit / delete buttons
code = code.replace(/<button\n\s*title="ویرایش"/g, `{hasPermission('purchases-edit') && (\n                          <button\n                            title="ویرایش"`);
code = code.replace(/<Edit2 className="w-4 h-4" \/>\n\s*<\/button>/g, `<Edit2 className="w-4 h-4" />\n                          </button>\n                        )}`);

code = code.replace(/<button\n\s*onClick=\{\(\) => \{\n\s*if \(confirm\('آیا از حذف این فاکتور اطمینان دارید\؟'\)\) \{\n\s*onDeletePurchase\(purchase.id\);\n\s*\}\n\s*\}\}\n\s*className="text-rose-500/g, `{hasPermission('purchases-delete') && (\n                          <button\n                            onClick={() => {\n                              if (confirm('آیا از حذف این فاکتور اطمینان دارید؟')) {\n                                onDeletePurchase(purchase.id);\n                              }\n                            }}\n                            className="text-rose-500`);

fs.writeFileSync('src/components/PurchasesTab.tsx', code);
