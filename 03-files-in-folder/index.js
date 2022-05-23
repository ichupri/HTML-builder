const fs = require('fs');
const path = require('path');
const { readdir, stat } = require('fs/promises');

const pathToFolder = path.join(__dirname, 'secret-folder');

async function readFolderItem(folder) {
  try {
    const files = await readdir(folder, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile()) {
        const element = await stat(path.join(folder, file.name));
        const elementSize = element.size / 1024;
        console.log(`${path.parse(file.name).name} - ${path.extname(file.name).slice(1)} - ${elementSize.toFixed(3)}kb`);
      }
    }
  } catch (error) {
    console.log(`Error: ${error.message}\n`);
  }
}

readFolderItem(pathToFolder);