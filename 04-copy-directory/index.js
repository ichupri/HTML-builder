const { join } = require('path');
const { rm, mkdir, readdir, copyFile } = require('fs/promises');

const folder = join(__dirname, 'files');
const folderCopy = join(__dirname, 'files-copy');

async function copyFolder() {
  await rm(folderCopy, { recursive: true, force: true });
  mkdir(folderCopy, { recursive: true });
  try {
    const elements = await readdir(folder);
    for (const element of elements) {
      const el = join(folder, element);
      const copyEl = join(folderCopy, element);
      await copyFile(el, copyEl);
    }
  } catch (error) {
    console.log(error);
  }
}

copyFolder();