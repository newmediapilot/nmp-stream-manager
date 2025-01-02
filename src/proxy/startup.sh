#!/bin/bash
sudo yum update -y
sudo yum install -y gcc-c++ make
curl -sL https://rpm.nodesource.com/setup_16.x | sudo -E bash -
sudo yum install -y nodejs
sudo mkdir -p /home/ec2-user/
cd /home/ec2-user/
sudo npm init -y
sudo npm install express
sudo npm install socket.io
sudo tee proxy.js > /dev/null << 'EOF'
/** proxy.js **/
EOF