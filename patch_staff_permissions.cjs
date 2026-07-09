const fs = require('fs');
let code = fs.readFileSync('src/components/StaffManagementTab.tsx', 'utf8');

const regexPermissions = /const AVAILABLE_PERMISSIONS = \[\s*\{ id: 'dashboard'[\s\S]*?\];/;
const newPermissions = `const PERMISSION_GROUPS = [
  {
    id: 'dashboard_group',
    label: 'پیشخوان و داشبورد اصلی',
    permissions: [
      { id: 'dashboard', label: 'مشاهده پیشخوان و تراز سود' }
    ]
  },
  {
    id: 'customers_group',
    label: 'مشتریان و حساب‌ها',
    permissions: [
      { id: 'customers', label: 'مشاهده لیست مشتریان' },
      { id: 'customers-add', label: 'ثبت مشتری جدید' },
      { id: 'customers-edit', label: 'ویرایش اطلاعات مشتری' },
      { id: 'customers-delete', label: 'حذف مشتری' }
    ]
  },
  {
    id: 'purchases_group',
    label: 'خرید ضایعات',
    permissions: [
      { id: 'purchases', label: 'مشاهده فاکتورهای خرید' },
      { id: 'purchases-add', label: 'ثبت خرید جدید' },
      { id: 'purchases-edit', label: 'ویرایش فاکتور خرید' },
      { id: 'purchases-delete', label: 'حذف فاکتور خرید' }
    ]
  },
  {
    id: 'sales_group',
    label: 'فروش محصولات',
    permissions: [
      { id: 'sales', label: 'مشاهده فاکتورهای فروش' },
      { id: 'sales-add', label: 'ثبت حواله فروش' },
      { id: 'sales-edit', label: 'ویرایش حواله فروش' },
      { id: 'sales-delete', label: 'حذف فاکتور فروش' }
    ]
  },
  {
    id: 'processing_group',
    label: 'فرآوری و تولید',
    permissions: [
      { id: 'processing', label: 'مشاهده فرآوری' },
      { id: 'processing-add', label: 'ثبت فرآوری جدید' },
      { id: 'processing-delete', label: 'حذف رکورد فرآوری' }
    ]
  },
  {
    id: 'expenses_group',
    label: 'هزینه‌ها',
    permissions: [
      { id: 'expenses', label: 'مشاهده هزینه‌ها' },
      { id: 'expenses-add', label: 'ثبت هزینه جدید' },
      { id: 'expenses-delete', label: 'حذف هزینه' }
    ]
  },
  {
    id: 'capital_group',
    label: 'سرمایه و صندوق',
    permissions: [
      { id: 'capital', label: 'مشاهده سرمایه‌گذاران و تراکنش‌ها' },
      { id: 'capital-add', label: 'ثبت تراکنش صندوق' },
      { id: 'capital-edit', label: 'ویرایش سرمایه‌گذاران' }
    ]
  },
  {
    id: 'assets_group',
    label: 'اموال و اثاثیه',
    permissions: [
      { id: 'assets', label: 'مشاهده اموال' },
      { id: 'assets-add', label: 'ثبت دارایی جدید' },
      { id: 'assets-edit', label: 'ویرایش دارایی' },
      { id: 'assets-delete', label: 'حذف دارایی' }
    ]
  },
  {
    id: 'system_group',
    label: 'امکانات سیستمی',
    permissions: [
      { id: 'reports', label: 'گزارشات' },
      { id: 'activity', label: 'لاگ فعالیت‌ها' },
      { id: 'staff-management', label: 'مدیریت پرسنل' }
    ]
  }
];

const AVAILABLE_PERMISSIONS = PERMISSION_GROUPS.flatMap(g => g.permissions);`;

code = code.replace(regexPermissions, newPermissions);
fs.writeFileSync('src/components/StaffManagementTab.tsx', code);
