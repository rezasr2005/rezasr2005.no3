/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ScrapGrade,
  PurchaseRecord,
  ProcessingRecord,
  SaleRecord,
  ExpenseRecord,
  CashTransaction,
  CustomerPayment,
  CustomerRecord,
  StaffRecord
} from './types';

// مشتریان پیش‌فرض
export const INITIAL_CUSTOMERS: CustomerRecord[] = [
  {
    id: 'cust-1',
    name: 'ضایعاتی علیپور (اصفهان)',
    phone: '1234',
    address: 'اصفهان، شهرک صنعتی محمودآباد',
    type: 'supplier',
    password: '1234',
    vehicles: [{ id: 'v1', plate: '۱۲ ب ۳۴۵ ایران ۶۷' }, { id: 'v2', plate: '۹۸ ج ۷۶۵ ایران ۴۳' }],
    bankAccounts: [
      { id: 'b1', accountNumber: '010123456789', iban: 'IR120170000000101234567890', bankName: 'ملی', accountHolder: 'علی علیپور', ownershipType: 'own' },
      { id: 'b2', accountNumber: '5892101112223333', iban: 'IR980580000000001112223333', bankName: 'سپه', accountHolder: 'شرکت ضایعاتی اصفهان', ownershipType: 'other' }
    ]
  },
  {
    id: 'cust-2',
    name: 'فولاد مبارکه اصفهان',
    phone: '03152732222',
    address: 'اصفهان، جاده اصفهان شیراز، مجتمع فولاد مبارکه',
    type: 'buyer',
    password: '1234'
  },
  {
    id: 'cust-3',
    name: 'احمد فِیلی (جمع‌آوری کننده محلی)',
    phone: '09121113344',
    address: 'تهران، جاده خاورشهر',
    type: 'supplier',
    password: '1234'
  }
];

export const INITIAL_STAFF: StaffRecord[] = [
  {
    id: 'staff-admin',
    name: 'مدیر سیستم',
    phone: '1234',
    role: 'admin',
    password: '1234'
  },
  {
    id: 'staff-1',
    name: 'مدیر باسکول',
    phone: '1001',
    role: 'staff',
    password: '1234',
    permissions: ['dashboard', 'customers', 'purchases', 'processing', 'sales', 'expenses', 'capital', 'reports', 'activity', 'staff-management']
  },
  {
    id: 'staff-2',
    name: 'مدیر کنترل کیفی',
    phone: '1002',
    role: 'staff',
    password: '1234',
    permissions: ['dashboard', 'customers', 'purchases', 'processing', 'sales', 'expenses', 'capital', 'reports', 'activity', 'staff-management']
  },
  {
    id: 'staff-3',
    name: 'مدیر فنی مهندسی',
    phone: '1003',
    role: 'staff',
    password: '1234',
    permissions: ['dashboard', 'customers', 'purchases', 'processing', 'sales', 'expenses', 'capital', 'reports', 'activity', 'staff-management']
  },
  {
    id: 'staff-4',
    name: 'کارمند اداری',
    phone: '1004',
    role: 'staff',
    password: '1234',
    permissions: ['dashboard', 'customers', 'purchases', 'processing', 'sales', 'expenses', 'capital', 'reports', 'activity', 'staff-management']
  },
  {
    id: 'staff-5',
    name: 'کارمند حسابداری',
    phone: '1005',
    role: 'staff',
    password: '1234',
    permissions: ['dashboard', 'customers', 'purchases', 'processing', 'sales', 'expenses', 'capital', 'reports', 'activity', 'staff-management']
  },
  {
    id: 'staff-6',
    name: 'کاربر 1',
    phone: '1006',
    role: 'staff',
    password: '1234',
    permissions: ['dashboard', 'customers', 'purchases', 'processing', 'sales', 'expenses', 'capital', 'reports', 'activity', 'staff-management']
  },
  {
    id: 'staff-7',
    name: 'کاربر 2',
    phone: '1007',
    role: 'staff',
    password: '1234',
    permissions: ['dashboard', 'customers', 'purchases', 'processing', 'sales', 'expenses', 'capital', 'reports', 'activity', 'staff-management']
  },
  {
    id: 'staff-8',
    name: 'کاربر 3',
    phone: '1008',
    role: 'staff',
    password: '1234',
    permissions: ['dashboard', 'customers', 'purchases', 'processing', 'sales', 'expenses', 'capital', 'reports', 'activity', 'staff-management']
  },
  {
    id: 'staff-9',
    name: 'کاربر 4',
    phone: '1009',
    role: 'staff',
    password: '1234',
    permissions: ['dashboard', 'customers', 'purchases', 'processing', 'sales', 'expenses', 'capital', 'reports', 'activity', 'staff-management']
  },
  {
    id: 'staff-10',
    name: 'کاربر 5',
    phone: '1010',
    role: 'staff',
    password: '1234',
    permissions: ['dashboard', 'customers', 'purchases', 'processing', 'sales', 'expenses', 'capital', 'reports', 'activity', 'staff-management']
  }
];

