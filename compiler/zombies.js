const fs = require('fs');
fs.existsSync('.s3') && fs.rmdirSync('.s3', {recursive: true});
fs.mkdirSync('.s3');
const htmlString = fs.readFileSync('./src/templates/zombie.html', {encoding: 'utf-8'});
const manifestJson = fs.readFileSync('./src/client/manifest.json', {encoding: 'utf-8'});
[0, 1, 2].forEach((a, index) => {
    const json = JSON.parse(String(manifestJson));
    json.start_url = `${index}/index.html`;
    fs.mkdirSync(`.s3/${index}`);
    fs.writeFileSync(`.s3/${index}/index.html`, htmlString, {encoding: 'utf-8'});
    fs.writeFileSync(`.s3/${index}/manifest.json`, json, {encoding: 'utf-8'});
});
