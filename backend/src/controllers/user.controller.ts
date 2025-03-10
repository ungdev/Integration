import * as user_service from '../services/user.service'
import { Ok, Error } from '../utils/responses';
import { Request, Response } from "express";

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