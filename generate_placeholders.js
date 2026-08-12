const fs = require('fs');
const path = require('path');
const dirs = [
  'dashboard', 'dreams', 'insights', 'chat', 'calendar', 'settings', 'dream-universe', 'dream/new', 'dream/[id]'
];
const base = 'c:/Users/Jayant/Desktop/Dream Journal AI/src/app/(dashboard)';
dirs.forEach(d => {
  const dirPath = path.join(base, d);
  fs.mkdirSync(dirPath, { recursive: true });
  fs.writeFileSync(path.join(dirPath, 'page.tsx'), `export default function Page() { return <div className="p-4 bg-[var(--bg-card)] rounded-xl border border-[var(--border-default)] shadow-sm"><h1 className="text-2xl font-bold text-[var(--text-primary)]">${d}</h1><p className="text-[var(--text-secondary)] mt-2">This is a placeholder page.</p></div>; }`);
});
