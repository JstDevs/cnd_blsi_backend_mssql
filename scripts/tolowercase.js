const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, '../models');

fs.readdir(modelsDir, (err, files) => {
  if (err) return console.error('❌ Failed to read directory:', err);

  files.forEach(file => {
    if (!file.endsWith('.js')) return;

    const filePath = path.join(modelsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Regex to match tableName: 'AnythingHere'
    const updatedContent = content.replace(
      /tableName:\s*['"`]([^'"`]+)['"`]/,
      (match, p1) => `tableName: '${p1.toLowerCase()}'`
    );

    if (content !== updatedContent) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`✅ Updated tableName in: ${file}`);
    } else {
      console.log(`ℹ️ Skipped (no change needed): ${file}`);
    }
  });
});
