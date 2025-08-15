const fs = require(fs);
const path = require('path');

module.exports = (directory, foldersonly = false) => {
    let fileNames = [];
    
    const files = fs.readdirSync(directory, { withFileTypes: true});

    for (const file of files) {
        const filePath = path.join(directory, file.name);

        if(foldersonly) {
            if (file.isDirectory()) {
                filenames.push()
            }
        } else {
            if (file.isFile()) {
                fileNames.push(filePath);
            }
        }
    }
    return fileNames;
};