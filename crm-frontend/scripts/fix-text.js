const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content
    .replace(/(<h[1-6][^>]*?)text-white([^>]*?>)/g, '$1text-theme-text-primary$2')
    .replace(/(<p[^>]*?)text-white([^>]*?>)/g, '$1text-theme-text-primary$2')
    .replace(/(<td[^>]*?)text-white([^>]*?>)/g, '$1text-theme-text-primary$2')
    .replace(/(<span[^>]*?)text-white([^>]*?>)/g, '$1text-theme-text-primary$2')
    .replace(/(<div[^>]*?)text-white([^>]*?>)/g, '$1text-theme-text-primary$2')
    .replace(/text-dark-400/g, 'text-theme-text-muted')
    .replace(/text-dark-300/g, 'text-theme-text-secondary')
    .replace(/text-dark-500/g, 'text-theme-text-muted')
    .replace(/border-white\/5/g, 'border-theme-card-border')
    .replace(/border-white\/10/g, 'border-theme-card-border')
    .replace(/divide-white\/5/g, 'divide-theme-card-border');
    
  if(content !== newContent) {
    fs.writeFileSync(filePath, newContent);
    console.log('Fixed', filePath);
  }
}

const files = [
  'src/app/dashboard/page.js',
  'src/app/admin/dashboard/page.js',
  'src/app/leads/page.js',
  'src/app/customers/page.js',
  'src/app/tasks/page.js',
  'src/app/register/page.js',
  'src/components/Modal.js'
];

files.forEach(f => {
  const p = path.resolve(process.cwd(), f);
  if(fs.existsSync(p)) processFile(p);
});
