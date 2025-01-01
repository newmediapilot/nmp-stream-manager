const fs = require('fs');
const path = require('path');
const {sync: globSync} = require('glob');
const windowsPath = 'C:\\ProgramData\\certify\\assets\\api.dbdbdbdbdbgroup.com';
const normalizedPath = path.normalize(windowsPath);
const pfx = globSync(`${normalizedPath}/*.pfx`)
    .map(filePath => ({
        path: filePath,
        mtime: fs.statSync(filePath).mtime
    }))
    .sort((a, b) => a.mtime - b.mtime)
    .map(({path}) => path).pop();
////
console.log('pfx', pfx);