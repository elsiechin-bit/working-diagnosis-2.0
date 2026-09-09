const fs = require('fs');
const path = require('path');

function fixYamlTitles(dir) {
  const files = fs.readdirSync(dir, { recursive: true });
  
  files.forEach(file => {
    if (file.endsWith('.md')) {
      const filePath = path.join(dir, file);
      let content = fs.readFileSync(filePath, 'utf-8');
      
      // Fix titles with colons (quote them if not already quoted)
      content = content.replace(/^title: ([^"\n]*:[^\n]*)$/gm, 'title: "$1"');
      
      fs.writeFileSync(filePath, content);
      console.log(`Fixed: ${filePath}`);
    }
  });
}

fixYamlTitles('src/content');
console.log('Done!');