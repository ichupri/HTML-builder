const fs = require('fs');
const path = require('path');
const { stdout } = process;

const wayToTextFile = path.join(__dirname, 'text.txt');

const readStream = fs.createReadStream (wayToTextFile);
readStream.on('data', (data) => {
  stdout.write(data);
});