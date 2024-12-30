const fs = require('fs');
const {exec} = require('child_process');
const {execSync} = require('child_process');
const server = exec('npm run serve', {stdio: 'inherit'});
[
    ['.tplt-index.html', execSync('curl -k https://localhost/demo/index.html', {stdio: 'pipe'})],
    ['.tplt-panel-dashboard.html', execSync('curl -k https://localhost/demo/panel-dashboard.html', {stdio: 'pipe'})],
    ['.tplt-panel-actions.html', execSync('curl -k https://localhost/demo/panel-actions.html', {stdio: 'pipe'})],
    ['.tplt-panel-layout.html', execSync('curl -k https://localhost/demo/panel-layout.html', {stdio: 'pipe'})],
    ['.tplt-panel-draw.html', execSync('curl -k https://localhost/demo/panel-draw.html', {stdio: 'pipe'})],
    ['.tplt-embed.html', execSync('curl -k https://localhost/demo/embed.html', {stdio: 'pipe'})],
    ['.tplt-embed-feature.html', execSync('curl -k https://localhost/demo/embed-feature.html', {stdio: 'pipe'})],
    ['.tplt-embed-media.html', execSync('curl -k https://localhost/demo/embed-media.html', {stdio: 'pipe'})],
    ['.tplt-embed-draw.html', execSync('curl -k https://localhost/demo/embed-draw.html', {stdio: 'pipe'})],
    ['.tplt-embed-sound.html', execSync('curl -k https://localhost/demo/embed-sound.html', {stdio: 'pipe'})],
]
    .map(([a, b]) => [a, b.toString()])
    .forEach((payload, i, array) => {
            const [a, b] = payload;
            console.log('snapshot ::', a, i, '/', array.length - 1);
            fs.writeFileSync(a, b);
            if (i >= array.length - 1) {
                console.log('snapshot :: end', server.pid);
                process.kill(server.pid);
                process.exit(0);
            }
        }
    );

