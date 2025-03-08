import db from '../database/db'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { jwtSecret } from '../utils/secret';
import * as userservice from './user.service';


// Fonction pour hacher le mot de passe
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Fonction pour vérifier le mot de passe
export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

// Fonction pour générer un JWT
export const generateToken = (userId: number, role: string): string => {
  return jwt.sign(
    { userId, role },
    jwtSecret,
    { expiresIn: '1h' } // Le token expire après 1 heure
  );
};

// Fonction de connexion
export const loginUser = async (email: string, password: string) => {
  // Chercher l'utilisateur par email
  const user = await userservice.getUserByEmail(email);
  if (!user) {
    throw new Error('Utilisateur non trouvé');
  }

  // Vérifier le mot de passe
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new Error('Mot de passe incorrect');
  }

  // Générer un token JWT
  const token = generateToken(user.id, user.role);
  return token;
};

// Fonction d'inscription
export const registerUser = async (firstName: string, lastName: string, email: string, password: string) => {
  // Vérifier si l'email est déjà pris
  const existingUser = await userservice.getUserByEmail(email);
  if (existingUser) {
    throw new Error('L\'email est déjà pris');
  }

  // Hacher le mot de passe avant de l'enregistrer
  const hashedPassword = await hashPassword(password);

  // Créer un nouvel utilisateur dans la base de données
  const result = await db.query(
    'INSERT INTO users (first_name, last_name, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [firstName, lastName, email, hashedPassword, 'user'] // Par défaut, le rôle est 'user'
  );

  const newUser = result.rows[0];
  return newUser;
};
