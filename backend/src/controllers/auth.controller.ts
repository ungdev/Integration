import { Request, Response } from 'express';
import { loginUser, registerUser, validateCASTicket } from '../services/auth.service';
import * as user_service from '../services/user.service';
import { jwtSecret } from '../utils/secret';
import { sign, verify } from 'jsonwebtoken'
import { randomInt } from 'crypto';
import bigInt from 'big-integer';

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


export const handlecasticket = async (req: Request, res: Response) => {
    try {
        const ticket = req.query.ticket as string;

        if (ticket) {
            const CASuser = await validateCASTicket(ticket);

            if (CASuser && CASuser.email && CASuser.givenName && CASuser.sn) {
                // Assurez-vous que user.email est un string
                let user = await user_service.getUserByEmail(CASuser.email.toLowerCase());
                if(!user){
                    const password = bigInt.randBetween(bigInt(2).pow(255),bigInt(2).pow(256).minus(1)).toString()
                    await user_service.createUser(CASuser.givenName, CASuser.sn, CASuser.email, password)
                    user = await user_service.getUserByEmail(CASuser.email.toLowerCase())
                }

                const id = user?.id
                const email = CASuser.email
                if (!id) res.status(400).json({ message: "Pas d'id" });
                    
                await user_service.updateUserStudent( CASuser.givenName, CASuser.sn, CASuser.email);
                
                const token =  sign({ id, email }, jwtSecret, { expiresIn: '1h' })

                res.status(200).json({ data: { token } })
            
            
            } else {
                res.status(501).json({ msg: 'Unauthorized: Invalid user email' });
            }
        } else {
            res.status(504).json({ msg: 'Unauthorized: No ticket provided' });
        }
    } catch (error) {
         res.status(504).json({ msg: 'Unauthorized: Invalid token' });
    }
}