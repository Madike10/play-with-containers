# Movie Inventory Microservice

Ce microservice permet de gérer un inventaire de films avec des opérations CRUD complètes.
Il est construit avec Node.js, Express, TypeScript et utilise PostgresQL comme base de données via Sequelize ORM.

## Fonctionnalités

- Créer, lire, mettre à jour et supprimer des films
- Rechercher des films par titre
- API RESTful complète
- Architecture en couches (Models, Controllers, Routes)

## Structure du projet

```
inventory-app/
├── src/
│   ├── config/
│   │   └── database.ts         # Configuration de la connexion à la base de données
│   ├── controllers/
│   │   └── movie.controller.ts # Logique de contrôle pour les films
│   ├── models/
│   │   └── movie.model.ts      # Modèle de données pour les films
│   ├── routes/
│   │   └── movie.routes.ts     # Définition des routes API
│   ├── app.ts                  # Configuration de l'application Express
│   └── server.ts               # Point d'entrée de l'application
├── .env                        # Variables d'environnement
├── package.json                # Dépendances et scripts
├── tsconfig.json               # Configuration TypeScript
└── README.md                   # Documentation
```

## Prérequis

- Node.js (v22 ou supérieur)
- PostgresSQL (v17 ou supérieur)
- npm ou yarn

## Installation

1. Clonez ce dépôt :
   ```bash
   git clone https://github.com/votre-nom/inventory-app.git
   cd inventory-app
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Configurez la base de données :
   - Créez une base de données PostgresSQL nommée `movies_db`
   - Modifiez le fichier `.env` avec vos paramètres de connexion

4. Compilez le code TypeScript :
   ```bash
   npm run build
   ```

5. Lancez l'application :
   ```bash
   npm start
   ```

Pour le développement, vous pouvez utiliser le mode de rechargement automatique :
```bash
npm run dev
```

## Configuration

Configurez l'application en modifiant le fichier `.env` à la racine du projet :

```
DB_HOST=localhost       # Hôte de la base de données
DB_USER=postgres        # Utilisateur de la base de données
DB_PASSWORD=postgres    # Mot de passe
DB_NAME=movies          # Nom de la base de données
PORT=8080               # Port du serveur
```

## API Endpoints

### Films

| Méthode | Endpoint              | Description                    | Corps de la requête    | Réponse                            |
|---------|-----------------------|--------------------------------|------------------------|------------------------------------|
| GET     | /api/movies           | Récupérer tous les films       | -                      | Array d'objets Film                |
| GET     | /api/movies?title=xyz | Rechercher des films par titre | -                      | Array d'objets Film correspondants |
| GET     | /api/movies/:id       | Récupérer un film par ID       | -                      | Objet Film                         |
| POST    | /api/movies           | Créer un nouveau film          | { title, description } | Nouvel objet Film créé             |
| PUT     | /api/movies/:id       | Mettre à jour un film          | { title, description } | Objet Film mis à jour              |
| DELETE  | /api/movies/:id       | Supprimer un film              | -                      | Message de confirmation            |
| DELETE  | /api/movies           | Supprimer tous les films       | -                      | Message de confirmation            |

## Format des données

### Film

```json
{
  "id": 1,
  "title": "Inception",
  "description": "Un film sur les rêves",
  "createdAt": "2023-05-20T14:00:00.000Z",
  "updatedAt": "2023-05-20T14:00:00.000Z"
}
```

## Choix de conception

1. **Architecture en couches** : Le projet suit une architecture en couches claire séparant les préoccupations :
   - Modèles (définition des structures de données)
   - Contrôleurs (logique métier)
   - Routes (définition des points d'entrée API)
   - Configuration (paramètres de base de données et d'application)

2. **TypeScript** : Utilisé pour garantir la sécurité des types et améliorer la maintenabilité du code.

3. **Sequelize ORM** : Choisi pour l'abstraction de la base de données, simplifiant les opérations CRUD et la gestion du schéma.

4. **RESTful API** : L'API suit les principes REST pour une interface cohérente et prévisible.

5. **Gestion d'erreurs** : Implémentation complète de la gestion des erreurs avec des réponses HTTP appropriées et des messages informatifs.

6. **Variables d'environnement** : Utilisation de dotenv pour la configuration flexible entre les différents environnements.

## Développement

### Ajouter de nouveaux champs au modèle Film

1. Modifiez l'interface `MovieAttributes` dans `src/models/movie.model.ts`
2. Ajoutez les nouveaux champs dans la méthode `Movie.init()`
3. Mettez à jour les contrôleurs pour utiliser les nouveaux champs

### Ajouter un nouveau modèle

1. Créez un nouveau fichier dans le dossier `src/models/`
2. Définissez l'interface pour les attributs et le modèle
3. Initialisez le modèle avec Sequelize
4. Créez les contrôleurs et les routes correspondants

## Tests

Bien que les tests ne soient pas encore implémentés, le projet est configuré pour utiliser Jest.
Pour exécuter les tests lorsqu'ils seront disponibles :

```bash
npm test
```

## Déploiement

### Production

Pour déployer en production :

1. Compilez le code TypeScript :
   ```bash
   npm run build
   ```

2. Configurez les variables d'environnement pour la production.

3. Démarrez le serveur :
   ```bash
   npm start
   ```
