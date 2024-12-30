const {execSync} = require('child_process');
const fs = require('fs');
// const hash = process.argv[2] || 'demo';
execSync('npm run reset');
fs.existsSync('.package') && execSync('rm -rf .package');
fs.existsSync('.compiled') && execSync('rm -rf .compiled');
execSync('mkdir .compiled');
execSync('cp -r ./src .compiled/src');
execSync('cp -r ./.launch.js .compiled/src/launch.js');
const packageObj = JSON.parse(String(fs.readFileSync('./package.json', {encoding: 'utf-8'})));
packageObj.main = packageObj.pkg.scripts;
delete packageObj.devDependencies;
delete packageObj.scripts;
fs.writeFileSync('./.compiled/package.json', JSON.stringify(packageObj, null, 4), {encoding: 'utf-8'});
execSync('cd .compiled/ && npm i --no-package-lock', {stdio: 'inherit'});
execSync('pkg -d .compiled', {stdio: 'inherit'});
execSync('mv .package/app.exe .package/StreamDream.exe', { stdio: 'inherit' });
//
// const fs = require('fs');
// const ZipStream = require('zip-stream');
//
// const createZip = async (outputZip, files) => {
//     const output = fs.createWriteStream(outputZip);
//     const archive = new ZipStream();
//
//     // Pipe the zip stream to the output file
//     archive.pipe(output);
//
//     for (const file of files) {
//         await new Promise((resolve, reject) => {
//             archive.entry(fs.createReadStream(file.path), { name: file.name }, (err) => {
//                 if (err) reject(err);
//                 else resolve();
//             });
//         });
//     }
//
//     // Finalize the archive
//     archive.finalize();
//     console.log(`ZIP file created: ${outputZip}`);
// };
//
// // Example Usage
// const filesToZip = [
//     { path: './file1.txt', name: 'file1.txt' },
//     { path: './file2.txt', name: 'file2.txt' },
// ];
// const outputZipPath = './output.zip';
//
// createZip(outputZipPath, filesToZip).catch(console.error);
// Key Points:
//     Streaming:
//         Files are added to the ZIP archive as streams, making it efficient for large files.
//     File Name Customization:
//     The name property in the options object specifies how the file will appear in the ZIP.
//     Error Handling:
//     Handle errors within the entry method and when finalizing the archive.
//     Alternative for Folder Zipping
// If you need to zip an entire folder, you'll need to recursively read files in the folder and add them to the ZIP archive using zip-stream.
//
// Let me know if you’d like an example for zipping directories!
//
//
//
//
//
//
//
//
//
