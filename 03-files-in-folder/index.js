const fs = require('fs/promises');
const path = require('path');

async function displayFileInfo() {
  try {
    const folderPath = path.join(__dirname, 'secret-folder');
    const files = await fs.readdir(folderPath, { withFileTypes: true });

    for (const file of files) {
      if (file.isFile()) {
        const filePath = path.join(folderPath, file.name);
        const stats = await fs.stat(filePath);
        const fileExt = path.extname(file.name).slice(1);
        const fileName = path.basename(file.name, `.${fileExt}`);

        console.log(`${fileName} - ${fileExt} - ${stats.size}b`);
      }
    }
  } catch (error) {
    console.error('Error reading folder:', error);
  }
}

displayFileInfo();
