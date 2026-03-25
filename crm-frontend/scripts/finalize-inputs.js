const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // text-white to text-theme-text-primary inside elements that have bg-theme-input-bg
  let lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('bg-theme-input-bg')) {
      lines[i] = lines[i].replace(/text-white/g, 'text-theme-text-primary');
      lines[i] = lines[i].replace(/focus:border-primary-500/g, 'focus:border-theme-accent-primary');
    }
  }
  content = lines.join('\n');

  if(content !== original) {
    fs.writeFileSync(filePath, content);
    console.log('Finalized form inputs in', filePath);
  }
}

const files = [
  'src/app/leads/page.js',
  'src/app/customers/page.js',
  'src/app/tasks/page.js',
  'src/app/register/page.js'
];

files.forEach(f => {
  const p = path.resolve(process.cwd(), f);
  if(fs.existsSync(p)) processFile(p);
});
