const fs = require('fs');
const path = require('path');
const { stdin, stdout, exit } = process;

const wayToTextFile = path.join(__dirname, 'text.txt');
const writeStream = fs.createWriteStream(wayToTextFile);

stdout.write('Hello!\nPlease, enter something\n');
stdin.on('data', data => {
  if (data.toString().trim() === 'exit') {
    exit();
  }
  writeStream.write(data.toString());
});

process.on('exit', () => stdout.write('\nBye!'));
process.on('SIGINT', exit);