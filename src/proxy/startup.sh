#!/bin/bash
cd ~
sudo yum update -y
sudo yum install -y gcc-c++ make
curl -sL https://rpm.nodesource.com/setup_16.x | sudo -E bash -
sudo yum install -y nodejs
sudo -u ec2-user npm init -y
sudo -u ec2-user npm install express
sudo -u ec2-user npm install socket.io
cat > proxy.js << EOF
/** proxy.js **/
EOF