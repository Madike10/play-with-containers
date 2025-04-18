#!/bin/bash

set -e  # Set the script to exit on error

# Export the environment variables
echo " export variables environment gateway ..."
echo "export API_GATEWAY_PORT=$API_GATEWAY_PORT" >> /etc/profile
echo "export INVENTORY_API_URL=$INVENTORY_API_URL" >> /etc/profile
echo "export RABBITMQ_URL=$RABBITMQ_URL"  >> /etc/profile
echo "export QUEUE_NAME=$QUEUE_NAME" >> /etc/profile


# Installer Go si nécessaire
sudo apt update 
sudo apt upgrade -y
if ! command -v go &> /dev/null; then
    echo "Installing Go..."
    sudo snap install go --classic
    echo "Go installed successfully!"
    echo "go version:::: $(go version)"
fi

# Install de RabbitMQ plugin
echo "Installing RabbitMQ plugin..."
if ! command -v rabbitmq-server &> /dev/null; then
    echo "Installation de RabbitMQ..."
    sudo apt-get install -y rabbitmq-server
fi

#  Install PM2
echo "Starting the application with PM2..."
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
    sudo apt-get install -y nodejs
    sudo npm install pm2 -g
fi


# Configuaration RabbitMQ
echo "==== Configuring RabbitMQ ===="
sudo rabbitmqctl add_user admin admin || echo "L'utilisateur existe déjà."
sudo rabbitmqctl set_user_tags admin administrator
sudo rabbitmqctl set_permissions -p / admin ".*" ".*" ".*"
sudo rabbitmqctl delete_user guest  || echo "No user to delete."
echo "RabbitMQ configured successfully."

# Installer les dépendances
echo "Installing dependencies..."
cd api-gateway
go mod download
go mod tidy

# Compiler l'application
echo "Building the application..."
go build -o gateway

# Démarrer l'application
echo "Starting the API Gateway..."
pm2 start gateway --name="gateway" --attach

