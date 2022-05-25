const fs = require('fs');
const path = require('path');
const { join } = require('path');
const { rm, mkdir, readdir, copyFile } = require('fs/promises');

//make dist
const pathToProjectDist = path.join(__dirname, 'project-dist');

fs.mkdir(pathToProjectDist, { recursive: true }, error => { if (error) throw error; });
fs.mkdir(pathToProjectDist + '\\assets', { recursive: true }, error => { if (error) throw error; });

//build HTML
const pathToComponents = join(__dirname, 'components');

async function buildHtml() {
  let templateHtml = await fs.promises.readFile(join(__dirname, 'template.html'), 'utf-8');
  const elements = await fs.promises.readdir(pathToComponents, { withFileTypes: true });

  for (let element of elements) {
    if (element.isFile()) {
      if (element.name.slice(-5) === '.html') {
        const pathToTarget = join(pathToComponents, element.name);
        const substitution = await fs.promises.readFile(pathToTarget);
        templateHtml = templateHtml.replace(`{{${element.name.slice(0, -5)}}}`, substitution);
      }
    }
  }
  await fs.promises.writeFile(join(pathToProjectDist, 'index.html'), templateHtml);
}

buildHtml();

//merge style
const pathToStyle = path.join(__dirname, 'styles');
const writeStream = fs.createWriteStream(path.join(pathToProjectDist, 'style.css'));

fs.readdir(pathToStyle, { withFileTypes: true }, (error, files) => {
  if (error) { throw error; }
  files = files.reverse();
  for (const file of files) {
    const filepath = path.join(pathToStyle, file.name);
    const parsedFilepath = path.parse(filepath);
    if (file.isFile() && parsedFilepath.ext === '.css') {
      const readStream = fs.createReadStream(filepath);
      readStream.pipe(writeStream);
    }
  }
});


//copy assets
const folder = join(__dirname, 'assets');
const folderCopy = join(__dirname, 'project-dist', 'assets');

async function copyFolder(source, target) {
  try {
    const elements = await readdir(source, { withFileTypes: true });
    for (const element of elements) {
      if (element.isFile()) {
        await copyFile(path.join(source, element.name), path.join(target, element.name));
      } else if (element.isDirectory()) {
        await mkdir(path.join(target, element.name));
        await copyFolder(path.join(source, element.name), path.join(target, element.name));
      }
    }
  } catch (error) {
    console.log(error);
  }
}

(async function () {
  await rm(folderCopy, { recursive: true, force: true });
  await mkdir(folderCopy, { recursive: true });
  copyFolder(folder, folderCopy);
})();