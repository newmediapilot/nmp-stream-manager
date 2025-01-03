#!/bin/bash
sudo yum update -y
sudo yum install -y gcc-c++ make
curl -sL https://rpm.nodesource.com/setup_16.x | sudo -E bash -
sudo yum install -y nodejs
rm -rf /home/ec2-user/
mkdir -p /home/ec2-user/
sudo chown ec2-user:ec2-user /home/ec2-user/
cd /home/ec2-user/
sudo -u ec2-user npm init -y
sudo -u ec2-user npm install express
sudo -u ec2-user npm install socket.io
cat > proxy.js << EOF
/** proxy.js **/
EOF