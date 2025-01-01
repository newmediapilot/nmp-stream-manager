#!/bin/bash
sudo yum update -y
sudo yum install -y gcc-c++ make
curl -sL https://rpm.nodesource.com/setup_16.x | sudo -E bash -
sudo yum install -y nodejs
node -v
npm -v
mkdir -p /home/ec2-user/proxy-app
cd /home/ec2-user/proxy-app
npm init -y
npm install express
cat << 'EOF' > proxy.js
const express = require('express');
const app = express();
const port = 80;
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
EOF
sudo chown -R ec2-user:ec2-user /home/ec2-user/proxy-app
node proxy.js > app.log 2>&1 &