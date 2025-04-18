import app from './app';
import dotenv from 'dotenv';
import sequelize from './config/database';

// Chargement des variables d'environnement
dotenv.config({
  path: '../../.env'
});
// Validation des variables d'environnement
const PORT = process.env.INVENTORY_PORT;

if (!PORT) {
  console.error('❌ Erreur : La variable d\'environnement PORT est manquante');
  process.exit(1);
}

// Sync database
const initDb = async () => {
  try {
    console.group('🗄️ Synchronizing database...');
    await sequelize.authenticate();
    console.log('✅ Connection has been established successfully.');

    await sequelize.sync();
    console.log('✅ Database synchronized successfully');

    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }finally {
    console.groupEnd();
  }
};

initDb().then(() => console.log('✅ Database synchronized successfully'));
