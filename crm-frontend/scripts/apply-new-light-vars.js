const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Modals
  content = content.replace(/bg-black\/60/g, 'bg-theme-modal-overlay');

  // Buttons
  content = content.replace(/bg-gradient-to-r from-primary-600 to-primary-500/g, 'bg-theme-accent-primary hover:bg-theme-accent-hover');

  // Table Headers
  content = content.replace(/<thead className="([^"]*?border-b[^"]*?)"/g, (match, classes) => {
    let clean = classes.replace('border-b', 'border-b bg-theme-table-header');
    return `<thead className="${clean}"`;
  });

  // Dividers
  content = content.replace(/divide-theme-card-border/g, 'divide-theme-table-divider');

  // Inputs
  if (filePath.includes('customers/page.js') || filePath.includes('leads/page.js') || filePath.includes('tasks/page.js')) {
    content = content.replace(/className="([^"]*?)bg-theme-bg-tertiary([^"]*?) text-sm text-theme-text-primary/g, 'className="$1bg-theme-input-bg$2 text-sm text-theme-text-primary');
    content = content.replace(/bg-dark-800\/50/g, 'bg-theme-input-bg'); // tasks modal input fallback
  }

  // Admin Dashboard - specifically input there
  if (filePath.includes('admin/dashboard/page.js')) {
     content = content.replace(/bg-dark-800\/50/g, 'bg-theme-input-bg');
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log('Processed', filePath);
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
