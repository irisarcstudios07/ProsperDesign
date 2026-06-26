const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  // Replace the old dark theme colors with the new blue theme colors
  content = content.replace(/#121212/gi, '#2A4365');
  content = content.replace(/#1a1a1a/gi, '#1A2A40');
  // Handle any other variations if they exist, but the above cover the grep output
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated:', filePath);
  }
}

function traverseDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverseDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.css') || fullPath.endsWith('.js')) {
      replaceInFile(fullPath);
    }
  });
}

traverseDirectory(directoryPath);
console.log('Color replacement complete.');