// گرید‌های پایه ضایعات آهنی در ایران با قیمت‌های واقعی و منطقی به ریال (هر کیلوگرم)
// برگرفته از گزارش‌های مالی حسابداری هلو انبار
export const INITIAL_SCRAP_GRADES: ScrapGrade[] = [
  { id: 'grade-1', name: 'روغنی نرمه', code: 'RGN-N', description: '', typicalBuyPrice: 469000, typicalSellPrice: 495000, stockKg: 0 },
  { id: 'grade-2', name: 'روغنی ضخیم', code: 'RGN-Z', description: '', typicalBuyPrice: 470000, typicalSellPrice: 495000, stockKg: 0 },
  { id: 'grade-3', name: 'پولکی', code: 'POL', description: '', typicalBuyPrice: 450000, typicalSellPrice: 470000, stockKg: 0 },
  { id: 'grade-4', name: 'سوپرویژه', code: 'SP-VIJ', description: '', typicalBuyPrice: 424000, typicalSellPrice: 445000, stockKg: 0 },
  { id: 'grade-5', name: 'کلافی', code: 'KLF', description: '', typicalBuyPrice: 410000, typicalSellPrice: 430000, stockKg: 0 },
  { id: 'grade-6', name: 'گالوانیزه', code: 'GLV', description: '', typicalBuyPrice: 433000, typicalSellPrice: 458000, stockKg: 0 },
  { id: 'grade-7', name: 'ویژه بار', code: 'VIJ', description: '', typicalBuyPrice: 391000, typicalSellPrice: 412000, stockKg: 0 },
  { id: 'grade-8', name: 'سنگین درجه 1 زیر 50 سانت', code: 'SNG-1', description: '', typicalBuyPrice: 397000, typicalSellPrice: 420000, stockKg: 0 },
  { id: 'grade-9', name: 'سنگین درجه2 برشی', code: 'SNG-2', description: '', typicalBuyPrice: 380000, typicalSellPrice: 400000, stockKg: 0 },
  { id: 'grade-10', name: 'سبک بار 1', code: 'SBK-1', description: '', typicalBuyPrice: 368000, typicalSellPrice: 390000, stockKg: 0 },
  { id: 'grade-11', name: 'سبک بار2', code: 'SBK-2', description: '', typicalBuyPrice: 350000, typicalSellPrice: 370000, stockKg: 0 },
  { id: 'grade-12', name: 'آلیاژی', code: 'ALJ', description: '', typicalBuyPrice: 359000, typicalSellPrice: 382000, stockKg: 0 }
];

