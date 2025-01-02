#!/bin/bash

# Update the system
sudo yum update -y

# Install required build tools
sudo yum install -y gcc-c++ make

# Install Node.js
curl -sL https://rpm.nodesource.com/setup_16.x | sudo -E bash -
sudo yum install -y nodejs

# Create project directory
sudo mkdir -p /home/ec2-user/
cd /home/ec2-user/

# Initialize Node.js project
sudo npm init -y

# Install required Node.js packages
sudo npm install express
sudo npm install socket.io

# Create proxy.js file
sudo tee proxy.js > /dev/null << 'EOF'
/** proxy.js **/
EOF