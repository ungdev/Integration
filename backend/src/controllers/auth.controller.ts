import { Request, Response } from 'express';
import { loginUser, registerUser } from '../services/auth.service';

// Fonction de connexion
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const token = await loginUser(email, password);
        res.json({ message: 'Connexion réussie', token });
  } catch (err) {
        res.status(400).json({ message: err.message });
  }
};

// Fonction d'inscription
export const register = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const newUser = await registerUser(firstName, lastName, email, password);
        res.status(201).json({
      message: 'Utilisateur inscrit avec succès',
      user: newUser,
    });
  } catch (err) {
        res.status(400).json({ message: err.message });
  }
};
