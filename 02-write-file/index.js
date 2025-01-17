const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

stdout.write('Input your data and press "ctrl+c" OR type "exit" for EXIT\n');
let yourFilePath = path.join(__dirname, 'your-data.txt');
const writeStream = fs.createWriteStream(yourFilePath);

stdin.on('data', (chunk) => {
  const string = chunk.toString();
  const trimString = string.trim();

  if (trimString === 'exit') {
    writeStream.close();
    console.log('Your data saved! Bye!');
    process.exit();
  } else {
    writeStream.write(chunk);
  }
});

process.on('SIGINT', () => {
  writeStream.close();
  console.log('Your data saved! Bye!');
  process.exit();
});
