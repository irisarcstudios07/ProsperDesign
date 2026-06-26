const fs = require('fs');
const path = require('path');

const publicDirs = [
  path.join(__dirname, 'src', 'components'),
  path.join(__dirname, 'src', 'pages'),
];

const rootFiles = [
  path.join(__dirname, 'src', 'App.tsx'),
  path.join(__dirname, 'src', 'index.css'),
  path.join(__dirname, 'index.html'),
];

const excludeDirs = [
  path.join(__dirname, 'src', 'components', 'admin'),
];

const excludeFiles = [
  path.join(__dirname, 'src', 'pages', 'AdminDashboard.tsx'),
  path.join(__dirname, 'src', 'pages', 'AdminLogin.tsx'),
];

const replacements = [
  { regex: /bg-\[#2A4365\]/g, replacement: 'bg-[#415C84]' },
  { regex: /bg-\[#1A2A40\]/g, replacement: 'bg-[#2A3F5C]' },
  
  // replace exact bg-black and its opacity variants
  { regex: /bg-black(?!\/)/g, replacement: 'bg-[#1D2B42]' },
  { regex: /bg-black\//g, replacement: 'bg-[#1D2B42]/' },

  { regex: /from-black(?!\/)/g, replacement: 'from-[#1D2B42]' },
  { regex: /from-black\//g, replacement: 'from-[#1D2B42]/' },

  { regex: /via-black(?!\/)/g, replacement: 'via-[#1D2B42]' },
  { regex: /via-black\//g, replacement: 'via-[#1D2B42]/' },

  { regex: /to-black(?!\/)/g, replacement: 'to-[#1D2B42]' },
  { regex: /to-black\//g, replacement: 'to-[#1D2B42]/' },

  { regex: /bg-\[#0a0a0a\]/g, replacement: 'bg-[#1D2B42]' },
  { regex: /bg-\[#111\]/g, replacement: 'bg-[#1D2B42]' },
  { regex: /bg-\[#121212\]/g, replacement: 'bg-[#415C84]' },
  { regex: /bg-\[#1a1a1a\]/g, replacement: 'bg-[#2A3F5C]' },
];

function processFile(filePath) {
  if (excludeFiles.includes(filePath)) return;
  for (let exclDir of excludeDirs) {
    if (filePath.startsWith(exclDir)) return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  for (let { regex, replacement } of replacements) {
    content = content.replace(regex, replacement);
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (let file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.css') || fullPath.endsWith('.html')) {
      processFile(fullPath);
    }
  }
}

for (let dir of publicDirs) {
  walkDir(dir);
}

for (let file of rootFiles) {
  if (fs.existsSync(file)) {
    processFile(file);
  }
}

console.log('Theme update complete.');
