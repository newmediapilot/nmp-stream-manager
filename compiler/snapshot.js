const fs = require('fs');
const {exec} = require('child_process');
const {sync: globSync} = require('glob');
const {execSync} = require('child_process');
const server = exec('npm run serve', {stdio: 'inherit'});
const hash = process.argv[2] || 'demo';
globSync('.compiled/src/templates/*.html')
    .map(path => {
        return {path, contents: execSync(`curl -k https://localhost/${hash}/${path.split('/').pop()}`, {stdio: 'pipe'}).toString()}
    })
    .map(({path, contents}) => {
        fs.writeFileSync(`.tplt-${path.split('/').pop()}`, contents, {encoding: 'utf-8'});
    });
process.kill(server.pid);
process.exit(0);