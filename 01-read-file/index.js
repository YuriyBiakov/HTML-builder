const fs = require('fs');
const readStream = fs.createReadStream('./01-read-file/text.txt', 'utf-8');
let data = '';
readStream.on('data', (dataPart) => (data += dataPart));
readStream.on('end', () => console.log(data));
readStream.on('error', (error) => console.log('Error', error.message));
