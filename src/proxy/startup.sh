#!/bin/bash

# Change to the home directory
cd /home/ec2-user

# Update system packages
sudo yum update -y

# Install necessary build tools
sudo yum install -y gcc-c++ make

# Set up Node.js repository and install Node.js
curl -sL https://rpm.nodesource.com/setup_16.x | sudo -E bash -
sudo yum install -y nodejs

# Set permissions and create a clean directory for ec2-user
sudo mkdir -p /home/ec2-user
sudo chown ec2-user:ec2-user /home/ec2-user

# Initialize a Node.js project and install dependencies as ec2-user
sudo -u ec2-user bash -c "
  npm init -y
  npm install express socket.io
"

# Create proxy.js file
cat > /home/ec2-user/proxy.js << 'EOF'
/** proxy.js **/
EOF

# Ensure correct permissions for proxy.js
sudo chown ec2-user:ec2-user /home/ec2-user/proxy.js
