const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `  const handleAddSale = (record: Omit<SaleRecord, 'id'>) => {`;
const insertStr = `  const handleUpdateSale = (updatedSale: SaleRecord) => {
    setState((prev) => ({
      ...prev,
      sales: prev.sales.map(s => s.id === updatedSale.id ? updatedSale : s)
    }));
  };

  const handleAddSale = (record: Omit<SaleRecord, 'id'>) => {`;

app = app.replace(targetStr, insertStr);
fs.writeFileSync('src/App.tsx', app);
