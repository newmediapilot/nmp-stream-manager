const fs = require('fs');
const {exec, execSync} = require('child_process');
const {sync: globSync} = require('glob');
const hash = process.argv.pop() || 'demo';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
let server = exec('npm run serve', {stdio: 'inherit'});
try {
    globSync('./src/templates/**/*.html')
        .forEach((path, index, {length}) => {
            console.log('snapshot :: path', path, `${index + 1}/${length}`);
            const url = `https://localhost/${hash}/${path.split('/').pop()}`;
            const contents = execSync(`curl -k ${url}`, {stdio: 'pipe'}).toString();
            const outputPath = `.tplt-${path.split('/').pop()}`;
            fs.writeFileSync(outputPath, contents, {encoding: 'utf-8'});
            console.log(`snapshot :: write`, outputPath, `${index + 1}/${length}`);
        });
    console.log('snapshot :: done');
} catch (error) {
    console.error('snapshot :: error', error.message);
}
