const fs = require('fs');

let content = fs.readFileSync('src/data.ts', 'utf8');

const newGrades = `
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
`;

content = content.replace(/export const INITIAL_SCRAP_GRADES: ScrapGrade\[\] = \[\s*\{[\s\S]*?\n\];/, newGrades.trim());

fs.writeFileSync('src/data.ts', content);
