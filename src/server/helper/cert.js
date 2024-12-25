const fs = require('fs');
const {exec} = require('child_process');
const installCertificate = () => {
    fs.writeFileSync('./temp-cert.crt', fs.readFileSync("./localhost.key"));
    exec(`certutil -addstore "Root" "./temp-cert.crt"`, (err, stdout, stderr) => {
        fs.unlinkSync('./temp-cert.crt');
        if (err) {
            console.error('installCertificate:: error adding certificate:', stderr);
        } else {
            console.log('installCertificate :: certificate added successfully:', stdout);
        }
    });
};
module.exports = {installCertificate};
