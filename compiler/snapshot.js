const fs = require('fs');
const {exec, execSync} = require('child_process');
const {sync: globSync} = require('glob');
const {chromium} = require('playwright');
const hash = process.argv[2] || 'demo';
console.log('snapshot :: hash', hash);
exec('npm run serve', {stdio: 'inherit'});
execSync('sleep 5');
(async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext({
        ignoreHTTPSErrors: true
    });
    const page = await context.newPage();
    globSync('./src/templates/**/*.html')
        .map(async (path, index, {length}) => {
            const url = `https://192.168.0.22/${hash}/${path.split('/').pop()}`;
            console.log('snapshot :: path', path, url, `${index + 1}/${length}`);
            await page.goto(url, {waitUntil: 'load'});
            fs.writeFileSync(
                `.tplt-${path.split('/').pop()}`,
                await page.content(),
                {encoding: 'utf-8'}
            );
        });
    await browser.close(); // Close the browser
})();