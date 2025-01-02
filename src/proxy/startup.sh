#!/bin/bash
sudo rm -rf /home/ec2-user/ && sudo mkdir /home/ec2-user/
sudo echo '<h1>Instance is running and serving HTTP!</h1>' > index.html && sudo mv index.html /var/www/html/index.html
sudo yum update -y
sudo yum install -y gcc-c++ make
curl -sL https://rpm.nodesource.com/setup_16.x | sudo -E bash -
sudo yum install -y nodejs
sudo mkdir -p /home/ec2-user/ && cd /home/ec2-user/
sudo npm init -y
sudo npm install express
sudo npm install socket.io
sudo tee proxy.js > /dev/null << 'EOF'
/** proxy.js **/
EOF
sudo node /home/ec2-user/proxy.js