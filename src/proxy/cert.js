require("dotenv").config();
const acme = require('acme-client');
const fs = require('fs');
const {execSync} = require('child_process');
const AWS = require('aws-sdk');

(async () => {
    try {
        const client = new acme.Client({
            directoryUrl: acme.directory.letsencrypt.production,
            accountKey: await acme.crypto.createPrivateKey()
        });
        await client.createAccount({
            termsOfServiceAgreed: true,
            contact: ['mailto:marcin+acme@newmediapilot.com']
        });
        const domainKey = await acme.crypto.createPrivateKey();
        const [csr, csrPem] = await acme.crypto.createCsr({
            commonName: 'dbdbdbdbdbgroup.com',
            altNames: ['api.dbdbdbdbdbgroup.com']
        }, domainKey);
        const route53 = new AWS.Route53();
        const challenges = {
            'dns-01': {
                create: async (authz, challenge, keyAuthorization) => {
                    const domain = authz.identifier.value;
                    const recordName = `_acme-challenge.${domain}`;
                    const recordValue = keyAuthorization;
                    execSync(`npm run route53 ${recordName} ${recordValue}`);
                }
            }
        };
        const cert = await client.auto({
            csr,
            email: 'marcin+acme@newmediapilot.com',
            termsOfServiceAgreed: true,
            challengeCreateFn: challenges['dns-01'].create
        });
        fs.writeFileSync('cert.pem', cert.cert);
        fs.writeFileSync('chain.pem', cert.chain);
        fs.writeFileSync('fullchain.pem', cert.fullchain);
        fs.writeFileSync('privkey.pem', domainKey);
        console.log('Certificate obtained successfully.');
    } catch (e) {
        console.log('cert :: error', e);
    }
})();
