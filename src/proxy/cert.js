require("dotenv").config();
try {
    (async () => {
        const ACME = require('acme');
        const fs = require('fs');
        const AWS = require('aws-sdk');
        const acme = ACME.create({
            maintainerEmail: 'marcin+acme@newmediapilot.com',
            packageAgent: 'stream-dream/v1.0.0',
            notify: (event, details) => {
                console.log(`ACME Event: ${event}`, details);
            }
        });
        const directoryUrl = 'https://acme-v02.api.letsencrypt.org/directory';
        await acme.init(directoryUrl);
        const accountKey = await acme.forge.createPrivateKey();
        const account = await acme.accounts.create({
            subscriberEmail: 'marcin+acme@newmediapilot.com',
            agreeToTerms: true,
            accountKey
        });
        const csr = await acme.forge.createCsr({
            commonName: 'dbdbdbdbdbgroup.com',
            altNames: ['api.dbdbdbdbdbgroup.com']
        });
        const route53 = new AWS.Route53();
        const addTxtRecordToRoute53 = async (recordName, recordValue) => {
            const params = {
                HostedZoneId: process.env.AWS_HOSTED_ZONE_ID,
                ChangeBatch: {
                    Changes: [
                        {
                            Action: 'UPSERT',
                            ResourceRecordSet: {
                                Name: recordName,
                                Type: 'TXT',
                                TTL: 300,
                                ResourceRecords: [
                                    {
                                        Value: `"${recordValue}"`
                                    }
                                ]
                            }
                        }
                    ]
                }
            };
            await route53.changeResourceRecordSets(params).promise();
            console.log(`cert :: TXT record ${recordName} added successfully.`);
        };
        const challenges = {
            'dns-01': {
                set: async ({identifier, challenge, keyAuthorization}) => {
                    const domain = identifier.value;
                    const recordName = `_acme-challenge.${domain}`;
                    const recordValue = keyAuthorization;
                    await addTxtRecordToRoute53(recordName, recordValue);
                }
            }
        };
        const certificate = await acme.certificates.create({
            account,
            accountKey,
            csr,
            domains: ['api.dbdbdbdbdbgroup.com'],
            challenges
        });
        fs.writeFileSync('cert.pem', certificate.cert);
        fs.writeFileSync('chain.pem', certificate.chain);
        fs.writeFileSync('fullchain.pem', certificate.fullchain);
        fs.writeFileSync('privkey.pem', certificate.privkey);
    })();
} catch (e) {
    console.log('cert :: error', e);
}
