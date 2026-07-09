const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

if (!code.includes('AssetRecord')) {
  code += `
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
`;
  fs.writeFileSync('src/types.ts', code);
}
