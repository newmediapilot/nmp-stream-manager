#!/bin/bash
sudo yum update -y
sudo yum install -y gcc-c++ make
curl -sL https://rpm.nodesource.com/setup_16.x | sudo -E bash -
sudo yum install -y nodejs
node -v
npm -v
cd /home/ec2-user/proxy-app
echo "<h1>Instance is running and serving HTTP!</h1>" > /var/www/html/index.html
sudo mkdir -p /home/ec2-user/proxy-app
cd /home/ec2-user/proxy-app
sudo npm init -y
sudo npm install express
sudo tee proxy.js > /dev/null << 'EOF'
/** proxy.js **/
EOF
sudo chown -R ec2-user:ec2-user /home/ec2-user/proxy-app
cd /home/ec2-user/proxy-app
sudo node proxy.js > app.log 2>&1 &