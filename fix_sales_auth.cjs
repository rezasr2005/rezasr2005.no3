const fs = require('fs');
let code = fs.readFileSync('src/components/SalesTab.tsx', 'utf8');

// The new button
code = code.replace(/<button\n\s*onClick=\{\(\) => \{\n\s*if \(isOpenForm\) resetForm\(\);\n\s*else setIsOpenForm\(true\);\n\s*\}\}\n\s*className="bg-blue-500/, `{hasPermission('sales-add') && (\n          <button\n            onClick={() => {\n              if (isOpenForm) resetForm();\n              else setIsOpenForm(true);\n            }}\n            className="bg-blue-500`);
code = code.replace(/\{isOpenForm \? 'انصراف' : 'ثبت حواله جدید'\}\n\s*<\/button>/, `{isOpenForm ? 'انصراف' : 'ثبت حواله جدید'}\n          </button>\n        )}`);

// Edit and Delete
code = code.replace(/onClick=\{\(\) => \{\n\s*if \(currentUser\?\.role !== 'admin' && sale\.editCount && sale\.editCount >= 1\) \{\n\s*alert\('شما فقط یک بار مجاز به ویرایش این فاکتور هستید\.'\);\n\s*return;\n\s*\}/g, `onClick={() => {\n                                if (currentUser?.role !== 'admin' && sale.editCount && sale.editCount >= 1 && !hasPermission('sales-edit')) {\n                                  alert('شما مجاز به ویرایش مجدد نیستید.');\n                                  return;\n                                }`);

code = code.replace(/<Trash2 className="w-4 h-4" \/>\n\s*<\/button>/g, `<Trash2 className="w-4 h-4" />\n                        </button>\n                        )}`);

code = code.replace(/<button\n\s*onClick=\{\(\) => \{\n\s*if \(confirm\('تایید می‌کنید این فاکتور خروج با موفقیت کسر یا حذف گردد\؟ این کار موجودی را به انبار برگشت می‌زند\.'\)\)/g, `{hasPermission('sales-delete') && (\n                          <button\n                            onClick={() => {\n                            if (confirm('تایید می‌کنید این فاکتور خروج با موفقیت کسر یا حذف گردد؟ این کار موجودی را به انبار برگشت می‌زند.'))`);

code = code.replace(/<button\n\s*title="ویرایش اطلاعات تکمیل فاکتور"/g, `{hasPermission('sales-edit') && (\n                          <button\n                            title="ویرایش اطلاعات تکمیل فاکتور"`);

code = code.replace(/<svg xmlns="http:\/\/www.w3.org\/2000\/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"><\/path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"><\/path><\/svg>\n\s*<\/button>/g, `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>\n                          </button>\n                        )}`);


fs.writeFileSync('src/components/SalesTab.tsx', code);
