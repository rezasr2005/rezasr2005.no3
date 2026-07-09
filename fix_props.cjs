const fs = require('fs');

let content = fs.readFileSync('src/components/DashboardTab.tsx', 'utf8');

content = content.replace(/export default function DashboardTab\(\{[\s\S]*?\}\: DashboardTabProps\) \{/, `export default function DashboardTab({
  currentUser,
  grades,
  purchases,
  sales,
  expenses: initialExpenses,
  transactions,
  onUpdateGrade,
  onAddGrade
}: DashboardTabProps) {`);

fs.writeFileSync('src/components/DashboardTab.tsx', content);
