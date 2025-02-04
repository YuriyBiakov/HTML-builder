const fs = require('fs');
const path = require('path');
const copiedFolderPath = './04-copy-directory/files';
const targetFolderPath = './04-copy-directory/files-copy';
const fsPromises = fs.promises; 

async function copyDir(outputFolderSrc, targetSrc) {
    const folder = await createDir(targetSrc);

    fs.readdir(outputFolderSrc, {withFileTypes: true}, (err, files) => {
        if (err) console.log('fs.reddir ERROR! ', err);
        files.forEach(file => {
            if (file.isDirectory()) {
                const currentFolderPath = path.join(outputFolderSrc, file.name);
                const newFolderPath = path.join(targetSrc, file.name);
                copyDir(currentFolderPath, newFolderPath);
            }
            else {
                const currentFilePath = path.join(outputFolderSrc, file.name);
                const newFilePath = path.join(targetSrc, file.name);
                fs.copyFile(currentFilePath, newFilePath, (err) => {
                    if (err) {
                        console.log("fs.copyFile Error!!!", err);
                    }
            });
            }
        });
    })
}
async function createDir(newFolderPath) {
    fsPromises.mkdir(newFolderPath, { recursive: true });
}

copyDir(copiedFolderPath, targetFolderPath);

