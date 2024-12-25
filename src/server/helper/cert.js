const fs = require('fs');
const {exec} = require('child_process');
const installCertificate = () => {
    fs.writeFileSync('./temp-cert.crt', fs.readFileSync("./localhost.key"));
    exec(`certutil -addstore "Root" "./temp-cert.crt"`, (err, stdout, stderr) => {
        fs.unlinkSync('./temp-cert.crt');
        if (err) {
            console.error('Error adding certificate:', stderr);
        } else {
            console.log('Certificate added successfully:', stdout);
        }
    });
};
module.exports = {installCertificate};
