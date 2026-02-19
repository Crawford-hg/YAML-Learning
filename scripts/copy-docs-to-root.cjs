/**
 * After building with outputPath "docs", Angular puts index.html in docs/browser/.
 * GitHub Pages expects index.html at docs/. This script copies docs/browser/* to docs/
 * and removes docs/browser so the site root is correct.
 */
const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '..', 'docs');
const browserDir = path.join(docsDir, 'browser');

if (!fs.existsSync(browserDir)) {
  console.warn('scripts/copy-docs-to-root.cjs: docs/browser not found (run ng build --configuration githubPages first)');
  process.exit(0);
}

const entries = fs.readdirSync(browserDir, { withFileTypes: true });
for (const ent of entries) {
  const src = path.join(browserDir, ent.name);
  const dest = path.join(docsDir, ent.name);
  if (ent.isFile()) {
    fs.copyFileSync(src, dest);
  } else if (ent.isDirectory()) {
    copyRecursive(src, dest);
  }
}

function copyRecursive(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const ent of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, ent.name);
    const d = path.join(dest, ent.name);
    if (ent.isFile()) fs.copyFileSync(s, d);
    else copyRecursive(s, d);
  }
}

// Remove docs/browser so we don't have duplicate content
fs.rmSync(browserDir, { recursive: true });
console.log('Copied docs/browser to docs/ for GitHub Pages.');
