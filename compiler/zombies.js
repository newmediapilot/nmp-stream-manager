const fs = require('fs');
fs.existsSync('.s3') && fs.rmdirSync('.s3', {recursive: true});
fs.mkdirSync('.s3');
fs.cpSync('./src/client/icon512_maskable.png', './.s3/icon512_maskable.png');
fs.cpSync('./src/client/icon512_rounded.png', './.s3/icon512_rounded.png');
// fs.cpSync('./src/client/service-worker.js', './.s3/service-worker.js');
const htmlString = fs.readFileSync('./src/templates/zombie.html', {encoding: 'utf-8'});
const manifestJson = fs.readFileSync('./src/client/manifest.json', {encoding: 'utf-8'});
[...Array.from({length: 30})]
    .forEach((a, index) => {
            const json = JSON.parse(String(manifestJson));
            json.start_url = `.s3/${index + 1}.html`;
            const html = htmlString.replace(`href="/manifest.json"`, `href="/${index + 1}.json">`);
            fs.writeFileSync(`.s3/${index + 1}.html`, html, {encoding: 'utf-8'});
            fs.writeFileSync(`.s3/${index + 1}.json`, JSON.stringify(json), {encoding: 'utf-8'});
        }
    );
