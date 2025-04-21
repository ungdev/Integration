import * as user_service from '../services/user.service'
import * as SIEP_Utils from '../utils/siep'
import { Ok, Error } from '../utils/responses';
import { Request, Response } from "express";
import bcrypt from 'bcryptjs';
import * as randomstring from 'randomstring';
import * as auth_service from "../services/auth.service"

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await user_service.getUsers();
        Ok(res,{ data: users });
        return;
      } catch (error) {
        console.error(error);
        Error(res,{ msg: "Erreur interne lors de la récupération des utilisateurs avec leurs rôles." });
        return;
      }
};

export const getUsersByPermission = async (req: Request, res: Response) => {

  const {permission} = req.params
  try {
      const users = await user_service.getUsersbyPermission(permission);
      Ok(res,{ data: users });
      return;
    } catch (error) {
      console.error(error);
      Error(res,{ msg: "Erreur interne lors de la récupération des utilisateurs avec leurs rôles." });
      return;
    }
};


export const syncNewstudent = async (req: Request, res: Response) => {

  const {date} = req.body;

  try {
      
      const token = await SIEP_Utils.getTokenUTTAPI();
      const newStudents = await SIEP_Utils.getNewStudentsFromUTTAPI(token, date);
      //const newStudentfiltered = newStudents.filter((student : any) => !noSyncEmails.includes(student.email));

      newStudents.forEach( async (element: any) => {

          let userInDb = await user_service.getUserByEmail(element.email.toLowerCase());
          if(!userInDb){

              let tmpPassword =  await bcrypt.hash(randomstring.generate(48), 10);
              const newUser = await user_service.createUser(
                element.prenom, 
                element.nom, 
                element.email,
                element.Majeur ,
                "Nouveau", 
                element.diplome === "MA" ? "Master" : element.specialite, 
                tmpPassword);

                await auth_service.createRegistrationToken(newUser.id)
          }
        })

      Ok(res, { msg:"All NewStudent created and synced" })

      
  } catch (error) {
      Error(res, { error })
  }
}

export const getCurrentUser = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  try {
    const user = await user_service.getUserById(userId);
    Ok(res, { data : user });
  } catch (err) {
    Error(res, { msg: "Erreur lors de la mise à jour du profil." });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { branch, contact } = req.body;

  try {
    const result = await user_service.updateUserInfoByUserId(userId, branch, contact);
    Ok(res, { msg: "Profil mis à jour", data : result });
  } catch (err) {
    Error(res, { msg: "Erreur lors de la mise à jour du profil." });
  }
};


export const adminUpdateUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const updates = req.body;


  try {
    const result = await user_service.updateUserByAdmin(parseInt(userId), updates);
    Ok(res, { msg: "Utilisateur mis à jour", data : result });
  } catch (err) {
    Error(res, { msg: "Erreur lors de la mise à jour de l'utilisateur." });
  }
};

export const adminDeleteUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const result = await user_service.deleteUserById(parseInt(userId));
    Ok(res, { msg: "Utilisateur supprimé", data :result });
  } catch (err) {
    Error(res, { msg: "Erreur lors de la suppression de l'utilisateur." });
  }
};



