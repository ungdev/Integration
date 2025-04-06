import { Request, Response } from 'express';
import * as auth_service from '../services/auth.service';
import * as user_service from '../services/user.service';
import bigInt from 'big-integer';
import { Error, Ok, Unauthorized } from '../utils/responses';
import { decodeToken } from '../utils/token';

// Fonction de connexion
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const token = await auth_service.loginUser(email, password);
        Ok(res, { data:{token}, msg: 'Connexion réussie' });
  } catch (err) {
        Error(res, { msg: err.message });
  }
};

// Fonction d'inscription
export const register = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const newUser = await auth_service.registerUser(firstName, lastName, email, password);
        Ok(res, {
      msg: 'Utilisateur inscrit avec succès',
      data: newUser,
    });
  } catch (err) {
      Error(res, { msg: err.message });
  }
};


export const handlecasticket = async (req: Request, res: Response) => {
    try {
        const ticket = req.query.ticket as string;

        if (ticket) {
            const CASuser = await auth_service.validateCASTicket(ticket);

            if (CASuser && CASuser.email && CASuser.givenName && CASuser.sn) {
                // Assurez-vous que user.email est un string
                let user = await user_service.getUserByEmail(CASuser.email.toLowerCase());
                if(!user){
                    const password = bigInt.randBetween(bigInt(2).pow(255),bigInt(2).pow(256).minus(1)).toString()
                    await user_service.createUser(CASuser.givenName, CASuser.sn, CASuser.email, "Student", password)
                    user = await user_service.getUserByEmail(CASuser.email.toLowerCase())
                }

                const id = user?.id
                const email = CASuser.email
                if (!id) res.status(400).json({ message: "Pas d'id" });
                    
                await user_service.updateUserStudent( CASuser.givenName, CASuser.sn, CASuser.email);
                
                const token = auth_service.generateToken(user);
                

                Ok(res, { data: { token } })
            
            
            } else {
                Unauthorized(res, { msg: 'Unauthorized: Invalid user email' });
            }
        } else {
            Unauthorized(res, { msg: 'Unauthorized: No ticket provided' });
        }
    } catch (error) {
         Unauthorized(res, { msg: 'Unauthorized: Invalid token' });
    }
}


export const isTokenValid = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
       Unauthorized(res, {
        msg: "Unauthorized: Missing or malformed token",
        data: false,
      });
      return;
    }
    
    const token = authHeader.split(" ")[1];

    // Décoder et valider le token
    const decodedToken = decodeToken(token);
    if (!decodedToken) {
       Unauthorized(res, {
        msg: "Unauthorized: Token has expired or is invalid",
        data: false,
      });
      return
    }


    // Vérifier que l'email est bien présent dans le token
    if (!decodedToken.userEmail) {
       Unauthorized(res, {
        msg: "Unauthorized: Invalid token content",
        data: false,
      });
      return
    }

    // Répondre une seule fois
     Ok(res, {data: true });
     return
  } catch (error) {
     Error(res, { msg: "Unauthorized: Token validation failed" });
     return
  }
};