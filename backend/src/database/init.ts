import dotenv from 'dotenv';
import db from './db';

dotenv.config();

// Fonction pour créer la base de données si elle n'existe pas
const createDatabase = async () => {
  const client = await db.connect();
  try {
    console.log(`🔍 Vérification de la base ${process.env.POSTGRES_DB}...`);

    const res = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`, [process.env.POSTGRES_DB]
    );

    if (res.rowCount === 0) {
      console.log(`🚀 Création de la base ${process.env.POSTGRES_DB}...`);
      await client.query(`CREATE DATABASE ${process.env.POSTGRES_DB}`);
      console.log('✅ Base créée avec succès.');
    } else {
      console.log('✅ La base existe déjà.');
    }
  } catch (err) {
    console.error('❌ Erreur création base:', err);
  } finally {
    client.release();
  }
};

// Fonction pour créer les tables nécessaires
const createTables = async () => {
  const client = await db.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Table `users` créée.');
  } catch (err) {
    console.error('❌ Erreur création tables:', err);
  } finally {
    client.release();
  }
};

// Fonction d'initialisation
export const initDB = async () => {
  try {
    await createDatabase();  // Créer la base si elle n'existe pas
    await createTables();    // Créer les tables
  } catch (err) {
    console.error('❌ Erreur init DB:', err);
  }
};

// Appel de la fonction d'initialisation
initDB();
