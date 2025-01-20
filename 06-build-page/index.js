const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;

const templatePath = '06-build-page/template.html';
const projectPath = '06-build-page/project-dist';
const outputStylesSrc = '06-build-page/styles';
const styleBundleSrc = '06-build-page/project-dist/style.css';
const outputAssetsSrc = '06-build-page/assets';
const projectAssetsSrc = '06-build-page/project-dist/assets';
const projectHTMLSrc = '06-build-page/project-dist/index.html';
const componentsPath = '06-build-page/components';

async function copyFile(outputSrc, inputSrc) {
    fs.copyFile(outputSrc, inputSrc, (err) => {
        if (err) {
            console.log("fs.copyFile Error!", err);
        }
        else {
            return;
        }
    });
}

async function createDir(newFolderPath) {
    fsPromises.mkdir(newFolderPath, { recursive: true });
}

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

async function replaceTemplates() {
    const header = '{{header}}';
    const articles = '{{articles}}';
    const about = '{{about}}';
    const footer = '{{footer}}';
    const readStream = fs.createReadStream(templatePath, 'utf-8');
    let teamplateData = '';
    readStream.on('data', (tpdataPart) => (teamplateData += tpdataPart));
    readStream.on('end', () => {
        // console.log('data is ', teamplateData);
        const sectionsArray = teamplateData.match(/\{\{[a-z]+\}\}/gim);
        // console.log('sections is ', sectionsArray);
    
    for (let i = 0; i < sectionsArray.length; i++) {
        const currentEl = sectionsArray[i];
        const sectionName = currentEl.slice(2, currentEl.length - 2);
        // console.log('93 - ', sectionName);
        // console.log('94 - ', currentEl);
        const sectionFileSrc = `06-build-page/components/${sectionName}.html`;
        const forReadStream = fs.createReadStream(sectionFileSrc, 'utf-8');
        let forData = '';
        forReadStream.on('data', (forDataPart) => (forData += forDataPart));
        forReadStream.on('end', () => {
            teamplateData = teamplateData.replace(currentEl, forData);
        })
    }
    console.log('103 htmlData is ', teamplateData);
    });
    await fs.promises.appendFile(projectHTMLSrc, teamplateData, (err) => {
        if (err) throw console.log('fsappendFile Error!', err);
    });
    readStream.on('error', (error) => console.log('Error', error.message));
}

async function init() {
    const folder = await createDir(projectPath);
    const styles = await mergeStyles(outputStylesSrc, styleBundleSrc);
    const assets = await copyDir(outputAssetsSrc, projectAssetsSrc);
    // const indexFile = await copyFile(templatePath, projectHTMLSrc);
    const replace = await replaceTemplates();
}


init();