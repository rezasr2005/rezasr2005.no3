/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// نوع ضایعات آهن
export interface ScrapGrade {
  id: string;
  name: string;      // نام گرید (مثلا سوپر ویژه، ویژه، چدن و...)
  code: string;      // کد اختصاری گرید
  description: string; // توضیحات و کاربرد
  typicalBuyPrice: number; // قیمت خرید حدودی (تومان)
  typicalSellPrice: number; // قیمت فروش حدودی (تومان)
  stockKg: number;    // موجودی انبار به کیلوگرم
}

// ورودی بار / باسکول (خرید انبار)
export interface PurchaseRecord {
  weighbridgeCode?: string;
  customerId?: string;
  settlementDate?: string;
  disputeStatus?: "none" | "pending" | "resolved";
  id: string;
  date: string;          // تاریخ شمسی (مثلاً 1405/03/20)
  supplierName: string;  // نام فروشنده
  driverName: string;    // نام راننده
  vehiclePlate: string;  // پلاک خودرو
  scrapGradeId: string;  // گرید ضایعات
  grossWeight: number;   // وزن پر (با خودرو) - کیلوگرم
  tareWeight: number;    // وزن خالی (خودرو خالی) - کیلوگرم
  netWeight: number;     // وزن خالص بار (کیلوگرم) - محاسبه‌شده
  wasteKg?: number; // افت بار به کیلوگرم (moved to sales)
  cuttingCost?: number;
  invoiceNumber?: string;
  invoiceCompany?: string;
  invoiceDate?: string;
  scaleDifference?: number;
  editCount?: number;  // هزینه برشکاری
  finalWeight: number;   // وزن خالص نهایی پس از افت (کیلوگرم)
  unitPrice: number;     // قیمت خرید هر کیلوگرم (تومان)
  totalPrice: number;    // مبلغ کل خرید (تومان) - محاسبه‌شده
  description?: string;  // سایر توضیحات
}

// فرآیند فرآوری، برش‌کاری و پرس
export interface ProcessingRecord {
  id: string;
  date: string;
  sourceGradeId: string;    // گرید خام اولیه فرآوری‌نشده
  sourceWeightKg: number;   // وزن برداشته‌شده برای فرآوری (کیلوگرم)
  targetGradeId: string;    // گرید خروجی فرآوری‌شده (پاک‌سازی و دسته‌بندی شده)
  targetWeightKg: number;   // وزن خروجی نهایی پس از فرآیند (کیلوگرم)
  wasteWeightKg: number;    // افت فرآیندی (براده، خاکستر، ناخالصی‌های جداشده)
  processingCost: number;   // هزینه اختصاصی این فرآیند (سوخت، کارگر دموکراسی و...) - تومان
  laborName?: string;       // نام کارگر یا اپراتور دستگاه
  description?: string;     // جزئیات فرآیند (مثلا پرس کارتن یا برش با هواگاز)
}

// فروش بار انبار
export interface SaleRecord {
  id: string;
  date: string;
  scrapGradeId: string;  // گرید فروخته شده
  netWeight: number;     // وزن بار فروخته شده (کیلوگرم)
  unitPrice: number;     // قیمت فروش هر کیلوگرم (تومان)
  totalPrice: number;    // مبلغ کل فروش (تومان)
  invoiceNumber?: string;
  invoiceCompany?: string;
  invoiceDate?: string;
  scaleDifference?: number;
  wasteKg?: number;
  editCount?: number;
  buyerType: 'smelter_direct' | 'commercial_office'; // فروش مستقیم به کارخانه یا فروش به شرکت بازرگانی خودمان جهت تامین مالی
  buyerName: string;     // نام خریدار (مثلاً کارخانه فولاد یا دفتر بازرگانی خودمان)
  driverName: string;    // نام راننده
  vehiclePlate: string;  // پلاک خودرو
  description?: string;  // سایر توضیحات
}

