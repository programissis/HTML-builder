const fs = require('fs/promises');
const path = require('path');

async function copyDir() {
  const sourceDir = path.join(__dirname, 'files');
  const targetDir = path.join(__dirname, 'files-copy');

  try {
    await fs.rm(targetDir, { recursive: true, force: true });
    await fs.mkdir(targetDir, { recursive: true });
    await copyRecursive(sourceDir, targetDir);
  } catch (error) {
    console.error('Error copying directory:', error);
  }
}

async function copyRecursive(source, target) {
  const items = await fs.readdir(source);

  for (const item of items) {
    const sourcePath = path.join(source, item);
    const targetPath = path.join(target, item);

    const stats = await fs.stat(sourcePath);

    if (stats.isDirectory()) {
      await fs.mkdir(targetPath, { recursive: true });
      await copyRecursive(sourcePath, targetPath);
    } else {
      await fs.copyFile(sourcePath, targetPath);
    }
  }
}

copyDir();
