#!/bin/bash
sudo yum update -y
sudo yum install -y gcc-c++ make
curl -sL https://rpm.nodesource.com/setup_16.x | sudo -E bash -
sudo yum install -y nodejs
node -v
npm -v
cat << 'EOF' > /home/ec2-user/proxy.js
console.log("HELLO_FROM_NODE_JS");
EOF
sudo chown ec2-user:ec2-user /home/ec2-user/proxy.js
cd /home/ec2-user
node proxy.js > app.log 2>&1 &