const {execSync} = require('child_process');
execSync('curl -L https://nodejs.org/dist/v22.11.0/node-v22.11.0-x64.exe -o "./dist/node/node-v22.11.0-x64.msi"', { stdio: 'inherit' });
execSync('tar -xvf node/node-v22.11.0-linux-x64.tar.xz -C node --strip-components=1');