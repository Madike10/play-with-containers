# API Gateway - Microservices pour Plateforme de Streaming

Ce projet implémente une infrastructure de microservices pour une plateforme de streaming de films, composée d'une API Gateway, d'un service d'inventaire et d'un service de facturation.

## Architecture générale

L'architecture est constituée de trois composants principaux, chacun exécuté dans sa propre machine virtuelle :

1. **API Gateway** : Point d'entrée unique pour toutes les requêtes, écrit en Go
2. **Service d'inventaire** : Gère les informations des films via une API RESTful, écrit en Python avec Flask
3. **Service de facturation** : Traite les paiements via des messages RabbitMQ, écrit en Python

### Schéma d'architecture

```
+----------------+       HTTP       +--------------------+
|                |  /api/movies     |                    |
|   API Gateway  | ---------------> | Service Inventaire |
|                |                  |                    |
|    (Golang)    |                  |  (NodeJS/Express)  |
|                |                  +--------------------+
|                |      RabbitMQ    +--------------------+
|                |  /api/billing    |                    |
|                | ---------------> | Service Facturation|
|                |                  +--------------------+              
|                |                  |  (NodeJS/Express)  |
|                |                  +--------------------+
```

## API Gateway

L'API Gateway est écrite en Go et sert de point d'entrée unique pour tous les services. Elle route les requêtes HTTP vers le service d'inventaire et publie les messages RabbitMQ pour le service de facturation.

### Fonctionnalités principales

- Routage HTTP vers le service d'inventaire pour les endpoints `/api/movies`
- Publication de messages RabbitMQ pour les requêtes POST vers `/api/billing`
- Isolation des clients des détails d'implémentation des services en aval
- Configuration via variables d'environnement

### Endpoints

1. **Inventaire** : `/api/movies` et `/api/movies/:id`
- Transfert toutes les requêtes HTTP (GET, POST, PUT, DELETE) vers le service d'inventaire
- Préserve tous les headers, paramètres de requête et corps de requête

2. **Facturation** : `/api/billing` (POST uniquement)
- Convertit le corps de requête JSON en message pour RabbitMQ
- Publie le message dans la file d'attente `billing_queue`
- Renvoie une confirmation de publication au client

## Prérequis

- [Go](https://golang.org/) (v1.19 ou supérieur)
- [Vagrant](https://www.vagrantup.com/) (pour la virtualisation)
- [VirtualBox](https://www.virtualbox.org/) (ou un logiciel équivalent comme VMware)
- [PM2](https://pm2.keymetrics.io/) (pour la gestion des processus)

## Installation et configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```
# Configuration API Gateway
API_GATEWAY_PORT=8000
INVENTORY_API_URL=http://inventory-vm:8080
RABBITMQ_URL=amqp://guest:guest@billing-vm:5672/
QUEUE_NAME=billing_queue

# Configuration Service Inventaire
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=movies_db
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# Configuration Service Facturation
POSTGRES_BILLING_USER=postgres
POSTGRES_BILLING_PASSWORD=postgres
POSTGRES_BILLING_DB=billing_db
POSTGRES_BILLING_HOST=localhost
POSTGRES_BILLING_PORT=5432
```
