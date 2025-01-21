const fs = require('fs');
const path = require('path');

const bundleSrc = './05-merge-styles/project-dist/bundle.css';
const stylesSrc = './05-merge-styles/styles';
mergeStyles(stylesSrc, bundleSrc);


fs.rm(bundleSrc, {recursive: true}, () => {
    async function mergeStyles(stylesSrc, bundleSrc) {
        fs.readdir(stylesSrc, {withFileTypes: true}, (err, files) => {
            if (err) console.log('fs.reddir ERROR! ', err);
            files.forEach(file => {
                if (!file.isDirectory()) {
                    const filePath = path.join(stylesSrc, file.name);
                    const fileExt = path.extname(file.name);
                    if (fileExt === '.css') {
                        fs.readFile(filePath, 'utf8', (err, data) => {
                            if (err) {
                              console.log('fs.readFile Error!', err);
                              return;
                            }
                            fs.appendFile(bundleSrc, data, (err) => {
                                  if (err) throw console.log('fsappendFile Error!', err);
                                }
                              );
                          });
                    }
                }
            });
        })
    }
});

//TODO split the code into several functions when I understand asynchrony