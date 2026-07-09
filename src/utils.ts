/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// تبدیل عدد به فرمت ریال با جداکننده سه رقمی
export function formatRials(amount: number): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '۰ ریال';
  return amount.toLocaleString('fa-IR') + ' ریال';
}

// فرمت دهی به وزن به صورت تن یا کیلوگرم
export function formatWeight(weightKg: number): string {
  if (weightKg === undefined || weightKg === null || isNaN(weightKg)) return '۰ کیلوگرم';
  
  if (weightKg >= 1000) {
    const tons = weightKg / 1000;
    // فرمت دهی انگلیسی و تبدیل کل ارقام به فارسی
    const formatted = tons.toLocaleString('fa-IR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 3
    });
    return `${formatted} تن`;
  } else {
    return `${weightKg.toLocaleString('fa-IR')} کیلوگرم`;
  }
}

// تبدیل تاریخ میلادی به تاریخ شمسی ساده برای ذخیره سازی بدون نیاز به بسته‌های سنگین خارجی
export function getTodayDate(): string {
  try {
    const d = new Date();
    const year = new Intl.DateTimeFormat('fa-IR', { year: 'numeric', numberingSystem: 'latn' }).format(d);
    const month = new Intl.DateTimeFormat('fa-IR', { month: '2-digit', numberingSystem: 'latn' }).format(d);
    const day = new Intl.DateTimeFormat('fa-IR', { day: '2-digit', numberingSystem: 'latn' }).format(d);
    return `${year}/${month}/${day}`;
  } catch (e) {
    return '1405/04/17';
  }
}

// تولید پلاک تصادفی نمونه یا معتبرساز پلاک خودروهای ایران برای زیبایی بصری سیستم
export function formatVehiclePlate(plate: string): string {
  return plate || 'ثبت نشده';
}

export function toPersianDigits(str: string): string {
  if (!str) return str;
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.replace(/\d/g, x => persianDigits[parseInt(x)]);
}
