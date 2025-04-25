# crud-master

## Installation

1. Cloner le dépôt
    ```
    git clone https://learn.zone01dakar.sn/git/ymadike/crud-master.git
    cd crud-master
    ```
2. Lancer les machines virtuelles
    ```
    vagrant up
    ```
3. Vérifier l'état des VMs
     ```
     vagrant status
     ```
4. Accéder à une VM spécifique
     ```
     vagrant ssh gateway-vm
     vagrant ssh inventory-vm
     vagrant ssh billing-vm
     ```

## Structure du projet
```
.
├── README.md
├── config.yaml
├── .env
├── scripts
│ ├── setup-gateway.sh
│ ├── setup-inventory.sh
│ └── setup-billing.sh
├── srcs
│ ├── api-gateway
│ │ ├── utils
│ │ │ ├── config.go
│ │ │ ├── proxyRequest.go
│ │ │ └── rabbit.go
│ │ ├── main.go
│ │ ├── go.mod
│ │ ├── go.sum
│ │ └── README.md
│ ├── billing-app
│ │ ├── app
│ │ │ ├── config
│ │ │ │ ├── database.js
│ │ │ │ └── rabbitmq.js
│ │ │ ├── controllers
│ │ │ │ └── billingController.js
│ │ │ ├── models
│ │ │ │ └── billingModel.js
│ │ │ └── routes
│ │ │ │ └── route.js
│ │ ├── package.json
│ │ └── server.js
│ └── inventory-app
│ │ ├── app
│ │ │ ├── config
│ │ │ │ ├── database.ts
│ │ │ ├── controllers
│ │ │ │ └── movie.controller.ts
│ │ │ ├── models
│ │ │ │ └── movie.model.ts
│ │ │ └── routes
│ │ │ │ └── movie.routes.ts
│ │ ├── package.json
│ │ └── server.ts
└── Vagrantfile
```
## Gestion des processus avec PM2

Une fois les VMs lancées, les API sont gérées via PM2 :
```bash
# Lister toutes les applications en cours d'exécution
sudo pm2 list
# Arrêter une application spécifique
sudo pm2 stop gateway
# Démarrer une application spécifique
sudo pm2 start gateway
# Consulter les logs d'une application
sudo pm2 logs gateway
 ```
## Tests
### Test de l'API Inventory

Vous pouvez tester l'API Inventory en utilisant Postman.
Veuillez vous assurer que vous avez importé le fichier `CRUD_MASTER.postman_collection.json` dans Postman.
Ensuite, vous pouvez utiliser le run collection pour tester les API.
Testez-les endpoints du service d'inventaire avec [Postman](https://www.postman.com/) :
- `GET http://{{adresse-ip-du-vm}}:8000/api/movies` - Liste tous les films
- `GET http://{{adresse-ip-du-vm}}:8000/api/movies?title=Matrix` - Recherche des films par titre
- `POST http://{{adresse-ip-du-vm}}:8000/api/movies` - Crée un nouveau film
- `GET http://{{adresse-ip-du-vm}}:8000/api/movies/1` - Récupère un film spécifique
- `PUT http://{{adresse-ip-du-vm}}:8000/api/movies/1` - Met à jour un film
- `DELETE http://{{adresse-ip-du-vm}}:8000/api/movies/1` - Supprime un film
### Test de l'API Billing
Pour tester l'API de facturation, envoyez une requête POST à l'API Gateway :

```
POST https://{{adresse-ip-du-vm}}:8000/api/billing
Content-Type: application/json
{
"user_id": "3",
"number_of_items": "5",
"total_amount": "180"
}
```
Vérifiez que le message a été traité en consultant la base de données `billing_db`.
## Choix de conception

### Choix de Go pour l'API Gateway
Go a été choisi pour l'API Gateway en raison de :
1. **Performance** : Go est conçu pour être rapide et efficace, idéal pour un composant qui doit gérer toutes
les requêtes.
2. **Concurrence native** : Les goroutines permettent de gérer efficacement de nombreuses connexions
simultanées.
3. **Empreinte mémoire légère** : Go consomme peu de ressources système, ce qui est idéal pour un service
toujours actif.
4. **Simplicité de déploiement** : Les binaires Go sont autonomes et facilement déployables.

### Choix de Node.js pour l'API Billing
Node.js a été choisi pour l'API Billing en raison de :
1. **Performance** : Node.js est conçu pour être rapide et efficace, idéal pour un composant qui doit gérer toutes
les requêtes.
2. **Concurrence asynchrone** : Les fonctions asynchrones permettent de gérer efficacement de nombreuses connexions
simultanées.
3. **Empreinte mémoire légère** : Node.js consomme peu de ressources système, ce qui est idéal pour un service
toujours actif.
4. **Simplicité de déploiement** : Les binaires Node.js sont autonomes et facilement déployables.

### Architecture de microservices
L'architecture de microservices a été choisie pour :

1. **Isolation des services** : Chaque service peut évoluer indépendamment.
2. **Résilience** : La défaillance d'un service n'affecte pas l'ensemble du système.
3. **Flexibilité technologique** : Chaque service utilise la technologie la plus adaptée à son cas d'usage.
4. **Scalabilité indépendante** : Chaque service peut être mis à l'échelle selon ses besoins spécifiques.

### RabbitMQ pour la communication asynchrone
RabbitMQ a été choisi pour la communication entre l'API Gateway et le service de facturation pour :

1. **Communication asynchrone** : Le service de facturation peut traiter les messages à son propre rythme.
2. **Durabilité des messages** : Les messages persistent même si le service de facturation est indisponible.
3. **Garantie de livraison** : RabbitMQ assure que les messages sont délivrés au moins une fois.


# PLAY WITH CONTAINERS

## DOCKER

DOCKER --> DOCKERFILE --> DOCKERIMAGE --> CONTAINER --> 

Docker is an open source platform for developer shipping and running applications.

### container

software that packages code and dependencies, so the application runs quickly and reliably across computing environments.\


### Docker Network

```bash
        docker network ls   # Pour lister la liste des networks qui existe
        docker network create --dirver brideg --subnet  172.17.0.0/16 {Nom du network}  # Pour cree un nouveau network
        docker network inspect nom_du_reseau  # Pour voir les info d'un reseau cree
```

Il existe 3 types de reseaux docker :
 . Bridge : Qui le reseau par defaut avec les address au alentour de 1712.17.0.X
 . None : docker run avec --network=none pour demarrer des conteneurs sans network
 . Host : docker run --network=host Pour utiliser le meme reseaux que le host

 **DNS (Docker Name Spaces)**

 C'est un serveur qui est demarrer par defaut en utilisant l'IP 17.17.0.11
 Un conteneur peut atteindre un autre par son nom 
 Docker utilise DNS pour associer un nom a l'address IP du conteneur

### Docker Compose 

Compose est un outil permettant de definir et d'executer des applications docker a conteneur multiples.

***Acceder au conteneur***
```bash
        docker exec -it conteneur_name_or_id sh   ## to acces in shell 
```
### volumes

c'est un repertoire partager dans l'hote, visible depuis certains ou tous les conteneurs.

### Networks

Ils definissent les regles de communication entre les conteneurs et les conteneur de l'hote
Ils permet au services des conteneurs d'etre decouverts les uns par les autres