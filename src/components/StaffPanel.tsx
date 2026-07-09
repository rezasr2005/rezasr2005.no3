import React, { useState } from 'react';
import { StaffRecord } from '../types';
import { Calendar, ClipboardList, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface StaffPanelProps {
  currentUser: StaffRecord;
}

export default function StaffPanel({ currentUser }: StaffPanelProps) {
  const [tasks] = useState([
    { id: 1, text: 'نظافت محوطه باسکول', completed: true },
    { id: 2, text: 'تفکیک بارهای درهم و ضایعات سوپر ویژه', completed: false },
    { id: 3, text: 'روغن‌کاری پرس ضایعات', completed: false },
    { id: 4, text: 'ثبت پلاک خودروهای ورودی جدید', completed: false },
  ]);

  const [notes, setNotes] = useState('');

  const today = new Date();
  const isThursday = today.getDay() === 4; // 4 is Thursday in JS (0=Sun, 1=Mon, ..., 4=Thu)

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto pb-20">
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl"></div>
        <h2 className="text-xl font-black flex items-center gap-2 mb-2 relative z-10">
          <Calendar className="w-6 h-6 text-amber-500" />
          پنل وظایف روزانه پرسنل
        </h2>
        <p className="text-slate-300 text-sm relative z-10">
          همکار گرامی {currentUser.name}، وظایف زیر جهت انجام به شما محول شده است.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <ClipboardList className="w-5 h-5 text-amber-500" />
            لیست وظایف امروز
          </h3>
          <div className="space-y-3">
            {tasks.map(task => (
              <label key={task.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                <input type="checkbox" defaultChecked={task.completed} className="mt-1 w-4 h-4 text-amber-600 focus:ring-amber-500" />
                <span className={`text-sm font-semibold ${task.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                  {task.text}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <Clock className="w-5 h-5 text-blue-500" />
            فرم عملکرد و گزارش کار
          </h3>
          
          {isThursday && (
            <div className="mb-4 bg-purple-50 border border-purple-100 p-4 rounded-xl flex gap-3">
              <AlertCircle className="w-5 h-5 text-purple-600 shrink-0" />
              <div>
                <h4 className="font-bold text-purple-800 text-sm mb-1">شیفت گردشی پنجشنبه</h4>
                <p className="text-xs text-purple-600">امروز پنجشنبه است. لطفاً شیفت کاری خود را (صبح/عصر) در گزارش درج نمایید.</p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">گزارش روزانه و موارد خاص</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={4}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder="توضیحات عملکرد..."
              ></textarea>
            </div>
            <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm transition-colors flex justify-center items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              ثبت نهایی گزارش عملکرد
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
