const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

const newMethods = `
  const handleAddGrade = (gradeData: Omit<ScrapGrade, 'id'>) => {
    const newGrade: ScrapGrade = {
      ...gradeData,
      id: \`grade-\${Date.now()}\`
    };
    setState(prev => ({
      ...prev,
      grades: [...prev.grades, newGrade]
    }));
  };

  const handleUpdateGrade = (updatedGrade: ScrapGrade) => {
    setState(prev => ({
      ...prev,
      grades: prev.grades.map(g => g.id === updatedGrade.id ? updatedGrade : g)
    }));
  };

  const handleAddCustomer =`;

content = content.replace(/const handleAddCustomer =/, newMethods);

fs.writeFileSync('src/App.tsx', content);
