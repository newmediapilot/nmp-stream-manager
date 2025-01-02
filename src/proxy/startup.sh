#!/bin/bash
set -e
sudo yum update -y
sudo yum install -y gcc-c++ make
curl -sL https://rpm.nodesource.com/setup_16.x | sudo -E bash -
sudo yum install -y nodejs
sudo mkdir -p /home/ec2-user/
sudo chown -R ec2-user:ec2-user /home/ec2-user/
cd /home/ec2-user/
su - ec2-user -c "npm init -y && npm install express socket.io"
sudo tee /home/ec2-user/proxy.js > /dev/null << 'EOF'
/** proxy.js **/
EOF
su - ec2-user -c "node /home/ec2-user/proxy.js"
