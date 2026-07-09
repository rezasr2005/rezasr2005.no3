import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('نسخه جدیدی از برنامه در دسترس است. آیا مایل به بروزرسانی هستید؟')) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log('برنامه برای استفاده آفلاین آماده است.');
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
