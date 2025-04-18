# Documentation Technique - Movie Inventory Microservice

## Architecture

L'application suit un modèle d'architecture en couches classiques pour les API REST :

```
Client → Routes → Contrôleurs → Modèles → Base de données
```

### Composants principaux

1. **Express**: Framework web pour les API REST
2. **Sequelize** : ORM pour interagir avec PostgresSQL
3. **TypeScript** : Surcouche typée de JavaScript pour un développement robuste

## Modèles de données

### Film (Movie)

Le modèle `Movie` représente un film dans l'inventaire avec les propriétés suivantes :

| Champ        | Type     | Description                        | Contraintes         |
|--------------|----------|------------------------------------|---------------------|
| id           | INTEGER  | Identifiant unique                 | PK, Auto-increment  |
| title        | STRING   | Titre du film                      | Non null, Max 100   |
| description  | TEXT     | Description du film                | Nullable            |
| createdAt    | DATE     | Date de création                   | Non null, Auto      |
| updatedAt    | DATE     | Date de dernière mise à jour       | Non null, Auto      |

### Détails d'implémentation

```typescript
interface MovieAttributes {
  id: number;
  title: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface MovieCreationAttributes extends Optional<MovieAttributes, 'id'> {}

class Movie extends Model<MovieAttributes, MovieCreationAttributes> {}
```

Le modèle utilise les interfaces TypeScript pour garantir la sécurité des types lors de la création et de la manipulation des données.

## Contrôleurs

### MovieController

Implémente la logique métier pour les opérations sur les films :

| Méthode         | Description                    | Paramètres de requête          |
|-----------------|--------------------------------|--------------------------------|
| getAllMovies    | Récupérer tous les films       | title (optionnel) : filtre     |
| createMovie     | Créer un nouveau film          | title, description             |
| getMovieById    | Récupérer un film par ID       | id (route param)               |
| updateMovie     | Mettre à jour un film existant | id (route), title, description |
| deleteMovie     | Supprimer un film              | id (route param)               |
| deleteAllMovies | Supprimer tous les films       | -                              |

### Gestion des erreurs

Chaque méthode du contrôleur :
- Utilise des blocs try/catch pour gérer les exceptions
- Renvoie des codes HTTP appropriés (200, 201, 400, 404, 500)
- Journalise les erreurs dans la console
- Retourne des messages d'erreur informatifs

## Routes API

### Routes des films

| Méthode | Endpoint        | Contrôleur           | Description               |
|---------|-----------------|----------------------|---------------------------|
| GET     | /api/movies     | getAllMovies         | Liste tous les films      |
| POST    | /api/movies     | createMovie          | Crée un nouveau film      |
| GET     | /api/movies/:id | getMovieById         | Récupère un film par ID   |
| PUT     | /api/movies/:id | updateMovie          | Met à jour un film        |
| DELETE  | /api/movies/:id | deleteMovie          | Supprime un film          |
| DELETE  | /api/movies     | deleteAllMovies      | Supprime tous les films   |

## Configuration de la base de données

La configuration de Sequelize est centralisée dans `src/config/database.ts` et utilise les variables d'environnement :

```typescript
const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASSWORD!,
  {
    host: process.env.DB_HOST!,
    dialect: 'postgres',
    // Configuration additionnelle...
  }
);
```

## Initialisation de l'application

Le processus de démarrage suit ces étapes :
1. Chargement des variables d'environnement
2. Configuration de l'application Express
3. Connexion à la base de données
4. Synchronisation des modèles avec la base de données
5. Démarrage du serveur HTTP

```typescript
const initDb = async () => {
  await sequelize.authenticate();
  await sequelize.sync();
  app.listen(PORT);
};
```

## Validation des données

La validation est implémentée à plusieurs niveaux :
1. **Niveau contrôleur** : Vérification des champs requis (par ex. title)
2. **Niveau modèle** : Contraintes de base de données (non null, types)
3. **Niveau Express** : Parsing du corps de la requête

## Bonnes pratiques implémentées

1. **Conventions de nommage cohérentes** pour les fichiers et les fonctions
2. **Typage strict** avec TypeScript
3. **Structure modulaire** facilitant la maintenance
4. **Gestion centralisée de la configuration** via dotenv
5. **Messages d'erreur clairs et informatifs**

## Exemples d'utilisation des API

### Créer un film

```http
POST /api/movies
Content-Type: application/json

{
  "title": "Inception",
  "description": "Un film de science-fiction sur les rêves"
}
```

Réponse :
```json
{
  "id": 1,
  "title": "Inception",
  "description": "Un film de science-fiction sur les rêves",
  "createdAt": "2023-05-20T14:00:00.000Z",
  "updatedAt": "2023-05-20T14:00:00.000Z"
}
```

### Rechercher des films par titre

```http
GET /api/movies?title=matrix
```

Réponse :
```json
[
  {
    "id": 2,
    "title": "The Matrix",
    "description": "Un film de science-fiction avec Keanu Reeves",
    "createdAt": "2023-05-20T14:10:00.000Z",
    "updatedAt": "2023-05-20T14:10:00.000Z"
  }
]
```
