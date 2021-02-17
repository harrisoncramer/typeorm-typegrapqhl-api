#!/bin/bash

# This script will install docker and docker-compose in your Ubunutu EC2 instance if you have not already installed them.
# Attribution: https://medium.com/@umairnadeem/deploy-to-aws-using-docker-compose-simple-210d71f43e67
# And here: https://medium.com/@chamikakasun/how-to-install-git-docker-docker-compose-and-node-in-an-ec2-instance-84ddce948179

sudo apt upgrade -y

# Docker

sudo apt install apt-transport-https ca-certificates curl software-properties-common -y
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"
sudo apt update
sudo apt install docker-ce -y

sudo usermod -aG docker ${USER}
newgrp docker

# Docker Compose

sudo curl -L https://github.com/docker/compose/releases/download/1.21.2/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose --version

# Show docker running...
sudo systemctl status docker
