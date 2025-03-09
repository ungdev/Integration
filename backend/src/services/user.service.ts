import bcrypt from 'bcryptjs';
import db from '../database/db';  // Import de la connexion PostgreSQL

// Fonction pour récupérer un utilisateur par email
export const getUserByEmail = async (email: string) => {
  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  } catch (err) {
    console.error('Erreur lors de la récupération de l\'utilisateur par email:', err);
    throw new Error('Erreur de base de données');
  }
};

// Fonction pour enregistrer un nouvel utilisateur
export const createUser = async (firstName: string, lastName: string, email: string, password: string) => {
  try {
    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insérer un nouvel utilisateur dans la base de données
    const newUser = await db.query(
      'INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *',
      [firstName, lastName, email, hashedPassword]
    );

    return newUser.rows[0];
  } catch (err) {
    console.error('Erreur lors de la création de l\'utilisateur:', err);
    throw new Error('Erreur de base de données');
  }
};

// Fonction pour comparer les mots de passe (utilisée lors de la connexion)
export const comparePassword = async (enteredPassword: string, storedPassword: string) => {
  return await bcrypt.compare(enteredPassword, storedPassword);
};

export const updateUserStudent = async(firstName: string, lastName: string, email: string) =>{
    try {
        const result = await db.query(
            'UPDATE users SET first_name = $1, last_name = $2 WHERE email = $3 RETURNING *',
            [firstName, lastName, email]
        );
        return result.rows[0];
      } catch (err) {
        console.error('Erreur lors de la récupération et de l\'update de l\'utilisateur par email:', err);
        throw new Error('Erreur de base de données');
      }
}
