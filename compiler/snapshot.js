const fs = require('fs');
const {execSync} = require('child_process');
const {exec} = require('child_process');
const {sync: globSync} = require('glob');
const server = exec('npm run serve');
const hash = process.argv[2] || 'demo';
globSync('.compiled/src/templates/*.html')
    .map(path => {
        const data = execSync(`curl -k https://localhost/${hash}/${path.split('/').pop()}`, {stdio: 'pipe'});
        fs.writeFileSync(`.tplt-${path.split('/').pop()}`, data.toString(), {encoding: 'utf-8'});
    });
process.exit(server.pid);
process.exit(0);