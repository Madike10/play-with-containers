#!/bin/bash

# Installation des dépendances nécessaires pour l'application de facturation

set -e  # Arrête le script si une commande échoue

#  Exporter les variables d'environnement

echo " export variables environment billing ..."
echo "export BILLING_DB_USER=$BILLING_DB_USER" >> /etc/profile
echo "export BILLING_DB_PASSWORD=$BILLING_DB_PASSWORD" >> /etc/profile
echo "export BILLING_DB_HOST=$BILLING_DB_HOST" >> /etc/profile
echo "export BILLING_DB_NAME=$BILLING_DB_NAME"    >> /etc/profile
echo "export BILLING_RABBITMQ_URL=$BILLING_RABBITMQ_URL" >> /etc/profile
echo "export BILLING_QUEUE_NAME=$BILLING_QUEUE_NAME" >> /etc/profile


echo "===== Configuration de la VM de billing ====="
#Install curl si necessaire
if ! command -v curl &> /dev/null; then
    echo "Installation de curl..."
    sudo apt-get install -y curl
fi
sudo apt update
sudo apt upgrade -y
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

# Installation de Express.js (si nécessaire)
if ! command -v express &> /dev/null; then
    echo "Installation de Express.js..."
    sudo npm install -g express
fi

# Installation de PostgresSQL (si nécessaire)
if ! command -v psql &> /dev/null; then
    echo "Installation de PostgreSQL..."
    sudo apt-get install -y postgresql postgresql-contrib
fi

# Installation de RabbitMQ (si nécessaire)
if ! command -v rabbitmq-server &> /dev/null; then
    echo "Installation de RabbitMQ..."
    sudo apt-get install -y rabbitmq-server
fi

# Installation de PM2 (si nécessaire)
if ! command -v pm2 &> /dev/null; then
    echo "Installation de PM2..."
    sudo npm install -g pm2
fi

# Configuration de RabbitMQ (si nécessaire)
echo "Configuration de RabbitMQ..."
sudo rabbitmqctl add_user admin admin || echo "L'utilisateur existe déjà."
sudo rabbitmqctl set_user_tags admin administrator
sudo rabbitmqctl set_permissions -p / admin ".*" ".*" ".*"
sudo rabbitmqctl delete_user guest || echo "No user to delete."
echo "RabbitMQ configuré avec succès."

# Redammer les services PostgreSQL
echo "Redémarrage des services PostgreSQL..."
sudo systemctl restart postgresql
sudo systemctl enable postgresql

# Redémarrage du service RabbitMQ
echo "Redémarrage du service RabbitMQ..."
sudo systemctl restart rabbitmq-server
sudo systemctl enable rabbitmq-server

# Configuration de la base de données PostgreSQL
echo "Création de la base de données facturation..."
sudo -u postgres psql -c "CREATE DATABASE billing_db;" || echo "La base de données existe déjà."
sudo -u postgres psql -c "CREATE USER postgres WITH PASSWORD 'postgres';" || echo "L'utilisateur existe déjà."
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE billing_db TO postgres;" || echo "Privilèges déjà accordés."
sudo -u postgres psql -c "ALTER USER postgres WITH SUPERUSER;" || echo "Utilisateur déjà superuser."
echo "Base de données configurée avec succès."

# Modifier le mot de passe de l'utilisateur postgres
echo "Modification du mot de passe de l'utilisateur postgres..."
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgres';"

# Autorisation des connexions avec mot de passe
PG_HBA_CONF=$(sudo -u postgres psql -t -P format=unaligned -c "SHOW hba_file")
sudo sed -i "s/^\(host.*all.*all.*\)peer$/\1md5/" $PG_HBA_CONF
sudo sed -i "s/^\(local.*all.*all.*\)peer$/\1md5/" $PG_HBA_CONF
echo "Connexions avec mot de passe autorisées avec succès."


#  connect to db billing_db and create table orders
echo "Création de la table orders dans la base de données billing_db..."

sudo -u postgres psql -d billing_db -c "CREATE TABLE orders(
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                numbers_of_items INTEGER NOT NULL,
                total_amount INTEGER NOT NULL
            );" || echo "La table orders existe déjà."
echo "Table orders créée avec succès."

# Installation des dépendances du projet
echo "Installation des dépendances du projet..."
cd billing-app
npm install

# Lancement de l'application avec pm2
echo "Lancement de l'application avec PM2..."
pm2 start server.js --name="billing-app" --attach

echo "===== Configuration terminée ====="