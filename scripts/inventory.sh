#!/bin/bash

# Ce script installe les dépendances nécessaires pour l'Inventory API
# et configure la base de données PostgreSQL

set -e 

echo "===== Configuration de l'Inventory VM ====="

# Exporter les variables d'environnement
echo "Export des variables d'environnement..."
echo "export INVENTORY_DB_USER=$INVENTORY_DB_USER" >> /etc/profile
echo "export INVENTORY_DB_PASSWORD=$INVENTORY_DB_PASSWORD" >> /etc/profile
echo "export INVENTORY_DB_NAME=$INVENTORY_DB_NAME" >> /etc/profile
echo "export INVENTORY_DB_HOST=$INVENTORY_DB_HOST" >> /etc/profile
echo "export INVENTORY_PORT=$INVENTORY_PORT" >> /etc/profile

# Installation des dépendances
sudo apt-get update
sudo apt-get install -y

# Installation de Node.js (si nécessaire)
if ! command -v node &> /dev/null; then
    echo "Installation de Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Installation de npm (si nécessaire)
if ! command -v npm &> /dev/null; then
    echo "Installation de npm..."
    sudo apt-get install -y npm
fi

# Installation de TypeScript et autres outils globaux
if ! command -v TypeScript &> /dev/null; then
    echo "Installation de TypeScript"
    sudo npm install -g typescript ts-node 
fi

# Installation de PostgresSQL (si nécessaire)
if ! command -v psql &> /dev/null; then
    echo "Installation de PostgreSQL..."
    sudo apt-get install -y postgresql postgresql-contrib
fi

# Installation de PM2 (si nécessaire)
if ! command -v pm2 &> /dev/null; then
    echo "Installation de PM2..."
    sudo npm install -g pm2
fi

# Démarrage de PostgreSQL
echo "Démarrage du service PostgreSQL..."
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Création de la base de données "inventory"
# Configuration de la base de données PostgreSQL
echo "Configuration de la base de données..."
sudo -u postgres psql -c "CREATE USER postgres WITH PASSWORD 'postgres';" || echo "L'utilisateur existe déjà."
Create movies database if not already created || echo "La base de données existe déjà."
sudo -u postgres psql -c "CREATE DATABASE movies;" || echo "La base de données existe déjà."
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE movies TO postgres;"
# sudo -u postgres psql -c "ALTER USER postgres WITH SUPERUSER;"
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgres';"


# Autorisation des connexions avec mot de passe
PG_HBA_CONF=$(sudo -u postgres psql -t -P format=unaligned -c "SHOW hba_file")
sudo sed -i "s/^\(host.*all.*all.*\)peer$/\1md5/" "$PG_HBA_CONF"
sudo sed -i "s/^\(local.*all.*all.*\)peer$/\1md5/" "$PG_HBA_CONF"

# Installation des dependencies de l'application
echo "Installation des dépendances de l'application..."
cd inventory-app
npm install
npm run build


# Lancement de l'application avec pm2
echo "Lancement de l'application avec PM2..."
# pm2 start npm run build --name inventory-app
pm2 start dist/server.js --name="inventory-app" --attach
