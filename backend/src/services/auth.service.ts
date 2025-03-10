import { db } from '../database/db'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JSDOM } from 'jsdom';
import { cas_validate_url, jwtSecret, service_url } from '../utils/secret';
import * as userservice from './user.service';
import { User, userSchema } from '../schemas/Basic/user.schema';
import { permission } from 'process';


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
export const generateToken = (user : User) => {
  return jwt.sign(
    { userId: user.id, userPermission: user.permission, userEmail: user.email },
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
    const token = generateToken(user);
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
    const result = await db.insert(userSchema).values({
      first_name: firstName, 
      last_name: lastName, 
      email: email,
      password: hashedPassword,
      permission: 'Nouveau',
    });
  
    // Retourner le nouvel utilisateur
    const newUser = result[0];  // `result` est un tableau avec l'utilisateur inséré
    return newUser;
  };


export const validateCASTicket = async (ticket : string) => {
    try {
        const validateUrl = `${cas_validate_url}?service=${encodeURIComponent(service_url)}&ticket=${ticket}`;
        const response = await fetch(validateUrl);
        if (response.ok) {
            const text = await response.text();
            console.log("====================validateCASTicket")
            console.log(text)
            console.log("validateCASTicket====================")
            const isValid = text.includes("authenticationSuccess");
            if (isValid) {
              // User is authenticated
                return await parseUsernameFromCASResponse(text);
            } else {
              console.error("CAS ticket validation failed");
            }
          } else {
            console.error("Failed to validate CAS ticket");
          }
        }catch (error) {
            throw new Error("Failed to fetch CAS. Please try again later.");
    }
}

export const parseUsernameFromCASResponse = async(response: string) => {
    const dom = new JSDOM(response, { contentType: "application/xml" });
    const document = dom.window.document;
    const authSuccessNode = document.getElementsByTagName("cas:authenticationSuccess")[0];
    if (authSuccessNode) {
      const attributesNode = authSuccessNode.getElementsByTagName("cas:attributes")[0];
      if (attributesNode) {
        return {
          uid: attributesNode.getElementsByTagName("cas:uid")[0]?.textContent,
          email: attributesNode.getElementsByTagName("cas:mail")[0]?.textContent,
          sn: attributesNode.getElementsByTagName("cas:sn")[0]?.textContent,
          givenName: attributesNode.getElementsByTagName("cas:givenName")[0]?.textContent,
        };
        }
    }
}
