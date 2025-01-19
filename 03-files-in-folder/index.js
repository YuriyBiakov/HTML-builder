const fs = require('fs');
const path = require('path');
const secretFolderPath = './03-files-in-folder/secret-folder';

fs.readdir(secretFolderPath, {withFileTypes: true}, (err, files) => {
    if (err) console.log('fs.reddir ERROR! ', err);
    console.log(`The folder '03-files-in-folder/secret-folder' contains files:`);

    files.forEach(file => {
        if (!file.isDirectory()) {
            const filePath = path.join(secretFolderPath, file.name);
            fs.stat(filePath, (err, stats) => {
                if (err) console.log('fs.stat ERROR! ', err);
                const fileFullName = file.name;
                const fileExt = path.extname(fileFullName);
                const consoleFileExt = fileExt.slice(1);
                const fileName = path.basename(fileFullName, fileExt);
                const fileSize = stats.size/1000;
                console.log(`${fileName} - ${consoleFileExt} - ${fileSize}kB`);
            })
        }
    });
})
