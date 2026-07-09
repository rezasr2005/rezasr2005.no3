const fs = require('fs');

let content = fs.readFileSync('src/components/DashboardTab.tsx', 'utf8');

content = content.replace(/interface DashboardTabProps \{/, `interface DashboardTabProps {
  onUpdateGrade?: (grade: ScrapGrade) => void;
  onAddGrade?: (grade: Omit<ScrapGrade, 'id'>) => void;`);

content = content.replace(/export default function DashboardTab\(\{[\s\S]*?\}\) \{/, `export default function DashboardTab({
  currentUser,
  grades,
  purchases,
  sales,
  expenses,
  transactions,
  onUpdateGrade,
  onAddGrade
}: DashboardTabProps) {`);

fs.writeFileSync('src/components/DashboardTab.tsx', content);
