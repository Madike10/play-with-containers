// src/config/database.ts
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Chargement des variables d'environnement
dotenv.config({
    path: '../../.env'
});
console.log('✅ Variables d\'environnement chargées');
console.log(process.env);
// Initialisation de la base de données
const sequelize = new Sequelize(
    process.env.INVENTORY_DB_NAME!,
    process.env.INVENTORY_DB_USER!,
    process.env.INVENTORY_DB_PASSWORD!,
    {
        host: process.env.INVENTORY_DB_HOST!,
        dialect: 'postgres',
        logging: console.log,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

export default sequelize;
