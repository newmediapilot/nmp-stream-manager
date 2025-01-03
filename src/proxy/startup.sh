#!/bin/bash
rm -rf /var/lib/cloud/*
cd /home/ec2-user
sudo yum update -y
sudo yum install -y gcc-c++ make
curl -sL https://rpm.nodesource.com/setup_16.x | sudo -E bash -
sudo yum install -y nodejs
sudo mkdir -p /home/ec2-user
sudo chown ec2-user:ec2-user /home/ec2-user
sudo -u ec2-user bash -c "
  npm init -y
  npm install express socket.io cors
"
cat >/home/ec2-user/proxy.js <<'EOF'
/** proxy.js **/
EOF
sudo chown ec2-user:ec2-user /home/ec2-user/proxy.js
sudo node /home/ec2-user/proxy.js &