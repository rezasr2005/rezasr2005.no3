import React from 'react';
import Logo from './Logo';
import {
  MapPin,
  Globe,
  User,
  Phone,
  Building2,
} from 'lucide-react';

export default function AboutUsTab() {
  return (
    <div className="space-y-6 text-right">
      {/* بخش هدر صفحه */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 text-white p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="space-y-1.5 relative z-10">
          <h2 className="text-xl sm:text-2xl font-black text-amber-400 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-amber-500" />
            <span>درباره ما</span>
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm">
            معرفی هلدینگ کاویان سپنتا و اهداف تحول دیجیتال
          </p>
        </div>
        <div className="absolute top-1/2 left-6 sm:left-12 -translate-y-1/2 opacity-10 pointer-events-none">
          <Building2 className="w-32 h-32 text-amber-500" />
        </div>
      </div>

      {/* بخش بدنه درباره ما */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm relative overflow-hidden">
        {/* هدر بخش همراه با لوگو در گوشه بالا سمت چپ */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-6 bg-amber-500 rounded-full"></span>
              <h3 className="font-black text-slate-800 text-lg">معرفی هلدینگ کاویان سپنتا</h3>
            </div>
            <p className="text-slate-400 text-xs">فراتر از زنجیره تأمین؛ ما آینده صنعت را هوشمند می‌کنیم.</p>
          </div>
          <div className="absolute top-0 left-0 sm:relative sm:top-auto sm:left-auto shrink-0 bg-slate-50 p-2 rounded-2xl border border-slate-150 shadow-sm">
            <Logo className="w-16 h-16 sm:w-20 sm:h-20" />
          </div>
        </div>

        <div className="space-y-6 relative z-10 text-slate-700 text-xs sm:text-sm leading-relaxed max-w-4xl text-justify">
          <p className="font-extrabold text-slate-900 text-sm sm:text-base border-r-2 border-amber-500 pr-3 my-4">
            تحول هوشمند در زنجیره ارزش متالورژی و فرآوری فلزات کشور
          </p>
          <p>
            فولاد کاویان سپنتا به عنوان یکی از مجموعه‌های پیشرو در صنعت فولاد و بازیافت، فعالیت خود را با هدف ایجاد ارزش‌افزوده، بازمهندسی زنجیره تأمین و بهینهسازی فرآوری متالورژی آغاز کرد. اما نگاه ما هیچگاه به مرزهای سنتی این صنعت محدود نماند.
          </p>
          <p>
            ما چالش‌های بزرگِ عدم شفافیت، کندی فرآیندهای بازرگانی و هدررفت منابع در صنایع مادر را شناختیم و پاسخ را در «تحول دیجیتال» یافتیم. امروز، با تکیه بر استقرار موفق سیستم یکپارچه ERP و اتوماسیون‌های صنعتی پیشرفته در تمامی ساختارهای فنی و بازرگانی خود، نه تنها یک تأمین‌کننده پایدار، بلکه به بازوی هوشمندسازی و مشاور ارشد دیگر بنگاه‌های صنعتی کشور در مسیر دیجیتالی‌شدن تبدیل شده‌ایم.
          </p>

          {/* اهداف کلیدی */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl flex gap-3 items-start text-right">
              <span className="bg-amber-100 text-amber-700 p-1.5 rounded-lg font-bold text-xs shrink-0">۱</span>
              <span className="font-bold text-slate-800 text-xs leading-relaxed">توسعه بومی زیرساخت‌های یکپارچه سازمانی (ERP) برای صنایع بالادستی.</span>
            </div>
            <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl flex gap-3 items-start text-right">
              <span className="bg-amber-100 text-amber-700 p-1.5 rounded-lg font-bold text-xs shrink-0">۲</span>
              <span className="font-bold text-slate-800 text-xs leading-relaxed">مدیریت چندین سایت عملیاتی و فرآوری فعال در مناطق استراتژیک صنعتی تهران.</span>
            </div>
            <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl flex gap-3 items-start text-right">
              <span className="bg-amber-100 text-amber-700 p-1.5 rounded-lg font-bold text-xs shrink-0">۳</span>
              <span className="font-bold text-slate-800 text-xs leading-relaxed">پوشش کامل زنجیره ارزش از تأمین و فرآوری مکانیزه تا توزیع لجستیک هوشمند.</span>
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl text-xs font-bold text-amber-900 leading-normal">
            💡 این نرم‌افزار توسط تیم فنی و پردازش ایده هلدینگ کاویان سپنتا در تابستان سال ۱۴۰۵ طراحی و اجرا شده است.
          </div>
        </div>

        {/* بخش اطلاعات تماس و شناسنامه */}
        <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 text-right">
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-slate-100 p-2 rounded-xl text-slate-600 shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 font-bold">آدرس دفتر مرکزی:</span>
                <span className="text-xs sm:text-sm font-bold text-slate-800 leading-normal">
                  ایران - تهران - پاسداران - حصار بوعلی - مجتمع تجاری و اداری حیات سبز - بلوک A - طبقه ۸ - واحد ۸۰۸
                </span>
                <span className="block text-[10px] text-amber-600 font-extrabold mt-1">
                  📍 در تمامی مسیریاب‌های داخلی و خارجی «فولاد کاویان سپنتا» را جستجو نمایید.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-slate-100 p-2 rounded-xl text-slate-600 shrink-0">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 font-bold">وب‌سایت رسمی:</span>
                <a 
                  href="https://Fooladkaviansepanta.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-xs sm:text-sm font-bold text-blue-600 hover:underline font-mono"
                >
                  Fooladkaviansepanta.com
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-slate-100 p-2 rounded-xl text-slate-600 shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 font-bold">مدیر عامل و طراح نرم‌افزار:</span>
                <span className="text-xs sm:text-sm font-black text-slate-800">مهندس رضا وظیفه</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-slate-100 p-2 rounded-xl text-slate-600 shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 font-bold">تلفن‌های تماس مستقیم:</span>
                <div className="flex flex-col gap-1 mt-1">
                  <span className="text-xs sm:text-sm font-bold font-mono text-slate-750">۰۹۱۹۱۲۲۲۷۶۱</span>
                  <span className="text-xs sm:text-sm font-bold font-mono text-slate-750">۰۹۱۹۱۲۲۲۷۶۲</span>
                  <span className="text-xs sm:text-sm font-bold font-mono text-slate-750">۰۹۱۹۱۲۲۲۷۶۳</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* دکوراسیون پس‌زمینه */}
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl"></div>
      </div>
    </div>
  );
}
