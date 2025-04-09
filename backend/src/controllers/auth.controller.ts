import { Request, Response } from 'express';
import * as auth_service from '../services/auth.service';
import * as user_service from '../services/user.service';
import * as email_service from '../services/email.service';
import bigInt from 'big-integer';
import { Error, Ok, Unauthorized } from '../utils/responses';
import { decodeToken } from '../utils/token';
import { sign, verify } from 'jsonwebtoken';
import { jwtSecret, service_url } from '../utils/secret';
import { EmailOptions } from './email.controller';
import * as template from '../utils/emailtemplates';
import bcrypt from 'bcryptjs';

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
                    await user_service.createUser(CASuser.givenName, CASuser.sn, CASuser.email, true, "Student", " " , password)
                    user = await user_service.getUserByEmail(CASuser.email.toLowerCase())
                }

                const id = user?.id

                if (!id){ Error(res,{ msg: "Pas d'id" }); return;}
                    
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


export const completeRegistration = async(req : Request, res : Response) => {

  const { token, password } = req.body;

  try{

    auth_service.completeRegistration(token, password)
    Ok(res, {msg: "Inscription complétée avec succès.", data: true})

  }catch(error
  ){
    Error(res, {msg : error.data.message})
  }
}

export const requestPasswordUser = async (req: Request, res: Response) => {

  const {user_email} = req.body
  const user = await user_service.getUserByEmail(user_email);

  if (!user) {
    Error(res, { msg: 'User not found' });
    return
  }

  // Générer un token JWT
  const token = sign({ userId: user.id }, jwtSecret, { expiresIn: '1h' });

  // Créer le lien de réinitialisation
  const resetLink = `${service_url}ResetPassword?token=${token}`;

  
  // Générer le contenu HTML du mail
  const htmlEmail = template.compileTemplate({ resetLink: resetLink}, template.templateResetPassword);
  
  if (!htmlEmail) {
    Error(res, { msg: "Nom de template invalide" });
    return;
  }
  
  // Préparer les options d'email
  const emailOptions: EmailOptions = {
    from: "integration@utt.fr",
    to: [user_email],
    cc: [],
    bcc: [],
    subject : '[INTEGRATION UTT] - Réinitialisation de votre mot de passe',
    html: htmlEmail,
  };

  try{
      // Envoyer l'e-mail
      await email_service.sendEmail(emailOptions);
      Ok(res, {msg:'Email for password reste sent !'})
      return
  }catch(error){
      Error(res, { msg: 'Error when reseting password' });
      return
  }

}

export const resetPasswordUser = async (req: Request, res: Response) => {
      const {token, password} = req.body;

    
      try {
          // Vérifiez et décodez le token
          const decoded: any = verify(token, jwtSecret);

          // Trouvez l'utilisateur par ID
          const user = await user_service.getUserById(decoded.userId);
          if (!user) {
              Error(res, {msg :'Utilisateur non trouvé'});
              return
          }
  
          // Hash du nouveau mot de passe
          const hashedPassword = await bcrypt.hash(password, 10);
  
          // Mettez à jour le mot de passe de l'utilisateur
          await user_service.updateUserPassword(Number(user.userId), hashedPassword);
          Ok(res, {msg: 'Mot de passe réinitialisé avec succès'});
          return
      } catch (error) {
        console.log(error);
          Error(res, { msg: 'Token invalid or expire' });
          return
      }
}