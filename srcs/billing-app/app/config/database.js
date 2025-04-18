import pkg from 'pg';
const { Pool } = pkg;

// Configuration de la base de données
const pool = new Pool({
    
    user: process.env.BILLING_DB_USER,
    host: process.env.BILLING_DB_HOST,
    database: process.env.BILLING_DB_NAME,
    password: process.env.BILLING_DB_PASSWORD,
    port: process.env.BILLING_DB_PORT
});

// Exports des fonctionnalités de la base de données
export default pool;
