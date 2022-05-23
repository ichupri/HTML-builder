const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, 'styles');
const targetPath = path.join(__dirname, 'project-dist');
const writeStream = fs.createWriteStream(path.join(targetPath, 'bundle.css'));

fs.readdir(sourcePath, { withFileTypes: true }, (error, files) => {
  if (error) {
    throw error;
  }
  for (const file of files) {
    const filepath = path.join(sourcePath, file.name);
    const parsedFilepath = path.parse(filepath);
    if (file.isFile() && parsedFilepath.ext === '.css') {
      const readStream = fs.createReadStream(filepath);
      readStream.pipe(writeStream);
    }
  }
});