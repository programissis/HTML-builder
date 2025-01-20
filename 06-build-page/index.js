const fs = require('fs').promises;
const path = require('path');

async function createDir(dirPath) {
  try {
    await fs.rm(dirPath, { recursive: true, force: true });
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    console.error('Error creating directory:', error);
  }
}

async function processTemplate() {
  try {
    const templateContent = await fs.readFile(
      path.join(__dirname, 'template.html'),
      'utf-8',
    );
    const componentsDir = path.join(__dirname, 'components');
    const componentFiles = await fs.readdir(componentsDir);

    let resultHtml = templateContent;
    for (const file of componentFiles) {
      if (path.extname(file) === '.html') {
        const componentName = path.basename(file, '.html');
        const componentContent = await fs.readFile(
          path.join(componentsDir, file),
          'utf-8',
        );
        resultHtml = resultHtml.replace(
          new RegExp(`{{${componentName}}}`, 'g'),
          componentContent,
        );
      }
    }

    await fs.writeFile(
      path.join(__dirname, 'project-dist', 'index.html'),
      resultHtml,
    );
  } catch (error) {
    console.error('Error processing template:', error);
  }
}

async function compileStyles() {
  try {
    const stylesDir = path.join(__dirname, 'styles');
    const files = await fs.readdir(stylesDir);
    let compiledStyles = '';

    for (const file of files) {
      if (path.extname(file) === '.css') {
        const content = await fs.readFile(path.join(stylesDir, file), 'utf-8');
        compiledStyles += content + '\n';
      }
    }

    await fs.writeFile(
      path.join(__dirname, 'project-dist', 'style.css'),
      compiledStyles,
    );
  } catch (error) {
    console.error('Error compiling styles:', error);
  }
}

async function copyAssets(src, dest) {
  try {
    const entries = await fs.readdir(src, { withFileTypes: true });
    await fs.mkdir(dest, { recursive: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        await copyAssets(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  } catch (error) {
    console.error('Error copying assets:', error);
  }
}

async function buildProject() {
  const distDir = path.join(__dirname, 'project-dist');
  await createDir(distDir);
  await Promise.all([
    processTemplate(),
    compileStyles(),
    copyAssets(path.join(__dirname, 'assets'), path.join(distDir, 'assets')),
  ]);
}

buildProject().catch(console.error);
