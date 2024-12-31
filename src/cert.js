const {execSync} = require('child_process');
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

try {
    (async () => {
        AWS.config.update({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION,
        });
        const route53 = new AWS.Route53();
        const hostedZoneId = process.env.AWS_HOSTED_ZONE_ID; // Replace with your Route 53 Hosted Zone ID
        const domain = 'example.com';
        const certbotConfigDir = path.resolve(process.cwd(), 'certbot-certs');
        console.log('Step 1: Running Certbot to generate DNS challenge...');
        const certbotOutput = execSync(
            `certbot certonly --manual --preferred-challenges dns --manual-auth-hook "echo DNS Hook Placeholder" --manual-cleanup-hook "echo Cleanup Hook Placeholder" --config-dir ${certbotConfigDir} -d ${domain} --dry-run`,
            {encoding: 'utf-8'}
        );
        // Extract the DNS challenge details
        const tokenMatch = certbotOutput.match(/_acme-challenge\.\S+/);
        const keyAuthMatch = certbotOutput.match(/Value:\s*"([^"]+)"/);
        if (!tokenMatch || !keyAuthMatch) {
            throw new Error('Failed to extract DNS challenge details from Certbot output.');
        }
        const dnsName = tokenMatch[0];
        const dnsValue = keyAuthMatch[1];
        console.log(`DNS Challenge Name: ${dnsName}`);
        console.log(`DNS Challenge Value: ${dnsValue}`);
        console.log('Step 2: Adding DNS TXT record using Route 53...');
        await route53
            .changeResourceRecordSets({
                HostedZoneId: hostedZoneId,
                ChangeBatch: {
                    Changes: [
                        {
                            Action: 'UPSERT',
                            ResourceRecordSet: {
                                Name: dnsName,
                                Type: 'TXT',
                                TTL: 60,
                                ResourceRecords: [
                                    {
                                        Value: `"${dnsValue}"`,
                                    },
                                ],
                            },
                        },
                    ],
                },
            })
            .promise();
        console.log(`Added TXT record for ${dnsName}`);
        console.log('Step 3: Waiting for DNS propagation...');
        await new Promise((resolve) => setTimeout(resolve, 30000)); // Wait 30 seconds for propagation
        console.log('Step 4: Validating challenge with Certbot...');
        execSync(
            `certbot certonly --manual --preferred-challenges dns --config-dir ${certbotConfigDir} -d ${domain}`,
            {stdio: 'inherit'}
        );
        console.log('Step 5: Retrieving and saving certificate...');
        const certPath = path.join(certbotConfigDir, `live/${domain}/fullchain.pem`);
        const keyPath = path.join(certbotConfigDir, `live/${domain}/privkey.pem`);
        fs.copyFileSync(certPath, './.api-cert.pem');
        fs.copyFileSync(keyPath, './.api-key.pem');
    })();
} catch (error) {
    console.error('Error during Certbot process:', error.message);
}
