const fs = require('fs');

let content = fs.readFileSync('src/app/globals.css', 'utf8');

// The Windows echo >> command appends UTF-16LE, which shows up as \0 (null bytes) when read as UTF-8.
let badIndex = content.indexOf('\0');
if (badIndex !== -1) {
  // Find the last valid closing brace before the corrupted text
  let trimIndex = content.lastIndexOf('}', badIndex) + 1;
  content = content.slice(0, trimIndex);
}

// Ensure the toggle hover state is cleanly mapped
content = content.replace(/\.sidebar-toggle-btn:hover\s*\{[^}]*\}/, `.sidebar-toggle-btn:hover {
  background: var(--theme-bg-tertiary);
  color: var(--theme-text-primary);
  transform: scale(1.05);
}`);

content += `\n
/* Custom Select Chevron */
select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239B8EC4' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.75rem center;
  background-repeat: no-repeat;
  background-size: 1.2em 1.2em;
}
.dark select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%237A7A8C' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
}
`;

fs.writeFileSync('src/app/globals.css', content);
console.log('Fixed globals.css encoding');
