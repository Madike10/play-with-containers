#!/bin/bash
set -e

# Ce script s'exécutera avec l'utilisateur postgres dans le conteneur
# $POSTGRES_DB, $POSTGRES_USER et $POSTGRES_PASSWORD sont automatiquement disponibles

echo "Création de la table orders..."
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        numbers_of_items INTEGER NOT NULL,
        total_amount INTEGER NOT NULL
    );

EOSQL
    # -- Ajouter des données initiales si nécessaire
    # INSERT INTO orders (user_id, numbers_of_items, total_amount) VALUES
    #     ('user123', 5, 1000)
    # ON CONFLICT DO NOTHING;

    # INSERT INTO orders (user_id, numbers_of_items, total_amount) VALUES
    #     ('user456', 2, 500)
    # ON CONFLICT DO NOTHING;

echo "Table orders créée avec succès."

echo "Initialisation de la base de données terminée."