import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { vazirFont } from './vazirBase64';

export const printElement = async (tableId: string, titleText: string, filename: string, action: 'print' | 'pdf' = 'pdf') => {
  if (action === 'print') {
    const originalTitle = document.title;
    document.title = filename;
    window.print();
    document.title = originalTitle;
    return;
  }

  const originalElement = document.getElementById(tableId);
  if (!originalElement) {
    console.error(`Element with id ${tableId} not found.`);
    return;
  }

  const clone = originalElement.cloneNode(true) as HTMLElement;
  const hiddenElements = clone.querySelectorAll('.print\\:hidden');
  hiddenElements.forEach(el => el.parentNode?.removeChild(el));

  clone.removeAttribute('class');
  clone.removeAttribute('className');
  clone.querySelectorAll('*').forEach(el => {
    el.removeAttribute('class');
    el.removeAttribute('className');
  });

  const iframe = document.createElement('iframe');
  iframe.style.position = 'absolute';
  iframe.style.left = '-9999px';
  iframe.style.top = '-9999px';
  iframe.style.width = '1200px';
  // Adjust height automatically based on content?
  iframe.style.height = '1500px'; 
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    document.body.removeChild(iframe);
    return;
  }

  doc.open();
  doc.write(`
    <html dir="rtl">
      <head>
        <meta charset="utf-8">
        <style>
          @font-face {
            font-family: 'VazirmatnPDF';
            src: url('data:font/truetype;charset=utf-8;base64,${vazirFont}') format('truetype');
            font-weight: normal;
            font-style: normal;
          }
          * {
            font-family: 'VazirmatnPDF', sans-serif !important;
          }
          body {
            padding: 20px;
            background-color: #ffffff;
            color: #000000;
          }
          h2 {
            text-align: center;
            margin-bottom: 20px;
            font-size: 20px;
            font-weight: bold;
            color: #000000;
          }
          table {
            width: 100% !important;
            border-collapse: collapse !important;
            margin-top: 10px !important;
          }
          th, td {
            border: 1px solid #1e293b !important;
            padding: 8px !important;
            text-align: center !important;
            color: #000000 !important;
          }
          th {
            background-color: #f1f5f9 !important;
            font-weight: bold !important;
          }
        </style>
      </head>
      <body>
        <div id="pdf-content">
          <h2>${titleText}</h2>
          ${clone.outerHTML}
        </div>
      </body>
    </html>
  `);
  doc.close();

  setTimeout(async () => {
    try {
      // Adjust iframe height to fit content
      const content = doc.getElementById('pdf-content');
      if (content) {
        iframe.style.height = (content.offsetHeight + 100) + 'px';
      }

      const elementToCapture = doc.body;
      const canvas = await html2canvas(elementToCapture, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        // @ts-ignore
        window: iframe.contentWindow as any
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${filename}.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      document.body.removeChild(iframe);
    }
  }, 500);
};

export const exportToPDF = (
  titleText: string,
  headers: string[],
  data: (string | number)[][],
  filename: string
) => {
  const iframe = document.createElement('iframe');
  iframe.style.position = 'absolute';
  iframe.style.left = '-9999px';
  iframe.style.top = '-9999px';
  iframe.style.width = '1200px';
  iframe.style.height = '1500px';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    document.body.removeChild(iframe);
    return;
  }

  const theadHtml = `
    <thead>
      <tr>
        ${headers.map(h => `<th>${h}</th>`).join('')}
      </tr>
    </thead>
  `;
  const tbodyHtml = `
    <tbody>
      ${data.map(row => `
        <tr>
          ${row.map(cell => `<td>${cell}</td>`).join('')}
        </tr>
      `).join('')}
    </tbody>
  `;

  doc.open();
  doc.write(`
    <html dir="rtl">
      <head>
        <meta charset="utf-8">
        <style>
          @font-face {
            font-family: 'VazirmatnPDF';
            src: url('data:font/truetype;charset=utf-8;base64,${vazirFont}') format('truetype');
            font-weight: normal;
            font-style: normal;
          }
          * {
            font-family: 'VazirmatnPDF', sans-serif !important;
          }
          body {
            padding: 20px;
            background-color: #ffffff;
            color: #000000;
          }
          h2 {
            text-align: center;
            margin-bottom: 20px;
            font-size: 20px;
            font-weight: bold;
            color: #000000;
          }
          table {
            width: 100% !important;
            border-collapse: collapse !important;
            margin-top: 10px !important;
          }
          th, td {
            border: 1px solid #1e293b !important;
            padding: 8px !important;
            text-align: center !important;
            color: #000000 !important;
          }
          th {
            background-color: #f1f5f9 !important;
            font-weight: bold !important;
          }
        </style>
      </head>
      <body>
        <div id="pdf-content">
          <h2>${titleText}</h2>
          <table>
            ${theadHtml}
            ${tbodyHtml}
          </table>
        </div>
      </body>
    </html>
  `);
  doc.close();

  setTimeout(async () => {
    try {
      const content = doc.getElementById('pdf-content');
      if (content) {
        iframe.style.height = (content.offsetHeight + 100) + 'px';
      }

      const elementToCapture = doc.body;
      const canvas = await html2canvas(elementToCapture, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        // @ts-ignore
        window: iframe.contentWindow as any
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${filename}.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      document.body.removeChild(iframe);
    }
  }, 500);
};