// رکوردهای پیش‌فرض نمونه خرید به ریال
export const INITIAL_PURCHASES: PurchaseRecord[] = [
  {
    id: 'pur-1',
    date: '1405/02/10',
    supplierName: 'ضایعاتی علیپور (اصفهان)',
    customerId: 'cust-1',
    weighbridgeCode: 'W-14050210-01',
    disputeStatus: 'none',
    driverName: 'جواد کریمی',
    vehiclePlate: '۶۸ ب ۵۴۹ ایران ۴۴',
    scrapGradeId: 'grade-3', // سنگین
    grossWeight: 14200,    // ۱۴.۲ تن با کامیون
    tareWeight: 6100,      // ۶.۱ تن کامیون خالی
    netWeight: 8100,       // ۸.۱ تن بار خالص
    wasteKg: 0, // wastePercentage was: 3,    // ۳ درصد افت بار خاک و زباله
    finalWeight: 7857,     // ۷,۸۵۷ کیلو بار مفید پس از افت
    unitPrice: 397896,     // ۳۹۷,۸۹۶ ریال هر کیلوگرم
    totalPrice: 3126268872, // ۳,۱۲۶,۲۶۸,۸۷۲ ریال خرید خالص انبار
    description: 'خرید بار صنعتی کارگاهی سنگین از انبار واسطه اصفهان'
  },
  {
    id: 'pur-2',
    date: '1405/02/12',
    supplierName: 'احمد فِیلی (جمع‌آوری کننده محلی)',
    driverName: 'خود محمد فیلی',
    vehiclePlate: '۲۴ ج ۷۷۱ ایران ۲۳',
    scrapGradeId: 'grade-4', // سبک
    grossWeight: 4850,
    tareWeight: 2150,
    netWeight: 2700,
    wasteKg: 0, // wastePercentage was: 2,
    finalWeight: 2646,
    unitPrice: 368843,
    totalPrice: 975958578,
    description: 'بار بدنه خانه, بخاری و لوازم فرسوده کمدی'
  },
  {
    id: 'pur-3',
    date: '1405/02/15',
    supplierName: 'پیمانکار دکل مخابرات',
    driverName: 'حسین سهرابی',
    vehiclePlate: '۹۱ ص ۴۳۳ ایران ۱۰',
    scrapGradeId: 'grade-1', // سوپر ویژه
    grossWeight: 9400,
    tareWeight: 4200,
    netWeight: 5200,
    wasteKg: 0, // wastePercentage was: 1,
    finalWeight: 5148,
    unitPrice: 424345,
    totalPrice: 2184528060,
    description: 'شامل دکل‌های مخابراتی ممتاز ترخیص شده بدون زنگ'
  },
  {
    id: 'pur-4',
    date: '1405/02/18',
    supplierName: 'مکانیکی‌های جاده ساوه (جعفری)',
    driverName: 'علی رضایی',
    vehiclePlate: '۳۳ د ۴۸۱ ایران ۶۸',
    scrapGradeId: 'grade-4', // سبک
    grossWeight: 5400,
    tareWeight: 2800,
    netWeight: 2600,
    wasteKg: 0, // wastePercentage was: 4,
    finalWeight: 2496,
    unitPrice: 368843,
    totalPrice: 920632128,
    description: 'شامل پوسته آهن آلات سبک بدنه ماشین تصادفی'
  },
  {
    id: 'pur-5',
    date: '1405/02/22',
    supplierName: 'کارگاه تراشکاری صنعت نوین',
    driverName: 'کریم محمودی',
    vehiclePlate: '۴۸ ب ۱۲۵ ایران ۵۵',
    scrapGradeId: 'grade-8', // حلب
    grossWeight: 6800,
    tareWeight: 3100,
    netWeight: 3700,
    wasteKg: 0, // wastePercentage was: 5,
    finalWeight: 3515,
    unitPrice: 140000,
    totalPrice: 492100000,
    description: 'پایه حلب نازک گالوانی روغنی تفکیکی کوره دَوار'
  }
];

// رکوردهای پیش‌فرض نمونه عملیات فرآوری داخل انبار (برش‌کاری و پرس) به ریال
export const INITIAL_PROCESSING: ProcessingRecord[] = [
  {
    id: 'proc-1',
    date: '1405/02/14',
    sourceGradeId: 'grade-4', 
    sourceWeightKg: 5000,     
    targetGradeId: 'grade-1', 
    targetWeightKg: 4650,     
    wasteWeightKg: 350,       
    processingCost: 35000000,  // ۳۵,۰۰۰,۰۰۰ ریال هزینه بالاسری، کپسول هوا گاز و کارگر
    laborName: 'اصغر کرمی (برشکار ارشد)',
    description: 'برشکاری شاسی‌ها و تیرآهن‌های بلند با هوا گاز و تبدیل به بار ابعادی کوره پسند سوپر ویژه'
  },
  {
    id: 'proc-2',
    date: '1405/02/20',
    sourceGradeId: 'grade-4', 
    sourceWeightKg: 7000,     
    targetGradeId: 'grade-2', 
    targetWeightKg: 6800,     
    wasteWeightKg: 200,       
    processingCost: 52000000,  // ۵۲,۰۰۰,۰۰۰ ریال هزینه برق پرس، اجاره لودر و اپراتورها
    laborName: 'غلامرضا و حیدری (اپراتورهای پرس)',
    description: 'عملیات پرس بدنه سبک فشرده سنگین با پرس هیدرولیکی ۳۵۰ تنی انبار'
  }
];

