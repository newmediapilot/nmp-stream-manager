const fs = require('fs');
const {exec} = require('child_process');
const {execSync} = require('child_process');
const server = exec('npm run serve', {stdio: 'inherit'});
[
    ['.tplt-panel-dashboard.html', execSync('curl -k https://localhost/public/dashboard', {stdio: 'pipe'})],
    ['.tplt-panel-actions.html', execSync('curl -k https://localhost/public/actions', {stdio: 'pipe'})],
    ['.tplt-panel-layout.html', execSync('curl -k https://localhost/public/layout', {stdio: 'pipe'})],
    ['.tplt-panel-draw.html', execSync('curl -k https://localhost/public/draw', {stdio: 'pipe'})],
    ['.tplt-embed.html', execSync('curl -k https://localhost/public/embed', {stdio: 'pipe'})],
    ['.tplt-embed-feature.html', execSync('curl -k https://localhost/public/feature/embed', {stdio: 'pipe'})],
    ['.tplt-embed-media.html', execSync('curl -k https://localhost/public/media/embed', {stdio: 'pipe'})],
    ['.tplt-embed-draw.html', execSync('curl -k https://localhost/public/draw/embed', {stdio: 'pipe'})],
    ['.tplt-embed-sound.html', execSync('curl -k https://localhost/public/sound/embed', {stdio: 'pipe'})],
]
    .map(([a, b]) => [a, b.toString()])
    .forEach((payload, i, array) => {
            const [a, b] = payload;
            console.log('snapshot ::', a, i);
            fs.writeFileSync(a, b);
            if (i >= array.length - 1) {
                console.log('snapshot :: end');
                process.kill(server.pid);
            }
        }
    );
