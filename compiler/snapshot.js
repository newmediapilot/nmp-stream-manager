const fs = require('fs');
const {exec, execSync} = require('child_process');
const {sync: globSync} = require('glob');
const {chromium} = require('playwright');
const hash = process.argv[2] || 'demo';
(async () => {
    console.log('snapshot :: hash', hash);
    const server = exec('npm run serve', {stdio: 'inherit'});
    console.log('snapshot :: server');
    execSync('sleep 5');
    const browser = await chromium.launch();
    const context = await browser.newContext({
        ignoreHTTPSErrors: true,
    });
    const page = await context.newPage();
    try {
        const paths = globSync('./src/templates/**/*.html');
        for (const [index, path] of paths.entries()) {
            try {
                const fileName = path.split('/').pop();
                const url = `https://localhost/${hash}/${fileName}`;
                console.log('snapshot :: path', path);
                console.log('snapshot :: url', url, `${index + 1}/${paths.length}`);
                await page.goto(url, {waitUntil: 'load'});
                const content = await page.content();
                // TODO: pre-process as well since it should work with html-minify heavy
                fs.writeFileSync(`.tplt-${fileName}`, content, {encoding: 'utf-8'});
                console.log('snapshot :: write', `.tplt-${fileName}`);
            } catch (error) {
                console.error('snapshot :: error', path, error.message);
            }
        }
    } catch (error) {
        console.error('snapshot :: error', error.message);
    } finally {
        console.log('snapshot :: done');
        await browser.close();
        server.kill();
        process.exit(0);
    }
})();