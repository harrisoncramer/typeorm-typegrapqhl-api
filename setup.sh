#!/bin/bash

# This script will install docker and docker-compose in your EC2 instance if you have not already installed them.
# It will also install git, so that you can download the packages for the API.
# Attribution: https://medium.com/@umairnadeem/deploy-to-aws-using-docker-compose-simple-210d71f43e67
# And here: https://medium.com/@chamikakasun/how-to-install-git-docker-docker-compose-and-node-in-an-ec2-instance-84ddce948179
sudo yum update
sudo yum install git -y

sudo yum install docker
sudo curl -L https://github.com/docker/compose/releases/download/1.21.0/docker-compose-`uname -s`-`uname -m` | sudo tee /usr/local/bin/docker-compose > /dev/null
sudo chmod +x /usr/local/bin/docker-compose
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

usermod -aG docker ${USER}
sudo systemctl docker restart # May also be service, depending on environment, instead of systemctl
