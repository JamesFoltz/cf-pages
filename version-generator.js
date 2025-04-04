const { execSync } = require('child_process');
const fs = require('fs');

// Get short commit hash
const commitHash = execSync('git rev-parse --short HEAD').toString().trim();

// Update service worker file
const swFile = './sw.js';
let content = fs.readFileSync(swFile, 'utf8');
content = content.replace(/const cacheVersion = ".*?";/, `const cacheVersion = "${commitHash}";`);
fs.writeFileSync(swFile, content);
