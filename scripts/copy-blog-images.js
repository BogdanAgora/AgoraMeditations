const fs = require('fs');
const path = require('path');

// Copy images from src/content/blogposts to public/blogposts
const srcBlogDir = path.join(__dirname, '..', 'src', 'content', 'blogposts');
const publicBlogDir = path.join(__dirname, '..', 'public', 'blogposts');

function copyImages(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) {
    console.log(`Source directory does not exist: ${srcDir}`);
    return;
  }

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const items = fs.readdirSync(srcDir, { withFileTypes: true });
  
  for (const item of items) {
    const srcPath = path.join(srcDir, item.name);
    const destPath = path.join(destDir, item.name);
    
    if (item.isDirectory()) {
      // Recursively process subdirectories
      copyImages(srcPath, destPath);
    } else if (item.isFile() && (item.name.endsWith('.png') || item.name.endsWith('.jpg') || item.name.endsWith('.jpeg'))) {
      // Check if file exists in destination and compare modification times
      if (!fs.existsSync(destPath)) {
        // File doesn't exist in destination, copy it
        fs.copyFileSync(srcPath, destPath);
        console.log(`Copied ${srcPath} to ${destPath}`);
      } else {
        // File exists, check modification times
        const srcStats = fs.statSync(srcPath);
        const destStats = fs.statSync(destPath);
        
        if (srcStats.mtime > destStats.mtime) {
          // Source file is newer, copy it
          fs.copyFileSync(srcPath, destPath);
          console.log(`Updated ${srcPath} to ${destPath}`);
        }
      }
    }
  }
}

console.log('Copying new/updated images from src/content/blogposts to public/blogposts...');
copyImages(srcBlogDir, publicBlogDir);
console.log('Done!');