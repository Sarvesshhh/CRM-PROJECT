const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Labels: text-dark-300 or text-dark-400 to text-theme-text-secondary
  content = content.replace(/text-dark-300/g, 'text-theme-text-secondary');
  content = content.replace(/text-dark-400/g, 'text-theme-text-secondary');
  content = content.replace(/text-dark-500/g, 'text-theme-text-muted');

  // Input backgrounds logic
  content = content.replace(/bg-dark-800\/50/g, 'bg-theme-input-bg');
  
  // Borders
  content = content.replace(/border-white\/10/g, 'border-theme-card-border');
  content = content.replace(/border-white\/5/g, 'border-theme-card-border');
  
  // Placeholder text
  content = content.replace(/placeholder:text-dark-500/g, 'placeholder:text-theme-text-muted');

  // Cancel buttons logic
  content = content.replace(/hover:bg-white\/5/g, 'hover:bg-theme-bg-secondary');
  content = content.replace(/hover:text-white/g, 'hover:text-theme-text-primary');

  // Any remaining generic white texts in labels/spans inside inputs? 
  // No, shouldn't touch globally.

  if(content !== original) {
    fs.writeFileSync(filePath, content);
    console.log('Fixed Form styles in', filePath);
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