// رکوردهای نمونه فروش انبار به ریال
export const INITIAL_SALES: SaleRecord[] = [
  {
    id: 'sale-1',
    date: '1405/02/15',
    scrapGradeId: 'grade-1', // سوپر ویژه
    netWeight: 12000,        
    unitPrice: 445000,        // ۴۴۵,۰۰۰ ریال به ازای هر کیلوگرم در درب انبار
    totalPrice: 5340000000,   // ۵,۳۴۰,۰۰۰,۰۰۰ ریال
    buyerType: 'smelter_direct', 
    buyerName: 'فولاد مبارکه اصفهان',
    driverName: 'پرویز سلیمانی',
    vehiclePlate: '۱۴ ع ۳۹۱ ایران ۹۹',
    description: 'فروش مستقیم بار سوپر ویژه فرآوری شده به مجتمع فولاد مبارکه'
  },
  {
    id: 'sale-2',
    date: '1405/02/17',
    scrapGradeId: 'grade-3', // سنگین
    netWeight: 8000,
    unitPrice: 420000,
    totalPrice: 3360000000,
    buyerType: 'smelter_direct', 
    buyerName: 'ذوب آهن پاسارگاد',
    driverName: 'رضا صمدی',
    vehiclePlate: '۵۱ ل ۷۷۳ ایران ۱۸',
    description: 'ارسال مستقیم بار سنگین به کوره ذوب کارگاهی پاسارگاد (مشمول سهم شراکت دار ۲۰٪)'
  },
  {
    id: 'sale-3',
    date: '1405/02/24',
    scrapGradeId: 'grade-2', // ویژه
    netWeight: 10000,        
    unitPrice: 412050,        
    totalPrice: 4120500000,
    buyerType: 'smelter_direct', 
    buyerName: 'صنایع فولاد کویر کاشان',
    driverName: 'محمود تهرانی',
    vehiclePlate: '۳۸ ب ۹۹۵ ایران ۲۱',
    description: 'فروش حواله آهن ویژه پرس به صنایع فولاد کویر کاشان'
  }
];

// هزینه‌های نمونه به ریال
export const INITIAL_EXPENSES: ExpenseRecord[] = [
  {
    id: 'exp-1',
    date: '1405/02/05',
    category: 'rent',
    title: 'اجاره بهای ماهیانه محوطه انبار (اردیبهشت ماه)',
    amount: 250000000, // ۲۵۰,۰۰۰,۰۰۰ ریال = ۲۵ میلیون تومان
    description: 'واریز به حساب بانک ملت آقای رجایی مالک محوطه اصلی انبار خاورشهر'
  },
  {
    id: 'exp-2',
    date: '1405/02/10',
    category: 'salary',
    title: 'حقوق و دستمزد اصغر کرمی (سرپرست برشکاری)',
    amount: 140000000, // ۱۴۰,۰۰۰,۰۰۰ ریال = ۱۴ میلیون تومان
    description: 'حقوق مبنا و مزایای اضافه کاری کپسول زنی اکیپ برشکار'
  },
  {
    id: 'exp-3',
    date: '1405/02/11',
    category: 'salary',
    title: 'حقوق حیدر رضوانی (اپراتور ارشد باسکول و انباردار)',
    amount: 110000000, // ۱۱۰,۰۰۰,۰۰۰ ریال = ۱۱ میلیون تومان
    description: 'حقوق ثابت و پاداش رصد کدهای ورودی بارهای باسکول'
  },
  {
    id: 'exp-4',
    date: '1405/02/13',
    category: 'repair',
    title: 'تعمیر پمپ هیدرولیک و جک دستگاه بیل لودر کوماتسو انبار',
    amount: 92000000, // ۹۲,۰۰۰,۰۰۰ ریال = ۹.۲ میلیون تومان
    description: 'خرید رینگ لاستیکی، کارمزد تراشکار سیار و پمپ نو جک هیدرولیک'
  },
  {
    id: 'exp-5',
    date: '1405/02/19',
    category: 'utilities',
    title: 'قبض همگانی برق صنعتی سه فاز انبار',
    amount: 43000000, // ۴۳,۰۰۰,۰۰۰ ریال = ۴.۳ میلیون تومان
    description: 'قبض برق کارگاه برای کارکرد فشرده جک پرس دایمی انباشت سبک'
  },
  {
    id: 'exp-6',
    date: '1405/02/23',
    category: 'other',
    title: 'خرید ملزومات کپسول گاز اکسیژن و دستکش پرسنل',
    amount: 28000000, // ۲۸,۰۰۰,۰۰۰ ریال = ۲.۸ میلیون تومان
    description: 'شارژ همزمان ۴ گاز مایع اکسیژن و ملزومات کارگاهی کپسول زنی'
  }
];

