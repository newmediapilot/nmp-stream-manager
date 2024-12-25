const fs = require('fs');
const {execSync} = require('child_process');
const {generate} = require('selfsigned');
const {getParam, setSecret} = require('../store/manager');
const configureCertificate = () => {
    const keys = generate([
            {name: 'countryName', value: 'Undisclosed'},
            {name: 'stateOrProvinceName', value: 'Undisclosed'},
            {name: 'localityName', value: 'Undisclosed'},
            {name: 'organizationName', value: 'Home Network'},
            {name: 'organizationalUnitName', value: 'Home Network'},
            {name: 'commonName', value: getParam('device_ip')},
        ],
        {
            days: 1,
            keySize: 2048,
            extensions: [
                {name: 'keyUsage', digitalSignature: true, keyEncipherment: true},
                {name: 'extKeyUsage', serverAuth: true},
            ],
        }
    );
    setSecret('keys', keys);
    // fs.writeFileSync('./cert.crt', keys['cert'], {encoding: 'utf-8'});
    // try {
    //     execSync(
    //         `powershell.exe -Command "Start-Process powershell.exe -Verb RunAs -ArgumentList '-NoProfile -Command \\"certutil -addstore Root ./cert.crt\\"'"`,
    //         { stdio: 'inherit' }
    //     );
    //     console.log('configureCertificate added');
    // } catch (error) {
    //     console.error('configureCertificate failed', error.message);
    // }
    // // fs.rmSync('./cert.crt');
};
module.exports = {configureCertificate};