const fs = require('fs').promises;
const path = require('path');

async function mergeStyles() {
  const stylesDir = path.join(__dirname, 'styles');
  const outputDir = path.join(__dirname, 'project-dist');
  const outputFile = path.join(outputDir, 'bundle.css');

  try {
    await fs.mkdir(outputDir, { recursive: true });
    const files = await fs.readdir(stylesDir);

    const cssFiles = files.filter((file) => path.extname(file) === '.css');
    const cssContents = [];

    for (const file of cssFiles) {
      const filePath = path.join(stylesDir, file);
      const stats = await fs.stat(filePath);

      if (stats.isFile()) {
        const content = await fs.readFile(filePath, 'utf8');
        cssContents.push(content);
      }
    }

    await fs.writeFile(outputFile, cssContents.join('\n'));
  } catch (error) {
    console.error('Error merging styles:', error);
  }
}

mergeStyles();
