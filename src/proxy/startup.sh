#!/bin/bash
sudo yum update -y
sudo yum install -y gcc-c++ make
curl -sL https://rpm.nodesource.com/setup_16.x | sudo -E bash -
sudo yum install -y nodejs
node -v
npm -v
sudo mkdir -p /home/ec2-user/proxy-app
cd /home/ec2-user/proxy-app
sudo npm init -y
sudo npm install express
sudo tee proxy.js > /dev/null << 'EOF'
const express = require('express');
const https = require('https');
const app = express();
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});
const certs = {
    key: 'key-xxx',
    cert: 'cert-xxx',
};
https.createServer(certs, app).listen(443, () => {
    console.log('Server running on https://localhost');
});
EOF
sudo chown -R ec2-user:ec2-user /home/ec2-user/proxy-app
cd /home/ec2-user/proxy-app
sudo node proxy.js > app.log 2>&1 &