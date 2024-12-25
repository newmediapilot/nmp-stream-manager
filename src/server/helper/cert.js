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
    fs.writeFileSync('./cert.crt', keys['cert'], {encoding:'utf-8'});
    execSync(`certutil -addstore "Root" "./cert.crt"`, (err, stdout, stderr) => {
        if (err) {
            console.error('configureCertificate:: error adding certificate:', stderr);
        } else {
            console.log('configureCertificate :: certificate added successfully:', stdout);
        }
    });
    fs.rmSync('./cert.crt');
};
module.exports = {configureCertificate};