// تراکنش‌های نقدینگی و سرمایه نمونه انبار به ریال
export const INITIAL_TRANSACTIONS: CashTransaction[] = [
  {
    id: 'tx-1',
    date: '1405/02/01',
    type: 'deposit',
    origin: 'warehouse',
    amount: 8500000000, // ۸,۵۰۰,۰۰۰,۰۰۰ ریال سرمایه نقدی جاری آورده شرکای انبار (۸۰٪ من، ۲۰٪ شریک)
    description: 'سرمایه نقدی فعال انبار خاورشهر (آورده مشترک شرکای تجاری: هلدینگ کاویان سپنتا و آقای مصطفی ندایی)'
  }
];

// بارگذاری داده‌ها از localStorage یا استفاده از مقادیر پیش‌فرض
export const INITIAL_AUTH_LOGS: any[] = [];

export function loadAllState() {
  const getStorage = <T>(key: string, defaultValue: T): T => {
    try {
      const stored = localStorage.getItem(`scrap_app_${key}`);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  return {
    grades: getStorage('grades', INITIAL_SCRAP_GRADES),
    customers: getStorage('customers', INITIAL_CUSTOMERS),
    staff: (() => {
      const storedStaff = getStorage('staff', INITIAL_STAFF);
      // Merge new INITIAL_STAFF members if they don't exist
      const mergedStaff = [...storedStaff];
      let changed = false;
      for (const s of INITIAL_STAFF) {
        const existing = mergedStaff.find(e => e.id === s.id);
        if (!existing) {
          mergedStaff.push(s);
          changed = true;
        } else if (existing.name !== s.name || existing.phone !== s.phone || existing.role !== s.role) {
          existing.name = s.name;
          existing.phone = s.phone;
          existing.role = s.role;
          existing.permissions = s.permissions;
          changed = true;
        }
      }
      if (changed) {
        localStorage.setItem('scrap_app_staff', JSON.stringify(mergedStaff));
      }
      return mergedStaff;
    })(),
    purchases: getStorage('purchases', INITIAL_PURCHASES),
    processings: getStorage('processings', INITIAL_PROCESSING),
    sales: getStorage('sales', INITIAL_SALES),
    expenses: getStorage('expenses', INITIAL_EXPENSES),
    transactions: getStorage('transactions', INITIAL_TRANSACTIONS),
    customerPayments: getStorage('customerPayments', INITIAL_CUSTOMER_PAYMENTS),
    authLogs: getStorage('authLogs', INITIAL_AUTH_LOGS),
  };
}

export function saveAllState(state: {
  grades: ScrapGrade[];
  customers: CustomerRecord[];
  staff: StaffRecord[];
  purchases: PurchaseRecord[];
  processings: ProcessingRecord[];
  sales: SaleRecord[];
  expenses: ExpenseRecord[];
  transactions: CashTransaction[];
  customerPayments: CustomerPayment[];
  authLogs: any[];
}) {
  Object.entries(state).forEach(([key, val]) => {
    localStorage.setItem(`scrap_app_${key}`, JSON.stringify(val));
  });
}

export const INITIAL_CUSTOMER_PAYMENTS: CustomerPayment[] = [
  {
    id: 'cp-1',
    customerId: 'cust-1',
    date: '1405/02/11',
    amount: 1500000000,
    status: 'cleared',
    type: 'transfer',
    description: 'علی الحساب بار ارسالی دهم اردیبهشت'
  },
  {
    id: 'cp-2',
    customerId: 'cust-1',
    date: '1405/02/15',
    amount: 1626268872,
    status: 'pending',
    type: 'check',
    description: 'تسویه نهایی فاکتور باسکول ۱۴۰۵۰۲۱۰ (چک صیادی سررسید ۲۰ام)'
  }
];