// دفتر بازرگانی (واسطه فروش به ذوب اصلی کشور)
export interface CommercialSaleRecord {
  id: string;
  date: string;
  warehouseSaleRecordId: string; // ارجاع به رکورد خرید از انبار خودمان
  scrapGradeId: string;          // گرید ضایعات
  weight: number;                // وزن بار (کیلوگرم)
  purchasePriceFromWarehouse: number; // قیمت خرید از انبار (کیلوگرم - تومان)
  sellPriceToSmelter: number;         // قیمت فروش به کارخانه ذوب مقصد (کیلوگرم - تومان)
  totalCost: number;             // بهای تمام شده خرید (وزن * قیمت خرید) - تومان
  totalRevenue: number;          // مبلغ کل فروش به کارخانه جدید (وزن * قیمت فروش جدید) - تومان
  netProfit: number;             // سود خالص حاصل از کارمزد بازرگانی (درآمد - هزینه خرید) - تومان
  smelterName: string;           // نام کارخانه ذوب نهایی (مثل فولاد کاوه، ذوب آهن اصفهان)
  paymentStatus: 'cash' | 'check' | 'pending'; // وضعیت تسویه با کارخانه ذوب
  description?: string;
}

// هزینه‌های انبار
export type ExpenseCategory = 'salary' | 'repair' | 'rent' | 'utilities' | 'other';

export interface ExpenseRecord {
  id: string;
  date: string;
  category: ExpenseCategory; // دسته‌بندی هزینه
  title: string;             // عنوان هزینه (مثلا: حقوق اردیبهشت اصغر، تعمیر بخش هیدرولیک پرس، اجاره خرداد)
  amount: number;            // مبلغ (تومان)
  description?: string;      // توضیحات بیشتر (مثلا تفکیک متریال، شماره فاکتور)
}

export interface BankAccount {
  id: string;
  accountNumber: string;
  iban: string;
  bankName: string;
  accountHolder: string;
  ownershipType: "own" | "other";
}

export interface Vehicle {
  id: string;
  plate: string;
}

export interface CustomerRecord {
  id: string;
  name: string;
  phone: string;
  address: string;
  type: 'supplier' | 'buyer' | 'both' | 'driver' | 'service';
  description?: string;
  password?: string; // رمز عبور (پیش‌فرض ۴ رقمی)
  bankAccounts?: BankAccount[];
  vehicles?: Vehicle[];
}

export interface StaffRecord {
  id: string;
  name: string;
  phone: string;
  role: 'admin' | 'staff';
  permissions?: string[];
  forcePasswordChange?: boolean;
  password?: string; // رمز عبور (پیش‌فرض ۴ رقمی)
  bankAccounts?: BankAccount[];
  vehicles?: Vehicle[];
}

// گردش نقدینگی و تراکنش‌های سرمایه
export interface CashTransaction {
  id: string;
  date: string;
  type: 'deposit' | 'withdraw' | 'transfer'; // ورود، خروج، انتقال بین انبار و بازرگانی
  origin: 'warehouse' | 'commercial';        // کدام موجودی
  amount: number;                            // مبلغ (تومان)
  description: string;                       // بابت چیست
}

export interface CustomerPayment {
  id: string;
  customerId: string;
  date: string;
  amount: number;
  status: 'cleared' | 'pending';
  type: 'cash' | 'check' | 'transfer';
  description: string;
}

// ثبت فعالیت ورود و خروج
export interface AuthLog {
  id: string;
  userId: string;
  userName: string;
  role: string;
  action: 'login' | 'logout';
  timestamp: string; // ISO string with time
}

export interface AssetRecord {
  id: string;
  name: string;
  category: 'machinery' | 'tools' | 'office' | 'vehicles' | 'other';
  brand?: string;
  serialNumber?: string;
  purchaseDate: string;
  manufactureYear?: string;
  purchasePrice: number;
  currentValue: number;
  condition: 'new' | 'working' | 'needs_repair' | 'scrapped';
  location: string;
  description?: string;
  assignedTo?: string;
  lastUpdatedDate: string;
}
