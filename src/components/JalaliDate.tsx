import React from 'react';
import { toPersianDigits } from '../utils';

interface JalaliDateProps {
  date: string | number | Date;
  /**
   * تنظیمات فرمت نمایش تاریخ
   * @default { year: 'numeric', month: '2-digit', day: '2-digit' }
   */
  formatOptions?: Intl.DateTimeFormatOptions;
  className?: string;
}

export default function JalaliDate({ 
  date, 
  formatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' },
  className 
}: JalaliDateProps) {
  if (!date) return null;

  try {
    const dateStr = String(date).trim();
    
    // بررسی اینکه تاریخ از قبل شمسی است یا خیر (مثلا شروع شونده با ۱۳ یا ۱۴)
    if (/^(13|14)\d{2}[\/\-]\d{2}[\/\-]\d{2}/.test(dateStr)) {
      return <span className={className}>{toPersianDigits(dateStr)}</span>;
    }

    const dateObj = new Date(date);
    
    // بررسی معتبر بودن تاریخ
    if (isNaN(dateObj.getTime())) {
      return <span className={className}>{toPersianDigits(dateStr)}</span>;
    }

    const formatter = new Intl.DateTimeFormat('fa-IR', formatOptions);
    return <span className={className}>{formatter.format(dateObj)}</span>;
  } catch (error) {
    return <span className={className}>{toPersianDigits(String(date))}</span>;
  }
}
