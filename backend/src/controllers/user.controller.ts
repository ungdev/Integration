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
  try {
      
      const token = await SIEP_Utils.getTokenUTTAPI();
      const newStudents = await SIEP_Utils.getNewStudentsFromUTTAPI(token);
      //const newStudentfiltered = newStudents.filter((student : any) => !noSyncEmails.includes(student.email));

      newStudents.forEach( async (element: any) => {

          let userInDb = await user_service.getUserByEmail(element.email.toLowerCase());
          if(!userInDb){

              let tmpPassword =  await bcrypt.hash(randomstring.generate(48), 10);
              const newUser = await user_service.createUser(
                element.prenom, 
                element.nom, 
                element.email,
                "" ,
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