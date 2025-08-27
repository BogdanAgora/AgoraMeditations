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

// Add dates to blog posts if they don't have them
function addDatesToPosts() {
  const matter = require('gray-matter');
  
  if (!fs.existsSync(srcBlogDir)) {
    console.log(`Source directory does not exist: ${srcBlogDir}`);
    return;
  }

  const directories = fs.readdirSync(srcBlogDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  directories.forEach(dir => {
    const dirPath = path.join(srcBlogDir, dir);
    const files = fs.readdirSync(dirPath);
    
    const markdownFile = files.find(file => file.endsWith('.md') || file.endsWith('.mdx'));
    
    if (markdownFile) {
      const markdownPath = path.join(dirPath, markdownFile);
      
      // Read the file
      const fileContents = fs.readFileSync(markdownPath, 'utf8');
      
      // Parse frontmatter
      const { data, content } = matter(fileContents);
      
      // If no date is set, use the file's birthtime
      if (!data.date) {
        const fileStats = fs.statSync(markdownPath);
        const fileCreationDate = fileStats.birthtime;
        
        // Format date as YYYY-MM-DD
        const formattedDate = fileCreationDate.toISOString().split('T')[0];
        
        // Add date to frontmatter
        data.date = formattedDate;
        
        // Rebuild the file with new frontmatter
        const updatedContent = matter.stringify(content, data);
        
        // Write back to file
        fs.writeFileSync(markdownPath, updatedContent);
        
        console.log(`Added date ${formattedDate} to ${dir}/${markdownFile}`);
      }
    }
  });
}

console.log('Adding dates to blog posts...');
addDatesToPosts();

console.log('Copying new/updated images from src/content/blogposts to public/blogposts...');
copyImages(srcBlogDir, publicBlogDir);
console.log('Done!');