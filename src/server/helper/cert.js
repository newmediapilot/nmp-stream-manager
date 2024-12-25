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
};
module.exports = {configureCertificate};