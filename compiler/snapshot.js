// TODO: snapshot the pages and include them in the bucket, but have them talk to their local style/settings instances by interval
// TODO: since pages will fetch the local values on reload the same system works
// TODO: when the settings change we will upload them to S3
// TODO: potentially turn off socketReload(), and make it load when an event has finished
// TODO: pretty sure pages dont need reload anymore
const fs = require('fs');
const {exec} = require('child_process');
const {execSync} = require('child_process');
const server = exec('npm run serve', {stdio: 'inherit'});
[
    ['.compiled/src/templates/panel-dashboard.html', execSync('curl -k https://localhost/public/dashboard', {stdio: 'pipe'})],
    ['.compiled/src/templates/panel-actions.html', execSync('curl -k https://localhost/public/actions', {stdio: 'pipe'})],
    ['.compiled/src/templates/panel-layout.html', execSync('curl -k https://localhost/public/layout', {stdio: 'pipe'})],
    ['.compiled/src/templates/panel-draw.html', execSync('curl -k https://localhost/public/draw', {stdio: 'pipe'})],
    ['.compiled/src/templates/embed.html', execSync('curl -k https://localhost/public/embed', {stdio: 'pipe'})],
    ['.compiled/src/templates/embed-feature.html', execSync('curl -k https://localhost/public/feature/embed', {stdio: 'pipe'})],
    ['.compiled/src/templates/embed-media.html', execSync('curl -k https://localhost/public/media/embed', {stdio: 'pipe'})],
    ['.compiled/src/templates/embed-draw.html', execSync('curl -k https://localhost/public/draw/embed', {stdio: 'pipe'})],
    ['.compiled/src/templates/embed-sound.html', execSync('curl -k https://localhost/public/sound/embed', {stdio: 'pipe'})],
]
    .map(([a, b]) => [a, b.toString()])
    .forEach(([a, b]) => {
            fs.writeFileSync(a, b);
            console.log('snapshot ::', a);
        }
    );
server.kill();